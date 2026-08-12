-- ============================================================
-- PT PLATFORM DATABASE SCHEMA
-- Run this in Supabase: Project > SQL Editor > New Query > Run
-- ============================================================

-- Clients table (extends Supabase auth.users with business-specific info)
create table clients (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text not null,
  email text not null,
  phone text,
  status text not null default 'new' check (status in ('new', 'active', 'paused', 'cancelled')),
  square_customer_id text,
  square_subscription_id text,
  subscription_status text default 'inactive' check (subscription_status in ('inactive', 'active', 'past_due', 'cancelled')),
  goals text,
  notes text,
  created_at timestamptz not null default now()
);

-- Program templates (reusable, written once, assigned many times)
create table program_templates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  content jsonb not null default '[]'::jsonb, -- structured weeks/days/exercises
  created_at timestamptz not null default now()
);

-- Programs assigned to a specific client (either from a template or fully custom)
create table client_programs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade not null,
  template_id uuid references program_templates(id) on delete set null,
  title text not null,
  content jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  assigned_at timestamptz not null default now()
);

-- Check-ins: scheduled and logged
create table check_ins (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade not null,
  scheduled_at timestamptz not null,
  completed boolean not null default false,
  weight numeric,
  notes text,
  trainer_notes text,
  created_at timestamptz not null default now()
);

-- Row Level Security
alter table clients enable row level security;
alter table program_templates enable row level security;
alter table client_programs enable row level security;
alter table check_ins enable row level security;

-- Clients can see/edit only their own row
create policy "Clients read own row" on clients
  for select using (auth.uid() = id);
create policy "Clients update own row" on clients
  for update using (auth.uid() = id);

-- Clients can see only their own programs
create policy "Clients read own programs" on client_programs
  for select using (auth.uid() = client_id);

-- Clients can see and log their own check-ins
create policy "Clients read own checkins" on check_ins
  for select using (auth.uid() = client_id);
create policy "Clients update own checkins" on check_ins
  for update using (auth.uid() = client_id);

-- NOTE: The trainer (you) will use the Supabase service role key on the
-- server side for the admin dashboard, which bypasses RLS entirely.
-- Never expose the service role key in client-side code.

-- Mark yourself as admin: add an `is_admin` boolean to your own user's
-- row in clients (or check by email) - simplest approach used in this app
-- is an ADMIN_EMAIL environment variable checked in code.
