import type {
  ExamResult,
  GoDsaState,
  InterviewSession,
  Problem,
  ProblemAttempt,
  RevisionRound,
  TopicRow,
} from '../types'
import { KIND_LABELS, LEVEL_LABELS, REVIEW_CHECKS } from '../types'
import { syllabusProblems, type ProblemEntry } from '../data'
import { isAttempted } from './progress'
import { makeId, shuffle } from './random'

/* ── Revision rounds (§43) ─────────────────────────────────────────────────── */

const ALGORITHM_MODULES = new Set(['m29', 'm30', 'm31', 'm32', 'm33'])

interface Slot {
  count: number
  accept: (entry: ProblemEntry) => boolean
}

const REVISION_SLOTS: Slot[] = [
  // 3 Go questions
  { count: 3, accept: (e) => e.module?.track === 'go' && (e.problem.kind === 'code' || e.problem.kind === 'concept') },
  // 3 data-structure questions
  {
    count: 3,
    accept: (e) =>
      e.module?.track === 'dsa' && !ALGORITHM_MODULES.has(e.module.id) && e.problem.kind !== 'predict',
  },
  // 2 debugging
  { count: 2, accept: (e) => e.problem.kind === 'debug' },
  // 2 output prediction
  { count: 2, accept: (e) => e.problem.kind === 'predict' },
  // 2 algorithm
  { count: 2, accept: (e) => !!e.module && ALGORITHM_MODULES.has(e.module.id) },
  // 1 advanced challenge
  { count: 1, accept: (e) => e.problem.tier === 'advanced' || e.problem.level >= 6 },
]

/**
 * Builds a 13-question revision round. Each slot prefers problems from topics
 * the learner already completed, then any started topic, then the whole bank.
 */
export function buildRevision(
  rows: TopicRow[],
  state: GoDsaState,
  random: () => number = Math.random,
): RevisionRound {
  const completed = new Set(
    rows.filter((row) => row.status === 'completed' || row.status === 'needs_revision').map((row) => row.topic.id),
  )
  const started = new Set(rows.filter((row) => row.status !== 'not_started').map((row) => row.topic.id))
  const bank = syllabusProblems()
  const chosen = new Set<string>()

  for (const slot of REVISION_SLOTS) {
    const candidates = bank.filter((entry) => slot.accept(entry) && !chosen.has(entry.problem.id))
    const tiers = [
      candidates.filter((entry) => entry.topic && completed.has(entry.topic.id)),
      candidates.filter((entry) => entry.topic && started.has(entry.topic.id)),
      candidates,
    ]
    let needed = slot.count
    for (const tier of tiers) {
      for (const entry of shuffle(tier, random)) {
        if (needed === 0) break
        if (chosen.has(entry.problem.id)) continue
        chosen.add(entry.problem.id)
        needed--
      }
      if (needed === 0) break
    }
  }

  return {
    id: makeId('rev'),
    number: state.revisions.length + 1,
    createdAt: new Date().toISOString(),
    problemIds: shuffle([...chosen], random),
    index: 0,
    completedAt: null,
  }
}

/* ── Exam mode (§46) ───────────────────────────────────────────────────────── */

export const EXAM_SIZE = 20
export const EXAM_SECONDS_PER_QUESTION = 75

/** Mixed, auto-graded test spread across as many modules as possible. */
export function buildExam(random: () => number = Math.random, size = EXAM_SIZE): ExamResult {
  const gradable = syllabusProblems().filter((entry) => entry.problem.check)
  const byModule = new Map<string, ProblemEntry[]>()
  for (const entry of shuffle(gradable, random)) {
    const key = entry.module?.id ?? 'other'
    byModule.set(key, [...(byModule.get(key) ?? []), entry])
  }
  // Round-robin across modules so the paper is genuinely mixed.
  const picked: string[] = []
  const queues = shuffle([...byModule.values()], random)
  while (picked.length < size && queues.some((queue) => queue.length > 0)) {
    for (const queue of queues) {
      const next = queue.shift()
      if (next && picked.length < size) picked.push(next.problem.id)
    }
  }
  return {
    id: makeId('exam'),
    startedAt: new Date().toISOString(),
    submittedAt: null,
    durationSec: picked.length * EXAM_SECONDS_PER_QUESTION,
    problemIds: picked,
    answers: {},
    index: 0,
    correctCount: 0,
    percentage: 0,
  }
}

export function gradeExam(exam: ExamResult, lookup: (id: string) => Problem | undefined): ExamResult {
  const correctCount = exam.problemIds.filter((id) => {
    const problem = lookup(id)
    return problem?.check && exam.answers[id] === problem.check.answerIndex
  }).length
  const percentage = exam.problemIds.length > 0 ? Math.round((correctCount / exam.problemIds.length) * 100) : 0
  return { ...exam, correctCount, percentage, submittedAt: new Date().toISOString() }
}

/* ── Interview mode (§45) ──────────────────────────────────────────────────── */

export function interviewCandidates(track: 'go' | 'dsa' | 'all'): ProblemEntry[] {
  return syllabusProblems().filter(
    (entry) =>
      entry.problem.kind === 'code' &&
      (entry.problem.tier === 'interview' || entry.problem.tier === 'advanced' || entry.problem.level >= 3) &&
      (track === 'all' || entry.module?.track === track),
  )
}

export function startInterview(problemId: string): InterviewSession {
  return {
    id: makeId('int'),
    problemId,
    startedAt: new Date().toISOString(),
    completedAt: null,
    stageIndex: 0,
    responses: {},
    scores: {},
  }
}

export function interviewAverage(session: InterviewSession): number | null {
  const scores = Object.values(session.scores).filter((score): score is number => typeof score === 'number')
  if (scores.length === 0) return null
  return Math.round((scores.reduce((sum, score) => sum + score, 0) / scores.length) * 10) / 10
}

const GENERIC_CLARIFICATIONS = [
  'What is the input size? (drives the target complexity)',
  'Can the input be empty, contain duplicates or negatives?',
  'Is the input sorted or otherwise structured?',
  'What should be returned when there is no valid answer?',
  'Is it called once or many times (pre-processing worth it)?',
]

const GENERIC_FOLLOW_UPS = [
  'Can you reduce the extra space?',
  'What if the input does not fit in memory / arrives as a stream?',
  'How would you make this safe for concurrent callers?',
  'Which test cases would you write first?',
]

export function clarificationsFor(problem: Problem): string[] {
  return problem.clarifications?.length ? problem.clarifications : GENERIC_CLARIFICATIONS
}

export function followUpsFor(problem: Problem): string[] {
  const own = [...(problem.followUps ?? [])]
  if (problem.variation) own.push(problem.variation)
  return own.length > 0 ? own : GENERIC_FOLLOW_UPS
}

/* ── External AI review prompt ─────────────────────────────────────────────── */

/**
 * Builds a ready-to-paste prompt so the learner can get the §37 review from an
 * AI assistant. Deliberately asks for hints first, not the full solution.
 */
export function buildReviewPrompt(problem: Problem, attempt: ProblemAttempt | undefined, context: string): string {
  const lines = [
    'You are my Golang + Data Structures & Algorithms mentor. Review my attempt below.',
    'Rules: do NOT give me the full solution. Check, in order: compilation, correctness, edge cases,',
    'time/space complexity, Go idioms, memory behaviour, and concurrency safety if relevant.',
    'Then give a score from 0–10, what I did well, what to improve, and ONE progressive hint if I am wrong.',
    '',
    `Topic: ${context}`,
    `Problem (${KIND_LABELS[problem.kind]}, Level ${problem.level} — ${LEVEL_LABELS[problem.level]}): ${problem.title}`,
  ]
  if (problem.story) lines.push('', `Story: ${problem.story}`)
  lines.push('', problem.prompt)
  if (problem.requirements?.length) lines.push('', 'Requirements:', ...problem.requirements.map((r) => `- ${r}`))
  if (problem.code) lines.push('', 'Given code:', '```go', problem.code, '```')
  lines.push('', 'My approach / answer:', attempt?.approach.trim() || '(not written)')
  if (attempt?.code.trim()) lines.push('', 'My code:', '```go', attempt.code, '```')
  const ticked = REVIEW_CHECKS.filter((check) => attempt?.review[check.key]).map((check) => check.label)
  if (ticked.length) lines.push('', `I believe it satisfies: ${ticked.join('; ')}.`)
  lines.push('', `Attempts so far: ${attempt?.attempts ?? 0}. Hints already seen: ${attempt?.hintsRevealed ?? 0}.`)
  return lines.join('\n')
}

export function attemptSummary(attempt: ProblemAttempt | undefined): string {
  if (!attempt || !isAttempted(attempt)) return 'Not attempted'
  return `${attempt.attempts} attempt${attempt.attempts === 1 ? '' : 's'}${attempt.score !== null ? ` · ${attempt.score}/10` : ''}`
}
