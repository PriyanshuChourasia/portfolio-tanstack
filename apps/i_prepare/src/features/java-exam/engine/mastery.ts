import type {
  DomainMastery,
  DomainScore,
  JavaDomain,
  JavaExamResult,
  MasteryState,
  RevisionPlan,
} from '../types'
import { JAVA_DOMAINS, MASTERY_ORDER } from '../types'

/**
 * Mastery tracker.
 *
 * Each domain keeps an exponential moving average (α = 0.4) of its exam
 * percentages. Consistent performance is required before a domain advances:
 * `interview_ready` needs ≥75%, `advanced` needs ≥85% and `mastered` needs ≥90%
 * across at least two exams. One bad paper drops the EMA, so cramming a single
 * lucky result cannot skip the progression.
 */

const EMA_ALPHA = 0.4
const MIN_ATTEMPTS = { interview_ready: 2, advanced: 2, mastered: 3 } as const

export function emptyMastery(): Record<JavaDomain, DomainMastery> {
  return Object.fromEntries(
    JAVA_DOMAINS.map((domain) => [
      domain,
      { domain, ema: 0, attempts: 0, lastPracticedAt: null, state: 'not_started' as MasteryState },
    ]),
  ) as Record<JavaDomain, DomainMastery>
}

export function stateFor(ema: number, attempts: number): MasteryState {
  if (attempts === 0) return 'not_started'
  if (attempts >= MIN_ATTEMPTS.mastered && ema >= 90) return 'mastered'
  if (attempts >= MIN_ATTEMPTS.advanced && ema >= 85) return 'advanced'
  if (attempts >= MIN_ATTEMPTS.interview_ready && ema >= 75) return 'interview_ready'
  if (ema >= 55) return 'developing'
  return 'learning'
}

function applyExam(mastery: DomainMastery, score: DomainScore): DomainMastery {
  const percentage = score.max > 0 ? (score.earned / score.max) * 100 : 0
  const ema = mastery.attempts === 0 ? percentage : mastery.ema + EMA_ALPHA * (percentage - mastery.ema)
  return {
    domain: mastery.domain,
    ema: Math.round(ema * 10) / 10,
    attempts: mastery.attempts + 1,
    lastPracticedAt: new Date().toISOString(),
    state: stateFor(ema, mastery.attempts + 1),
  }
}

export function updateMastery(
  current: Record<JavaDomain, DomainMastery>,
  result: JavaExamResult,
): Record<JavaDomain, DomainMastery> {
  const next = { ...current }
  for (const score of result.domainScores) {
    next[score.domain] = applyExam(next[score.domain], score)
  }
  return next
}

/** Merge a persisted mastery record over the defaults (handles schema evolution). */
export function hydrateMastery(stored: Partial<Record<JavaDomain, DomainMastery>> | null): Record<JavaDomain, DomainMastery> {
  const base = emptyMastery()
  if (!stored) return base
  for (const domain of JAVA_DOMAINS) {
    const value = stored[domain]
    if (value && typeof value.ema === 'number' && typeof value.attempts === 'number') {
      base[domain] = { ...base[domain], ...value, domain }
    }
  }
  return base
}

/** Weak-area revision plan: lowest EMA first, skipping untouched domains. */
export function buildRevisionPlan(mastery: Record<JavaDomain, DomainMastery>): RevisionPlan {
  return Object.values(mastery)
    .filter((item) => item.attempts > 0 && item.state !== 'mastered')
    .sort((a, b) => a.ema - b.ema)
    .slice(0, 5)
    .map((item) => ({
      domain: item.domain,
      ema: item.ema,
      suggestedQuestions: item.ema < 40 ? 10 : item.ema < 60 ? 8 : 5,
    }))
}

/** Overall mastery progress across all started domains. */
export function masterySummary(mastery: Record<JavaDomain, DomainMastery>) {
  const states = Object.values(mastery)
  const counts = Object.fromEntries(MASTERY_ORDER.map((state) => [state, 0])) as Record<MasteryState, number>
  for (const item of states) counts[item.state] += 1
  return { counts, started: states.filter((item) => item.attempts > 0).length }
}
