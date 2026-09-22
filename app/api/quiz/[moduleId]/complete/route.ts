import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { QuizResult } from "@/lib/courses/types";

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

  const body = await request.json().catch(() => null);
  const attemptId: string | undefined = body?.attemptId;
  if (!attemptId) {
    return NextResponse.json({ error: "Missing attemptId." }, { status: 400 });
  }

  const { data: attempt } = await supabase
    .from("quiz_attempts")
    .select("id, module_id, course_id, total_questions, completed_at")
    .eq("id", attemptId)
    .eq("user_id", user.id)
    .eq("module_id", moduleId)
    .maybeSingle();

  if (!attempt) {
    return NextResponse.json({ error: "Quiz attempt not found." }, { status: 404 });
  }

  const { data: answers, error: answersError } = await supabase
    .from("quiz_attempt_answers")
    .select("is_correct, subject")
    .eq("attempt_id", attemptId);

  if (answersError) {
    return NextResponse.json({ error: answersError.message }, { status: 500 });
  }
  if (!answers || answers.length === 0) {
    return NextResponse.json({ error: "No answers were submitted for this attempt." }, { status: 400 });
  }

  const correctCount = answers.filter((a) => a.is_correct).length;
  const totalQuestions = attempt.total_questions || answers.length;
  const scorePct = Math.round((correctCount / totalQuestions) * 100);

  const { data: module } = await supabase
    .from("course_modules")
    .select("id, module_number, course_id, passing_score_pct")
    .eq("id", moduleId)
    .maybeSingle();

  if (!module) {
    return NextResponse.json({ error: "Module not found." }, { status: 404 });
  }

  const passed = scorePct >= module.passing_score_pct;

  // Finalize the attempt (only if not already completed — re-posting a
  // completed attempt is a no-op on the attempt row itself).
  if (!attempt.completed_at) {
    await supabase
      .from("quiz_attempts")
      .update({ score_pct: scorePct, correct_count: correctCount, passed, completed_at: new Date().toISOString() })
      .eq("id", attemptId);
  }

  // Update this module's progress.
  const { data: currentProgress } = await supabase
    .from("module_progress")
    .select("status, best_score_pct, attempts_count")
    .eq("user_id", user.id)
    .eq("module_id", moduleId)
    .maybeSingle();

  const bestScorePct = Math.max(scorePct, currentProgress?.best_score_pct ?? 0);
  const nextStatus = passed ? "completed" : currentProgress?.status === "completed" ? "completed" : "active";

  await supabase
    .from("module_progress")
    .update({
      status: nextStatus,
      best_score_pct: bestScorePct,
      attempts_count: (currentProgress?.attempts_count ?? 0) + 1,
      completed_at: passed ? new Date().toISOString() : null,
    })
    .eq("user_id", user.id)
    .eq("module_id", moduleId);

  // Unlock the next module if this one was passed.
  let nextModuleId: string | null = null;
  if (passed) {
    const { data: nextModule } = await supabase
      .from("course_modules")
      .select("id")
      .eq("course_id", module.course_id)
      .eq("module_number", module.module_number + 1)
      .maybeSingle();

    if (nextModule) {
      nextModuleId = nextModule.id;
      const { data: nextProgress } = await supabase
        .from("module_progress")
        .select("status")
        .eq("user_id", user.id)
        .eq("module_id", nextModule.id)
        .maybeSingle();

      if (nextProgress) {
        if (nextProgress.status === "locked") {
          await supabase
            .from("module_progress")
            .update({ status: "active" })
            .eq("user_id", user.id)
            .eq("module_id", nextModule.id);
        }
      } else {
        await supabase.from("module_progress").insert({
          user_id: user.id,
          module_id: nextModule.id,
          course_id: module.course_id,
          status: "active",
        });
      }
    }
  }

  // Recompute course-level progress from module_progress.
  const { data: allModules } = await supabase
    .from("course_modules")
    .select("id")
    .eq("course_id", module.course_id);
  const { data: allProgress } = await supabase
    .from("module_progress")
    .select("status")
    .eq("user_id", user.id)
    .eq("course_id", module.course_id);

  const totalModules = allModules?.length ?? 0;
  const completedModules = (allProgress ?? []).filter((p) => p.status === "completed").length;
  const coursePct = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  await supabase
    .from("course_enrollments")
    .update({
      progress_pct: coursePct,
      status: coursePct >= 100 ? "completed" : "in_progress",
      completed_at: coursePct >= 100 ? new Date().toISOString() : null,
    })
    .eq("user_id", user.id)
    .eq("course_id", module.course_id);

  // Update subject-level mastery from this attempt's answers.
  const bySubject = new Map<string, { total: number; correct: number }>();
  for (const answer of answers) {
    const subject = answer.subject || "General";
    const entry = bySubject.get(subject) ?? { total: 0, correct: 0 };
    entry.total += 1;
    if (answer.is_correct) entry.correct += 1;
    bySubject.set(subject, entry);
  }

  for (const [subject, { total, correct }] of bySubject) {
    const { data: existingMastery } = await supabase
      .from("user_mastery")
      .select("total_questions, correct_questions")
      .eq("user_id", user.id)
      .eq("subject", subject)
      .maybeSingle();

    const newTotal = (existingMastery?.total_questions ?? 0) + total;
    const newCorrect = (existingMastery?.correct_questions ?? 0) + correct;
    const isWeak = newTotal > 0 && newCorrect / newTotal < 0.7;

    await supabase.from("user_mastery").upsert(
      {
        user_id: user.id,
        subject,
        total_questions: newTotal,
        correct_questions: newCorrect,
        is_weak_area: isWeak,
      },
      { onConflict: "user_id,subject" }
    );
  }

  const strengths = [...bySubject.entries()]
    .filter(([, v]) => v.total > 0 && v.correct / v.total >= 0.85)
    .map(([subject]) => subject);
  const weakAreas = [...bySubject.entries()]
    .filter(([, v]) => v.total > 0 && v.correct / v.total < 0.7)
    .map(([subject]) => subject);

  const result: QuizResult = {
    scorePct,
    correctCount,
    totalQuestions,
    passed,
    strengths,
    weakAreas,
    nextModuleId,
  };

  return NextResponse.json(result);
}
