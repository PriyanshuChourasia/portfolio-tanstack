import type {
  Question,
  QuestionOutcome,
  QuestionResult,
  ScoringResult,
  UserAnswer,
} from '@/data/reasoning'

/**
 * Scoring engine.
 *
 * Pure functions only — no React, no storage, no globals. This is deliberately the
 * narrowest possible seam so the same logic can be lifted to a server later: the
 * server would receive `{ questionIds, answers }`, re-load the authoritative
 * questions and call `calculateScore` with the trusted marking scheme.
 */

export function createEmptyAnswer(sessionId: string, questionId: string): UserAnswer {
  return {
    id: `${sessionId}:${questionId}`,
    sessionId,
    questionId,
    selectedOption: null,
    markedForReview: false,
    visited: false,
    answeredAt: null,
    timeSpentMs: 0,
  }
}

export function resolveOutcome(question: Question, answer: UserAnswer | undefined): QuestionOutcome {
  if (!answer || !answer.selectedOption) return 'unanswered'
  return answer.selectedOption === question.correctOption ? 'correct' : 'incorrect'
}

/** Rounds to two decimals and normalises `-0`. */
export function round2(value: number): number {
  const rounded = Math.round(value * 100) / 100
  return Object.is(rounded, -0) ? 0 : rounded
}

export function safePercent(numerator: number, denominator: number): number {
  if (denominator <= 0) return 0
  return round2((numerator / denominator) * 100)
}

/**
 * Grade a paper question-by-question. `questions` must be in the order they were served.
 */
export function gradeQuestions(
  questions: Question[],
  answers: Record<string, UserAnswer>,
): QuestionResult[] {
  return questions.map((question, index) => {
    const answer = answers[question.id]
    return {
      questionId: question.id,
      index,
      topic: question.topic,
      difficulty: question.difficulty,
      questionText: question.questionText,
      options: question.options,
      correctOption: question.correctOption,
      explanation: question.explanation,
      sourceType: question.sourceType,
      sourceNote: question.sourceNote,
      selectedOption: answer?.selectedOption ?? null,
      outcome: resolveOutcome(question, answer),
      markedForReview: answer?.markedForReview ?? false,
      visited: answer?.visited ?? false,
      timeSpentMs: answer?.timeSpentMs ?? 0,
    }
  })
}

/**
 * Core score calculation using the configured marking scheme.
 * Correct answers earn `positiveMarks`, wrong answers deduct `negativeMarks`,
 * unanswered questions score zero.
 */
export function calculateScore(
  questions: Question[],
  answers: Record<string, UserAnswer>,
  positiveMarks: number,
  negativeMarks: number,
): ScoringResult {
  let correct = 0
  let incorrect = 0
  let unanswered = 0

  for (const question of questions) {
    const outcome = resolveOutcome(question, answers[question.id])
    if (outcome === 'correct') correct += 1
    else if (outcome === 'incorrect') incorrect += 1
    else unanswered += 1
  }

  const totalQuestions = questions.length
  const attempted = correct + incorrect
  const maxScore = round2(totalQuestions * positiveMarks)
  const score = round2(correct * positiveMarks - incorrect * negativeMarks)

  return {
    totalQuestions,
    attempted,
    correct,
    incorrect,
    unanswered,
    score,
    maxScore,
    percentage: safePercent(score, maxScore),
    accuracy: safePercent(correct, attempted),
    attemptRate: safePercent(attempted, totalQuestions),
  }
}

/** Live progress counters used by the test header (does not compute marks). */
export function countByOutcome(
  questions: Question[],
  answers: Record<string, UserAnswer>,
): { answered: number; marked: number; visited: number; notVisited: number } {
  let answered = 0
  let marked = 0
  let visited = 0
  for (const question of questions) {
    const answer = answers[question.id]
    if (answer?.selectedOption) answered += 1
    if (answer?.markedForReview) marked += 1
    if (answer?.visited) visited += 1
  }
  return { answered, marked, visited, notVisited: questions.length - visited }
}
