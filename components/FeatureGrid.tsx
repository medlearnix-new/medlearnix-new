"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Activity,
  ListChecks,
  Pill,
  TrendingUp,
  Target,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "./ui/Reveal";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  iconGradient: string;
}

const FEATURES: Feature[] = [
  {
    icon: Bot,
    title: "AI Tutor",
    description: "Get instant answers, explanations, and personalized guidance.",
    iconGradient: "from-indigo-400 to-purple-600",
  },
  {
    icon: Activity,
    title: "Smart CAT",
    description: "Adaptive practice that adjusts to your level.",
    iconGradient: "from-sky-400 to-blue-600",
  },
  {
    icon: ListChecks,
    title: "NGN Question Types",
    description: "Practice case studies, multiple response, drag & drop, and more.",
    iconGradient: "from-violet-400 to-indigo-600",
  },
  {
    icon: Pill,
    title: "Pharmacology",
    description: "Master high-yield meds with visual learning tools.",
    iconGradient: "from-teal-400 to-emerald-600",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description: "See your improvement and stay motivated.",
    iconGradient: "from-orange-400 to-amber-600",
  },
  {
    icon: Target,
    title: "Personalized Study Plan",
    description: "A study plan built around your goals and weak areas.",
    iconGradient: "from-fuchsia-400 to-pink-600",
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="relative bg-background py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group h-full rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 transition-colors duration-300 hover:border-accent/40 hover:shadow-[0_0_25px_rgba(0,242,254,0.12)]"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.iconGradient} shadow-lg`}
                >
                  <feature.icon className="h-6 w-6 text-white" strokeWidth={2} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {feature.description}
                </p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
