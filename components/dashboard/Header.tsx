"use client";

import { Menu, Search, CalendarClock, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { NotificationDropdown } from "./NotificationDropdown";
import { ProfileDropdown } from "./ProfileDropdown";
import { NOTIFICATIONS } from "@/lib/dashboard-data";

export function Header({
  name,
  email,
  streakDays,
  countdownDays,
  onOpenMobileNav,
}: {
  name: string;
  email: string;
  streakDays: number;
  countdownDays: number | null;
  onOpenMobileNav: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-background/80 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <button
          onClick={onOpenMobileNav}
          aria-label="Open menu"
          className="text-slate-300 hover:text-white lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative hidden max-w-md flex-1 sm:block">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search topics, drugs, or clinical scenarios..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900/60 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-accent/60"
          />
        </div>

        <button
          aria-label="Search"
          className="ml-auto text-slate-300 hover:text-white sm:hidden"
        >
          <Search className="h-5 w-5" />
        </button>

        <div className="ml-auto flex items-center gap-2.5 sm:ml-4">
          {countdownDays !== null && (
            <div
              title={`${countdownDays} days until your target NCLEX date`}
              className="hidden items-center gap-1.5 rounded-full border border-accent/20 bg-accent/5 px-3 py-1.5 text-xs font-semibold text-accent md:flex"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              <CalendarClock className="h-3.5 w-3.5" />
              {countdownDays >= 0
                ? `NCLEX in ${countdownDays} days`
                : "NCLEX date has passed"}
            </div>
          )}

          <motion.div
            whileHover={{ scale: 1.04 }}
            title={`${streakDays}-day study streak`}
            className="hidden items-center gap-1.5 rounded-full border border-orange-400/20 bg-orange-400/5 px-3 py-1.5 text-xs font-semibold text-orange-300 sm:flex"
          >
            <Flame className="h-3.5 w-3.5" />
            {streakDays} {streakDays === 1 ? "Day" : "Days"} 🔥
          </motion.div>

          <NotificationDropdown notifications={NOTIFICATIONS} />
          <ProfileDropdown name={name} email={email} />
        </div>
      </div>
    </header>
  );
}
