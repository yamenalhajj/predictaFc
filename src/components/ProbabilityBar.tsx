import { useEffect, useState } from 'react';

interface Props {
  homeWin: number;
  draw: number;
  awayWin: number;
  homeTeam: string;
  awayTeam: string;
  animate?: boolean;
}

export default function ProbabilityBar({ homeWin, draw, awayWin, homeTeam, awayTeam, animate = true }: Props) {
  const [mounted, setMounted] = useState(!animate);
  useEffect(() => { if (animate) { const t = setTimeout(() => setMounted(true), 100); return () => clearTimeout(t); } }, [animate]);

  const hw = mounted ? homeWin : 0;
  const dw = mounted ? draw : 0;
  const aw = mounted ? awayWin : 0;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-heading text-slate-500 uppercase tracking-wider">
        <span>{homeTeam}</span>
        <span>Draw</span>
        <span>{awayTeam}</span>
      </div>
      <div className="flex rounded-full overflow-hidden h-2 gap-px">
        <div
          className="bg-green-500 transition-all duration-700 ease-out"
          style={{ width: `${hw}%` }}
          title={`${homeTeam} win: ${homeWin}%`}
        />
        <div
          className="bg-slate-500 transition-all duration-700 ease-out delay-100"
          style={{ width: `${dw}%` }}
          title={`Draw: ${draw}%`}
        />
        <div
          className="bg-blue-500 transition-all duration-700 ease-out delay-200"
          style={{ width: `${aw}%` }}
          title={`${awayTeam} win: ${awayWin}%`}
        />
      </div>
      <div className="flex justify-between text-xs font-heading font-semibold">
        <span className="text-green-400">{homeWin}%</span>
        <span className="text-slate-400">{draw}%</span>
        <span className="text-blue-400">{awayWin}%</span>
      </div>
    </div>
  );
}
