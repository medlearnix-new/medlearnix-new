"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  LogOut,
  Loader2,
  GraduationCap,
  Target,
  ListChecks,
  Sparkles,
  BookOpen,
  CreditCard,
  HelpCircle,
  Mail,
} from "lucide-react";
import { Logo } from "../Logo";
import { Reveal } from "../ui/Reveal";
import { createClient } from "@/lib/supabase/client";
import { LEVEL_OPTIONS, PREPARATION_TARGET_OPTIONS } from "@/lib/onboarding-data";

const QUICK_LINKS = [
  { href: "/courses", label: "Browse Courses", icon: BookOpen },
  { href: "/pricing", label: "Manage Plan", icon: CreditCard },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
  { href: "/contact", label: "Contact Support", icon: Mail },
];

function formatPlanName(slug: string | null) {
  if (!slug) return "—";
  return `${slug.charAt(0).toUpperCase()}${slug.slice(1)} Plan`;
}

export function DashboardContent({
  email,
  fullName,
  level,
  preparationTarget,
  struggleAreas,
  selectedPlan,
}: {
  email: string;
  fullName: string | null;
  level: string | null;
  preparationTarget: string | null;
  struggleAreas: string[];
  selectedPlan: string | null;
}) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const levelLabel = LEVEL_OPTIONS.find((o) => o.value === level)?.label ?? "—";
  const targetLabel =
    PREPARATION_TARGET_OPTIONS.find((o) => o.value === preparationTarget)?.label ?? "—";
  const firstName = fullName?.split(" ")[0] || email.split("@")[0];

  async function handleLogout() {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-slate-800/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
          <Link href="/">
            <Logo />
          </Link>
          <motion.button
            whileHover={{ scale: loggingOut ? 1 : 1.02 }}
            whileTap={{ scale: loggingOut ? 1 : 0.98 }}
            onClick={handleLogout}
            disabled={loggingOut}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition-colors hover:border-accent/40 hover:text-white disabled:opacity-60"
          >
            {loggingOut ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
            Log out
          </motion.button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <Reveal>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-accent">
            <Sparkles className="h-4 w-4" />
            You&apos;re all set
          </div>
          <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-400">
            Your MedLearnix study plan is personalized based on your onboarding
            answers. Here&apos;s what we set up for you.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: GraduationCap, label: "Current Level", value: levelLabel },
            { icon: Target, label: "Preparing For", value: targetLabel },
            { icon: CreditCard, label: "Plan", value: formatPlanName(selectedPlan) },
            { icon: ListChecks, label: "Focus Areas", value: `${struggleAreas.length} selected` },
          ].map((item, i) => (
            <Reveal key={item.label} delay={i * 0.08}>
              <div className="h-full rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6">
                <item.icon className="h-5 w-5 text-accent" />
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
                  {item.label}
                </p>
                <p className="mt-1 text-lg font-bold text-white">{item.value}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {struggleAreas.length > 0 && (
          <Reveal delay={0.2} className="mt-8">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6">
              <p className="text-sm font-semibold text-white">Your focus areas</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {struggleAreas.map((area) => (
                  <span
                    key={area}
                    className="rounded-full border border-accent/20 bg-accent/5 px-3 py-1.5 text-xs font-medium text-accent"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        <Reveal delay={0.28} className="mt-12">
          <h2 className="text-xl font-bold text-white">Quick links</h2>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 transition-colors hover:border-accent/40 hover:bg-slate-900/80"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                  <link.icon className="h-5 w-5 text-accent" />
                </div>
                <span className="text-sm font-semibold text-white">{link.label}</span>
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </main>
  );
}
