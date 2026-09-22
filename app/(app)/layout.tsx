import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { createClient } from "@/lib/supabase/server";
import { daysUntil } from "@/lib/dashboard-queries";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, onboarding_completed, current_streak, nclex_exam_date")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.onboarding_completed) {
    redirect("/onboarding");
  }

  const name = profile.full_name?.split(" ")[0] || user.email?.split("@")[0] || "there";

  return (
    <DashboardShell
      name={name}
      email={user.email ?? ""}
      streakDays={profile.current_streak}
      countdownDays={profile.nclex_exam_date ? daysUntil(profile.nclex_exam_date) : null}
    >
      {children}
    </DashboardShell>
  );
}
