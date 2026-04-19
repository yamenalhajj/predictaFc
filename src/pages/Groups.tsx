import { useState, useEffect } from 'react';
import { BarChart3, Zap, Loader2, AlertCircle } from 'lucide-react';
import { GROUPS, Match, Standing } from '../data/worldcup';
import { fetchGroupMatches, ApiMatch, ApiStanding } from '../api';
import MatchCard from '../components/MatchCard';
import GroupTable from '../components/GroupTable';
import RevealSection from '../components/RevealSection';

const GROUP_KEYS = Object.keys(GROUPS) as string[];

function toMatch(m: ApiMatch): Match {
  return {
    id: m.id, stage: 'group', group: m.group, matchday: m.matchday,
    homeTeam: m.homeTeam, awayTeam: m.awayTeam,
    homeScore: m.homeScore, awayScore: m.awayScore,
    probHomeWin: m.probHomeWin, probDraw: m.probDraw, probAwayWin: m.probAwayWin,
    confidence: m.confidence, winner: m.winner ?? undefined, date: m.date,
  };
}

function toStanding(s: ApiStanding): Standing {
  return { team: s.team, W: s.W, D: s.D, L: s.L, GF: s.GF, GA: s.GA, GD: s.GD, Pts: s.Pts };
}

export default function Groups() {
  const [activeGroup, setActiveGroup] = useState('A');
  const [activeMatchday, setActiveMatchday] = useState<1 | 2 | 3 | 'all'>('all');
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [allStandings, setAllStandings] = useState<Record<string, Standing[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGroupMatches()
      .then(data => {
        setAllMatches(data.groupMatches.map(toMatch));
        const s: Record<string, Standing[]> = {};
        for (const [g, rows] of Object.entries(data.standings)) {
          s[g] = (rows as ApiStanding[]).map(toStanding);
        }
        setAllStandings(s);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message ?? 'Failed to load predictions');
        setLoading(false);
      });
  }, []);

  const matches = allMatches.filter(
    m => m.group === activeGroup && (activeMatchday === 'all' || m.matchday === activeMatchday)
  );
  const standings = allStandings[activeGroup] ?? [];

  return (
    <div className="page-container">
      <div className="max-container section-pad">

        {/* Header */}
        <RevealSection className="mb-12">
          <span className="section-label">
            <BarChart3 className="w-3 h-3" aria-hidden="true" />
            Tournament
          </span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3">Group Stage</h1>
          <p className="text-slate-500 font-body max-w-xl">
            ML predictions for all 72 group stage matches — trained on 32K+ historical results.
          </p>
        </RevealSection>

        {/* Error */}
        {error && (
          <div className="glass-card border-red-500/20 p-4 mb-8 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-sm font-heading font-semibold text-red-400 mb-1">Could not load predictions</p>
              <p className="text-xs text-slate-500">{error} — Start the API: <code className="text-gold">python backend/api.py</code></p>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="glass-card p-12 text-center mb-8">
            <Loader2 className="w-8 h-8 text-gold animate-spin mx-auto mb-3" aria-hidden="true" />
            <p className="text-slate-500 font-body text-sm">Running ML model on 32K+ matches…</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Group tabs */}
            <RevealSection className="mb-8">
              <div className="flex flex-wrap gap-2" role="tablist" aria-label="Select group">
                {GROUP_KEYS.map(g => (
                  <button key={g} role="tab" aria-selected={activeGroup === g}
                    onClick={() => setActiveGroup(g)}
                    className={`w-10 h-10 rounded-lg font-heading text-sm font-bold transition-all duration-200 cursor-pointer ${
                      activeGroup === g ? 'bg-gold text-black shadow-gold-sm' : 'glass-card text-slate-400 hover:text-white hover:border-white/15'
                    }`}
                  >{g}</button>
                ))}
              </div>
            </RevealSection>

            {/* Matchday filter */}
            <RevealSection className="mb-8">
              <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by matchday">
                {(['all', 1, 2, 3] as const).map(md => (
                  <button key={md} role="tab" aria-selected={activeMatchday === md}
                    onClick={() => setActiveMatchday(md)}
                    className={`px-4 py-2 rounded-lg text-xs font-heading font-semibold transition-all duration-200 cursor-pointer ${
                      activeMatchday === md ? 'bg-white/10 text-white border border-white/15' : 'text-slate-500 hover:text-white hover:bg-white/5'
                    }`}
                  >{md === 'all' ? 'All Matchdays' : `Matchday ${md}`}</button>
                ))}
              </div>
            </RevealSection>

            {/* Main layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Matches */}
              <div className="lg:col-span-2 space-y-4">
                <RevealSection className="flex items-center justify-between mb-2">
                  <h2 className="font-heading text-lg font-bold text-white">Group {activeGroup} — Predictions</h2>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-600 font-heading uppercase tracking-wider">
                    <Zap className="w-3 h-3 text-gold" aria-hidden="true" />
                    ML Model · 32K matches
                  </div>
                </RevealSection>
                {matches.length === 0 ? (
                  <div className="glass-card p-10 text-center text-slate-600 font-body">No matches for this filter.</div>
                ) : (
                  matches.map((match, i) => (
                    <RevealSection key={match.id} delay={(i % 4) as 0|1|2|3}>
                      <MatchCard match={match} />
                    </RevealSection>
                  ))
                )}
              </div>

              {/* Standings */}
              <div className="space-y-4">
                <RevealSection>
                  <GroupTable standings={standings} groupLabel={activeGroup} />
                </RevealSection>
                <RevealSection>
                  <div className="glass-card p-5">
                    <p className="text-xs font-heading font-semibold text-slate-500 uppercase tracking-wider mb-3">Group Info</p>
                    <div className="space-y-3">
                      {(GROUPS[activeGroup] ?? []).map(teamName => {
                        const s = standings.find(x => x.team === teamName);
                        return (
                          <div key={teamName} className="flex items-center justify-between">
                            <div className="text-xs font-heading text-white">{teamName}</div>
                            {s && (
                              <div className="flex items-center gap-1">
                                {[s.W > 0 ? 'W' : null, s.D > 0 ? 'D' : null, s.L > 0 ? 'L' : null]
                                  .filter(Boolean).map((r, j) => (
                                    <span key={j} className={`text-[9px] font-heading font-bold px-1.5 py-0.5 rounded ${
                                      r === 'W' ? 'bg-green-500/15 text-green-400' : r === 'D' ? 'bg-slate-500/15 text-slate-400' : 'bg-red-500/15 text-red-400'
                                    }`}>{r}</span>
                                  ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </RevealSection>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
