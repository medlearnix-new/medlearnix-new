"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Trash2, CheckCircle2, Circle, HelpCircle } from "lucide-react";
import { useToast } from "../ui/ToastProvider";
import { deleteQuestion } from "@/lib/admin/actions";
import { cn } from "@/lib/utils";
import type { AdminQuestionWithContext } from "@/lib/admin/queries";

export function QuestionBankList({ questions }: { questions: AdminQuestionWithContext[] }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function handleDelete(questionId: string) {
    if (!confirm("Delete this question?")) return;
    startTransition(async () => {
      const result = await deleteQuestion(questionId);
      showToast(result.message, result.success ? "success" : "error");
      if (result.success) router.refresh();
    });
  }

  if (questions.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-12 text-center">
        <HelpCircle className="mx-auto h-10 w-10 text-slate-600" />
        <p className="mt-4 text-slate-400">
          No questions yet. Add questions from a course module in{" "}
          <span className="text-white">Courses &amp; Modules</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {questions.map((question) => {
        const isExpanded = expandedId === question.id;
        return (
          <div key={question.id} className="rounded-xl border border-slate-800/80 bg-slate-900/80">
            <button
              onClick={() => setExpandedId(isExpanded ? null : question.id)}
              className="flex w-full items-center justify-between gap-4 p-4 text-left"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{question.prompt}</p>
                <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                  {question.courseTitle && <span>{question.courseTitle}</span>}
                  {question.moduleTitle && <span>· {question.moduleTitle}</span>}
                  {question.subject && (
                    <span className="rounded-full bg-accent/10 px-2 py-0.5 text-accent">
                      {question.subject}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span
                  role="button"
                  aria-label="Delete question"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(question.id);
                  }}
                  className={cn(
                    "text-slate-500 hover:text-red-300",
                    isPending && "pointer-events-none opacity-50"
                  )}
                >
                  <Trash2 className="h-4 w-4" />
                </span>
                <ChevronDown
                  className={cn("h-4 w-4 text-slate-500 transition-transform", isExpanded && "rotate-180")}
                />
              </div>
            </button>
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col gap-2 border-t border-slate-800/80 p-4">
                    {question.answers.map((answer) => (
                      <div key={answer.id} className="flex items-start gap-2">
                        {answer.isCorrect ? (
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                        ) : (
                          <Circle className="mt-0.5 h-4 w-4 shrink-0 text-slate-600" />
                        )}
                        <div>
                          <p
                            className={cn(
                              "text-sm",
                              answer.isCorrect ? "font-semibold text-emerald-300" : "text-slate-400"
                            )}
                          >
                            {answer.optionText}
                          </p>
                          {answer.rationale && (
                            <p className="text-xs text-slate-500">{answer.rationale}</p>
                          )}
                        </div>
                      </div>
                    ))}
                    {question.rationaleGeneral && (
                      <p className="mt-1 rounded-lg bg-black/20 p-3 text-xs text-slate-400">
                        {question.rationaleGeneral}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
