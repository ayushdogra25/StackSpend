create table audits (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text,
  company_name text,
  report_slug text not null unique,
  team_profile jsonb not null,
  stack jsonb not null,
  computed_result jsonb not null
);

create table leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  report_slug text,
  source text not null,
  wants_pricing_alerts boolean not null default false
);

create table public_reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  report_slug text not null unique,
  annual_savings integer not null,
  monthly_savings integer not null,
  score integer not null,
  tools jsonb not null,
  charts jsonb not null,
  summary text not null
);
