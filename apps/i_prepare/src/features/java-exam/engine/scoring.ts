import type {
  JavaExamResult,
  DomainScore,
  JavaAnswer,
  JavaDomain,
  JavaEvaluation,
  JavaExamSession,
  JavaLevel,
  JavaOutcome,
  JavaQuestion,
  JavaQuestionResult,
  JavaTimeAnalysis,
  JavaOverallScore,
  JavaExamResult,
  KindScore,
  LevelScore,
  QuestionKind,
} from '../types'
import { KIND_META, LEVEL_LABELS } from '../types'

/**
 * Scoring + evaluation engine for the Java exam system.
 *
 * Objective kinds are machine-graded (single answer → 1 mark, multiple-select →
 * partial credit with no negative marking for partial, output/completion matched
 * against normalised literal keys). Subjective kinds reveal the model answer at
 * submission and are self-graded 0–5 against the rubric.
 *
 * Pure functions only — no React, no storage.
 */

export const SUBJECTIVE_MAX = 5

export const OBJECTIVE_KINDS: QuestionKind[] = [
  'mcq',
  'multiple_select',
  'true_false',
  'output_prediction',
  'code_completion',
]

export function isSubjective(kind: QuestionKind): boolean {
  return KIND_META[kind].subjective
}

export function normalizeText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[.;]$/, '')
}

/** Max marks a question carries: objective = 1, subjective = 5. */
export function maxMarksFor(question: JavaQuestion): number {
  return isSubjective(question.kind) ? SUBJECTIVE_MAX : 1
}

function indicesMatch(correct: number[], selected: number[]): JavaOutcome {
  const correctSet = new Set(correct)
  const selectedSet = new Set(selected)
  const hits = selected.filter((index) => correctSet.has(index)).length
  const misses = selected.length - hits
  const missed = correct.length - hits
  if (misses === 0 && missed === 0) return 'correct'
  if (misses === 0 && missed > 0) return 'partial'
  return 'incorrect'
}

/** Grades one objective question. Returns null for subjective kinds. */
export function gradeObjective(question: JavaQuestion, answer: JavaAnswer): JavaOutcome {
  switch (question.kind) {
    case 'mcq':
    case 'true_false':
    case 'output_prediction':
    case 'code_completion': {
      if (answer.selectedIndex !== null) {
        return answer.selectedIndex === question.answerKey ? 'correct' : 'incorrect'
      }
      if (answer.text.trim() !== '') {
        const key = (question.acceptedAnswers ?? []).some(
          (accepted) => normalizeText(accepted) === normalizeText(answer.text),
        )
        return key ? 'correct' : 'incorrect'
      }
      return 'unanswered'
    }
    case 'multiple_select': {
      const correct = (question.answerKey as number[] | undefined) ?? []
      if (answer.selectedIndices.length === 0) return 'unanswered'
      return indicesMatch(correct, answer.selectedIndices)
    }
    default:
      return 'unanswered'
  }
}

/** Subjective self-grade mapped to an outcome (≥3.5 counts as correct-ish). */
export function gradeSubjective(selfGrade: number | null): JavaOutcome {
  if (selfGrade === null) return 'unanswered'
  if (selfGrade >= 4) return 'correct'
  if (selfGrade >= 3) return 'partial'
  if (selfGrade > 0) return 'incorrect'
  return 'unanswered'
}

export function resolveOutcome(question: JavaQuestion, answer: JavaAnswer): JavaOutcome {
  if (isSubjective(question.kind)) {
    // A subjective question only counts as attempted if text was written.
    if (answer.text.trim() === '') return 'unanswered'
    return gradeSubjective(answer.selfGrade)
  }
  return gradeObjective(question, answer)
}

export function earnedMarks(question: JavaQuestion, answer: JavaAnswer): number {
  if (isSubjective(question.kind)) {
    if (answer.text.trim() === '') return 0
    return answer.selfGrade ?? 0
  }
  const outcome = gradeObjective(question, answer)
  if (outcome === 'correct') return 1
  if (outcome === 'partial') return 0.5
  return 0
}

/** Full question-by-question snapshot of a finished paper. */
export function gradeJavaQuestions(
  questions: JavaQuestion[],
  answers: Record<string, JavaAnswer>,
): JavaQuestionResult[] {
  return questions.map((question, index) => {
    const answer = answers[question.id]
    const outcome = resolveOutcome(question, answer)
    return {
      questionId: question.id,
      index,
      domain: question.domain,
      level: question.level,
      kind: question.kind,
      prompt: question.prompt,
      code: question.code,
      options: question.options,
      answerKey: question.answerKey,
      acceptedAnswers: question.acceptedAnswers,
      modelAnswer: question.modelAnswer,
      rubric: question.rubric,
      explanation: question.explanation,
      followUps: question.followUps,
      trap: question.trap,
      selectedIndex: answer?.selectedIndex ?? null,
      selectedIndices: answer?.selectedIndices ?? [],
      answerText: answer?.text ?? '',
      selfGrade: answer?.selfGrade ?? null,
      outcome,
      earned: earnedMarks(question, answer),
      max: maxMarksFor(question),
      markedForReview: answer?.markedForReview ?? false,
      visited: answer?.visited ?? false,
      timeSpentMs: answer?.timeSpentMs ?? 0,
    }
  })
}

export function computeOverall(results: JavaQuestionResult[]): JavaOverallScore {
  const totalQuestions = results.length
  let attempted = 0
  let correct = 0
  let partial = 0
  let incorrect = 0
  let unanswered = 0
  let objectiveCorrect = 0
  let objectiveIncorrect = 0
  let subjectiveSelfGraded = 0
  let score = 0
  let maxScore = 0
  let answeredTimeMs = 0
  let answeredCount = 0

  for (const result of results) {
    maxScore += result.max
    score += result.earned
    if (result.outcome === 'unanswered') {
      unanswered += 1
      continue
    }
    attempted += 1
    if (result.outcome === 'correct') correct += 1
    else if (result.outcome === 'partial') partial += 1
    else incorrect += 1
    if (isSubjective(result.kind)) {
      subjectiveSelfGraded += 1
    } else if (result.outcome === 'correct') {
      objectiveCorrect += 1
    } else {
      objectiveIncorrect += 1
    }
    if (result.timeSpentMs > 0) {
      answeredTimeMs += result.timeSpentMs
      answeredCount += 1
    }
  }

  return {
    totalQuestions,
    attempted,
    correct,
    partial,
    incorrect,
    unanswered,
    objectiveCorrect,
    objectiveIncorrect,
    subjectiveSelfGraded,
    score: round2(score),
    maxScore: round2(maxScore),
    percentage: safePercent(score, maxScore),
    accuracy: safePercent(correct + partial, attempted),
    attemptRate: safePercent(attempted, totalQuestions),
    avgTimePerAnsweredSeconds: answeredCount > 0 ? Math.round(answeredTimeMs / answeredCount / 1000) : 0,
  }
}

export function computeDomainScores(results: JavaQuestionResult[]): DomainScore[] {
  const buckets = new Map<JavaDomain, JavaQuestionResult[]>()
  for (const result of results) {
    const bucket = buckets.get(result.domain)
    if (bucket) bucket.push(result)
    else buckets.set(result.domain, [result])
  }
  return [...buckets.entries()]
    .map(([domain, items]) => {
      const earned = items.reduce((sum, item) => sum + item.earned, 0)
      const max = items.reduce((sum, item) => sum + item.max, 0)
      const attempted = items.filter((item) => item.outcome !== 'unanswered')
      const timed = items.filter((item) => item.timeSpentMs > 0)
      return {
        domain,
        total: items.length,
        attempted: attempted.length,
        correct: items.filter((item) => item.outcome === 'correct').length,
        partial: items.filter((item) => item.outcome === 'partial').length,
        incorrect: items.filter((item) => item.outcome === 'incorrect').length,
        unanswered: items.filter((item) => item.outcome === 'unanswered').length,
        earned: round2(earned),
        max: round2(max),
        percentage: safePercent(earned, max),
        avgTimeSeconds: timed.length > 0 ? Math.round(timed.reduce((sum, item) => sum + item.timeSpentMs, 0) / timed.length / 1000) : 0,
      }
    })
    .sort((a, b) => b.max - a.max || a.domain.localeCompare(b.domain))
}

export function computeKindScores(results: JavaQuestionResult[]): KindScore[] {
  const buckets = new Map<QuestionKind, JavaQuestionResult[]>()
  for (const result of results) {
    const bucket = buckets.get(result.kind)
    if (bucket) bucket.push(result)
    else buckets.set(result.kind, [result])
  }
  return [...buckets.entries()].map(([kind, items]) => {
    const earned = items.reduce((sum, item) => sum + item.earned, 0)
    const max = items.reduce((sum, item) => sum + item.max, 0)
    return {
      kind,
      label: KIND_META[kind].label,
      total: items.length,
      attempted: items.filter((item) => item.outcome !== 'unanswered').length,
      earned: round2(earned),
      max: round2(max),
      percentage: safePercent(earned, max),
    }
  })
}

export function computeLevelScores(results: JavaQuestionResult[]): LevelScore[] {
  const buckets = new Map<JavaLevel, JavaQuestionResult[]>()
  for (const result of results) {
    const bucket = buckets.get(result.level)
    if (bucket) bucket.push(result)
    else buckets.set(result.level, [result])
  }
  return [...buckets.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([level, items]) => {
      const earned = items.reduce((sum, item) => sum + item.earned, 0)
      const max = items.reduce((sum, item) => sum + item.max, 0)
      return {
        level,
        label: LEVEL_LABELS[level],
        total: items.length,
        earned: round2(earned),
        max: round2(max),
        percentage: safePercent(earned, max),
      }
    })
}

export function computeTimeUsedSeconds(session: JavaExamSession, nowMs: number = Date.now()): number {
  const startedMs = Date.parse(session.startedAt)
  const endMs = session.submittedAt ? Date.parse(session.submittedAt) : nowMs
  if (Number.isNaN(startedMs) || Number.isNaN(endMs)) return 0
  const elapsed = Math.max(0, Math.round((endMs - startedMs) / 1000))
  return Math.min(elapsed, session.durationSeconds)
}

export function computeTimeAnalysis(
  results: JavaQuestionResult[],
  timeUsedSeconds: number,
): JavaTimeAnalysis {
  const timed = results.filter((item) => item.timeSpentMs > 0)
  const sorted = [...timed].sort((a, b) => a.timeSpentMs - b.timeSpentMs)
  const buckets = new Map<JavaDomain, number[]>()
  for (const item of timed) {
    const bucket = buckets.get(item.domain)
    if (bucket) bucket.push(item.timeSpentMs / 1000)
    else buckets.set(item.domain, [item.timeSpentMs / 1000])
  }
  return {
    timeUsedSeconds,
    avgPerQuestionSeconds: timed.length > 0 ? Math.round(timed.reduce((sum, item) => sum + item.timeSpentMs, 0) / timed.length / 1000) : 0,
    fastest: sorted.length > 0 ? { questionId: sorted[0].questionId, seconds: Math.round(sorted[0].timeSpentMs / 1000) } : null,
    slowest: sorted.length > 0 ? { questionId: sorted[sorted.length - 1].questionId, seconds: Math.round(sorted[sorted.length - 1].timeSpentMs / 1000) } : null,
    byDomain: [...buckets.entries()]
      .map(([domain, seconds]) => ({
        domain,
        avgTimeSeconds: Math.round(seconds.reduce((sum, value) => sum + value, 0) / seconds.length),
        questions: seconds.length,
      }))
      .sort((a, b) => b.avgTimeSeconds - a.avgTimeSeconds),
  }
}

/** Domains with meaningful attempt volume, best first. */
export function computeStrongDomains(domainScores: DomainScore[]) {
  return domainScores
    .filter((item) => item.attempted >= 2 && item.max > 0)
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 4)
    .map((item) => ({ domain: item.domain, percentage: item.percentage, attempted: item.attempted }))
}

/** Domains with meaningful attempt volume, worst first. */
export function computeWeakDomains(domainScores: DomainScore[]) {
  return domainScores
    .filter((item) => item.attempted >= 2 && item.max > 0)
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, 5)
    .map((item) => ({ domain: item.domain, percentage: item.percentage, attempted: item.attempted }))
}

function buildSummary(overall: JavaOverallScore, kindScores: KindScore[], timeAnalysis: JavaTimeAnalysis): string[] {
  const summary: string[] = [
    `You attempted ${overall.attempted} of ${overall.totalQuestions} questions (${overall.attemptRate}% attempt rate).`,
    `Score ${overall.score}/${overall.maxScore} (${overall.percentage}%) with ${overall.correct} correct, ${overall.partial} partial and ${overall.incorrect} incorrect.`,
  ]
  if (overall.subjectiveSelfGraded > 0) {
    summary.push(
      `${overall.subjectiveSelfGraded} subjective answer(s) were self-graded against the model answers — be honest; the mastery tracker uses these grades.`,
    )
  }
  const bestKind = [...kindScores].filter((item) => item.attempted > 0).sort((a, b) => b.percentage - a.percentage)[0]
  const worstKind = [...kindScores].filter((item) => item.attempted > 0).sort((a, b) => a.percentage - b.percentage)[0]
  if (bestKind) summary.push(`Strongest format: ${bestKind.label} (${bestKind.percentage}%).`)
  if (worstKind && bestKind && worstKind.kind !== bestKind.kind) {
    summary.push(`Weakest format: ${worstKind.label} (${worstKind.percentage}%) — practise that question style.`)
  }
  if (timeAnalysis.slowest) {
    summary.push(`You spent the most time on a single question: ${timeAnalysis.slowest.seconds}s — flag and move on when stuck.`)
  }
  if (overall.unanswered > 0) {
    summary.push(`${overall.unanswered} question(s) left unanswered.`)
  }
  return summary
}

function buildRecommendations(weakDomains: JavaEvaluation['weakDomains'], overall: JavaOverallScore): string[] {
  const recommendations: string[] = []
  for (const weak of weakDomains.slice(0, 3)) {
    recommendations.push(
      `Revise ${weak.domain} — ${weak.percentage}% across ${weak.attempted} attempted question(s). A revision exam will target it next.`,
    )
  }
  if (overall.objectiveIncorrect > 0) {
    recommendations.push(`Re-read the explanations for your ${overall.objectiveIncorrect} incorrect objective answer(s) in the review section.`)
  }
  if (overall.unanswered > overall.totalQuestions * 0.15) {
    recommendations.push('Time management: more than 15% of the paper was untouched — practise with shorter durations to pace up.')
  }
  recommendations.push('Re-take this exam after revision to move your domain mastery states forward.')
  return recommendations
}

export function evaluateJavaExam(
  session: JavaExamSession,
  questions: JavaQuestion[],
): JavaEvaluation {
  const results = gradeJavaQuestions(questions, session.answers)
  const overall = computeOverall(results)
  const domainScores = computeDomainScores(results)
  const kindScores = computeKindScores(results)
  const levelScores = computeLevelScores(results)
  const timeUsedSeconds = computeTimeUsedSeconds(session)
  const timeAnalysis = computeTimeAnalysis(results, timeUsedSeconds)
  const strongDomains = computeStrongDomains(domainScores)
  const weakDomains = computeWeakDomains(domainScores)

  return {
    overall,
    domainScores,
    kindScores,
    levelScores,
    timeAnalysis,
    strongDomains,
    weakDomains,
    summary: buildSummary(overall, kindScores, timeAnalysis),
    recommendations: buildRecommendations(weakDomains, overall),
  }
}

/** Freezes a finished session into a fully self-contained, persistable result. */
export function buildJavaExamResult(
  session: JavaExamSession,
  questions: JavaQuestion[],
): JavaExamResult {
  const submittedAt = session.submittedAt ?? new Date().toISOString()
  const evaluation = evaluateJavaExam({ ...session, submittedAt }, questions)
  return {
    id: `java-result-${session.id}`,
    sessionId: session.id,
    examId: session.examId,
    examName: session.examName,
    startedAt: session.startedAt,
    submittedAt,
    submitReason: session.submitReason ?? 'user',
    durationSeconds: session.durationSeconds,
    timeUsedSeconds: evaluation.timeAnalysis.timeUsedSeconds,
    negativeMarking: session.negativeMarking,
    overall: evaluation.overall,
    domainScores: evaluation.domainScores,
    kindScores: evaluation.kindScores,
    levelScores: evaluation.levelScores,
    timeAnalysis: evaluation.timeAnalysis,
    strongDomains: evaluation.strongDomains,
    weakDomains: evaluation.weakDomains,
    summary: evaluation.summary,
    recommendations: evaluation.recommendations,
    questionResults: evaluation.questionResults,
  }
}

export function round2(value: number): number {
  const rounded = Math.round(value * 100) / 100
  return Object.is(rounded, -0) ? 0 : rounded
}

export function safePercent(numerator: number, denominator: number): number {
  if (denominator <= 0) return 0
  return round2((numerator / denominator) * 100)
}
