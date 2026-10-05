/**
 * Domain model for the Machine Learning Interview Preparation System.
 *
 * A structured, module-based mentor: 17 modules, each broken into topics with
 * lesson content, practice, coding tasks, interview questions and a module test.
 * All learner progress (topic scores, module statuses, weak areas, mock-interview
 * history) persists under the `ml-mentor` storage namespace.
 */

/* ── Statuses ──────────────────────────────────────────────────────────────── */

/** Module and topic lifecycle. Mirrors the tracker emojis: ⬜ 🟡 🟢 🔴 */
export type ProgressStatus = 'not_started' | 'in_progress' | 'completed' | 'needs_revision'

export const STATUS_META: Record<ProgressStatus, { label: string; emoji: string }> = {
  not_started: { label: 'Not Started', emoji: '⬜' },
  in_progress: { label: 'In Progress', emoji: '🟡' },
  completed: { label: 'Completed', emoji: '🟢' },
  needs_revision: { label: 'Needs Revision', emoji: '🔴' },
}

/** A topic scoring below this threshold is flagged as a weak area and re-tested. */
export const WEAK_TOPIC_THRESHOLD = 7

/** A module test must reach this percentage to count as passed. */
export const MODULE_TEST_PASS_PERCENTAGE = 70

/* ── Learning cycle ────────────────────────────────────────────────────────── */

export const LEARNING_CYCLE = [
  'Learn',
  'Understand',
  'Practice',
  'Code',
  'Interview Questions',
  'Module Test',
  'Review Mistakes',
  'Mark Progress',
] as const

export type CycleStep = (typeof LEARNING_CYCLE)[number]

/* ── Modules & topics ──────────────────────────────────────────────────────── */

export interface MLTopic {
  id: string
  title: string
  /** One-line answer to "why does this matter for interviews?" */
  summary: string
  /** The Learn step: short teaching paragraphs. */
  lesson: string[]
  /** Concrete mental model or analogy that locks the idea in. */
  intuition: string
  /** Key points to remember — these become flash-style revision prompts. */
  keyPoints: string[]
  /** Optional runnable example shown in the lesson. */
  exampleCode?: string
  /** The Practice step: one hands-on exercise the learner must do first. */
  practiceExercise: string
  /** The Code step: a small coding task (with expected output). */
  codingTask?: string
}

export interface MLModule {
  id: string
  number: number
  title: string
  /** Short label used by the compact progress tracker. */
  shortTitle: string
  tagline: string
  /** What the learner must be able to do in an interview after this module. */
  interviewGoal: string
  topics: MLTopic[]
}

/* ── Questions ─────────────────────────────────────────────────────────────── */

export interface QuizQuestion {
  id: string
  moduleId: string
  /** The topic this question measures; wrong answers drop the topic's score. */
  topicId: string
  prompt: string
  options: string[]
  answerIndex: number
  explanation: string
}

/** Interview question categories from Module 16. */
export type InterviewCategory =
  | 'Fundamentals'
  | 'Statistics'
  | 'Algorithms'
  | 'Practical'
  | 'Scenario'
  | 'Coding'

export type InterviewDifficulty = 'Beginner' | 'Junior' | 'Intermediate' | 'Advanced'

export const INTERVIEW_DIFFICULTIES: InterviewDifficulty[] = [
  'Beginner',
  'Junior',
  'Intermediate',
  'Advanced',
]

export interface InterviewQuestion {
  id: string
  /** Module the question belongs to; null for cross-module/scenario questions. */
  moduleId: string | null
  category: InterviewCategory
  difficulty: InterviewDifficulty
  prompt: string
  /** The strong interview answer, revealed only after the learner attempts it. */
  modelAnswer: string
  /** What a complete answer must cover — drives the self-evaluation step. */
  rubric: string[]
  /** Natural follow-up an interviewer would ask next. */
  followUp: string
}

/* ── Assessments ───────────────────────────────────────────────────────────── */

export type AssessmentKind = 'baseline' | 'module_test' | 'revision_test'

export interface AssessmentQuestionResult {
  questionId: string
  topicId: string | null
  selectedIndex: number | null
  correct: boolean
}

export interface AssessmentResult {
  id: string
  kind: AssessmentKind
  /** Module id for module/revision tests; null for the baseline. */
  moduleId: string | null
  submittedAt: string
  correctCount: number
  totalQuestions: number
  percentage: number
  /** New score (0–10) applied to each measured topic. */
  topicScores: Record<string, number>
  passed: boolean
  questionResults: AssessmentQuestionResult[]
}

/* ── Topic & module progress (persisted) ───────────────────────────────────── */

export interface TopicProgress {
  topicId: string
  moduleId: string
  status: ProgressStatus
  /** Latest score 0–10; null until first assessed. */
  score: number | null
  attempts: number
  lessonRead: boolean
  practiceDone: boolean
  codingDone: boolean
  interviewDone: boolean
  lastStudiedAt: string | null
}

export interface ModuleProgress {
  moduleId: string
  /** Best module-test percentage so far; null before the first attempt. */
  bestTestPercentage: number | null
  testAttempts: number
  interviewAnswered: number
}

export interface ProgressState {
  baselineDone: boolean
  /** Module the mentor decided to start from after the baseline assessment. */
  startingModuleId: string | null
  /** Highest module unlocked — next module stays locked until this one passes. */
  currentModuleId: string
  topics: Record<string, TopicProgress>
  modules: Record<string, ModuleProgress>
  /** Derived weak areas are recomputed on load; this stores last-known ids. */
  weakTopics: string[]
}

export type StartingLevel = 'complete_beginner' | 'beginner' | 'advanced_beginner' | 'intermediate'

export const LEVEL_LABELS: Record<StartingLevel, string> = {
  complete_beginner: 'Complete Beginner',
  beginner: 'Beginner',
  advanced_beginner: 'Advanced Beginner',
  intermediate: 'Intermediate',
}

export interface BaselineEvaluation {
  level: StartingLevel
  startingModuleId: string
  weakAreas: string[]
  notes: string[]
}

/* ── Mock interviews ───────────────────────────────────────────────────────── */

export type InterviewStatus = 'active' | 'completed'

export interface InterviewAnswer {
  questionId: string
  /** The learner's written attempt before the model answer is revealed. */
  attempt: string
  /** 0–10 self-evaluation against the rubric; null until scored. */
  score: number | null
  scoredAt: string | null
}

export interface MockInterviewSession {
  id: string
  difficulty: InterviewDifficulty
  /** Escalates true when questions ladder up from the chosen difficulty. */
  escalated: boolean
  questionIds: string[]
  currentIndex: number
  answers: Record<string, InterviewAnswer>
  status: InterviewStatus
  startedAt: string
  completedAt: string | null
  averageScore: number | null
}

/* ── Daily session ("Start today's preparation") ───────────────────────────── */

export interface SessionQuestion {
  questionId: string
  prompt: string
  options: string[]
  answerIndex: number
  explanation: string
  topicId: string
}

export interface DailySession {
  id: string
  createdAt: string
  moduleId: string
  moduleTitle: string
  /** The next unfinished topic in the current module. */
  topicId: string
  topicTitle: string
  /** 2–3 check questions on today's topic. */
  questions: SessionQuestion[]
  exercise: string
  codingTask: string | null
  /** Spaced-revision prompts pulled from previously completed topics. */
  revisionPrompts: string[]
  answeredTopicIds: string[]
  correctCount: number
  completed: boolean
}

/* ── Derived helpers ───────────────────────────────────────────────────────── */

export interface ModuleStatusSummary {
  module: MLModule
  status: ProgressStatus
  /** Topics with status completed / total topics. */
  topicsCompleted: number
  totalTopics: number
  averageScore: number | null
  bestTestPercentage: number | null
  interviewAnswered: number
  testAttempts: number
}

export interface WeakArea {
  topicId: string
  moduleId: string
  topicTitle: string
  moduleTitle: string
  score: number | null
  reason: 'low_score' | 'failed_test' | 'untested'
}
