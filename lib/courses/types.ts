export type ModuleStatus = "locked" | "active" | "completed";
export type EnrollmentStatus = "in_progress" | "completed";

export interface StudentCourseCard {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  iconName: string | null;
  moduleCount: number;
  estimatedHours: number | null;
  progressPct: number;
  enrollmentStatus: EnrollmentStatus | null; // null = not enrolled yet
}

export interface StudentModule {
  id: string;
  moduleNumber: number;
  title: string;
  description: string | null;
  lessonCount: number;
  questionCount: number;
  passingScorePct: number;
  status: ModuleStatus;
  bestScorePct: number | null;
  attemptsCount: number;
}

export interface StudentLesson {
  id: string;
  lessonNumber: number;
  title: string;
  contentMarkdown: string | null;
  diagramUrls: string[];
  estimatedMinutes: number | null;
}

// --- Secure quiz-taking shapes (never include is_correct or rationale
// until the answer/complete endpoints explicitly reveal them) ---

export interface SafeQuizAnswer {
  id: string;
  text: string;
}

export interface SafeQuizQuestion {
  id: string;
  prompt: string;
  subject: string | null;
  topic: string | null;
  answers: SafeQuizAnswer[];
}

export interface QuizStartResponse {
  attemptId: string;
  moduleTitle: string;
  passingScorePct: number;
  questions: SafeQuizQuestion[];
}

export interface RevealedAnswer {
  id: string;
  text: string;
  isCorrect: boolean;
  rationale: string | null;
}

export interface QuizAnswerResponse {
  isCorrect: boolean;
  correctAnswerId: string;
  rationaleGeneral: string | null;
  answers: RevealedAnswer[];
}

export interface QuizResult {
  scorePct: number;
  correctCount: number;
  totalQuestions: number;
  passed: boolean;
  strengths: string[];
  weakAreas: string[];
  nextModuleId: string | null;
}
