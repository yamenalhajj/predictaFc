import { useState } from 'react';
import { BarChart3, Zap } from 'lucide-react';
import { GROUPS, GROUP_MATCHES, GROUP_STANDINGS, Match } from '../data/worldcup';
import MatchCard from '../components/MatchCard';
import GroupTable from '../components/GroupTable';
import RevealSection from '../components/RevealSection';

const GROUP_KEYS = Object.keys(GROUPS) as string[];

function groupMatches(groupKey: string): Match[] {
  return GROUP_MATCHES.filter(m => m.group === groupKey);
}

export default function Groups() {
  const [activeGroup, setActiveGroup] = useState('A');
  const [activeMatchday, setActiveMatchday] = useState<1 | 2 | 3 | 'all'>('all');

  const matches = groupMatches(activeGroup).filter(
    m => activeMatchday === 'all' || m.matchday === activeMatchday
  );
  const standings = GROUP_STANDINGS[activeGroup] ?? [];

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
            AI-predicted outcomes for all 72 group stage matches across 12 groups (A–L). Click a match to explore probabilities.
          </p>
        </RevealSection>

        {/* Group tabs */}
        <RevealSection className="mb-8">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Select group">
            {GROUP_KEYS.map(g => (
              <button
                key={g}
                role="tab"
                aria-selected={activeGroup === g}
                onClick={() => setActiveGroup(g)}
                className={`w-10 h-10 rounded-lg font-heading text-sm font-bold transition-all duration-200 cursor-pointer ${
                  activeGroup === g
                    ? 'bg-gold text-black shadow-gold-sm'
                    : 'glass-card text-slate-400 hover:text-white hover:border-white/15'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </RevealSection>

        {/* Matchday filter */}
        <RevealSection className="mb-8">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by matchday">
            {(['all', 1, 2, 3] as const).map(md => (
              <button
                key={md}
                role="tab"
                aria-selected={activeMatchday === md}
                onClick={() => setActiveMatchday(md)}
                className={`px-4 py-2 rounded-lg text-xs font-heading font-semibold transition-all duration-200 cursor-pointer ${
                  activeMatchday === md
                    ? 'bg-white/10 text-white border border-white/15'
                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {md === 'all' ? 'All Matchdays' : `Matchday ${md}`}
              </button>
            ))}
          </div>
        </RevealSection>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Matches (2/3 width) */}
          <div className="lg:col-span-2 space-y-4">
            <RevealSection className="flex items-center justify-between mb-2">
              <h2 className="font-heading text-lg font-bold text-white">
                Group {activeGroup} — Predictions
              </h2>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-600 font-heading uppercase tracking-wider">
                <Zap className="w-3 h-3 text-gold" aria-hidden="true" />
                AI Model v2.4
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

          {/* Standings (1/3 width) */}
          <div className="space-y-4">
            <RevealSection>
              <GroupTable standings={standings} groupLabel={activeGroup} />
            </RevealSection>

            {/* Group summary card */}
            <RevealSection>
              <div className="glass-card p-5">
                <p className="text-xs font-heading font-semibold text-slate-500 uppercase tracking-wider mb-3">Group Info</p>
                <div className="space-y-3">
                  {GROUPS[activeGroup].map(teamName => {
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
      </div>
    </div>
  );
}
