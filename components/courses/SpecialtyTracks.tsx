"use client";

import { motion } from "framer-motion";
import { Check, Stethoscope, GraduationCap } from "lucide-react";
import { Reveal } from "../ui/Reveal";
import { Button } from "../ui/Button";

interface Track {
  badge: string;
  title: string;
  description: string;
  icon: typeof Stethoscope;
  features: string[];
  cta: string;
}

const TRACKS: Track[] = [
  {
    badge: "LPN / LVN Students",
    title: "NCLEX-PN",
    description:
      "Comprehensive licensing exam prep for Licensed Practical Nurses focusing on safety and effective care environments.",
    icon: Stethoscope,
    features: [
      "Unlimited practice questions",
      "AI Care Planner",
      "Dosage Calculator & Study Tools",
      "Digital Flashcard Decks",
    ],
    cta: "Enroll in PN Track",
  },
  {
    badge: "RN Students & Trainees",
    title: "NCLEX-RN",
    description:
      "Advanced Registered Nurse preparation with a deep focus on clinical judgment and management of care.",
    icon: GraduationCap,
    features: [
      "Complex clinical case studies",
      "Next-Gen NCLEX (NGN) question types",
      "Advanced Drug Tool & Diagnostic Simulators",
      "Adaptive Testing Environment",
    ],
    cta: "Enroll in RN Track",
  },
];

export function SpecialtyTracks() {
  return (
    <section className="relative bg-background py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Select Your Specialty Track
          </h2>
          <div className="mt-4 h-1 w-20 rounded-full bg-accent" />
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {TRACKS.map((track, i) => (
            <Reveal key={track.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                className="flex h-full flex-col rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-8"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] text-accent">
                      {track.badge}
                    </span>
                    <h3 className="mt-3 text-3xl font-bold text-white">
                      {track.title}
                    </h3>
                  </div>
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/5">
                    <track.icon className="h-7 w-7 text-accent" strokeWidth={1.75} />
                  </div>
                </div>

                <p className="mt-6 text-lg text-slate-400">
                  {track.description}
                </p>

                <ul className="mt-6 flex flex-1 flex-col gap-3">
                  {track.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-base text-slate-300"
                    >
                      <Check className="mt-1 h-4 w-4 shrink-0 text-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-8"
                >
                  <Button variant="outline" className="w-full justify-center">
                    {track.cta}
                  </Button>
                </motion.div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
