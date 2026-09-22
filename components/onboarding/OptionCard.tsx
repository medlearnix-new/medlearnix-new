"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function OptionCard({
  label,
  description,
  selected,
  onClick,
}: {
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "flex w-full items-center justify-between gap-3 rounded-2xl border px-5 py-4 text-left transition-colors",
        selected
          ? "border-accent/60 bg-accent/10"
          : "border-slate-700 bg-black/20 hover:border-slate-600"
      )}
    >
      <span>
        <span className={cn("block text-sm font-semibold", selected ? "text-white" : "text-slate-200")}>
          {label}
        </span>
        {description && (
          <span className="mt-0.5 block text-xs text-slate-500">{description}</span>
        )}
      </span>
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          selected ? "border-accent bg-accent" : "border-slate-600"
        )}
      >
        {selected && <Check className="h-3 w-3 text-[#04121b]" strokeWidth={3} />}
      </span>
    </motion.button>
  );
}
