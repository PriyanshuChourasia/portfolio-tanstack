import { describe, expect, it } from 'vitest'
import type { OptionKey, Question, TestSession, UserAnswer } from '@/data/reasoning'
import { createEmptyAnswer } from '../scoring'
import { buildTestResult, evaluateTest } from '../evaluation'
import { countMatchingQuestions, createSession, selectQuestions } from '../test-builder'

function makeQuestion(
  id: string,
  correctOption: OptionKey,
  topic: Question['topic'],
  difficulty: Question['difficulty'],
): Question {
  return {
    id,
    examIds: ['SBI_PO'],
    topic,
    difficulty,
    questionText: `Question ${id}`,
    options: ['one', 'two', 'three', 'four'],
    correctOption,
    explanation: `Explanation ${id}`,
    sourceType: 'pyq_pattern',
    sourceNote: 'PYQ-pattern question',
  }
}

const QUESTIONS: Question[] = [
  makeQuestion('q1', 'A', 'Series', 'easy'),
  makeQuestion('q2', 'B', 'Series', 'easy'),
  makeQuestion('q3', 'C', 'Floor Puzzle', 'difficult'),
  makeQuestion('q4', 'D', 'Floor Puzzle', 'difficult'),
  makeQuestion('q5', 'A', 'Syllogism', 'moderate'),
  makeQuestion('q6', 'B', 'Syllogism', 'moderate'),
]

function answer(sessionId: string, questionId: string, patch: Partial<UserAnswer>): UserAnswer {
  return { ...createEmptyAnswer(sessionId, questionId), ...patch }
}

function makeSession(
  answers: Record<string, UserAnswer>,
  overrides: Partial<TestSession> = {},
): TestSession {
  return {
    id: 'session-test',
    testId: 'test-1',
    examId: 'SBI_PO',
    testTitle: 'SBI PO Reasoning',
    questionIds: QUESTIONS.map((question) => question.id),
    durationSeconds: 600,
    marking: { positiveMarks: 1, negativeMarks: 0.25 },
    difficulty: 'mixed',
    topics: [],
    startedAt: '2026-09-23T10:00:00.000Z',
    activeSince: null,
    currentQuestionIndex: 0,
    answers,
    status: 'active',
    submittedAt: null,
    submitReason: null,
    ...overrides,
  }
}

const sessionId = 'session-test'

const MIXED_ANSWERS: Record<string, UserAnswer> = {
  q1: answer(sessionId, 'q1', { selectedOption: 'A', timeSpentMs: 10_000 }), // Series correct
  q2: answer(sessionId, 'q2', { selectedOption: 'D', timeSpentMs: 30_000 }), // Series wrong
  q3: answer(sessionId, 'q3', { selectedOption: 'C', timeSpentMs: 90_000 }), // Floor Puzzle correct
  q4: answer(sessionId, 'q4', { selectedOption: 'A', timeSpentMs: 120_000 }), // Floor Puzzle wrong
  q5: answer(sessionId, 'q5', { selectedOption: 'A', timeSpentMs: 20_000 }), // Syllogism correct
  // q6 unanswered, never visited
}

describe('evaluateTest', () => {
  it('derives overall marks from the session marking scheme', () => {
    const evaluation = evaluateTest(makeSession(MIXED_ANSWERS), QUESTIONS)
    expect(evaluation.overall).toMatchObject({
      totalQuestions: 6,
      attempted: 5,
      correct: 3,
      incorrect: 2,
      unanswered: 1,
      score: 2.5,
      maxScore: 6,
    })
  })

  it('groups performance by topic and by difficulty', () => {
    const evaluation = evaluateTest(makeSession(MIXED_ANSWERS), QUESTIONS)

    const series = evaluation.topicPerformance.find((topic) => topic.topic === 'Series')
    expect(series).toMatchObject({ total: 2, attempted: 2, correct: 1, incorrect: 1, accuracy: 50 })

    const puzzle = evaluation.topicPerformance.find((topic) => topic.topic === 'Floor Puzzle')
    expect(puzzle).toMatchObject({ attempted: 2, correct: 1, accuracy: 50 })

    const syllogism = evaluation.topicPerformance.find((topic) => topic.topic === 'Syllogism')
    expect(syllogism).toMatchObject({ attempted: 1, correct: 1, accuracy: 100, unanswered: 1 })

    const easy = evaluation.difficultyPerformance.find((row) => row.difficulty === 'easy')
    const difficult = evaluation.difficultyPerformance.find((row) => row.difficulty === 'difficult')
    expect(easy).toMatchObject({ total: 2, attempted: 2, correct: 1, accuracy: 50 })
    expect(difficult).toMatchObject({ total: 2, attempted: 2, correct: 1, accuracy: 50 })
  })

  it('computes question-level time analysis', () => {
    const evaluation = evaluateTest(makeSession(MIXED_ANSWERS), QUESTIONS)

    expect(evaluation.timeAnalysis.timedQuestions).toBe(5)
    expect(evaluation.timeAnalysis.avgTimePerQuestionSeconds).toBe(54)
    expect(evaluation.timeAnalysis.fastest?.questionId).toBe('q1')
    expect(evaluation.timeAnalysis.slowest?.questionId).toBe('q4')
    expect(evaluation.timeAnalysis.avgCorrectSeconds).toBe(40)
    expect(evaluation.timeAnalysis.avgIncorrectSeconds).toBe(75)
    expect(evaluation.timeAnalysis.byTopic[0].topic).toBe('Floor Puzzle')
  })

  it('writes a factual summary from the stored answers', () => {
    const evaluation = evaluateTest(makeSession(MIXED_ANSWERS), QUESTIONS)
    const text = evaluation.summary.join(' ')

    expect(text).toContain('attempted 5 of 6 questions')
    expect(text).toContain('accuracy was 60%')
    expect(text).toContain('strongest topic by accuracy was Syllogism')
    expect(text).toContain('You left 1 question(s) unanswered')
  })

  it('flags weak topics as focus areas with recommendations based on the results', () => {
    const evaluation = evaluateTest(makeSession(MIXED_ANSWERS), QUESTIONS)
    const topics = evaluation.focusAreas.map((area) => area.topic)

    expect(topics).toContain('Series')
    expect(topics).toContain('Floor Puzzle')
    expect(evaluation.recommendations.practice.some((line) => line.includes('Floor Puzzle'))).toBe(true)
    expect(evaluation.recommendations.practice.some((line) => line.includes('unanswered'))).toBe(true)
  })

  it('reports no focus areas when everything is strong', () => {
    const allCorrect: Record<string, UserAnswer> = {}
    for (const question of QUESTIONS) {
      allCorrect[question.id] = answer(sessionId, question.id, { selectedOption: question.correctOption })
    }
    const evaluation = evaluateTest(makeSession(allCorrect), QUESTIONS)

    expect(evaluation.overall.accuracy).toBe(100)
    expect(evaluation.focusAreas).toHaveLength(0)
    expect(
      evaluation.recommendations.practice.some((line) => line.includes('No topic fell below')),
    ).toBe(false)
  })

  it('uses an explicit time override when the wall clock is unavailable', () => {
    const evaluation = evaluateTest(makeSession(MIXED_ANSWERS), QUESTIONS, { timeUsedSeconds: 421 })
    expect(evaluation.timeAnalysis.timeUsedSeconds).toBe(421)
  })
})

describe('buildTestResult', () => {
  it('freezes the evaluation and the full question snapshot', () => {
    const session = makeSession(MIXED_ANSWERS, {
      status: 'submitted',
      submittedAt: '2026-09-23T10:05:00.000Z',
      submitReason: 'user',
    })

    const result = buildTestResult(session, QUESTIONS, 'SBI PO (Prelims)')

    expect(result.overall.correct).toBe(3)
    expect(result.submitReason).toBe('user')
    expect(result.timeUsedSeconds).toBe(300)
    expect(result.questionResults).toHaveLength(6)
    expect(result.questionResults[0]).toMatchObject({ questionId: 'q1', selectedOption: 'A', outcome: 'correct' })
    expect(result.questionResults[5]).toMatchObject({ questionId: 'q6', selectedOption: null, outcome: 'unanswered' })
    expect(result.topicPerformance.length).toBeGreaterThan(0)
  })
})

describe('test builder', () => {
  const baseConfig = {
    examId: 'SBI_PO' as const,
    testId: 'sbi-po-quick',
    questionCount: 2,
    durationMinutes: 10,
    difficulty: 'mixed' as const,
    topics: [],
    marking: { positiveMarks: 1, negativeMarks: 0.25 },
  }

  it('clamps the paper to the matching pool size', () => {
    expect(countMatchingQuestions(baseConfig)).toBe(41)
    const questions = selectQuestions({ ...baseConfig, questionCount: 999 })
    expect(questions).toHaveLength(41)
  })

  it('respects the difficulty filter', () => {
    const questions = selectQuestions({ ...baseConfig, difficulty: 'easy', questionCount: 999 })
    expect(questions.length).toBeGreaterThan(0)
    expect(questions.every((question) => question.difficulty === 'easy')).toBe(true)
  })

  it('respects the topic filter', () => {
    const questions = selectQuestions({ ...baseConfig, topics: ['Series'], questionCount: 999 })
    expect(questions.every((question) => question.topic === 'Series')).toBe(true)
  })

  it('keeps the topic filter when that topic has no question at the chosen difficulty', () => {
    // SBI PO Analogy questions are easy/moderate only, so the topic filter must win.
    const questions = selectQuestions({ ...baseConfig, topics: ['Analogy'], difficulty: 'difficult', questionCount: 999 })
    expect(questions.length).toBeGreaterThan(0)
    expect(questions.every((question) => question.topic === 'Analogy')).toBe(true)
  })

  it('creates a session whose answers are pre-seeded for every question', () => {
    const selected = selectQuestions(baseConfig)
    const session = createSession(baseConfig, selected)

    expect(session.questionIds).toEqual(selected.map((question) => question.id))
    expect(Object.keys(session.answers)).toHaveLength(selected.length)
    expect(session.answers[session.questionIds[0]].visited).toBe(true)
    expect(session.durationSeconds).toBe(600)
    expect(session.status).toBe('active')
    expect(session.submitReason).toBeNull()
  })
})
