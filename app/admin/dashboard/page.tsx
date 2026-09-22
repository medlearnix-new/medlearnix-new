import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, CheckCircle2, Users, HelpCircle, Plus, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAdminOverviewStats, listCourses } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "Admin Overview — MedLearnix" };

export default async function AdminOverviewPage() {
  const supabase = await createClient();
  const [stats, courses] = await Promise.all([
    getAdminOverviewStats(supabase),
    listCourses(supabase),
  ]);

  const recentCourses = courses.slice(0, 5);

  const statCards = [
    { label: "Total Courses", value: stats.totalCourses, icon: BookOpen },
    { label: "Published Courses", value: stats.publishedCourses, icon: CheckCircle2 },
    { label: "Students", value: stats.totalStudents, icon: Users },
    { label: "Quiz Questions", value: stats.totalQuestions, icon: HelpCircle },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Admin Overview</h1>
          <p className="mt-2 text-slate-400">Manage courses, questions, and students.</p>
        </div>
        <Link
          href="/admin/courses/new"
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-[#04121b] transition-all hover:brightness-110"
        >
          <Plus className="h-4 w-4" />
          Add New Course
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
              <stat.icon className="h-5 w-5 text-accent" />
            </div>
            <p className="mt-4 text-2xl font-bold text-white">{stat.value}</p>
            <p className="mt-1 text-xs font-medium text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-slate-800/80 bg-slate-900/80 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Recent Courses</h2>
          <Link href="/admin/courses" className="flex items-center gap-1 text-sm font-semibold text-accent hover:underline">
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recentCourses.length === 0 ? (
          <p className="mt-6 text-sm text-slate-500">
            No courses yet.{" "}
            <Link href="/admin/courses/new" className="font-semibold text-accent hover:underline">
              Create your first course
            </Link>
            .
          </p>
        ) : (
          <div className="mt-4 flex flex-col divide-y divide-slate-800/60">
            {recentCourses.map((course) => (
              <Link
                key={course.id}
                href={`/admin/courses/${course.id}`}
                className="flex items-center justify-between gap-4 py-3.5 transition-colors hover:text-accent"
              >
                <div>
                  <p className="text-sm font-semibold text-white">{course.title}</p>
                  <p className="text-xs text-slate-500">{course.moduleCount ?? 0} modules</p>
                </div>
                <span
                  className={
                    course.isPublished
                      ? "rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-400"
                      : "rounded-full bg-slate-700/50 px-2.5 py-1 text-xs font-semibold text-slate-400"
                  }
                >
                  {course.isPublished ? "Published" : "Draft"}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
