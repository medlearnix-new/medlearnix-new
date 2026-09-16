"use client";

import { motion } from "framer-motion";
import { Sparkles, SlidersHorizontal, BrainCircuit } from "lucide-react";
import { Reveal } from "../ui/Reveal";

const FEATURES = [
  {
    icon: Sparkles,
    title: "Interactive Simulations",
    description:
      "Experience complex case studies like Type 2 Diabetes complications in a risk-free environment.",
  },
  {
    icon: SlidersHorizontal,
    title: "Smart Customization",
    description:
      "Customize your practice sessions by length (up to 50 questions) and specific focus areas.",
  },
  {
    icon: BrainCircuit,
    title: "AI Suite Tools",
    description:
      "Access Dosage Calculator, Drug Tool, AI Care Plan, and real-time AI Talk support.",
  },
];

export function StudyFeatures() {
  return (
    <section className="relative bg-background py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            The Smartest Way to Study
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Our Integrated AI Suite doesn&apos;t just give you answers; it
            teaches you the clinical &apos;why&apos;.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="h-full rounded-3xl border border-white/10 bg-white/[0.03] p-8"
              >
                <feature.icon className="h-8 w-8 text-accent" strokeWidth={1.75} />
                <h3 className="mt-6 text-xl font-bold text-white">
                  {feature.title}
                </h3>
                <p className="mt-3 text-slate-500">{feature.description}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
