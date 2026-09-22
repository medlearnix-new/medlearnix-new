"use client";

import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle } from "lucide-react";
import { Reveal } from "../ui/Reveal";
import { cn } from "@/lib/utils";
import type { MasteryCategory } from "@/lib/dashboard-data";

export function CategoryMasteryCard({ categories }: { categories: MasteryCategory[] }) {
  return (
    <Reveal delay={0.22}>
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
          <TrendingUp className="h-3.5 w-3.5" />
          Category Mastery
        </div>

        <div className="mt-4 flex flex-col gap-4">
          {categories.map((category) => (
            <div key={category.name}>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 font-medium text-slate-300">
                  {category.name}
                  {category.flagged && (
                    <AlertTriangle className="h-3 w-3 text-amber-400" />
                  )}
                </span>
                <span
                  className={cn(
                    "font-semibold",
                    category.flagged ? "text-amber-400" : "text-slate-400"
                  )}
                >
                  {category.percent}%
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-800">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${category.percent}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    "h-full rounded-full",
                    category.flagged
                      ? "bg-amber-400"
                      : "bg-gradient-to-r from-accent to-cyan-400"
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
