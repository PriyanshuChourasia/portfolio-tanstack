import { TOPICS_BY_SUBJECT } from './types'
import type {
  ExamDefinition,
  ExamId,
  Question,
  QuestionTopic,
  Subject,
  TestPreset,
} from './types'
import { sscChslQuestions } from './ssc-chsl'
import { sbiPoQuestions } from './sbi-po'
import { ibpsPoQuestions } from './ibps-po'
import { analogyPracticeQuestions } from './analogy-practice'
import { sbiEnglishQuestions } from './sbi-english'

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
 *  - SBI PO / SBI Clerk Prelims: English 30 questions in 20 minutes, 1 mark each,
 *    −0.25 per wrong answer (both exams share the same English pattern).
 *
 * `ANALOGY_PRACTICE` is a single-topic practice paper, not an exam section: its
 * 100 questions climb through 10 levels and are served in order.
 */
export const EXAMS: ExamDefinition[] = [
  {
    id: 'SSC_CHSL',
    kind: 'exam',
    subject: 'reasoning',
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
    kind: 'exam',
    subject: 'reasoning',
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
    kind: 'exam',
    subject: 'reasoning',
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
  {
    id: 'ANALOGY_PRACTICE',
    kind: 'practice',
    subject: 'reasoning',
    sequential: true,
    name: 'Analogy Master Practice',
    shortName: 'Analogy',
    description:
      'A : B :: C : D — "A is related to B as C is related to D". 100 analogy questions in 10 levels, from word pairs to number, letter, alpha-numeric, figural and multi-step patterns.',
    patternNote: '100 questions · 10 levels · 1 mark each · −0.25 for a wrong answer',
    difficultyLabel: 'Basic to Very Difficult',
    marking: { positiveMarks: 1, negativeMarks: 0.25 },
    defaultDurationMinutes: 40,
    defaultQuestionCount: 50,
    accent: 'from-fuchsia-500/20 to-violet-500/5',
  },
  {
    id: 'SBI_ENGLISH',
    kind: 'exam',
    subject: 'english',
    name: 'SBI PO / Clerk English (Prelims)',
    shortName: 'SBI PO/Clerk',
    description:
      'English Language section of SBI PO and SBI Clerk Prelims — reading comprehension, cloze test, error spotting, phrase replacement, fillers, para jumbles, word swap and vocabulary.',
    patternNote: '30 English questions · 20 minutes · 1 mark each · −0.25 for a wrong answer',
    difficultyLabel: 'Easy to Moderate',
    marking: { positiveMarks: 1, negativeMarks: 0.25 },
    defaultDurationMinutes: 20,
    defaultQuestionCount: 30,
    accent: 'from-rose-500/20 to-pink-500/5',
  },
]

export const SUBJECT_LABELS: Record<Subject, string> = {
  reasoning: 'Reasoning',
  english: 'English',
}

const QUESTION_BANK: Record<ExamId, Question[]> = {
  SSC_CHSL: sscChslQuestions,
  SBI_PO: sbiPoQuestions,
  IBPS_PO: ibpsPoQuestions,
  ANALOGY_PRACTICE: analogyPracticeQuestions,
  SBI_ENGLISH: sbiEnglishQuestions,
}

export const ALL_REASONING_QUESTIONS: Question[] = EXAMS.flatMap((exam) => QUESTION_BANK[exam.id])

export const TEST_PRESETS: TestPreset[] = EXAMS.flatMap((exam) => {
  const available = QUESTION_BANK[exam.id].length
  const topics = topicsForExam(exam.id)
  const label = `${exam.shortName} ${SUBJECT_LABELS[exam.subject]}`
  const presets: TestPreset[] = [
    {
      id: `${exam.id.toLowerCase()}-quick`,
      examId: exam.id,
      title: `${label} — Quick 15`,
      durationMinutes: 12,
      totalQuestions: Math.min(15, available),
      difficulty: 'mixed',
      topics,
    },
    {
      id: `${exam.id.toLowerCase()}-standard`,
      examId: exam.id,
      title: `${label} — Full Mock`,
      durationMinutes: exam.defaultDurationMinutes,
      totalQuestions: Math.min(exam.defaultQuestionCount, available),
      difficulty: 'mixed',
      topics,
    },
    {
      id: `${exam.id.toLowerCase()}-full-bank`,
      examId: exam.id,
      title: `${label} — Complete Bank (${available} Q)`,
      durationMinutes: available > 50 ? Math.ceil(available * 0.75) : available > 30 ? 40 : 30,
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
export function topicsForExam(examId: ExamId): QuestionTopic[] {
  const present = new Set(QUESTION_BANK[examId].map((question) => question.topic))
  return TOPICS_BY_SUBJECT[getExam(examId).subject].filter((topic) => present.has(topic))
}

export function getQuestionById(questionId: string): Question | undefined {
  return ALL_REASONING_QUESTIONS.find((question) => question.id === questionId)
}

export { sscChslQuestions, sbiPoQuestions, ibpsPoQuestions, analogyPracticeQuestions, sbiEnglishQuestions }
export * from './types'
