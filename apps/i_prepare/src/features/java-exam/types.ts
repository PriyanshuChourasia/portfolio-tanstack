/**
 * Domain model for the Java interview prep + examination system.
 *
 * Mirrors the reasoning mock-test architecture: storage-agnostic types shared by
 * question banks, the engine, the persistence layer and the result UI. All exam
 * state lives under the `java-exam` storage namespace (separate from reasoning
 * sessions/results), so the two systems can evolve independently.
 */

/* ── Question kinds ────────────────────────────────────────────────────────── */

/**
 * The ten question kinds from the syllabus. `mcq` and `true_false` and
 * `output_prediction` are auto-graded. `code_completion` and `multiple_select`
 * are auto-graded against a key with partial credit. The rest are subjective and
 * self-graded against a model answer with a 0–5 scale.
 */
export type QuestionKind =
  | 'mcq'
  | 'multiple_select'
  | 'true_false'
  | 'output_prediction'
  | 'code_completion'
  | 'coding'
  | 'debugging'
  | 'short_answer'
  | 'architecture'
  | 'system_design'

export interface KindMeta {
  label: string
  subjective: boolean
  /** Max selectable options (multiple_select) or null. */
  multiSelect?: boolean
}

export const KIND_META: Record<QuestionKind, KindMeta> = {
  mcq: { label: 'MCQ', subjective: false },
  multiple_select: { label: 'Multiple Select', subjective: false, multiSelect: true },
  true_false: { label: 'True / False', subjective: false },
  output_prediction: { label: 'Output Prediction', subjective: false },
  code_completion: { label: 'Code Completion', subjective: false },
  coding: { label: 'Coding', subjective: true },
  debugging: { label: 'Debugging', subjective: true },
  short_answer: { label: 'Short Answer', subjective: true },
  architecture: { label: 'Architecture', subjective: true },
  system_design: { label: 'System Design', subjective: true },
}

/* ── Levels & domains ──────────────────────────────────────────────────────── */

/** L1 Beginner → L5 Staff/Architect. */
export type JavaLevel = 1 | 2 | 3 | 4 | 5

export const LEVEL_LABELS: Record<JavaLevel, string> = {
  1: 'L1 Beginner',
  2: 'L2 Junior',
  3: 'L3 Mid-Level',
  4: 'L4 Senior',
  5: 'L5 Staff/Architect',
}

/**
 * Syllabus domains. Each is a study module; ids double as topic-level scoring
 * buckets and mastery-tracking keys.
 */
export const JAVA_DOMAINS = [
  'Fundamentals',
  'OOP',
  'Collections',
  'Generics',
  'Exceptions',
  'Streams & FP',
  'JVM & Memory',
  'Garbage Collection',
  'Multithreading',
  'Concurrency Utilities',
  'Virtual Threads',
  'CompletableFuture',
  'I/O & Networking',
  'JDBC & SQL',
  'Spring',
  'Spring Data JPA',
  'REST & Security',
  'Kafka',
  'Microservices',
  'Docker & Kubernetes',
  'Testing',
  'Performance & Debugging',
  'Data Structures',
  'System Design',
] as const

export type JavaDomain = (typeof JAVA_DOMAINS)[number]

/* ── Questions ─────────────────────────────────────────────────────────────── */

/**
 * Authoring shape for one question. `answerKey`/`acceptedAnswers` are objective
 * keys; `modelAnswer` is the self-grading reference for subjective kinds;
 * `rubric` lists what a complete answer must cover (feeds the self-grade UI).
 */
export interface JavaQuestionInput {
  id: string
  domain: JavaDomain
  level: JavaLevel
  kind: QuestionKind
  prompt: string
  /** Optional code shown before the question (snippet to analyse or complete). */
  code?: string
  options?: string[]
  /** Index(es) into `options` — number for single, array for multiple_select. */
  answerKey?: number | number[]
  /** Accepted literal answers (normalised, case-insensitive) for output/completion. */
  acceptedAnswers?: string[]
  modelAnswer?: string
  rubric?: string[]
  explanation: string
  /** Interview follow-ups surfaced in review and in practice mode. */
  followUps?: string[]
  /** Real-world trap or note for the review screens. */
  trap?: string
}

export interface JavaQuestion extends JavaQuestionInput {}

/* ── Exam configuration ────────────────────────────────────────────────────── */

export const EXAM_DURATIONS = [15, 30, 45, 60, 90, 120, 180] as const
export type ExamDuration = (typeof EXAM_DURATIONS)[number]

export interface JavaExamConfiguration {
  levels: JavaLevel[]
  domains: JavaDomain[]
  kinds: QuestionKind[]
  durationMinutes: number
  questionCount: number
  /** Objective questions deduct 0.25 per wrong answer; subjective never deduct. */
  negativeMarking: boolean
}

export interface JavaExamDefinition {
  id: string
  name: string
  description: string
  levels: JavaLevel[]
  durationMinutes: number
  questionCount: number
  kinds: QuestionKind[]
  accent: string
}

/** Ready-made exams — the 180-minute final certification is included. */
export const JAVA_EXAMS: JavaExamDefinition[] = [
  {
    id: 'java-quick',
    name: 'Quick Java Drill',
    description:
      'A fast mixed drill across fundamentals, collections, JVM and concurrency to warm up or fill a gap.',
    levels: [2, 3, 4],
    durationMinutes: 15,
    questionCount: 12,
    kinds: ['mcq', 'true_false', 'output_prediction'],
    accent: 'from-sky-500/20 to-indigo-500/5',
  },
  {
    id: 'java-core',
    name: 'Core Java Exam',
    description:
      'Fundamentals, OOP, collections, generics, exceptions, streams and functional programming.',
    levels: [1, 2, 3, 4],
    durationMinutes: 45,
    questionCount: 30,
    kinds: ['mcq', 'multiple_select', 'true_false', 'output_prediction', 'code_completion', 'short_answer'],
    accent: 'from-amber-500/20 to-orange-500/5',
  },
  {
    id: 'java-jvm',
    name: 'JVM & Concurrency Exam',
    description:
      'JVM internals, memory, GC, multithreading, the Java Memory Model, atomic classes and virtual threads.',
    levels: [3, 4, 5],
    durationMinutes: 60,
    questionCount: 35,
    kinds: ['mcq', 'multiple_select', 'output_prediction', 'debugging', 'short_answer'],
    accent: 'from-violet-500/20 to-fuchsia-500/5',
  },
  {
    id: 'java-backend',
    name: 'Backend & Architecture Exam',
    description:
      'Spring, Spring Data JPA, REST, security, Kafka, microservices, Docker/Kubernetes, testing and performance.',
    levels: [3, 4, 5],
    durationMinutes: 90,
    questionCount: 40,
    kinds: ['mcq', 'multiple_select', 'debugging', 'architecture', 'system_design', 'short_answer'],
    accent: 'from-emerald-500/20 to-teal-500/5',
  },
  {
    id: 'java-final',
    name: 'Senior Backend Final Exam',
    description:
      'The 180-minute certification: theory, output, coding, debugging, JVM, concurrency, Spring, Kafka, database and one large system design.',
    levels: [3, 4, 5],
    durationMinutes: 180,
    questionCount: 60,
    kinds: [
      'mcq',
      'multiple_select',
      'true_false',
      'output_prediction',
      'code_completion',
      'coding',
      'debugging',
      'short_answer',
      'architecture',
      'system_design',
    ],
    accent: 'from-rose-500/20 to-pink-500/5',
  },
]

/* ── Session & answers ─────────────────────────────────────────────────────── */

export type SessionStatus = 'active' | 'submitted'

/**
 * Answer state for one question. Objective kinds store selected index(es) or a
 * typed literal; subjective kinds store free text plus the self-assigned grade
 * awarded after comparing against the model answer on submission.
 */
export interface JavaAnswer {
  questionId: string
  selectedIndex: number | null
  selectedIndices: number[]
  text: string
  /** 0–5 self-grade for subjective kinds; null until the reveal step. */
  selfGrade: number | null
  markedForReview: boolean
  visited: boolean
  answeredAt: string | null
  timeSpentMs: number
}

export interface JavaExamSession {
  id: string
  examId: string
  examName: string
  questionIds: string[]
  durationSeconds: number
  negativeMarking: boolean
  startedAt: string
  /** Start of the current on-screen interval; null while the tab is hidden or paused. */
  activeSince: string | null
  currentQuestionIndex: number
  /** Index the reveal step is paused at (subjective self-grading); null otherwise. */
  revealIndex: number | null
  answers: Record<string, JavaAnswer>
  status: SessionStatus
  submittedAt: string | null
  submitReason: 'user' | 'timeout' | null
}

/* ── Scoring & results ─────────────────────────────────────────────────────── */

export type JavaOutcome = 'correct' | 'partial' | 'incorrect' | 'unanswered'

export interface JavaQuestionResult {
  questionId: string
  index: number
  domain: JavaDomain
  level: JavaLevel
  kind: QuestionKind
  prompt: string
  code?: string
  options?: string[]
  answerKey?: number | number[]
  acceptedAnswers?: string[]
  modelAnswer?: string
  rubric?: string[]
  explanation: string
  followUps?: string[]
  trap?: string
  selectedIndex: number | null
  selectedIndices: number[]
  answerText: string
  selfGrade: number | null
  outcome: JavaOutcome
  earned: number
  max: number
  markedForReview: boolean
  visited: boolean
  timeSpentMs: number
}

export interface DomainScore {
  domain: JavaDomain
  total: number
  attempted: number
  correct: number
  partial: number
  incorrect: number
  unanswered: number
  earned: number
  max: number
  percentage: number
  avgTimeSeconds: number
}

export interface KindScore {
  kind: QuestionKind
  label: string
  total: number
  attempted: number
  earned: number
  max: number
  percentage: number
}

export interface LevelScore {
  level: JavaLevel
  label: string
  total: number
  earned: number
  max: number
  percentage: number
}

export interface JavaOverallScore {
  totalQuestions: number
  attempted: number
  correct: number
  partial: number
  incorrect: number
  unanswered: number
  objectiveCorrect: number
  objectiveIncorrect: number
  subjectiveSelfGraded: number
  score: number
  maxScore: number
  percentage: number
  accuracy: number
  attemptRate: number
  /** Seconds per question actually answered. */
  avgTimePerAnsweredSeconds: number
}

export interface JavaTimeAnalysis {
  timeUsedSeconds: number
  avgPerQuestionSeconds: number
  fastest: { questionId: string; seconds: number } | null
  slowest: { questionId: string; seconds: number } | null
  byDomain: Array<{ domain: JavaDomain; avgTimeSeconds: number; questions: number }>
}

export interface JavaEvaluation {
  overall: JavaOverallScore
  domainScores: DomainScore[]
  kindScores: KindScore[]
  levelScores: LevelScore[]
  timeAnalysis: JavaTimeAnalysis
  strongDomains: Array<{ domain: JavaDomain; percentage: number; attempted: number }>
  weakDomains: Array<{ domain: JavaDomain; percentage: number; attempted: number }>
  summary: string[]
  recommendations: string[]
}

/** Persistable result — question snapshot included so the result stays readable. */
export interface JavaExamResult {
  id: string
  sessionId: string
  examId: string
  examName: string
  startedAt: string
  submittedAt: string
  submitReason: 'user' | 'timeout'
  durationSeconds: number
  timeUsedSeconds: number
  negativeMarking: boolean
  overall: JavaOverallScore
  domainScores: DomainScore[]
  kindScores: KindScore[]
  levelScores: LevelScore[]
  timeAnalysis: JavaTimeAnalysis
  strongDomains: JavaEvaluation['strongDomains']
  weakDomains: JavaEvaluation['weakDomains']
  summary: string[]
  recommendations: string[]
  questionResults: JavaQuestionResult[]
}

/* ── Mastery tracking (persisted across exams) ─────────────────────────────── */

export type MasteryState = 'not_started' | 'learning' | 'developing' | 'interview_ready' | 'advanced' | 'mastered'

export const MASTERY_LABELS: Record<MasteryState, string> = {
  not_started: 'Not Started',
  learning: 'Learning',
  developing: 'Developing',
  interview_ready: 'Interview Ready',
  advanced: 'Advanced',
  mastered: 'Mastered',
}

export const MASTERY_ORDER: MasteryState[] = [
  'not_started',
  'learning',
  'developing',
  'interview_ready',
  'advanced',
  'mastered',
]

export interface DomainMastery {
  domain: JavaDomain
  /** Exponential moving average of domain percentage across exams (0–100). */
  ema: number
  attempts: number
  lastPracticedAt: string | null
  state: MasteryState
}

/** Weak-area revision queue: domains sorted by lowest EMA first. */
export type RevisionPlan = Array<{ domain: JavaDomain; ema: number; suggestedQuestions: number }>
