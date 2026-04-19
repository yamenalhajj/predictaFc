const BASE = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? 'http://localhost:8000' : 'https://predictafc-2.onrender.com');

export interface ApiMatch {
  id: string;
  group?: string;
  matchday?: number;
  stage: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  probHomeWin: number;
  probDraw: number;
  probAwayWin: number;
  confidence: string;
  winner: string | null;
  date?: string;
}

export interface ApiStanding {
  team: string;
  W: number; D: number; L: number;
  GF: number; GA: number; GD: number; Pts: number;
}

export async function fetchGroupMatches(): Promise<{
  groupMatches: ApiMatch[];
  standings: Record<string, ApiStanding[]>;
}> {
  const res = await fetch(`${BASE}/group_matches`);
  if (!res.ok) throw new Error('Failed to fetch group matches');
  return res.json();
}

export async function fetchKnockout(): Promise<{
  knockoutMatches: ApiMatch[];
  champion: string;
}> {
  const res = await fetch(`${BASE}/knockout`);
  if (!res.ok) throw new Error('Failed to fetch knockout matches');
  return res.json();
}

export async function fetchPredict(homeTeam: string, awayTeam: string): Promise<ApiMatch & { homeTeam: string; awayTeam: string }> {
  const res = await fetch(`${BASE}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ home_team: homeTeam, away_team: awayTeam }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Prediction failed');
  return data;
}
