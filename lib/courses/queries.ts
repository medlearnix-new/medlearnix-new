import type { SupabaseClient } from "@supabase/supabase-js";
import type { StudentCourseCard, StudentModule, StudentLesson, EnrollmentStatus } from "./types";

export async function listAllPublishedCourses(
  supabase: SupabaseClient,
  userId: string
): Promise<StudentCourseCard[]> {
  const [{ data: courses, error: coursesError }, { data: enrollments }] = await Promise.all([
    supabase
      .from("courses")
      .select("id, slug, title, description, icon_name, estimated_hours, course_modules(count)")
      .eq("is_published", true)
      .order("created_at", { ascending: true }),
    supabase
      .from("course_enrollments")
      .select("course_id, status, progress_pct")
      .eq("user_id", userId),
  ]);

  if (coursesError) throw new Error(`Failed to load courses: ${coursesError.message}`);

  const enrollmentByCourse = new Map((enrollments ?? []).map((e) => [e.course_id, e]));

  return (courses ?? []).map((course) => {
    const enrollment = enrollmentByCourse.get(course.id);
    return {
      id: course.id,
      slug: course.slug,
      title: course.title,
      description: course.description,
      iconName: course.icon_name,
      moduleCount: course.course_modules?.[0]?.count ?? 0,
      estimatedHours: course.estimated_hours,
      progressPct: enrollment?.progress_pct ?? 0,
      enrollmentStatus: (enrollment?.status as EnrollmentStatus | undefined) ?? null,
    };
  });
}

export async function listMyCourses(
  supabase: SupabaseClient,
  userId: string
): Promise<StudentCourseCard[]> {
  const all = await listAllPublishedCourses(supabase, userId);
  return all.filter((c) => c.enrollmentStatus === "in_progress");
}

export async function listCompletedCourses(
  supabase: SupabaseClient,
  userId: string
): Promise<StudentCourseCard[]> {
  const all = await listAllPublishedCourses(supabase, userId);
  return all.filter((c) => c.enrollmentStatus === "completed");
}

export async function getCourseBySlug(supabase: SupabaseClient, slug: string) {
  const { data, error } = await supabase
    .from("courses")
    .select("id, slug, title, description, icon_name, estimated_hours, total_modules")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) throw new Error(`Failed to load course: ${error.message}`);
  return data;
}

/** Idempotent: creates the enrollment (if missing) and seeds module_progress
 * rows for every module (module 1 unlocked, the rest locked). Safe to call
 * on every course-page visit. */
export async function ensureEnrollment(
  supabase: SupabaseClient,
  userId: string,
  courseId: string
) {
  const { data: existing } = await supabase
    .from("course_enrollments")
    .select("id")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .maybeSingle();

  if (!existing) {
    await supabase
      .from("course_enrollments")
      .insert({ user_id: userId, course_id: courseId })
      .select("id")
      .single();
  }

  const { data: modules } = await supabase
    .from("course_modules")
    .select("id, module_number")
    .eq("course_id", courseId)
    .order("module_number", { ascending: true });

  if (!modules || modules.length === 0) return;

  const { data: existingProgress } = await supabase
    .from("module_progress")
    .select("module_id")
    .eq("user_id", userId)
    .in(
      "module_id",
      modules.map((m) => m.id)
    );

  const existingModuleIds = new Set((existingProgress ?? []).map((p) => p.module_id));
  const missing = modules.filter((m) => !existingModuleIds.has(m.id));

  if (missing.length > 0) {
    await supabase.from("module_progress").insert(
      missing.map((m) => ({
        user_id: userId,
        module_id: m.id,
        course_id: courseId,
        status: m.module_number === 1 ? "active" : "locked",
      }))
    );
  }
}

export async function getModulesWithProgress(
  supabase: SupabaseClient,
  userId: string,
  courseId: string
): Promise<StudentModule[]> {
  const [{ data: modules, error }, { data: progress }] = await Promise.all([
    supabase
      .from("course_modules")
      .select("id, module_number, title, description, passing_score_pct, lessons(count), questions(count)")
      .eq("course_id", courseId)
      .order("module_number", { ascending: true }),
    supabase
      .from("module_progress")
      .select("module_id, status, best_score_pct, attempts_count")
      .eq("user_id", userId)
      .eq("course_id", courseId),
  ]);

  if (error) throw new Error(`Failed to load modules: ${error.message}`);

  const progressByModule = new Map((progress ?? []).map((p) => [p.module_id, p]));

  return (modules ?? []).map((module) => {
    const p = progressByModule.get(module.id);
    return {
      id: module.id,
      moduleNumber: module.module_number,
      title: module.title,
      description: module.description,
      lessonCount: module.lessons?.[0]?.count ?? 0,
      questionCount: module.questions?.[0]?.count ?? 0,
      passingScorePct: module.passing_score_pct,
      status: (p?.status as StudentModule["status"] | undefined) ?? "locked",
      bestScorePct: p?.best_score_pct ?? null,
      attemptsCount: p?.attempts_count ?? 0,
    };
  });
}

export async function getModuleDetail(
  supabase: SupabaseClient,
  userId: string,
  moduleId: string
) {
  const { data: module, error } = await supabase
    .from("course_modules")
    .select("id, course_id, module_number, title, description, passing_score_pct, courses(slug, title)")
    .eq("id", moduleId)
    .maybeSingle();

  if (error) throw new Error(`Failed to load module: ${error.message}`);
  if (!module) return null;

  const [{ data: lessons }, { data: progress }, { count: questionCount }] = await Promise.all([
    supabase
      .from("lessons")
      .select("id, lesson_number, title, content_markdown, diagram_urls, estimated_minutes")
      .eq("module_id", moduleId)
      .order("lesson_number", { ascending: true }),
    supabase
      .from("module_progress")
      .select("status, best_score_pct, attempts_count")
      .eq("user_id", userId)
      .eq("module_id", moduleId)
      .maybeSingle(),
    supabase
      .from("questions")
      .select("id", { count: "exact", head: true })
      .eq("module_id", moduleId),
  ]);

  const lessonList: StudentLesson[] = (lessons ?? []).map((l) => ({
    id: l.id,
    lessonNumber: l.lesson_number,
    title: l.title,
    contentMarkdown: l.content_markdown,
    diagramUrls: l.diagram_urls ?? [],
    estimatedMinutes: l.estimated_minutes,
  }));

  const courseInfo = module.courses as unknown as { slug: string; title: string } | null;

  return {
    id: module.id,
    courseId: module.course_id,
    courseSlug: courseInfo?.slug ?? "",
    courseTitle: courseInfo?.title ?? "",
    moduleNumber: module.module_number,
    title: module.title,
    description: module.description,
    passingScorePct: module.passing_score_pct,
    status: (progress?.status as "locked" | "active" | "completed" | undefined) ?? "locked",
    bestScorePct: progress?.best_score_pct ?? null,
    attemptsCount: progress?.attempts_count ?? 0,
    lessons: lessonList,
    questionCount: questionCount ?? 0,
  };
}
