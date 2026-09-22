"use client";

import { motion } from "framer-motion";
import { Play, BookOpen } from "lucide-react";
import { Reveal } from "../ui/Reveal";

export function ContinueCourseCard({
  title,
  meta,
  percent,
}: {
  title: string;
  meta: string;
  percent: number;
}) {
  return (
    <Reveal delay={0.1}>
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
          <BookOpen className="h-3.5 w-3.5" />
          Continue Course
        </div>
        <p className="mt-3 text-base font-bold text-white">{title}</p>
        <p className="mt-1 text-sm text-slate-400">{meta}</p>

        <div className="mt-4 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${percent}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full bg-gradient-to-r from-accent to-cyan-400"
            />
          </div>
          <span className="text-xs font-semibold text-slate-400">{percent}%</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-sm font-bold text-[#04121b] transition-all hover:brightness-110"
        >
          <Play className="h-4 w-4" />
          Resume
        </motion.button>
      </div>
    </Reveal>
  );
}
