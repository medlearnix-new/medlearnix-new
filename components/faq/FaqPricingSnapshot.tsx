"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SnapshotPlan {
  name: string;
  price: string;
  features: string[];
  cta: string;
  featured?: boolean;
}

const PLANS: SnapshotPlan[] = [
  {
    name: "Pro Plan",
    price: "$49.99",
    features: [
      "30 Full Exams",
      "30 Simulations",
      "Unlimited AI Tools",
      "24/7 AI Assistance",
    ],
    cta: "Get Pro",
  },
  {
    name: "Elite Plan",
    price: "$59.99",
    features: [
      "50 Full Exams",
      "40 Simulations",
      "Unlimited AI Tools",
      "Priority AI Server Access",
    ],
    cta: "Get Elite",
    featured: true,
  },
];

export function FaqPricingSnapshot() {
  return (
    <div className="mb-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {PLANS.map((plan) => (
        <div
          key={plan.name}
          className={cn(
            "relative rounded-2xl border p-6",
            plan.featured
              ? "border-accent/50 bg-slate-900/80"
              : "border-slate-800/80 bg-slate-900/50"
          )}
        >
          {plan.featured && (
            <span className="absolute -top-3 right-6 rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#04121b]">
              Most Popular
            </span>
          )}
          <div className="flex items-end justify-between">
            <h4 className="text-base font-bold text-white">{plan.name}</h4>
            <span className="text-xl font-bold text-white">
              {plan.price}
              <span className="text-xs font-normal text-slate-400">/mo</span>
            </span>
          </div>
          <ul className="mt-4 flex flex-col gap-2">
            {plan.features.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-sm text-slate-300"
              >
                <Check className="h-3.5 w-3.5 shrink-0 text-accent" />
                {feature}
              </li>
            ))}
          </ul>
          <Link
            href="/pricing"
            className="mt-5 block rounded-lg border border-slate-700 py-2 text-center text-sm font-semibold text-white transition-colors hover:border-accent/60 hover:bg-accent/5"
          >
            {plan.cta}
          </Link>
        </div>
      ))}
    </div>
  );
}
