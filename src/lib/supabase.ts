import { createClient } from '@supabase/supabase-js';

const url  = import.meta.env.VITE_SUPABASE_URL  as string;
const key  = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!url || !key) {
  console.warn('Supabase env vars missing. Auth will not work.');
}

export const supabase = createClient(url ?? '', key ?? '');

export type Tier = 'free' | 'pro' | 'elite';

export interface Profile {
  id: string;
  email: string;
  tier: Tier;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: string;
  predictions_used_today: number;
  predictions_reset_at: string;
  files_uploaded: number;
}

export const TIER_LIMITS: Record<Tier, { predictions: number; files: number; fileSizeMB: number }> = {
  free:  { predictions: 5,         files: 0, fileSizeMB: 0  },
  pro:   { predictions: 75,        files: 1, fileSizeMB: 10 },
  elite: { predictions: 999_999,   files: 5, fileSizeMB: 25 },
};
