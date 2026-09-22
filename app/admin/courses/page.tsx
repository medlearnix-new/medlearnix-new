import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { listCourses } from "@/lib/admin/queries";
import { CourseListTable } from "@/components/admin/CourseListTable";

export const metadata: Metadata = { title: "Courses & Modules — MedLearnix Admin" };

export default async function AdminCoursesPage() {
  const supabase = await createClient();
  const courses = await listCourses(supabase);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Courses &amp; Modules</h1>
          <p className="mt-2 text-slate-400">
            {courses.length} course{courses.length === 1 ? "" : "s"} total.
          </p>
        </div>
        <Link
          href="/admin/courses/new"
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-[#04121b] transition-all hover:brightness-110"
        >
          <Plus className="h-4 w-4" />
          Add New Course
        </Link>
      </div>

      <div className="mt-8">
        <CourseListTable courses={courses} />
      </div>
    </div>
  );
}
