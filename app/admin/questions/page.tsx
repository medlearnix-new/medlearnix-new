import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { listAllQuestions } from "@/lib/admin/queries";
import { QuestionBankList } from "@/components/admin/QuestionBankList";

export const metadata: Metadata = { title: "Question Bank — MedLearnix Admin" };

export default async function AdminQuestionsPage() {
  const supabase = await createClient();
  const questions = await listAllQuestions(supabase);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-white sm:text-3xl">Question Bank</h1>
      <p className="mt-2 text-slate-400">
        {questions.length} question{questions.length === 1 ? "" : "s"} across all courses.
      </p>

      <div className="mt-8">
        <QuestionBankList questions={questions} />
      </div>
    </div>
  );
}
