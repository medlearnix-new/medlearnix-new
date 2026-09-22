"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import { CourseCard } from "./CourseCard";
import { cn } from "@/lib/utils";
import type { StudentCourseCard } from "@/lib/courses/types";

type Tab = "mine" | "all" | "completed";

const TABS: { key: Tab; label: string }[] = [
  { key: "mine", label: "My Courses" },
  { key: "all", label: "All Courses" },
  { key: "completed", label: "Completed" },
];

export function MyCoursesView({
  myCourses,
  allCourses,
  completedCourses,
}: {
  myCourses: StudentCourseCard[];
  allCourses: StudentCourseCard[];
  completedCourses: StudentCourseCard[];
}) {
  const [tab, setTab] = useState<Tab>(myCourses.length > 0 ? "mine" : "all");

  const coursesByTab: Record<Tab, StudentCourseCard[]> = {
    mine: myCourses,
    all: allCourses,
    completed: completedCourses,
  };
  const activeCourses = coursesByTab[tab];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-white sm:text-3xl">My Courses</h1>
      <p className="mt-2 text-slate-400">Pick up where you left off, or start something new.</p>

      <div className="mt-6 inline-flex rounded-xl border border-slate-800/80 bg-slate-900/60 p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
              tab === t.key ? "bg-accent text-[#04121b]" : "text-slate-400 hover:text-white"
            )}
          >
            {t.label}
            <span className="ml-1.5 text-xs opacity-70">({coursesByTab[t.key].length})</span>
          </button>
        ))}
      </div>

      <div className="mt-8">
        {activeCourses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-slate-600" />
            <p className="mt-4 text-slate-400">
              {tab === "mine" && "You haven't started a course yet — browse All Courses to begin."}
              {tab === "all" && "No courses are available yet."}
              {tab === "completed" && "You haven't completed a course yet — keep going!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {activeCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
