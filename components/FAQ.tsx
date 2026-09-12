"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Reveal } from "./ui/Reveal";

const FAQS = [
  {
    question: "Is MedLearnix good for NGN-style questions?",
    answer:
      "Yes. MedLearnix includes a full library of Next Generation NCLEX (NGN) item types — case studies, multiple response, drag & drop, and bowtie questions — modeled after the real exam format.",
  },
  {
    question: "How does Smart CAT work?",
    answer:
      "Smart CAT is our adaptive testing engine. It adjusts question difficulty in real time based on your performance, simulating the actual computer-adaptive experience of the NCLEX.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Absolutely. There are no long-term contracts — you can upgrade, downgrade, or cancel your subscription at any time from your account settings.",
  },
  {
    question: "Do you offer a money-back guarantee?",
    answer:
      "Yes, all paid plans come with a 7-day money-back guarantee. If MedLearnix isn't the right fit, just reach out and we'll issue a full refund.",
  },
  {
    question: "Is this only for nursing students?",
    answer:
      "MedLearnix is built primarily for pre-licensure nursing students preparing for the NCLEX-RN, but it's also a great refresher tool for nurses returning to practice.",
  },
  {
    question: "What devices can I use?",
    answer:
      "MedLearnix works on any modern browser — desktop, tablet, or mobile — so you can study seamlessly wherever you are.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative bg-background py-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <Reveal className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-slate-400">Get the answers you need.</p>
        </Reveal>

        <div className="mt-10 flex flex-col gap-3">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <Reveal key={faq.question} delay={i * 0.05}>
                <div
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
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
