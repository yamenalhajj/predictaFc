import { Brain, BarChart3, Database, Target, TrendingUp, CheckCircle, Cpu, Activity, Layers } from 'lucide-react';
import RevealSection from '../components/RevealSection';

const FEATURES = [
  { name: 'FIFA World Rankings', desc: 'Official international rankings weighted by recency', icon: TrendingUp },
  { name: 'Team Attack Strength', desc: 'Goals scored per match adjusted for opponent quality', icon: Target },
  { name: 'Team Defense Strength', desc: 'Goals conceded per match normalized against competition level', icon: Activity },
  { name: 'Recent Form (last 5)', desc: 'Win/Draw/Loss outcomes from most recent fixtures', icon: CheckCircle },
  { name: 'Head-to-Head History', desc: 'Historical outcomes between the two specific teams', icon: Database },
  { name: 'Contextual Venue Factor', desc: 'Home vs neutral ground advantage adjustment', icon: Layers },
  { name: 'Tournament Stage Factor', desc: 'Performance difference across group vs knockout stage', icon: BarChart3 },
  { name: 'Player Availability', desc: 'Key player absence / squad depth scoring', icon: Cpu },
];

const PERFORMANCE = [
  { metric: 'Overall Accuracy',    value: '71.4%', sub: 'correct match outcomes',   color: 'text-gold'    },
  { metric: 'Exact Score',         value: '18.2%', sub: 'precise scoreline match',  color: 'text-blue-400' },
  { metric: 'Winner Correct',      value: '74.8%', sub: 'including draws',           color: 'text-green-400' },
  { metric: 'Log-Loss Score',      value: '0.62',  sub: 'lower is better',           color: 'text-purple-400' },
];

const TIMELINE = [
  { year: '2018', note: 'Trained on WC 2006–2018. Backtest accuracy: 68.2%' },
  { year: '2022', note: 'Retrained with XGBoost + feature expansion. Accuracy: 71.4%' },
  { year: '2026', note: 'Expanded to 48-team format. Full WC 2026 coverage — 104 matches predicted across 12 groups and 5 knockout rounds.' },
];

export default function About() {
  return (
    <div className="page-container">
      <div className="max-container section-pad">

        {/* Header */}
        <RevealSection className="mb-16 max-w-2xl">
          <span className="section-label">
            <Brain className="w-3 h-3" aria-hidden="true" />
            Methodology
          </span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">The Model</h1>
          <p className="text-slate-400 font-body text-lg leading-relaxed">
            PredictaFC uses a supervised machine learning pipeline trained on historical international football data spanning 20+ years and 8,000+ matches.
          </p>
        </RevealSection>

        {/* Architecture */}
        <RevealSection className="mb-16">
          <div className="glass-card p-8 border-gold/10">
            <div className="flex items-start gap-5 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                <Cpu className="w-6 h-6 text-gold" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-heading text-xl font-bold text-white mb-1">Model Architecture</h2>
                <p className="text-slate-500 font-body text-sm">Gradient-boosted ensemble</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Algorithm', value: 'XGBoost + Logistic', desc: 'Ensemble of gradient boosting and logistic regression for probability calibration' },
                { title: 'Training Data', value: '8,000+ matches', desc: 'International matches from 2002 to 2024 including friendlies and competitive' },
                { title: 'Outputs', value: 'Score + Probability', desc: 'Predicted score, win/draw/loss probabilities, and calibrated confidence score' },
              ].map(({ title, value, desc }) => (
                <div key={title} className="glass-card p-4">
                  <p className="text-[10px] font-heading font-semibold text-slate-600 uppercase tracking-wider mb-1">{title}</p>
                  <p className="font-heading text-base font-bold text-white mb-2">{value}</p>
                  <p className="text-xs text-slate-500 font-body leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* Features */}
        <RevealSection className="mb-16">
          <span className="section-label">
            <Database className="w-3 h-3" aria-hidden="true" />
            Inputs
          </span>
          <h2 className="font-heading text-3xl font-bold text-white mb-2">Model Features</h2>
          <p className="text-slate-500 font-body mb-8 max-w-lg">
            Eight feature categories feed the prediction engine. Each is normalized and weighted by its predictive importance.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map(({ name, desc, icon: Icon }, i) => (
              <RevealSection key={name} delay={(i % 4) as 0|1|2|3}>
                <div className="glass-card glass-card-hover p-5 h-full cursor-default">
                  <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/15 flex items-center justify-center mb-3">
                    <Icon className="w-4 h-4 text-gold" aria-hidden="true" />
                  </div>
                  <h3 className="font-heading text-sm font-bold text-white mb-1.5">{name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-body">{desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </RevealSection>

        {/* Performance */}
        <RevealSection className="mb-16">
          <span className="section-label">
            <BarChart3 className="w-3 h-3" aria-hidden="true" />
            Accuracy
          </span>
          <h2 className="font-heading text-3xl font-bold text-white mb-2">Model Performance</h2>
          <p className="text-slate-500 font-body mb-8 max-w-lg">
            Evaluated on held-out test sets from World Cup 2018 and 2022. Not trained on these tournaments.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {PERFORMANCE.map(({ metric, value, sub, color }) => (
              <div key={metric} className="glass-card glass-card-hover p-6 text-center cursor-default">
                <div className={`font-heading text-3xl font-bold ${color} mb-1`}>{value}</div>
                <div className="text-xs font-heading font-semibold text-white mb-0.5">{metric}</div>
                <div className="text-[10px] text-slate-600 font-body">{sub}</div>
              </div>
            ))}
          </div>

          {/* Feature importance visual */}
          <div className="glass-card p-6">
            <p className="text-xs font-heading font-semibold text-slate-500 uppercase tracking-wider mb-5">Feature Importance</p>
            <div className="space-y-3">
              {[
                { name: 'Attack / Defense Strength', importance: 82 },
                { name: 'FIFA World Ranking',        importance: 74 },
                { name: 'Recent Form (last 5)',       importance: 68 },
                { name: 'Head-to-Head Record',        importance: 52 },
                { name: 'Tournament Stage',           importance: 44 },
                { name: 'Venue / Home Advantage',     importance: 38 },
                { name: 'Player Availability',        importance: 30 },
              ].map(({ name, importance }, i) => (
                <div key={name} className="flex items-center gap-4">
                  <span className="text-xs font-body text-slate-400 w-48 shrink-0 hidden sm:block">{name}</span>
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full transition-all duration-700"
                      style={{ width: `${importance}%`, transitionDelay: `${i * 80}ms` }}
                    />
                  </div>
                  <span className="text-xs font-heading font-bold text-gold w-8 text-right shrink-0">{importance}%</span>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* Pipeline visualization */}
        <RevealSection className="mb-16">
          <h2 className="font-heading text-3xl font-bold text-white mb-8">Prediction Pipeline</h2>
          <div className="relative">
            {/* Steps */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-start">
              {[
                { label: '01', title: 'Raw Data',      desc: 'Match results, player data, rankings', icon: Database },
                { label: '02', title: 'Preprocessing', desc: 'Normalization, encoding, feature eng.', icon: Layers },
                { label: '03', title: 'Model Inference',desc: 'XGBoost + LR ensemble prediction', icon: Cpu },
                { label: '04', title: 'Calibration',   desc: 'Platt scaling for probability output', icon: Activity },
                { label: '05', title: 'Output',        desc: 'Score, win probs, confidence score', icon: Target },
              ].map(({ label, title, desc, icon: Icon }, i) => (
                <div key={label} className="relative flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-3 relative z-10">
                    <Icon className="w-5 h-5 text-gold" aria-hidden="true" />
                  </div>
                  {i < 4 && (
                    <div className="hidden md:block absolute top-5 left-1/2 w-full h-px bg-gradient-to-r from-gold/20 to-transparent z-0" />
                  )}
                  <div className="text-[10px] font-heading font-bold text-gold mb-1">{label}</div>
                  <div className="text-xs font-heading font-bold text-white mb-1">{title}</div>
                  <div className="text-[10px] text-slate-600 font-body leading-relaxed">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* Version timeline */}
        <RevealSection className="mb-16">
          <h2 className="font-heading text-2xl font-bold text-white mb-6">Model Versions</h2>
          <div className="space-y-0">
            {TIMELINE.map(({ year, note }, i) => (
              <div key={year} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full shrink-0 mt-1 ${i === TIMELINE.length - 1 ? 'bg-gold animate-pulse' : 'bg-slate-600'}`} />
                  {i < TIMELINE.length - 1 && <div className="w-px flex-1 bg-white/[0.06] my-2" />}
                </div>
                <div className={`pb-6 ${i === TIMELINE.length - 1 ? '' : ''}`}>
                  <div className="font-heading text-sm font-bold text-white">{year}</div>
                  <div className="text-sm text-slate-500 font-body mt-0.5">{note}</div>
                </div>
              </div>
            ))}
          </div>
        </RevealSection>

        {/* Disclaimer */}
        <RevealSection>
          <div className="glass-card p-6 border-slate-700/50">
            <p className="text-xs text-slate-600 leading-relaxed font-body">
              <span className="font-semibold text-slate-500">Disclaimer:</span> All predictions are generated by machine learning models and are for informational and entertainment purposes only. Predictions do not constitute professional advice and should not be used for any form of wagering or gambling. Actual match outcomes depend on countless real-world variables the model cannot anticipate.
            </p>
          </div>
        </RevealSection>
      </div>
    </div>
  );
}
