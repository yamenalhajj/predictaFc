"""
src/data_loader.py
Downloads and caches the Martj42 international football results dataset.
"""

import os
import requests
import pandas as pd
import logging

logger = logging.getLogger(__name__)

# ── Paths ─────────────────────────────────────────────────────────────────────
_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(_ROOT, "data")
RESULTS_PATH = os.path.join(DATA_DIR, "results.csv")

RESULTS_URL = (
    "https://raw.githubusercontent.com/martj42/international_results"
    "/master/results.csv"
)

# ── Team-name normalisation ───────────────────────────────────────────────────
# Exclude multi-sport events that use U23/age-restricted squads, not full senior national teams
_EXCLUDE_TOURNAMENTS = {
    "Asian Games",
    "Southeast Asian Games",
    "South Pacific Games",
    "Island Games",
    "Muratti Vase",
}

_NAME_MAP = {
    "Iran":                 "IR Iran",
    "Ivory Coast":          "Côte d'Ivoire",
    "Curacao":              "Curaçao",
    "Korea Republic":       "South Korea",
    "Republic of Ireland":  "Ireland",
    "USA":                  "United States",
    "China":                "China PR",
    "Türkiye":              "Turkey",
    "North Macedonia":      "North Macedonia",
}


def _normalise(name: str) -> str:
    return _NAME_MAP.get(name, name)


# ── Public API ────────────────────────────────────────────────────────────────

def download_data(force: bool = False, progress_callback=None) -> str:
    """
    Download results.csv from GitHub and cache it locally.
    Returns the local path to the CSV.
    """
    os.makedirs(DATA_DIR, exist_ok=True)
    if os.path.exists(RESULTS_PATH) and not force:
        logger.info("Data already cached at %s", RESULTS_PATH)
        return RESULTS_PATH

    logger.info("Downloading historical match data …")
    if progress_callback:
        progress_callback("📥 Downloading historical FIFA match data …")

    response = requests.get(RESULTS_URL, timeout=120, stream=True)
    response.raise_for_status()

    with open(RESULTS_PATH, "wb") as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)

    logger.info("Saved %s bytes to %s", os.path.getsize(RESULTS_PATH), RESULTS_PATH)
    return RESULTS_PATH


def load_data(min_year: int = 1990) -> pd.DataFrame:
    """
    Load and clean the historical match dataset.

    Returns a DataFrame with columns:
        date, home_team, away_team, home_score, away_score,
        tournament, city, country, neutral, result
    where result: 2 = home win, 1 = draw, 0 = away win
    """
    if not os.path.exists(RESULTS_PATH):
        download_data()

    df = pd.read_csv(RESULTS_PATH, parse_dates=["date"])

    # Normalise team names
    df["home_team"] = df["home_team"].apply(_normalise)
    df["away_team"] = df["away_team"].apply(_normalise)

    # Remove non-senior international competitions (age-restricted multi-sport events)
    df = df[~df["tournament"].isin(_EXCLUDE_TOURNAMENTS)]

    # Filter to modern era
    if min_year > 0:
        df = df[df["date"].dt.year >= min_year].copy()
    else:
        df = df.copy()

    # Ensure numeric scores
    df["home_score"] = pd.to_numeric(df["home_score"], errors="coerce")
    df["away_score"] = pd.to_numeric(df["away_score"], errors="coerce")
    df = df.dropna(subset=["home_score", "away_score"])

    # Result label: 2 = home win, 1 = draw, 0 = away win
    def _result(row):
        if row["home_score"] > row["away_score"]:
            return 2
        elif row["home_score"] == row["away_score"]:
            return 1
        else:
            return 0

    df["result"] = df.apply(_result, axis=1)

    # Bool neutral
    if df["neutral"].dtype == object:
        df["neutral"] = df["neutral"].str.upper().map({"TRUE": True, "FALSE": False}).fillna(False)
    else:
        df["neutral"] = df["neutral"].astype(bool)

    df = df.sort_values("date").reset_index(drop=True)
    return df


def data_exists() -> bool:
    return os.path.exists(RESULTS_PATH)


def get_data_stats(df: pd.DataFrame) -> dict:
    """Return basic stats about the loaded dataset."""
    return {
        "total_matches":  len(df),
        "date_range":     f"{df['date'].min().year} – {df['date'].max().year}",
        "unique_teams":   df["home_team"].nunique(),
        "tournaments":    df["tournament"].nunique(),
        "home_win_pct":   round((df["result"] == 2).mean() * 100, 1),
        "draw_pct":       round((df["result"] == 1).mean() * 100, 1),
        "away_win_pct":   round((df["result"] == 0).mean() * 100, 1),
    }
