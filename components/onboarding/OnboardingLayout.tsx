"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BrainCircuit, ClipboardCheck, Stethoscope, type LucideIcon } from "lucide-react";
import { Logo } from "../Logo";
import { AuthIllustration } from "../auth/AuthIllustration";

interface ValueProp {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
}

const VALUE_PROPS: ValueProp[] = [
  {
    icon: BrainCircuit,
    title: "AI Tutor",
    description: "24/7 personalized guidance",
    gradient: "from-cyan-400 to-blue-600",
  },
  {
    icon: ClipboardCheck,
    title: "NCLEX Practice",
    description: "Adaptive questions",
    gradient: "from-violet-400 to-purple-600",
  },
  {
    icon: Stethoscope,
    title: "Clinical Simulation",
    description: "Real scenarios",
    gradient: "from-rose-400 to-red-600",
  },
];

export function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background lg:flex-row">
      <div className="pointer-events-none absolute -left-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(0,242,254,0.1),transparent_65%)] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.1),transparent_65%)] blur-3xl" />

      {/* Left: brand panel */}
      <div className="relative flex w-full flex-col justify-center px-6 py-10 sm:px-10 lg:w-1/2 lg:px-16 lg:py-10 xl:px-24">
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
          className="mt-6 lg:mt-8"
        >
          <h1 className="text-3xl font-extrabold leading-[1.15] text-white sm:text-4xl">
            Your{" "}
            <span className="bg-gradient-to-r from-accent to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(0,242,254,0.35)]">
              AI Nursing
            </span>{" "}
            Study Companion
          </h1>
          <p className="mt-3 max-w-md text-base text-slate-400">
            Pass NCLEX faster with AI-powered learning.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 hidden lg:block"
        >
          <AuthIllustration />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-6 flex flex-col gap-2.5"
        >
          {VALUE_PROPS.map((prop) => (
            <div key={prop.title} className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${prop.gradient} shadow-md shadow-black/30`}
              >
                <prop.icon className="h-3.5 w-3.5 text-white" strokeWidth={2.25} />
              </div>
              <p className="text-sm text-slate-300">
                <span className="font-semibold text-white">{prop.title}</span>
                <span className="text-slate-500"> — {prop.description}</span>
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right: wizard panel */}
      <div className="relative flex w-full flex-1 items-center justify-center px-6 py-10 sm:px-10 lg:w-1/2 lg:px-16 lg:py-10">
        {children}
      </div>
    </div>
  );
}
