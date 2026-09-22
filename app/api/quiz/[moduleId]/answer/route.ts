import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { QuizAnswerResponse } from "@/lib/courses/types";

// Tutor-mode reveal: only after a student submits their choice for a
// question do correctness and rationales get sent to the client — and only
// for that one question's answers, not the whole quiz.
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
  const questionId: string | undefined = body?.questionId;
  const selectedAnswerId: string | undefined = body?.answerId;

  if (!attemptId || !questionId || !selectedAnswerId) {
    return NextResponse.json({ error: "Missing attemptId, questionId, or answerId." }, { status: 400 });
  }

  const { data: attempt } = await supabase
    .from("quiz_attempts")
    .select("id, module_id, completed_at")
    .eq("id", attemptId)
    .eq("user_id", user.id)
    .eq("module_id", moduleId)
    .maybeSingle();

  if (!attempt) {
    return NextResponse.json({ error: "Quiz attempt not found." }, { status: 404 });
  }
  if (attempt.completed_at) {
    return NextResponse.json({ error: "This quiz attempt is already complete." }, { status: 409 });
  }

  const { data: question } = await supabase
    .from("questions")
    .select("id, subject, topic, rationale_general, module_id, question_answers(id, option_text, is_correct, rationale)")
    .eq("id", questionId)
    .eq("module_id", moduleId)
    .maybeSingle();

  if (!question) {
    return NextResponse.json({ error: "Question not found." }, { status: 404 });
  }

  const answers = question.question_answers ?? [];
  const selected = answers.find((a) => a.id === selectedAnswerId);
  const correctAnswer = answers.find((a) => a.is_correct);

  if (!selected || !correctAnswer) {
    return NextResponse.json({ error: "Invalid answer option." }, { status: 400 });
  }

  const isCorrect = selected.id === correctAnswer.id;

  const { error: insertError } = await supabase.from("quiz_attempt_answers").upsert(
    {
      attempt_id: attemptId,
      user_id: user.id,
      question_id: questionId,
      question_answer_id: selectedAnswerId,
      is_correct: isCorrect,
      subject: question.subject,
      topic: question.topic,
    },
    { onConflict: "attempt_id,question_id" }
  );

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  const response: QuizAnswerResponse = {
    isCorrect,
    correctAnswerId: correctAnswer.id,
    rationaleGeneral: question.rationale_general,
    answers: answers.map((a) => ({
      id: a.id,
      text: a.option_text,
      isCorrect: a.is_correct,
      rationale: a.rationale,
    })),
  };

  return NextResponse.json(response);
}
