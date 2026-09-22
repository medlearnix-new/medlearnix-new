"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, CheckCircle2, PlayCircle, BookText, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StudentModule } from "@/lib/courses/types";

export function ModuleList({
  courseSlug,
  modules,
}: {
  courseSlug: string;
  modules: StudentModule[];
}) {
  return (
    <div className="flex flex-col gap-3">
      {modules.map((module, i) => {
        const isLocked = module.status === "locked";
        const isCompleted = module.status === "completed";

        const content = (
          <motion.div
            whileHover={!isLocked ? { y: -2 } : undefined}
            className={cn(
              "flex items-center gap-4 rounded-2xl border p-5 transition-colors",
              isLocked
                ? "border-slate-800/60 bg-slate-900/40 opacity-60"
                : "border-slate-800/80 bg-slate-900/80 hover:border-accent/40"
            )}
          >
            <div
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                isCompleted ? "bg-emerald-400/10" : isLocked ? "bg-slate-800" : "bg-accent/10"
              )}
            >
              {isLocked ? (
                <Lock className="h-4 w-4 text-slate-500" />
              ) : isCompleted ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              ) : (
                <PlayCircle className="h-5 w-5 text-accent" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white">
                Module {module.moduleNumber}: {module.title}
              </p>
              {module.description && (
                <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">{module.description}</p>
              )}
              <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <BookText className="h-3 w-3" />
                  {module.lessonCount} lessons
                </span>
                <span className="flex items-center gap-1.5">
                  <HelpCircle className="h-3 w-3" />
                  {module.questionCount} quiz questions
                </span>
                {module.bestScorePct !== null && (
                  <span className="font-semibold text-accent">Best: {module.bestScorePct}%</span>
                )}
              </div>
            </div>

            {!isLocked && (
              <span
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-xs font-bold",
                  isCompleted ? "bg-emerald-400/10 text-emerald-400" : "bg-accent text-[#04121b]"
                )}
              >
                {isCompleted ? "Completed" : i === 0 || modules[i - 1]?.status === "completed" ? "Start" : "Continue"}
              </span>
            )}
          </motion.div>
        );

        return isLocked ? (
          <div key={module.id} className="cursor-not-allowed" aria-disabled>
            {content}
          </div>
        ) : (
          <Link key={module.id} href={`/courses/${courseSlug}/${module.id}`}>
            {content}
          </Link>
        );
      })}
    </div>
  );
}
