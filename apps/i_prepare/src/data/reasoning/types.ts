/**
 * Domain model for the iPrepare mock-test system.
 *
 * These types are intentionally storage-agnostic: the same shapes are used by the
 * question bank, the test engine, the persistence layer and the result UI, so the
 * scoring/evaluation logic could later be moved to a server without UI changes.
 */

export type ExamId =
  | 'SSC_CHSL'
  | 'SBI_PO'
  | 'IBPS_PO'
  | 'ANALOGY_PRACTICE'
  | 'SBI_ENGLISH'
  | 'NONVERBAL_MASTER'
  | 'VERBAL_FULL'
  | 'REASONING_MASTER'

export type Difficulty = 'easy' | 'moderate' | 'difficult'

/** Difficulty chosen when configuring a test — `mixed` keeps every level. */
export type DifficultyFilter = Difficulty | 'mixed'

export type OptionKey = 'A' | 'B' | 'C' | 'D'

export const OPTION_KEYS: OptionKey[] = ['A', 'B', 'C', 'D']

/* ── Non-verbal figure specs ─────────────────────────────────────────────── */

/**
 * Declarative figure language for non-verbal questions, rendered to inline SVG
 * by `FigureView`. A figure is a list of shapes on a 100×100 canvas with named
 * transforms — authored in data files as plain objects, no SVG knowledge needed.
 */
export type FigureShape =
  | { kind: 'circle'; cx: number; cy: number; r: number; fill?: boolean }
  | { kind: 'square'; cx: number; cy: number; size: number; fill?: boolean; rot?: number }
  | { kind: 'triangle'; cx: number; cy: number; size: number; fill?: boolean; rot?: number; down?: boolean }
  | { kind: 'diamond'; cx: number; cy: number; size: number; fill?: boolean }
  | { kind: 'star'; cx: number; cy: number; size: number; fill?: boolean }
  | { kind: 'arrow'; cx: number; cy: number; size: number; rot?: number; fill?: boolean }
  | { kind: 'line'; x1: number; y1: number; x2: number; y2: number }
  | { kind: 'dot'; cx: number; cy: number; r?: number }
  | { kind: 'cross'; cx: number; cy: number; size: number }
  | { kind: 'text'; cx: number; cy: number; label: string; size?: number }
  | { kind: 'arc'; cx: number; cy: number; r: number; from: number; to: number }

export interface FigureSpec {
  shapes: FigureShape[]
  /** Rotate the whole figure by degrees (0–360). */
  rotate?: number
  /** Mirror the whole figure horizontally (mirror image). */
  mirror?: boolean
  /** Flip the whole figure vertically (water image). */
  flip?: boolean
  /** Optional caption, e.g. "Problem figure". */
  caption?: string
}

/** Helper constructors so bank files stay terse. */
export const fig = (shapes: FigureShape[], extra: Omit<FigureSpec, 'shapes'> = {}): FigureSpec => ({
  shapes,
  ...extra,
})

export const circle = (cx: number, cy: number, r: number, fill = false): FigureShape => ({ kind: 'circle', cx, cy, r, fill })
export const square = (cx: number, cy: number, size: number, fill = false, rot = 0): FigureShape => ({ kind: 'square', cx, cy, size, fill, rot })
export const triangle = (cx: number, cy: number, size: number, fill = false, rot = 0): FigureShape => ({ kind: 'triangle', cx, cy, size, fill, rot })
export const diamond = (cx: number, cy: number, size: number, fill = false): FigureShape => ({ kind: 'diamond', cx, cy, size, fill })
export const star = (cx: number, cy: number, size: number, fill = false): FigureShape => ({ kind: 'star', cx, cy, size, fill })
export const arrow = (cx: number, cy: number, size: number, rot = 0): FigureShape => ({ kind: 'arrow', cx, cy, size, rot })
export const line = (x1: number, y1: number, x2: number, y2: number): FigureShape => ({ kind: 'line', x1, y1, x2, y2 })
export const dot = (cx: number, cy: number, r = 3): FigureShape => ({ kind: 'dot', cx, cy, r })
export const cross = (cx: number, cy: number, size: number): FigureShape => ({ kind: 'cross', cx, cy, size })
export const arc = (cx: number, cy: number, r: number, from: number, to: number): FigureShape => ({ kind: 'arc', cx, cy, r, from, to })
export const ftext = (cx: number, cy: number, label: string, size = 22): FigureShape => ({ kind: 'text', cx, cy, label, size })

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
  'Alphabet Test',
  'Arithmetical Reasoning',
  'Venn Diagrams',
  'Statement & Assumption',
  'Statement & Argument',
  'Cause & Effect',
  'Course of Action',
  'Miscellaneous',
] as const

export type ReasoningTopic = (typeof REASONING_TOPICS)[number]

export const ENGLISH_TOPICS = [
  'Reading Comprehension',
  'Cloze Test',
  'Error Spotting',
  'Phrase Replacement',
  'Fillers',
  'Para Jumbles',
  'Word Swap',
  'Vocabulary',
  'Word Usage',
] as const

/**
 * Non-verbal reasoning topics. Questions in these topics carry a `figure` spec
 * rendered as inline SVG by the UI — the figure IS the question, so the text
 * prompt stays short.
 */
export const NONVERBAL_TOPICS = [
  'Figure Classification',
  'Figure Analogy',
  'Figure Series',
  'Figure Matrix',
  'Mirror Images',
  'Water Images',
  'Paper Folding',
  'Paper Cutting',
  'Embedded Figures',
  'Figure Completion',
  'Counting Figures',
  'Cubes & Dice',
] as const

export type NonVerbalTopic = (typeof NONVERBAL_TOPICS)[number]

export type EnglishTopic = (typeof ENGLISH_TOPICS)[number]

/** Section an exam paper belongs to — decides which topic list applies. */
export type Subject = 'reasoning' | 'english' | 'nonverbal'

export type QuestionTopic = ReasoningTopic | EnglishTopic | NonVerbalTopic

export const TOPICS_BY_SUBJECT: Record<Subject, readonly QuestionTopic[]> = {
  reasoning: REASONING_TOPICS,
  english: ENGLISH_TOPICS,
  nonverbal: NONVERBAL_TOPICS,
}

export interface Question {
  id: string
  /** Exams this question is relevant for — lets one bank serve several exams. */
  examIds: ExamId[]
  topic: QuestionTopic
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
  /**
   * Non-verbal figure spec. When present the UI renders it as inline SVG instead
   * of (or above) plain text. Options may also carry figure ids to render as
   * shapes rather than words.
   */
  figure?: FigureSpec
  figureOptions?: FigureSpec[]
  /** Step-by-step reasoning shown in review for difficult puzzles. */
  steps?: string[]
}

/** Shape authors write in the bank files — `createBank` fills in the rest. */
export interface QuestionInput {
  id: string
  topic: QuestionTopic
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
  figure?: FigureSpec
  figureOptions?: FigureSpec[]
  steps?: string[]
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
    figure: row.figure,
    figureOptions: row.figureOptions,
    steps: row.steps,
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
  topics: QuestionTopic[]
}

export interface ExamDefinition {
  id: ExamId
  /** `exam` mirrors a real exam's section; `practice` is a single-topic paper. */
  kind: 'exam' | 'practice'
  /** Section of the real exam this paper mirrors. */
  subject: Subject
  /** Serve questions in bank order (easy → hard) instead of shuffling them. */
  sequential?: boolean
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
  topics: QuestionTopic[]
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
  topics: QuestionTopic[]
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
  topic: QuestionTopic
  difficulty: Difficulty
  questionText: string
  options: [string, string, string, string]
  correctOption: OptionKey
  explanation: string
  sourceType: SourceType
  sourceNote: string
  figure?: FigureSpec
  figureOptions?: FigureSpec[]
  steps?: string[]
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
  topic: QuestionTopic
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
  topic: QuestionTopic
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
  byTopic: Array<{ topic: QuestionTopic; avgTimeSeconds: number; questions: number }>
}

export interface FocusArea {
  topic: QuestionTopic
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
