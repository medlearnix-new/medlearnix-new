// Study analytics (readiness score, question history, streaks, Smart CAT
// results, notifications) aren't backed by real tracking tables yet — there's
// no question bank or session-logging system in this project. Everything
// below is illustrative demo data, shaped like the real thing will be, so
// the UI can be wired to a real analytics backend later without changing
// component contracts. Anywhere we *do* have real data (name, struggle
// areas from onboarding) is used instead of a placeholder.

import type { LucideIcon } from "lucide-react";
import {
  Pill,
  HeartPulse,
  Stethoscope,
  ClipboardCheck,
  AlertTriangle,
  CalendarClock,
  Sparkles,
} from "lucide-react";

export interface StudyTask {
  id: string;
  subject: string;
  title: string;
  meta: string;
  reason?: string;
  actionLabel: string;
  icon: LucideIcon;
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

export const QUICK_STATS = {
  questionsCompleted: 1247,
  averageScore: 78,
  studyTimeThisWeek: "4h 32m",
  courseCompletion: 43,
};

export const READINESS = {
  percent: 74,
  label: "Moderate Readiness",
};

export const STUDY_STREAK_DAYS = 12;
export const NCLEX_COUNTDOWN_DAYS = 32;

export function getStudyPlan(struggleAreas: string[]): StudyTask[] {
  const primaryStruggle = struggleAreas[0];
  const secondaryStruggle = struggleAreas[1];

  return [
    {
      id: "pharm-anticoagulants",
      subject: "Pharmacology",
      title: "Anticoagulants",
      meta: "10 questions",
      reason: primaryStruggle
        ? `Why: You told us ${primaryStruggle} is a focus area.`
        : "Why: You scored 58% on this topic recently.",
      actionLabel: "Start Practice",
      icon: Pill,
      completed: true,
    },
    {
      id: "med-surg-heart-failure",
      subject: "Med-Surg",
      title: "Heart Failure",
      meta: "12-minute lesson",
      reason: secondaryStruggle
        ? `Why: Related to ${secondaryStruggle}, one of your focus areas.`
        : "Why: Smart CAT identified cardiovascular as a weak area.",
      actionLabel: "Continue Lesson",
      icon: HeartPulse,
      completed: false,
    },
    {
      id: "ngn-respiratory",
      subject: "NGN Case Study",
      title: "Respiratory Deterioration",
      meta: "1 case",
      actionLabel: "Start Case",
      icon: Stethoscope,
      completed: false,
    },
    {
      id: "mistake-review",
      subject: "Mistake Review",
      title: "Previously missed questions",
      meta: "6 questions",
      actionLabel: "Review Mistakes",
      icon: ClipboardCheck,
      completed: false,
    },
  ];
}

export function getMasteryCategories(struggleAreas: string[]): MasteryCategory[] {
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
  icon: AlertTriangle,
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

export const COUNTDOWN_ICON = CalendarClock;
export const STREAK_ICON = Sparkles;
