"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Reveal } from "../ui/Reveal";
import { Button } from "../ui/Button";
import { cn } from "@/lib/utils";

interface PlanFeature {
  label: string;
  extra?: string;
}

interface Plan {
  name: string;
  price: string;
  description: string;
  features: PlanFeature[];
  cta: string;
  featured?: boolean;
  badge?: string;
}

const PLANS: Plan[] = [
  {
    name: "Pro Plan",
    price: "$49.99",
    description:
      "Targeted practice for students focused on core exam review.",
    features: [
      { label: "30 Full-Length Practice Exams" },
      { label: "Unlimited Dosage Calculators" },
      { label: "Unlimited Drug Reference Tools" },
      { label: "Unlimited AI Care Plans" },
      { label: "30 AI Patient Simulations" },
      { label: "24/7 AI Assistant Support" },
      { label: "Standard Performance Analytics" },
    ],
    cta: "Start Pro Plan",
  },
  {
    name: "Elite Plan",
    price: "$59.99",
    description:
      "Complete access for comprehensive exam preparation and clinical mastery.",
    featured: true,
    badge: "Most Popular — Best Value",
    features: [
      { label: "50 Full-Length Practice Exams", extra: "+20 Extra" },
      { label: "Unlimited Dosage Calculators" },
      { label: "Unlimited Drug Reference Tools" },
      { label: "Unlimited AI Care Plans" },
      { label: "40 AI Patient Simulations", extra: "+10 Extra" },
      { label: "24/7 Priority AI Assistant Support" },
      { label: "Advanced Diagnostic & Weak-Spot Analytics" },
    ],
    cta: "Get Elite Access",
  },
];

export function PricingPlans() {
  return (
    <section className="relative bg-background pb-24">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6 }}
                className={cn(
                  "relative flex h-full flex-col rounded-2xl border p-10",
                  plan.featured
                    ? "border-accent/50 bg-slate-900/80 shadow-[0_0_40px_rgba(0,242,254,0.15)]"
                    : "border-slate-800/80 bg-slate-900/60"
                )}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent px-4 py-1 text-xs font-bold uppercase tracking-wide text-[#04121b] shadow-[0_0_20px_rgba(0,242,254,0.5)]">
                    {plan.badge}
                  </span>
                )}

                <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                <div className="mt-3 flex items-end gap-1.5">
                  <span className="text-4xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="pb-1 text-sm text-slate-400">/ month</span>
                </div>
                <p className="mt-4 text-slate-400">{plan.description}</p>

                <ul className="mt-8 flex flex-1 flex-col gap-4">
                  {plan.features.map((feature) => (
                    <li
                      key={feature.label}
                      className="flex items-start gap-2.5 text-sm text-slate-300"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span>
                        {feature.label}
                        {feature.extra && (
                          <span className="ml-2 font-bold text-emerald-400">
                            ({feature.extra})
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-10"
                >
                  <Button
                    variant={plan.featured ? "primary" : "outline"}
                    className="w-full justify-center"
                  >
                    {plan.cta}
                  </Button>
                </motion.div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
