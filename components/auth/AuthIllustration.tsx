"use client";

import { motion } from "framer-motion";
import {
  BrainCircuit,
  Stethoscope,
  HeartPulse,
  ClipboardCheck,
  type LucideIcon,
} from "lucide-react";

interface OrbitIconSpec {
  icon: LucideIcon;
  radius: number;
  duration: number;
  angleOffset: number;
  gradient: string;
}

const ORBIT_ICONS: OrbitIconSpec[] = [
  {
    icon: Stethoscope,
    radius: 132,
    duration: 18,
    angleOffset: 0,
    gradient: "from-cyan-400 to-blue-600",
  },
  {
    icon: HeartPulse,
    radius: 132,
    duration: 22,
    angleOffset: 120,
    gradient: "from-rose-400 to-red-600",
  },
  {
    icon: ClipboardCheck,
    radius: 132,
    duration: 26,
    angleOffset: 240,
    gradient: "from-violet-400 to-purple-600",
  },
];

const PARTICLES = [
  { top: "12%", left: "18%", size: 5, delay: 0 },
  { top: "22%", left: "82%", size: 4, delay: 0.6 },
  { top: "78%", left: "14%", size: 4, delay: 1.1 },
  { top: "85%", left: "78%", size: 6, delay: 0.3 },
  { top: "50%", left: "6%", size: 3, delay: 0.9 },
];

function OrbitBadge({ icon: Icon, radius, duration, angleOffset, gradient }: OrbitIconSpec) {
  return (
    <div
      className="absolute inset-0"
      style={{ transform: `rotate(${angleOffset}deg)` }}
    >
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      >
        <motion.div
          className="absolute left-1/2 top-1/2"
          style={{ x: radius }}
          animate={{ rotate: -360 }}
          transition={{ duration, repeat: Infinity, ease: "linear" }}
        >
          <div
            className={`flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} shadow-lg shadow-black/30 ring-1 ring-white/10`}
          >
            <Icon className="h-5 w-5 text-white" strokeWidth={2} />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export function AuthIllustration() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      {/* Ambient glow behind the box */}
      <motion.div
        animate={{ opacity: [0.35, 0.65, 0.35] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -inset-6 rounded-[2.5rem] bg-[radial-gradient(circle,rgba(0,242,254,0.25),transparent_70%)] blur-2xl"
      />

      {/* Bordered box */}
      <div className="relative h-full w-full overflow-hidden rounded-[2rem] border-2 border-accent/40 bg-gradient-to-b from-white/[0.04] to-white/[0.01] shadow-[0_0_60px_rgba(0,242,254,0.12)]">
        <div className="bg-grid-fade absolute inset-0 opacity-60" />

        {/* Floating particles */}
        {PARTICLES.map((p, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-accent/70 shadow-[0_0_8px_rgba(0,242,254,0.8)]"
            style={{ top: p.top, left: p.left, width: p.size, height: p.size }}
            animate={{ y: [0, -14, 0], opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.delay,
            }}
          />
        ))}

        {/* Orbit rings + icons */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative h-[280px] w-[280px]">
            <div className="absolute inset-0 rounded-full border border-accent/15" />
            <div className="absolute inset-[24px] rounded-full border border-accent/10" />

            {ORBIT_ICONS.map((spec, i) => (
              <OrbitBadge key={i} {...spec} />
            ))}

            {/* Center glow rings (radar ping) */}
            {[0, 0.7, 1.4].map((delay, i) => (
              <motion.div
                key={i}
                className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/40"
                animate={{ scale: [1, 2.1], opacity: [0.6, 0] }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay,
                }}
              />
            ))}

            {/* Center icon */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-accent to-cyan-600 shadow-[0_0_40px_rgba(0,242,254,0.55)]"
            >
              <BrainCircuit className="h-9 w-9 text-[#04121b]" strokeWidth={2} />
            </motion.div>
          </div>
        </div>

        {/* Heartbeat trace at the bottom */}
        <div className="absolute inset-x-6 bottom-6 h-10 overflow-hidden rounded-lg border border-accent/10 bg-background/40">
          <svg viewBox="0 0 300 40" className="h-full w-full" preserveAspectRatio="none">
            <motion.path
              d="M0 20 H80 L95 20 L105 4 L118 36 L130 20 L145 20 L155 12 L165 28 L175 20 H300"
              fill="none"
              stroke="rgba(0,242,254,0.85)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                repeatDelay: 0.6,
                ease: "easeInOut",
              }}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
