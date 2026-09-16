-- Content tables for the marketing site: blog posts, pricing plans, and FAQs.
-- All tables are public-read (RLS "Public read access" policy) since this is
-- public marketing content; writes are intended to go through the service
-- role key only (no anon/authenticated write policies are defined).

-- ---------------------------------------------------------------------------
-- Blog posts
-- ---------------------------------------------------------------------------
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  category text not null,
  category_color text not null default 'text-accent',
  published_at date not null default current_date,
  read_minutes integer not null default 5,
  image_url text not null,
  featured boolean not null default false,
  content text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_slug_idx on public.blog_posts (slug);
create index if not exists blog_posts_featured_idx on public.blog_posts (featured);

alter table public.blog_posts enable row level security;

create policy "Public read access" on public.blog_posts
  for select
  to anon, authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- Pricing plans
-- ---------------------------------------------------------------------------
create table if not exists public.pricing_plans (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  price numeric(10, 2) not null,
  billing_period text not null default 'month',
  description text not null,
  cta_label text not null default 'Get Started',
  featured boolean not null default false,
  badge text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists pricing_plans_sort_order_idx on public.pricing_plans (sort_order);

alter table public.pricing_plans enable row level security;

create policy "Public read access" on public.pricing_plans
  for select
  to anon, authenticated
  using (true);

create table if not exists public.pricing_plan_features (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.pricing_plans (id) on delete cascade,
  label text not null,
  extra_note text,
  sort_order integer not null default 0
);

create index if not exists pricing_plan_features_plan_id_idx on public.pricing_plan_features (plan_id);

alter table public.pricing_plan_features enable row level security;

create policy "Public read access" on public.pricing_plan_features
  for select
  to anon, authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- FAQs
-- ---------------------------------------------------------------------------
create table if not exists public.faq_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sort_order integer not null default 0
);

alter table public.faq_categories enable row level security;

create policy "Public read access" on public.faq_categories
  for select
  to anon, authenticated
  using (true);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.faq_categories (id) on delete set null,
  question text not null,
  answer text not null,
  sort_order integer not null default 0
);

create index if not exists faqs_category_id_idx on public.faqs (category_id);

alter table public.faqs enable row level security;

create policy "Public read access" on public.faqs
  for select
  to anon, authenticated
  using (true);
