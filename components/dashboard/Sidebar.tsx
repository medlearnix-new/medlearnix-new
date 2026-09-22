"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Brain,
  FlaskConical,
  ClipboardCheck,
  Pill,
  Calculator,
  MessageSquareText,
  Users,
  Settings,
  LogOut,
  ChevronDown,
  Stethoscope,
  Loader2,
  X,
} from "lucide-react";
import { Logo } from "../Logo";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const PRIMARY_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/courses", label: "My Courses", icon: BookOpen },
  { href: "/smart-cat", label: "Smart CAT", icon: Brain },
  { href: "/simulation", label: "AI Simulation", icon: FlaskConical },
];

const CLINICAL_TOOLS = [
  { href: "/tools/ai-care-plan", label: "AI Care Plan", icon: ClipboardCheck },
  { href: "/tools/drug-tool", label: "Drug Tool", icon: Pill },
  { href: "/tools/dosage-calculator", label: "Dosage Calculator", icon: Calculator },
];

const SECONDARY_LINKS = [
  { href: "/ai-tutor", label: "AI Tutor", icon: MessageSquareText },
  { href: "/referrals", label: "My Referrals", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  onClick,
}: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-accent/10 text-white"
          : "text-slate-400 hover:bg-white/5 hover:text-white"
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0",
          active ? "text-accent" : "text-slate-500 group-hover:text-accent"
        )}
      />
      {label}
      {active && (
        <motion.span
          layoutId="sidebar-active-dot"
          className="ml-auto h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(0,242,254,0.8)]"
        />
      )}
    </Link>
  );
}

export function Sidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [toolsOpen, setToolsOpen] = useState(
    CLINICAL_TOOLS.some((tool) => pathname.startsWith(tool.href))
  );
  const [confirmingLogout, setConfirmingLogout] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-5">
        <Link href="/dashboard">
          <Logo />
        </Link>
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="text-slate-400 hover:text-white lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        <div className="flex flex-col gap-1">
          {PRIMARY_LINKS.map((link) => (
            <NavLink key={link.href} {...link} active={isActive(link.href)} onClick={onClose} />
          ))}
        </div>

        <div className="mt-1">
          <button
            onClick={() => setToolsOpen((v) => !v)}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Stethoscope className="h-4 w-4 shrink-0 text-slate-500" />
            Clinical Tools
            <ChevronDown
              className={cn(
                "ml-auto h-4 w-4 text-slate-500 transition-transform",
                toolsOpen && "rotate-180"
              )}
            />
          </button>
          <AnimatePresence initial={false}>
            {toolsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="ml-4 mt-1 flex flex-col gap-1 border-l border-slate-800 pl-3">
                  {CLINICAL_TOOLS.map((tool) => (
                    <NavLink key={tool.href} {...tool} active={isActive(tool.href)} onClick={onClose} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-1 flex flex-col gap-1">
          {SECONDARY_LINKS.map((link) => (
            <NavLink key={link.href} {...link} active={isActive(link.href)} onClick={onClose} />
          ))}
        </div>
      </nav>

      <div className="border-t border-slate-800/80 p-3">
        <button
          onClick={() => setConfirmingLogout(true)}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Log out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-800/80 bg-slate-950/60 lg:block">
        {content}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-800/80 bg-slate-950 lg:hidden"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Logout confirm dialog */}
      <AnimatePresence>
        {confirmingLogout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-sm rounded-2xl border border-slate-800/80 bg-slate-900 p-6 shadow-2xl"
            >
              <h3 className="text-lg font-bold text-white">Log out?</h3>
              <p className="mt-2 text-sm text-slate-400">
                You&apos;ll need to sign back in to continue your study plan.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setConfirmingLogout(false)}
                  className="flex-1 rounded-xl border border-slate-700 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500/90 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-500 disabled:opacity-70"
                >
                  {loggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                  Log out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
