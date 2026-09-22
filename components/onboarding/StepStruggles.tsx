"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { STRUGGLE_CATEGORIES } from "@/lib/onboarding-data";

export function StepStruggles({
  value,
  onToggle,
}: {
  value: string[];
  onToggle: (option: string) => void;
}) {
  return (
    <div>
      <div className="mb-3 text-right text-xs font-medium text-slate-500">
        {value.length} selected
      </div>
      <div className="flex max-h-[320px] flex-col gap-5 overflow-y-auto pr-1">
        {STRUGGLE_CATEGORIES.map((category) => (
          <div key={category.name}>
            <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.14em] text-accent">
              {category.name}
            </p>
            <div className="flex flex-wrap gap-2">
              {category.options.map((option) => {
                const selected = value.includes(option);
                return (
                  <motion.button
                    key={option}
                    type="button"
                    onClick={() => onToggle(option)}
                    whileTap={{ scale: 0.96 }}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors",
                      selected
                        ? "border-accent/60 bg-accent/10 text-white"
                        : "border-slate-700 bg-black/20 text-slate-300 hover:border-slate-600"
                    )}
                  >
                    {selected && <Check className="h-3 w-3 text-accent" strokeWidth={3} />}
                    {option}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
