"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Reveal } from "../ui/Reveal";
import { Button } from "../ui/Button";
import { cn } from "@/lib/utils";
import type { PricingPlan } from "@/lib/pricing-data";

export function PricingPlans({ plans }: { plans: PricingPlan[] }) {
  return (
    <section className="relative bg-background pb-24">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
          {plans.map((plan, i) => (
            <Reveal key={plan.slug} delay={i * 0.1}>
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
                  <span className="pb-1 text-sm text-slate-400">
                    / {plan.billingPeriod}
                  </span>
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
                    {plan.ctaLabel}
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
