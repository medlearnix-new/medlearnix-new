"use client";

import { motion } from "framer-motion";
import { Brain, Zap } from "lucide-react";
import { Reveal } from "../ui/Reveal";

export function SmartCatCard({
  lastScore,
  nextInDays,
}: {
  lastScore: number;
  nextInDays: number;
}) {
  return (
    <Reveal delay={0.16}>
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
          <Brain className="h-3.5 w-3.5" />
          Smart CAT
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Last CAT</p>
            <p className="text-xl font-bold text-white">{lastScore}% Readiness</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Next recommended</p>
            <p className="text-sm font-semibold text-accent">In {nextInDays} days</p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-accent/30 bg-accent/5 py-2.5 text-sm font-bold text-accent transition-all hover:bg-accent/10"
        >
          <Zap className="h-4 w-4" />
          Launch CAT
        </motion.button>
      </div>
    </Reveal>
  );
}
