"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ProgressBar({
  label,
  value,
  colorClass = "bg-accent",
}: {
  label: string;
  value: number;
  colorClass?: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="text-slate-300">{label}</span>
        <span className="font-semibold text-white">{value}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800/80">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn("h-full rounded-full", colorClass)}
        />
      </div>
    </div>
  );
}
