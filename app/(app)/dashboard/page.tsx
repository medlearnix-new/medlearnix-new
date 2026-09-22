import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { createClient } from "@/lib/supabase/server";
import { getDashboardData } from "@/lib/dashboard-queries";

export const metadata: Metadata = {
  title: "Dashboard — MedLearnix",
  description: "Your personalized MedLearnix study dashboard.",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, struggle_areas, overall_readiness_pct")
    .eq("id", user.id)
    .maybeSingle();

  const firstName =
    profile?.full_name?.split(" ")[0] || user.email?.split("@")[0] || "there";

  const dashboardData = await getDashboardData(supabase, user.id, {
    struggle_areas: profile?.struggle_areas ?? [],
    overall_readiness_pct: profile?.overall_readiness_pct ?? null,
  });

  // Log the page view. Awaited (un-awaited inserts aren't reliably
  // completed before a Server Component's response finishes), but errors
  // here should never break the dashboard render.
  try {
    await supabase
      .from("activity_events")
      .insert({ user_id: user.id, event_type: "dashboard_viewed" });
  } catch {
    // Non-fatal — the dashboard still renders with whatever data we have.
  }

  return (
    <DashboardContent
      firstName={firstName}
      readiness={dashboardData.readiness}
      quickStats={dashboardData.quickStats}
      tasks={dashboardData.tasks}
      planId={dashboardData.planId}
      estimatedMinutes={dashboardData.estimatedMinutes}
      masteryCategories={dashboardData.masteryCategories}
    />
  );
}
