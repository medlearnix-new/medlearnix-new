"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface ActionResult {
  success: boolean;
  message: string;
  id?: string;
}

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, user: null, isAdmin: false };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return { supabase, user, isAdmin: profile?.role === "admin" };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ---------------------------------------------------------------------------
// Courses
// ---------------------------------------------------------------------------

export async function createCourse(input: {
  title: string;
  slug?: string;
  description?: string;
  iconName?: string;
  estimatedHours?: number;
  totalModules?: number;
}): Promise<ActionResult> {
  const { supabase, user, isAdmin } = await requireAdmin();
  if (!isAdmin || !user) {
    return { success: false, message: "You don't have permission to do that." };
  }
  if (!input.title.trim()) {
    return { success: false, message: "Title is required." };
  }

  const slug = slugify(input.slug || input.title);

  const { data, error } = await supabase
    .from("courses")
    .insert({
      title: input.title.trim(),
      slug,
      description: input.description?.trim() || null,
      icon_name: input.iconName || null,
      estimated_hours: input.estimatedHours ?? null,
      total_modules: input.totalModules ?? 0,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error) {
    const message = error.code === "23505" ? "A course with that slug already exists." : error.message;
    return { success: false, message };
  }

  revalidatePath("/admin/courses");
  return { success: true, message: "Course created.", id: data.id };
}

export async function updateCourse(
  courseId: string,
  input: {
    title: string;
    slug?: string;
    description?: string;
    iconName?: string;
    estimatedHours?: number;
    totalModules?: number;
  }
): Promise<ActionResult> {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) {
    return { success: false, message: "You don't have permission to do that." };
  }
  if (!input.title.trim()) {
    return { success: false, message: "Title is required." };
  }

  const { error } = await supabase
    .from("courses")
    .update({
      title: input.title.trim(),
      slug: slugify(input.slug || input.title),
      description: input.description?.trim() || null,
      icon_name: input.iconName || null,
      estimated_hours: input.estimatedHours ?? null,
      total_modules: input.totalModules ?? 0,
    })
    .eq("id", courseId);

  if (error) {
    const message = error.code === "23505" ? "A course with that slug already exists." : error.message;
    return { success: false, message };
  }

  revalidatePath("/admin/courses");
  revalidatePath(`/admin/courses/${courseId}`);
  return { success: true, message: "Course saved." };
}

export async function toggleCoursePublish(
  courseId: string,
  isPublished: boolean
): Promise<ActionResult> {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) {
    return { success: false, message: "You don't have permission to do that." };
  }

  const { error } = await supabase
    .from("courses")
    .update({ is_published: isPublished })
    .eq("id", courseId);

  if (error) return { success: false, message: error.message };

  revalidatePath("/admin/courses");
  revalidatePath(`/admin/courses/${courseId}`);
  return {
    success: true,
    message: isPublished ? "Course published." : "Course unpublished.",
  };
}

export async function deleteCourse(courseId: string): Promise<ActionResult> {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) {
    return { success: false, message: "You don't have permission to do that." };
  }

  const { error } = await supabase.from("courses").delete().eq("id", courseId);
  if (error) return { success: false, message: error.message };

  revalidatePath("/admin/courses");
  return { success: true, message: "Course deleted." };
}

// ---------------------------------------------------------------------------
// Modules
// ---------------------------------------------------------------------------

export async function createModule(
  courseId: string,
  input: { moduleNumber: number; title: string; description?: string; passingScorePct?: number }
): Promise<ActionResult> {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) {
    return { success: false, message: "You don't have permission to do that." };
  }
  if (!input.title.trim()) {
    return { success: false, message: "Module title is required." };
  }

  const { data, error } = await supabase
    .from("course_modules")
    .insert({
      course_id: courseId,
      module_number: input.moduleNumber,
      title: input.title.trim(),
      description: input.description?.trim() || null,
      passing_score_pct: input.passingScorePct ?? 80,
    })
    .select("id")
    .single();

  if (error) {
    const message =
      error.code === "23505" ? "A module with that number already exists on this course." : error.message;
    return { success: false, message };
  }

  revalidatePath(`/admin/courses/${courseId}`);
  return { success: true, message: "Module added.", id: data.id };
}

export async function deleteModule(moduleId: string, courseId: string): Promise<ActionResult> {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) {
    return { success: false, message: "You don't have permission to do that." };
  }

  const { error } = await supabase.from("course_modules").delete().eq("id", moduleId);
  if (error) return { success: false, message: error.message };

  revalidatePath(`/admin/courses/${courseId}`);
  return { success: true, message: "Module deleted." };
}

// ---------------------------------------------------------------------------
// Lessons
// ---------------------------------------------------------------------------

export async function createLesson(
  moduleId: string,
  courseId: string,
  input: {
    lessonNumber: number;
    title: string;
    contentMarkdown?: string;
    estimatedMinutes?: number;
    diagramUrls?: string[];
  }
): Promise<ActionResult> {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) {
    return { success: false, message: "You don't have permission to do that." };
  }
  if (!input.title.trim()) {
    return { success: false, message: "Lesson title is required." };
  }

  const { data, error } = await supabase
    .from("lessons")
    .insert({
      module_id: moduleId,
      lesson_number: input.lessonNumber,
      title: input.title.trim(),
      content_markdown: input.contentMarkdown?.trim() || null,
      estimated_minutes: input.estimatedMinutes ?? null,
      diagram_urls: input.diagramUrls ?? [],
    })
    .select("id")
    .single();

  if (error) {
    const message =
      error.code === "23505" ? "A lesson with that number already exists on this module." : error.message;
    return { success: false, message };
  }

  revalidatePath(`/admin/courses/${courseId}`);
  return { success: true, message: "Lesson added.", id: data.id };
}

export async function deleteLesson(lessonId: string, courseId: string): Promise<ActionResult> {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) {
    return { success: false, message: "You don't have permission to do that." };
  }

  const { error } = await supabase.from("lessons").delete().eq("id", lessonId);
  if (error) return { success: false, message: error.message };

  revalidatePath(`/admin/courses/${courseId}`);
  return { success: true, message: "Lesson deleted." };
}

// ---------------------------------------------------------------------------
// Quiz questions
// ---------------------------------------------------------------------------

export interface QuestionAnswerInput {
  text: string;
  isCorrect: boolean;
  rationale?: string;
}

export async function createQuestion(
  moduleId: string,
  courseId: string,
  input: {
    prompt: string;
    subject?: string;
    topic?: string;
    rationaleGeneral?: string;
    answers: QuestionAnswerInput[];
  }
): Promise<ActionResult> {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) {
    return { success: false, message: "You don't have permission to do that." };
  }
  if (!input.prompt.trim()) {
    return { success: false, message: "Question prompt is required." };
  }
  if (input.answers.length !== 4) {
    return { success: false, message: "Provide exactly 4 answer options." };
  }
  if (input.answers.some((a) => !a.text.trim())) {
    return { success: false, message: "All 4 answer options need text." };
  }
  if (input.answers.filter((a) => a.isCorrect).length !== 1) {
    return { success: false, message: "Mark exactly one answer as correct." };
  }

  const { data: question, error: questionError } = await supabase
    .from("questions")
    .insert({
      module_id: moduleId,
      subject: input.subject?.trim() || null,
      topic: input.topic?.trim() || null,
      prompt: input.prompt.trim(),
      rationale_general: input.rationaleGeneral?.trim() || null,
    })
    .select("id")
    .single();

  if (questionError) {
    return { success: false, message: questionError.message };
  }

  const { error: answersError } = await supabase.from("question_answers").insert(
    input.answers.map((answer, i) => ({
      question_id: question.id,
      option_text: answer.text.trim(),
      is_correct: answer.isCorrect,
      rationale: answer.rationale?.trim() || null,
      sort_order: i,
    }))
  );

  if (answersError) {
    // Roll back the orphaned question so we don't leave a question with no answers.
    await supabase.from("questions").delete().eq("id", question.id);
    return { success: false, message: answersError.message };
  }

  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath("/admin/questions");
  return { success: true, message: "Question added.", id: question.id };
}

export async function deleteQuestion(questionId: string, courseId?: string): Promise<ActionResult> {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) {
    return { success: false, message: "You don't have permission to do that." };
  }

  const { error } = await supabase.from("questions").delete().eq("id", questionId);
  if (error) return { success: false, message: error.message };

  if (courseId) revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath("/admin/questions");
  return { success: true, message: "Question deleted." };
}
