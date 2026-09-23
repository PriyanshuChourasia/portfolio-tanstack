import { describe, expect, it } from 'vitest'
import {
  ALL_REASONING_QUESTIONS,
  EXAMS,
  OPTION_KEYS,
  REASONING_TOPICS,
  TEST_PRESETS,
  questionsForExam,
  topicsForExam,
} from '../index'

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

  it('covers every reasoning topic in every exam', () => {
    for (const exam of EXAMS) {
      const topics = topicsForExam(exam.id)
      expect(topics, exam.id).toHaveLength(REASONING_TOPICS.length)
      for (const topic of REASONING_TOPICS) {
        expect(topics, `${exam.id} · ${topic}`).toContain(topic)
      }
    }
  })

  it('keeps each exam bank between 40 and 50 questions with three difficulty levels', () => {
    for (const exam of EXAMS) {
      const questions = questionsForExam(exam.id)
      expect(questions.length, exam.id).toBeGreaterThanOrEqual(40)
      expect(questions.length, exam.id).toBeLessThanOrEqual(50)

      const levels = new Set(questions.map((question) => question.difficulty))
      expect(levels, exam.id).toEqual(new Set(['easy', 'moderate', 'difficult']))
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
