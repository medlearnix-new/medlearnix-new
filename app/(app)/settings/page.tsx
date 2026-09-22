import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, Target, CreditCard, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { LEVEL_OPTIONS, PREPARATION_TARGET_OPTIONS } from "@/lib/onboarding-data";

export const metadata: Metadata = { title: "Settings — MedLearnix" };

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, level, preparation_target, selected_plan")
    .eq("id", user.id)
    .maybeSingle();

  const levelLabel = LEVEL_OPTIONS.find((o) => o.value === profile?.level)?.label ?? "—";
  const targetLabel =
    PREPARATION_TARGET_OPTIONS.find((o) => o.value === profile?.preparation_target)?.label ?? "—";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-white">Settings</h1>
      <p className="mt-2 text-slate-400">Manage your account, study goals, and plan.</p>

      <div className="mt-8 flex flex-col gap-6">
        <section className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
              <User className="h-4 w-4 text-accent" />
            </div>
            <h2 className="text-base font-bold text-white">Profile &amp; Account</h2>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                Name
              </p>
              <p className="mt-1 text-sm text-white">{profile?.full_name || "—"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                Email
              </p>
              <p className="mt-1 text-sm text-white">{profile?.email || user.email}</p>
            </div>
          </div>
        </section>

        <section id="study-goals" className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
              <Target className="h-4 w-4 text-accent" />
            </div>
            <h2 className="text-base font-bold text-white">Study Goal Settings</h2>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                Current Level
              </p>
              <p className="mt-1 text-sm text-white">{levelLabel}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                Preparing For
              </p>
              <p className="mt-1 text-sm text-white">{targetLabel}</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Target exam date and daily study time goals are coming soon.
          </p>
        </section>

        <section className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
              <CreditCard className="h-4 w-4 text-accent" />
            </div>
            <h2 className="text-base font-bold text-white">Billing &amp; Subscription</h2>
          </div>
          <p className="mt-3 text-sm text-slate-400">
            Current plan:{" "}
            <span className="font-semibold text-white">
              {profile?.selected_plan
                ? `${profile.selected_plan.charAt(0).toUpperCase()}${profile.selected_plan.slice(1)} Plan`
                : "—"}
            </span>
          </p>
          <Link
            href="/pricing"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
          >
            Manage plan
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </section>
      </div>
    </div>
  );
}
