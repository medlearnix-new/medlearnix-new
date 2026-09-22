"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, X } from "lucide-react";
import { useToast } from "../ui/ToastProvider";
import { createModule } from "@/lib/admin/actions";

export function AddModuleForm({
  courseId,
  nextModuleNumber,
  onDone,
}: {
  courseId: string;
  nextModuleNumber: number;
  onDone: () => void;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [passingScore, setPassingScore] = useState("80");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await createModule(courseId, {
        moduleNumber: nextModuleNumber,
        title,
        description,
        passingScorePct: Number(passingScore) || 80,
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
      className="flex flex-col gap-3 rounded-xl border border-accent/20 bg-accent/[0.03] p-4"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-white">New Module {nextModuleNumber}</p>
        <button type="button" onClick={onDone} className="text-slate-500 hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        placeholder="Module title"
        className="rounded-lg border border-slate-700 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none focus:border-accent/60"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        placeholder="Module overview..."
        className="w-full resize-none rounded-lg border border-slate-700 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none focus:border-accent/60"
      />

      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-400">
          Quiz passing score (%)
        </label>
        <input
          type="number"
          min="0"
          max="100"
          value={passingScore}
          onChange={(e) => setPassingScore(e.target.value)}
          className="w-28 rounded-lg border border-slate-700 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-accent/60"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-fit items-center gap-2 rounded-lg bg-accent px-4 py-2 text-xs font-bold text-[#04121b] transition-all hover:brightness-110 disabled:opacity-70"
      >
        {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
        Add Module
      </button>
    </form>
  );
}
