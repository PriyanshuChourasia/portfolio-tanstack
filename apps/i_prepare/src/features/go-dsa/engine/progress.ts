import type {
  GoDsaState,
  Problem,
  ProblemAttempt,
  ProgressStatus,
  Topic,
  TopicRow,
} from '../types'
import { REVISION_SCORE_THRESHOLD, TOPICS_PER_REVISION } from '../types'
import { MODULES } from '../data'

/* ── State lifecycle ───────────────────────────────────────────────────────── */

export function emptyState(): GoDsaState {
  return {
    version: 1,
    attempts: {},
    lessonsRead: [],
    revisions: [],
    exams: [],
    interviews: [],
    challenges: {},
    resume: { screen: 'dashboard', moduleId: null, topicId: null, problemId: null },
  }
}

/** Accepts anything read from storage and fills gaps so old saves keep working. */
export function hydrateState(raw: unknown): GoDsaState {
  const base = emptyState()
  if (!raw || typeof raw !== 'object') return base
  const value = raw as Partial<GoDsaState>
  return {
    version: 1,
    attempts: value.attempts && typeof value.attempts === 'object' ? value.attempts : base.attempts,
    lessonsRead: Array.isArray(value.lessonsRead) ? value.lessonsRead : base.lessonsRead,
    revisions: Array.isArray(value.revisions) ? value.revisions : base.revisions,
    exams: Array.isArray(value.exams) ? value.exams : base.exams,
    interviews: Array.isArray(value.interviews) ? value.interviews : base.interviews,
    challenges: value.challenges && typeof value.challenges === 'object' ? value.challenges : base.challenges,
    resume: value.resume ?? base.resume,
  }
}

export function emptyAttempt(problemId: string): ProblemAttempt {
  return {
    problemId,
    approach: '',
    code: '',
    attempts: 0,
    hintsRevealed: 0,
    solutionRevealed: false,
    revealedWithoutAttempt: false,
    selectedOption: null,
    review: {},
    score: null,
    updatedAt: new Date(0).toISOString(),
  }
}

/* ── Problem state ─────────────────────────────────────────────────────────── */

export function isAttempted(attempt: ProblemAttempt | undefined): boolean {
  return !!attempt && (attempt.attempts > 0 || attempt.selectedOption !== null)
}

/** Done = attempted (or solution taken) and scored. */
export function isDone(attempt: ProblemAttempt | undefined): boolean {
  return !!attempt && (isAttempted(attempt) || attempt.solutionRevealed) && attempt.score !== null
}

/** The solution is unlocked after reasonable effort: two attempts, or one attempt and every hint. */
export function solutionUnlocked(problem: Problem, attempt: ProblemAttempt | undefined): boolean {
  if (!attempt) return false
  if (attempt.solutionRevealed) return true
  if (problem.check && attempt.selectedOption !== null) return true
  if (attempt.attempts >= 2) return true
  return attempt.attempts >= 1 && attempt.hintsRevealed >= problem.hints.length
}

/** Problems inside a topic unlock one at a time: attempt the current one first. */
export function isProblemUnlocked(topic: Topic, index: number, state: GoDsaState): boolean {
  if (index <= 0) return true
  const previous = state.attempts[topic.problems[index - 1].id]
  return isAttempted(previous) || !!previous?.solutionRevealed
}

export function currentProblemIndex(topic: Topic, state: GoDsaState): number {
  const index = topic.problems.findIndex((problem) => !isDone(state.attempts[problem.id]))
  return index === -1 ? topic.problems.length - 1 : index
}

/* ── Topic rows (the progress table) ───────────────────────────────────────── */

const CORE_TIERS = new Set(['foundation', 'practical', 'interview'])

export function coreProblems(topic: Topic): Problem[] {
  const core = topic.problems.filter((problem) => CORE_TIERS.has(problem.tier))
  return core.length > 0 ? core : topic.problems
}

export function topicStatus(topic: Topic, state: GoDsaState): ProgressStatus {
  const touched = topic.problems.some((problem) => {
    const attempt = state.attempts[problem.id]
    return isAttempted(attempt) || !!attempt?.solutionRevealed
  })
  if (!touched) return state.lessonsRead.includes(topic.id) ? 'in_progress' : 'not_started'
  const coreDone = coreProblems(topic).every((problem) => isDone(state.attempts[problem.id]))
  if (!coreDone) return 'in_progress'
  const score = topicScore(topic, state)
  return score !== null && score < REVISION_SCORE_THRESHOLD ? 'needs_revision' : 'completed'
}

export function topicScore(topic: Topic, state: GoDsaState): number | null {
  const scores = topic.problems
    .map((problem) => state.attempts[problem.id]?.score)
    .filter((score): score is number => typeof score === 'number')
  if (scores.length === 0) return null
  return Math.round((scores.reduce((sum, score) => sum + score, 0) / scores.length) * 10) / 10
}

export function topicRows(state: GoDsaState): TopicRow[] {
  return MODULES.flatMap((module) =>
    module.topics.map((topic) => ({
      module,
      topic,
      status: topicStatus(topic, state),
      score: topicScore(topic, state),
      attempts: topic.problems.reduce((sum, problem) => sum + (state.attempts[problem.id]?.attempts ?? 0), 0),
      solved: topic.problems.filter((problem) => isDone(state.attempts[problem.id])).length,
      total: topic.problems.length,
    })),
  )
}

export function moduleStatus(rows: TopicRow[], moduleId: string): ProgressStatus {
  const own = rows.filter((row) => row.module.id === moduleId)
  if (own.length === 0) return 'not_started'
  if (own.some((row) => row.status === 'needs_revision')) return 'needs_revision'
  if (own.every((row) => row.status === 'completed')) return 'completed'
  if (own.some((row) => row.status !== 'not_started')) return 'in_progress'
  return 'not_started'
}

export function completedTopicCount(rows: TopicRow[]): number {
  return rows.filter((row) => row.status === 'completed' || row.status === 'needs_revision').length
}

export function overallCompletion(rows: TopicRow[]): number {
  if (rows.length === 0) return 0
  return Math.round((completedTopicCount(rows) / rows.length) * 100)
}

/** First topic in syllabus order that is not finished — the default "next lesson". */
export function nextTopic(rows: TopicRow[]): TopicRow | null {
  return rows.find((row) => row.status === 'in_progress') ?? rows.find((row) => row.status === 'not_started') ?? null
}

/* ── Revision cadence ──────────────────────────────────────────────────────── */

/** Revision rounds earned so far minus rounds already generated. */
export function revisionsDue(rows: TopicRow[], state: GoDsaState): number {
  const earned = Math.floor(completedTopicCount(rows) / TOPICS_PER_REVISION)
  return Math.max(0, earned - state.revisions.length)
}
