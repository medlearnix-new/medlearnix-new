"use client";

import { motion } from "framer-motion";

export function RadialProgress({
  value,
  size = 76,
  stroke = 7,
  label,
}: {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(148,163,184,0.15)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#00F2FE"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{
            filter: "drop-shadow(0 0 6px rgba(0,242,254,0.6))",
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-white">{value}%</span>
        {label && (
          <span className="text-[9px] font-medium uppercase tracking-wide text-slate-400">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
