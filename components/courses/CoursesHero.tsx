"use client";

import { useRef, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, Sparkles, Target, Clock, Layers } from "lucide-react";
import { Button } from "../ui/Button";
import { SectionTag } from "../ui/SectionTag";

const STATS = [
  { value: "98%", label: "Pass Rate", icon: Target },
  { value: "5,000+", label: "Practice Questions", icon: Layers },
  { value: "24/7", label: "AI Clinical Assistant", icon: Clock },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function CourseMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), {
    stiffness: 150,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), {
    stiffness: 150,
    damping: 18,
  });

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-xl lg:max-w-none"
      style={{ perspective: 1200 }}
    >
      {/* Ambient glow behind the mockup */}
      <div className="animate-float absolute -top-10 -right-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(0,242,254,0.28),transparent_65%)] blur-2xl" />
      <div className="animate-float-delay absolute -bottom-14 -left-10 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.22),transparent_65%)] blur-2xl" />

      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative"
      >
        <div className="relative aspect-[940/660] overflow-hidden rounded-2xl border border-accent/20 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
          <div className="pointer-events-none absolute inset-0 z-10 rounded-2xl shadow-[0_0_60px_rgba(0,242,254,0.15)_inset]" />
          <Image
            src="/images/courses-hero.png"
            alt="MedLearnix NCLEX-PN case study dashboard — patient assessment, drug tool panel, and answer choices"
            fill
            priority
            className="select-none object-cover"
          />
        </div>

        {/* Floating badge: pass rate */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          style={{ transform: "translateZ(60px)" }}
          className="animate-float absolute -bottom-6 -left-4 flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/90 px-4 py-3 shadow-xl shadow-black/40 backdrop-blur-xl sm:-left-8"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15">
            <Target className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">98% Pass Rate</p>
            <p className="text-xs text-slate-400">Across all tracks</p>
          </div>
        </motion.div>

        {/* Floating badge: live simulation */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.05 }}
          style={{ transform: "translateZ(60px)" }}
          className="animate-float-delay absolute -top-5 right-2 flex items-center gap-2 rounded-full border border-accent/30 bg-slate-900/90 px-4 py-2 shadow-xl shadow-black/30 backdrop-blur-xl sm:right-6"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="text-xs font-semibold text-white">
            Live case simulation
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function CoursesHero() {
  return (
    <section className="relative overflow-hidden bg-background pb-16 pt-24 lg:pb-24 lg:pt-32">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-32 left-0 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(0,242,254,0.14),transparent_65%)] blur-2xl" />
      <div className="pointer-events-none absolute right-0 top-1/3 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.12),transparent_65%)] blur-2xl" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10"
        >
          <motion.div variants={item}>
            <SectionTag>
              <Sparkles className="h-3.5 w-3.5" />
              Personalized AI Test Prep
            </SectionTag>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl"
          >
            Elevate Your Clinical Judgment with{" "}
            <span className="bg-gradient-to-r from-accent to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(0,242,254,0.35)]">
              AI-Powered
            </span>{" "}
            Test Prep
          </motion.h1>

          <motion.p variants={item} className="mt-6 max-w-xl text-lg text-slate-400">
            Practice smarter, master complex scenarios, and boost your exam
            score with personalized AI tutoring built specifically for
            nursing and medical trainees.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-4">
            <motion.div whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Link href="/signup">
                <Button variant="primary" size="lg">
                  Start Free Trial
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Button variant="outline" size="lg">
                Explore Practice Modules
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        <CourseMockup />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="relative mt-20 border-y border-white/5 bg-white/[0.02]"
      >
        <div className="mx-auto grid max-w-5xl grid-cols-1 divide-y divide-white/10 px-6 py-8 sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:px-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              whileHover={{ y: -3 }}
              className="flex flex-col items-center gap-2 py-4 text-center sm:py-2"
            >
              <stat.icon className="h-4 w-4 text-accent/70" />
              <span className="text-3xl font-extrabold text-accent sm:text-4xl">
                {stat.value}
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
