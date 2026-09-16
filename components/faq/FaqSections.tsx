"use client";

import { FaqAccordionGroup } from "./FaqAccordionGroup";
import { FaqPricingSnapshot } from "./FaqPricingSnapshot";

const CATEGORIES = [
  {
    category: "Getting Started & Platform",
    items: [
      {
        question: "Is MedLearnix only for nursing students?",
        answer:
          "Primarily optimized for NCLEX-RN/PN, but valuable for pre-nursing, NP students, and professionals looking to refresh their clinical knowledge base. Our simulations are built with clinical accuracy at the forefront.",
      },
      {
        question: "What devices can I use?",
        answer:
          "MedLearnix is fully responsive across desktop, laptops, tablets, and mobile browsers. Your progress, exam scores, and AI conversations sync automatically across all devices.",
      },
    ],
  },
  {
    category: "Exam Preparation & AI Tools",
    items: [
      {
        question: "Is MedLearnix good for NGN-style questions?",
        answer:
          "Yes, supports Next Generation NCLEX formats like case studies, trend analyses, and priority interventions. We focus heavily on clinical judgment measurement models.",
      },
      {
        question: "How does Smart CAT work?",
        answer:
          'Our Computerized Adaptive Testing (CAT) replicates the actual NCLEX scoring algorithm, adjusting item difficulty in real-time based on your performance to give you the most accurate "Ready-to-Pass" score.',
      },
      {
        question: "What AI tools are included?",
        answer:
          "Dosage Calculator, Drug Tool, AI Care Plan, AI Simulation, and AI Talk — our full AI suite is available across every paid plan.",
      },
    ],
  },
];

const PRICING_ITEMS = [
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes, you have full control. Cancel, pause, or switch your plan anytime directly from your account settings. There are no long-term contracts or hidden fees.",
  },
  {
    question: "Money-back guarantee?",
    answer:
      "We offer a Pass Guarantee. If you use our Elite plan and don't pass your NCLEX, we provide a full refund or free subscription extension. Terms apply based on study completion metrics.",
  },
];

export function FaqSections() {
  return (
    <section className="relative bg-background pb-24">
      <div className="mx-auto flex max-w-3xl flex-col gap-14 px-6 lg:px-8">
        {CATEGORIES.map((group, i) => (
          <FaqAccordionGroup key={group.category} {...group} delay={i * 0.05} />
        ))}

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-accent">
            Pricing &amp; Subscriptions
          </h3>
          <div className="mt-4">
            <FaqPricingSnapshot />
            <FaqAccordionGroup items={PRICING_ITEMS} delay={0.1} />
          </div>
        </div>
      </div>
    </section>
  );
}
