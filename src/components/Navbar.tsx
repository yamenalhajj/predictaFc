import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Zap, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { to: '/',         label: 'Home'     },
  { to: '/groups',   label: 'Groups'   },
  { to: '/knockout', label: 'Knockout' },
  { to: '/teams',    label: 'Teams'    },
  { to: '/predict',  label: 'Predict'  },
  { to: '/about',    label: 'Model'    },
  { to: '/pricing',  label: 'Pricing'  },
];

export default function Navbar() {
  const [open,     setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, tier, signOut } = useAuth();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const tierBadge: Record<string, string> = { pro: 'Analyst', elite: 'Scout' };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#050508]/90 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-container">
        <div className="flex items-center justify-between h-16 md:h-18">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group cursor-pointer" aria-label="PredictaFC Home">
            <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center group-hover:bg-gold/20 group-hover:border-gold/50 transition-all duration-200">
              <Zap className="w-4 h-4 text-gold" aria-hidden="true" />
            </div>
            <span className="font-heading text-base font-bold tracking-tight">
              <span className="text-white">Predicta</span>
              <span className="gold-text">FC</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-body font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'text-gold bg-gold/10 border border-gold/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Auth area + Mobile toggle */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {tierBadge[tier] && (
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-heading font-bold border border-gold/30 text-gold bg-gold/10">
                    {tierBadge[tier]}
                  </span>
                )}
                <Link
                  to="/dashboard"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 text-slate-300 text-xs hover:border-white/20 hover:text-white transition-colors font-heading font-semibold"
                  aria-label="Dashboard"
                >
                  <User className="w-3.5 h-3.5" />
                  Dashboard
                </Link>
                <button
                  onClick={signOut}
                  className="hidden sm:flex p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:flex px-3 py-2 rounded-lg text-slate-400 text-sm font-body hover:text-white transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="hidden sm:flex btn-primary text-xs px-4 py-2"
                  aria-label="Start free"
                >
                  <Zap className="w-3.5 h-3.5" aria-hidden="true" />
                  Start Free
                </Link>
              </>
            )}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              {open ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-[#050508]/95 backdrop-blur-xl border-t border-white/[0.06] px-4 pt-2 pb-4">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to} to={to} end={to === '/'} onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg text-sm font-body font-medium transition-colors cursor-pointer ${isActive ? 'text-gold bg-gold/10' : 'text-slate-300 hover:text-white hover:bg-white/5'}`
                }
              >
                {label}
              </NavLink>
            ))}
            <div className="border-t border-white/[0.06] mt-2 pt-3 flex flex-col gap-2">
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setOpen(false)} className="px-4 py-3 rounded-lg text-sm font-body text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2">
                    <User className="w-4 h-4" /> Dashboard
                  </Link>
                  <button onClick={() => { signOut(); setOpen(false); }} className="px-4 py-3 rounded-lg text-sm font-body text-slate-400 hover:text-white hover:bg-white/5 flex items-center gap-2 cursor-pointer w-full text-left">
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login"  onClick={() => setOpen(false)} className="px-4 py-3 rounded-lg text-sm font-body text-slate-300 hover:text-white hover:bg-white/5">Sign in</Link>
                  <Link to="/signup" onClick={() => setOpen(false)} className="px-4 py-3 rounded-lg text-sm font-body text-gold bg-gold/10 hover:bg-gold/20">Start Free →</Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
