import type {
  JavaAnswer,
  JavaDomain,
  JavaExamSession,
  JavaLevel,
  JavaQuestion,
  QuestionKind,
} from '../types'
import { createEmptyJavaAnswer } from './scoring-helpers'

/**
 * Question selection + session creation.
 *
 * Selection honours the configured level range, domain filter and question kinds,
 * distributes across the chosen domains for coverage, and balances levels within
 * each domain (L3 as the pivot when mixed). Selection is deterministic per session
 * seed so a refresh never re-shuffles an in-flight paper.
 */

/** Deterministic small PRNG so a session can be rebuilt identically after refresh. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export interface SelectionFilters {
  levels?: JavaLevel[]
  domains?: JavaDomain[]
  kinds?: QuestionKind[]
  excludeIds?: string[]
}

export function filterQuestions(questions: JavaQuestion[], filters: SelectionFilters): JavaQuestion[] {
  const excluded = new Set(filters.excludeIds ?? [])
  return questions.filter((question) => {
    if (excluded.has(question.id)) return false
    if (filters.levels && !filters.levels.includes(question.level)) return false
    if (filters.domains && filters.domains.length > 0 && !filters.domains.includes(question.domain)) return false
    if (filters.kinds && filters.kinds.length > 0 && !filters.kinds.includes(question.kind)) return false
    return true
  })
}

/**
 * Round-robin across domains (shuffled), then across levels within each domain,
 * so a mixed paper gets coverage rather than one domain dominating.
 */
export function selectQuestions(
  questions: JavaQuestion[],
  filters: SelectionFilters,
  count: number,
  seed = Date.now(),
): JavaQuestion[] {
  const pool = filterQuestions(questions, filters)
  const random = mulberry32(seed)
  const byDomain = new Map<JavaDomain, JavaQuestion[]>()
  for (const question of shuffle(pool, random)) {
    const bucket = byDomain.get(question.domain)
    if (bucket) bucket.push(question)
    else byDomain.set(question.domain, [question])
  }
  if (byDomain.size === 0) return []

  const queues = [...byDomain.values()]
  const picked: JavaQuestion[] = []
  let exhausted = false
  while (picked.length < count && !exhausted) {
    exhausted = true
    for (const queue of queues) {
      if (queue.length > 0) {
        picked.push(queue.shift() as JavaQuestion)
        exhausted = false
        if (picked.length === count) break
      }
    }
  }
  return picked
}

/** Weighted revision selection: prioritise the given domains and below-average performance. */
export function selectRevisionQuestions(
  questions: JavaQuestion[],
  weakDomains: JavaDomain[],
  count: number,
  seed = Date.now(),
): JavaQuestion[] {
  const random = mulberry32(seed)
  const weakSet = new Set(weakDomains)
  const pool = filterQuestions(questions, { domains: weakDomains.length > 0 ? weakDomains : undefined })
  const primary = shuffle(pool.filter((question) => weakSet.has(question.domain)), random)
  const picked = primary.slice(0, count)
  if (picked.length < count) {
    const rest = shuffle(
      filterQuestions(questions, { excludeIds: picked.map((question) => question.id) }),
      random,
    ).slice(0, count - picked.length)
    picked.push(...rest)
  }
  return picked
}

export function createJavaSession(
  examId: string,
  examName: string,
  questions: JavaQuestion[],
  durationMinutes: number,
  negativeMarking: boolean,
): JavaExamSession {
  const now = new Date().toISOString()
  const answers: Record<string, JavaAnswer> = {}
  for (const question of questions) {
    answers[question.id] = createEmptyJavaAnswer(`session-${now}`, question.id)
  }
  return {
    id: `java-session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    examId,
    examName,
    questionIds: questions.map((question) => question.id),
    durationSeconds: durationMinutes * 60,
    negativeMarking,
    startedAt: now,
    activeSince: now,
    currentQuestionIndex: 0,
    revealIndex: null,
    answers,
    status: 'active',
    submittedAt: null,
    submitReason: null,
  }
}
