// Fallback/demo dashboard content, used only when a user's real data in
// Supabase (study_plans, user_mastery, activity_events) is empty — which is
// expected for most users today, since no quiz/practice feature exists yet
// to generate real mastery or activity data. See lib/dashboard-queries.ts
// for the real-data-first, fallback-second fetching logic.

export type StudyItemType = "practice" | "lesson" | "case_study" | "review";

export interface StudyTask {
  id: string;
  subject: string;
  itemType: StudyItemType;
  title: string;
  meta: string;
  reason?: string;
  actionLabel: string;
  completed: boolean;
}

export interface DashboardNotification {
  id: string;
  kind: "alert" | "reminder" | "update";
  message: string;
  timestamp: string;
  actionLabel?: string;
  read: boolean;
}

export interface MasteryCategory {
  name: string;
  percent: number;
  flagged?: boolean;
}

export const FALLBACK_QUICK_STATS = {
  questionsCompleted: 1247,
  averageScore: 78,
  studyTimeThisWeek: "4h 32m",
  courseCompletion: 43,
};

export const FALLBACK_READINESS = {
  percent: 74,
  label: "Moderate Readiness",
};

export const FALLBACK_STREAK_DAYS = 12;
export const FALLBACK_COUNTDOWN_DAYS = 32;
export const FALLBACK_ESTIMATED_MINUTES = 48;

export function getFallbackStudyPlan(struggleAreas: string[]): StudyTask[] {
  const primaryStruggle = struggleAreas[0];
  const secondaryStruggle = struggleAreas[1];

  return [
    {
      id: "fallback-pharm-anticoagulants",
      subject: "Pharmacology",
      itemType: "practice",
      title: "Anticoagulants",
      meta: "10 questions",
      reason: primaryStruggle
        ? `Why: You told us ${primaryStruggle} is a focus area.`
        : "Why: You scored 58% on this topic recently.",
      actionLabel: "Start Practice",
      completed: true,
    },
    {
      id: "fallback-med-surg-heart-failure",
      subject: "Med-Surg",
      itemType: "lesson",
      title: "Heart Failure",
      meta: "12-minute lesson",
      reason: secondaryStruggle
        ? `Why: Related to ${secondaryStruggle}, one of your focus areas.`
        : "Why: Smart CAT identified cardiovascular as a weak area.",
      actionLabel: "Continue Lesson",
      completed: false,
    },
    {
      id: "fallback-ngn-respiratory",
      subject: "NGN Case Study",
      itemType: "case_study",
      title: "Respiratory Deterioration",
      meta: "1 case",
      actionLabel: "Start Case",
      completed: false,
    },
    {
      id: "fallback-mistake-review",
      subject: "Mistake Review",
      itemType: "review",
      title: "Previously missed questions",
      meta: "6 questions",
      actionLabel: "Review Mistakes",
      completed: false,
    },
  ];
}

export function getFallbackMasteryCategories(struggleAreas: string[]): MasteryCategory[] {
  const flaggedSet = new Set(struggleAreas.map((s) => s.toLowerCase()));
  const base: MasteryCategory[] = [
    { name: "Pharmacology", percent: 61 },
    { name: "Med-Surg", percent: 69 },
    { name: "Pediatrics", percent: 78 },
    { name: "Mental Health", percent: 84 },
  ];
  return base.map((category) => ({
    ...category,
    flagged: category.percent < 65 || flaggedSet.has(category.name.toLowerCase()),
  }));
}

// Not backed by a table requested in this pass — always illustrative.
export const NOTIFICATIONS: DashboardNotification[] = [
  {
    id: "n1",
    kind: "alert",
    message: "Pattern detected: missed 4 potassium questions.",
    timestamp: "2h ago",
    actionLabel: "Review Now",
    read: false,
  },
  {
    id: "n2",
    kind: "update",
    message: "Your study plan was refreshed based on last night's session.",
    timestamp: "8h ago",
    actionLabel: "View Plan",
    read: false,
  },
  {
    id: "n3",
    kind: "reminder",
    message: "Next recommended Smart CAT test is ready in 3 days.",
    timestamp: "1d ago",
    read: true,
  },
];

export const SMART_ALERT = {
  message:
    "Pattern detected: You've missed 4 questions involving potassium and cardiac medications.",
  actionLabel: "Review Concept",
};

export const CONTINUE_COURSE = {
  title: "Medical-Surgical Nursing",
  meta: "Module 8 of 23: COPD & Asthma",
  percent: 37,
};

export const SMART_CAT = {
  lastScore: 72,
  nextInDays: 3,
};
