import { Link } from 'react-router-dom';
import { Zap, Upload, Key, TrendingUp, LogOut, Crown, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TIER_LIMITS, type Tier } from '../lib/supabase';
import RevealSection from '../components/RevealSection';
import FileUpload from '../components/FileUpload';

const TIER_LABELS: Record<Tier, string> = {
  free:  'Spectator',
  pro:   'Analyst',
  elite: 'Scout',
};

const TIER_COLORS: Record<Tier, string> = {
  free:  'text-slate-400',
  pro:   'text-gold',
  elite: 'text-blue-400',
};

export default function Dashboard() {
  const { user, profile, tier, signOut, refreshProfile } = useAuth();

  const limits     = TIER_LIMITS[tier];
  const used       = profile?.predictions_used_today ?? 0;
  const usagePct   = tier === 'elite' ? 5 : Math.min(100, (used / limits.predictions) * 100);
  const remaining  = tier === 'elite' ? '∞' : Math.max(0, limits.predictions - used);

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
        <RevealSection className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="section-label">
              <Crown className="w-3 h-3" />
              Dashboard
            </span>
            <h1 className="font-heading text-3xl font-bold text-white">
              {user?.email?.split('@')[0] ?? 'Welcome'}
            </h1>
            <p className="text-slate-500 text-sm font-body mt-0.5">{user?.email}</p>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-slate-400 text-sm hover:text-white hover:border-white/20 transition-colors cursor-pointer font-body"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </RevealSection>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* Plan card */}
          <RevealSection className="glass-card p-6 border-white/10">
            <p className="text-xs font-heading font-semibold text-slate-600 uppercase tracking-wider mb-4">Current Plan</p>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                <Crown className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className={`font-heading text-xl font-bold ${TIER_COLORS[tier]}`}>{TIER_LABELS[tier]}</p>
                <p className="text-xs text-slate-600 font-body">
                  {tier === 'free' ? 'Free forever' : tier === 'pro' ? '$7/month' : '$15/month'}
                </p>
              </div>
            </div>
            {tier === 'free' ? (
              <Link to="/pricing" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gold/10 border border-gold/20 text-gold text-xs font-heading font-semibold hover:bg-gold/20 transition-colors">
                Upgrade to Analyst <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <button onClick={handlePortal} className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-white/10 text-slate-400 text-xs font-heading font-semibold hover:border-white/20 hover:text-white transition-colors cursor-pointer">
                Manage Subscription <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </RevealSection>

          {/* Usage card */}
          <RevealSection className="glass-card p-6 border-white/10">
            <p className="text-xs font-heading font-semibold text-slate-600 uppercase tracking-wider mb-4">Today's Predictions</p>
            <div className="flex items-end justify-between mb-3">
              <span className="font-heading text-3xl font-bold text-white">{used}</span>
              <span className="text-sm text-slate-500 font-body">
                {remaining} remaining
              </span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full transition-all duration-500"
                style={{ width: `${usagePct}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-600 font-body">Resets daily at midnight UTC</p>
            <Link to="/predict" className="flex items-center justify-center gap-2 w-full mt-4 py-2.5 rounded-xl bg-gold/10 border border-gold/20 text-gold text-xs font-heading font-semibold hover:bg-gold/20 transition-colors">
              Make a prediction <Zap className="w-3.5 h-3.5" />
            </Link>
          </RevealSection>

          {/* Files card */}
          <RevealSection className="glass-card p-6 border-white/10">
            <p className="text-xs font-heading font-semibold text-slate-600 uppercase tracking-wider mb-4">Custom Data Files</p>
            {tier === 'free' ? (
              <div className="flex flex-col items-center justify-center h-24 text-center">
                <Upload className="w-8 h-8 text-slate-700 mb-2" />
                <p className="text-xs text-slate-600 font-body mb-3">File upload requires Analyst or Scout</p>
                <Link to="/pricing" className="text-xs text-gold hover:text-gold-light transition-colors font-body">
                  Upgrade to unlock →
                </Link>
              </div>
            ) : (
              <>
                <div className="flex items-end justify-between mb-3">
                  <span className="font-heading text-3xl font-bold text-white">{profile?.files_uploaded ?? 0}</span>
                  <span className="text-sm text-slate-500 font-body">of {limits.files} files</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all"
                    style={{ width: `${Math.min(100, ((profile?.files_uploaded ?? 0) / limits.files) * 100)}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-600 font-body">Max {limits.fileSizeMB} MB per file</p>
              </>
            )}
          </RevealSection>
        </div>

        {/* API Key section — Elite only */}
        {tier === 'elite' && (
          <RevealSection className="glass-card p-6 border-white/10 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
                <Key className="w-4 h-4 text-gold" />
              </div>
              <div>
                <p className="font-heading text-sm font-bold text-white">API Access</p>
                <p className="text-xs text-slate-500 font-body">Use your API key to call prediction endpoints programmatically.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/[0.03] rounded-xl border border-white/10">
              <code className="flex-1 text-xs font-mono text-slate-400 truncate">
                {`Bearer ${user?.id?.slice(0, 8)}...${user?.id?.slice(-8)}`}
              </code>
              <button
                onClick={() => navigator.clipboard.writeText(user?.id ?? '')}
                className="text-xs text-gold hover:text-gold-light transition-colors font-body shrink-0 cursor-pointer"
              >
                Copy key
              </button>
            </div>
            <p className="text-[10px] text-slate-700 font-body mt-2">
              Send as Authorization header: <code className="text-slate-500">Authorization: Bearer YOUR_KEY</code>
            </p>
          </RevealSection>
        )}

        {/* File Upload section — Pro/Elite */}
        {tier !== 'free' && (
          <RevealSection className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-gold" />
              <h2 className="font-heading text-lg font-bold text-white">Custom Data Upload</h2>
            </div>
            <p className="text-sm text-slate-400 font-body mb-6">
              Upload a CSV of match results. The AI merges your data with 47,000+ historical matches and uses it to sharpen predictions.
              Required columns: <code className="text-gold text-xs">date, home_team, away_team, home_score, away_score</code>
            </p>
            <FileUpload
              tier={tier}
              filesUsed={profile?.files_uploaded ?? 0}
              filesLimit={limits.files}
              fileSizeLimitMB={limits.fileSizeMB}
              userId={user?.id ?? ''}
              onUploadComplete={refreshProfile}
            />
          </RevealSection>
        )}

        {/* Quick links */}
        <RevealSection>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { to: '/predict',  label: 'Make Prediction', icon: Zap       },
              { to: '/groups',   label: 'Group Stage',     icon: TrendingUp },
              { to: '/knockout', label: 'Knockout',        icon: Crown      },
              { to: '/pricing',  label: 'Upgrade Plan',    icon: ArrowUpRight },
            ].map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} className="glass-card glass-card-hover p-4 flex flex-col items-center gap-2 text-center">
                <Icon className="w-5 h-5 text-gold" />
                <span className="text-xs font-heading font-semibold text-slate-300">{label}</span>
              </Link>
            ))}
          </div>
        </RevealSection>

      </div>
    </div>
  );
}
