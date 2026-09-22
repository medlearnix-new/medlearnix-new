"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { useToast } from "../ui/ToastProvider";
import { createCourse, updateCourse } from "@/lib/admin/actions";
import { COURSE_ICONS } from "./CourseIconPicker";
import { cn } from "@/lib/utils";
import type { AdminCourse } from "@/lib/admin/types";

export function CourseForm({
  mode,
  initialCourse,
}: {
  mode: "create" | "edit";
  initialCourse?: AdminCourse;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(initialCourse?.title ?? "");
  const [slug, setSlug] = useState(initialCourse?.slug ?? "");
  const [description, setDescription] = useState(initialCourse?.description ?? "");
  const [iconName, setIconName] = useState(initialCourse?.iconName ?? "book-open");
  const [estimatedHours, setEstimatedHours] = useState(
    initialCourse?.estimatedHours?.toString() ?? ""
  );
  const [totalModules, setTotalModules] = useState(
    initialCourse?.totalModules?.toString() ?? ""
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const input = {
        title,
        slug,
        description,
        iconName,
        estimatedHours: estimatedHours ? Number(estimatedHours) : undefined,
        totalModules: totalModules ? Number(totalModules) : undefined,
      };

      const result =
        mode === "create" ? await createCourse(input) : await updateCourse(initialCourse!.id, input);

      showToast(result.message, result.success ? "success" : "error");

      if (result.success) {
        if (mode === "create" && result.id) {
          router.push(`/admin/courses/${result.id}`);
        } else {
          router.refresh();
        }
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="e.g. Medical-Surgical Nursing"
          className="w-full rounded-xl border border-slate-700 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-accent/60"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">Slug</label>
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="auto-generated from title if left blank"
          className="w-full rounded-xl border border-slate-700 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-accent/60"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="What will students learn in this course?"
          className="w-full resize-none rounded-xl border border-slate-700 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-accent/60"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Estimated Completion (hours)
          </label>
          <input
            type="number"
            step="0.5"
            min="0"
            value={estimatedHours}
            onChange={(e) => setEstimatedHours(e.target.value)}
            placeholder="e.g. 12"
            className="w-full rounded-xl border border-slate-700 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-accent/60"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Planned Module Count
          </label>
          <input
            type="number"
            min="0"
            value={totalModules}
            onChange={(e) => setTotalModules(e.target.value)}
            placeholder="e.g. 8"
            className="w-full rounded-xl border border-slate-700 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-accent/60"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">Icon</label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(COURSE_ICONS).map(([name, Icon]) => (
            <button
              key={name}
              type="button"
              onClick={() => setIconName(name)}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-xl border transition-colors",
                iconName === name
                  ? "border-accent/60 bg-accent/10 text-accent"
                  : "border-slate-700 bg-black/20 text-slate-400 hover:border-slate-600"
              )}
            >
              <Icon className="h-5 w-5" />
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-bold text-[#04121b] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        {mode === "create" ? "Create Course" : "Save Changes"}
      </button>
    </form>
  );
}
