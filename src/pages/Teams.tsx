import { useState, useMemo } from 'react';
import { Search, Shield, TrendingUp, X } from 'lucide-react';
import { TEAMS, Team, flagUrl } from '../data/worldcup';
import StatBar from '../components/StatBar';
import RevealSection from '../components/RevealSection';

const CONFEDERATIONS = ['All', 'UEFA', 'CONMEBOL', 'AFC', 'CONCACAF', 'CAF'];

function FormDot({ result }: { result: string }) {
  const cls = result === 'W' ? 'bg-green-500' : result === 'D' ? 'bg-slate-500' : 'bg-red-500';
  return <div className={`w-2 h-2 rounded-full ${cls}`} title={result} />;
}

function TeamCard({ team, onClick }: { team: Team; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="glass-card glass-card-hover p-5 text-left w-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
      aria-label={`View ${team.name} details`}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <img
          src={flagUrl(team.flagCode, 80)}
          alt={`${team.name} flag`}
          className="w-16 h-10 object-cover rounded"
          loading="lazy"
        />
        <div className="text-right">
          <div className="text-[10px] font-heading text-slate-600 uppercase tracking-wider">FIFA Rank</div>
          <div className="font-heading text-lg font-bold text-gold">#{team.ranking}</div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-heading text-base font-bold text-white">{team.name}</h3>
        <p className="text-xs text-slate-500 font-body">{team.confederation}</p>
      </div>

      <div className="space-y-2 mb-4">
        <StatBar label="Attack" value={team.attack} color="bg-gold" animate={false} />
        <StatBar label="Defense" value={team.defense} color="bg-blue-500" animate={false} />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] text-slate-600 font-heading uppercase tracking-wider mb-1">Form (last 5)</p>
          <div className="flex gap-1">
            {team.form.map((r, i) => <FormDot key={i} result={r} />)}
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-600 font-heading uppercase tracking-wider">Strength</p>
          <p className="font-heading text-xl font-bold gold-text">{team.strength}</p>
        </div>
      </div>
    </button>
  );
}

function TeamModal({ team, onClose }: { team: Team; onClose: () => void }) {
  const formPoints = team.form.reduce((acc, r) => acc + (r === 'W' ? 3 : r === 'D' ? 1 : 0), 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${team.name} details`}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative glass-card border-white/10 max-w-lg w-full p-6 z-10 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <img src={flagUrl(team.flagCode, 160)} alt={`${team.name} flag`} className="w-20 h-14 object-cover rounded-lg" />
          <div>
            <h2 className="font-heading text-2xl font-bold text-white">{team.name}</h2>
            <p className="text-sm text-slate-500 font-body">{team.confederation} · FIFA #{team.ranking}</p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            ['Strength', team.strength, 'text-gold'],
            ['Attack',   team.attack,   'text-green-400'],
            ['Defense',  team.defense,  'text-blue-400'],
          ].map(([label, val, cls]) => (
            <div key={label as string} className="glass-card p-3 text-center">
              <div className={`font-heading text-2xl font-bold ${cls}`}>{val}</div>
              <div className="text-[10px] text-slate-600 font-heading uppercase tracking-wider mt-1">{label as string}</div>
            </div>
          ))}
        </div>

        <div className="space-y-3 mb-6">
          <StatBar label="Attack Rating" value={team.attack} color="bg-green-500" />
          <StatBar label="Defense Rating" value={team.defense} color="bg-blue-500" />
          <StatBar label="Overall Strength" value={team.strength} color="bg-gold" />
        </div>

        {/* Form */}
        <div className="glass-card p-4 mb-4">
          <p className="text-xs font-heading font-semibold text-slate-400 uppercase tracking-wider mb-3">Recent Form (last 5)</p>
          <div className="flex items-center gap-3">
            {team.form.map((r, i) => (
              <div key={i} className={`w-9 h-9 rounded-lg flex items-center justify-center font-heading text-sm font-bold ${
                r === 'W' ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : r === 'D' ? 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>{r}</div>
            ))}
            <div className="ml-auto text-right">
              <div className="font-heading text-lg font-bold text-white">{formPoints}/15</div>
              <div className="text-[10px] text-slate-600">Form pts</div>
            </div>
          </div>
        </div>

        {/* Extra info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card p-3 text-center">
            <div className="font-heading text-2xl font-bold text-gold">{team.ranking.toFixed(0)}</div>
            <div className="text-[10px] text-slate-600 font-heading uppercase tracking-wider mt-1">FIFA Points</div>
          </div>
          <div className="glass-card p-3 text-center">
            <div className="font-heading text-2xl font-bold text-slate-300">Group {team.group}</div>
            <div className="text-[10px] text-slate-600 font-heading uppercase tracking-wider mt-1">WC 2026 Group</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Teams() {
  const [query, setQuery] = useState('');
  const [confFilter, setConfFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'ranking' | 'strength' | 'attack' | 'defense'>('strength');
  const [selected, setSelected] = useState<Team | null>(null);

  const teams = useMemo(() => {
    let list = [...TEAMS];
    if (query) list = list.filter(t => t.name.toLowerCase().includes(query.toLowerCase()) || t.shortName.toLowerCase().includes(query.toLowerCase()));
    if (confFilter !== 'All') list = list.filter(t => t.confederation === confFilter);
    list = list.sort((a, b) => sortBy === 'ranking' ? a.ranking - b.ranking : b[sortBy] - a[sortBy]);
    return list;
  }, [query, confFilter, sortBy]);

  return (
    <div className="page-container">
      <div className="max-container section-pad">

        {/* Header */}
        <RevealSection className="mb-10">
          <span className="section-label">
            <Shield className="w-3 h-3" aria-hidden="true" />
            Analytics
          </span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3">Team Insights</h1>
          <p className="text-slate-500 font-body max-w-xl">
            Explore attack, defense, form, and strength ratings for all 48 WC 2026 teams. Click any card for a detailed breakdown.
          </p>
        </RevealSection>

        {/* Controls */}
        <RevealSection className="mb-8 flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search teams..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 glass-card bg-transparent text-sm text-white placeholder-slate-600 rounded-lg border-white/10 outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-all"
              aria-label="Search teams"
            />
          </div>

          {/* Confederation filter */}
          <div className="flex flex-wrap gap-2">
            {CONFEDERATIONS.map(c => (
              <button
                key={c}
                onClick={() => setConfFilter(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all duration-200 cursor-pointer ${
                  confFilter === c ? 'bg-gold text-black' : 'glass-card text-slate-400 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as typeof sortBy)}
            className="glass-card bg-transparent text-sm text-slate-300 px-3 py-2.5 rounded-lg border-white/10 outline-none focus:border-gold/40 cursor-pointer"
            aria-label="Sort teams by"
          >
            <option value="strength" className="bg-[#0d0d14]">Sort: Strength</option>
            <option value="ranking" className="bg-[#0d0d14]">Sort: FIFA Rank</option>
            <option value="attack" className="bg-[#0d0d14]">Sort: Attack</option>
            <option value="defense" className="bg-[#0d0d14]">Sort: Defense</option>
          </select>
        </RevealSection>

        {/* Top 3 highlight */}
        <RevealSection className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-gold" aria-hidden="true" />
            <p className="text-xs font-heading font-semibold text-slate-500 uppercase tracking-wider">Top Rated Teams</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {Object.values(TEAMS).sort((a, b) => b.strength - a.strength).slice(0, 3).map((team, i) => (
              <button
                key={team.id}
                onClick={() => setSelected(team)}
                className={`glass-card glass-card-hover p-4 text-center cursor-pointer ${i === 0 ? 'border-gold/25' : ''}`}
                aria-label={`View ${team.name} details`}
              >
                <div className={`font-heading text-2xl font-bold mb-1 ${i === 0 ? 'gold-text' : i === 1 ? 'text-slate-300' : 'text-amber-700'}`}>
                  #{i + 1}
                </div>
                <img src={flagUrl(team.flagCode, 80)} alt={`${team.name} flag`} className="w-10 h-7 object-cover rounded mx-auto mb-2" loading="lazy" />
                <div className="font-heading text-xs font-bold text-white">{team.shortName}</div>
                <div className="font-heading text-sm font-bold gold-text mt-1">{team.strength}</div>
              </button>
            ))}
          </div>
        </RevealSection>

        {/* Results count */}
        <RevealSection className="mb-4">
          <p className="text-xs text-slate-600 font-body">{teams.length} teams</p>
        </RevealSection>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {teams.map((team, i) => (
            <RevealSection key={team.id} delay={(i % 4) as 0|1|2|3}>
              <TeamCard team={team} onClick={() => setSelected(team)} />
            </RevealSection>
          ))}
        </div>

        {teams.length === 0 && (
          <RevealSection className="py-20 text-center">
            <p className="text-slate-600 font-body">No teams match your search.</p>
          </RevealSection>
        )}
      </div>

      {selected && <TeamModal team={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
