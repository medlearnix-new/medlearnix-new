-- Per-user profile + onboarding data. Supabase's auth.users table is
-- managed by GoTrue and shouldn't be extended directly, so onboarding
-- answers live in a public.profiles table keyed 1:1 to auth.users.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text,
  level text check (level in ('beginner', 'intermediate', 'advanced')),
  preparation_target text check (preparation_target in ('nclex', 'nursing_school_exams', 'both')),
  struggle_areas text[] not null default '{}',
  selected_plan text references public.pricing_plans (slug),
  onboarding_completed boolean not null default false,
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile" on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

-- Keep updated_at current on every write.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

-- Auto-create a profile row whenever a new auth user is created, seeded
-- from their signup metadata (full_name is set in SignupForm's signUp call).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Backfill profiles for any existing auth users created before this
-- migration (safe no-op if there are none).
insert into public.profiles (id, full_name, email)
select id, raw_user_meta_data ->> 'full_name', email
from auth.users
on conflict (id) do nothing;
