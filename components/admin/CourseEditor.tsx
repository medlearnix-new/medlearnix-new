"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import { useToast } from "../ui/ToastProvider";
import { toggleCoursePublish } from "@/lib/admin/actions";
import { CourseForm } from "./CourseForm";
import { AddModuleForm } from "./AddModuleForm";
import { ModuleCard } from "./ModuleCard";
import type { AdminCourse, AdminLesson, AdminModule, AdminQuestion } from "@/lib/admin/types";

export function CourseEditor({
  course,
  modules,
}: {
  course: AdminCourse;
  modules: (AdminModule & { lessons: AdminLesson[]; questions: AdminQuestion[] })[];
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [showModuleForm, setShowModuleForm] = useState(false);

  function handleTogglePublish() {
    startTransition(async () => {
      const result = await toggleCoursePublish(course.id, !course.isPublished);
      showToast(result.message, result.success ? "success" : "error");
      if (result.success) router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-white">Course Details</h2>
          <button
            onClick={handleTogglePublish}
            disabled={isPending}
            className={
              course.isPublished
                ? "inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5 disabled:opacity-60"
                : "inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-xs font-bold text-[#04121b] hover:brightness-110 disabled:opacity-60"
            }
          >
            {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {course.isPublished ? "Unpublish" : "Publish Course"}
          </button>
        </div>
        <div className="mt-5">
          <CourseForm mode="edit" initialCourse={course} />
        </div>
      </div>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-white">
            Modules <span className="text-slate-500">({modules.length})</span>
          </h2>
          <button
            onClick={() => setShowModuleForm((v) => !v)}
            className="inline-flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/5 px-4 py-2 text-xs font-bold text-accent hover:bg-accent/10"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Module
          </button>
        </div>

        {showModuleForm && (
          <div className="mt-4">
            <AddModuleForm
              courseId={course.id}
              nextModuleNumber={modules.length + 1}
              onDone={() => setShowModuleForm(false)}
            />
          </div>
        )}

        <div className="mt-4 flex flex-col gap-3">
          {modules.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-800 p-8 text-center text-sm text-slate-500">
              No modules yet. Add your first module to start building this course.
            </p>
          ) : (
            modules.map((module) => (
              <ModuleCard key={module.id} module={module} courseId={course.id} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
