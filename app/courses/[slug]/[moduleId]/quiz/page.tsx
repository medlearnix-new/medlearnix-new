import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { QuizEngine } from "@/components/student-courses/QuizEngine";
import { createClient } from "@/lib/supabase/server";
import { daysUntil } from "@/lib/dashboard-queries";
import { getModuleDetail } from "@/lib/courses/queries";

export const metadata: Metadata = { title: "Module Quiz — MedLearnix" };

export default async function ModuleQuizPage({
  params,
}: {
  params: Promise<{ slug: string; moduleId: string }>;
}) {
  const { slug, moduleId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/courses/${slug}/${moduleId}/quiz`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, onboarding_completed, current_streak, nclex_exam_date")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.onboarding_completed) {
    redirect("/onboarding");
  }

  const module = await getModuleDetail(supabase, user.id, moduleId);
  if (!module || module.courseSlug !== slug) {
    notFound();
  }
  if (module.status === "locked") {
    redirect(`/courses/${slug}`);
  }
  if (module.questionCount === 0) {
    redirect(`/courses/${slug}/${moduleId}`);
  }

  const name = profile.full_name?.split(" ")[0] || user.email?.split("@")[0] || "there";

  return (
    <DashboardShell
      name={name}
      email={user.email ?? ""}
      streakDays={profile.current_streak}
      countdownDays={profile.nclex_exam_date ? daysUntil(profile.nclex_exam_date) : null}
    >
      <QuizEngine moduleId={module.id} courseSlug={slug} courseTitle={module.courseTitle} />
    </DashboardShell>
  );
}
