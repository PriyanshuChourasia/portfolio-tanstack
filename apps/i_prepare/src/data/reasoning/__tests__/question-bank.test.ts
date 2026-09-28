import { describe, expect, it } from 'vitest'
import {
  ALL_REASONING_QUESTIONS,
  EXAMS,
  OPTION_KEYS,
  TOPICS_BY_SUBJECT,
  TEST_PRESETS,
  analogyPracticeQuestions,
  sbiEnglishQuestions,
  getExam,
  questionsForExam,
  topicsForExam,
} from '../index'

const EXAM_SECTIONS = EXAMS.filter((exam) => exam.kind === 'exam')

describe('reasoning question bank', () => {
  it('has no duplicate ids across all exams', () => {
    const ids = ALL_REASONING_QUESTIONS.map((question) => question.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('gives every question exactly four non-empty options and one correct answer', () => {
    for (const question of ALL_REASONING_QUESTIONS) {
      expect(question.options, question.id).toHaveLength(4)
      for (const option of question.options) {
        expect(option.trim().length, question.id).toBeGreaterThan(0)
      }
      expect(OPTION_KEYS, question.id).toContain(question.correctOption)
      expect(question.explanation.trim().length, question.id).toBeGreaterThan(10)
    }
  })

  it('tags every generated question as PYQ-pattern and never as an actual paper question', () => {
    for (const question of ALL_REASONING_QUESTIONS) {
      if (question.sourceType === 'actual_pyq') {
        expect(question.sourceNote.startsWith('Actual PYQ'), question.id).toBe(true)
      } else {
        expect(question.sourceNote, question.id).toContain('not an actual paper question')
      }
    }
  })

  it('covers every topic of its subject in every exam', () => {
    for (const exam of EXAM_SECTIONS) {
      const topics = topicsForExam(exam.id)
      const subjectTopics = TOPICS_BY_SUBJECT[exam.subject]
      expect(topics, exam.id).toHaveLength(subjectTopics.length)
      for (const topic of subjectTopics) {
        expect(topics, `${exam.id} · ${topic}`).toContain(topic)
      }
    }
  })

  it('keeps each exam bank between 40 and 50 questions with three difficulty levels', () => {
    for (const exam of EXAM_SECTIONS) {
      const questions = questionsForExam(exam.id)
      expect(questions.length, exam.id).toBeGreaterThanOrEqual(40)
      expect(questions.length, exam.id).toBeLessThanOrEqual(50)

      const levels = new Set(questions.map((question) => question.difficulty))
      expect(levels, exam.id).toEqual(new Set(['easy', 'moderate', 'difficult']))
    }
  })
})

describe('analogy practice paper', () => {
  const LEVEL_SIZES = [10, 10, 10, 10, 10, 15, 10, 5, 10, 10]

  it('has 100 analogy questions split across the 10 levels in order', () => {
    expect(analogyPracticeQuestions).toHaveLength(100)
    expect(getExam('ANALOGY_PRACTICE').sequential).toBe(true)

    let index = 0
    LEVEL_SIZES.forEach((size, level) => {
      for (const question of analogyPracticeQuestions.slice(index, index + size)) {
        expect(question.topic, question.id).toBe('Analogy')
        expect(question.subtopic, question.id).toMatch(new RegExp(`^Level ${level + 1} ·`))
      }
      index += size
    })
  })

  it('has no duplicate question text and no duplicate options within a question', () => {
    const texts = analogyPracticeQuestions.map((question) => question.questionText)
    expect(new Set(texts).size).toBe(texts.length)
    for (const question of analogyPracticeQuestions) {
      expect(new Set(question.options).size, question.id).toBe(4)
      expect(question.explanation, question.id).toMatch(/^Relationship: /)
    }
  })

  it('spreads correct answers across all four options', () => {
    for (const key of OPTION_KEYS) {
      const count = analogyPracticeQuestions.filter((question) => question.correctOption === key).length
      expect(count, key).toBeGreaterThanOrEqual(20)
    }
  })
})

describe('SBI PO / Clerk English paper', () => {
  it('is an English exam with the SBI prelims pattern', () => {
    const exam = getExam('SBI_ENGLISH')
    expect(exam.subject).toBe('english')
    expect(exam.defaultQuestionCount).toBe(30)
    expect(exam.defaultDurationMinutes).toBe(20)
    expect(exam.marking).toEqual({ positiveMarks: 1, negativeMarks: 0.25 })
  })

  it('has no duplicate options within a question', () => {
    for (const question of sbiEnglishQuestions) {
      expect(new Set(question.options).size, question.id).toBe(4)
    }
  })

  it('spreads correct answers across all four options', () => {
    for (const key of OPTION_KEYS) {
      const count = sbiEnglishQuestions.filter((question) => question.correctOption === key).length
      expect(count, key).toBeGreaterThanOrEqual(8)
    }
  })
})

describe('exam presets', () => {
  it('never asks for more questions than the bank holds', () => {
    for (const preset of TEST_PRESETS) {
      const available = questionsForExam(preset.examId).length
      expect(preset.totalQuestions, preset.id).toBeGreaterThan(0)
      expect(preset.totalQuestions, preset.id).toBeLessThanOrEqual(available)
      expect(preset.durationMinutes, preset.id).toBeGreaterThan(0)
    }
  })

  it('defines a positive marking scheme for every exam', () => {
    for (const exam of EXAMS) {
      expect(exam.marking.positiveMarks, exam.id).toBeGreaterThan(0)
      expect(exam.marking.negativeMarks, exam.id).toBeGreaterThanOrEqual(0)
      expect(exam.defaultQuestionCount, exam.id).toBeGreaterThan(0)
    }
  })
})
