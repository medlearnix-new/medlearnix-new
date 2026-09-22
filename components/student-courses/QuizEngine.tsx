"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Circle,
  ArrowRight,
  Loader2,
  Trophy,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  SafeQuizQuestion,
  QuizAnswerResponse,
  QuizResult,
} from "@/lib/courses/types";

type Phase = "loading" | "question" | "revealed" | "submitting-results" | "results" | "error";

function formatElapsed(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function QuizEngine({
  moduleId,
  courseSlug,
  courseTitle,
}: {
  moduleId: string;
  courseSlug: string;
  courseTitle: string;
}) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [error, setError] = useState<string | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [moduleTitle, setModuleTitle] = useState("");
  const [passingScorePct, setPassingScorePct] = useState(80);
  const [questions, setQuestions] = useState<SafeQuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [reveal, setReveal] = useState<QuizAnswerResponse | null>(null);
  const [results, setResults] = useState<QuizResult | null>(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function start() {
      try {
        const res = await fetch(`/api/quiz/${moduleId}/start`, { method: "POST" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Could not start the quiz.");
        if (cancelled) return;
        setAttemptId(data.attemptId);
        setModuleTitle(data.moduleTitle);
        setPassingScorePct(data.passingScorePct);
        setQuestions(data.questions);
        setPhase("question");
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not start the quiz.");
          setPhase("error");
        }
      }
    }
    start();
    return () => {
      cancelled = true;
    };
  }, [moduleId]);

  useEffect(() => {
    if (phase === "results" || phase === "error" || phase === "loading") return;
    const timer = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [phase]);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  async function handleSubmitAnswer() {
    if (!selectedAnswerId || !attemptId || !currentQuestion) return;
    setPhase("submitting-results");
    try {
      const res = await fetch(`/api/quiz/${moduleId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attemptId,
          questionId: currentQuestion.id,
          answerId: selectedAnswerId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not submit your answer.");
      setReveal(data);
      setPhase("revealed");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit your answer.");
      setPhase("error");
    }
  }

  async function handleNext() {
    if (isLastQuestion) {
      setPhase("submitting-results");
      try {
        const res = await fetch(`/api/quiz/${moduleId}/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ attemptId }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Could not finish the quiz.");
        setResults(data);
        setPhase("results");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not finish the quiz.");
        setPhase("error");
      }
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelectedAnswerId(null);
    setReveal(null);
    setPhase("question");
  }

  if (phase === "loading") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <AlertTriangle className="mx-auto h-10 w-10 text-amber-400" />
        <p className="mt-4 text-slate-300">{error}</p>
        <Link
          href={`/courses/${courseSlug}`}
          className="mt-6 inline-block rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-[#04121b] hover:brightness-110"
        >
          Back to course
        </Link>
      </div>
    );
  }

  if (phase === "results" && results) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-8 text-center"
        >
          <div
            className={cn(
              "mx-auto flex h-16 w-16 items-center justify-center rounded-full",
              results.passed ? "bg-emerald-400/10" : "bg-amber-400/10"
            )}
          >
            {results.passed ? (
              <Trophy className="h-8 w-8 text-emerald-400" />
            ) : (
              <AlertTriangle className="h-8 w-8 text-amber-400" />
            )}
          </div>

          <h1 className="mt-5 text-3xl font-extrabold text-white">{results.scorePct}%</h1>
          <p className="mt-1 text-sm text-slate-400">
            {results.correctCount} of {results.totalQuestions} correct
          </p>
          <p
            className={cn(
              "mt-3 inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide",
              results.passed ? "bg-emerald-400/10 text-emerald-400" : "bg-amber-400/10 text-amber-400"
            )}
          >
            {results.passed ? "Passed" : `Needs ${passingScorePct}% to pass`}
          </p>

          {(results.strengths.length > 0 || results.weakAreas.length > 0) && (
            <div className="mt-6 grid grid-cols-1 gap-4 text-left sm:grid-cols-2">
              {results.strengths.length > 0 && (
                <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4">
                  <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-emerald-400">
                    <Sparkles className="h-3.5 w-3.5" />
                    Strengths
                  </p>
                  <ul className="mt-2 flex flex-col gap-1 text-sm text-slate-300">
                    {results.strengths.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
              {results.weakAreas.length > 0 && (
                <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
                  <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-amber-400">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Weak Areas
                  </p>
                  <ul className="mt-2 flex flex-col gap-1 text-sm text-slate-300">
                    {results.weakAreas.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {results.weakAreas.length > 0 && (
              <Link
                href="/dashboard"
                className="flex-1 rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/5"
              >
                Review Weak Areas
              </Link>
            )}
            {results.passed && results.nextModuleId ? (
              <Link
                href={`/courses/${courseSlug}/${results.nextModuleId}`}
                className="flex-1 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-[#04121b] transition-all hover:brightness-110"
              >
                Continue to Next Module
              </Link>
            ) : (
              <Link
                href={`/courses/${courseSlug}`}
                className="flex-1 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-[#04121b] transition-all hover:brightness-110"
              >
                Back to Course
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between text-sm text-slate-400">
        <span className="font-semibold text-white">{moduleTitle}</span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {formatElapsed(elapsed)}
          </span>
          <span>
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
        <motion.div
          animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          transition={{ duration: 0.3 }}
          className="h-full rounded-full bg-gradient-to-r from-accent to-cyan-400"
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25 }}
          className="mt-8"
        >
          {currentQuestion.subject && (
            <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
              {currentQuestion.subject}
              {currentQuestion.topic ? ` · ${currentQuestion.topic}` : ""}
            </span>
          )}
          <h2 className="mt-4 text-xl font-bold leading-snug text-white">
            {currentQuestion.prompt}
          </h2>

          <div className="mt-6 flex flex-col gap-3">
            {currentQuestion.answers.map((answer) => {
              const isSelected = selectedAnswerId === answer.id;
              const revealedAnswer = reveal?.answers.find((a) => a.id === answer.id);
              const showReveal = phase === "revealed" && revealedAnswer;

              return (
                <button
                  key={answer.id}
                  onClick={() => phase === "question" && setSelectedAnswerId(answer.id)}
                  disabled={phase !== "question"}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border p-4 text-left transition-colors",
                    showReveal && revealedAnswer.isCorrect && "border-emerald-400/50 bg-emerald-400/5",
                    showReveal && !revealedAnswer.isCorrect && isSelected && "border-red-400/50 bg-red-400/5",
                    showReveal && !revealedAnswer.isCorrect && !isSelected && "border-slate-800 opacity-60",
                    !showReveal && isSelected && "border-accent/60 bg-accent/10",
                    !showReveal && !isSelected && "border-slate-700 bg-black/20 hover:border-slate-600"
                  )}
                >
                  {showReveal ? (
                    revealedAnswer.isCorrect ? (
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                    ) : isSelected ? (
                      <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                    ) : (
                      <Circle className="mt-0.5 h-5 w-5 shrink-0 text-slate-700" />
                    )
                  ) : isSelected ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  ) : (
                    <Circle className="mt-0.5 h-5 w-5 shrink-0 text-slate-600" />
                  )}
                  <div>
                    <p
                      className={cn(
                        "text-sm font-medium",
                        showReveal && revealedAnswer.isCorrect ? "text-emerald-300" : "text-white"
                      )}
                    >
                      {answer.text}
                    </p>
                    {showReveal && revealedAnswer.rationale && (
                      <p className="mt-1.5 text-xs text-slate-400">{revealedAnswer.rationale}</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {phase === "revealed" && reveal?.rationaleGeneral && (
            <div className="mt-4 rounded-xl border border-accent/20 bg-accent/5 p-4 text-sm text-slate-300">
              {reveal.rationaleGeneral}
            </div>
          )}

          <div className="mt-8">
            {phase === "revealed" ? (
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-bold text-[#04121b] transition-all hover:brightness-110"
              >
                {isLastQuestion ? "See Results" : "Next Question"}
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: selectedAnswerId ? 1.01 : 1 }}
                whileTap={{ scale: selectedAnswerId ? 0.98 : 1 }}
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswerId || phase === "submitting-results"}
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-bold text-[#04121b] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {phase === "submitting-results" && <Loader2 className="h-4 w-4 animate-spin" />}
                Submit Answer
              </motion.button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
