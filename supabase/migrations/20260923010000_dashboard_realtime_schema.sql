-- Backs the Student Dashboard with real tables instead of illustrative
-- data. Everything here is additive/empty by default — no feature yet
-- writes real study plans or mastery data, so the app is expected to read
-- these tables, find them empty for most users, and fall back to sensible
-- defaults (handled in application code, not here).

-- ---------------------------------------------------------------------------
-- profiles: dashboard-facing fields
-- ---------------------------------------------------------------------------
alter table public.profiles
  add column if not exists nclex_exam_date date,
  add column if not exists current_streak integer not null default 0,
  add column if not exists overall_readiness_pct numeric(5, 2),
  add column if not exists daily_study_goal_minutes integer not null default 30;

alter table public.profiles
  add constraint profiles_current_streak_check check (current_streak >= 0),
  add constraint profiles_readiness_pct_check
    check (overall_readiness_pct is null or (overall_readiness_pct >= 0 and overall_readiness_pct <= 100)),
  add constraint profiles_daily_goal_check check (daily_study_goal_minutes > 0);

-- ---------------------------------------------------------------------------
-- user_mastery: subject-level rollup (e.g. Pharmacology, Med-Surg)
-- ---------------------------------------------------------------------------
create table if not exists public.user_mastery (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  subject text not null,
  total_questions integer not null default 0,
  correct_questions integer not null default 0,
  is_weak_area boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (user_id, subject),
  constraint user_mastery_counts_check check (correct_questions <= total_questions)
);

create index if not exists user_mastery_user_id_idx on public.user_mastery (user_id);

alter table public.user_mastery enable row level security;

create policy "Users can view own mastery" on public.user_mastery
  for select to authenticated using (auth.uid() = user_id);
create policy "Users can insert own mastery" on public.user_mastery
  for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can update own mastery" on public.user_mastery
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create trigger user_mastery_set_updated_at
  before update on public.user_mastery
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- user_topic_mastery: topic-level detail within a subject
-- (e.g. Pharmacology → Anticoagulants)
-- ---------------------------------------------------------------------------
create table if not exists public.user_topic_mastery (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  subject text not null,
  topic text not null,
  total_questions integer not null default 0,
  correct_questions integer not null default 0,
  is_weak_area boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (user_id, subject, topic),
  constraint user_topic_mastery_counts_check check (correct_questions <= total_questions)
);

create index if not exists user_topic_mastery_user_id_idx on public.user_topic_mastery (user_id);

alter table public.user_topic_mastery enable row level security;

create policy "Users can view own topic mastery" on public.user_topic_mastery
  for select to authenticated using (auth.uid() = user_id);
create policy "Users can insert own topic mastery" on public.user_topic_mastery
  for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can update own topic mastery" on public.user_topic_mastery
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create trigger user_topic_mastery_set_updated_at
  before update on public.user_topic_mastery
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- study_plans + study_plan_items: the daily plan (4 blocks/day)
-- ---------------------------------------------------------------------------
create table if not exists public.study_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  plan_date date not null default current_date,
  estimated_minutes integer not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, plan_date)
);

create index if not exists study_plans_user_id_plan_date_idx on public.study_plans (user_id, plan_date);

alter table public.study_plans enable row level security;

create policy "Users can view own study plans" on public.study_plans
  for select to authenticated using (auth.uid() = user_id);
create policy "Users can insert own study plans" on public.study_plans
  for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can update own study plans" on public.study_plans
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.study_plan_items (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.study_plans (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  sort_order integer not null default 0,
  item_type text not null check (item_type in ('practice', 'lesson', 'case_study', 'review')),
  subject text,
  topic text,
  title text not null,
  meta text,
  reason_assigned text,
  action_label text not null default 'Start',
  is_completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists study_plan_items_plan_id_idx on public.study_plan_items (plan_id);
create index if not exists study_plan_items_user_id_idx on public.study_plan_items (user_id);

alter table public.study_plan_items enable row level security;

create policy "Users can view own plan items" on public.study_plan_items
  for select to authenticated using (auth.uid() = user_id);
create policy "Users can insert own plan items" on public.study_plan_items
  for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can update own plan items" on public.study_plan_items
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- activity_events: append-only log of user interactions
-- ---------------------------------------------------------------------------
create table if not exists public.activity_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists activity_events_user_id_created_at_idx
  on public.activity_events (user_id, created_at desc);

alter table public.activity_events enable row level security;

create policy "Users can view own activity" on public.activity_events
  for select to authenticated using (auth.uid() = user_id);
create policy "Users can insert own activity" on public.activity_events
  for insert to authenticated with check (auth.uid() = user_id);
-- No update/delete policies — this is an immutable log.
