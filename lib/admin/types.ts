export interface AdminCourse {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  iconName: string | null;
  totalModules: number;
  estimatedHours: number | null;
  isPublished: boolean;
  createdAt: string;
  /** Actual modules created so far — only populated by list queries that
   * join course_modules; absent on a single-course lookup. */
  moduleCount?: number;
}

export interface AdminModule {
  id: string;
  courseId: string;
  moduleNumber: number;
  title: string;
  description: string | null;
  quizQuestionsCount: number;
  passingScorePct: number;
  lessonCount: number;
  questionCount: number;
}

export interface AdminLesson {
  id: string;
  moduleId: string;
  lessonNumber: number;
  title: string;
  contentMarkdown: string | null;
  diagramUrls: string[];
  estimatedMinutes: number | null;
}

export interface AdminAnswer {
  id: string;
  optionText: string;
  isCorrect: boolean;
  rationale: string | null;
  sortOrder: number;
}

export interface AdminQuestion {
  id: string;
  moduleId: string | null;
  subject: string | null;
  topic: string | null;
  prompt: string;
  rationaleGeneral: string | null;
  sortOrder: number;
  answers: AdminAnswer[];
}

export interface AdminStudent {
  id: string;
  fullName: string | null;
  email: string | null;
  level: string | null;
  selectedPlan: string | null;
  onboardingCompleted: boolean;
  createdAt: string;
}

export const QUIZ_TARGET_QUESTIONS = 15;
