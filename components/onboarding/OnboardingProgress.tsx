"use client";

import { motion } from "framer-motion";

export function OnboardingProgress({
  step,
  totalSteps,
}: {
  step: number;
  totalSteps: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
        <span>
          Step {step} of {totalSteps}
        </span>
        <span className="text-accent">{Math.round((step / totalSteps) * 100)}%</span>
      </div>
      <div className="mt-3 flex gap-1.5">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800"
          >
            <motion.div
              initial={false}
              animate={{ width: i < step ? "100%" : "0%" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full bg-gradient-to-r from-accent to-cyan-400 shadow-[0_0_8px_rgba(0,242,254,0.6)]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
