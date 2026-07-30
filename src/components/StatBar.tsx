import { useEffect, useState } from 'react';

interface Props {
  label: string;
  value: number;
  color?: string;
  animate?: boolean;
}

export default function StatBar({ label, value, color = 'bg-gold', animate = true }: Props) {
  const [w, setW] = useState(animate ? 0 : value);
  useEffect(() => {
    if (!animate) return;
    const t = setTimeout(() => setW(value), 150);
    return () => clearTimeout(t);
  }, [value, animate]);

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-400 font-body">{label}</span>
        <span className="text-xs font-heading font-bold text-white tabular-nums">{value}</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
          style={{ width: `${w}%` }}
        />
      </div>
    </div>
  );
}
