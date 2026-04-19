import { Link } from 'react-router-dom';
import { ArrowRight, Brain, BarChart3, Trophy, Zap, Target, TrendingUp, ChevronRight, Shield, Activity } from 'lucide-react';
import { GROUP_MATCHES, TEAMS, flagUrl } from '../data/worldcup';
import MatchCard from '../components/MatchCard';
import RevealSection from '../components/RevealSection';

// Pick 3 compelling group stage fixtures (IDs are uppercase e.g. "A3")
const FEATURED_MATCHES = [
  GROUP_MATCHES.find(m => m.group === 'A' && m.matchday === 3)!,
  GROUP_MATCHES.find(m => m.group === 'E' && m.matchday === 3)!,
  GROUP_MATCHES.find(m => m.group === 'C' && m.matchday === 3)!,
].filter(Boolean);

const STATS = [
  { label: 'Model Accuracy',    value: '71.4%', sub: 'on 2022 holdout set', icon: Target    },
  { label: 'Matches Predicted', value: '104+',  sub: '72 group + 32 KO',   icon: BarChart3  },
  { label: 'Teams Analyzed',    value: '48',    sub: 'WC 2026 full field',  icon: Shield     },
  { label: 'Avg Confidence',    value: '74%',   sub: 'across all picks',    icon: Activity   },
];

const HOW_IT_WORKS = [
  { step:'01', title:'Data Ingestion',      desc:'Historical results, FIFA rankings, squad depth, and contextual factors fed into the pipeline.',       icon: Brain      },
  { step:'02', title:'Feature Engineering', desc:'Attack/defense strength, head-to-head records, recent form, and tournament-stage multipliers computed.', icon: BarChart3  },
  { step:'03', title:'Prediction Output',   desc:'XGBoost ensemble outputs predicted scores, win probabilities, and a calibrated confidence score.',       icon: TrendingUp },
];

const TOP_CONTENDERS = [
  { name:'Spain',     odds:'3.0x' },
  { name:'France',    odds:'3.5x' },
  { name:'England',   odds:'4.0x' },
  { name:'Argentina', odds:'4.5x' },
  { name:'Brazil',    odds:'5.0x' },
  { name:'Germany',   odds:'7.0x' },
  { name:'Portugal',  odds:'8.0x' },
  { name:'Morocco',   odds:'12x'  },
];

export default function Landing() {
  return (
    <div className="page-container">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-100 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/5 blur-3xl pointer-events-none" />

        <div className="max-container relative z-10 py-16 pt-24">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold/25 bg-gold/5 mb-8 animate-fade-in">
              <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="text-xs font-heading font-semibold text-gold tracking-wider uppercase">
                FIFA World Cup 2026 · USA / Canada / Mexico · 48 Teams
              </span>
            </div>

            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6">
              <span className="block text-white">Predict the</span>
              <span className="block gold-text">Unpredictable.</span>
            </h1>

            <p className="font-body text-lg sm:text-xl text-slate-400 leading-relaxed max-w-2xl mb-10">
              Machine learning meets the beautiful game. AI-powered score predictions, win probabilities,
              and tournament intelligence for every WC 2026 fixture — across 12 groups and 5 knockout rounds.
            </p>

            <div className="flex flex-wrap gap-4 mb-16">
              <Link to="/predict" className="btn-primary text-base px-8 py-4" aria-label="Make a custom prediction">
                <Zap className="w-4 h-4" aria-hidden="true" />
                Make a Prediction
              </Link>
              <Link to="/groups" className="btn-ghost text-base px-8 py-4" aria-label="View group predictions">
                View 12 Groups
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="flex flex-wrap gap-8">
              {[['71.4%','Prediction Accuracy'],['48','Teams Covered'],['104+','Fixtures Modeled']].map(([val,lab]) => (
                <div key={lab}>
                  <div className="font-heading text-2xl font-bold gold-text">{val}</div>
                  <div className="text-xs text-slate-500 font-body mt-0.5">{lab}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600">
          <span className="text-[10px] font-heading tracking-widest uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-slate-600 to-transparent" />
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────────────── */}
      <section className="border-y border-white/[0.06] bg-surface/50">
        <div className="max-container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(({ label, value, sub, icon: Icon }) => (
              <RevealSection key={label} className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/[0.02] transition-colors cursor-default">
                <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-gold" aria-hidden="true" />
                </div>
                <div>
                  <div className="font-heading text-xl font-bold text-white">{value}</div>
                  <div className="text-xs text-slate-500 leading-tight">{label}</div>
                  <div className="text-[10px] text-slate-700">{sub}</div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Matches ─────────────────────────────────────────── */}
      <section className="section-pad">
        <div className="max-container">
          <RevealSection className="mb-10">
            <span className="section-label"><Zap className="w-3 h-3" aria-hidden="true" />Featured Predictions</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">Highlighted Fixtures</h2>
            <p className="text-slate-500 mt-2 font-body max-w-xl">
              Group stage predictions for the most anticipated WC 2026 match-ups.
            </p>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEATURED_MATCHES.map((match, i) => (
              <RevealSection key={match.id} delay={i as 0|1|2}>
                <MatchCard match={match} />
              </RevealSection>
            ))}
          </div>

          <RevealSection className="mt-8 text-center">
            <Link to="/groups" className="btn-ghost inline-flex" aria-label="See all group predictions">
              See all 72 group matches
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </RevealSection>
        </div>
      </section>

      {/* ── How it Works ─────────────────────────────────────────────── */}
      <section className="section-pad border-t border-white/[0.06]">
        <div className="max-container">
          <RevealSection className="mb-12 text-center">
            <span className="section-label"><Brain className="w-3 h-3" aria-hidden="true" />Methodology</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">How Predictions Work</h2>
            <p className="text-slate-500 mt-3 font-body max-w-xl mx-auto">Three-stage pipeline from raw football data to match outcome forecasts.</p>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map(({ step, title, desc, icon: Icon }, i) => (
              <RevealSection key={step} delay={i as 0|1|2}>
                <div className="glass-card glass-card-hover p-6 relative">
                  <div className="absolute -top-3 left-6 px-2 py-0.5 rounded-full bg-[#050508] border border-gold/25 text-[10px] font-heading font-bold text-gold">{step}</div>
                  <div className="w-11 h-11 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-4 mt-2">
                    <Icon className="w-5 h-5 text-gold" aria-hidden="true" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-white mb-2">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-body">{desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>

          <RevealSection className="mt-8 text-center">
            <Link to="/about" className="btn-ghost inline-flex" aria-label="Full methodology">
              Full methodology <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </RevealSection>
        </div>
      </section>

      {/* ── Top Contenders ───────────────────────────────────────────── */}
      <section className="section-pad border-t border-white/[0.06]">
        <div className="max-container">
          <RevealSection className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="section-label"><Trophy className="w-3 h-3" aria-hidden="true" />Champion Odds</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">Top Contenders</h2>
              <p className="text-slate-500 font-body text-sm mt-1">Model-derived tournament win probabilities</p>
            </div>
            <Link to="/knockout" className="text-sm text-gold hover:text-gold-light transition-colors font-body inline-flex items-center gap-1 cursor-pointer">
              Full bracket <ChevronRight className="w-3 h-3" aria-hidden="true" />
            </Link>
          </RevealSection>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {TOP_CONTENDERS.map(({ name, odds }, i) => {
              const team = TEAMS.find(t => t.name === name);
              if (!team) return null;
              return (
                <RevealSection key={name} delay={(i % 4) as 0|1|2|3}>
                  <div className="glass-card glass-card-hover p-3 flex flex-col items-center gap-2 text-center cursor-pointer">
                    <img src={flagUrl(team.flagCode, 80)} alt={`${team.name} flag`} className="w-12 h-8 object-cover rounded" loading="lazy" />
                    <div>
                      <div className="font-heading text-xs font-bold text-white">{team.shortName}</div>
                    </div>
                    <div className="px-2 py-0.5 rounded-full bg-gold/10 border border-gold/20">
                      <span className="text-[10px] font-heading font-bold text-gold">{odds}</span>
                    </div>
                  </div>
                </RevealSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── WC 2026 Format ───────────────────────────────────────────── */}
      <section className="section-pad border-t border-white/[0.06]">
        <div className="max-container">
          <RevealSection className="mb-10 text-center">
            <span className="section-label"><BarChart3 className="w-3 h-3" aria-hidden="true" />Format</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">New 48-Team Format</h2>
            <p className="text-slate-500 mt-2 font-body max-w-xl mx-auto">
              WC 2026 expands to 48 nations — the biggest World Cup ever, spanning three host nations.
            </p>
          </RevealSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label:'Host Nations',   value:'3',   sub:'USA · Canada · Mexico',    color:'text-gold'      },
              { label:'Teams',          value:'48',  sub:'up from 32 in 2022',        color:'text-blue-400'  },
              { label:'Groups',         value:'12',  sub:'Groups A through L',        color:'text-green-400' },
              { label:'Total Matches',  value:'104', sub:'Group stage + Knockout',    color:'text-purple-400'},
            ].map(({ label, value, sub, color }) => (
              <RevealSection key={label}>
                <div className="glass-card glass-card-hover p-6 text-center cursor-default">
                  <div className={`font-heading text-4xl font-bold mb-1 ${color}`}>{value}</div>
                  <div className="text-sm font-heading font-semibold text-white mb-1">{label}</div>
                  <div className="text-xs text-slate-600 font-body">{sub}</div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────── */}
      <section className="section-pad">
        <div className="max-container">
          <RevealSection>
            <div className="relative overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/10 via-gold/5 to-transparent p-10 md:p-14 text-center">
              <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-50 pointer-events-none" />
              <div className="relative z-10">
                <Trophy className="w-10 h-10 text-gold mx-auto mb-4" aria-hidden="true" />
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-3">Who will lift the trophy in 2026?</h2>
                <p className="text-slate-400 font-body mb-8 max-w-lg mx-auto">
                  Pick any two teams from the 48-nation field and get an instant AI prediction with full probability breakdown.
                </p>
                <Link to="/predict" className="btn-primary text-base px-10 py-4" aria-label="Predict a match now">
                  <Zap className="w-4 h-4" aria-hidden="true" />
                  Predict a Match Now
                </Link>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>
    </div>
  );
}
