import { flagUrl, getTeam } from '../data/worldcup';

interface Props {
  teamId: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showName?: boolean;
  namePosition?: 'bottom' | 'right';
  className?: string;
}

const sizeMap = {
  sm: { img: 40,  px: 'w-6 h-4',  text: 'text-xs'  },
  md: { img: 40,  px: 'w-8 h-5',  text: 'text-sm'  },
  lg: { img: 80,  px: 'w-12 h-8', text: 'text-base' },
  xl: { img: 160, px: 'w-16 h-10',text: 'text-lg'  },
};

export default function TeamFlag({ teamId, size = 'md', showName = false, namePosition = 'bottom', className = '' }: Props) {
  const team = getTeam(teamId);
  const s = sizeMap[size];
  const code = team?.flagCode ?? 'un';
  const name = team?.name ?? teamId;

  const flag = (
    <img
      src={flagUrl(code, s.img * 2)}
      alt={`${name} flag`}
      className={`${s.px} object-cover rounded-sm`}
      loading="lazy"
      onError={(e) => { (e.target as HTMLImageElement).src = `https://flagcdn.com/w40/un.png`; }}
    />
  );

  if (!showName) return <span className={className}>{flag}</span>;

  if (namePosition === 'right') {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        {flag}
        <span className={`font-heading font-semibold ${s.text} text-white`}>{name}</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-1.5 ${className}`}>
      {flag}
      <span className={`font-heading font-semibold ${s.text} text-white text-center leading-tight`}>{team?.shortName ?? teamId}</span>
    </div>
  );
}
