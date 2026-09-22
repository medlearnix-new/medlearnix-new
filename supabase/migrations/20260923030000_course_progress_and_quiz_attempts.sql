-- Student progress tracking for the course/quiz-taking experience:
-- enrollments, per-module lock/progress state, and quiz attempt history
-- (which also feeds user_mastery / user_topic_mastery on completion).

-- ---------------------------------------------------------------------------
-- course_enrollments
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'enrollment_status') then
    create type public.enrollment_status as enum ('in_progress', 'completed');
  end if;
end $$;

create table if not exists public.course_enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  status public.enrollment_status not null default 'in_progress',
  progress_pct integer not null default 0 check (progress_pct between 0 and 100),
  enrolled_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (user_id, course_id)
);

create index if not exists course_enrollments_user_id_idx on public.course_enrollments (user_id);

alter table public.course_enrollments enable row level security;

create policy "Users can view own enrollments" on public.course_enrollments
  for select to authenticated using (auth.uid() = user_id);
create policy "Users can insert own enrollments" on public.course_enrollments
  for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can update own enrollments" on public.course_enrollments
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Admins can view all enrollments" on public.course_enrollments
  for select to authenticated using (public.is_admin());

-- ---------------------------------------------------------------------------
-- module_progress
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'module_progress_status') then
    create type public.module_progress_status as enum ('locked', 'active', 'completed');
  end if;
end $$;

create table if not exists public.module_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  module_id uuid not null references public.course_modules (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  status public.module_progress_status not null default 'locked',
  best_score_pct integer check (best_score_pct between 0 and 100),
  attempts_count integer not null default 0,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, module_id)
);

create index if not exists module_progress_user_id_course_id_idx on public.module_progress (user_id, course_id);

alter table public.module_progress enable row level security;

create policy "Users can view own module progress" on public.module_progress
  for select to authenticated using (auth.uid() = user_id);
create policy "Users can insert own module progress" on public.module_progress
  for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can update own module progress" on public.module_progress
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Admins can view all module progress" on public.module_progress
  for select to authenticated using (public.is_admin());

create trigger module_progress_set_updated_at
  before update on public.module_progress
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- quiz_attempts + quiz_attempt_answers
-- ---------------------------------------------------------------------------
create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  module_id uuid not null references public.course_modules (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  total_questions integer not null default 0,
  correct_count integer not null default 0,
  score_pct integer,
  passed boolean,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists quiz_attempts_user_id_module_id_idx on public.quiz_attempts (user_id, module_id);

alter table public.quiz_attempts enable row level security;

create policy "Users can view own quiz attempts" on public.quiz_attempts
  for select to authenticated using (auth.uid() = user_id);
create policy "Users can insert own quiz attempts" on public.quiz_attempts
  for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can update own quiz attempts" on public.quiz_attempts
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Admins can view all quiz attempts" on public.quiz_attempts
  for select to authenticated using (public.is_admin());

create table if not exists public.quiz_attempt_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.quiz_attempts (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  question_id uuid not null references public.questions (id) on delete cascade,
  question_answer_id uuid not null references public.question_answers (id) on delete cascade,
  is_correct boolean not null,
  subject text,
  topic text,
  created_at timestamptz not null default now(),
  unique (attempt_id, question_id)
);

create index if not exists quiz_attempt_answers_attempt_id_idx on public.quiz_attempt_answers (attempt_id);
create index if not exists quiz_attempt_answers_user_id_idx on public.quiz_attempt_answers (user_id);

alter table public.quiz_attempt_answers enable row level security;

create policy "Users can view own quiz answers" on public.quiz_attempt_answers
  for select to authenticated using (auth.uid() = user_id);
create policy "Users can insert own quiz answers" on public.quiz_attempt_answers
  for insert to authenticated with check (auth.uid() = user_id);
create policy "Admins can view all quiz answers" on public.quiz_attempt_answers
  for select to authenticated using (public.is_admin());
