"""
backend/api.py — WC 2026 Full Predictions API
Run: python api.py
"""
import os, sys, json, io
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from flask import Flask, request, Response
from flask_cors import CORS
import pandas as pd

# Optional Stripe — only imported if env vars are present
try:
    import stripe
    stripe.api_key = os.environ.get("STRIPE_SECRET_KEY", "")
    _STRIPE_OK = bool(stripe.api_key)
except ImportError:
    _STRIPE_OK = False

# Optional Supabase admin client — only used for subscription sync
try:
    from supabase import create_client as _create_supabase
    _sb = _create_supabase(
        os.environ.get("SUPABASE_URL", ""),
        os.environ.get("SUPABASE_SERVICE_KEY", ""),
    ) if os.environ.get("SUPABASE_URL") else None
except Exception:
    _sb = None

from src.data_loader import load_data
from src.feature_engineering import build_prediction_features
from src.model import load_model, predict_matches, knockout_winner
from src.fixtures import GROUPS, GROUP_MATCHES, FIFA_RANKINGS, next_round_matches

app = Flask(__name__)
CORS(app)

# ── Tier limits ───────────────────────────────────────────────────────────────
TIER_LIMITS = {
    "free":  {"predictions": 5,        "files": 0, "file_mb": 0   },
    "pro":   {"predictions": 75,       "files": 1, "file_mb": 10  },
    "elite": {"predictions": 999_999,  "files": 5, "file_mb": 25  },
}

# ── Boot ─────────────────────────────────────────────────────────────────────
print("Loading data …")
_df = load_data(min_year=0)   # all senior international matches from 1872
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
    return _json_resp(json.dumps({
        "status":   "ok",
        "accuracy": float(_metrics.get("accuracy", 0)),
        "matches":  len(_df),
    }))


# ── Upload endpoint ───────────────────────────────────────────────────────────

UPLOAD_REQUIRED_COLS = {"date", "home_team", "away_team", "home_score", "away_score"}

@app.route("/upload_data", methods=["POST"])
def upload_data():
    """
    Accept a user CSV upload and validate it.
    Returns stats; the merged DataFrame is used per-request in /predict_custom.
    """
    if "file" not in request.files:
        return _json_resp(json.dumps({"error": "No file provided"}), 400)

    f = request.files["file"]
    user_id = request.form.get("user_id", "")

    try:
        text = f.read().decode("utf-8", errors="replace")
        user_df = pd.read_csv(io.StringIO(text))
    except Exception as e:
        return _json_resp(json.dumps({"error": f"Could not parse CSV: {e}"}), 400)

    cols = set(user_df.columns.str.lower().str.strip())
    missing = UPLOAD_REQUIRED_COLS - cols
    if missing:
        return _json_resp(json.dumps({"error": f"Missing columns: {', '.join(missing)}"}), 400)

    # Normalise column names
    user_df.columns = user_df.columns.str.lower().str.strip()
    user_df["home_score"] = pd.to_numeric(user_df["home_score"], errors="coerce")
    user_df["away_score"] = pd.to_numeric(user_df["away_score"], errors="coerce")
    user_df = user_df.dropna(subset=["home_score", "away_score"])

    if len(user_df) == 0:
        return _json_resp(json.dumps({"error": "No valid rows found after parsing."}), 400)

    # Track upload in Supabase (best-effort)
    if _sb and user_id:
        try:
            _sb.table("profiles").update({
                "files_uploaded": _sb.table("profiles")
                    .select("files_uploaded").eq("id", user_id)
                    .single().execute().data["files_uploaded"] + 1
            }).eq("id", user_id).execute()
        except Exception:
            pass

    return _json_resp(json.dumps({
        "ok":      True,
        "rows":    len(user_df),
        "message": f"{len(user_df):,} matches loaded. Use /predict with your_data=true to apply.",
    }))


# ── Stripe endpoints ──────────────────────────────────────────────────────────

_TIER_MAP = {
    os.environ.get("STRIPE_PRICE_PRO",   "price_pro"):   "pro",
    os.environ.get("STRIPE_PRICE_ELITE", "price_elite"): "elite",
}


@app.route("/create_checkout_session", methods=["POST"])
def create_checkout_session():
    if not _STRIPE_OK:
        return _json_resp(json.dumps({"error": "Stripe not configured"}), 503)
    try:
        data     = request.get_json(force=True)
        price_id = data.get("price_id")
        user_id  = data.get("user_id")
        email    = data.get("email", "")
        origin   = request.headers.get("Origin", os.environ.get("FRONTEND_URL", "https://predictafc.netlify.app"))

        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="subscription",
            line_items=[{"price": price_id, "quantity": 1}],
            customer_email=email,
            success_url=f"{origin}/dashboard?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{origin}/pricing",
            metadata={"user_id": user_id},
        )
        return _json_resp(json.dumps({"url": session.url}))
    except Exception as e:
        return _json_resp(json.dumps({"error": str(e)}), 500)


@app.route("/create_portal_session", methods=["POST"])
def create_portal_session():
    if not _STRIPE_OK:
        return _json_resp(json.dumps({"error": "Stripe not configured"}), 503)
    try:
        data    = request.get_json(force=True)
        user_id = data.get("user_id")
        origin  = request.headers.get("Origin", os.environ.get("FRONTEND_URL", "https://predictafc.netlify.app"))

        # Look up Stripe customer from Supabase profile
        customer_id = None
        if _sb and user_id:
            res = _sb.table("profiles").select("stripe_customer_id").eq("id", user_id).single().execute()
            customer_id = res.data.get("stripe_customer_id") if res.data else None

        if not customer_id:
            return _json_resp(json.dumps({"error": "No Stripe customer found"}), 404)

        session = stripe.billing_portal.Session.create(
            customer=customer_id,
            return_url=f"{origin}/dashboard",
        )
        return _json_resp(json.dumps({"url": session.url}))
    except Exception as e:
        return _json_resp(json.dumps({"error": str(e)}), 500)


@app.route("/webhook", methods=["POST"])
def stripe_webhook():
    if not _STRIPE_OK:
        return _json_resp(json.dumps({"error": "Stripe not configured"}), 503)

    payload = request.get_data()
    sig     = request.headers.get("Stripe-Signature", "")
    secret  = os.environ.get("STRIPE_WEBHOOK_SECRET", "")

    try:
        event = stripe.Webhook.construct_event(payload, sig, secret)
    except Exception as e:
        return _json_resp(json.dumps({"error": str(e)}), 400)

    et = event["type"]

    if et == "checkout.session.completed":
        sess      = event["data"]["object"]
        user_id   = sess.get("metadata", {}).get("user_id")
        cust_id   = sess.get("customer")
        sub_id    = sess.get("subscription")
        price_id  = None
        if sub_id:
            sub      = stripe.Subscription.retrieve(sub_id)
            price_id = sub["items"]["data"][0]["price"]["id"]
        tier = _TIER_MAP.get(price_id, "pro")
        if _sb and user_id:
            _sb.table("profiles").update({
                "tier": tier,
                "stripe_customer_id":     cust_id,
                "stripe_subscription_id": sub_id,
                "subscription_status":    "active",
            }).eq("id", user_id).execute()

    elif et in ("customer.subscription.updated", "customer.subscription.deleted"):
        sub      = event["data"]["object"]
        cust_id  = sub.get("customer")
        status   = sub.get("status")
        tier     = "free"
        if status == "active":
            price_id = sub["items"]["data"][0]["price"]["id"]
            tier = _TIER_MAP.get(price_id, "free")
        if _sb and cust_id:
            _sb.table("profiles").update({
                "tier": tier,
                "subscription_status": status,
            }).eq("stripe_customer_id", cust_id).execute()

    elif et == "invoice.payment_failed":
        sub_id  = event["data"]["object"].get("subscription")
        cust_id = event["data"]["object"].get("customer")
        if _sb and cust_id:
            _sb.table("profiles").update({
                "subscription_status": "past_due",
            }).eq("stripe_customer_id", cust_id).execute()

    return _json_resp(json.dumps({"received": True}))


if __name__ == "__main__":
    app.run(port=8000, debug=False)
