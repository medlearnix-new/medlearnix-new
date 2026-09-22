import type { Metadata } from "next";
import { CourseForm } from "@/components/admin/CourseForm";

export const metadata: Metadata = { title: "New Course — MedLearnix Admin" };

export default function NewCoursePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-white">Add New Course</h1>
      <p className="mt-2 text-slate-400">
        Create the course, then add modules, lessons, and quiz questions.
      </p>

      <div className="mt-8 rounded-2xl border border-slate-800/80 bg-slate-900/80 p-6">
        <CourseForm mode="create" />
      </div>
    </div>
  );
}
