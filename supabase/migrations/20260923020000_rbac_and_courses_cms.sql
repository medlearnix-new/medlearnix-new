-- Role-based access control + the Course Management CMS schema.

-- ---------------------------------------------------------------------------
-- profiles.role
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('student', 'admin');
  end if;
end $$;

alter table public.profiles
  add column if not exists role public.user_role not null default 'student';

-- Security-definer helper so RLS policies across many tables can check the
-- current user's role with one call instead of repeating the subquery.
-- Reading auth.uid()'s own profiles row is already permitted by profiles'
-- own "Users can view own profile" policy, so this doesn't bypass anything
-- — it just avoids re-declaring the same EXISTS(...) everywhere.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- courses
-- ---------------------------------------------------------------------------
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  icon_name text,
  total_modules integer not null default 0,
  estimated_hours numeric(5, 1),
  is_published boolean not null default false,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists courses_is_published_idx on public.courses (is_published);

alter table public.courses enable row level security;

create policy "Public can view published courses" on public.courses
  for select to anon, authenticated
  using (is_published = true);
create policy "Admins can view all courses" on public.courses
  for select to authenticated
  using (public.is_admin());
create policy "Admins can insert courses" on public.courses
  for insert to authenticated
  with check (public.is_admin());
create policy "Admins can update courses" on public.courses
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "Admins can delete courses" on public.courses
  for delete to authenticated
  using (public.is_admin());

create trigger courses_set_updated_at
  before update on public.courses
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- course_modules
-- ---------------------------------------------------------------------------
create table if not exists public.course_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  module_number integer not null,
  title text not null,
  description text,
  quiz_questions_count integer not null default 0,
  passing_score_pct integer not null default 80 check (passing_score_pct between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (course_id, module_number)
);

create index if not exists course_modules_course_id_idx on public.course_modules (course_id);

alter table public.course_modules enable row level security;

create policy "Public can view modules of published courses" on public.course_modules
  for select to anon, authenticated
  using (exists (
    select 1 from public.courses c where c.id = course_modules.course_id and c.is_published = true
  ));
create policy "Admins can view all modules" on public.course_modules
  for select to authenticated using (public.is_admin());
create policy "Admins can insert modules" on public.course_modules
  for insert to authenticated with check (public.is_admin());
create policy "Admins can update modules" on public.course_modules
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins can delete modules" on public.course_modules
  for delete to authenticated using (public.is_admin());

create trigger course_modules_set_updated_at
  before update on public.course_modules
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- lessons
-- ---------------------------------------------------------------------------
create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.course_modules (id) on delete cascade,
  lesson_number integer not null,
  title text not null,
  content_markdown text,
  diagram_urls text[] not null default '{}',
  estimated_minutes integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (module_id, lesson_number)
);

create index if not exists lessons_module_id_idx on public.lessons (module_id);

alter table public.lessons enable row level security;

create policy "Public can view lessons of published courses" on public.lessons
  for select to anon, authenticated
  using (exists (
    select 1
    from public.course_modules m
    join public.courses c on c.id = m.course_id
    where m.id = lessons.module_id and c.is_published = true
  ));
create policy "Admins can view all lessons" on public.lessons
  for select to authenticated using (public.is_admin());
create policy "Admins can insert lessons" on public.lessons
  for insert to authenticated with check (public.is_admin());
create policy "Admins can update lessons" on public.lessons
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins can delete lessons" on public.lessons
  for delete to authenticated using (public.is_admin());

create trigger lessons_set_updated_at
  before update on public.lessons
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- questions + question_answers (module quizzes, or standalone Q-Bank items
-- when module_id is null)
-- ---------------------------------------------------------------------------
create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  module_id uuid references public.course_modules (id) on delete cascade,
  subject text,
  topic text,
  prompt text not null,
  rationale_general text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists questions_module_id_idx on public.questions (module_id);

alter table public.questions enable row level security;

create policy "Public can view questions of published courses" on public.questions
  for select to anon, authenticated
  using (
    module_id is null
    or exists (
      select 1
      from public.course_modules m
      join public.courses c on c.id = m.course_id
      where m.id = questions.module_id and c.is_published = true
    )
  );
create policy "Admins can view all questions" on public.questions
  for select to authenticated using (public.is_admin());
create policy "Admins can insert questions" on public.questions
  for insert to authenticated with check (public.is_admin());
create policy "Admins can update questions" on public.questions
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins can delete questions" on public.questions
  for delete to authenticated using (public.is_admin());

create trigger questions_set_updated_at
  before update on public.questions
  for each row execute function public.set_updated_at();

create table if not exists public.question_answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions (id) on delete cascade,
  option_text text not null,
  is_correct boolean not null default false,
  rationale text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists question_answers_question_id_idx on public.question_answers (question_id);

alter table public.question_answers enable row level security;

create policy "Public can view answers of published courses" on public.question_answers
  for select to anon, authenticated
  using (exists (
    select 1
    from public.questions q
    left join public.course_modules m on m.id = q.module_id
    left join public.courses c on c.id = m.course_id
    where q.id = question_answers.question_id
      and (q.module_id is null or c.is_published = true)
  ));
create policy "Admins can view all answers" on public.question_answers
  for select to authenticated using (public.is_admin());
create policy "Admins can insert answers" on public.question_answers
  for insert to authenticated with check (public.is_admin());
create policy "Admins can update answers" on public.question_answers
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins can delete answers" on public.question_answers
  for delete to authenticated using (public.is_admin());
