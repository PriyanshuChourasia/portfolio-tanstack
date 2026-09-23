/**
 * Domain model for the Reasoning mock-test system.
 *
 * These types are intentionally storage-agnostic: the same shapes are used by the
 * question bank, the test engine, the persistence layer and the result UI, so the
 * scoring/evaluation logic could later be moved to a server without UI changes.
 */

export type ExamId = 'SSC_CHSL' | 'SBI_PO' | 'IBPS_PO'

export type Difficulty = 'easy' | 'moderate' | 'difficult'

/** Difficulty chosen when configuring a test — `mixed` keeps every level. */
export type DifficultyFilter = Difficulty | 'mixed'

export type OptionKey = 'A' | 'B' | 'C' | 'D'

export const OPTION_KEYS: OptionKey[] = ['A', 'B', 'C', 'D']

/**
 * `actual_pyq` is reserved for verbatim previous-year questions. Everything in the
 * bundled bank is `pyq_pattern` (newly written questions that follow a PYQ pattern),
 * and the UI always labels them as such.
 */
export type SourceType = 'actual_pyq' | 'pyq_pattern'

export const REASONING_TOPICS = [
  'Analogy',
  'Classification',
  'Series',
  'Coding-Decoding',
  'Blood Relations',
  'Direction Sense',
  'Ranking',
  'Syllogism',
  'Inequality',
  'Seating Arrangement',
  'Floor Puzzle',
  'Box Puzzle',
  'Scheduling',
  'Input-Output',
  'Data Sufficiency',
  'Statement & Conclusion',
  'Logical Reasoning',
  'Miscellaneous',
] as const

export type ReasoningTopic = (typeof REASONING_TOPICS)[number]

export interface Question {
  id: string
  /** Exams this question is relevant for — lets one bank serve several exams. */
  examIds: ExamId[]
  topic: ReasoningTopic
  subtopic?: string
  difficulty: Difficulty
  questionText: string
  options: [string, string, string, string]
  correctOption: OptionKey
  explanation: string
  sourceType: SourceType
  /** Year of the paper whose pattern this question follows. */
  sourceYear?: number
  /** Human readable provenance shown in the review screens. */
  sourceNote: string
}

/** Shape authors write in the bank files — `createBank` fills in the rest. */
export interface QuestionInput {
  id: string
  topic: ReasoningTopic
  subtopic?: string
  difficulty: Difficulty
  questionText: string
  options: [string, string, string, string]
  correctOption: OptionKey
  explanation: string
  /** e.g. "SSC CHSL 2023" — used to build `sourceNote`. */
  pattern: string
  sourceYear?: number
  sourceType?: SourceType
}

export function createBank(examId: ExamId, rows: QuestionInput[]): Question[] {
  return rows.map((row) => ({
    id: row.id,
    examIds: [examId],
    topic: row.topic,
    subtopic: row.subtopic,
    difficulty: row.difficulty,
    questionText: row.questionText,
    options: row.options,
    correctOption: row.correctOption,
    explanation: row.explanation,
    sourceType: row.sourceType ?? 'pyq_pattern',
    sourceYear: row.sourceYear,
    sourceNote:
      (row.sourceType ?? 'pyq_pattern') === 'actual_pyq'
        ? `Actual PYQ — ${row.pattern}`
        : `PYQ-pattern question (not an actual paper question) — modelled on ${row.pattern}`,
  }))
}

export interface MarkingScheme {
  positiveMarks: number
  negativeMarks: number
}

/** A ready-made paper preset for an exam. */
export interface TestPreset {
  id: string
  examId: ExamId
  title: string
  durationMinutes: number
  totalQuestions: number
  difficulty: DifficultyFilter
  topics: ReasoningTopic[]
}

export interface ExamDefinition {
  id: ExamId
  name: string
  shortName: string
  description: string
  /** Typical reasoning section size in the real exam, shown to set expectations. */
  patternNote: string
  /** Rough difficulty of the reasoning section in the real exam. */
  difficultyLabel: string
  marking: MarkingScheme
  defaultDurationMinutes: number
  defaultQuestionCount: number
  /** Presentation only. */
  accent: string
}

/** User-editable configuration captured before the test starts. */
export interface TestConfiguration {
  examId: ExamId
  testId: string
  questionCount: number
  durationMinutes: number
  difficulty: DifficultyFilter
  topics: ReasoningTopic[]
  marking: MarkingScheme
}

export interface UserAnswer {
  id: string
  sessionId: string
  questionId: string
  selectedOption: OptionKey | null
  markedForReview: boolean
  visited: boolean
  answeredAt: string | null
  /** Milliseconds the question was on screen while the tab was visible. */
  timeSpentMs: number
}

export type SessionStatus = 'active' | 'submitted'

export interface TestSession {
  id: string
  testId: string
  examId: ExamId
  testTitle: string
  /** Ordered snapshot of the question ids served in this paper. */
  questionIds: string[]
  durationSeconds: number
  marking: MarkingScheme
  difficulty: DifficultyFilter
  topics: ReasoningTopic[]
  startedAt: string
  /** Start of the current on-screen interval; null while the tab is hidden. */
  activeSince: string | null
  currentQuestionIndex: number
  answers: Record<string, UserAnswer>
  status: SessionStatus
  submittedAt: string | null
  submitReason: 'user' | 'timeout' | null
}

export type QuestionOutcome = 'correct' | 'incorrect' | 'unanswered'

export interface QuestionResult {
  questionId: string
  index: number
  topic: ReasoningTopic
  difficulty: Difficulty
  questionText: string
  options: [string, string, string, string]
  correctOption: OptionKey
  explanation: string
  sourceType: SourceType
  sourceNote: string
  selectedOption: OptionKey | null
  outcome: QuestionOutcome
  markedForReview: boolean
  visited: boolean
  timeSpentMs: number
}

export interface ScoringResult {
  totalQuestions: number
  attempted: number
  correct: number
  incorrect: number
  unanswered: number
  score: number
  maxScore: number
  percentage: number
  accuracy: number
  attemptRate: number
}

export interface TopicPerformance {
  topic: ReasoningTopic
  total: number
  attempted: number
  correct: number
  incorrect: number
  unanswered: number
  accuracy: number
  avgTimeSeconds: number
}

export interface DifficultyPerformance {
  difficulty: Difficulty
  total: number
  attempted: number
  correct: number
  incorrect: number
  accuracy: number
  avgTimeSeconds: number
}

export interface TimeEntry {
  questionId: string
  index: number
  topic: ReasoningTopic
  seconds: number
  outcome: QuestionOutcome
}

export interface TimeAnalysis {
  timeUsedSeconds: number
  timedQuestions: number
  avgTimePerQuestionSeconds: number
  fastest: TimeEntry | null
  slowest: TimeEntry | null
  avgCorrectSeconds: number
  avgIncorrectSeconds: number
  byTopic: Array<{ topic: ReasoningTopic; avgTimeSeconds: number; questions: number }>
}

export interface FocusArea {
  topic: ReasoningTopic
  accuracy: number
  attempted: number
  correct: number
  incorrect: number
  avgTimeSeconds: number
  reason: string
}

export interface RecommendationSet {
  focusAreas: FocusArea[]
  practice: string[]
}

export interface Evaluation {
  overall: ScoringResult
  topicPerformance: TopicPerformance[]
  difficultyPerformance: DifficultyPerformance[]
  timeAnalysis: TimeAnalysis
  strengths: string[]
  focusAreas: FocusArea[]
  recommendations: RecommendationSet
  summary: string[]
}

export interface TestResult {
  id: string
  sessionId: string
  testId: string
  examId: ExamId
  examName: string
  testTitle: string
  startedAt: string
  submittedAt: string
  submitReason: 'user' | 'timeout'
  durationSeconds: number
  timeUsedSeconds: number
  marking: MarkingScheme
  overall: ScoringResult
  topicPerformance: TopicPerformance[]
  difficultyPerformance: DifficultyPerformance[]
  timeAnalysis: TimeAnalysis
  strengths: string[]
  focusAreas: FocusArea[]
  recommendations: RecommendationSet
  summary: string[]
  /** Full snapshot so a result stays readable even if the bank changes later. */
  questionResults: QuestionResult[]
}
