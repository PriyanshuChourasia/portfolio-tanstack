import type { Question, TestConfiguration, TestSession } from '@/data/reasoning'
import { SUBJECT_LABELS, getQuestionById, getTestPreset, getExam, questionsForExam } from '@/data/reasoning'
import { createEmptyAnswer } from './scoring'

/**
 * Test builder — turns a configuration into a concrete paper and a restorable
 * session. The paper order is shuffled per session so repeated attempts differ,
 * while `session.questionIds` remains the single source of truth for the paper.
 */

export function makeId(prefix: string): string {
  const random =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10)
  return `${prefix}-${Date.now().toString(36)}-${random}`
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/**
 * Resolves the candidate pool for a configuration.
 *
 * Topics are treated as the stronger user intent: if a topic has no question at the
 * requested difficulty we serve that topic at the other levels rather than silently
 * ignoring the topic filter.
 */
export function matchingQuestions(config: TestConfiguration): Question[] {
  const pool = questionsForExam(config.examId)
  const topicScoped = config.topics.length === 0 ? pool : pool.filter((q) => config.topics.includes(q.topic))
  const preferred =
    config.difficulty === 'mixed' ? topicScoped : topicScoped.filter((q) => q.difficulty === config.difficulty)

  if (preferred.length > 0) return preferred
  if (topicScoped.length > 0) return topicScoped
  return pool
}

/** How many questions the current filters can supply (used to clamp configuration inputs). */
export function countMatchingQuestions(config: TestConfiguration): number {
  return matchingQuestions(config).length
}

/**
 * Applies the difficulty/topic filters and trims the pool to the requested size.
 * Sequential papers still sample randomly but keep the picked questions in bank
 * order, so a level-by-level paper keeps its easy → hard progression.
 */
export function selectQuestions(
  config: TestConfiguration,
  random: () => number = Math.random,
): Question[] {
  const usable = matchingQuestions(config)
  const picked = shuffle(usable, random).slice(0, Math.min(config.questionCount, usable.length))
  if (!getExam(config.examId).sequential) return picked

  const bankOrder = new Map(usable.map((question, index) => [question.id, index]))
  return picked.sort((a, b) => (bankOrder.get(a.id) ?? 0) - (bankOrder.get(b.id) ?? 0))
}

export function createSession(config: TestConfiguration, questions: Question[]): TestSession {
  const sessionId = makeId('session')
  const answers: TestSession['answers'] = {}
  for (const question of questions) {
    answers[question.id] = { ...createEmptyAnswer(sessionId, question.id), visited: false }
  }

  // The first question counts as visited as soon as the test starts.
  if (questions.length > 0) {
    answers[questions[0].id].visited = true
  }

  const now = new Date().toISOString()
  return {
    id: sessionId,
    testId: config.testId,
    examId: config.examId,
    testTitle: getTestPreset(config.testId)?.title ?? `${getExam(config.examId).shortName} ${SUBJECT_LABELS[getExam(config.examId).subject]} Test`,
    questionIds: questions.map((question) => question.id),
    durationSeconds: config.durationMinutes * 60,
    marking: config.marking,
    difficulty: config.difficulty,
    topics: config.topics,
    startedAt: now,
    activeSince: now,
    currentQuestionIndex: 0,
    answers,
    status: 'active',
    submittedAt: null,
    submitReason: null,
  }
}

/** Resolves the questions of a stored paper, tolerating a question removed from the bank. */
export function questionsForSession(session: TestSession): Question[] {
  return session.questionIds
    .map((questionId) => getQuestionById(questionId))
    .filter((question): question is Question => Boolean(question))
}

export function isSessionExpired(session: TestSession, nowMs: number = Date.now()): boolean {
  const startedMs = Date.parse(session.startedAt)
  if (Number.isNaN(startedMs)) return false
  return nowMs >= startedMs + session.durationSeconds * 1000
}
