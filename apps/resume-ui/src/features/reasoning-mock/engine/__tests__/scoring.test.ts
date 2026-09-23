import { describe, expect, it } from 'vitest'
import type { OptionKey, Question, UserAnswer } from '@/data/reasoning'
import { calculateScore, countByOutcome, createEmptyAnswer, gradeQuestions, safePercent } from '../scoring'

function makeQuestion(
  id: string,
  correctOption: OptionKey,
  topic: Question['topic'] = 'Series',
  difficulty: Question['difficulty'] = 'moderate',
): Question {
  return {
    id,
    examIds: ['SSC_CHSL'],
    topic,
    difficulty,
    questionText: `Question ${id}`,
    options: ['one', 'two', 'three', 'four'],
    correctOption,
    explanation: `Explanation ${id}`,
    sourceType: 'pyq_pattern',
    sourceNote: `PYQ-pattern question — pattern: test`,
  }
}

function answer(sessionId: string, questionId: string, patch: Partial<UserAnswer>): UserAnswer {
  return { ...createEmptyAnswer(sessionId, questionId), ...patch }
}

describe('calculateScore', () => {
  const questions = [
    makeQuestion('q1', 'A'),
    makeQuestion('q2', 'B'),
    makeQuestion('q3', 'C'),
    makeQuestion('q4', 'D'),
  ]

  it('applies the marking scheme with negative marking for wrong answers', () => {
    const answers: Record<string, UserAnswer> = {
      q1: answer('s1', 'q1', { selectedOption: 'A' }),
      q2: answer('s1', 'q2', { selectedOption: 'B' }),
      q3: answer('s1', 'q3', { selectedOption: 'A' }),
      // q4 intentionally left unanswered
    }

    const result = calculateScore(questions, answers, 1, 0.25)

    expect(result.totalQuestions).toBe(4)
    expect(result.correct).toBe(2)
    expect(result.incorrect).toBe(1)
    expect(result.unanswered).toBe(1)
    expect(result.attempted).toBe(3)
    expect(result.score).toBe(1.75)
    expect(result.maxScore).toBe(4)
    expect(result.percentage).toBe(43.75)
    expect(result.accuracy).toBe(66.67)
    expect(result.attemptRate).toBe(75)
  })

  it('honours a different marking scheme without hardcoding', () => {
    const answers: Record<string, UserAnswer> = {
      q1: answer('s1', 'q1', { selectedOption: 'A' }),
      q2: answer('s1', 'q2', { selectedOption: 'D' }),
    }

    const ssc = calculateScore(questions, answers, 2, 0.5)
    expect(ssc.score).toBe(1.5)
    expect(ssc.maxScore).toBe(8)
  })

  it('can produce a negative score when wrong answers outweigh correct ones', () => {
    const answers: Record<string, UserAnswer> = {
      q1: answer('s1', 'q1', { selectedOption: 'B' }),
      q2: answer('s1', 'q2', { selectedOption: 'C' }),
      q3: answer('s1', 'q3', { selectedOption: 'D' }),
    }
    expect(calculateScore(questions, answers, 1, 0.25).score).toBe(-0.75)
    expect(calculateScore(questions, answers, 1, 0.25).percentage).toBe(-18.75)
  })

  it('reports zero accuracy when nothing is attempted', () => {
    const result = calculateScore(questions, {}, 1, 0.25)
    expect(result.attempted).toBe(0)
    expect(result.accuracy).toBe(0)
    expect(result.attemptRate).toBe(0)
    expect(result.score).toBe(0)
  })

  it('handles an empty paper', () => {
    const result = calculateScore([], {}, 1, 0.25)
    expect(result).toMatchObject({ totalQuestions: 0, score: 0, maxScore: 0, percentage: 0, accuracy: 0 })
  })

  it('treats a cleared answer as unattempted', () => {
    const answers: Record<string, UserAnswer> = {
      q1: answer('s1', 'q1', { selectedOption: null, visited: true }),
    }
    const result = calculateScore([questions[0]], answers, 1, 0.25)
    expect(result.unanswered).toBe(1)
    expect(result.incorrect).toBe(0)
  })
})

describe('gradeQuestions', () => {
  it('snapshots the question, the picked option and the outcome', () => {
    const questions = [makeQuestion('q1', 'A'), makeQuestion('q2', 'B')]
    const graded = gradeQuestions(questions, {
      q1: answer('s1', 'q1', { selectedOption: 'A', markedForReview: true, timeSpentMs: 4200 }),
    })

    expect(graded).toHaveLength(2)
    expect(graded[0]).toMatchObject({
      questionId: 'q1',
      selectedOption: 'A',
      correctOption: 'A',
      outcome: 'correct',
      markedForReview: true,
      timeSpentMs: 4200,
    })
    expect(graded[0].options).toEqual(['one', 'two', 'three', 'four'])
    expect(graded[1]).toMatchObject({ questionId: 'q2', selectedOption: null, outcome: 'unanswered' })
  })
})

describe('countByOutcome', () => {
  it('counts answered, marked and visited questions', () => {
    const questions = [makeQuestion('q1', 'A'), makeQuestion('q2', 'B'), makeQuestion('q3', 'C')]
    const counts = countByOutcome(questions, {
      q1: answer('s1', 'q1', { selectedOption: 'A', visited: true }),
      q2: answer('s1', 'q2', { markedForReview: true, visited: true }),
    })
    expect(counts).toEqual({ answered: 1, marked: 1, visited: 2, notVisited: 1 })
  })
})

describe('safePercent', () => {
  it('never divides by zero and rounds to two decimals', () => {
    expect(safePercent(1, 0)).toBe(0)
    expect(safePercent(1, 3)).toBe(33.33)
    expect(safePercent(0, 5)).toBe(0)
  })
})
