import { describe, expect, it } from 'vitest'
import {
  gradeJavaQuestions,
  gradeObjective,
  normalizeText,
  computeOverall,
  computeDomainScores,
  maxMarksFor,
} from '../scoring'
import { createEmptyJavaAnswer } from '../scoring-helpers'
import { emptyMastery, stateFor, updateMastery, buildRevisionPlan, hydrateMastery } from '../mastery'
import { selectQuestions, filterQuestions } from '../question-select'
import type { JavaExamSession, JavaQuestion } from '../../types'

function makeQuestion(overrides: Partial<JavaQuestion> & Pick<JavaQuestion, 'id'>): JavaQuestion {
  return {
    domain: 'Fundamentals',
    level: 3,
    kind: 'mcq',
    prompt: 'Test question',
    options: ['A', 'B', 'C', 'D'],
    answerKey: 2,
    explanation: 'Because',
    ...overrides,
  }
}

function makeSession(questions: JavaQuestion[], overrides: Partial<JavaExamSession> = {}): JavaExamSession {
  const answers = Object.fromEntries(questions.map((q) => [q.id, createEmptyJavaAnswer('s1', q.id)]))
  return {
    id: 's1',
    examId: 'test',
    examName: 'Test',
    questionIds: questions.map((q) => q.id),
    durationSeconds: 600,
    negativeMarking: true,
    startedAt: new Date().toISOString(),
    activeSince: null,
    currentQuestionIndex: 0,
    revealIndex: null,
    answers,
    status: 'submitted',
    submittedAt: new Date().toISOString(),
    submitReason: 'user',
    ...overrides,
  }
}

describe('normalizeText', () => {
  it('lowercases, trims and collapses whitespace', () => {
    expect(normalizeText('  Hello   World; ')).toBe('hello world')
  })
})

describe('objective grading', () => {
  it('grades a correct MCQ', () => {
    const q = makeQuestion({ id: 'q1' })
    const answer = { ...createEmptyJavaAnswer('s', 'q1'), selectedIndex: 2 }
    expect(gradeObjective(q, answer)).toBe('correct')
  })

  it('grades an incorrect MCQ', () => {
    const q = makeQuestion({ id: 'q1' })
    const answer = { ...createEmptyJavaAnswer('s', 'q1'), selectedIndex: 0 }
    expect(gradeObjective(q, answer)).toBe('incorrect')
  })

  it('treats blank objective answers as unanswered', () => {
    const q = makeQuestion({ id: 'q1' })
    expect(gradeObjective(q, createEmptyJavaAnswer('s', 'q1'))).toBe('unanswered')
  })

  it('matches accepted text answers case-insensitively', () => {
    const q = makeQuestion({ id: 'q1', kind: 'output_prediction', options: undefined, acceptedAnswers: ['false'] })
    const answer = { ...createEmptyJavaAnswer('s', 'q1'), text: 'FALSE' }
    expect(gradeObjective(q, answer)).toBe('correct')
  })

  it('awards partial credit for multiple-select with correct-only subset', () => {
    const q = makeQuestion({ id: 'q1', kind: 'multiple_select', answerKey: [0, 1, 2] })
    const answer = { ...createEmptyJavaAnswer('s', 'q1'), selectedIndices: [0, 1] }
    expect(gradeObjective(q, answer)).toBe('partial')
  })

  it('marks multiple-select wrong when any selection is wrong', () => {
    const q = makeQuestion({ id: 'q1', kind: 'multiple_select', answerKey: [0, 1] })
    const answer = { ...createEmptyJavaAnswer('s', 'q1'), selectedIndices: [0, 2] }
    expect(gradeObjective(q, answer)).toBe('incorrect')
  })
})

describe('subjective grading', () => {
  it('subjective questions carry 5 marks', () => {
    const q = makeQuestion({ id: 'q1', kind: 'system_design', modelAnswer: 'x' })
    expect(maxMarksFor(q)).toBe(5)
  })

  it('ungraded subjective answers with text count as unanswered in outcome but text presence enables reveal', () => {
    const q = makeQuestion({ id: 'q1', kind: 'short_answer', modelAnswer: 'x' })
    const answer = { ...createEmptyJavaAnswer('s', 'q1'), text: 'my answer' }
    const results = gradeJavaQuestions([q], { q1: answer })
    expect(results[0].outcome).toBe('unanswered')
    expect(results[0].earned).toBe(0)
  })

  it('graded subjective answers convert self-grade to marks', () => {
    const q = makeQuestion({ id: 'q1', kind: 'short_answer', modelAnswer: 'x' })
    const answer = { ...createEmptyJavaAnswer('s', 'q1'), text: 'my answer', selfGrade: 4 }
    const results = gradeJavaQuestions([q], { q1: answer })
    expect(results[0].outcome).toBe('correct')
    expect(results[0].earned).toBe(4)
  })
})

describe('overall scoring', () => {
  it('combines objective and subjective marks', () => {
    const questions = [
      makeQuestion({ id: 'a' }),
      makeQuestion({ id: 'b' }),
      makeQuestion({ id: 'c', kind: 'short_answer', modelAnswer: 'm' }),
    ]
    const session = makeSession(questions)
    session.answers.a.selectedIndex = 2 // correct → 1
    session.answers.b.selectedIndex = 0 // incorrect → 0
    session.answers.c.text = 'attempt'
    session.answers.c.selfGrade = 3 // partial → 3
    const results = gradeJavaQuestions(questions, session.answers)
    const overall = computeOverall(results)
    expect(overall.score).toBe(4)
    expect(overall.maxScore).toBe(7)
    expect(overall.correct).toBe(1)
    expect(overall.partial).toBe(1)
    expect(overall.incorrect).toBe(1)
  })
})

describe('domain scores', () => {
  it('buckets results by domain', () => {
    const questions = [
      makeQuestion({ id: 'a', domain: 'OOP' }),
      makeQuestion({ id: 'b', domain: 'OOP' }),
      makeQuestion({ id: 'c', domain: 'Kafka' }),
    ]
    const session = makeSession(questions)
    session.answers.a.selectedIndex = 2
    session.answers.b.selectedIndex = 1
    const results = gradeJavaQuestions(questions, session.answers)
    const domains = computeDomainScores(results)
    const oop = domains.find((d) => d.domain === 'OOP')
    expect(oop?.total).toBe(2)
    expect(oop?.correct).toBe(1)
    expect(oop?.incorrect).toBe(1)
  })
})

describe('mastery', () => {
  it('starts at not_started', () => {
    const mastery = emptyMastery()
    expect(mastery['OOP'].state).toBe('not_started')
  })

  it('requires consistent high performance for interview_ready', () => {
    expect(stateFor(80, 1)).toBe('developing')
    expect(stateFor(80, 2)).toBe('interview_ready')
    expect(stateFor(60, 5)).toBe('developing')
    expect(stateFor(91, 3)).toBe('mastered')
  })

  it('EMA moves toward the new result, not instantly', () => {
    let mastery = emptyMastery()
    const result = {
      domainScores: [
        { domain: 'OOP' as const, earned: 100, max: 100, attempted: 1, correct: 1, partial: 0, incorrect: 0, unanswered: 0, percentage: 100, total: 1, avgTimeSeconds: 0 },
      ],
    } as never
    mastery = updateMastery(mastery, result)
    expect(mastery['OOP'].ema).toBe(100)
    // A bad second exam pulls the EMA down but not all the way.
    const badResult = {
      domainScores: [
        { domain: 'OOP' as const, earned: 0, max: 100, attempted: 1, correct: 0, partial: 0, incorrect: 1, unanswered: 0, percentage: 0, total: 1, avgTimeSeconds: 0 },
      ],
    } as never
    mastery = updateMastery(mastery, badResult)
    expect(mastery['OOP'].ema).toBe(60)
  })

  it('builds a revision plan from weakest domains', () => {
    const stored = {
      OOP: { domain: 'OOP' as const, ema: 40, attempts: 2, lastPracticedAt: null, state: 'learning' as const },
      Kafka: { domain: 'Kafka' as const, ema: 90, attempts: 3, lastPracticedAt: null, state: 'advanced' as const },
    }
    const mastery = hydrateMastery(stored)
    const plan = buildRevisionPlan(mastery)
    expect(plan[0].domain).toBe('OOP')
    // Advanced (90% EMA, not yet mastered) still appears — but weaker domains come first.
    expect(plan.filter((item) => item.domain === 'Kafka').length).toBeLessThanOrEqual(1)
  })
})

describe('question selection', () => {
  const pool = [
    makeQuestion({ id: '1', domain: 'OOP', level: 2 }),
    makeQuestion({ id: '2', domain: 'OOP', level: 4 }),
    makeQuestion({ id: '3', domain: 'Kafka', level: 4 }),
    makeQuestion({ id: '4', domain: 'Kafka', level: 5, kind: 'system_design' }),
    makeQuestion({ id: '5', domain: 'Collections', level: 3 }),
  ]

  it('filters by level', () => {
    const filtered = filterQuestions(pool, { levels: [4, 5] })
    expect(filtered.map((q) => q.id).sort()).toEqual(['2', '3', '4'])
  })

  it('filters by domain', () => {
    const filtered = filterQuestions(pool, { domains: ['Kafka'] })
    expect(filtered.map((q) => q.id).sort()).toEqual(['3', '4'])
  })

  it('round-robin distributes across domains', () => {
    const picked = selectQuestions(pool, {}, 4, 42)
    const domains = new Set(picked.map((q) => q.domain))
    expect(domains.size).toBeGreaterThanOrEqual(3)
  })

  it('returns fewer than requested when the pool is small', () => {
    const picked = selectQuestions(pool, { domains: ['Collections'] }, 10, 7)
    expect(picked.length).toBe(1)
  })

  it('is deterministic for a fixed seed', () => {
    const a = selectQuestions(pool, {}, 4, 99)
    const b = selectQuestions(pool, {}, 4, 99)
    expect(a.map((q) => q.id)).toEqual(b.map((q) => q.id))
  })
})
