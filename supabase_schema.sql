-- PredictaFC Supabase Schema
-- Run this in your Supabase SQL Editor: https://app.supabase.com → SQL Editor

-- ── Profiles table ────────────────────────────────────────────────────────────
create table if not exists profiles (
  id                      uuid references auth.users on delete cascade primary key,
  email                   text,
  tier                    text not null default 'free' check (tier in ('free','pro','elite')),
  stripe_customer_id      text,
  stripe_subscription_id  text,
  subscription_status     text default 'inactive',
  predictions_used_today  integer not null default 0,
  predictions_reset_at    date not null default current_date,
  files_uploaded          integer not null default 0,
  created_at              timestamptz default now(),
  updated_at              timestamptz default now()
);

-- ── Row-level security ────────────────────────────────────────────────────────
alter table profiles enable row level security;

create policy "Users can read own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Service-role key (backend) can do anything — no RLS policy needed for it

-- ── Auto-create profile on signup ─────────────────────────────────────────────
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ── Daily prediction reset function ──────────────────────────────────────────
-- Call this via a Supabase scheduled function (cron) or from backend on each request.
create or replace function reset_daily_predictions()
returns void language plpgsql as $$
begin
  update profiles
  set predictions_used_today = 0,
      predictions_reset_at   = current_date
  where predictions_reset_at < current_date;
end;
$$;

-- ── Indexes ───────────────────────────────────────────────────────────────────
create index if not exists profiles_stripe_customer_id_idx on profiles(stripe_customer_id);
create index if not exists profiles_tier_idx on profiles(tier);
