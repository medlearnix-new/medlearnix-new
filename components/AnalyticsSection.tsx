"use client";

import { motion } from "framer-motion";
import { ArrowRight, GraduationCap } from "lucide-react";
import { Button } from "./ui/Button";
import { Reveal } from "./ui/Reveal";
import { ProgressBar } from "./ui/ProgressBar";
import { RadialProgress } from "./ui/RadialProgress";

const CATEGORIES = [
  { label: "Fundamentals", value: 88, color: "bg-violet-400" },
  { label: "Med-Surg", value: 76, color: "bg-accent" },
  { label: "Pharmacology", value: 82, color: "bg-slate-400" },
  { label: "Pediatrics", value: 70, color: "bg-orange-400" },
];

const STUDY_PLAN = [
  { title: "Med-Surg Cardiac Disorders", meta: "20 questions" },
  { title: "Pharmacology: Anticoagulants", meta: "15 questions" },
  { title: "NGN Case Study Practice", meta: "5 cases" },
];

export function AnalyticsSection() {
  return (
    <section className="relative overflow-hidden bg-background py-24">
      <div className="pointer-events-none absolute left-0 top-1/3 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(0,242,254,0.1),transparent_65%)] blur-2xl" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Left copy */}
          <Reveal className="lg:col-span-3">
            <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
              See Your Progress.{" "}
              <span className="bg-gradient-to-r from-accent to-cyan-300 bg-clip-text text-transparent">
                Stay on Track.
              </span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-400">
              A clean, simple dashboard to help you study smarter and reach
              your NCLEX goals.
            </p>
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-7 inline-block"
            >
              <Button variant="primary" size="md">
                Start Free Today
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </Reveal>

          {/* Dashboard preview */}
          <Reveal delay={0.1} className="lg:col-span-6">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_10px_rgba(0,242,254,0.7)]" />
                  <span className="text-sm font-semibold text-white">MedLearnix</span>
                </div>
                <span className="text-xs text-slate-500">Mar 18, 2026</span>
              </div>

              <div className="mt-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-base font-bold text-white">Good morning, Alex! 👋</p>
                  <p className="mt-1 text-sm text-slate-400">Here&apos;s your progress today.</p>
                </div>
                <RadialProgress value={78} size={68} stroke={6} label="Ready" />
              </div>

              <div className="mt-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Progress by Category
                </p>
                <div className="flex flex-col gap-3.5">
                  {CATEGORIES.map((cat) => (
                    <ProgressBar
                      key={cat.label}
                      label={cat.label}
                      value={cat.value}
                      colorClass={cat.color}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-slate-800/80 bg-background/60 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">Today&apos;s Study Plan</p>
                  <a href="#" className="text-xs font-medium text-accent hover:underline">
                    View All →
                  </a>
                </div>
                <div className="mt-3 flex flex-col gap-2.5">
                  {STUDY_PLAN.map((item) => (
                    <div
                      key={item.title}
                      className="flex items-center justify-between gap-3 rounded-lg bg-slate-900/60 px-3 py-2"
                    >
                      <div>
                        <p className="text-xs font-medium text-slate-200">{item.title}</p>
                        <p className="text-[11px] text-slate-500">{item.meta}</p>
                      </div>
                      <button className="shrink-0 rounded-full bg-accent/15 px-3 py-1 text-[11px] font-semibold text-accent transition-colors hover:bg-accent/25">
                        Start
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Quote callout */}
          <Reveal delay={0.2} className="lg:col-span-3">
            <motion.div
              whileHover={{ y: -4 }}
              className="animate-float flex h-full flex-col justify-between rounded-2xl border border-accent/20 bg-gradient-to-b from-slate-900/80 to-background p-7 text-center shadow-[0_0_25px_rgba(0,242,254,0.08)]"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <GraduationCap className="h-6 w-6 text-accent" />
              </div>
              <p className="mt-5 font-hand text-2xl leading-snug text-slate-200">
                &ldquo;Disciplined students today are confident nurses
                tomorrow.&rdquo;
              </p>
              <span className="mx-auto mt-4 text-pink-300">♡</span>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
