"use client";

import { motion } from "framer-motion";
import { Check, ShieldCheck } from "lucide-react";
import { Reveal } from "./ui/Reveal";
import { Button } from "./ui/Button";
import { cn } from "@/lib/utils";

interface Plan {
  name: string;
  price: string;
  period: string;
  featured?: boolean;
  features: string[];
  cta: string;
  variant: "outline" | "primary";
}

const PLANS: Plan[] = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: [
      "Limited practice questions",
      "Basic performance tracking",
      "Access to select courses",
    ],
    cta: "Get Started",
    variant: "outline",
  },
  {
    name: "Plus",
    price: "$19",
    period: "/ month",
    featured: true,
    features: [
      "Full question bank",
      "Smart CAT (adaptive practice)",
      "All course content",
      "Personalized study plan",
      "Detailed analytics",
    ],
    cta: "Start Free Today",
    variant: "primary",
  },
  {
    name: "Premium",
    price: "$49",
    period: "/ month",
    features: [
      "Everything in Plus",
      "AI Tutor (unlimited)",
      "NGN case study library",
      "Priority support",
      "Exclusive study resources",
    ],
    cta: "Start Free Today",
    variant: "outline",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative bg-background py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-3 text-slate-400">
            Choose the plan that fits your journey.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 items-center gap-6 lg:grid-cols-3">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6 }}
                className={cn(
                  "relative flex h-full flex-col rounded-2xl border p-7",
                  plan.featured
                    ? "border-accent/50 bg-slate-900/80 shadow-[0_0_40px_rgba(0,242,254,0.15)] lg:scale-105"
                    : "border-slate-800/80 bg-slate-900/60"
                )}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-bold uppercase tracking-wide text-[#04121b] shadow-[0_0_20px_rgba(0,242,254,0.5)]">
                    Most Popular
                  </span>
                )}

                <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                <div className="mt-3 flex items-end gap-1.5">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="pb-1 text-sm text-slate-400">{plan.period}</span>
                </div>

                <ul className="mt-6 flex flex-1 flex-col gap-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-8">
                  <Button variant={plan.variant} className="w-full justify-center">
                    {plan.cta}
                  </Button>
                </motion.div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <div className="mt-8 flex items-center justify-center gap-2 rounded-xl border border-slate-800/80 bg-slate-900/40 px-5 py-3.5 text-sm text-slate-400">
            <ShieldCheck className="h-4 w-4 text-accent" />
            All plans include NCLEX-style questions and progress tracking.
          </div>
        </Reveal>
      </div>
    </section>
  );
}
