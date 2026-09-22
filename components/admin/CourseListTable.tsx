"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, Clock, Trash2, Loader2 } from "lucide-react";
import { useToast } from "../ui/ToastProvider";
import { toggleCoursePublish, deleteCourse } from "@/lib/admin/actions";
import type { AdminCourse } from "@/lib/admin/types";

export function CourseListTable({ courses }: { courses: AdminCourse[] }) {
  const { showToast } = useToast();
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleTogglePublish(course: AdminCourse) {
    setPendingId(course.id);
    startTransition(async () => {
      const result = await toggleCoursePublish(course.id, !course.isPublished);
      showToast(result.message, result.success ? "success" : "error");
      setPendingId(null);
      if (result.success) router.refresh();
    });
  }

  function handleDelete(course: AdminCourse) {
    if (!confirm(`Delete "${course.title}"? This removes all its modules, lessons, and questions.`)) {
      return;
    }
    setPendingId(course.id);
    startTransition(async () => {
      const result = await deleteCourse(course.id);
      showToast(result.message, result.success ? "success" : "error");
      setPendingId(null);
      if (result.success) router.refresh();
    });
  }

  if (courses.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-12 text-center">
        <BookOpen className="mx-auto h-10 w-10 text-slate-600" />
        <p className="mt-4 text-slate-400">No courses yet.</p>
        <Link
          href="/admin/courses/new"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-bold text-[#04121b] hover:brightness-110"
        >
          Create your first course
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => {
        const rowPending = isPending && pendingId === course.id;
        return (
          <motion.div
            key={course.id}
            layout
            className="flex flex-col rounded-2xl border border-slate-800/80 bg-slate-900/80 p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <Link href={`/admin/courses/${course.id}`} className="min-w-0">
                <h3 className="truncate text-base font-bold text-white hover:text-accent">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-500">/{course.slug}</p>
              </Link>
              <span
                className={
                  course.isPublished
                    ? "shrink-0 rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-400"
                    : "shrink-0 rounded-full bg-slate-700/50 px-2.5 py-1 text-xs font-semibold text-slate-400"
                }
              >
                {course.isPublished ? "Published" : "Draft"}
              </span>
            </div>

            {course.description && (
              <p className="mt-2.5 line-clamp-2 text-sm text-slate-400">{course.description}</p>
            )}

            <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5" />
                {course.moduleCount ?? 0} / {course.totalModules || "—"} modules
              </span>
              {course.estimatedHours && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {course.estimatedHours}h
                </span>
              )}
            </div>

            <div className="mt-5 flex items-center gap-2">
              <Link
                href={`/admin/courses/${course.id}`}
                className="flex-1 rounded-lg border border-slate-700 px-3 py-2 text-center text-xs font-semibold text-white transition-colors hover:border-accent/40 hover:bg-accent/5"
              >
                Manage
              </Link>
              <button
                onClick={() => handleTogglePublish(course)}
                disabled={rowPending}
                className="flex-1 rounded-lg bg-accent px-3 py-2 text-xs font-bold text-[#04121b] transition-all hover:brightness-110 disabled:opacity-60"
              >
                {rowPending ? (
                  <Loader2 className="mx-auto h-3.5 w-3.5 animate-spin" />
                ) : course.isPublished ? (
                  "Unpublish"
                ) : (
                  "Publish"
                )}
              </button>
              <button
                onClick={() => handleDelete(course)}
                disabled={rowPending}
                aria-label="Delete course"
                className="rounded-lg border border-slate-700 p-2 text-slate-400 transition-colors hover:border-red-500/40 hover:text-red-300 disabled:opacity-60"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
