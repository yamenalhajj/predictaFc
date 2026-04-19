import { useState, useEffect } from 'react';
import { Zap, Trophy, TrendingUp, RotateCcw, ChevronDown, Activity } from 'lucide-react';
import { TEAMS, Team, flagUrl, getConfidenceLabel } from '../data/worldcup';
import ProbabilityBar from '../components/ProbabilityBar';
import StatBar from '../components/StatBar';
import RevealSection from '../components/RevealSection';

const TEAM_LIST = [...TEAMS].sort((a, b) => a.name.localeCompare(b.name));

interface Prediction {
  homeScore: number;
  awayScore: number;
  homeWinProb: number;
  drawProb: number;
  awayWinProb: number;
  confidence: number;
  winner: string;
}

function predict(home: Team, away: Team): Prediction {
  // xG-style prediction: base rate + attack vs defense differential
  const homeXG = Math.max(0.15,
    0.95                                      // league average base
    + (home.attack   - away.defense) / 120   // attack vs defense edge
    + (home.strength - away.strength) / 200  // overall edge
    + 0.15                                   // slight home advantage
  );
  const awayXG = Math.max(0.10,
    0.65
    + (away.attack   - home.defense) / 120
    + (away.strength - home.strength) / 200
  );

  // Predicted score: 0.75 threshold — only round up when xG is very close to next integer
  const homeScore = homeXG % 1 >= 0.75 ? Math.ceil(homeXG) : Math.floor(homeXG);
  const awayScore = awayXG % 1 >= 0.75 ? Math.ceil(awayXG) : Math.floor(awayXG);

  // Win probabilities — based on xG difference
  const xgDiff = homeXG - awayXG;
  const rawHomeWin  = Math.min(88, Math.max(8,  50 + xgDiff * 38));
  const rawDraw     = Math.min(32, Math.max(8,  22 - Math.abs(xgDiff) * 14));
  const rawAwayWin  = Math.max(4,  100 - rawHomeWin - rawDraw);
  // Normalise
  const pTotal = rawHomeWin + rawDraw + rawAwayWin;
  const hw = Math.round(rawHomeWin  / pTotal * 100);
  const dw = Math.round(rawDraw     / pTotal * 100);
  const aw = 100 - hw - dw;

  const winner = homeScore > awayScore ? home.name
               : awayScore > homeScore ? away.name
               : 'Draw';

  // Confidence: higher when xG gap is bigger and score is decisive
  const confidence = Math.min(94, Math.round(
    55 + Math.abs(xgDiff) * 22 + Math.abs(homeScore - awayScore) * 6
  ));

  return { homeScore, awayScore, homeWinProb: hw, drawProb: dw, awayWinProb: aw, confidence, winner };
}

function TeamSelector({ value, onChange, exclude, label }: {
  value: Team | null;
  onChange: (t: Team) => void;
  exclude?: string;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const filtered = TEAM_LIST.filter(t => t.name !== exclude && t.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="relative">
      <label className="block text-xs font-heading font-semibold text-slate-500 uppercase tracking-wider mb-2">{label}</label>
      <button
        onClick={() => setOpen(!open)}
        className="w-full glass-card p-4 flex items-center gap-3 cursor-pointer hover:border-gold/25 hover:bg-white/[0.05] transition-all duration-200 text-left"
        aria-label={`Select ${label}`}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {value ? (
          <>
            <img src={flagUrl(value.flagCode, 80)} alt={`${value.name} flag`} className="w-10 h-7 object-cover rounded shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-heading text-base font-bold text-white truncate">{value.name}</div>
              <div className="text-xs text-slate-500">{value.confederation} · #{value.ranking}</div>
            </div>
          </>
        ) : (
          <div className="flex-1 text-slate-600 font-body text-sm">Select a team…</div>
        )}
        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {open && (
        <div className="absolute top-full mt-2 left-0 right-0 glass-card border-white/10 z-30 rounded-xl overflow-hidden shadow-card-hover">
          <div className="p-2 border-b border-white/[0.06]">
            <input
              autoFocus
              type="search"
              placeholder="Search…"
              value={q}
              onChange={e => setQ(e.target.value)}
              className="w-full bg-transparent text-sm text-white placeholder-slate-600 px-3 py-2 outline-none"
              aria-label="Search teams"
            />
          </div>
          <ul className="max-h-60 overflow-y-auto" role="listbox" aria-label={`${label} options`}>
            {filtered.map(t => (
              <li key={t.id}>
                <button
                  onClick={() => { onChange(t); setOpen(false); setQ(''); }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.05] transition-colors cursor-pointer text-left"
                  role="option"
                  aria-selected={value?.id === t.id}
                >
                  <img src={flagUrl(t.flagCode, 40)} alt="" className="w-7 h-5 object-cover rounded-sm shrink-0" />
                  <span className="font-heading text-sm text-white">{t.name}</span>
                  <span className="ml-auto text-xs text-slate-600">#{t.ranking}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function Predict() {
  const [homeTeam, setHomeTeam] = useState<Team | null>(TEAMS.find(t => t.name === 'Spain') ?? null);
  const [awayTeam, setAwayTeam] = useState<Team | null>(TEAMS.find(t => t.name === 'England') ?? null);
  const [result, setResult] = useState<Prediction | null>(null);
  const [animating, setAnimating] = useState(false);

  const run = () => {
    if (!homeTeam || !awayTeam) return;
    setAnimating(true);
    setResult(null);
    setTimeout(() => {
      setResult(predict(homeTeam, awayTeam));
      setAnimating(false);
    }, 600);
  };

  const swap = () => {
    const tmp = homeTeam;
    setHomeTeam(awayTeam);
    setAwayTeam(tmp);
    setResult(null);
  };

  const reset = () => { setHomeTeam(null); setAwayTeam(null); setResult(null); };

  // Auto-predict when both teams selected
  useEffect(() => {
    if (homeTeam && awayTeam) run();
  }, [homeTeam, awayTeam]);

  const conf = result ? getConfidenceLabel(result.confidence) : null;
  const isDraw = result?.winner === 'Draw';
  const homeWins = result && homeTeam && result.winner === homeTeam.name;

  return (
    <div className="page-container">
      <div className="max-container section-pad">
        <RevealSection className="mb-12 text-center">
          <span className="section-label justify-center">
            <Zap className="w-3 h-3" aria-hidden="true" />
            Match Predictor
          </span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3">Custom Prediction</h1>
          <p className="text-slate-500 font-body max-w-lg mx-auto">
            Pick any two World Cup teams and get an instant AI-powered prediction with full probability and confidence breakdown.
          </p>
        </RevealSection>

        <div className="max-w-2xl mx-auto">

          {/* Team selectors */}
          <RevealSection className="glass-card p-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-end">
              <TeamSelector value={homeTeam} onChange={t => { setHomeTeam(t); setResult(null); }} exclude={awayTeam?.name} label="Home Team" />

              <div className="flex flex-col items-center gap-2 pb-2">
                <span className="text-slate-600 font-heading text-xs uppercase tracking-wider hidden sm:block">vs</span>
                <button
                  onClick={swap}
                  className="w-9 h-9 rounded-lg glass-card flex items-center justify-center text-slate-500 hover:text-white hover:border-gold/25 transition-all cursor-pointer"
                  aria-label="Swap teams"
                  title="Swap teams"
                  disabled={!homeTeam || !awayTeam}
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <TeamSelector value={awayTeam} onChange={t => { setAwayTeam(t); setResult(null); }} exclude={homeTeam?.name} label="Away Team" />
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={run}
                disabled={!homeTeam || !awayTeam || animating}
                className="btn-primary flex-1 justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Generate prediction"
              >
                {animating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" aria-hidden="true" />
                    Predicting…
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" aria-hidden="true" />
                    Generate Prediction
                  </>
                )}
              </button>
              <button
                onClick={reset}
                className="btn-ghost px-4"
                aria-label="Reset prediction"
              >
                Reset
              </button>
            </div>
          </RevealSection>

          {/* Loading */}
          {animating && (
            <div className="glass-card p-10 text-center mb-6" aria-live="polite">
              <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-3" aria-hidden="true" />
              <p className="text-slate-500 font-body text-sm">Running prediction model…</p>
            </div>
          )}

          {/* Result */}
          {result && homeTeam && awayTeam && !animating && (
            <div className="space-y-4 animate-fade-up" aria-live="polite">

              {/* Score card */}
              <div className={`glass-card p-6 ${isDraw ? 'border-slate-500/20' : homeWins ? 'border-green-500/15' : 'border-blue-500/15'}`}>
                <div className="flex items-center justify-between mb-6">
                  <div className={`text-xs font-heading font-semibold px-2 py-0.5 rounded-full border ${conf!.color}`}>
                    {conf!.label} Confidence
                  </div>
                  <div className="text-xs font-heading text-slate-600">{result.confidence}% certainty</div>
                </div>

                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <img src={flagUrl(homeTeam.flagCode, 160)} alt={`${homeTeam.name} flag`} className="w-20 h-14 object-cover rounded-lg" />
                    <span className={`font-heading text-base font-bold text-center ${homeWins ? 'text-white' : 'text-slate-400'}`}>{homeTeam.name}</span>
                  </div>
                  <div className="flex flex-col items-center shrink-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`font-heading text-5xl font-bold tabular-nums ${homeWins ? 'text-white' : 'text-slate-500'}`}>{result.homeScore}</span>
                      <span className="text-slate-600 font-heading text-2xl">:</span>
                      <span className={`font-heading text-5xl font-bold tabular-nums ${!isDraw && !homeWins ? 'text-white' : 'text-slate-500'}`}>{result.awayScore}</span>
                    </div>
                    <span className="text-[10px] font-heading text-slate-600 uppercase tracking-wider">Predicted Score</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <img src={flagUrl(awayTeam.flagCode, 160)} alt={`${awayTeam.name} flag`} className="w-20 h-14 object-cover rounded-lg" />
                    <span className={`font-heading text-base font-bold text-center ${!isDraw && !homeWins ? 'text-white' : 'text-slate-400'}`}>{awayTeam.name}</span>
                  </div>
                </div>

                {/* Winner banner */}
                <div className={`flex items-center justify-center gap-2 py-2.5 rounded-xl mb-5 ${
                  isDraw ? 'bg-slate-500/10 border border-slate-500/20'
                  : homeWins ? 'bg-green-500/10 border border-green-500/20'
                  : 'bg-blue-500/10 border border-blue-500/20'
                }`}>
                  {!isDraw && <Trophy className="w-4 h-4 text-gold" aria-hidden="true" />}
                  <span className={`font-heading text-sm font-bold ${
                    isDraw ? 'text-slate-400' : homeWins ? 'text-green-400' : 'text-blue-400'
                  }`}>
                    {isDraw ? 'Match ends in a Draw' : `${result.winner} wins`}
                  </span>
                </div>

                {/* Probability bar */}
                <ProbabilityBar
                  homeWin={result.homeWinProb}
                  draw={result.drawProb}
                  awayWin={result.awayWinProb}
                  homeTeam={homeTeam.shortName}
                  awayTeam={awayTeam.shortName}
                />
              </div>

              {/* Team comparison */}
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-4 h-4 text-gold" aria-hidden="true" />
                  <p className="text-xs font-heading font-semibold text-slate-400 uppercase tracking-wider">Team Comparison</p>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Overall Strength', home: homeTeam.strength, away: awayTeam.strength },
                    { label: 'Attack Rating',   home: homeTeam.attack,   away: awayTeam.attack   },
                    { label: 'Defense Rating',  home: homeTeam.defense,  away: awayTeam.defense  },
                  ].map(({ label, home, away }) => {
                    const total = home + away;
                    return (
                      <div key={label}>
                        <div className="flex justify-between text-[10px] font-heading text-slate-600 uppercase tracking-wider mb-1.5">
                          <span className={home > away ? 'text-gold' : ''}>{home}</span>
                          <span>{label}</span>
                          <span className={away > home ? 'text-gold' : ''}>{away}</span>
                        </div>
                        <div className="flex h-2 rounded-full overflow-hidden gap-px">
                          <div className="bg-gold transition-all duration-700" style={{ width: `${home / total * 100}%` }} />
                          <div className="bg-blue-500 transition-all duration-700" style={{ width: `${away / total * 100}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Form comparison */}
              <div className="glass-card p-5">
                <p className="text-xs font-heading font-semibold text-slate-400 uppercase tracking-wider mb-4">Recent Form (last 5)</p>
                <div className="grid grid-cols-2 gap-6">
                  {[homeTeam, awayTeam].map(team => (
                    <div key={team.id} className="flex flex-col gap-2">
                      <span className="text-xs font-heading font-semibold text-white">{team.shortName}</span>
                      <div className="flex gap-1.5">
                        {team.form.map((r, i) => (
                          <div key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-heading font-bold ${
                            r === 'W' ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : r === 'D' ? 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>{r}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confidence breakdown */}
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-gold" aria-hidden="true" />
                  <p className="text-xs font-heading font-semibold text-slate-400 uppercase tracking-wider">Prediction Confidence</p>
                </div>
                <StatBar label="Model Confidence" value={result.confidence} color="bg-gold" />
                <p className="text-xs text-slate-600 mt-3 font-body">
                  Confidence is derived from the strength differential, historical form, and predicted goal margin between the two teams.
                </p>
              </div>
            </div>
          )}

          {!homeTeam && !awayTeam && !result && (
            <RevealSection>
              <div className="glass-card p-10 text-center text-slate-600 font-body">
                Select two teams above to generate a prediction.
              </div>
            </RevealSection>
          )}
        </div>
      </div>
    </div>
  );
}
