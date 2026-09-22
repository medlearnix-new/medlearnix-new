"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, X } from "lucide-react";
import { useToast } from "../ui/ToastProvider";
import { createLesson } from "@/lib/admin/actions";

export function AddLessonForm({
  moduleId,
  courseId,
  nextLessonNumber,
  onDone,
}: {
  moduleId: string;
  courseId: string;
  nextLessonNumber: number;
  onDone: () => void;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [estimatedMinutes, setEstimatedMinutes] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await createLesson(moduleId, courseId, {
        lessonNumber: nextLessonNumber,
        title,
        contentMarkdown: content,
        estimatedMinutes: estimatedMinutes ? Number(estimatedMinutes) : undefined,
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
      className="mt-3 flex flex-col gap-3 rounded-xl border border-slate-700 bg-black/20 p-4"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-white">New Lesson {nextLessonNumber}</p>
        <button type="button" onClick={onDone} className="text-slate-500 hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        placeholder="Lesson title"
        className="rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none focus:border-accent/60"
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={5}
        placeholder="Lesson content (Markdown supported)..."
        className="w-full resize-y rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 font-mono text-xs text-white placeholder:text-slate-600 outline-none focus:border-accent/60"
      />

      <input
        type="number"
        min="0"
        value={estimatedMinutes}
        onChange={(e) => setEstimatedMinutes(e.target.value)}
        placeholder="Estimated minutes"
        className="w-40 rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none focus:border-accent/60"
      />

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-fit items-center gap-2 rounded-lg bg-accent px-4 py-2 text-xs font-bold text-[#04121b] transition-all hover:brightness-110 disabled:opacity-70"
      >
        {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
        Add Lesson
      </button>
    </form>
  );
}
