import { Standing, getTeam, flagUrl } from '../data/worldcup';

interface Props {
  standings: Standing[];
  groupLabel: string;
}

export default function GroupTable({ standings, groupLabel }: Props) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-2">
        <div className="w-6 h-6 rounded bg-gold/15 border border-gold/25 flex items-center justify-center">
          <span className="text-[10px] font-heading font-bold text-gold">{groupLabel}</span>
        </div>
        <span className="font-heading text-xs font-semibold text-slate-400 tracking-wider uppercase">Group {groupLabel}</span>
        <span className="ml-auto text-[10px] text-slate-600 font-heading uppercase tracking-wider">Predicted standings</span>
      </div>
      <table className="w-full" role="table" aria-label={`Group ${groupLabel} predicted standings`}>
        <thead>
          <tr className="border-b border-white/[0.04]">
            <th className="text-left px-4 py-2 text-[10px] font-heading font-semibold text-slate-600 uppercase tracking-wider w-6">#</th>
            <th className="text-left px-2 py-2 text-[10px] font-heading font-semibold text-slate-600 uppercase tracking-wider">Team</th>
            <th className="text-center px-2 py-2 text-[10px] font-heading font-semibold text-slate-600 uppercase tracking-wider">P</th>
            <th className="text-center px-2 py-2 text-[10px] font-heading font-semibold text-slate-600 uppercase tracking-wider">W</th>
            <th className="text-center px-2 py-2 text-[10px] font-heading font-semibold text-slate-600 uppercase tracking-wider">D</th>
            <th className="text-center px-2 py-2 text-[10px] font-heading font-semibold text-slate-600 uppercase tracking-wider">L</th>
            <th className="text-center px-2 py-2 text-[10px] font-heading font-semibold text-slate-600 uppercase tracking-wider hidden sm:table-cell">GD</th>
            <th className="text-center px-4 py-2 text-[10px] font-heading font-semibold text-gold uppercase tracking-wider">PTS</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s, i) => {
            const team = getTeam(s.team);
            const isQualified = i < 2;
            const played = s.W + s.D + s.L;
            return (
              <tr
                key={s.team}
                className={`border-b border-white/[0.03] last:border-0 transition-colors hover:bg-white/[0.02] ${
                  isQualified ? '' : 'opacity-60'
                }`}
              >
                <td className="px-4 py-3">
                  <span className={`text-xs font-heading font-bold ${isQualified ? 'text-gold' : 'text-slate-600'}`}>{i + 1}</span>
                </td>
                <td className="px-2 py-3">
                  <div className="flex items-center gap-2.5">
                    {team && (
                      <img
                        src={flagUrl(team.flagCode, 40)}
                        alt={`${team.name} flag`}
                        className="w-7 h-4 object-cover rounded-sm shrink-0"
                        loading="lazy"
                        onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }}
                      />
                    )}
                    <div className="flex flex-col">
                      <span className="font-heading text-xs font-semibold text-white leading-none">{team?.shortName ?? s.team}</span>
                      <span className="text-[10px] text-slate-600 hidden sm:block">{team?.name ?? s.team}</span>
                    </div>
                  </div>
                </td>
                <td className="text-center px-2 py-3 text-xs font-heading text-slate-400">{played}</td>
                <td className="text-center px-2 py-3 text-xs font-heading text-slate-400">{s.W}</td>
                <td className="text-center px-2 py-3 text-xs font-heading text-slate-400">{s.D}</td>
                <td className="text-center px-2 py-3 text-xs font-heading text-slate-400">{s.L}</td>
                <td className="text-center px-2 py-3 text-xs font-heading text-slate-400 hidden sm:table-cell">
                  <span className={s.GD >= 0 ? 'text-green-500' : 'text-red-500'}>{s.GD >= 0 ? '+' : ''}{s.GD}</span>
                </td>
                <td className="text-center px-4 py-3">
                  <span className="font-heading text-sm font-bold text-white">{s.Pts}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="px-4 py-2 border-t border-white/[0.04] flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-gold/60" />
        <span className="text-[10px] text-slate-600">Top 2 + best 3rd advance to Round of 32</span>
      </div>
    </div>
  );
}
