import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState<string | null>(null);
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: err } = await signIn(email, password);
    setLoading(false);
    if (err) { setError(err); return; }
    navigate('/dashboard');
  }

  return (
    <div className="page-container flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md">

        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center">
            <Zap className="w-4 h-4 text-gold" />
          </div>
          <span className="font-heading text-base font-bold">
            <span className="text-white">Predicta</span><span className="gold-text">FC</span>
          </span>
        </div>

        <div className="glass-card p-8 border-white/10">
          <div className="mb-6">
            <h1 className="font-heading text-2xl font-bold text-white mb-1">Welcome back</h1>
            <p className="text-slate-400 text-sm font-body">Your predictions are waiting.</p>
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
                  placeholder="Your password"
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
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-600 font-body mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-gold hover:text-gold-light transition-colors">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
