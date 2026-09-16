export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categoryColor: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
  content: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "ngn-case-studies-with-confidence",
    title: "How to Approach Next-Gen NCLEX (NGN) Case Studies with Confidence",
    excerpt:
      "Master the layers of clinical judgment. Learn how to differentiate complex metabolic crises like DKA vs HHS using our systematic AI-assisted framework.",
    category: "Featured",
    categoryColor: "text-[#0b121d] bg-accent",
    date: "Sept 12, 2026",
    readTime: "6 min read",
    image: "/images/blog-featured.jpg",
    featured: true,
    content: [
      "Next Generation NCLEX (NGN) case studies test more than recall — they test the full arc of clinical judgment: recognizing cues, analyzing data, prioritizing hypotheses, generating solutions, taking action, and evaluating outcomes.",
      "The biggest mistake candidates make is jumping straight to an intervention without first separating relevant cues from noise. Before you touch a single answer option, build a short mental (or scratch-pad) summary of what the vitals, labs, and history are actually telling you.",
      "Take DKA versus HHS as an example. Both present with hyperglycemia and dehydration, but the presence of ketones and metabolic acidosis in DKA — versus the extreme glucose levels and preserved insulin in HHS — should drive completely different prioritization on an NGN case study.",
      "Our AI-assisted framework walks you through each of the six clinical judgment cognitive skills individually, so you build the habit of slowing down and reasoning in layers rather than pattern-matching to the first plausible answer.",
      "Practice this systematically across our full library of NGN item types — case studies, trend analyses, and priority interventions — and the format stops being intimidating well before test day.",
    ],
  },
  {
    slug: "hhs-vs-dka-clinical-scenarios",
    title: "Mastering Hyperosmolar Hyperglycemic State (HHS) vs. DKA",
    excerpt:
      "Understand the critical differences in onset, glucose levels, and treatment protocols for these endocrine emergencies.",
    category: "Clinical Scenarios",
    categoryColor: "text-[#16a34a]",
    date: "Sept 8, 2026",
    readTime: "8 min read",
    image: "/images/blog-hhs-dka.jpg",
    content: [
      "HHS and DKA are both acute complications of diabetes, but they diverge sharply in onset, presentation, and management — and NCLEX loves to test that divergence.",
      "DKA typically develops rapidly, over hours, most often in Type 1 diabetics, and is defined by ketosis and metabolic acidosis. HHS develops over days, is more common in Type 2 diabetics, and presents with extreme hyperglycemia (often over 600 mg/dL) without significant ketosis.",
      "Fluid resuscitation is the first priority in both conditions, but insulin therapy timing and electrolyte monitoring — particularly potassium — differ enough that memorizing a single unified protocol will trip you up on exam day.",
      "Use side-by-side comparison tables while you study, and pressure-test your recall with case-study style questions that force you to identify which condition is in play before you touch the intervention options.",
    ],
  },
  {
    slug: "dosage-calculation-mistakes",
    title: "5 Common Dosage Calculation Mistakes (And How to Avoid Them)",
    excerpt:
      "Don't let unit conversions or decimal placements trip you up. Safe medication administration starts with accurate math.",
    category: "Pharmacology & Dosage",
    categoryColor: "text-[#ea580c]",
    date: "Sept 3, 2026",
    readTime: "5 min read",
    image: "/images/blog-dosage.jpg",
    content: [
      "Dosage calculation errors are one of the most preventable causes of medication mistakes — and one of the most common places nursing students lose points.",
      "1. Misplaced decimals: A single decimal shift can mean a 10x overdose. Always say the number out loud and double check zeros before and after the decimal.",
      "2. Mixing units mid-calculation: Converting mg to mcg (or vice versa) halfway through a problem is a classic trap. Convert everything to the same unit system before you start solving.",
      "3. Ignoring weight-based dosing: Pediatric and critical-care dosing is frequently weight-based. Skipping the weight conversion (lbs to kg) is an easy way to get an answer that looks right but isn't.",
      "4. Rushing IV drip rate formulas: Always write out the formula in full — volume, time, and drop factor — instead of trying to shortcut it from memory.",
      "5. Not double-checking with dimensional analysis: Even when you're confident, running the problem a second time using dimensional analysis catches errors your first pass missed.",
      "Our Dosage Calculator tool inside MedLearnix lets you drill these scenarios with instant feedback so the math becomes second nature before it matters at the bedside.",
    ],
  },
  {
    slug: "nclex-rn-vs-pn-differences",
    title: "NCLEX-RN vs. NCLEX-PN: Key Differences in Exam Structure",
    excerpt:
      "Navigating the scope of practice requirements and how they translate to the computerized adaptive testing algorithm.",
    category: "Exam Prep",
    categoryColor: "text-[#9333ea]",
    date: "Aug 27, 2026",
    readTime: "10 min read",
    image: "/images/blog-examprep.jpg",
    content: [
      "While both exams are delivered through Computerized Adaptive Testing (CAT), the NCLEX-RN and NCLEX-PN differ in scope, question depth, and the clinical judgment expectations built into each item.",
      "NCLEX-PN focuses on foundational safe, effective care under the direction of an RN or provider — expect more emphasis on basic care and comfort, and structured, protocol-driven interventions.",
      "NCLEX-RN expects a broader scope of independent clinical judgment, including care coordination, delegation, and management of complex, multi-system patient presentations.",
      "Both exams use the same adaptive scoring model: item difficulty adjusts in real time based on your performance, which is exactly what our Smart CAT engine is built to simulate.",
      "Know your track's blueprint before you start heavy practice — studying PN-level content for an RN exam (or vice versa) wastes valuable prep time on the wrong depth of material.",
    ],
  },
];

export function getBlogPost(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getRelatedPosts(slug: string, count = 3) {
  return BLOG_POSTS.filter((post) => post.slug !== slug).slice(0, count);
}
