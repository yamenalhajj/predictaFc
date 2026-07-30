"""
src/model.py

Trains, evaluates, saves and loads the match-outcome classifier.
Supports RandomForest and GradientBoosting.
"""

from __future__ import annotations

import os
import joblib
import numpy as np
import pandas as pd

from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
)
from sklearn.preprocessing import LabelEncoder

from .feature_engineering import build_training_features, FEATURE_COLS

_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(_ROOT, "models")
MODEL_PATH = os.path.join(MODELS_DIR, "wc2026_model.pkl")

# Result label map: 0=away_win, 1=draw, 2=home_win
RESULT_LABELS  = {0: "Away Win", 1: "Draw", 2: "Home Win"}
RESULT_CLASSES = [0, 1, 2]


# ── Training ──────────────────────────────────────────────────────────────────

def train_model(
    df: pd.DataFrame,
    model_type: str = "rf",
    n_window: int = 5,
    progress_callback=None,
) -> tuple[object, dict]:
    """
    Train a multi-class classifier on all historical data.

    Parameters
    ----------
    df             : clean historical DataFrame
    model_type     : 'rf' = RandomForest | 'gbt' = GradientBoosting
    n_window       : rolling-window size for form features
    progress_callback : optional callable(str) for UI status updates

    Returns
    -------
    model          : fitted sklearn model
    metrics        : dict of evaluation metrics
    """
    if progress_callback:
        progress_callback("⚙️  Building feature matrix (this may take ~30 s) …")

    X, y = build_training_features(df, n=n_window)

    # Time-based train / test split  (train ≤ 2020, test 2021+)
    split_idx = (df["date"].dt.year <= 2020).sum()
    X_train, X_test = X.iloc[:split_idx], X.iloc[split_idx:]
    y_train, y_test = y.iloc[:split_idx], y.iloc[split_idx:]

    if progress_callback:
        progress_callback(
            f"🏋️  Training {model_type.upper()} on "
            f"{len(X_train):,} matches … validating on {len(X_test):,}"
        )

    if model_type == "rf":
        model = RandomForestClassifier(
            n_estimators=300,
            max_depth=10,
            min_samples_leaf=10,
            class_weight="balanced",
            random_state=42,
            n_jobs=-1,
        )
    else:  # gbt
        model = GradientBoostingClassifier(
            n_estimators=200,
            max_depth=5,
            learning_rate=0.05,
            subsample=0.8,
            random_state=42,
        )

    model.fit(X_train, y_train)

    if progress_callback:
        progress_callback("📊 Evaluating model …")

    y_pred = model.predict(X_test)
    metrics = _compute_metrics(model, X_train, y_train, X_test, y_test, y_pred)

    return model, metrics


def _compute_metrics(model, X_train, y_train, X_test, y_test, y_pred) -> dict:
    acc  = accuracy_score(y_test, y_pred)
    f1   = f1_score(y_test, y_pred, average="macro", zero_division=0)
    cm   = confusion_matrix(y_test, y_pred, labels=RESULT_CLASSES)
    rep  = classification_report(
        y_test, y_pred,
        labels=RESULT_CLASSES,
        target_names=["Away Win", "Draw", "Home Win"],
        output_dict=True,
        zero_division=0,
    )
    train_acc = accuracy_score(y_train, model.predict(X_train))

    # Feature importances (for RF; approximate for GBT)
    feat_imp = None
    if hasattr(model, "feature_importances_"):
        feat_imp = dict(zip(FEATURE_COLS, model.feature_importances_))

    return {
        "accuracy":       round(acc * 100, 2),
        "train_accuracy": round(train_acc * 100, 2),
        "f1_macro":       round(f1, 4),
        "confusion_matrix": cm.tolist(),
        "classification_report": rep,
        "feature_importances": feat_imp,
        "train_size": len(X_train),
        "test_size": len(X_test),
    }


# ── Save / Load ───────────────────────────────────────────────────────────────

def save_model(model: object, metrics: dict) -> str:
    os.makedirs(MODELS_DIR, exist_ok=True)
    payload = {"model": model, "metrics": metrics}
    joblib.dump(payload, MODEL_PATH)
    return MODEL_PATH


def load_model() -> tuple[object, dict] | tuple[None, None]:
    if not os.path.exists(MODEL_PATH):
        return None, None
    payload = joblib.load(MODEL_PATH)
    return payload["model"], payload["metrics"]


def model_exists() -> bool:
    return os.path.exists(MODEL_PATH)


# ── Prediction helpers ────────────────────────────────────────────────────────

def _estimate_score(row: pd.Series, predicted_class: int) -> tuple[int, int]:
    """
    Estimate a predicted scoreline using an expected-goals (xG) formula.

    home_xg = (home attack avg + away defence weakness avg) / 2 × venue factor
    away_xg = (away attack avg + home defence weakness avg) / 2

    The mode of Poisson(λ) is floor(λ), giving the single most-likely goal count.
    The score is then adjusted so it agrees with the classifier's predicted result.
    """
    h_att = float(row.get("home_goals_scored",   1.20))
    h_def = float(row.get("home_goals_conceded",  1.20))
    a_att = float(row.get("away_goals_scored",   1.20))
    a_def = float(row.get("away_goals_conceded",  1.20))
    neutral = float(row.get("is_neutral", 1))

    venue_boost = 1.0 if neutral else 1.08   # small home-advantage multiplier
    home_xg = max(0.25, (h_att + a_def) / 2 * venue_boost)
    away_xg = max(0.25, (a_att + h_def) / 2)

    pred_h = int(home_xg)   # floor = Poisson mode
    pred_a = int(away_xg)

    # Enforce consistency with the classifier result
    if predicted_class == 2:          # Home win required
        if pred_h <= pred_a:
            pred_h = pred_a + 1
    elif predicted_class == 0:        # Away win required
        if pred_a <= pred_h:
            pred_a = pred_h + 1
    else:                             # Draw required — equalise at the lower value
        goals = min(pred_h, pred_a)
        pred_h = pred_a = goals

    return int(pred_h), int(pred_a)


def predict_matches(model: object, X: pd.DataFrame) -> list[dict]:
    """
    Run predictions on a feature matrix.
    Returns a list of dicts with keys:
        predicted_class, label, prob_home_win, prob_draw, prob_away_win,
        confidence, pred_home_goals, pred_away_goals
    """
    proba = model.predict_proba(X)
    preds = model.predict(X)

    classes = list(model.classes_)
    results = []
    for i, (pred, p) in enumerate(zip(preds, proba)):
        prob_away = p[classes.index(0)] if 0 in classes else 0.0
        prob_draw = p[classes.index(1)] if 1 in classes else 0.0
        prob_home = p[classes.index(2)] if 2 in classes else 0.0

        max_prob = max(prob_home, prob_draw, prob_away)
        confidence = "High" if max_prob >= 0.55 else ("Medium" if max_prob >= 0.42 else "Low")

        row = X.iloc[i]
        pred_h, pred_a = _estimate_score(row, int(pred))

        results.append({
            "predicted_class":  int(pred),
            "label":            RESULT_LABELS[int(pred)],
            "prob_home_win":    round(prob_home, 4),
            "prob_draw":        round(prob_draw, 4),
            "prob_away_win":    round(prob_away, 4),
            "confidence":       confidence,
            "pred_home_goals":  pred_h,
            "pred_away_goals":  pred_a,
        })
    return results


def knockout_winner(pred: dict, home_team: str, away_team: str) -> str:
    """
    In knockout rounds draws go to extra time / penalties.
    Pick the side with the higher win probability.
    """
    if pred["predicted_class"] == 2:
        return home_team
    elif pred["predicted_class"] == 0:
        return away_team
    else:
        # Draw: pick side with higher probability
        if pred["prob_home_win"] >= pred["prob_away_win"]:
            return home_team
        return away_team
