import type { Metadata } from "next";
import { CheckCircle2, Circle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { listStudents } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "Students — MedLearnix Admin" };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const students = await listStudents(supabase);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-white sm:text-3xl">Students</h1>
      <p className="mt-2 text-slate-400">
        {students.length} student{students.length === 1 ? "" : "s"} registered.
      </p>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-800/80 bg-slate-900/80">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800/80 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-5 py-3.5 font-semibold">Name</th>
              <th className="px-5 py-3.5 font-semibold">Email</th>
              <th className="px-5 py-3.5 font-semibold">Level</th>
              <th className="px-5 py-3.5 font-semibold">Plan</th>
              <th className="px-5 py-3.5 font-semibold">Onboarded</th>
              <th className="px-5 py-3.5 font-semibold">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {students.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-slate-500">
                  No students yet.
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id} className="text-slate-300">
                  <td className="px-5 py-3.5 font-medium text-white">
                    {student.fullName || "—"}
                  </td>
                  <td className="px-5 py-3.5 text-slate-400">{student.email || "—"}</td>
                  <td className="px-5 py-3.5 capitalize">{student.level || "—"}</td>
                  <td className="px-5 py-3.5 capitalize">{student.selectedPlan || "—"}</td>
                  <td className="px-5 py-3.5">
                    {student.onboardingCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Circle className="h-4 w-4 text-slate-600" />
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">{formatDate(student.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
