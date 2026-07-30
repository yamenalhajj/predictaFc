import { useState, useEffect } from 'react';
import { Trophy, Zap, Loader2, AlertCircle } from 'lucide-react';
import { getTeam, flagUrl, getConfidenceLabel, Match, Stage } from '../data/worldcup';
import { fetchKnockout, ApiMatch } from '../api';
import RevealSection from '../components/RevealSection';

function toMatch(m: ApiMatch): Match {
  return {
    id: m.id, stage: m.stage as Stage, group: m.group, matchday: m.matchday,
    homeTeam: m.homeTeam, awayTeam: m.awayTeam,
    homeScore: m.homeScore, awayScore: m.awayScore,
    probHomeWin: m.probHomeWin, probDraw: m.probDraw, probAwayWin: m.probAwayWin,
    confidence: m.confidence, winner: m.winner ?? undefined, date: m.date,
  };
}

// ─── BracketMatch card ────────────────────────────────────────────────────────
function BracketMatch({ match, size = 'md' }: { match: Match; size?: 'sm' | 'md' | 'lg' }) {
  const [hovered, setHovered] = useState(false);
  const home   = getTeam(match.homeTeam);
  const away   = getTeam(match.awayTeam);
  const winner = match.winner;
  const conf   = getConfidenceLabel(match.confidence);
  const homeWins = winner === match.homeTeam;
  const awayWins = winner === match.awayTeam;

  const widthCls = size === 'lg' ? 'w-64' : size === 'md' ? 'w-52' : 'w-44';

  return (
    <div
      className={`glass-card cursor-pointer transition-all duration-200 overflow-hidden ${widthCls} ${
        hovered ? 'border-gold/25 bg-white/[0.06] shadow-gold-sm' : ''
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Home */}
      <div className={`flex items-center gap-2 px-3 py-2.5 ${homeWins ? 'bg-green-500/8' : ''}`}>
        <img src={flagUrl(home?.flagCode ?? 'un', 40)} alt={`${match.homeTeam} flag`} className="w-6 h-4 object-cover rounded-sm shrink-0" loading="lazy" />
        <span className={`flex-1 font-heading text-xs font-semibold truncate ${homeWins ? 'text-white' : 'text-slate-400'}`}>{home?.shortName ?? match.homeTeam}</span>
        <span className={`font-heading text-sm font-bold tabular-nums ${homeWins ? 'text-white' : 'text-slate-600'}`}>{match.homeScore}</span>
        {homeWins && <div className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />}
      </div>
      <div className="h-px bg-white/[0.06]" />
      {/* Away */}
      <div className={`flex items-center gap-2 px-3 py-2.5 ${awayWins ? 'bg-green-500/8' : ''}`}>
        <img src={flagUrl(away?.flagCode ?? 'un', 40)} alt={`${match.awayTeam} flag`} className="w-6 h-4 object-cover rounded-sm shrink-0" loading="lazy" />
        <span className={`flex-1 font-heading text-xs font-semibold truncate ${awayWins ? 'text-white' : 'text-slate-400'}`}>{away?.shortName ?? match.awayTeam}</span>
        <span className={`font-heading text-sm font-bold tabular-nums ${awayWins ? 'text-white' : 'text-slate-600'}`}>{match.awayScore}</span>
        {awayWins && <div className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />}
      </div>
      {hovered && (
        <div className={`px-3 py-1.5 border-t border-white/[0.04] flex items-center gap-1.5 text-[10px] font-heading font-semibold ${conf.color}`}>
          <Zap className="w-2.5 h-2.5" aria-hidden="true" />
          {conf.label} Confidence
        </div>
      )}
    </div>
  );
}

// ─── Connector line ───────────────────────────────────────────────────────────
function Connector({ tall = false }: { tall?: boolean }) {
  return (
    <div className="hidden md:flex flex-col items-end justify-center opacity-25 shrink-0" style={{ width: 24 }}>
      <div className={`w-full h-px bg-gold`} />
      <div className={`w-px ${tall ? 'h-16' : 'h-8'} bg-gold ml-auto`} />
    </div>
  );
}

// ─── Stage label ──────────────────────────────────────────────────────────────
function StageLabel({ label, gold = false }: { label: string; gold?: boolean }) {
  return (
    <p className={`text-[10px] font-heading font-semibold uppercase tracking-widest mb-3 text-center ${gold ? 'text-gold' : 'text-slate-600'}`}>
      {label}
    </p>
  );
}

const STAGE_MAP: Record<string, string> = {
  r32: 'Round of 32', r16: 'Round of 16', qf: 'Quarter-Finals', sf: 'Semi-Finals', '3rd': '3rd Place', final: 'Final',
};

type ActiveRound = 'r32' | 'r16' | 'qf' | 'sf' | 'final' | 'all';

const ROUNDS: { key: ActiveRound; label: string }[] = [
  { key: 'all',   label: 'All Rounds'     },
  { key: 'r32',   label: 'Round of 32'    },
  { key: 'r16',   label: 'Round of 16'    },
  { key: 'qf',    label: 'Quarter-Finals' },
  { key: 'sf',    label: 'Semi-Finals'    },
  { key: 'final', label: 'Final'          },
];

export default function Knockout() {
  const [activeRound, setActiveRound] = useState<ActiveRound>('all');
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [champion, setChampion] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchKnockout()
      .then(data => {
        setAllMatches(data.knockoutMatches.map(toMatch));
        setChampion(data.champion);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message ?? 'Failed to load predictions');
        setLoading(false);
      });
  }, []);

  const r32   = allMatches.filter(m => m.stage === 'r32');
  const r16   = allMatches.filter(m => m.stage === 'r16');
  const qf    = allMatches.filter(m => m.stage === 'qf');
  const sf    = allMatches.filter(m => m.stage === 'sf');
  const final = allMatches.find(m => m.stage === 'final');
  const third = allMatches.find(m => m.stage === '3rd');

  const champTeam  = champion ? getTeam(champion) : null;
  const finalistId = final
    ? (champion === final.homeTeam ? final.awayTeam : final.homeTeam)
    : '';

  return (
    <div className="page-container">
      <div className="max-container section-pad">

        {/* Header */}
        <RevealSection className="mb-12">
          <span className="section-label">
            <Trophy className="w-3 h-3" aria-hidden="true" />
            WC 2026 — 48 Teams
          </span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3">Tournament Bracket</h1>
          <p className="text-slate-500 font-body max-w-xl">
            Full predicted path from Round of 32 to the Final. 48 teams, 5 knockout rounds. Hover any match for the confidence score.
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
            <p className="text-slate-500 font-body text-sm">Simulating full knockout bracket…</p>
          </div>
        )}

        {!loading && !error && champion && (
          <>
            {/* Champion */}
            <RevealSection className="mb-10">
              <div className="glass-card border-gold/20 p-6 flex flex-col sm:flex-row items-center gap-5 bg-gradient-to-r from-gold/8 to-transparent">
                <div className="w-14 h-14 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center animate-pulse-gold shrink-0">
                  <Trophy className="w-7 h-7 text-gold" aria-hidden="true" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-xs font-heading font-semibold text-gold uppercase tracking-wider mb-1">Predicted Champion — WC 2026</p>
                  <div className="flex items-center gap-3 mb-1">
                    {champTeam && (
                      <img src={flagUrl(champTeam.flagCode, 80)} alt={`${champTeam.name} flag`} className="w-10 h-7 object-cover rounded" loading="lazy" />
                    )}
                    <span className="font-heading text-3xl font-bold text-white">{champion}</span>
                  </div>
                  {final && (
                    <p className="text-sm text-slate-500 font-body">
                      Predicted to defeat {finalistId} in the final · {final.confidence} confidence
                    </p>
                  )}
                </div>
              </div>
            </RevealSection>

            {/* Round filter */}
            <RevealSection className="mb-8">
              <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by round">
                {ROUNDS.map(({ key, label }) => (
                  <button key={key} role="tab" aria-selected={activeRound === key}
                    onClick={() => setActiveRound(key)}
                    className={`px-4 py-2 rounded-lg text-xs font-heading font-semibold transition-all duration-200 cursor-pointer ${
                      activeRound === key ? 'bg-gold text-black' : 'glass-card text-slate-400 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </RevealSection>

            {/* ── Full Bracket (scroll) ── */}
            {activeRound === 'all' && (
              <RevealSection>
                <div className="overflow-x-auto pb-6 -mx-4 px-4">
                  <div className="flex gap-6 items-start min-w-max py-2">

                    {/* R32 left half */}
                    <div className="flex flex-col gap-2.5">
                      <StageLabel label="Round of 32" />
                      {r32.slice(0, 8).map(m => <BracketMatch key={m.id} match={m} size="sm" />)}
                    </div>

                    <Connector tall />

                    {/* R16 left half */}
                    <div className="flex flex-col gap-2.5 mt-8">
                      <StageLabel label="Round of 16" />
                      {r16.slice(0, 4).map(m => <BracketMatch key={m.id} match={m} size="md" />)}
                    </div>

                    <Connector />

                    {/* QF left */}
                    <div className="flex flex-col gap-2.5 mt-16">
                      <StageLabel label="QF" />
                      {qf.slice(0, 2).map(m => <BracketMatch key={m.id} match={m} size="md" />)}
                    </div>

                    <Connector />

                    {/* SF */}
                    <div className="flex flex-col gap-2.5 mt-24">
                      <StageLabel label="SF" />
                      {sf.slice(0, 1).map(m => <BracketMatch key={m.id} match={m} size="md" />)}
                    </div>

                    <Connector />

                    {/* Final */}
                    <div className="flex flex-col gap-2.5 mt-32">
                      <StageLabel label="Final" gold />
                      {final && <BracketMatch match={final} size="lg" />}
                      {third && (
                        <div className="mt-2">
                          <StageLabel label="3rd Place" />
                          <BracketMatch match={third} size="md" />
                        </div>
                      )}
                    </div>

                    <Connector />

                    {/* SF right */}
                    <div className="flex flex-col gap-2.5 mt-24">
                      <StageLabel label="SF" />
                      {sf.slice(1).map(m => <BracketMatch key={m.id} match={m} size="md" />)}
                    </div>

                    <Connector />

                    {/* QF right */}
                    <div className="flex flex-col gap-2.5 mt-16">
                      <StageLabel label="QF" />
                      {qf.slice(2).map(m => <BracketMatch key={m.id} match={m} size="md" />)}
                    </div>

                    <Connector />

                    {/* R16 right half */}
                    <div className="flex flex-col gap-2.5 mt-8">
                      <StageLabel label="Round of 16" />
                      {r16.slice(4).map(m => <BracketMatch key={m.id} match={m} size="md" />)}
                    </div>

                    <Connector tall />

                    {/* R32 right half */}
                    <div className="flex flex-col gap-2.5">
                      <StageLabel label="Round of 32" />
                      {r32.slice(8).map(m => <BracketMatch key={m.id} match={m} size="sm" />)}
                    </div>
                  </div>
                </div>
              </RevealSection>
            )}

            {/* ── Single round view ── */}
            {activeRound !== 'all' && (() => {
              const stageKey = activeRound === 'final' ? ['sf', '3rd', 'final'] : [activeRound];
              const stageMatches = allMatches.filter(m => stageKey.includes(m.stage));
              return (
                <RevealSection>
                  <h2 className="font-heading text-xl font-bold text-white mb-6">{STAGE_MAP[activeRound] ?? activeRound}</h2>
                  {activeRound === 'final' && (
                    <div className="mb-8">
                      <p className="text-xs font-heading text-slate-500 uppercase tracking-wider mb-3">Final</p>
                      {final && <BracketMatch match={final} size="lg" />}
                      <p className="text-xs font-heading text-slate-500 uppercase tracking-wider mt-5 mb-3">3rd Place</p>
                      {third && <BracketMatch match={third} size="md" />}
                    </div>
                  )}
                  {activeRound !== 'final' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {stageMatches.map(m => <BracketMatch key={m.id} match={m} size="lg" />)}
                    </div>
                  )}
                </RevealSection>
              );
            })()}

            {/* ── Probability table ── */}
            <RevealSection className="mt-16">
              <h2 className="font-heading text-2xl font-bold text-white mb-6">All Predictions Summary</h2>
              <div className="space-y-2">
                {allMatches.filter(m =>
                  activeRound === 'all' || m.stage === activeRound || (activeRound === 'final' && (m.stage === 'final' || m.stage === '3rd'))
                ).map(match => {
                  const home   = getTeam(match.homeTeam);
                  const away   = getTeam(match.awayTeam);
                  const winner = match.winner;
                  const conf   = getConfidenceLabel(match.confidence);
                  return (
                    <div key={match.id} className="glass-card p-3 flex flex-col sm:flex-row sm:items-center gap-3">
                      <span className="text-[10px] font-heading font-semibold text-slate-600 uppercase tracking-wider w-12 shrink-0">
                        {STAGE_MAP[match.stage]?.split(' ').map(w => w[0]).join('')}
                      </span>
                      <div className="flex items-center gap-2 w-44 shrink-0">
                        <img src={flagUrl(home?.flagCode ?? 'un', 40)} alt="" className="w-5 h-3.5 object-cover rounded-sm shrink-0" />
                        <span className="font-heading text-xs font-semibold text-white">{home?.shortName ?? match.homeTeam}</span>
                        <span className="font-heading text-xs font-bold text-white tabular-nums">{match.homeScore}:{match.awayScore}</span>
                        <span className="font-heading text-xs font-semibold text-white">{away?.shortName ?? match.awayTeam}</span>
                        <img src={flagUrl(away?.flagCode ?? 'un', 40)} alt="" className="w-5 h-3.5 object-cover rounded-sm shrink-0" />
                      </div>
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex-1 flex rounded-full overflow-hidden h-1.5 gap-px">
                          <div className="bg-green-500" style={{ width:`${match.probHomeWin}%` }} />
                          <div className="bg-blue-500"  style={{ width:`${match.probAwayWin}%` }} />
                        </div>
                        <span className="text-[10px] font-heading text-green-400 tabular-nums">{match.probHomeWin}%</span>
                        <span className="text-[10px] font-heading text-blue-400 tabular-nums">{match.probAwayWin}%</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="win-badge text-[10px]">{winner}</span>
                        <span className={`text-[10px] font-heading px-2 py-0.5 rounded-full border ${conf.color}`}>{conf.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </RevealSection>
          </>
        )}
      </div>
    </div>
  );
}
