import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { QuizStartResponse, SafeQuizQuestion } from "@/lib/courses/types";

// Serves quiz questions for tutor-mode quiz taking. This is the one and
// only place students should ever get question data from — the response is
// hand-built from a safe field allowlist, so `is_correct` and every
// rationale never leave the server here, regardless of what the
// authenticated RLS policy on `questions`/`question_answers` would
// otherwise permit a direct API caller to read.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  const { moduleId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { data: module, error: moduleError } = await supabase
    .from("course_modules")
    .select("id, title, course_id, passing_score_pct")
    .eq("id", moduleId)
    .maybeSingle();

  if (moduleError || !module) {
    return NextResponse.json({ error: "Module not found." }, { status: 404 });
  }

  const { data: progress } = await supabase
    .from("module_progress")
    .select("status")
    .eq("user_id", user.id)
    .eq("module_id", moduleId)
    .maybeSingle();

  if (!progress || progress.status === "locked") {
    return NextResponse.json({ error: "This module is locked." }, { status: 403 });
  }

  const { data: questions, error: questionsError } = await supabase
    .from("questions")
    .select("id, prompt, subject, topic, sort_order, question_answers(id, option_text, sort_order)")
    .eq("module_id", moduleId)
    .order("sort_order", { ascending: true });

  if (questionsError) {
    return NextResponse.json({ error: questionsError.message }, { status: 500 });
  }
  if (!questions || questions.length === 0) {
    return NextResponse.json({ error: "This module has no quiz questions yet." }, { status: 404 });
  }

  const safeQuestions: SafeQuizQuestion[] = questions.map((q) => ({
    id: q.id,
    prompt: q.prompt,
    subject: q.subject,
    topic: q.topic,
    answers: (q.question_answers ?? [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((a) => ({ id: a.id, text: a.option_text })),
  }));

  const { data: attempt, error: attemptError } = await supabase
    .from("quiz_attempts")
    .insert({
      user_id: user.id,
      module_id: moduleId,
      course_id: module.course_id,
      total_questions: safeQuestions.length,
    })
    .select("id")
    .single();

  if (attemptError || !attempt) {
    return NextResponse.json(
      { error: attemptError?.message ?? "Could not start the quiz." },
      { status: 500 }
    );
  }

  const response: QuizStartResponse = {
    attemptId: attempt.id,
    moduleTitle: module.title,
    passingScorePct: module.passing_score_pct,
    questions: safeQuestions,
  };

  return NextResponse.json(response);
}
