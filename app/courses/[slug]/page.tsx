import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { BookOpen, Clock } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ModuleList } from "@/components/student-courses/ModuleList";
import { getCourseIcon } from "@/components/admin/CourseIconPicker";
import { createClient } from "@/lib/supabase/server";
import { daysUntil } from "@/lib/dashboard-queries";
import { getCourseBySlug, ensureEnrollment, getModulesWithProgress } from "@/lib/courses/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const course = await getCourseBySlug(supabase, slug);
  return { title: course ? `${course.title} — MedLearnix` : "Course — MedLearnix" };
}

export default async function CourseOverviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/courses/${slug}`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, onboarding_completed, current_streak, nclex_exam_date")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.onboarding_completed) {
    redirect("/onboarding");
  }

  const course = await getCourseBySlug(supabase, slug);
  if (!course) {
    notFound();
  }

  await ensureEnrollment(supabase, user.id, course.id);
  const modules = await getModulesWithProgress(supabase, user.id, course.id);

  const Icon = getCourseIcon(course.icon_name);
  const name = profile.full_name?.split(" ")[0] || user.email?.split("@")[0] || "there";

  return (
    <DashboardShell
      name={name}
      email={user.email ?? ""}
      streakDays={profile.current_streak}
      countdownDays={profile.nclex_exam_date ? daysUntil(profile.nclex_exam_date) : null}
    >
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent/10">
            <Icon className="h-7 w-7 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">{course.title}</h1>
            {course.description && <p className="mt-1.5 text-slate-400">{course.description}</p>}
            <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5" />
                {modules.length} modules
              </span>
              {course.estimated_hours && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {course.estimated_hours}h
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8">
          {modules.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-800 p-8 text-center text-sm text-slate-500">
              This course doesn&apos;t have any modules yet.
            </p>
          ) : (
            <ModuleList courseSlug={slug} modules={modules} />
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
