"""
src/feature_engineering.py

Builds ML feature vectors from historical match data.
Uses a streaming (O(n)) approach: maintains rolling team histories
as we iterate chronologically over the training set.

Features (14 total):
    home_win_rate, home_draw_rate, home_goals_scored, home_goals_conceded,
    away_win_rate, away_draw_rate, away_goals_scored, away_goals_conceded,
    home_rank_pts, away_rank_pts, rank_pts_diff,
    is_neutral,
    h2h_home_win_rate, h2h_draw_rate
"""

from __future__ import annotations

from collections import deque
from typing import Optional

import numpy as np
import pandas as pd

from .fixtures import FIFA_RANKINGS

# Default values for teams with no history
_DEFAULT_WIN_RATE   = 0.33
_DEFAULT_DRAW_RATE  = 0.28
_DEFAULT_GOALS_FOR  = 1.20
_DEFAULT_GOALS_AGST = 1.20
_DEFAULT_RANK       = 1100.0  # weak-team fallback

FEATURE_COLS = [
    "home_win_rate", "home_draw_rate",
    "home_goals_scored", "home_goals_conceded",
    "away_win_rate", "away_draw_rate",
    "away_goals_scored", "away_goals_conceded",
    "home_rank_pts", "away_rank_pts", "rank_pts_diff",
    "is_neutral",
    "h2h_home_win_rate", "h2h_draw_rate",
]


# ── Helpers ────────────────────────────────────────────────────────────────────

def _form_from_hist(hist: list) -> dict:
    """Compute form metrics from a list of recent match dicts."""
    if not hist:
        return {
            "win_rate":       _DEFAULT_WIN_RATE,
            "draw_rate":      _DEFAULT_DRAW_RATE,
            "goals_scored":   _DEFAULT_GOALS_FOR,
            "goals_conceded": _DEFAULT_GOALS_AGST,
        }
    n = len(hist)
    return {
        "win_rate":       sum(1 for h in hist if h["result"] == 2) / n,
        "draw_rate":      sum(1 for h in hist if h["result"] == 1) / n,
        "goals_scored":   np.mean([h["scored"]   for h in hist]),
        "goals_conceded": np.mean([h["conceded"]  for h in hist]),
    }


def _h2h_stats(h2h_hist: list, home_team: str) -> dict:
    """Compute H2H stats from a list of (winner_or_draw) entries."""
    if not h2h_hist:
        return {"h2h_home_win_rate": _DEFAULT_WIN_RATE,
                "h2h_draw_rate":     _DEFAULT_DRAW_RATE}
    n = len(h2h_hist)
    hw = sum(1 for h in h2h_hist if h == home_team)
    dr = sum(1 for h in h2h_hist if h == "draw")
    return {"h2h_home_win_rate": hw / n, "h2h_draw_rate": dr / n}


def _build_row(hf, af, home_rank, away_rank, is_neutral, h2h) -> dict:
    return {
        "home_win_rate":     hf["win_rate"],
        "home_draw_rate":    hf["draw_rate"],
        "home_goals_scored": hf["goals_scored"],
        "home_goals_conceded": hf["goals_conceded"],
        "away_win_rate":     af["win_rate"],
        "away_draw_rate":    af["draw_rate"],
        "away_goals_scored": af["goals_scored"],
        "away_goals_conceded": af["goals_conceded"],
        "home_rank_pts":     home_rank,
        "away_rank_pts":     away_rank,
        "rank_pts_diff":     home_rank - away_rank,
        "is_neutral":        int(is_neutral),
        "h2h_home_win_rate": h2h["h2h_home_win_rate"],
        "h2h_draw_rate":     h2h["h2h_draw_rate"],
    }


# ── Training feature builder ───────────────────────────────────────────────────

def build_training_features(df: pd.DataFrame, n: int = 5):
    """
    Build training features + labels from historical match DataFrame.

    Parameters
    ----------
    df  : clean historical DataFrame (result column: 2/1/0)
    n   : rolling window size (last N matches for form)

    Returns
    -------
    X : pd.DataFrame of shape (len(df), 14)
    y : pd.Series  of shape (len(df),)  — values 0, 1, 2
    """
    df = df.sort_values("date").reset_index(drop=True)

    team_history: dict[str, deque] = {}   # team → deque of {result, scored, conceded}
    h2h_history:  dict[tuple, list] = {}  # (t1, t2) sorted → list of winner/draw

    rows  = []
    labels = []

    for _, row in df.iterrows():
        home = row["home_team"]
        away = row["away_team"]
        result = int(row["result"])

        # ── feature snapshot BEFORE this match ──────────────────────────────
        hf = _form_from_hist(list(team_history.get(home, [])))
        af = _form_from_hist(list(team_history.get(away, [])))

        key = tuple(sorted([home, away]))
        h2h_raw = h2h_history.get(key, [])[-10:]
        h2h = _h2h_stats(h2h_raw, home)

        home_rank = FIFA_RANKINGS.get(home, _DEFAULT_RANK)
        away_rank = FIFA_RANKINGS.get(away, _DEFAULT_RANK)

        rows.append(_build_row(hf, af, home_rank, away_rank, row["neutral"], h2h))
        labels.append(result)

        # ── update histories ────────────────────────────────────────────────
        if home not in team_history:
            team_history[home] = deque(maxlen=n)
        if away not in team_history:
            team_history[away] = deque(maxlen=n)

        # home perspective: result as-is (2=win, 1=draw, 0=loss)
        team_history[home].append({
            "result":   result,
            "scored":   row["home_score"],
            "conceded": row["away_score"],
        })
        # away perspective: flip result
        away_result = 2 - result  # 2→0 loss, 1→1 draw, 0→2 win
        team_history[away].append({
            "result":   away_result,
            "scored":   row["away_score"],
            "conceded": row["home_score"],
        })

        # H2H update
        if key not in h2h_history:
            h2h_history[key] = []
        if result == 2:
            h2h_history[key].append(home)
        elif result == 0:
            h2h_history[key].append(away)
        else:
            h2h_history[key].append("draw")

    return pd.DataFrame(rows, columns=FEATURE_COLS), pd.Series(labels, name="result")


# ── Prediction feature builder ─────────────────────────────────────────────────

def build_prediction_features(
    df: pd.DataFrame,
    matches: list[dict],
    n: int = 5,
) -> pd.DataFrame:
    """
    Build prediction features for a list of upcoming matches,
    using ALL historical data in df (up to present) for rolling form.

    Parameters
    ----------
    df      : full history DataFrame
    matches : list of dicts with at least 'home_team', 'away_team', 'neutral'
    n       : rolling window size

    Returns
    -------
    X : pd.DataFrame of shape (len(matches), 14)
    """
    df = df.sort_values("date").reset_index(drop=True)

    # Build full team histories from all historical data
    team_history: dict[str, list] = {}
    h2h_history:  dict[tuple, list] = {}

    for _, row in df.iterrows():
        home    = row["home_team"]
        away    = row["away_team"]
        result  = int(row["result"])

        if home not in team_history:
            team_history[home] = []
        if away not in team_history:
            team_history[away] = []

        team_history[home].append({
            "result": result,
            "scored": row["home_score"],
            "conceded": row["away_score"],
        })
        away_result = 2 - result
        team_history[away].append({
            "result": away_result,
            "scored": row["away_score"],
            "conceded": row["home_score"],
        })

        key = tuple(sorted([home, away]))
        if key not in h2h_history:
            h2h_history[key] = []
        if result == 2:
            h2h_history[key].append(home)
        elif result == 0:
            h2h_history[key].append(away)
        else:
            h2h_history[key].append("draw")

    # Now build features for each upcoming match
    rows = []
    for m in matches:
        home = m["home_team"]
        away = m["away_team"]
        is_neutral = m.get("neutral", True)

        hf = _form_from_hist(team_history.get(home, [])[-n:])
        af = _form_from_hist(team_history.get(away, [])[-n:])

        key = tuple(sorted([home, away]))
        h2h_raw = h2h_history.get(key, [])[-10:]
        h2h = _h2h_stats(h2h_raw, home)

        home_rank = FIFA_RANKINGS.get(home, _DEFAULT_RANK)
        away_rank = FIFA_RANKINGS.get(away, _DEFAULT_RANK)

        rows.append(_build_row(hf, af, home_rank, away_rank, is_neutral, h2h))

    return pd.DataFrame(rows, columns=FEATURE_COLS)
