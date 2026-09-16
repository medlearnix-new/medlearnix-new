-- Seed the content tables with the site's initial editorial content.

-- ---------------------------------------------------------------------------
-- Blog posts
-- ---------------------------------------------------------------------------
insert into public.blog_posts
  (slug, title, excerpt, category, category_color, published_at, read_minutes, image_url, featured, content)
values
  (
    'ngn-case-studies-with-confidence',
    'How to Approach Next-Gen NCLEX (NGN) Case Studies with Confidence',
    'Master the layers of clinical judgment. Learn how to differentiate complex metabolic crises like DKA vs HHS using our systematic AI-assisted framework.',
    'Featured',
    'text-[#0b121d] bg-accent',
    '2026-09-12',
    6,
    '/images/blog-featured.jpg',
    true,
    array[
      'Next Generation NCLEX (NGN) case studies test more than recall — they test the full arc of clinical judgment: recognizing cues, analyzing data, prioritizing hypotheses, generating solutions, taking action, and evaluating outcomes.',
      'The biggest mistake candidates make is jumping straight to an intervention without first separating relevant cues from noise. Before you touch a single answer option, build a short mental (or scratch-pad) summary of what the vitals, labs, and history are actually telling you.',
      'Take DKA versus HHS as an example. Both present with hyperglycemia and dehydration, but the presence of ketones and metabolic acidosis in DKA — versus the extreme glucose levels and preserved insulin in HHS — should drive completely different prioritization on an NGN case study.',
      'Our AI-assisted framework walks you through each of the six clinical judgment cognitive skills individually, so you build the habit of slowing down and reasoning in layers rather than pattern-matching to the first plausible answer.',
      'Practice this systematically across our full library of NGN item types — case studies, trend analyses, and priority interventions — and the format stops being intimidating well before test day.'
    ]
  ),
  (
    'hhs-vs-dka-clinical-scenarios',
    'Mastering Hyperosmolar Hyperglycemic State (HHS) vs. DKA',
    'Understand the critical differences in onset, glucose levels, and treatment protocols for these endocrine emergencies.',
    'Clinical Scenarios',
    'text-[#16a34a]',
    '2026-09-08',
    8,
    '/images/blog-hhs-dka.jpg',
    false,
    array[
      'HHS and DKA are both acute complications of diabetes, but they diverge sharply in onset, presentation, and management — and NCLEX loves to test that divergence.',
      'DKA typically develops rapidly, over hours, most often in Type 1 diabetics, and is defined by ketosis and metabolic acidosis. HHS develops over days, is more common in Type 2 diabetics, and presents with extreme hyperglycemia (often over 600 mg/dL) without significant ketosis.',
      'Fluid resuscitation is the first priority in both conditions, but insulin therapy timing and electrolyte monitoring — particularly potassium — differ enough that memorizing a single unified protocol will trip you up on exam day.',
      'Use side-by-side comparison tables while you study, and pressure-test your recall with case-study style questions that force you to identify which condition is in play before you touch the intervention options.'
    ]
  ),
  (
    'dosage-calculation-mistakes',
    '5 Common Dosage Calculation Mistakes (And How to Avoid Them)',
    'Don''t let unit conversions or decimal placements trip you up. Safe medication administration starts with accurate math.',
    'Pharmacology & Dosage',
    'text-[#ea580c]',
    '2026-09-03',
    5,
    '/images/blog-dosage.jpg',
    false,
    array[
      'Dosage calculation errors are one of the most preventable causes of medication mistakes — and one of the most common places nursing students lose points.',
      '1. Misplaced decimals: A single decimal shift can mean a 10x overdose. Always say the number out loud and double check zeros before and after the decimal.',
      '2. Mixing units mid-calculation: Converting mg to mcg (or vice versa) halfway through a problem is a classic trap. Convert everything to the same unit system before you start solving.',
      '3. Ignoring weight-based dosing: Pediatric and critical-care dosing is frequently weight-based. Skipping the weight conversion (lbs to kg) is an easy way to get an answer that looks right but isn''t.',
      '4. Rushing IV drip rate formulas: Always write out the formula in full — volume, time, and drop factor — instead of trying to shortcut it from memory.',
      '5. Not double-checking with dimensional analysis: Even when you''re confident, running the problem a second time using dimensional analysis catches errors your first pass missed.',
      'Our Dosage Calculator tool inside MedLearnix lets you drill these scenarios with instant feedback so the math becomes second nature before it matters at the bedside.'
    ]
  ),
  (
    'nclex-rn-vs-pn-differences',
    'NCLEX-RN vs. NCLEX-PN: Key Differences in Exam Structure',
    'Navigating the scope of practice requirements and how they translate to the computerized adaptive testing algorithm.',
    'Exam Prep',
    'text-[#9333ea]',
    '2026-08-27',
    10,
    '/images/blog-examprep.jpg',
    false,
    array[
      'While both exams are delivered through Computerized Adaptive Testing (CAT), the NCLEX-RN and NCLEX-PN differ in scope, question depth, and the clinical judgment expectations built into each item.',
      'NCLEX-PN focuses on foundational safe, effective care under the direction of an RN or provider — expect more emphasis on basic care and comfort, and structured, protocol-driven interventions.',
      'NCLEX-RN expects a broader scope of independent clinical judgment, including care coordination, delegation, and management of complex, multi-system patient presentations.',
      'Both exams use the same adaptive scoring model: item difficulty adjusts in real time based on your performance, which is exactly what our Smart CAT engine is built to simulate.',
      'Know your track''s blueprint before you start heavy practice — studying PN-level content for an RN exam (or vice versa) wastes valuable prep time on the wrong depth of material.'
    ]
  );

-- ---------------------------------------------------------------------------
-- Pricing plans
-- ---------------------------------------------------------------------------
insert into public.pricing_plans (slug, name, price, billing_period, description, cta_label, featured, badge, sort_order)
values
  ('pro', 'Pro Plan', 49.99, 'month', 'Targeted practice for students focused on core exam review.', 'Start Pro Plan', false, null, 1),
  ('elite', 'Elite Plan', 59.99, 'month', 'Complete access for comprehensive exam preparation and clinical mastery.', 'Get Elite Access', true, 'Most Popular — Best Value', 2);

insert into public.pricing_plan_features (plan_id, label, extra_note, sort_order)
values
  ((select id from public.pricing_plans where slug = 'pro'), '30 Full-Length Practice Exams', null, 1),
  ((select id from public.pricing_plans where slug = 'pro'), 'Unlimited Dosage Calculators', null, 2),
  ((select id from public.pricing_plans where slug = 'pro'), 'Unlimited Drug Reference Tools', null, 3),
  ((select id from public.pricing_plans where slug = 'pro'), 'Unlimited AI Care Plans', null, 4),
  ((select id from public.pricing_plans where slug = 'pro'), '30 AI Patient Simulations', null, 5),
  ((select id from public.pricing_plans where slug = 'pro'), '24/7 AI Assistant Support', null, 6),
  ((select id from public.pricing_plans where slug = 'pro'), 'Standard Performance Analytics', null, 7),
  ((select id from public.pricing_plans where slug = 'elite'), '50 Full-Length Practice Exams', '+20 Extra', 1),
  ((select id from public.pricing_plans where slug = 'elite'), 'Unlimited Dosage Calculators', null, 2),
  ((select id from public.pricing_plans where slug = 'elite'), 'Unlimited Drug Reference Tools', null, 3),
  ((select id from public.pricing_plans where slug = 'elite'), 'Unlimited AI Care Plans', null, 4),
  ((select id from public.pricing_plans where slug = 'elite'), '40 AI Patient Simulations', '+10 Extra', 5),
  ((select id from public.pricing_plans where slug = 'elite'), '24/7 Priority AI Assistant Support', null, 6),
  ((select id from public.pricing_plans where slug = 'elite'), 'Advanced Diagnostic & Weak-Spot Analytics', null, 7);

-- ---------------------------------------------------------------------------
-- FAQ categories + questions
-- ---------------------------------------------------------------------------
insert into public.faq_categories (name, sort_order)
values
  ('Getting Started & Platform', 1),
  ('Exam Preparation & AI Tools', 2),
  ('Pricing & Subscriptions', 3);

insert into public.faqs (category_id, question, answer, sort_order)
values
  (
    (select id from public.faq_categories where name = 'Getting Started & Platform'),
    'Is MedLearnix only for nursing students?',
    'Primarily optimized for NCLEX-RN/PN, but valuable for pre-nursing, NP students, and professionals looking to refresh their clinical knowledge base. Our simulations are built with clinical accuracy at the forefront.',
    1
  ),
  (
    (select id from public.faq_categories where name = 'Getting Started & Platform'),
    'What devices can I use?',
    'MedLearnix is fully responsive across desktop, laptops, tablets, and mobile browsers. Your progress, exam scores, and AI conversations sync automatically across all devices.',
    2
  ),
  (
    (select id from public.faq_categories where name = 'Exam Preparation & AI Tools'),
    'Is MedLearnix good for NGN-style questions?',
    'Yes, supports Next Generation NCLEX formats like case studies, trend analyses, and priority interventions. We focus heavily on clinical judgment measurement models.',
    1
  ),
  (
    (select id from public.faq_categories where name = 'Exam Preparation & AI Tools'),
    'How does Smart CAT work?',
    'Our Computerized Adaptive Testing (CAT) replicates the actual NCLEX scoring algorithm, adjusting item difficulty in real-time based on your performance to give you the most accurate "Ready-to-Pass" score.',
    2
  ),
  (
    (select id from public.faq_categories where name = 'Exam Preparation & AI Tools'),
    'What AI tools are included?',
    'Dosage Calculator, Drug Tool, AI Care Plan, AI Simulation, and AI Talk — our full AI suite is available across every paid plan.',
    3
  ),
  (
    (select id from public.faq_categories where name = 'Pricing & Subscriptions'),
    'Can I cancel anytime?',
    'Yes, you have full control. Cancel, pause, or switch your plan anytime directly from your account settings. There are no long-term contracts or hidden fees.',
    1
  ),
  (
    (select id from public.faq_categories where name = 'Pricing & Subscriptions'),
    'Money-back guarantee?',
    'We offer a Pass Guarantee. If you use our Elite plan and don''t pass your NCLEX, we provide a full refund or free subscription extension. Terms apply based on study completion metrics.',
    2
  );
