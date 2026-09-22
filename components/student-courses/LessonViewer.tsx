"use client";

import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { Clock, HelpCircle } from "lucide-react";
import type { StudentLesson } from "@/lib/courses/types";

export function LessonViewer({
  courseSlug,
  moduleId,
  moduleTitle,
  lessons,
  questionCount,
}: {
  courseSlug: string;
  moduleId: string;
  moduleTitle: string;
  lessons: StudentLesson[];
  questionCount: number;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-white sm:text-3xl">{moduleTitle}</h1>

      {lessons.length === 0 ? (
        <p className="mt-8 text-slate-400">This module has no lesson content yet.</p>
      ) : (
        <div className="mt-8 flex flex-col gap-10">
          {lessons.map((lesson) => (
            <article key={lesson.id}>
              <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                <h2 className="text-lg font-bold text-white">
                  {lesson.lessonNumber}. {lesson.title}
                </h2>
                {lesson.estimatedMinutes && (
                  <span className="flex shrink-0 items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="h-3.5 w-3.5" />
                    {lesson.estimatedMinutes} min
                  </span>
                )}
              </div>

              {lesson.contentMarkdown && (
                <div className="prose prose-invert prose-sm mt-4 max-w-none prose-headings:text-white prose-p:text-slate-300 prose-strong:text-white prose-li:text-slate-300 prose-a:text-accent">
                  <ReactMarkdown>{lesson.contentMarkdown}</ReactMarkdown>
                </div>
              )}

              {lesson.diagramUrls.length > 0 && (
                <div className="mt-5 flex flex-col gap-4">
                  {lesson.diagramUrls.map((url) => (
                    <div key={url} className="relative overflow-hidden rounded-xl border border-slate-800">
                      <Image
                        src={url}
                        alt={`Diagram for ${lesson.title}`}
                        width={800}
                        height={500}
                        className="h-auto w-full"
                      />
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-accent/20 bg-accent/5 p-8 text-center"
      >
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <HelpCircle className="h-4 w-4 text-accent" />
          {questionCount} question quiz to complete this module
        </div>
        {questionCount > 0 ? (
          <Link
            href={`/courses/${courseSlug}/${moduleId}/quiz`}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 text-base font-bold text-[#04121b] transition-all hover:shadow-[0_0_25px_rgba(0,242,254,0.4)] hover:brightness-110"
          >
            Take Module Quiz →
          </Link>
        ) : (
          <p className="text-sm text-slate-500">This module&apos;s quiz isn&apos;t ready yet.</p>
        )}
      </motion.div>
    </div>
  );
}
