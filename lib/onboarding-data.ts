export type Level = "beginner" | "intermediate" | "advanced";
export type PreparationTarget = "nclex" | "nursing_school_exams" | "both";

export interface OnboardingState {
  level: Level | null;
  preparationTarget: PreparationTarget | null;
  struggleAreas: string[];
  selectedPlan: string | null;
}

export const LEVEL_OPTIONS: { value: Level; label: string; description: string }[] = [
  {
    value: "beginner",
    label: "Beginner",
    description: "Just starting out with nursing coursework",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    description: "Comfortable with the basics, building depth",
  },
  {
    value: "advanced",
    label: "Advanced",
    description: "Reviewing and sharpening before the exam",
  },
];

export const PREPARATION_TARGET_OPTIONS: {
  value: PreparationTarget;
  label: string;
  description: string;
}[] = [
  {
    value: "nclex",
    label: "NCLEX",
    description: "Focused prep for the licensing exam",
  },
  {
    value: "nursing_school_exams",
    label: "Nursing School Exams",
    description: "Coursework, unit exams, and finals",
  },
  {
    value: "both",
    label: "Both",
    description: "School exams now, NCLEX down the road",
  },
];

export interface StruggleCategory {
  name: string;
  options: string[];
}

export const STRUGGLE_CATEGORIES: StruggleCategory[] = [
  {
    name: "Theory",
    options: [
      "Pathophysiology",
      "Health Assessment",
      "Anatomy & Physiology",
      "Microbiology",
    ],
  },
  {
    name: "Core",
    options: [
      "Fundamentals of Nursing",
      "Medical-Surgical Nursing",
      "Pharmacology",
      "Maternal & Newborn Nursing (OB)",
      "Pediatric Nursing",
    ],
  },
  {
    name: "Practice",
    options: [
      "Dosage Calculations",
      "NCLEX Preparation / Clinical Judgment",
      "Nursing Care Plans",
      "Case Study Practice",
    ],
  },
  {
    name: "Advanced",
    options: [
      "Community & Public Health Nursing",
      "Ethics & Legal Issues",
      "Leadership & Management",
      "Evidence-Based Practice",
      "Nursing Informatics",
      "Specialty Topics",
    ],
  },
];
