"use client";

import { motion } from "framer-motion";
import { Check, Circle, CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PricingPlan } from "@/lib/pricing-data";

export function StepPlan({
  plans,
  value,
  onChange,
}: {
  plans: PricingPlan[];
  value: string | null;
  onChange: (slug: string) => void;
}) {
  return (
    <div className="flex max-h-[400px] flex-col gap-3 overflow-y-auto pr-1">
      {plans.map((plan) => {
        const selected = value === plan.slug;
        return (
          <motion.button
            key={plan.slug}
            type="button"
            onClick={() => onChange(plan.slug)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.99 }}
            className={cn(
              "relative flex w-full flex-col gap-3 rounded-2xl border px-5 py-4 text-left transition-colors",
              selected
                ? "border-accent/60 bg-accent/10"
                : "border-slate-700 bg-black/20 hover:border-slate-600"
            )}
          >
            {plan.badge && (
              <span className="absolute -top-2.5 right-4 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#04121b]">
                {plan.badge}
              </span>
            )}

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                {selected ? (
                  <CircleCheck className="h-5 w-5 shrink-0 text-accent" />
                ) : (
                  <Circle className="h-5 w-5 shrink-0 text-slate-600" />
                )}
                <span className="text-base font-bold text-white">{plan.name}</span>
              </div>
              <span className="text-lg font-bold text-white">
                {plan.price}
                <span className="ml-1 text-xs font-normal text-slate-400">
                  {plan.billingPeriod === "forever" ? "forever" : `/${plan.billingPeriod}`}
                </span>
              </span>
            </div>

            <ul className="flex flex-col gap-1.5 pl-7">
              {plan.features.map((feature) => (
                <li key={feature.label} className="flex items-start gap-1.5 text-xs text-slate-400">
                  <Check className="mt-0.5 h-3 w-3 shrink-0 text-accent/70" />
                  {feature.label}
                  {feature.extra && (
                    <span className="font-semibold text-emerald-400">({feature.extra})</span>
                  )}
                </li>
              ))}
            </ul>
          </motion.button>
        );
      })}
    </div>
  );
}
