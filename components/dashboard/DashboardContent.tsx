"use client";

import { useRef, useState } from "react";
import { HelpCircle, TrendingUp, Clock3, GraduationCap } from "lucide-react";
import { Reveal } from "../ui/Reveal";
import { StatCard } from "./StatCard";
import { ReadinessCard } from "./ReadinessCard";
import { StudyPlanCard } from "./StudyPlanCard";
import { SmartAlertBanner } from "./SmartAlertBanner";
import { ContinueCourseCard } from "./ContinueCourseCard";
import { SmartCatCard } from "./SmartCatCard";
import { CategoryMasteryCard } from "./CategoryMasteryCard";
import { NextActionCard } from "./NextActionCard";
import { createClient } from "@/lib/supabase/client";
import {
  SMART_ALERT,
  CONTINUE_COURSE,
  SMART_CAT,
  type StudyTask,
  type MasteryCategory,
} from "@/lib/dashboard-data";
import type { QuickStats } from "@/lib/dashboard-queries";

export function DashboardContent({
  firstName,
  readiness,
  quickStats,
  tasks: initialTasks,
  planId,
  estimatedMinutes,
  masteryCategories,
}: {
  firstName: string;
  readiness: { percent: number; label: string };
  quickStats: QuickStats;
  tasks: StudyTask[];
  planId: string | null;
  estimatedMinutes: number;
  masteryCategories: MasteryCategory[];
}) {
  const [tasks, setTasks] = useState(initialTasks);
  const planRef = useRef<HTMLDivElement>(null);

  async function toggleTask(id: string) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const nextCompleted = !task.completed;

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: nextCompleted } : t))
    );

    // Only persist when this task is backed by a real study_plan_items row
    // (planId is null when we're showing the illustrative fallback plan —
    // there's nothing in the database to update).
    if (!planId) return;

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("study_plan_items")
      .update({
        is_completed: nextCompleted,
        completed_at: nextCompleted ? new Date().toISOString() : null,
      })
      .eq("id", id);

    await supabase.from("activity_events").insert({
      user_id: user.id,
      event_type: nextCompleted ? "study_plan_item_completed" : "study_plan_item_reopened",
      metadata: { study_plan_item_id: id, subject: task.subject, title: task.title },
    });
  }

  function scrollToPlan() {
    planRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero greeting */}
      <Reveal>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          Good morning, {firstName} 👋
        </h1>
        <p className="mt-2 text-slate-400">
          Here is your personalized roadmap for today.
        </p>
      </Reveal>

      {/* Readiness + quick stats */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.3fr)_repeat(4,minmax(0,1fr))]">
        <ReadinessCard percent={readiness.percent} label={readiness.label} />
        <StatCard
          icon={HelpCircle}
          label="Questions Completed"
          value={quickStats.questionsCompleted.toLocaleString()}
          delay={0.05}
        />
        <StatCard
          icon={TrendingUp}
          label="Average Score"
          value={`${quickStats.averageScore}%`}
          delay={0.1}
        />
        <StatCard
          icon={Clock3}
          label="Study Time This Week"
          value={quickStats.studyTimeThisWeek}
          delay={0.15}
        />
        <StatCard
          icon={GraduationCap}
          label="Course Completion"
          value={`${quickStats.courseCompletion}%`}
          delay={0.2}
        />
      </div>

      {/* Smart alert */}
      <div className="mt-6">
        <SmartAlertBanner alert={SMART_ALERT} />
      </div>

      {/* Study plan + side widgets */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div ref={planRef}>
          <StudyPlanCard
            tasks={tasks}
            onToggleTask={toggleTask}
            estimatedMinutes={estimatedMinutes}
          />
        </div>

        <div className="flex flex-col gap-4">
          <ContinueCourseCard {...CONTINUE_COURSE} />
          <SmartCatCard lastScore={SMART_CAT.lastScore} nextInDays={SMART_CAT.nextInDays} />
          <CategoryMasteryCard categories={masteryCategories} />
        </div>
      </div>

      {/* Next best action */}
      <div className="mt-6">
        <NextActionCard tasks={tasks} onFocusPlan={scrollToPlan} />
      </div>
    </div>
  );
}
