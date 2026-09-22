"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, X } from "lucide-react";
import { useToast } from "../ui/ToastProvider";
import { createQuestion } from "@/lib/admin/actions";
import { cn } from "@/lib/utils";

const EMPTY_ANSWERS = [0, 1, 2, 3].map(() => ({ text: "", rationale: "" }));

export function AddQuestionForm({
  moduleId,
  courseId,
  onDone,
}: {
  moduleId: string;
  courseId: string;
  onDone: () => void;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [prompt, setPrompt] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [rationaleGeneral, setRationaleGeneral] = useState("");
  const [answers, setAnswers] = useState(EMPTY_ANSWERS);
  const [correctIndex, setCorrectIndex] = useState<number | null>(null);

  function updateAnswer(i: number, field: "text" | "rationale", value: string) {
    setAnswers((prev) => prev.map((a, idx) => (idx === i ? { ...a, [field]: value } : a)));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (correctIndex === null) {
      showToast("Mark exactly one answer as correct.", "error");
      return;
    }

    startTransition(async () => {
      const result = await createQuestion(moduleId, courseId, {
        prompt,
        subject,
        topic,
        rationaleGeneral,
        answers: answers.map((a, i) => ({
          text: a.text,
          isCorrect: i === correctIndex,
          rationale: a.rationale,
        })),
      });

      showToast(result.message, result.success ? "success" : "error");

      if (result.success) {
        router.refresh();
        onDone();
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 flex flex-col gap-4 rounded-xl border border-accent/20 bg-accent/[0.03] p-4"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-white">New Question</p>
        <button type="button" onClick={onDone} className="text-slate-500 hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject (e.g. Pharmacology)"
          className="rounded-lg border border-slate-700 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none focus:border-accent/60"
        />
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Topic (e.g. Anticoagulants)"
          className="rounded-lg border border-slate-700 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none focus:border-accent/60"
        />
      </div>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        required
        rows={2}
        placeholder="Question prompt..."
        className="w-full resize-none rounded-lg border border-slate-700 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none focus:border-accent/60"
      />

      <div className="flex flex-col gap-2.5">
        {answers.map((answer, i) => (
          <div
            key={i}
            className={cn(
              "rounded-lg border p-3",
              correctIndex === i ? "border-emerald-400/40 bg-emerald-400/5" : "border-slate-700 bg-black/20"
            )}
          >
            <div className="flex items-center gap-2.5">
              <input
                type="radio"
                name={`correct-${moduleId}`}
                checked={correctIndex === i}
                onChange={() => setCorrectIndex(i)}
                className="h-4 w-4 shrink-0 accent-accent"
                aria-label={`Mark option ${i + 1} as correct`}
              />
              <input
                value={answer.text}
                onChange={(e) => updateAnswer(i, "text", e.target.value)}
                required
                placeholder={`Option ${String.fromCharCode(65 + i)}`}
                className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-600 outline-none"
              />
            </div>
            <input
              value={answer.rationale}
              onChange={(e) => updateAnswer(i, "rationale", e.target.value)}
              placeholder={
                correctIndex === i ? "Why this is correct..." : "Why this is incorrect..."
              }
              className="mt-2 w-full rounded-md border border-slate-800 bg-black/20 px-2.5 py-1.5 text-xs text-slate-300 placeholder:text-slate-600 outline-none focus:border-accent/40"
            />
          </div>
        ))}
      </div>

      <textarea
        value={rationaleGeneral}
        onChange={(e) => setRationaleGeneral(e.target.value)}
        rows={2}
        placeholder="Overall explanation (optional)..."
        className="w-full resize-none rounded-lg border border-slate-700 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none focus:border-accent/60"
      />

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-fit items-center gap-2 rounded-lg bg-accent px-4 py-2 text-xs font-bold text-[#04121b] transition-all hover:brightness-110 disabled:opacity-70"
      >
        {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
        Add Question
      </button>
    </form>
  );
}
