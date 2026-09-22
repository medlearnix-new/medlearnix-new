"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { User, Target, CreditCard, LogOut, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const MENU_ITEMS = [
  { label: "Profile & Account", icon: User, href: "/settings" },
  { label: "Study Goal Settings", icon: Target, href: "/settings#study-goals" },
  { label: "Billing & Subscription", icon: CreditCard, href: "/pricing" },
];

export function ProfileDropdown({ name, email }: { name: string; email: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const initial = name.charAt(0).toUpperCase();

  async function handleLogout() {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 rounded-xl border border-slate-800/80 py-1.5 pl-1.5 pr-3 transition-colors hover:border-accent/40"
      >
        <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-xs font-bold text-white">
          {initial}
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-950 bg-emerald-400" />
        </span>
        <span className="hidden text-sm font-semibold text-white sm:block">{name}</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900 shadow-2xl shadow-black/40"
            >
              <div className="border-b border-slate-800/80 px-4 py-3.5">
                <p className="text-sm font-semibold text-white">{name}</p>
                <p className="truncate text-xs text-slate-500">{email}</p>
              </div>
              <div className="py-1.5">
                {MENU_ITEMS.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <item.icon className="h-4 w-4 text-slate-500" />
                    {item.label}
                  </a>
                ))}
              </div>
              <div className="border-t border-slate-800/80 py-1.5">
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-300 transition-colors hover:bg-red-500/10 disabled:opacity-60"
                >
                  {loggingOut ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="h-4 w-4" />
                  )}
                  Sign out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
