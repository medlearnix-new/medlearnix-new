import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  AdminCourse,
  AdminModule,
  AdminLesson,
  AdminQuestion,
  AdminStudent,
} from "./types";

export interface AdminOverviewStats {
  totalCourses: number;
  publishedCourses: number;
  totalStudents: number;
  totalQuestions: number;
}

export async function getAdminOverviewStats(
  supabase: SupabaseClient
): Promise<AdminOverviewStats> {
  const [courses, published, students, questions] = await Promise.all([
    supabase.from("courses").select("id", { count: "exact", head: true }),
    supabase.from("courses").select("id", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "student"),
    supabase.from("questions").select("id", { count: "exact", head: true }),
  ]);

  return {
    totalCourses: courses.count ?? 0,
    publishedCourses: published.count ?? 0,
    totalStudents: students.count ?? 0,
    totalQuestions: questions.count ?? 0,
  };
}

export async function listCourses(supabase: SupabaseClient): Promise<AdminCourse[]> {
  const { data, error } = await supabase
    .from("courses")
    .select("id, slug, title, description, icon_name, total_modules, estimated_hours, is_published, created_at, course_modules(count)")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to load courses: ${error.message}`);

  return (data ?? []).map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    iconName: row.icon_name,
    totalModules: row.total_modules,
    estimatedHours: row.estimated_hours,
    isPublished: row.is_published,
    createdAt: row.created_at,
    moduleCount: row.course_modules?.[0]?.count ?? 0,
  }));
}

export async function getCourse(supabase: SupabaseClient, courseId: string) {
  const { data, error } = await supabase
    .from("courses")
    .select("id, slug, title, description, icon_name, total_modules, estimated_hours, is_published, created_at")
    .eq("id", courseId)
    .maybeSingle();

  if (error) throw new Error(`Failed to load course: ${error.message}`);
  if (!data) return null;

  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    description: data.description,
    iconName: data.icon_name,
    totalModules: data.total_modules,
    estimatedHours: data.estimated_hours,
    isPublished: data.is_published,
    createdAt: data.created_at,
  };
}

export async function listModules(
  supabase: SupabaseClient,
  courseId: string
): Promise<AdminModule[]> {
  const { data, error } = await supabase
    .from("course_modules")
    .select("id, course_id, module_number, title, description, quiz_questions_count, passing_score_pct, lessons(count), questions(count)")
    .eq("course_id", courseId)
    .order("module_number", { ascending: true });

  if (error) throw new Error(`Failed to load modules: ${error.message}`);

  return (data ?? []).map((row) => ({
    id: row.id,
    courseId: row.course_id,
    moduleNumber: row.module_number,
    title: row.title,
    description: row.description,
    quizQuestionsCount: row.quiz_questions_count,
    passingScorePct: row.passing_score_pct,
    lessonCount: row.lessons?.[0]?.count ?? 0,
    questionCount: row.questions?.[0]?.count ?? 0,
  }));
}

export interface AdminModuleWithContent extends AdminModule {
  lessons: AdminLesson[];
  questions: AdminQuestion[];
}

/** Full course tree (modules, each with its lessons and quiz questions) in
 * one call — the course editor page renders everything client-side without
 * further fetching, and re-fetches this whole tree via router.refresh()
 * after any mutation. Fine for admin-scale course sizes. */
export async function getCourseFullTree(
  supabase: SupabaseClient,
  courseId: string
): Promise<AdminModuleWithContent[]> {
  const modules = await listModules(supabase, courseId);

  const withContent = await Promise.all(
    modules.map(async (module) => {
      const [lessons, questions] = await Promise.all([
        listLessons(supabase, module.id),
        listModuleQuestions(supabase, module.id),
      ]);
      return { ...module, lessons, questions };
    })
  );

  return withContent;
}

export async function listLessons(
  supabase: SupabaseClient,
  moduleId: string
): Promise<AdminLesson[]> {
  const { data, error } = await supabase
    .from("lessons")
    .select("id, module_id, lesson_number, title, content_markdown, diagram_urls, estimated_minutes")
    .eq("module_id", moduleId)
    .order("lesson_number", { ascending: true });

  if (error) throw new Error(`Failed to load lessons: ${error.message}`);

  return (data ?? []).map((row) => ({
    id: row.id,
    moduleId: row.module_id,
    lessonNumber: row.lesson_number,
    title: row.title,
    contentMarkdown: row.content_markdown,
    diagramUrls: row.diagram_urls ?? [],
    estimatedMinutes: row.estimated_minutes,
  }));
}

export async function listModuleQuestions(
  supabase: SupabaseClient,
  moduleId: string
): Promise<AdminQuestion[]> {
  const { data, error } = await supabase
    .from("questions")
    .select("id, module_id, subject, topic, prompt, rationale_general, sort_order, question_answers(id, option_text, is_correct, rationale, sort_order)")
    .eq("module_id", moduleId)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`Failed to load questions: ${error.message}`);

  return (data ?? []).map((row) => ({
    id: row.id,
    moduleId: row.module_id,
    subject: row.subject,
    topic: row.topic,
    prompt: row.prompt,
    rationaleGeneral: row.rationale_general,
    sortOrder: row.sort_order,
    answers: (row.question_answers ?? [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((a) => ({
        id: a.id,
        optionText: a.option_text,
        isCorrect: a.is_correct,
        rationale: a.rationale,
        sortOrder: a.sort_order,
      })),
  }));
}

export interface AdminQuestionWithContext extends AdminQuestion {
  courseTitle: string | null;
  moduleTitle: string | null;
}

export async function listAllQuestions(
  supabase: SupabaseClient
): Promise<AdminQuestionWithContext[]> {
  const { data, error } = await supabase
    .from("questions")
    .select(
      "id, module_id, subject, topic, prompt, rationale_general, sort_order, question_answers(id, option_text, is_correct, rationale, sort_order), course_modules(title, courses(title))"
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to load question bank: ${error.message}`);

  return (data ?? []).map((row) => ({
    id: row.id,
    moduleId: row.module_id,
    subject: row.subject,
    topic: row.topic,
    prompt: row.prompt,
    rationaleGeneral: row.rationale_general,
    sortOrder: row.sort_order,
    answers: (row.question_answers ?? [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((a) => ({
        id: a.id,
        optionText: a.option_text,
        isCorrect: a.is_correct,
        rationale: a.rationale,
        sortOrder: a.sort_order,
      })),
    moduleTitle: (row.course_modules as unknown as { title: string; courses: { title: string } | null } | null)?.title ?? null,
    courseTitle:
      (row.course_modules as unknown as { title: string; courses: { title: string } | null } | null)?.courses
        ?.title ?? null,
  }));
}

export async function listStudents(supabase: SupabaseClient): Promise<AdminStudent[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, level, selected_plan, onboarding_completed, created_at")
    .eq("role", "student")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to load students: ${error.message}`);

  return (data ?? []).map((row) => ({
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    level: row.level,
    selectedPlan: row.selected_plan,
    onboardingCompleted: row.onboarding_completed,
    createdAt: row.created_at,
  }));
}
