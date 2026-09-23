import type {
  Difficulty,
  DifficultyPerformance,
  Evaluation,
  FocusArea,
  Question,
  QuestionResult,
  ReasoningTopic,
  RecommendationSet,
  TestResult,
  TestSession,
  TimeAnalysis,
  TimeEntry,
  TopicPerformance,
} from '@/data/reasoning'
import { calculateScore, gradeQuestions, round2, safePercent } from './scoring'

/**
 * Evaluation engine.
 *
 * Turns a stored session into a complete, factual evaluation. Every sentence it
 * produces is derived from the recorded answers, so it stays correct for any paper
 * and can be re-run server-side over persisted data.
 */

const DIFFICULTY_ORDER: Difficulty[] = ['easy', 'moderate', 'difficult']

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Easy',
  moderate: 'Moderate',
  difficult: 'Difficult',
}

export interface EvaluateOptions {
  /** Overrides the wall-clock time used for the "time used" figure (useful for tests). */
  timeUsedSeconds?: number
}

export function computeTimeUsedSeconds(session: TestSession, nowMs: number = Date.now()): number {
  const startedMs = Date.parse(session.startedAt)
  const endMs = session.submittedAt ? Date.parse(session.submittedAt) : nowMs
  if (Number.isNaN(startedMs) || Number.isNaN(endMs)) return 0
  const elapsed = Math.max(0, Math.round((endMs - startedMs) / 1000))
  return Math.min(elapsed, session.durationSeconds)
}

function average(values: number[]): number {
  if (values.length === 0) return 0
  return round2(values.reduce((sum, value) => sum + value, 0) / values.length)
}

export function buildTopicPerformance(results: QuestionResult[]): TopicPerformance[] {
  const buckets = new Map<ReasoningTopic, QuestionResult[]>()
  for (const result of results) {
    const bucket = buckets.get(result.topic)
    if (bucket) bucket.push(result)
    else buckets.set(result.topic, [result])
  }

  return [...buckets.entries()]
    .map(([topic, items]) => {
      const correct = items.filter((item) => item.outcome === 'correct').length
      const incorrect = items.filter((item) => item.outcome === 'incorrect').length
      const unanswered = items.filter((item) => item.outcome === 'unanswered').length
      const attempted = correct + incorrect
      return {
        topic,
        total: items.length,
        attempted,
        correct,
        incorrect,
        unanswered,
        accuracy: safePercent(correct, attempted),
        avgTimeSeconds: average(items.filter((item) => item.timeSpentMs > 0).map((item) => item.timeSpentMs / 1000)),
      }
    })
    .sort((a, b) => b.attempted - a.attempted || b.total - a.total)
}

export function buildDifficultyPerformance(results: QuestionResult[]): DifficultyPerformance[] {
  return DIFFICULTY_ORDER.map((difficulty) => {
    const items = results.filter((item) => item.difficulty === difficulty)
    const correct = items.filter((item) => item.outcome === 'correct').length
    const incorrect = items.filter((item) => item.outcome === 'incorrect').length
    const attempted = correct + incorrect
    return {
      difficulty,
      total: items.length,
      attempted,
      correct,
      incorrect,
      accuracy: safePercent(correct, attempted),
      avgTimeSeconds: average(items.filter((item) => item.timeSpentMs > 0).map((item) => item.timeSpentMs / 1000)),
    }
  }).filter((item) => item.total > 0)
}

export function buildTimeAnalysis(
  results: QuestionResult[],
  timeUsedSeconds: number,
): TimeAnalysis {
  const timed = results.filter((item) => item.timeSpentMs > 0)
  const toEntry = (item: QuestionResult): TimeEntry => ({
    questionId: item.questionId,
    index: item.index,
    topic: item.topic,
    seconds: Math.round(item.timeSpentMs / 1000),
    outcome: item.outcome,
  })

  const sorted = [...timed].sort((a, b) => a.timeSpentMs - b.timeSpentMs)
  const topicBuckets = new Map<ReasoningTopic, number[]>()
  for (const item of timed) {
    const bucket = topicBuckets.get(item.topic)
    if (bucket) bucket.push(item.timeSpentMs / 1000)
    else topicBuckets.set(item.topic, [item.timeSpentMs / 1000])
  }

  const correctTimes = timed.filter((item) => item.outcome === 'correct').map((item) => item.timeSpentMs / 1000)
  const incorrectTimes = timed.filter((item) => item.outcome === 'incorrect').map((item) => item.timeSpentMs / 1000)

  return {
    timeUsedSeconds,
    timedQuestions: timed.length,
    avgTimePerQuestionSeconds:
      timed.length > 0 ? average(timed.map((item) => item.timeSpentMs / 1000)) : average([timeUsedSeconds / Math.max(1, results.length)]),
    fastest: sorted.length > 0 ? toEntry(sorted[0]) : null,
    slowest: sorted.length > 0 ? toEntry(sorted[sorted.length - 1]) : null,
    avgCorrectSeconds: average(correctTimes),
    avgIncorrectSeconds: average(incorrectTimes),
    byTopic: [...topicBuckets.entries()]
      .map(([topic, seconds]) => ({
        topic,
        avgTimeSeconds: average(seconds),
        questions: seconds.length,
      }))
      .sort((a, b) => b.avgTimeSeconds - a.avgTimeSeconds),
  }
}

function formatSeconds(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)} sec`
  const minutes = Math.floor(seconds / 60)
  const rest = Math.round(seconds % 60)
  return rest === 0 ? `${minutes} min` : `${minutes} min ${rest} sec`
}

function buildFocusAreas(
  topicPerformance: TopicPerformance[],
  overallAccuracy: number,
): FocusArea[] {
  const assessed = topicPerformance.filter((item) => item.attempted > 0)
  const weak = assessed
    .filter((item) => item.accuracy < 70 || item.accuracy < overallAccuracy)
    .sort((a, b) => a.accuracy - b.accuracy)

  return weak.slice(0, 3).map((item) => ({
    topic: item.topic,
    accuracy: item.accuracy,
    attempted: item.attempted,
    correct: item.correct,
    incorrect: item.incorrect,
    avgTimeSeconds: item.avgTimeSeconds,
    reason:
      item.accuracy < 60
        ? `Low accuracy (${item.accuracy}%) on ${item.topic} — ${item.incorrect} of ${item.attempted} attempts were wrong.`
        : `${item.topic} accuracy (${item.accuracy}%) is below your overall accuracy of ${overallAccuracy}%.`,
  }))
}

function buildRecommendations(
  focusAreas: FocusArea[],
  topicPerformance: TopicPerformance[],
  difficultyPerformance: DifficultyPerformance[],
  timeAnalysis: TimeAnalysis,
  overallAccuracy: number,
  unanswered: number,
  incorrect: number,
): RecommendationSet {
  const practice: string[] = []

  for (const area of focusAreas) {
    const target = Math.max(10, Math.ceil(Math.max(area.incorrect, 1) / 5) * 10)
    practice.push(
      `Practice ${target} ${area.topic} questions — you managed ${area.accuracy}% accuracy in this test.`,
    )
  }

  const slowest = timeAnalysis.byTopic[0]
  if (slowest && timeAnalysis.avgTimePerQuestionSeconds > 0 && slowest.avgTimeSeconds > timeAnalysis.avgTimePerQuestionSeconds * 1.25) {
    practice.push(
      `Work on timed sets for ${slowest.topic}: your average was ${formatSeconds(slowest.avgTimeSeconds)} per question against ${formatSeconds(timeAnalysis.avgTimePerQuestionSeconds)} overall.`,
    )
  }

  const easy = difficultyPerformance.find((item) => item.difficulty === 'easy')
  const difficult = difficultyPerformance.find((item) => item.difficulty === 'difficult')
  if (easy && difficult && easy.attempted > 0 && difficult.attempted > 0 && easy.accuracy - difficult.accuracy >= 20) {
    practice.push(
      `Revisit difficult-level questions: ${easy.accuracy}% accuracy on easy questions dropped to ${difficult.accuracy}% on difficult ones.`,
    )
  }

  const unattemptedTopics = topicPerformance.filter((item) => item.attempted === 0)
  if (unattemptedTopics.length > 0) {
    practice.push(
      `Cover ${unattemptedTopics.map((item) => item.topic).join(', ')} — you did not attempt any question from these topics.`,
    )
  }

  if (incorrect > 0) {
    practice.push(`Review the ${incorrect} incorrect question(s) in the review section and note the recurring mistake.`)
  }
  if (unanswered > 0) {
    practice.push(`You left ${unanswered} question(s) unanswered — practise eliminating options to attempt more.`)
  }
  practice.push(`Re-take this paper after practice to compare your accuracy (currently ${overallAccuracy}%).`)

  return { focusAreas, practice }
}

function buildSummary(
  overall: ReturnType<typeof calculateScore>,
  topicPerformance: TopicPerformance[],
  timeAnalysis: TimeAnalysis,
): string[] {
  const summary: string[] = [
    `You attempted ${overall.attempted} of ${overall.totalQuestions} questions (attempt rate ${overall.attemptRate}%).`,
    `Your accuracy was ${overall.accuracy}% — ${overall.correct} correct and ${overall.incorrect} incorrect.`,
  ]

  const assessed = topicPerformance.filter((item) => item.attempted > 0)
  if (assessed.length > 0) {
    const best = [...assessed].sort((a, b) => b.accuracy - a.accuracy)[0]
    const worst = [...assessed].sort((a, b) => a.accuracy - b.accuracy)[0]
    summary.push(`Your strongest topic by accuracy was ${best.topic} (${best.accuracy}% over ${best.attempted} attempts).`)
    if (worst.topic !== best.topic) {
      summary.push(`Your lowest accuracy was in ${worst.topic} questions (${worst.accuracy}% over ${worst.attempted} attempts).`)
    }
  }

  const slowest = timeAnalysis.byTopic[0]
  if (slowest) {
    summary.push(`You spent the most time on ${slowest.topic} (average ${formatSeconds(slowest.avgTimeSeconds)} per question).`)
  }
  if (overall.unanswered > 0) {
    summary.push(`You left ${overall.unanswered} question(s) unanswered.`)
  }
  return summary
}

function buildStrengths(
  topicPerformance: TopicPerformance[],
  difficultyPerformance: DifficultyPerformance[],
  overallAccuracy: number,
): string[] {
  const strengths: string[] = []
  const assessed = topicPerformance.filter((item) => item.attempted > 0)
  const best = [...assessed].sort((a, b) => b.accuracy - a.accuracy || b.attempted - a.attempted)[0]

  if (best && best.accuracy >= Math.max(60, overallAccuracy)) {
    strengths.push(`${best.topic}: ${best.accuracy}% accuracy across ${best.attempted} attempted question(s).`)
  }
  const perfect = assessed.filter((item) => item.accuracy === 100 && item.attempted >= 2)
  for (const item of perfect.slice(0, 2)) {
    if (!best || item.topic !== best.topic) {
      strengths.push(`No mistakes in ${item.topic} (${item.correct}/${item.attempted} correct).`)
    }
  }
  const bestDifficulty = [...difficultyPerformance]
    .filter((item) => item.attempted > 0)
    .sort((a, b) => b.accuracy - a.accuracy)[0]
  if (bestDifficulty && bestDifficulty.accuracy >= 60) {
    strengths.push(`${DIFFICULTY_LABELS[bestDifficulty.difficulty]}-level questions: ${bestDifficulty.accuracy}% accuracy.`)
  }
  return strengths
}

export function evaluateTest(
  session: TestSession,
  questions: Question[],
  options: EvaluateOptions = {},
): Evaluation {
  const questionResults = gradeQuestions(questions, session.answers)
  const overall = calculateScore(
    questions,
    session.answers,
    session.marking.positiveMarks,
    session.marking.negativeMarks,
  )
  const topicPerformance = buildTopicPerformance(questionResults)
  const difficultyPerformance = buildDifficultyPerformance(questionResults)
  const timeUsedSeconds =
    options.timeUsedSeconds ?? computeTimeUsedSeconds(session)
  const timeAnalysis = buildTimeAnalysis(questionResults, timeUsedSeconds)
  const focusAreas = buildFocusAreas(topicPerformance, overall.accuracy)

  return {
    overall,
    topicPerformance,
    difficultyPerformance,
    timeAnalysis,
    strengths: buildStrengths(topicPerformance, difficultyPerformance, overall.accuracy),
    focusAreas,
    recommendations: buildRecommendations(
      focusAreas,
      topicPerformance,
      difficultyPerformance,
      timeAnalysis,
      overall.accuracy,
      overall.unanswered,
      overall.incorrect,
    ),
    summary: buildSummary(overall, topicPerformance, timeAnalysis),
  }
}

/** Freezes a finished session into a fully self-contained, persistable result. */
export function buildTestResult(
  session: TestSession,
  questions: Question[],
  examName: string,
): TestResult {
  const submittedAt = session.submittedAt ?? new Date().toISOString()
  const evaluation = evaluateTest({ ...session, submittedAt }, questions)
  const questionResults = gradeQuestions(questions, session.answers)

  return {
    id: `result-${session.id}`,
    sessionId: session.id,
    testId: session.testId,
    examId: session.examId,
    examName,
    testTitle: session.testTitle,
    startedAt: session.startedAt,
    submittedAt,
    submitReason: session.submitReason ?? 'user',
    durationSeconds: session.durationSeconds,
    timeUsedSeconds: evaluation.timeAnalysis.timeUsedSeconds,
    marking: session.marking,
    overall: evaluation.overall,
    topicPerformance: evaluation.topicPerformance,
    difficultyPerformance: evaluation.difficultyPerformance,
    timeAnalysis: evaluation.timeAnalysis,
    strengths: evaluation.strengths,
    focusAreas: evaluation.focusAreas,
    recommendations: evaluation.recommendations,
    summary: evaluation.summary,
    questionResults,
  }
}

export { formatSeconds }
