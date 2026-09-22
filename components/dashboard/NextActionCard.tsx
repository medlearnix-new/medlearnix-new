"use client";

import { motion } from "framer-motion";
import { ArrowRight, PartyPopper } from "lucide-react";
import { Reveal } from "../ui/Reveal";
import type { StudyTask } from "@/lib/dashboard-data";

export function NextActionCard({
  tasks,
  onFocusPlan,
}: {
  tasks: StudyTask[];
  onFocusPlan: () => void;
}) {
  const nextTask = tasks.find((t) => !t.completed);

  if (!nextTask) {
    return (
      <Reveal delay={0.28}>
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-accent/30 bg-gradient-to-br from-slate-900 to-[#062b33] p-8 text-center">
          <PartyPopper className="h-8 w-8 text-accent" />
          <p className="text-lg font-bold text-white">
            You&apos;re done for today! Come back tomorrow. ✨
          </p>
          <p className="text-sm text-slate-400">
            Great work — your readiness score updates as you complete more of your plan.
          </p>
        </div>
      </Reveal>
    );
  }

  return (
    <Reveal delay={0.28}>
      <motion.button
        onClick={onFocusPlan}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.99 }}
        className="flex w-full flex-col items-start justify-between gap-4 rounded-2xl border border-accent/30 bg-gradient-to-br from-slate-900 to-[#062b33] p-6 text-left sm:flex-row sm:items-center"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-accent">
            Next best action
          </p>
          <p className="mt-1 text-lg font-bold text-white">
            {nextTask.subject} — {nextTask.title}
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-[#04121b] transition-all hover:shadow-[0_0_20px_rgba(0,242,254,0.4)]">
          Continue Today&apos;s Plan
          <ArrowRight className="h-4 w-4" />
        </span>
      </motion.button>
    </Reveal>
  );
}
