import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCourse, getCourseFullTree } from "@/lib/admin/queries";
import { CourseEditor } from "@/components/admin/CourseEditor";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseId: string }>;
}): Promise<Metadata> {
  const { courseId } = await params;
  const supabase = await createClient();
  const course = await getCourse(supabase, courseId);
  return { title: course ? `${course.title} — MedLearnix Admin` : "Course — MedLearnix Admin" };
}

export default async function AdminCourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const supabase = await createClient();

  const course = await getCourse(supabase, courseId);
  if (!course) {
    notFound();
  }

  const modules = await getCourseFullTree(supabase, courseId);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/admin/courses"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to courses
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-white sm:text-3xl">{course.title}</h1>

      <div className="mt-8">
        <CourseEditor course={course} modules={modules} />
      </div>
    </div>
  );
}
