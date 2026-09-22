"use client";

import { motion } from "framer-motion";
import { Clock, CheckCircle2, Circle, Pill, HeartPulse, Stethoscope, ClipboardCheck } from "lucide-react";
import { Reveal } from "../ui/Reveal";
import { cn } from "@/lib/utils";
import type { StudyTask, StudyItemType } from "@/lib/dashboard-data";

const ITEM_TYPE_ICON: Record<StudyItemType, typeof Pill> = {
  practice: Pill,
  lesson: HeartPulse,
  case_study: Stethoscope,
  review: ClipboardCheck,
};

export function StudyPlanCard({
  tasks,
  onToggleTask,
  estimatedMinutes,
}: {
  tasks: StudyTask[];
  onToggleTask: (id: string) => void;
  estimatedMinutes: number;
}) {
  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = (completedCount / tasks.length) * 100;

  return (
    <Reveal delay={0.15}>
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-white">Today&apos;s Plan</h2>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-xs font-semibold text-accent">
            <Clock className="h-3.5 w-3.5" />
            Estimated time: {estimatedMinutes} minutes
          </span>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full bg-gradient-to-r from-accent to-cyan-400"
            />
          </div>
          <span className="shrink-0 text-xs font-semibold text-slate-400">
            {completedCount} of {tasks.length} completed
          </span>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          {tasks.map((task, i) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className={cn(
                "flex flex-col gap-3 rounded-xl border p-4 transition-colors sm:flex-row sm:items-center",
                task.completed
                  ? "border-slate-800/60 bg-white/[0.02]"
                  : "border-slate-800 bg-black/20"
              )}
            >
              <button
                onClick={() => onToggleTask(task.id)}
                aria-label={task.completed ? "Mark as not done" : "Mark as done"}
                className="shrink-0"
              >
                {task.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                ) : (
                  <Circle className="h-5 w-5 text-slate-600" />
                )}
              </button>

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                {(() => {
                  const Icon = ITEM_TYPE_ICON[task.itemType];
                  return <Icon className="h-4 w-4 text-accent" />;
                })()}
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-sm font-semibold",
                    task.completed ? "text-slate-500 line-through" : "text-white"
                  )}
                >
                  {task.subject} — {task.title}
                  <span className="ml-2 font-normal text-slate-500">({task.meta})</span>
                </p>
                {task.reason && (
                  <p className="mt-1 text-xs text-slate-500">{task.reason}</p>
                )}
              </div>

              <button
                onClick={() => onToggleTask(task.id)}
                className={cn(
                  "shrink-0 rounded-lg px-4 py-2 text-xs font-bold transition-all",
                  task.completed
                    ? "border border-slate-700 text-slate-400 hover:bg-white/5"
                    : "bg-accent text-[#04121b] hover:shadow-[0_0_18px_rgba(0,242,254,0.4)] hover:brightness-110"
                )}
              >
                {task.completed ? "Completed" : task.actionLabel}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
