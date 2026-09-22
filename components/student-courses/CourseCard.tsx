"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Clock, ArrowRight } from "lucide-react";
import { getCourseIcon } from "@/components/admin/CourseIconPicker";
import type { StudentCourseCard } from "@/lib/courses/types";

export function CourseCard({ course }: { course: StudentCourseCard }) {
  const Icon = getCourseIcon(course.iconName);
  const isStarted = course.enrollmentStatus !== null;
  const isCompleted = course.enrollmentStatus === "completed";

  const ctaLabel = isCompleted ? "Review Course" : isStarted ? "Continue Course" : "Start Course";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="flex h-full flex-col rounded-2xl border border-slate-800/80 bg-slate-900/80 p-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10">
          <Icon className="h-5 w-5 text-accent" />
        </div>
        {isCompleted && (
          <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
            Completed
          </span>
        )}
      </div>

      <h3 className="mt-4 text-base font-bold text-white">{course.title}</h3>
      {course.description && (
        <p className="mt-1.5 line-clamp-2 text-sm text-slate-400">{course.description}</p>
      )}

      <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5" />
          {course.moduleCount} modules
        </span>
        {course.estimatedHours && (
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {course.estimatedHours}h
          </span>
        )}
      </div>

      {isStarted && (
        <div className="mt-4 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-cyan-400"
              style={{ width: `${course.progressPct}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-slate-400">{course.progressPct}%</span>
        </div>
      )}

      <Link
        href={`/courses/${course.slug}`}
        className="mt-5 flex items-center justify-center gap-1.5 rounded-lg bg-accent py-2.5 text-sm font-bold text-[#04121b] transition-all hover:brightness-110"
      >
        {ctaLabel}
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </motion.div>
  );
}
