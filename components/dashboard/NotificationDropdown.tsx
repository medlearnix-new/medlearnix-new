"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, AlertTriangle, Sparkles, Clock, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardNotification } from "@/lib/dashboard-data";

const KIND_ICON = {
  alert: AlertTriangle,
  update: Sparkles,
  reminder: Clock,
};

const KIND_COLOR = {
  alert: "text-amber-400 bg-amber-400/10",
  update: "text-accent bg-accent/10",
  reminder: "text-violet-400 bg-violet-400/10",
};

export function NotificationDropdown({
  notifications: initial,
}: {
  notifications: DashboardNotification[];
}) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(initial);

  const unreadCount = notifications.filter((n) => !n.read).length;

  function markAsRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800/80 text-slate-300 transition-colors hover:border-accent/40 hover:text-white"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-[#04121b] shadow-[0_0_8px_rgba(0,242,254,0.6)]">
            {unreadCount}
          </span>
        )}
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
              className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900 shadow-2xl shadow-black/40"
            >
              <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-3">
                <p className="text-sm font-semibold text-white">Notifications</p>
                {unreadCount > 0 && (
                  <span className="text-xs text-slate-500">{unreadCount} unread</span>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((n) => {
                  const Icon = KIND_ICON[n.kind];
                  return (
                    <div
                      key={n.id}
                      className={cn(
                        "flex gap-3 border-b border-slate-800/60 px-4 py-3.5 last:border-b-0",
                        !n.read && "bg-white/[0.02]"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                          KIND_COLOR[n.kind]
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm leading-snug text-slate-200">{n.message}</p>
                        <div className="mt-1.5 flex items-center gap-3">
                          <span className="text-xs text-slate-500">{n.timestamp}</span>
                          {n.actionLabel && (
                            <button className="text-xs font-semibold text-accent hover:underline">
                              {n.actionLabel}
                            </button>
                          )}
                          {!n.read && (
                            <button
                              onClick={() => markAsRead(n.id)}
                              className="ml-auto flex items-center gap-1 text-xs text-slate-500 hover:text-white"
                            >
                              <Check className="h-3 w-3" />
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
