-- Add a Free tier (needed for onboarding's plan-selection step) and refresh
-- the Pro/Elite feature copy to match the onboarding flow's spec, so
-- /pricing, the FAQ pricing snapshot, and onboarding all read one
-- consistent catalog.

insert into public.pricing_plans (slug, name, price, billing_period, description, cta_label, featured, badge, sort_order)
values (
  'free',
  'Free Plan',
  0.00,
  'forever',
  'Get started with essential NCLEX prep tools at no cost.',
  'Get Started Free',
  false,
  null,
  0
)
on conflict (slug) do nothing;

-- Pro/Elite already exist at sort_order 1/2 — leave plan-level fields as is,
-- only refresh their feature lists below. Free sits before them.

insert into public.pricing_plan_features (plan_id, label, sort_order)
values
  ((select id from public.pricing_plans where slug = 'free'), '5 Practice Questions Daily', 1),
  ((select id from public.pricing_plans where slug = 'free'), 'Basic AI Tutor Access (Daily limits)', 2),
  ((select id from public.pricing_plans where slug = 'free'), 'Standard Study Review Notes', 3),
  ((select id from public.pricing_plans where slug = 'free'), 'Basic Dosage Calculator', 4);

delete from public.pricing_plan_features
where plan_id in (
  select id from public.pricing_plans where slug in ('pro', 'elite')
);

insert into public.pricing_plan_features (plan_id, label, sort_order)
values
  ((select id from public.pricing_plans where slug = 'pro'), '50 Practice Exams & Adaptive Tests', 1),
  ((select id from public.pricing_plans where slug = 'pro'), 'Unlimited 24/7 AI Tutor Access', 2),
  ((select id from public.pricing_plans where slug = 'pro'), 'Full Clinical Case Study Simulations', 3),
  ((select id from public.pricing_plans where slug = 'pro'), 'Advanced Dosage Calculator & Formulas', 4),
  ((select id from public.pricing_plans where slug = 'pro'), 'Personalized Weak-Area Focus Plans', 5),
  ((select id from public.pricing_plans where slug = 'elite'), 'Unlimited NCLEX-RN & NCLEX-PN Practice Exams', 1),
  ((select id from public.pricing_plans where slug = 'elite'), 'Unlimited AI Tutor & Priority AI Generation', 2),
  ((select id from public.pricing_plans where slug = 'elite'), 'Full Clinical Case Simulations with Detailed AI Analysis', 3),
  ((select id from public.pricing_plans where slug = 'elite'), 'Advanced Drug Tool & FDA Database Integration', 4),
  ((select id from public.pricing_plans where slug = 'elite'), 'AI Care Plan Generator', 5),
  ((select id from public.pricing_plans where slug = 'elite'), '1-on-1 Performance Analytics & Readiness Score', 6);
