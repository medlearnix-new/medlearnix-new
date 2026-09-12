"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Reveal } from "./ui/Reveal";
import { Avatar } from "./ui/Avatar";

const TESTIMONIALS = [
  {
    name: "Jasmine R.",
    credential: "BSN, Class of 2024",
    quote:
      "MedLearnix made studying actually enjoyable! The Smart CAT really helped me focus on my weak areas. I passed on my first try!",
  },
  {
    name: "Marcus T.",
    credential: "Accelerated BSN",
    quote:
      "The NGN practice questions were spot on. I felt so prepared for test day. Highly recommend!",
  },
  {
    name: "Sophia L.",
    credential: "RN, Passed NCLEX",
    quote:
      "I loved the clean layout and how easy it was to track my progress. MedLearnix gave me the confidence I needed!",
  },
  {
    name: "Daniel K.",
    credential: "BSN Student",
    quote:
      "The explanations are amazing and the AI tutor is a game changer. This is a must-have for any nursing student!",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="relative bg-background py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              What Nursing Students Are Saying
            </h2>
            <p className="mt-3 text-slate-400">Real stories. Real results.</p>
          </div>
          <a
            href="#"
            className="text-sm font-semibold text-accent hover:underline"
          >
            View More Reviews →
          </a>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex h-full flex-col rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-sm transition-colors duration-300 hover:border-accent/30"
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-300">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <Avatar name={t.name} index={i} />
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.credential}</p>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
