import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard — MedLearnix",
  description: "Your MedLearnix study dashboard.",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, level, preparation_target, struggle_areas, selected_plan, onboarding_completed")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.onboarding_completed) {
    redirect("/onboarding");
  }

  return (
    <DashboardContent
      email={user.email ?? ""}
      fullName={profile.full_name}
      level={profile.level}
      preparationTarget={profile.preparation_target}
      struggleAreas={profile.struggle_areas ?? []}
      selectedPlan={profile.selected_plan}
    />
  );
}
