import { Match, getTeam, getPredictedWinner, getConfidenceLabel } from '../data/worldcup';
import TeamFlag from './TeamFlag';
import ProbabilityBar from './ProbabilityBar';
import { TrendingUp } from 'lucide-react';

interface Props {
  match: Match;
  compact?: boolean;
  animate?: boolean;
}

export default function MatchCard({ match, compact = false, animate = true }: Props) {
  const home = getTeam(match.homeTeam);
  const away = getTeam(match.awayTeam);
  const winner = getPredictedWinner(match);
  const conf = getConfidenceLabel(match.confidence);
  const isDraw = !winner || winner === 'Draw';
  const homeWins = winner === match.homeTeam;

  if (compact) {
    return (
      <div className="glass-card glass-card-hover p-4 cursor-pointer">
        <div className="flex items-center justify-between gap-3">
          {/* Home */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <TeamFlag teamId={match.homeTeam} size="sm" />
            <span className={`font-heading text-sm font-semibold truncate ${!isDraw && homeWins ? 'text-white' : 'text-slate-400'}`}>
              {home?.shortName ?? match.homeTeam}
            </span>
          </div>
          {/* Score */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`font-heading text-xl font-bold ${!isDraw && homeWins ? 'text-white' : 'text-slate-400'}`}>
              {match.homeScore}
            </span>
            <span className="text-slate-600 font-heading text-sm">—</span>
            <span className={`font-heading text-xl font-bold ${!isDraw && !homeWins ? 'text-white' : 'text-slate-400'}`}>
              {match.awayScore}
            </span>
          </div>
          {/* Away */}
          <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
            <span className={`font-heading text-sm font-semibold truncate ${!isDraw && !homeWins ? 'text-white' : 'text-slate-400'}`}>
              {away?.shortName ?? match.awayTeam}
            </span>
            <TeamFlag teamId={match.awayTeam} size="sm" />
          </div>
        </div>
        <div className="mt-3">
          <ProbabilityBar
            homeWin={match.probHomeWin}
            draw={match.probDraw}
            awayWin={match.probAwayWin}
            homeTeam={home?.shortName ?? match.homeTeam}
            awayTeam={away?.shortName ?? match.awayTeam}
            animate={animate}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card glass-card-hover p-5 cursor-pointer group">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        {match.group && (
          <span className="text-[10px] font-heading font-semibold tracking-widest text-slate-600 uppercase">
            Group {match.group}
          </span>
        )}
        <div className={`ml-auto flex items-center gap-1.5 text-[10px] font-heading font-semibold px-2 py-0.5 rounded-full border ${conf.color}`}>
          <TrendingUp className="w-2.5 h-2.5" aria-hidden="true" />
          {conf.label} Confidence
        </div>
      </div>

      {/* Teams & Score */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <div className="flex flex-col items-center gap-2 flex-1">
          <TeamFlag teamId={match.homeTeam} size="lg" />
          <span className={`font-heading text-sm font-bold text-center ${!isDraw && homeWins ? 'text-white' : 'text-slate-400'}`}>
            {home?.name ?? match.homeTeam}
          </span>
        </div>

        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className="flex items-center gap-2">
            <span className={`font-heading text-4xl font-bold tabular-nums ${!isDraw && homeWins ? 'text-white' : 'text-slate-500'}`}>
              {match.homeScore}
            </span>
            <span className="text-slate-600 font-heading text-xl">:</span>
            <span className={`font-heading text-4xl font-bold tabular-nums ${!isDraw && !homeWins ? 'text-white' : 'text-slate-500'}`}>
              {match.awayScore}
            </span>
          </div>
          <span className="text-[10px] font-heading text-slate-600 uppercase tracking-wider">Predicted</span>
        </div>

        <div className="flex flex-col items-center gap-2 flex-1">
          <TeamFlag teamId={match.awayTeam} size="lg" />
          <span className={`font-heading text-sm font-bold text-center ${!isDraw && !homeWins ? 'text-white' : 'text-slate-400'}`}>
            {away?.name ?? match.awayTeam}
          </span>
        </div>
      </div>

      {/* Winner label */}
      <div className="flex justify-center mb-4">
        {isDraw ? (
          <span className="draw-badge">Draw Predicted</span>
        ) : (
          <span className="win-badge">
            {winner} Wins
          </span>
        )}
      </div>

      {/* Probability */}
      <ProbabilityBar
        homeWin={match.probHomeWin}
        draw={match.probDraw}
        awayWin={match.probAwayWin}
        homeTeam={home?.shortName ?? match.homeTeam}
        awayTeam={away?.shortName ?? match.awayTeam}
        animate={animate}
      />
    </div>
  );
}
