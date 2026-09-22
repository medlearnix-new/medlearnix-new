"use client";

import type { LucideIcon } from "lucide-react";
import { Reveal } from "../ui/Reveal";

export function StatCard({
  icon: Icon,
  label,
  value,
  delay = 0,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  delay?: number;
}) {
  return (
    <Reveal delay={delay}>
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
          <Icon className="h-5 w-5 text-accent" />
        </div>
        <p className="mt-4 text-2xl font-bold text-white">{value}</p>
        <p className="mt-1 text-xs font-medium text-slate-500">{label}</p>
      </div>
    </Reveal>
  );
}
