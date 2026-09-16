"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Flame, PlayCircle, Trophy } from "lucide-react";
import { Button } from "./ui/Button";
import { SectionTag } from "./ui/SectionTag";
import { RadialProgress } from "./ui/RadialProgress";

const BADGES = [
  "NCLEX-style questions",
  "Personalized learning",
  "Track your progress",
];

const STUDY_PLAN = [
  { title: "Med-Surg Cardiac Disorders", meta: "20 questions" },
  { title: "Pharmacology: Anticoagulants", meta: "15 questions" },
  { title: "NGN Case Study Practice", meta: "5 cases" },
];

export function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-background pt-16 pb-24 lg:pt-24 lg:pb-32"
    >
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -top-40 left-1/4 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(0,242,254,0.16),transparent_65%)] blur-2xl" />
      <div className="pointer-events-none absolute top-40 right-0 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.14),transparent_65%)] blur-2xl" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">
        {/* Left column */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <SectionTag>Smarter Study. Brighter Tomorrow.</SectionTag>

          <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-white text-balance sm:text-5xl lg:text-6xl">
            Pass the NCLEX with{" "}
            <span className="bg-gradient-to-r from-accent to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(0,242,254,0.35)]">
              Confidence
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-400">
            AI-powered learning, NCLEX-style questions, Smart CAT, and
            personalized study support — all in one place. Built by nurses,
            for future nurses.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <motion.div whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link href="/signup">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Start Free Today
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <PlayCircle className="h-4 w-4" />
                Try Smart CAT
              </Button>
            </motion.div>
          </div>

          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3">
            {BADGES.map((badge) => (
              <div key={badge} className="flex items-center gap-2 text-sm text-slate-400">
                <CheckCircle2 className="h-4 w-4 text-accent" />
                {badge}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right column: dashboard preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Handwritten annotations */}
          <div className="animate-float absolute -top-8 left-2 z-20 hidden -rotate-6 items-center gap-1 font-hand text-2xl text-accent/90 sm:flex">
            You&apos;ve got this! <span className="text-pink-300">♡</span>
          </div>
          <div className="animate-float-delay absolute -top-10 right-4 z-20 hidden rotate-3 text-right font-hand text-xl leading-tight text-cyan-200/80 md:block">
            Big dreams.
            <br />
            Brighter future.
          </div>

          <div className="relative rounded-2xl border border-slate-800/80 bg-slate-900/80 p-5 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-6">
            {/* mini top bar */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_10px_rgba(0,242,254,0.7)]" />
                <span className="text-sm font-semibold text-white">MedLearnix</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                Hi, Alex
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600" />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-lg font-bold text-white">
                  Good morning, Future RN! 👋
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Keep going. You&apos;re closer than you think.
                </p>
              </div>
              <RadialProgress value={78} label="Ready" />
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-slate-800/80 bg-background/60 p-3">
                <p className="text-base font-bold text-white">1,247</p>
                <p className="mt-0.5 text-[11px] text-slate-400">Questions</p>
              </div>
              <div className="rounded-xl border border-slate-800/80 bg-background/60 p-3">
                <div className="flex items-center gap-1">
                  <Flame className="h-3.5 w-3.5 text-orange-400" />
                  <p className="text-base font-bold text-white">12</p>
                </div>
                <p className="mt-0.5 text-[11px] text-slate-400">Day Streak</p>
              </div>
              <div className="rounded-xl border border-slate-800/80 bg-background/60 p-3">
                <div className="flex items-center gap-1">
                  <Trophy className="h-3.5 w-3.5 text-amber-400" />
                  <p className="text-base font-bold text-white">85%</p>
                </div>
                <p className="mt-0.5 text-[11px] text-slate-400">Avg Score</p>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-slate-800/80 bg-background/60 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-white">
                  Today&apos;s Study Plan
                </p>
                <a href="#" className="text-xs font-medium text-accent hover:underline">
                  View Full Plan →
                </a>
              </div>
              <div className="mt-3 flex flex-col gap-2.5">
                {STUDY_PLAN.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center justify-between gap-3 rounded-lg bg-slate-900/60 px-3 py-2"
                  >
                    <div>
                      <p className="text-xs font-medium text-slate-200">
                        {item.title}
                      </p>
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
        </motion.div>
      </div>
    </section>
  );
}
