import type { SupabaseClient } from "@supabase/supabase-js";
import {
  getFallbackStudyPlan,
  getFallbackMasteryCategories,
  FALLBACK_QUICK_STATS,
  FALLBACK_READINESS,
  FALLBACK_ESTIMATED_MINUTES,
  type StudyTask,
  type MasteryCategory,
  type StudyItemType,
} from "./dashboard-data";

export interface QuickStats {
  questionsCompleted: number;
  averageScore: number;
  studyTimeThisWeek: string;
  courseCompletion: number;
}

export interface DashboardData {
  readiness: { percent: number; label: string };
  quickStats: QuickStats;
  tasks: StudyTask[];
  planId: string | null;
  estimatedMinutes: number;
  masteryCategories: MasteryCategory[];
}

function readinessLabel(percent: number): string {
  if (percent >= 85) return "Strong Readiness";
  if (percent >= 60) return "Moderate Readiness";
  if (percent >= 35) return "Building Readiness";
  return "Early Days";
}

/** Whole days between today (UTC) and a "YYYY-MM-DD" date string. Shared
 * with the app layout, which shows the NCLEX countdown badge in the header
 * on every page, not just the dashboard. */
export function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const target = new Date(`${dateStr}T00:00:00Z`);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function formatMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
}

async function fetchStudyPlan(
  supabase: SupabaseClient,
  userId: string,
  struggleAreas: string[]
): Promise<{ tasks: StudyTask[]; planId: string | null; estimatedMinutes: number }> {
  const today = new Date().toISOString().slice(0, 10);

  const { data: plan } = await supabase
    .from("study_plans")
    .select("id, estimated_minutes")
    .eq("user_id", userId)
    .eq("plan_date", today)
    .maybeSingle();

  if (!plan) {
    return {
      tasks: getFallbackStudyPlan(struggleAreas),
      planId: null,
      estimatedMinutes: FALLBACK_ESTIMATED_MINUTES,
    };
  }

  const { data: items } = await supabase
    .from("study_plan_items")
    .select("id, subject, item_type, title, meta, reason_assigned, action_label, is_completed")
    .eq("plan_id", plan.id)
    .order("sort_order", { ascending: true });

  if (!items || items.length === 0) {
    return {
      tasks: getFallbackStudyPlan(struggleAreas),
      planId: null,
      estimatedMinutes: FALLBACK_ESTIMATED_MINUTES,
    };
  }

  const tasks: StudyTask[] = items.map((item) => ({
    id: item.id,
    subject: item.subject ?? "Study",
    itemType: item.item_type as StudyItemType,
    title: item.title,
    meta: item.meta ?? "",
    reason: item.reason_assigned ?? undefined,
    actionLabel: item.action_label,
    completed: item.is_completed,
  }));

  return { tasks, planId: plan.id, estimatedMinutes: plan.estimated_minutes };
}

async function fetchMasteryCategories(
  supabase: SupabaseClient,
  userId: string,
  struggleAreas: string[]
): Promise<MasteryCategory[]> {
  const { data } = await supabase
    .from("user_mastery")
    .select("subject, total_questions, correct_questions, is_weak_area")
    .eq("user_id", userId);

  if (!data || data.length === 0) {
    return getFallbackMasteryCategories(struggleAreas);
  }

  return data.map((row) => ({
    name: row.subject,
    percent:
      row.total_questions > 0
        ? Math.round((row.correct_questions / row.total_questions) * 100)
        : 0,
    flagged: row.is_weak_area,
  }));
}

async function fetchQuickStats(
  supabase: SupabaseClient,
  userId: string
): Promise<QuickStats> {
  const { data: mastery } = await supabase
    .from("user_mastery")
    .select("total_questions, correct_questions")
    .eq("user_id", userId);

  const hasMastery = !!mastery && mastery.length > 0;
  const totalQuestions = hasMastery
    ? mastery!.reduce((sum, row) => sum + row.total_questions, 0)
    : 0;
  const correctQuestions = hasMastery
    ? mastery!.reduce((sum, row) => sum + row.correct_questions, 0)
    : 0;

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: events } = await supabase
    .from("activity_events")
    .select("metadata")
    .eq("user_id", userId)
    .gte("created_at", sevenDaysAgo.toISOString());

  const studyMinutesThisWeek = (events ?? []).reduce((sum, event) => {
    const duration = event.metadata?.duration_minutes;
    return typeof duration === "number" ? sum + duration : sum;
  }, 0);

  return {
    questionsCompleted: totalQuestions > 0 ? totalQuestions : FALLBACK_QUICK_STATS.questionsCompleted,
    averageScore:
      totalQuestions > 0
        ? Math.round((correctQuestions / totalQuestions) * 100)
        : FALLBACK_QUICK_STATS.averageScore,
    studyTimeThisWeek:
      studyMinutesThisWeek > 0
        ? formatMinutes(studyMinutesThisWeek)
        : FALLBACK_QUICK_STATS.studyTimeThisWeek,
    // No enrollment/course-progress table exists yet — always illustrative.
    courseCompletion: FALLBACK_QUICK_STATS.courseCompletion,
  };
}

export async function getDashboardData(
  supabase: SupabaseClient,
  userId: string,
  profile: {
    struggle_areas: string[] | null;
    overall_readiness_pct: number | null;
  }
): Promise<DashboardData> {
  const struggleAreas = profile.struggle_areas ?? [];

  const [{ tasks, planId, estimatedMinutes }, masteryCategories, quickStats] = await Promise.all([
    fetchStudyPlan(supabase, userId, struggleAreas),
    fetchMasteryCategories(supabase, userId, struggleAreas),
    fetchQuickStats(supabase, userId),
  ]);

  const readinessPercent = profile.overall_readiness_pct ?? FALLBACK_READINESS.percent;

  return {
    readiness: {
      percent: readinessPercent,
      label:
        profile.overall_readiness_pct === null
          ? FALLBACK_READINESS.label
          : readinessLabel(readinessPercent),
    },
    quickStats,
    tasks,
    planId,
    estimatedMinutes,
    masteryCategories,
  };
}
