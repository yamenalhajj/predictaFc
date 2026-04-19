import { useState, FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Zap, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState<string | null>(null);
  const [loading,  setLoading]  = useState(false);
  const [done,     setDone]     = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    const { error: err } = await signUp(email, password);
    setLoading(false);
    if (err) { setError(err); return; }
    setDone(true);
    const redirect = params.get('redirect');
    setTimeout(() => navigate(redirect ? `/${redirect}` : '/dashboard'), 1500);
  }

  return (
    <div className="page-container flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center">
            <Zap className="w-4 h-4 text-gold" />
          </div>
          <span className="font-heading text-base font-bold">
            <span className="text-white">Predicta</span><span className="gold-text">FC</span>
          </span>
        </div>

        <div className="glass-card p-8 border-white/10">
          {done ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-green-400" />
              </div>
              <p className="font-heading text-white font-bold mb-1">Check your email</p>
              <p className="text-slate-400 text-sm font-body">We sent you a confirmation link. Click it to activate your account.</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="font-heading text-2xl font-bold text-white mb-1">Join PredictaFC</h1>
                <p className="text-slate-400 text-sm font-body">Free to start. No credit card required.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-heading font-semibold text-slate-400 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input
                      type="email" required value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 font-body focus:outline-none focus:border-gold/40 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-heading font-semibold text-slate-400 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input
                      type="password" required value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 font-body focus:outline-none focus:border-gold/40 transition-colors"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-400 font-body">{error}</p>
                  </div>
                )}

                <button
                  type="submit" disabled={loading}
                  className="w-full btn-primary py-3 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating account…' : 'Create Free Account'}
                </button>
              </form>

              <p className="text-center text-xs text-slate-600 font-body mt-6">
                Already have an account?{' '}
                <Link to="/login" className="text-gold hover:text-gold-light transition-colors">Sign in</Link>
              </p>
            </>
          )}
        </div>

        <p className="text-center text-[10px] text-slate-700 font-body mt-4">
          By signing up you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
