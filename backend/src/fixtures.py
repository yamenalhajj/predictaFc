"""
src/fixtures.py
All WC 2026 fixture data: groups, teams, FIFA rankings, flags, and bracket helpers.
"""

# ── April 2026 FIFA World Rankings (points) ──────────────────────────────────
FIFA_RANKINGS = {
    "France":           1877.32,
    "Spain":            1876.40,
    "Argentina":        1874.81,
    "England":          1825.97,
    "Portugal":         1763.83,
    "Brazil":           1761.16,
    "Netherlands":      1757.87,
    "Morocco":          1755.87,
    "Belgium":          1734.71,
    "Germany":          1730.37,
    "Croatia":          1717.07,
    "Italy":            1700.37,
    "Colombia":         1693.09,
    "Senegal":          1688.99,
    "Mexico":           1681.03,
    "United States":    1673.13,
    "Uruguay":          1673.07,
    "Japan":            1660.43,
    "Canada":           1648.50,
    "Switzerland":      1649.40,
    "Denmark":          1620.81,
    "IR Iran":          1615.00,
    "South Korea":      1605.00,
    "Australia":        1580.00,
    "Ecuador":          1565.00,
    "Norway":           1560.00,
    "Austria":          1550.00,
    "Turkey":           1545.00,
    "Ukraine":          1530.00,
    "Algeria":          1510.00,
    "Scotland":         1495.00,
    "Tunisia":          1485.00,
    "Egypt":            1470.00,
    "Côte d'Ivoire":    1450.00,
    "Paraguay":         1420.00,
    "South Africa":     1390.00,
    "Saudi Arabia":     1370.00,
    "Jamaica":          1355.00,
    "Ghana":            1340.00,
    "Cape Verde":       1325.00,
    "Qatar":            1300.00,
    "Panama":           1280.00,
    "Jordan":           1260.00,
    "Uzbekistan":       1245.00,
    "Iraq":             1230.00,
    "Haiti":            1215.00,
    "New Zealand":      1190.00,
    "Curaçao":          1175.00,
}

# ── Team name normalisation (matches dataset naming → our standard naming) ───
NAME_NORMALIZATION = {
    "Iran":                   "IR Iran",
    "Ivory Coast":            "Côte d'Ivoire",
    "Côte d'Ivoire":         "Côte d'Ivoire",
    "Curacao":                "Curaçao",
    "Korea Republic":         "South Korea",
    "Republic of Ireland":    "Ireland",
    "USA":                    "United States",
    "China":                  "China PR",
    "North Macedonia":        "North Macedonia",
    "Türkiye":                "Turkey",
}

# ── WC 2026 Groups (Dec 5 2025 draw) ─────────────────────────────────────────
GROUPS = {
    "A": ["Mexico",        "South Africa",  "South Korea",    "Denmark"],
    "B": ["Canada",        "Italy",         "Qatar",          "Switzerland"],
    "C": ["Brazil",        "Morocco",       "Haiti",          "Scotland"],
    "D": ["United States", "Paraguay",      "Australia",      "Turkey"],
    "E": ["Germany",       "Curaçao",       "Côte d'Ivoire",  "Ecuador"],
    "F": ["Netherlands",   "Japan",         "Ukraine",        "Tunisia"],
    "G": ["Belgium",       "Egypt",         "IR Iran",        "New Zealand"],
    "H": ["Spain",         "Cape Verde",    "Saudi Arabia",   "Uruguay"],
    "I": ["France",        "Senegal",       "Iraq",           "Norway"],
    "J": ["Argentina",     "Algeria",       "Austria",        "Jordan"],
    "K": ["Portugal",      "Jamaica",       "Uzbekistan",     "Colombia"],
    "L": ["England",       "Croatia",       "Ghana",          "Panama"],
}

# ── Flag emojis ───────────────────────────────────────────────────────────────
TEAM_FLAGS = {
    "France":          "🇫🇷", "Spain":         "🇪🇸", "Argentina":     "🇦🇷",
    "England":         "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "Portugal":      "🇵🇹", "Brazil":        "🇧🇷",
    "Netherlands":     "🇳🇱", "Morocco":       "🇲🇦", "Belgium":       "🇧🇪",
    "Germany":         "🇩🇪", "Croatia":       "🇭🇷", "Italy":         "🇮🇹",
    "Colombia":        "🇨🇴", "Senegal":       "🇸🇳", "Mexico":        "🇲🇽",
    "United States":   "🇺🇸", "Uruguay":       "🇺🇾", "Japan":         "🇯🇵",
    "Canada":          "🇨🇦", "Switzerland":   "🇨🇭", "Denmark":       "🇩🇰",
    "IR Iran":         "🇮🇷", "South Korea":   "🇰🇷", "Australia":     "🇦🇺",
    "Ecuador":         "🇪🇨", "Norway":        "🇳🇴", "Austria":       "🇦🇹",
    "Turkey":          "🇹🇷", "Ukraine":       "🇺🇦", "Algeria":       "🇩🇿",
    "Scotland":        "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "Tunisia":      "🇹🇳", "Egypt":         "🇪🇬",
    "Côte d'Ivoire":   "🇨🇮", "Paraguay":      "🇵🇾", "South Africa":  "🇿🇦",
    "Saudi Arabia":    "🇸🇦", "Jamaica":       "🇯🇲", "Ghana":         "🇬🇭",
    "Cape Verde":      "🇨🇻", "Qatar":         "🇶🇦", "Panama":        "🇵🇦",
    "Jordan":          "🇯🇴", "Uzbekistan":    "🇺🇿", "Iraq":          "🇮🇶",
    "Haiti":           "🇭🇹", "New Zealand":   "🇳🇿", "Curaçao":       "🇨🇼",
}


def get_flag(team: str) -> str:
    """Return flag emoji for a team, defaulting to ⚽."""
    return TEAM_FLAGS.get(team, "⚽")


def generate_group_matches() -> list[dict]:
    """Generate all 72 group-stage matches (round-robin within each group)."""
    matches = []
    # Approximate group-stage dates
    group_dates = {
        "A": ["2026-06-11", "2026-06-15", "2026-06-19"],
        "B": ["2026-06-12", "2026-06-16", "2026-06-20"],
        "C": ["2026-06-12", "2026-06-16", "2026-06-20"],
        "D": ["2026-06-13", "2026-06-17", "2026-06-21"],
        "E": ["2026-06-13", "2026-06-17", "2026-06-21"],
        "F": ["2026-06-14", "2026-06-18", "2026-06-22"],
        "G": ["2026-06-14", "2026-06-18", "2026-06-22"],
        "H": ["2026-06-15", "2026-06-19", "2026-06-23"],
        "I": ["2026-06-15", "2026-06-19", "2026-06-23"],
        "J": ["2026-06-16", "2026-06-20", "2026-06-24"],
        "K": ["2026-06-16", "2026-06-20", "2026-06-24"],
        "L": ["2026-06-17", "2026-06-21", "2026-06-25"],
    }
    matchday_combos = [(0, 1), (2, 3), (0, 2), (1, 3), (0, 3), (1, 2)]
    md_assignment = [0, 0, 1, 1, 2, 2]  # which matchday each combo belongs to

    for group, teams in GROUPS.items():
        dates = group_dates[group]
        for idx, (i, j) in enumerate(matchday_combos):
            matches.append({
                "group":      group,
                "matchday":   md_assignment[idx] + 1,
                "home_team":  teams[i],
                "away_team":  teams[j],
                "neutral":    True,
                "stage":      "Group Stage",
                "date":       dates[md_assignment[idx]],
            })
    return matches


GROUP_MATCHES = generate_group_matches()


# ── Round of 32 pre-defined bracket ──────────────────────────────────────────
# WC 2026: 1st & 2nd from each group (24 teams) + 8 best 3rd-place → 32 teams
# R32 fixed pairings (winner of group A plays 2nd of group B, etc.)
R32_BRACKET_FIXED = [
    ("A", 1, "B", 2),
    ("B", 1, "A", 2),
    ("C", 1, "D", 2),
    ("D", 1, "C", 2),
    ("E", 1, "F", 2),
    ("F", 1, "E", 2),
    ("G", 1, "H", 2),
    ("H", 1, "G", 2),
    ("I", 1, "J", 2),
    ("J", 1, "I", 2),
    ("K", 1, "L", 2),
    ("L", 1, "K", 2),
]


def build_knockout_from_standings(standings: dict) -> list[dict]:
    """
    Build Round-of-32 matchups from group standings.
    standings: { group_letter: [(team, stats_dict), ...] sorted 1st→4th }
    Returns list of 16 match dicts.
    """
    matches = []
    for g1, pos1, g2, pos2 in R32_BRACKET_FIXED:
        team1 = standings[g1][pos1 - 1][0]
        team2 = standings[g2][pos2 - 1][0]
        matches.append({
            "home_team": team1,
            "away_team": team2,
            "neutral":   True,
            "stage":     "Round of 32",
        })
    # The 8 best 3rd-place teams fill the remaining 4 R32 slots
    third_places = []
    for grp, ranked in standings.items():
        if len(ranked) >= 3:
            team, stats = ranked[2]
            third_places.append((team, stats["Pts"], stats["GD"], stats["GF"]))
    third_places.sort(key=lambda x: (-x[1], -x[2], -x[3]))
    best_thirds = [t[0] for t in third_places[:8]]
    for i in range(0, 8, 2):
        matches.append({
            "home_team": best_thirds[i],
            "away_team": best_thirds[i + 1],
            "neutral":   True,
            "stage":     "Round of 32",
        })
    return matches


def next_round_matches(winners: list[str], stage: str) -> list[dict]:
    """Pair winners into next knockout round."""
    matches = []
    for i in range(0, len(winners) - 1, 2):
        matches.append({
            "home_team": winners[i],
            "away_team": winners[i + 1],
            "neutral":   True,
            "stage":     stage,
        })
    return matches


STAGE_NAMES = {
    "r32": "Round of 32",
    "r16": "Round of 16",
    "qf":  "Quarter-Finals",
    "sf":  "Semi-Finals",
    "f":   "Final",
}
