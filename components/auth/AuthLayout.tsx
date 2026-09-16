"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BrainCircuit, ClipboardCheck, Stethoscope, type LucideIcon } from "lucide-react";
import { Logo } from "../Logo";
import { AuthIllustration } from "./AuthIllustration";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
}

const FEATURES: Feature[] = [
  {
    icon: BrainCircuit,
    title: "AI Tutor",
    description: "24/7 personalized guidance",
    gradient: "from-cyan-400 to-blue-600",
  },
  {
    icon: ClipboardCheck,
    title: "NCLEX Practice",
    description: "Adaptive, exam-style questions",
    gradient: "from-violet-400 to-purple-600",
  },
  {
    icon: Stethoscope,
    title: "Smart CAT",
    description: "Real clinical case simulations",
    gradient: "from-rose-400 to-red-600",
  },
];

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background lg:flex-row">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(0,242,254,0.1),transparent_65%)] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.1),transparent_65%)] blur-3xl" />

      {/* Left: brand panel */}
      <div className="relative flex w-full flex-col justify-center px-6 py-12 sm:px-10 lg:w-1/2 lg:px-16 lg:py-16 xl:px-24">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link href="/" className="inline-flex">
            <Logo />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 lg:mt-14"
        >
          <h1 className="text-4xl font-extrabold leading-[1.1] text-white sm:text-5xl">
            Study Smarter.
            <br />
            <span className="bg-gradient-to-r from-accent to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(0,242,254,0.35)]">
              Pass with Confidence.
            </span>
          </h1>
          <p className="mt-4 max-w-md text-lg text-slate-400">
            AI-powered NCLEX prep, built by nurses, for future nurses.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 hidden lg:block"
        >
          <AuthIllustration />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 flex flex-col gap-4 lg:mt-8"
        >
          {FEATURES.map((feature) => (
            <div key={feature.title} className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${feature.gradient} shadow-md shadow-black/30`}
              >
                <feature.icon className="h-4 w-4 text-white" strokeWidth={2.25} />
              </div>
              <p className="text-sm text-slate-300">
                <span className="font-semibold text-white">{feature.title}</span>
                <span className="text-slate-500"> — {feature.description}</span>
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right: form panel */}
      <div className="relative flex w-full flex-1 items-center justify-center px-6 py-12 sm:px-10 lg:w-1/2 lg:px-16 lg:py-16">
        {children}
      </div>
    </div>
  );
}
