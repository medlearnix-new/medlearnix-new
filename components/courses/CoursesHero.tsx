"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Reveal } from "../ui/Reveal";
import { Button } from "../ui/Button";

const STATS = [
  { value: "98%", label: "Pass Rate" },
  { value: "5,000+", label: "Practice Questions" },
  { value: "24/7", label: "AI Clinical Assistant" },
];

export function CoursesHero() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="absolute inset-0">
        <Image
          src="/images/courses-hero.png"
          alt=""
          fill
          priority
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-24 lg:px-8 lg:pt-32">
        <Reveal className="max-w-2xl">
          <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            Elevate Your Clinical Judgment with{" "}
            <span className="text-accent">AI-Powered</span> Test Prep
          </h1>
          <p className="mt-6 max-w-xl text-lg text-slate-400">
            Practice smarter, master complex scenarios, and boost your exam
            score with personalized AI tutoring built specifically for
            nursing and medical trainees.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
              <Button variant="primary" size="lg">
                Start Free Trial
              </Button>
            </motion.div>
            <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
              <Button variant="outline" size="lg">
                Explore Practice Modules
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.15} className="relative border-y border-white/5 bg-white/[0.02]">
        <div className="mx-auto grid max-w-5xl grid-cols-1 divide-y divide-white/10 px-6 py-8 sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:px-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1 py-4 text-center sm:py-0">
              <span className="text-3xl font-extrabold text-accent sm:text-4xl">
                {stat.value}
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
