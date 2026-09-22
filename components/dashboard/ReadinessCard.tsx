"use client";

import { motion } from "framer-motion";
import { Reveal } from "../ui/Reveal";

const SIZE = 128;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ReadinessCard({ percent, label }: { percent: number; label: string }) {
  const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;

  return (
    <Reveal delay={0.1}>
      <div className="flex h-full flex-col items-center justify-center gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/80 p-6 text-center sm:flex-row sm:text-left">
        <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
          <svg width={SIZE} height={SIZE} className="-rotate-90">
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="rgba(148,163,184,0.15)"
              strokeWidth={STROKE}
            />
            <motion.circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="url(#readiness-gradient)"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              initial={{ strokeDashoffset: CIRCUMFERENCE }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            />
            <defs>
              <linearGradient id="readiness-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f2fe" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-white">{percent}%</span>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Readiness Status
          </p>
          <p className="mt-1 text-lg font-bold text-white">{label}</p>
          <p className="mt-1.5 max-w-[220px] text-sm text-slate-400">
            Keep completing your daily plan to boost this score.
          </p>
        </div>
      </div>
    </Reveal>
  );
}
