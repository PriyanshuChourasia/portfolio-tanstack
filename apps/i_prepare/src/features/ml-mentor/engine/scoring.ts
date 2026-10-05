import type {
  AssessmentKind,
  AssessmentQuestionResult,
  AssessmentResult,
  DailySession,
  InterviewAnswer,
  InterviewDifficulty,
  InterviewQuestion,
  MockInterviewSession,
  SessionQuestion,
} from '../types'
import { BASELINE_QUESTIONS, INTERVIEW_QUESTIONS, getModule, questionsForModule } from '../data'
import { randomSample } from './random'

/** Grades one MCQ selection. */
export function isCorrect(question: { answerIndex: number }, selectedIndex: number | null): boolean {
  return selectedIndex !== null && selectedIndex === question.answerIndex
}

/** Maps a percentage to a 0–10 topic score. */
export function percentageToScore(percentage: number): number {
  return Math.max(0, Math.min(10, Math.round((percentage / 100) * 10)))
}

/** Correct answers per topic → per-topic score (0–10). */
export function topicScoresFromResults(
  results: AssessmentQuestionResult[],
  perTopic: Record<string, { correct: number; total: number }>,
): Record<string, number> {
  const scores: Record<string, number> = {}
  for (const [topicId, tally] of Object.entries(perTopic)) {
    scores[topicId] = tally.total > 0 ? percentageToScore((tally.correct / tally.total) * 100) : 0
  }
  void results
  return scores
}

export function buildAssessmentResult(
  kind: AssessmentKind,
  moduleId: string | null,
  questions: Array<{ id: string; topicId: string }>,
  selections: Record<string, number | null>,
  answerKeys: Record<string, number>,
): AssessmentResult {
  const questionResults: AssessmentQuestionResult[] = questions.map((question) => ({
    questionId: question.id,
    topicId: question.topicId,
    selectedIndex: selections[question.id] ?? null,
    correct: isCorrect({ answerIndex: answerKeys[question.id] }, selections[question.id] ?? null),
  }))

  const correctCount = questionResults.filter((r) => r.correct).length
  const totalQuestions = questionResults.length
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0

  const perTopic: Record<string, { correct: number; total: number }> = {}
  for (const result of questionResults) {
    if (!result.topicId) continue
    const tally = (perTopic[result.topicId] ??= { correct: 0, total: 0 })
    tally.total += 1
    if (result.correct) tally.correct += 1
  }

  return {
    id: `${kind}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    kind,
    moduleId,
    submittedAt: new Date().toISOString(),
    correctCount,
    totalQuestions,
    percentage,
    topicScores: topicScoresFromResults(questionResults, perTopic),
    passed: percentage >= (kind === 'module_test' ? 70 : 50),
    questionResults,
  }
}

/* ── Daily session ("Start today's preparation") ───────────────────────────── */

/** 2–3 check questions on today's topic. */
function checkQuestionsForTopic(topicId: string): SessionQuestion[] {
  const bank = questionsForModule(topicId.slice(0, 3)).filter((q) => q.topicId === topicId)
  const picked = randomSample(bank, 3)
  return picked.map((q) => ({
    questionId: q.id,
    prompt: q.prompt,
    options: q.options,
    answerIndex: q.answerIndex,
    explanation: q.explanation,
    topicId: q.topicId,
  }))
}

/** Spaced revision: prompts from previously completed topics. */
export function revisionPromptsFrom(completedTopicTitles: string[], max = 2): string[] {
  return randomSample(completedTopicTitles, max)
}

export function buildDailySession(
  moduleId: string,
  topicId: string,
  completedTopicTitles: string[],
): DailySession {
  const module = getModule(moduleId)
  if (!module) throw new Error(`Unknown module: ${moduleId}`)
  const topic = module.topics.find((t) => t.id === topicId) ?? module.topics[0]

  return {
    id: `daily-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    moduleId,
    moduleTitle: module.title,
    topicId: topic.id,
    topicTitle: topic.title,
    questions: checkQuestionsForTopic(topic.id),
    exercise: topic.practiceExercise,
    codingTask: topic.codingTask ?? null,
    revisionPrompts: revisionPromptsFrom(completedTopicTitles),
    answeredTopicIds: [],
    correctCount: 0,
    completed: false,
  }
}

/* ── Mock interviews ───────────────────────────────────────────────────────── */

const DIFFICULTY_RANK: Record<InterviewDifficulty, number> = {
  Beginner: 0,
  Junior: 1,
  Intermediate: 2,
  Advanced: 3,
}

/** Builds a mock interview: 6 questions laddering up from the chosen level. */
export function buildMockInterview(
  difficulty: InterviewDifficulty,
  focusedModuleId: string | null,
): MockInterviewSession {
  const startRank = DIFFICULTY_RANK[difficulty]
  const pool = INTERVIEW_QUESTIONS.filter(
    (q) => focusedModuleId === null || q.moduleId === focusedModuleId || q.moduleId === null,
  )

  // One question per rank starting at the chosen difficulty, escalating upward.
  const ladder: InterviewQuestion[] = []
  for (let rank = startRank; rank < 4 && ladder.length < 4; rank += 1) {
    const atRank = pool.filter(
      (q) => DIFFICULTY_RANK[q.difficulty] === rank && !ladder.some((picked) => picked.id === q.id),
    )
    ladder.push(...randomSample(atRank, 1))
  }
  // Fill remaining slots from the base difficulty for breadth.
  const fill = pool.filter((q) => DIFFICULTY_RANK[q.difficulty] === startRank)
  for (const question of randomSample(fill, 6 - ladder.length)) {
    if (!ladder.some((picked) => picked.id === question.id)) ladder.push(question)
  }
  // Present the ladder strictly by ascending difficulty.
  ladder.sort((a, b) => DIFFICULTY_RANK[a.difficulty] - DIFFICULTY_RANK[b.difficulty])

  const answers: Record<string, InterviewAnswer> = {}
  for (const question of ladder) {
    answers[question.id] = { questionId: question.id, attempt: '', score: null, scoredAt: null }
  }

  return {
    id: `mock-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    difficulty,
    escalated: ladder.some(
      (q) => DIFFICULTY_RANK[q.difficulty] > startRank,
    ),
    questionIds: ladder.map((q) => q.id),
    currentIndex: 0,
    answers,
    status: 'active',
    startedAt: new Date().toISOString(),
    completedAt: null,
    averageScore: null,
  }
}

/** Baseline quiz is always the fixed 10-question assessment. */
export function baselineQuestions(): typeof BASELINE_QUESTIONS {
  return BASELINE_QUESTIONS
}

export function moduleTestQuestions(moduleId: string) {
  return questionsForModule(moduleId)
}
