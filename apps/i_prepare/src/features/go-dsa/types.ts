/**
 * Domain model for the Go + Data Structures & Algorithms mentor.
 *
 * Two tracks (Go language, DSA) are split into modules → topics → problems.
 * Every topic is a lesson (concept, why, when / when not, syntax, example,
 * common mistakes) followed by problems that unlock one at a time. Each problem
 * runs the think-first loop: approach → code → self-review → hints → second
 * attempt → solution → optimisation → harder variation.
 */

/* ── Levels & problem metadata ─────────────────────────────────────────────── */

/** Difficulty ladder from the brief: never jump from 1 straight to 6. */
export type Level = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

export const LEVEL_LABELS: Record<Level, string> = {
  0: 'Concept',
  1: 'Easy',
  2: 'Easy/Medium',
  3: 'Medium',
  4: 'Medium/Hard',
  5: 'Hard',
  6: 'Advanced',
  7: 'Interview/Production',
}

/** Where the problem sits in a topic's question structure. */
export type Tier = 'foundation' | 'practical' | 'interview' | 'advanced'

export const TIER_LABELS: Record<Tier, string> = {
  foundation: 'Foundation',
  practical: 'Practical',
  interview: 'Interview',
  advanced: 'Advanced',
}

/**
 * - concept: explain in your own words
 * - predict: "What will this print? Why?"
 * - debug:   "What is wrong with this program?"
 * - code:    write the implementation
 * - design:  production-style component with requirements
 */
export type ProblemKind = 'concept' | 'predict' | 'debug' | 'code' | 'design'

export const KIND_LABELS: Record<ProblemKind, string> = {
  concept: 'Concept check',
  predict: 'Output prediction',
  debug: 'Debugging',
  code: 'Coding',
  design: 'Production design',
}

export interface Complexity {
  time: string
  space: string
  best?: string
  average?: string
  worst?: string
  /** Memory allocation, heap vs stack, amortised behaviour… */
  notes?: string
}

/** Optional auto-graded choice — used by practice, revision and exam mode. */
export interface ChoiceCheck {
  options: string[]
  answerIndex: number
}

export interface Problem {
  id: string
  tier: Tier
  level: Level
  kind: ProblemKind
  title: string
  /** Real-world framing (delivery company, bank, GPS fleet…). */
  story?: string
  prompt: string
  /** Program to predict/debug, or starter code for a coding task. */
  code?: string
  check?: ChoiceCheck
  /** Production problems list concrete requirements. */
  requirements?: string[]
  /** Revealed one at a time — never all at once. */
  hints: string[]
  /** Reference answer: code for code/design, prose for concept/predict/debug. */
  solution: string
  /** Why the solution works; for predict this is the "why". */
  explanation: string
  complexity?: Complexity
  /** Harder variation offered after the solution. */
  variation?: string
  /** Interview mode: questions a good candidate would ask first. */
  clarifications?: string[]
  /** Interview mode: optimisation probes after the code is reviewed. */
  followUps?: string[]
}

/* ── Syllabus ──────────────────────────────────────────────────────────────── */

export type Track = 'go' | 'dsa'

export interface LessonExample {
  code: string
  output?: string
  /** Line-by-line or block-by-block explanation. */
  notes: string[]
}

export interface Topic {
  id: string
  title: string
  summary: string
  concept: string[]
  why: string
  whenToUse: string[]
  whenNotToUse: string[]
  syntax: string
  example: LessonExample
  mistakes: string[]
  problems: Problem[]
}

export interface Module {
  id: string
  number: number
  track: Track
  title: string
  shortTitle: string
  tagline: string
  topics: Topic[]
}

/* ── Learner state (persisted) ─────────────────────────────────────────────── */

export type ProgressStatus = 'not_started' | 'in_progress' | 'completed' | 'needs_revision'

export const STATUS_META: Record<ProgressStatus, { label: string; emoji: string }> = {
  not_started: { label: 'Not Started', emoji: '⬜' },
  in_progress: { label: 'In Progress', emoji: '🟡' },
  completed: { label: 'Completed', emoji: '🟢' },
  needs_revision: { label: 'Needs Revision', emoji: '🔴' },
}

/** A completed topic averaging below this is flagged for revision. */
export const REVISION_SCORE_THRESHOLD = 6

/** A revision round unlocks after every N completed topics. */
export const TOPICS_PER_REVISION = 5

/** The §37 review checklist the learner runs against their own submission. */
export const REVIEW_CHECKS = [
  { key: 'compiles', label: 'Compiles (go build / go vet clean)' },
  { key: 'correct', label: 'Correct on the examples' },
  { key: 'edgeCases', label: 'Handles edge cases (empty, nil, one element, duplicates, overflow)' },
  { key: 'complexity', label: 'Meets the expected time/space complexity' },
  { key: 'idioms', label: 'Idiomatic Go (names, errors, no needless abstraction)' },
  { key: 'memory', label: 'Memory behaviour understood (allocations, aliasing, escapes)' },
  { key: 'concurrency', label: 'Concurrency-safe (if goroutines/shared state are involved)' },
] as const

export type ReviewCheckKey = (typeof REVIEW_CHECKS)[number]['key']

export interface ProblemAttempt {
  problemId: string
  /** "My approach" — or the prediction/diagnosis for predict/debug problems. */
  approach: string
  code: string
  /** Number of submitted attempts. */
  attempts: number
  hintsRevealed: number
  solutionRevealed: boolean
  /** True when the solution was requested before any attempt. */
  revealedWithoutAttempt: boolean
  selectedOption: number | null
  review: Partial<Record<ReviewCheckKey, boolean>>
  /** 0–10. Auto for choice checks, self-assessed otherwise. */
  score: number | null
  updatedAt: string
}

export interface TopicRow {
  module: Module
  topic: Topic
  status: ProgressStatus
  score: number | null
  attempts: number
  solved: number
  total: number
}

/* ── Modes ─────────────────────────────────────────────────────────────────── */

export interface RevisionRound {
  id: string
  /** Revision number: 1 after 5 topics, 2 after 10… */
  number: number
  createdAt: string
  problemIds: string[]
  index: number
  completedAt: string | null
}

export interface ExamAnswer {
  problemId: string
  selectedOption: number | null
  correct: boolean
}

export interface ExamResult {
  id: string
  startedAt: string
  submittedAt: string | null
  durationSec: number
  problemIds: string[]
  answers: Record<string, number | null>
  index: number
  correctCount: number
  percentage: number
}

export const INTERVIEW_STAGES = [
  { key: 'clarify', label: 'Clarify requirements', prompt: 'What would you ask the interviewer before solving? List assumptions and constraints.' },
  { key: 'approach', label: 'Approach', prompt: 'Describe your approach in plain words. Start brute force, then improve.' },
  { key: 'complexity', label: 'Complexity', prompt: 'State time and space complexity of your approach and why.' },
  { key: 'edgeCases', label: 'Edge cases', prompt: 'Which inputs could break it? Empty, single element, duplicates, negatives, huge input…' },
  { key: 'code', label: 'Code', prompt: 'Write the Go implementation.' },
  { key: 'optimize', label: 'Optimisation', prompt: 'Answer the interviewer’s follow-up probes.' },
] as const

export type InterviewStageKey = (typeof INTERVIEW_STAGES)[number]['key']

export interface InterviewSession {
  id: string
  problemId: string
  startedAt: string
  completedAt: string | null
  stageIndex: number
  responses: Partial<Record<InterviewStageKey, string>>
  /** 0–10 self-score per stage after reading the interviewer's notes. */
  scores: Partial<Record<InterviewStageKey, number>>
}

export interface WeeklyChallenge {
  id: string
  afterModuleId: string
  title: string
  brief: string
  milestones: string[]
  stretch: string[]
}

export type GoScreen =
  | 'dashboard'
  | 'module'
  | 'topic'
  | 'problem'
  | 'progress'
  | 'revision'
  | 'exam'
  | 'exam_result'
  | 'interview'
  | 'production'
  | 'challenges'

/** "Continue where I stopped" pointer. */
export interface ResumePointer {
  screen: GoScreen
  moduleId: string | null
  topicId: string | null
  problemId: string | null
}

export interface GoDsaState {
  version: 1
  attempts: Record<string, ProblemAttempt>
  /** Topics whose lesson the learner has read. */
  lessonsRead: string[]
  revisions: RevisionRound[]
  exams: ExamResult[]
  interviews: InterviewSession[]
  /** Weekly challenge id → completed milestone indexes. */
  challenges: Record<string, number[]>
  resume: ResumePointer
}
