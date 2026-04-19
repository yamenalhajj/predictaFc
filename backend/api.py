"""
backend/api.py — WC 2026 Full Predictions API
Run: python api.py
"""
import os, sys, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from flask import Flask, request, Response
from flask_cors import CORS

from src.data_loader import load_data
from src.feature_engineering import build_prediction_features
from src.model import load_model, predict_matches, knockout_winner
from src.fixtures import GROUPS, GROUP_MATCHES, FIFA_RANKINGS, next_round_matches

app = Flask(__name__)
CORS(app)

# ── Boot ─────────────────────────────────────────────────────────────────────
print("Loading data …")
_df = load_data(min_year=1990)
print(f"  {len(_df):,} matches loaded")

print("Loading model …")
_model, _metrics = load_model()
print(f"  Accuracy: {_metrics.get('accuracy')}%")

VALID_TEAMS = set(FIFA_RANKINGS.keys())


def _safe(v):
    if hasattr(v, 'item'):   # numpy scalar
        return v.item()
    return v


def _pred_to_dict(p, home, away):
    w = knockout_winner(p, home, away)
    return {
        "homeScore":   int(_safe(p["pred_home_goals"])),
        "awayScore":   int(_safe(p["pred_away_goals"])),
        "probHomeWin": round(float(_safe(p["prob_home_win"])) * 100, 1),
        "probDraw":    round(float(_safe(p["prob_draw"]))     * 100, 1),
        "probAwayWin": round(float(_safe(p["prob_away_win"])) * 100, 1),
        "confidence":  str(p["confidence"]),
        "winner":      w,
    }


def _run_round(matchups, stage_key):
    X = build_prediction_features(_df, matchups)
    preds = predict_matches(_model, X)
    winners, results = [], []
    for m, p in zip(matchups, preds):
        d = _pred_to_dict(p, m["home_team"], m["away_team"])
        winners.append(d["winner"])
        results.append({"stage": stage_key, "homeTeam": m["home_team"],
                        "awayTeam": m["away_team"], **d})
    return winners, results


# ── Pre-compute all predictions at startup ────────────────────────────────────
print("Computing group stage predictions …")
X_group = build_prediction_features(_df, GROUP_MATCHES)
group_preds = predict_matches(_model, X_group)

standings_raw = {
    g: {t: {"W": 0, "D": 0, "L": 0, "GF": 0, "GA": 0, "Pts": 0} for t in teams}
    for g, teams in GROUPS.items()
}
_group_matches_out = []
for idx, (m, p) in enumerate(zip(GROUP_MATCHES, group_preds)):
    home, away = m["home_team"], m["away_team"]
    g = m["group"]
    hg = int(_safe(p["pred_home_goals"]))
    ag = int(_safe(p["pred_away_goals"]))
    cls = int(_safe(p["predicted_class"]))

    if cls == 2:
        standings_raw[g][home]["W"] += 1; standings_raw[g][away]["L"] += 1
        standings_raw[g][home]["Pts"] += 3
    elif cls == 0:
        standings_raw[g][away]["W"] += 1; standings_raw[g][home]["L"] += 1
        standings_raw[g][away]["Pts"] += 3
    else:
        standings_raw[g][home]["D"] += 1; standings_raw[g][away]["D"] += 1
        standings_raw[g][home]["Pts"] += 1; standings_raw[g][away]["Pts"] += 1

    standings_raw[g][home]["GF"] += hg; standings_raw[g][home]["GA"] += ag
    standings_raw[g][away]["GF"] += ag; standings_raw[g][away]["GA"] += hg

    _group_matches_out.append({
        "id": f"{g}{idx+1}", "group": g, "matchday": int(m["matchday"]),
        "homeTeam": home, "awayTeam": away,
        "homeScore": hg, "awayScore": ag,
        "probHomeWin": round(float(_safe(p["prob_home_win"])) * 100, 1),
        "probDraw":    round(float(_safe(p["prob_draw"]))     * 100, 1),
        "probAwayWin": round(float(_safe(p["prob_away_win"])) * 100, 1),
        "confidence": str(p["confidence"]),
        "stage": "group", "date": str(m.get("date", "")),
        "winner": home if hg > ag else (away if ag > hg else None),
    })

_standings_out = {}
for g, teams in standings_raw.items():
    ranked = sorted(teams.items(),
                    key=lambda x: (-x[1]["Pts"], -(x[1]["GF"]-x[1]["GA"]), -x[1]["GF"]))
    _standings_out[g] = [
        {"team": t, "W": s["W"], "D": s["D"], "L": s["L"],
         "GF": s["GF"], "GA": s["GA"], "GD": s["GF"]-s["GA"], "Pts": s["Pts"]}
        for t, s in ranked
    ]

print("Computing knockout bracket …")
r32_matchups = []
for g1, g2 in [("A","B"),("C","D"),("E","F"),("G","H"),("I","J"),("K","L")]:
    r32_matchups += [
        {"home_team": _standings_out[g1][0]["team"], "away_team": _standings_out[g2][1]["team"], "neutral": True},
        {"home_team": _standings_out[g2][0]["team"], "away_team": _standings_out[g1][1]["team"], "neutral": True},
    ]
thirds = sorted(
    [(_standings_out[g][2]["team"], _standings_out[g][2]["Pts"],
      _standings_out[g][2]["GD"], _standings_out[g][2]["GF"])
     for g in _standings_out if len(_standings_out[g]) >= 3],
    key=lambda x: (-x[1], -x[2], -x[3])
)
for i in range(0, 8, 2):
    r32_matchups.append({"home_team": thirds[i][0], "away_team": thirds[i+1][0], "neutral": True})

r32w, r32r = _run_round(r32_matchups, "r32")
r16w, r16r = _run_round(next_round_matches(r32w, "R16"), "r16")
qfw, qfr   = _run_round(next_round_matches(r16w, "QF"),  "qf")
qf_losers  = [r["awayTeam"] if r["winner"]==r["homeTeam"] else r["homeTeam"] for r in qfr]
sfw, sfr   = _run_round(next_round_matches(qfw, "SF"),   "sf")
sf_losers  = [r["awayTeam"] if r["winner"]==r["homeTeam"] else r["homeTeam"] for r in sfr]
_, thirdr  = _run_round([{"home_team": sf_losers[0], "away_team": sf_losers[1], "neutral": True}], "3rd")
fw, finalr = _run_round([{"home_team": sfw[0], "away_team": sfw[1], "neutral": True}], "final")

_knockout_matches_out = r32r + r16r + qfr + sfr + thirdr + finalr
for i, m in enumerate(_knockout_matches_out):
    m["id"] = f"ko{i+1}"

_champion = fw[0]

# Serialize to JSON strings once
_group_json    = json.dumps({"groupMatches": _group_matches_out, "standings": _standings_out})
_knockout_json = json.dumps({"knockoutMatches": _knockout_matches_out, "champion": _champion})

print(f"  Champion: {_champion}")
print("API ready on :5050")


def _json_resp(body: str, status=200):
    return Response(body, status=status, mimetype="application/json",
                    headers={"Access-Control-Allow-Origin": "*"})


# ── Routes ────────────────────────────────────────────────────────────────────

@app.route("/group_matches", methods=["GET"])
def group_matches():
    return _json_resp(_group_json)


@app.route("/knockout", methods=["GET"])
def knockout():
    return _json_resp(_knockout_json)


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json(force=True)
        home = str(data.get("home_team", "")).strip()
        away = str(data.get("away_team", "")).strip()
        if not home or not away:
            return _json_resp(json.dumps({"error": "home_team and away_team required"}), 400)
        if home == away:
            return _json_resp(json.dumps({"error": "Teams must be different"}), 400)
        if home not in VALID_TEAMS:
            return _json_resp(json.dumps({"error": f"Unknown: {home}"}), 400)
        if away not in VALID_TEAMS:
            return _json_resp(json.dumps({"error": f"Unknown: {away}"}), 400)
        X = build_prediction_features(_df, [{"home_team": home, "away_team": away, "neutral": True}])
        p = predict_matches(_model, X)[0]
        d = _pred_to_dict(p, home, away)
        return _json_resp(json.dumps({"homeTeam": home, "awayTeam": away, **d}))
    except Exception as e:
        return _json_resp(json.dumps({"error": str(e)}), 500)


@app.route("/health", methods=["GET"])
def health():
    return _json_resp(json.dumps({"status": "ok", "accuracy": float(_metrics.get("accuracy", 0))}))


if __name__ == "__main__":
    app.run(port=8000, debug=False)
