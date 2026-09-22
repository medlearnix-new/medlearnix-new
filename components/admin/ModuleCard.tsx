"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  BookText,
  HelpCircle,
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { useToast } from "../ui/ToastProvider";
import { deleteModule, deleteLesson, deleteQuestion } from "@/lib/admin/actions";
import { AddLessonForm } from "./AddLessonForm";
import { AddQuestionForm } from "./AddQuestionForm";
import { cn } from "@/lib/utils";
import { QUIZ_TARGET_QUESTIONS, type AdminModule, type AdminLesson, type AdminQuestion } from "@/lib/admin/types";

export function ModuleCard({
  module,
  courseId,
  defaultOpen = false,
}: {
  module: AdminModule & { lessons: AdminLesson[]; questions: AdminQuestion[] };
  courseId: string;
  defaultOpen?: boolean;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(defaultOpen);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  function handleDeleteModule() {
    if (!confirm(`Delete module "${module.title}"? This removes its lessons and questions too.`)) {
      return;
    }
    startTransition(async () => {
      const result = await deleteModule(module.id, courseId);
      showToast(result.message, result.success ? "success" : "error");
      if (result.success) router.refresh();
    });
  }

  function handleDeleteLesson(lessonId: string, title: string) {
    if (!confirm(`Delete lesson "${title}"?`)) return;
    startTransition(async () => {
      const result = await deleteLesson(lessonId, courseId);
      showToast(result.message, result.success ? "success" : "error");
      if (result.success) router.refresh();
    });
  }

  function handleDeleteQuestion(questionId: string) {
    if (!confirm("Delete this question?")) return;
    startTransition(async () => {
      const result = await deleteQuestion(questionId, courseId);
      showToast(result.message, result.success ? "success" : "error");
      if (result.success) router.refresh();
    });
  }

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/80">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-sm font-bold text-accent">
            {module.moduleNumber}
          </span>
          <div>
            <p className="text-sm font-bold text-white">{module.title}</p>
            <p className="text-xs text-slate-500">
              {module.lessonCount} lesson{module.lessonCount === 1 ? "" : "s"} ·{" "}
              {module.questionCount} / {QUIZ_TARGET_QUESTIONS} quiz questions
            </p>
          </div>
        </div>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-slate-500 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-800/80 p-5">
              {module.description && (
                <p className="text-sm text-slate-400">{module.description}</p>
              )}

              {/* Lessons */}
              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-slate-500">
                    <BookText className="h-3.5 w-3.5" />
                    Lessons
                  </p>
                  <button
                    onClick={() => setShowLessonForm((v) => !v)}
                    className="flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                  >
                    <Plus className="h-3 w-3" />
                    Add Lesson
                  </button>
                </div>

                {module.lessons.length > 0 && (
                  <div className="mt-3 flex flex-col gap-2">
                    {module.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-black/20 px-3.5 py-2.5"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm text-white">
                            {lesson.lessonNumber}. {lesson.title}
                          </p>
                          {lesson.estimatedMinutes && (
                            <p className="flex items-center gap-1 text-xs text-slate-500">
                              <Clock className="h-3 w-3" />
                              {lesson.estimatedMinutes} min
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteLesson(lesson.id, lesson.title)}
                          disabled={isPending}
                          className="shrink-0 text-slate-500 hover:text-red-300"
                          aria-label="Delete lesson"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {showLessonForm && (
                  <AddLessonForm
                    moduleId={module.id}
                    courseId={courseId}
                    nextLessonNumber={module.lessons.length + 1}
                    onDone={() => setShowLessonForm(false)}
                  />
                )}
              </div>

              {/* Quiz questions */}
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-slate-500">
                    <HelpCircle className="h-3.5 w-3.5" />
                    Module Quiz ({module.questions.length}/{QUIZ_TARGET_QUESTIONS})
                  </p>
                  <button
                    onClick={() => setShowQuestionForm((v) => !v)}
                    className="flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                  >
                    <Plus className="h-3 w-3" />
                    Add Question
                  </button>
                </div>

                {module.questions.length > 0 && (
                  <div className="mt-3 flex flex-col gap-2">
                    {module.questions.map((question, i) => {
                      const isExpanded = expandedQuestionId === question.id;
                      return (
                        <div
                          key={question.id}
                          className="rounded-lg border border-slate-800 bg-black/20"
                        >
                          <button
                            onClick={() => setExpandedQuestionId(isExpanded ? null : question.id)}
                            className="flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left"
                          >
                            <p className="min-w-0 flex-1 truncate text-sm text-white">
                              {i + 1}. {question.prompt}
                            </p>
                            <div className="flex shrink-0 items-center gap-3">
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteQuestion(question.id);
                                }}
                                role="button"
                                aria-label="Delete question"
                                className="text-slate-500 hover:text-red-300"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </span>
                              <ChevronDown
                                className={cn(
                                  "h-3.5 w-3.5 text-slate-500 transition-transform",
                                  isExpanded && "rotate-180"
                                )}
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
                                <div className="flex flex-col gap-1.5 border-t border-slate-800 px-3.5 py-3">
                                  {question.answers.map((answer) => (
                                    <div key={answer.id} className="flex items-start gap-2">
                                      {answer.isCorrect ? (
                                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                                      ) : (
                                        <Circle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-600" />
                                      )}
                                      <div>
                                        <p
                                          className={cn(
                                            "text-xs",
                                            answer.isCorrect ? "font-semibold text-emerald-300" : "text-slate-400"
                                          )}
                                        >
                                          {answer.optionText}
                                        </p>
                                        {answer.rationale && (
                                          <p className="text-[11px] text-slate-500">{answer.rationale}</p>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                )}

                {showQuestionForm && (
                  <AddQuestionForm
                    moduleId={module.id}
                    courseId={courseId}
                    onDone={() => setShowQuestionForm(false)}
                  />
                )}
              </div>

              <button
                onClick={handleDeleteModule}
                disabled={isPending}
                className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-red-400/80 hover:text-red-300"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete Module
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
