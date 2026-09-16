"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Reveal } from "../ui/Reveal";

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqAccordionGroup({
  category,
  items,
  delay = 0,
}: {
  category?: string;
  items: FaqItem[];
  delay?: number;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Reveal delay={delay}>
      {category && (
        <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-accent">
          {category}
        </h3>
      )}
      <div className={category ? "mt-4 flex flex-col gap-3" : "flex flex-col gap-3"}>
        {items.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={faq.question}
              className={`overflow-hidden rounded-2xl border transition-colors duration-300 ${
                isOpen
                  ? "border-accent/40 bg-slate-900/70"
                  : "border-slate-800/80 bg-slate-900/50"
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="text-sm font-medium text-white sm:text-base">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                >
                  <ChevronDown className="h-5 w-5 shrink-0 text-accent" />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-sm leading-relaxed text-slate-400">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Reveal>
  );
}
