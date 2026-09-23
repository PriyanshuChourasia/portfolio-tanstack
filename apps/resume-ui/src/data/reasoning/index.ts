import { REASONING_TOPICS } from './types'
import type {
  ExamDefinition,
  ExamId,
  Question,
  ReasoningTopic,
  TestPreset,
} from './types'
import { sscChslQuestions } from './ssc-chsl'
import { sbiPoQuestions } from './sbi-po'
import { ibpsPoQuestions } from './ibps-po'

/**
 * Exam metadata + ready-made paper presets.
 *
 * Adding a new exam is a three-step change: write a bank file, register it in
 * `QUESTION_BANK`, and add an `ExamDefinition` + presets below. Nothing else in the
 * engine or UI needs to change.
 *
 * Marking schemes and section sizes follow the current prelims patterns:
 *  - SSC CHSL Tier-1: reasoning 25 questions, 2 marks each, −0.50 per wrong answer.
 *  - SBI PO Prelims: reasoning 35 questions, 1 mark each, −0.25 per wrong answer.
 *  - IBPS PO Prelims: reasoning 35 questions, 1 mark each, −0.25 per wrong answer.
 */
export const EXAMS: ExamDefinition[] = [
  {
    id: 'SSC_CHSL',
    name: 'SSC CHSL (Tier-1)',
    shortName: 'SSC CHSL',
    description:
      'General Intelligence & Reasoning section of the SSC CHSL Tier-1 exam — series, coding, analogy, syllogism and easy-to-moderate puzzles.',
    patternNote: '25 reasoning questions · 2 marks each · −0.50 for a wrong answer',
    difficultyLabel: 'Easy to Moderate',
    marking: { positiveMarks: 2, negativeMarks: 0.5 },
    defaultDurationMinutes: 20,
    defaultQuestionCount: 25,
    accent: 'from-amber-500/20 to-orange-500/5',
  },
  {
    id: 'SBI_PO',
    name: 'SBI PO (Prelims)',
    shortName: 'SBI PO',
    description:
      'Reasoning Ability section of SBI PO Prelims — puzzle-heavy with seating, floor/box arrangements, inequality and multi-step series.',
    patternNote: '35 reasoning questions · 1 mark each · −0.25 for a wrong answer',
    difficultyLabel: 'Moderate to Difficult',
    marking: { positiveMarks: 1, negativeMarks: 0.25 },
    defaultDurationMinutes: 25,
    defaultQuestionCount: 35,
    accent: 'from-sky-500/20 to-indigo-500/5',
  },
  {
    id: 'IBPS_PO',
    name: 'IBPS PO (Prelims)',
    shortName: 'IBPS PO',
    description:
      'Reasoning Ability section of IBPS PO Prelims — coded language, arrangements, data sufficiency and statement-based logic.',
    patternNote: '35 reasoning questions · 1 mark each · −0.25 for a wrong answer',
    difficultyLabel: 'Moderate to Difficult',
    marking: { positiveMarks: 1, negativeMarks: 0.25 },
    defaultDurationMinutes: 25,
    defaultQuestionCount: 35,
    accent: 'from-emerald-500/20 to-teal-500/5',
  },
]

const QUESTION_BANK: Record<ExamId, Question[]> = {
  SSC_CHSL: sscChslQuestions,
  SBI_PO: sbiPoQuestions,
  IBPS_PO: ibpsPoQuestions,
}

export const ALL_REASONING_QUESTIONS: Question[] = EXAMS.flatMap((exam) => QUESTION_BANK[exam.id])

export const TEST_PRESETS: TestPreset[] = EXAMS.flatMap((exam) => {
  const available = QUESTION_BANK[exam.id].length
  const topics = topicsForExam(exam.id)
  const presets: TestPreset[] = [
    {
      id: `${exam.id.toLowerCase()}-quick`,
      examId: exam.id,
      title: `${exam.shortName} Reasoning — Quick 15`,
      durationMinutes: 12,
      totalQuestions: Math.min(15, available),
      difficulty: 'mixed',
      topics,
    },
    {
      id: `${exam.id.toLowerCase()}-standard`,
      examId: exam.id,
      title: `${exam.shortName} Reasoning — Full Mock`,
      durationMinutes: exam.defaultDurationMinutes,
      totalQuestions: Math.min(exam.defaultQuestionCount, available),
      difficulty: 'mixed',
      topics,
    },
    {
      id: `${exam.id.toLowerCase()}-full-bank`,
      examId: exam.id,
      title: `${exam.shortName} Reasoning — Complete Bank (${available} Q)`,
      durationMinutes: available > 30 ? 40 : 30,
      totalQuestions: available,
      difficulty: 'mixed',
      topics,
    },
  ]
  return presets
})

export function getExam(examId: ExamId): ExamDefinition {
  const exam = EXAMS.find((item) => item.id === examId)
  if (!exam) throw new Error(`Unknown exam: ${examId}`)
  return exam
}

export function getTestPreset(testId: string): TestPreset | undefined {
  return TEST_PRESETS.find((preset) => preset.id === testId)
}

export function questionsForExam(examId: ExamId): Question[] {
  return QUESTION_BANK[examId]
}

/** Topics that actually have questions for the given exam (drives the config UI). */
export function topicsForExam(examId: ExamId): ReasoningTopic[] {
  const present = new Set(QUESTION_BANK[examId].map((question) => question.topic))
  return REASONING_TOPICS.filter((topic) => present.has(topic))
}

export function getQuestionById(questionId: string): Question | undefined {
  return ALL_REASONING_QUESTIONS.find((question) => question.id === questionId)
}

export { sscChslQuestions, sbiPoQuestions, ibpsPoQuestions }
export * from './types'
