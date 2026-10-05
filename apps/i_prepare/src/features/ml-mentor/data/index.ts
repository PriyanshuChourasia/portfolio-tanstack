import type {
  AssessmentKind,
  BaselineEvaluation,
  InterviewQuestion,
  MLModule,
  QuizQuestion,
  StartingLevel,
} from '../types'
import { MODULE_01, MODULE_02, MODULE_03 } from './syllabus-a'
import { MODULE_04, MODULE_05, MODULE_06 } from './syllabus-b'
import { MODULE_07, MODULE_08, MODULE_09, MODULE_10 } from './syllabus-c'
import { MODULE_11, MODULE_12 } from './syllabus-d'
import { MODULE_13, MODULE_14 } from './syllabus-e'
import { MODULE_15 } from './syllabus-f'
import { BASELINE_QUESTIONS } from './quiz-baseline'
import { QUIZ_M01, QUIZ_M02, QUIZ_M03, QUIZ_M04, QUIZ_M05, QUIZ_M06 } from './quiz-modules-a'
import { QUIZ_M07, QUIZ_M08, QUIZ_M09, QUIZ_M10, QUIZ_M11, QUIZ_M12 } from './quiz-modules-b'
import { QUIZ_M13, QUIZ_M14, QUIZ_M15, QUIZ_M16, QUIZ_M17 } from './quiz-modules-c'
import {
  INTERVIEW_M01,
  INTERVIEW_M02,
  INTERVIEW_M03,
  INTERVIEW_M04,
  INTERVIEW_M05,
  INTERVIEW_M06,
} from './quiz-modules-c'
import { INTERVIEW_M07, INTERVIEW_M08, INTERVIEW_M09, INTERVIEW_M10, INTERVIEW_M11, INTERVIEW_M12, INTERVIEW_M13, INTERVIEW_M14 } from './interview-a'
import { INTERVIEW_CROSS } from './interview-cross'

/** Module 16 — the question bank becomes the syllabus itself. */
export const MODULE_16: MLModule = {
  id: 'm16',
  number: 16,
  title: 'ML Interview Preparation',
  shortTitle: 'Interview Prep',
  tagline: 'Every category, every difficulty — the bank you drill against.',
  interviewGoal:
    'Answer fundamentals, statistics, algorithms, practical and scenario questions with structured, natural explanations.',
  topics: [
    {
      id: 't16-01',
      title: 'Fundamentals, Statistics & Algorithms Rounds',
      summary: 'Definitions, probability puzzles and algorithm comparisons on demand.',
      lesson: [
        'The fundamentals round expects crisp definitions: what is ML, supervised vs unsupervised, bias vs variance, overfitting vs underfitting, precision vs recall, L1 vs L2. Answer with definition + one example + one contrast — thirty seconds each, no rambling.',
        'The statistics round: probability basics, conditional probability and Bayes, distributions, CLT, the 68-95-99.7 rule. Practise by narrating the arithmetic aloud — interviewers grade the reasoning path as much as the number.',
        'The algorithms round: for each algorithm know intuition → mechanics → parameters → pros/cons → when-to-use. Comparisons are favourite questions: RF vs XGBoost, KNN vs SVM, L1 vs L2, accuracy vs PR-AUC.',
      ],
      intuition: 'Interview rounds are genre conventions — each has its own shape; drill the shape and the content lands.',
      keyPoints: [
        'Definition + example + contrast is the universal answer frame',
        'Narrate probability arithmetic aloud',
        'Know each algorithm’s when-to-use story cold',
      ],
      exampleCode: undefined,
      practiceExercise:
        'Using the Interview tab: run one Fundamentals, one Statistics and one Algorithms question at Intermediate difficulty. Score yourself against the rubric and note gaps.',
      codingTask: undefined,
    },
    {
      id: 't16-02',
      title: 'Practical, Scenario & Coding Rounds',
      summary: 'Dataset war stories, “what would you investigate” and live code.',
      lesson: [
        'The practical round asks about dataset problems: missing values, leakage, imbalance, drift — always answer with a diagnosis step before a fix.',
        'The scenario round (“95% accuracy but production is bad — investigate?”) rewards a systematic order: leakage → drift → metric mismatch → serving skew. Practise saying the order, not just the items.',
        'The coding round: pandas manipulations (groupby, merge, boolean filtering), NumPy vectorisation, implementing metrics from scratch (accuracy, precision, recall, RMSE). Narrate as you write; state edge cases before the interviewer asks.',
      ],
      intuition: 'Scenario questions are structured walks, not trivia: the order of investigation IS the answer.',
      keyPoints: [
        'Diagnose before fixing in every practical answer',
        'Scenario answers follow a fixed investigation order',
        'Coding answers: narrate, then state edge cases',
      ],
      exampleCode: undefined,
      practiceExercise:
        'Run two Scenario questions and one Coding question from the Interview tab at Advanced difficulty. Compare your structure against the model answers’ ordering.',
      codingTask: undefined,
    },
  ],
}

/** Module 17 — mock interviews conducted in the Interview tab. */
export const MODULE_17: MLModule = {
  id: 'm17',
  number: 17,
  title: 'Mock Interviews',
  shortTitle: 'Mock Interviews',
  tagline: 'Timed one-question-at-a-time rounds with scoring after every answer.',
  interviewGoal:
    'Sustain composure and structure across a full difficulty ladder, from Beginner to Advanced.',
  topics: [
    {
      id: 't17-01',
      title: 'The Difficulty Ladder',
      summary: 'Beginner → Junior → Intermediate → Advanced, one question at a time.',
      lesson: [
        'A mock interview serves one question at a time; you write your answer BEFORE the model answer is revealed. After each answer you self-score 0–10 against the rubric and read the follow-up question you would have faced next.',
        'Ladder protocol: start at your comfortable level minus one; escalate when you score 7+ consistently. The session records your average score, per-category breakdown and weakest question for the revision queue.',
        'What “good” sounds like: answer in three beats — direct answer, mechanism, example/contrast. Avoid textbook recitation; interviewers probe for understanding through follow-ups, and the rubric is written to reward the three-beat shape.',
      ],
      intuition: 'Mock interviews train retrieval under mild pressure — the same muscle as the real room, without the stakes.',
      keyPoints: [
        'Answer first, reveal second — no peeking',
        'Self-score against the rubric honestly',
        'Three beats: answer → mechanism → example',
        'Escalate difficulty only after consistent 7+ scores',
      ],
      exampleCode: undefined,
      practiceExercise:
        'Run one full mock at Beginner, then Junior. Log your average scores; if both are ≥7, take the Intermediate round.',
      codingTask: undefined,
    },
  ],
}

export const ML_MODULES: MLModule[] = [
  MODULE_01,
  MODULE_02,
  MODULE_03,
  MODULE_04,
  MODULE_05,
  MODULE_06,
  MODULE_07,
  MODULE_08,
  MODULE_09,
  MODULE_10,
  MODULE_11,
  MODULE_12,
  MODULE_13,
  MODULE_14,
  MODULE_15,
  MODULE_16,
  MODULE_17,
]

/* ── Lookups ───────────────────────────────────────────────────────────────── */

export function getModule(moduleId: string): MLModule | undefined {
  return ML_MODULES.find((m) => m.id === moduleId)
}

export function allTopics(): Array<{ module: MLModule; topic: MLModule['topics'][number] }> {
  return ML_MODULES.flatMap((module) => module.topics.map((topic) => ({ module, topic })))
}

export function getTopic(topicId: string) {
  return allTopics().find((entry) => entry.topic.id === topicId)
}

/** Module id → its test questions. */
export const MODULE_QUIZZES: Record<string, QuizQuestion[]> = {
  m01: QUIZ_M01,
  m02: QUIZ_M02,
  m03: QUIZ_M03,
  m04: QUIZ_M04,
  m05: QUIZ_M05,
  m06: QUIZ_M06,
  m07: QUIZ_M07,
  m08: QUIZ_M08,
  m09: QUIZ_M09,
  m10: QUIZ_M10,
  m11: QUIZ_M11,
  m12: QUIZ_M12,
  m13: QUIZ_M13,
  m14: QUIZ_M14,
  m15: QUIZ_M15,
  m16: QUIZ_M16,
  m17: QUIZ_M17,
}

export function questionsForModule(moduleId: string): QuizQuestion[] {
  return MODULE_QUIZZES[moduleId] ?? []
}

export function questionsForTopic(topicId: string): QuizQuestion[] {
  const moduleId = topicId.slice(0, 3)
  return questionsForModule(moduleId).filter((q) => q.topicId === topicId)
}

const INTERVIEW_BANKS: Array<InterviewQuestion[]> = [
  INTERVIEW_M01,
  INTERVIEW_M02,
  INTERVIEW_M03,
  INTERVIEW_M04,
  INTERVIEW_M05,
  INTERVIEW_M06,
  INTERVIEW_M07,
  INTERVIEW_M08,
  INTERVIEW_M09,
  INTERVIEW_M10,
  INTERVIEW_M11,
  INTERVIEW_M12,
  INTERVIEW_M13,
  INTERVIEW_M14,
  INTERVIEW_CROSS,
]

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = INTERVIEW_BANKS.flat()

export function interviewQuestionsForModule(moduleId: string): InterviewQuestion[] {
  return INTERVIEW_QUESTIONS.filter((q) => q.moduleId === moduleId)
}

export function getInterviewQuestion(id: string): InterviewQuestion | undefined {
  return INTERVIEW_QUESTIONS.find((q) => q.id === id)
}

export { BASELINE_QUESTIONS }

/* ── Baseline evaluation → level + starting module ─────────────────────────── */

/**
 * Maps the baseline score to a level, starting module and weak areas.
 * `missedTopicIds` are the topics behind questions the learner answered wrong.
 */
export function evaluateBaseline(
  correctCount: number,
  total: number,
  missedTopicIds: string[],
): BaselineEvaluation {
  const pct = total > 0 ? (correctCount / total) * 100 : 0

  let level: StartingLevel = 'complete_beginner'
  let startingModuleId = 'm01'
  const notes: string[] = []

  if (pct >= 80) {
    level = 'intermediate'
    startingModuleId = 'm11'
    notes.push('Strong command of fundamentals — starting from model evaluation and moving fast.')
  } else if (pct >= 60) {
    level = 'advanced_beginner'
    startingModuleId = 'm05'
    notes.push('Good foundations — starting from ML fundamentals to solidify core interview concepts.')
  } else if (pct >= 35) {
    level = 'beginner'
    startingModuleId = 'm03'
    notes.push('Some prior exposure — starting from data preprocessing, with maths and Python revision woven in.')
  } else {
    notes.push('Starting from the very beginning: Python first, then maths, then ML.')
  }

  // Weak areas: every baseline topic measured by a question that was missed.
  const weakAreas = [...new Set(missedTopicIds)].filter(Boolean)
  return { level, startingModuleId, weakAreas, notes }
}

export type { AssessmentKind, BaselineEvaluation, StartingLevel }
