"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Reveal } from "../ui/Reveal";
import type { SMART_ALERT as SmartAlertType } from "@/lib/dashboard-data";

export function SmartAlertBanner({ alert }: { alert: typeof SmartAlertType }) {
  return (
    <Reveal delay={0.2}>
      <div className="flex flex-col items-start gap-4 rounded-2xl border border-amber-400/25 bg-amber-400/[0.06] p-5 sm:flex-row sm:items-center">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/15">
          <AlertTriangle className="h-5 w-5 text-amber-400" />
        </div>
        <p className="flex-1 text-sm text-amber-100/90">{alert.message}</p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full shrink-0 rounded-lg bg-amber-400 px-4 py-2.5 text-xs font-bold text-[#1f1400] transition-all hover:brightness-110 sm:w-auto"
        >
          {alert.actionLabel}
        </motion.button>
      </div>
    </Reveal>
  );
}
