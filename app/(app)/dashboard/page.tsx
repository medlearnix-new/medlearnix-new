import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { createClient } from "@/lib/supabase/server";

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
    .select("full_name, struggle_areas")
    .eq("id", user.id)
    .maybeSingle();

  const firstName =
    profile?.full_name?.split(" ")[0] || user.email?.split("@")[0] || "there";
  const struggleAreas = profile?.struggle_areas ?? [];

  return <DashboardContent firstName={firstName} struggleAreas={struggleAreas} />;
}
