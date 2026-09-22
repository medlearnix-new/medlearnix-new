"use client";

import { useMemo, useRef, useState } from "react";
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
import {
  QUICK_STATS,
  READINESS,
  SMART_ALERT,
  CONTINUE_COURSE,
  SMART_CAT,
  getStudyPlan,
  getMasteryCategories,
} from "@/lib/dashboard-data";

export function DashboardContent({
  firstName,
  struggleAreas,
}: {
  firstName: string;
  struggleAreas: string[];
}) {
  // Icon components can't cross the Server → Client Component boundary as
  // props, so this data (which embeds Lucide icon references) is built
  // here on the client from the serializable struggleAreas prop instead of
  // being computed in the Server Component page.
  const [tasks, setTasks] = useState(() => getStudyPlan(struggleAreas));
  const masteryCategories = useMemo(() => getMasteryCategories(struggleAreas), [struggleAreas]);
  const planRef = useRef<HTMLDivElement>(null);

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
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
        <ReadinessCard percent={READINESS.percent} label={READINESS.label} />
        <StatCard
          icon={HelpCircle}
          label="Questions Completed"
          value={QUICK_STATS.questionsCompleted.toLocaleString()}
          delay={0.05}
        />
        <StatCard
          icon={TrendingUp}
          label="Average Score"
          value={`${QUICK_STATS.averageScore}%`}
          delay={0.1}
        />
        <StatCard
          icon={Clock3}
          label="Study Time This Week"
          value={QUICK_STATS.studyTimeThisWeek}
          delay={0.15}
        />
        <StatCard
          icon={GraduationCap}
          label="Course Completion"
          value={`${QUICK_STATS.courseCompletion}%`}
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
          <StudyPlanCard tasks={tasks} onToggleTask={toggleTask} estimatedMinutes={48} />
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
