"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Reveal } from "./ui/Reveal";
import { Button } from "./ui/Button";

export function CTABanner() {
  return (
    <section className="relative bg-background px-6 py-12 lg:px-8">
      <Reveal className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl border border-accent/20 bg-gradient-to-br from-slate-900 via-slate-900 to-[#062b33] px-8 py-14 text-center sm:px-16">
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(0,242,254,0.25),transparent_65%)] blur-2xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.25),transparent_65%)] blur-2xl" />

          <div className="animate-float absolute left-8 top-8 hidden text-accent/60 sm:block">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="animate-float-delay absolute right-10 top-10 hidden -rotate-6 font-hand text-2xl text-cyan-200/80 sm:block">
            Future RN Loading... <span className="text-pink-300">♡</span>
          </div>

          <h2 className="relative text-3xl font-bold text-white sm:text-4xl">
            Your RN License Is Closer Than You Think
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-slate-400">
            Start studying today and join thousands of nursing students who
            trust MedLearnix.
          </p>

          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative mt-8 inline-block"
          >
            <Button variant="primary" size="lg">
              Start Free Today
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </Reveal>
    </section>
  );
}
