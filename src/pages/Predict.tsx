import { useState, useEffect } from 'react';
import { Zap, Trophy, TrendingUp, RotateCcw, ChevronDown, Activity, AlertCircle } from 'lucide-react';
import { TEAMS, Team, flagUrl, getConfidenceLabel } from '../data/worldcup';
import ProbabilityBar from '../components/ProbabilityBar';
import StatBar from '../components/StatBar';
import RevealSection from '../components/RevealSection';

const TEAM_LIST = [...TEAMS].sort((a, b) => a.name.localeCompare(b.name));
const API_URL = 'http://localhost:8000/predict';

interface Prediction {
  homeScore: number;
  awayScore: number;
  probHomeWin: number;
  probDraw: number;
  probAwayWin: number;
  confidence: string;
  winner: string;
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
              <div className="text-xs text-slate-500">{value.confederation} · {value.ranking.toFixed(0)} pts</div>
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
                  <span className="ml-auto text-xs text-slate-600">{t.ranking.toFixed(0)} pts</span>
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
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    if (!homeTeam || !awayTeam) return;
    setAnimating(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ home_team: homeTeam.name, away_team: awayTeam.name }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'API error');
      }
      const data = await res.json();
      setResult({
        homeScore:   data.homeScore,
        awayScore:   data.awayScore,
        probHomeWin: data.probHomeWin,
        probDraw:    data.probDraw,
        probAwayWin: data.probAwayWin,
        confidence:  data.confidence,
        winner:      data.winner,
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      if (msg.includes('fetch') || msg.includes('Failed')) {
        setError('Cannot reach prediction API. Make sure the Python server is running: python api.py');
      } else {
        setError(msg);
      }
    } finally {
      setAnimating(false);
    }
  };

  const swap = () => {
    const tmp = homeTeam;
    setHomeTeam(awayTeam);
    setAwayTeam(tmp);
    setResult(null);
  };

  const reset = () => { setHomeTeam(null); setAwayTeam(null); setResult(null); setError(null); };

  useEffect(() => {
    if (homeTeam && awayTeam) run();
  }, [homeTeam, awayTeam]);

  const conf = result ? getConfidenceLabel(result.confidence) : null;
  const isDraw = result?.winner === 'Draw' || (result && result.homeScore === result.awayScore);
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
            Pick any two World Cup teams. The ML model — trained on 32,000+ historical matches — predicts the result live.
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
              <button onClick={reset} className="btn-ghost px-4" aria-label="Reset prediction">Reset</button>
            </div>
          </RevealSection>

          {/* Error */}
          {error && (
            <div className="glass-card border-red-500/20 p-4 mb-6 flex items-start gap-3" aria-live="polite">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-heading font-semibold text-red-400 mb-1">Prediction failed</p>
                <p className="text-xs text-slate-500 font-body">{error}</p>
              </div>
            </div>
          )}

          {/* Loading */}
          {animating && (
            <div className="glass-card p-10 text-center mb-6" aria-live="polite">
              <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-3" aria-hidden="true" />
              <p className="text-slate-500 font-body text-sm">Running ML model on 32K+ matches…</p>
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
                  <div className="text-[10px] font-heading text-slate-600 uppercase tracking-wider">ML Model · 32K matches</div>
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
                  <span className={`font-heading text-sm font-bold ${isDraw ? 'text-slate-400' : homeWins ? 'text-green-400' : 'text-blue-400'}`}>
                    {isDraw ? 'Match ends in a Draw' : `${result.winner} wins`}
                  </span>
                </div>

                {/* Probability bar */}
                <ProbabilityBar
                  homeWin={result.probHomeWin}
                  draw={result.probDraw}
                  awayWin={result.probAwayWin}
                  homeTeam={homeTeam.shortName}
                  awayTeam={awayTeam.shortName}
                />
              </div>

              {/* Win probability breakdown */}
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-gold" aria-hidden="true" />
                  <p className="text-xs font-heading font-semibold text-slate-400 uppercase tracking-wider">Win Probabilities</p>
                </div>
                <div className="space-y-3">
                  <StatBar label={`${homeTeam.shortName} Win`} value={result.probHomeWin} color="bg-green-500" />
                  <StatBar label="Draw" value={result.probDraw} color="bg-slate-500" />
                  <StatBar label={`${awayTeam.shortName} Win`} value={result.probAwayWin} color="bg-blue-500" />
                </div>
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
                    { label: 'FIFA Ranking Pts', home: Math.round(homeTeam.ranking / 10), away: Math.round(awayTeam.ranking / 10) },
                  ].map(({ label, home, away }) => {
                    const total = home + away;
                    return (
                      <div key={label}>
                        <div className="flex justify-between text-[10px] font-heading text-slate-600 uppercase tracking-wider mb-1.5">
                          <span className={home > away ? 'text-gold' : ''}>{label === 'FIFA Ranking Pts' ? (home * 10).toFixed(0) : home}</span>
                          <span>{label}</span>
                          <span className={away > home ? 'text-gold' : ''}>{label === 'FIFA Ranking Pts' ? (away * 10).toFixed(0) : away}</span>
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

            </div>
          )}

          {!homeTeam && !awayTeam && !result && (
            <RevealSection>
              <div className="glass-card p-10 text-center text-slate-600 font-body">
                Select two teams above to generate a real ML prediction.
              </div>
            </RevealSection>
          )}
        </div>
      </div>
    </div>
  );
}
