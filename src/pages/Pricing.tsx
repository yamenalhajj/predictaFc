import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Check, X, Zap, BarChart3, Upload, Key, Star } from 'lucide-react';
import RevealSection from '../components/RevealSection';
import { useAuth } from '../context/AuthContext';
import { type Tier } from '../lib/supabase';

const PLANS: {
  id: Tier;
  name: string;
  price: string;
  priceId: string | null;
  tagline: string;
  popular: boolean;
  cta: string;
  color: string;
  features: { text: string; included: boolean }[];
}[] = [
    {
      id: 'free',
      name: 'Spectator',
      price: '$0',
      priceId: null,
      tagline: 'Everything you need to follow the predictions.',
      popular: false,
      cta: 'Start Free — No Card Needed',
      color: 'border-white/10',
      features: [
        { text: '5 custom predictions / day', included: true },
        { text: 'Group stage predictions (72 matches)', included: true },
        { text: 'Knockout bracket predictions', included: true },
        { text: 'Team analytics & rankings', included: true },
        { text: 'Custom data CSV upload', included: false },
        { text: 'AI predictions using your data', included: false },
        { text: 'API key access', included: false },
        { text: 'Priority support', included: false },
      ],
    },
    {
      id: 'pro',
      name: 'Analyst',
      price: '$7',
      priceId: import.meta.env.VITE_STRIPE_PRICE_PRO,
      tagline: 'For fans who want to go deeper.',
      popular: true,
      cta: 'Get Analyst — $7/month',
      color: 'border-gold/40',
      features: [
        { text: '75 custom predictions / day', included: true },
        { text: 'Group stage predictions (72 matches)', included: true },
        { text: 'Knockout bracket predictions', included: true },
        { text: 'Team analytics & rankings', included: true },
        { text: '1 CSV upload (up to 10 MB)', included: true },
        { text: 'AI predictions using your data', included: true },
        { text: 'API key access', included: false },
        { text: 'Priority support', included: false },
      ],
    },
    {
      id: 'elite',
      name: 'Scout',
      price: '$15',
      priceId: import.meta.env.VITE_STRIPE_PRICE_ELITE,
      tagline: 'Full access for serious prediction makers.',
      popular: false,
      cta: 'Go Scout — $15/month',
      color: 'border-white/20',
      features: [
        { text: 'Unlimited custom predictions', included: true },
        { text: 'Group stage predictions (72 matches)', included: true },
        { text: 'Knockout bracket predictions', included: true },
        { text: 'Team analytics & rankings', included: true },
        { text: '5 CSV uploads (up to 25 MB each)', included: true },
        { text: 'AI predictions using your data', included: true },
        { text: 'API key access', included: true },
        { text: 'Priority support', included: true },
      ],
    },
  ];

const FAQ = [
  { q: 'What counts as a custom prediction?', a: 'Any time you pick two teams and run a prediction on the /predict page. Group stage and knockout views are pre-computed and don\'t count against your daily limit.' },
  { q: 'How does the CSV upload work?', a: 'Upload a CSV with columns: date, home_team, away_team, home_score, away_score. The AI merges your data with 47,000+ historical matches to sharpen predictions with your local knowledge.' },
  { q: 'Can I cancel anytime?', a: 'Yes. Cancel from your dashboard at any time. You keep access until the end of your billing period.' },
  { q: 'What happens to unused predictions?', a: 'Daily limits reset every 24 hours. They don\'t carry over.' },
  { q: 'Is there a free trial for paid plans?', a: 'The free Spectator tier gives you permanent access to the most popular features. No trial needed — just upgrade when you\'re ready.' },
];

export default function Pricing() {
  const { user, tier } = useAuth();
  const [upgradeModal, setUpgradeModal] = useState<{ name: string, price: string } | null>(null);

  async function handleUpgrade(plan: typeof PLANS[0]) {
    if (!plan.priceId) return;
    if (!user) { window.location.href = '/signup?redirect=pricing'; return; }
    setUpgradeModal({ name: plan.name, price: plan.price });
  }

  async function handlePortal() {
    if (!user) return;
    const BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8000' : 'https://predictafc-2.onrender.com');
    const res = await fetch(`${BASE}/create_portal_session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id }),
    });
    const { url } = await res.json();
    if (url) window.location.href = url;
  }

  return (
    <div className="page-container">
      <div className="max-container section-pad">

        {/* Header */}
        <RevealSection className="mb-16 text-center">
          <span className="section-label justify-center">
            <Star className="w-3 h-3" />
            Pricing
          </span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
            Predict Smarter. Pay Less.
          </h1>
          <p className="text-slate-400 font-body text-lg max-w-xl mx-auto">
            Start free. Upgrade when the World Cup gets serious.
          </p>
        </RevealSection>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {PLANS.map((plan) => {
            const isCurrent = tier === plan.id && !!user;
            return (
              <RevealSection key={plan.id} className="relative">
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                    <span className="px-3 py-1 rounded-full text-[10px] font-heading font-bold tracking-wider uppercase bg-gold text-black">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className={`glass-card p-8 h-full flex flex-col border ${plan.color} ${plan.popular ? 'shadow-[0_0_40px_rgba(234,179,8,0.12)]' : ''}`}>
                  <div className="mb-6">
                    <p className="text-xs font-heading font-semibold text-slate-500 uppercase tracking-wider mb-2">{plan.name}</p>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="font-heading text-4xl font-bold text-white">{plan.price}</span>
                      {plan.price !== '$0' && <span className="text-slate-500 font-body text-sm">/month</span>}
                    </div>
                    <p className="text-sm text-slate-400 font-body">{plan.tagline}</p>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li key={f.text} className="flex items-start gap-2.5">
                        {f.included
                          ? <Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                          : <X className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />}
                        <span className={`text-sm font-body ${f.included ? 'text-slate-300' : 'text-slate-600'}`}>{f.text}</span>
                      </li>
                    ))}
                  </ul>

                  {isCurrent ? (
                    plan.id === 'free' ? (
                      <div className="text-center py-3 rounded-xl border border-white/10 text-slate-500 text-sm font-body">Current plan</div>
                    ) : (
                      <button onClick={handlePortal} className="w-full py-3 rounded-xl border border-gold/30 text-gold text-sm font-heading font-semibold hover:bg-gold/10 transition-colors cursor-pointer">
                        Manage Subscription
                      </button>
                    )
                  ) : plan.id === 'free' ? (
                    <Link to={user ? '/dashboard' : '/signup'} className={`block text-center py-3 rounded-xl border border-white/10 text-slate-300 text-sm font-heading font-semibold hover:border-white/20 hover:text-white transition-colors ${user ? 'opacity-50 pointer-events-none' : ''}`}>
                      {plan.cta}
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(plan)}
                      className={`w-full py-3 rounded-xl text-sm font-heading font-semibold transition-all cursor-pointer ${plan.popular ? 'bg-gold text-black hover:bg-gold-light' : 'border border-white/20 text-white hover:border-white/40 hover:bg-white/5'}`}
                    >
                      {plan.cta}
                    </button>
                  )}
                </div>
              </RevealSection>
            );
          })}
        </div>

        {/* Feature detail */}
        <RevealSection className="mb-20">
          <h2 className="font-heading text-2xl font-bold text-white mb-8 text-center">What's included in every plan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Zap, title: 'AI Match Predictions', desc: 'Predicted scores, win/draw/loss probabilities, and a calibrated confidence score for any matchup.' },
              { icon: BarChart3, title: 'Full Tournament View', desc: 'All 72 group stage matches and the complete 5-round knockout bracket — predicted by the model.' },
              { icon: Upload, title: 'Custom Data Upload', desc: 'Upload your own match results CSV. Your data is merged with 47,000+ historical matches. Pro+ only.' },
              { icon: Key, title: 'API Access', desc: 'Programmatic access to all prediction endpoints. Build integrations or automate analysis. Scout only.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass-card p-5">
                <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/15 flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4 text-gold" />
                </div>
                <h3 className="font-heading text-sm font-bold text-white mb-1.5">{title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-body">{desc}</p>
              </div>
            ))}
          </div>
        </RevealSection>

        {/* FAQ */}
        <RevealSection className="mb-16 max-w-2xl mx-auto">
          <h2 className="font-heading text-2xl font-bold text-white mb-8 text-center">Common Questions</h2>
          <div className="space-y-4">
            {FAQ.map(({ q, a }) => (
              <div key={q} className="glass-card p-5">
                <p className="font-heading text-sm font-bold text-white mb-2">{q}</p>
                <p className="text-sm text-slate-500 font-body leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </RevealSection>

        {/* Bottom CTA */}
        <RevealSection className="text-center">
          <div className="relative overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/10 via-gold/5 to-transparent p-10">
            <h2 className="font-heading text-2xl font-bold text-white mb-3">Still unsure? Start for free.</h2>
            <p className="text-slate-400 font-body mb-6 max-w-md mx-auto">
              No credit card. No commitment. 5 free predictions every day, forever.
            </p>
            <Link to={user ? '/predict' : '/signup'} className="btn-primary inline-flex">
              <Zap className="w-4 h-4" />
              {user ? 'Make a Prediction' : 'Create Free Account'}
            </Link>
          </div>
        </RevealSection>

      </div>

      {/* Manual Upgrade Modal */}
      {upgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-card max-w-md w-full p-8 relative animate-fade-in border-gold/30 shadow-[0_0_40px_rgba(234,179,8,0.15)]">
            <button onClick={() => setUpgradeModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-6">
              <Star className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-white mb-2">Upgrade to {upgradeModal.name}</h3>
            <p className="text-slate-300 font-body text-sm leading-relaxed mb-6">
              Automated card payments are temporarily disabled in your region. To unlock the <span className="text-white font-bold">{upgradeModal.name}</span> tier ({upgradeModal.price}/month), please complete your payment manually.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
              <p className="text-xs font-heading font-semibold text-slate-400 uppercase tracking-wider mb-3">Payment Options</p>
              <ul className="space-y-3 text-sm font-body text-slate-300">
                <li className="flex justify-between items-center">
                  <span>PayPal:</span>
                  <span className="text-white font-mono">Yaminabdullah71@gmail.com</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Zain Cash (Jordan):</span>
                  <span className="text-white font-mono">07999547709</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>CliQ (Jordan):</span>
                  <span className="text-white font-mono">YMHB</span>
                </li>
              </ul>
            </div>

            <p className="text-xs text-slate-400 font-body mb-6 text-center">
              After payment, please send an email to <span className="text-gold">upgrade@predictafc.com</span> with your payment screenshot and your account email (<span className="text-white">{user?.email}</span>). We will activate your tier within 12 hours.
            </p>

            <button onClick={() => setUpgradeModal(null)} className="btn-primary w-full justify-center py-3 cursor-pointer">
              I Understand
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
