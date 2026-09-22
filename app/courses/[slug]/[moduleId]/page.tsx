import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { LessonViewer } from "@/components/student-courses/LessonViewer";
import { createClient } from "@/lib/supabase/server";
import { daysUntil } from "@/lib/dashboard-queries";
import { getModuleDetail } from "@/lib/courses/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; moduleId: string }>;
}): Promise<Metadata> {
  const { moduleId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { title: "Module — MedLearnix" };
  const module = await getModuleDetail(supabase, user.id, moduleId);
  return { title: module ? `${module.title} — MedLearnix` : "Module — MedLearnix" };
}

export default async function ModuleLessonPage({
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
    redirect(`/login?next=/courses/${slug}/${moduleId}`);
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

  const name = profile.full_name?.split(" ")[0] || user.email?.split("@")[0] || "there";

  return (
    <DashboardShell
      name={name}
      email={user.email ?? ""}
      streakDays={profile.current_streak}
      countdownDays={profile.nclex_exam_date ? daysUntil(profile.nclex_exam_date) : null}
    >
      <LessonViewer
        courseSlug={slug}
        moduleId={module.id}
        moduleTitle={`Module ${module.moduleNumber}: ${module.title}`}
        lessons={module.lessons}
        questionCount={module.questionCount ?? 0}
      />
    </DashboardShell>
  );
}
