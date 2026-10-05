import { describe, expect, it } from 'vitest'
import { MODULE_TEST_PASS_PERCENTAGE } from '../types'
import type { AssessmentQuestionResult, AssessmentResult } from '../../types'
import {
  emptyProgress,
  hydrateProgress,
  applyAssessment,
  applyBaseline,
  isModuleUnlocked,
  moduleSummaries,
  computeWeakTopics,
  nextTopicInModule,
  overallCompletion,
  markTopicStep,
} from '../progress'
import {
  buildAssessmentResult,
  buildDailySession,
  buildMockInterview,
  isCorrect,
  percentageToScore,
  topicScoresFromResults,
} from '../scoring'
import { evaluateBaseline, getModule, ML_MODULES, questionsForModule } from '../../data'
import { shuffle } from '../random'

/* ── Scoring ───────────────────────────────────────────────────────────────── */

describe('percentageToScore', () => {
  it('maps percentages onto the 0–10 scale', () => {
    expect(percentageToScore(0)).toBe(0)
    expect(percentageToScore(50)).toBe(5)
    expect(percentageToScore(85)).toBe(9) // 8.5 rounds to 9
    expect(percentageToScore(100)).toBe(10)
  })

  it('clamps out-of-range input', () => {
    expect(percentageToScore(-20)).toBe(0)
    expect(percentageToScore(140)).toBe(10)
  })
})

describe('isCorrect', () => {
  it('requires a non-null selection matching the answer index', () => {
    expect(isCorrect({ answerIndex: 2 }, 2)).toBe(true)
    expect(isCorrect({ answerIndex: 2 }, 1)).toBe(false)
    expect(isCorrect({ answerIndex: 2 }, null)).toBe(false)
  })
})

describe('buildAssessmentResult', () => {
  it('grades selections and computes per-topic scores', () => {
    const questions = [
      { id: 'q1', topicId: 't01-01' },
      { id: 'q2', topicId: 't01-02' },
      { id: 'q3', topicId: 't01-02' },
    ]
    const result = buildAssessmentResult(
      'module_test',
      'm01',
      questions,
      { q1: 0, q2: 1, q3: null },
      { q1: 0, q2: 2, q3: 1 },
    )
    expect(result.correctCount).toBe(1)
    expect(result.totalQuestions).toBe(3)
    expect(result.percentage).toBe(33)
    expect(result.passed).toBe(false) // below 70%
    expect(result.topicScores['t01-01']).toBe(10)
    expect(result.topicScores['t01-02']).toBe(0)
    expect(result.questionResults[2].selectedIndex).toBeNull()
  })
})

describe('topicScoresFromResults', () => {
  it('is a percentage-based score per topic', () => {
    const perTopic = { 't01-01': { correct: 3, total: 4 } }
    const scores = topicScoresFromResults([], perTopic)
    expect(scores['t01-01']).toBe(8) // 75% → 8 (7.5 rounds up)
  })
})

/* ── Baseline placement ────────────────────────────────────────────────────── */

describe('evaluateBaseline', () => {
  it('places strong learners at m11 / intermediate', () => {
    const evaluation = evaluateBaseline(9, 10, ['t02-01'])
    expect(evaluation.level).toBe('intermediate')
    expect(evaluation.startingModuleId).toBe('m11')
    expect(evaluation.weakAreas).toEqual(['t02-01'])
  })

  it('places mid learners at m05 and weaker ones at m03', () => {
    expect(evaluateBaseline(7, 10, []).startingModuleId).toBe('m05')
    expect(evaluateBaseline(5, 10, []).startingModuleId).toBe('m03')
  })

  it('places beginners at m01 and dedupes weak areas', () => {
    const evaluation = evaluateBaseline(2, 10, ['t01-01', 't01-01', 't03-02'])
    expect(evaluation.startingModuleId).toBe('m01')
    expect(evaluation.level).toBe('complete_beginner')
    expect(evaluation.weakAreas).toEqual(['t01-01', 't03-02'])
  })
})

/* ── Progress engine ───────────────────────────────────────────────────────── */

describe('emptyProgress / hydrateProgress', () => {
  it('creates a not-started state for all 17 modules', () => {
    const progress = emptyProgress()
    expect(Object.keys(progress.modules)).toHaveLength(17)
    expect(progress.currentModuleId).toBe('m01')
    expect(progress.baselineDone).toBe(false)
  })

  it('merges stored progress over defaults and repairs bad module ids', () => {
    const stored = emptyProgress()
    stored.topics['t01-01'] = { ...stored.topics['t01-01'], lessonRead: true, score: 9 }
    stored.currentModuleId = 'm99'
    const hydrated = hydrateProgress(stored)
    expect(hydrated.topics['t01-01'].lessonRead).toBe(true)
    expect(hydrated.currentModuleId).toBe('m01')
  })

  it('returns a fresh state when nothing is stored', () => {
    expect(hydrateProgress(null).baselineDone).toBe(false)
  })
})

describe('applyAssessment', () => {
  it('raises module test stats and keeps best score', () => {
    let progress = emptyProgress()
    const result = buildAssessmentResult(
      'module_test',
      'm01',
      questionsForModule('m01').map((q) => ({ id: q.id, topicId: q.topicId })),
      Object.fromEntries(questionsForModule('m01').map((q) => [q.id, q.answerIndex])),
      Object.fromEntries(questionsForModule('m01').map((q) => [q.id, q.answerIndex])),
    )
    progress = applyAssessment(progress, result)
    expect(progress.modules.m01.testAttempts).toBe(1)
    expect(progress.modules.m01.bestTestPercentage).toBe(100)
    expect(progress.baselineDone).toBe(false)
  })
})

describe('module flow', () => {
  it('starts locked beyond m01 and unlocks after a pass', () => {
    const progress = emptyProgress()
    expect(isModuleUnlocked(progress, 'm01')).toBe(true)
    expect(isModuleUnlocked(progress, 'm02')).toBe(false)

    const passed = applyAssessment(
      progress,
      fakeModuleResult('m01', 100),
    )
    expect(isModuleUnlocked(passed, 'm02')).toBe(true)
  })

  it('summarises modules and computes weak areas after a failed test', () => {
    let progress = applyBaseline(emptyProgress(), {
      level: 'beginner',
      startingModuleId: 'm01',
      weakAreas: [],
      notes: [],
    })
    expect(progress.baselineDone).toBe(true)

    progress = applyAssessment(progress, fakeModuleResult('m01', 30))
    const summary = moduleSummaries(progress).find((m) => m.module.id === 'm01')
    expect(summary?.status).toBe('needs_revision')
    expect(summary?.testAttempts).toBe(1)

    const weak = computeWeakTopics(progress)
    expect(weak.length).toBeGreaterThan(0)
    expect(weak[0].reason).toBe('failed_test')
  })

  it('marks completion overall only when topics complete', () => {
    const progress = emptyProgress()
    expect(overallCompletion(progress)).toBe(0)
  })
})

describe('markTopicStep / nextTopicInModule', () => {
  it('marks steps and moves the daily pointer to the first unfinished topic', () => {
    let progress = emptyProgress()
    progress = markTopicStep(progress, 't01-01', 'lessonRead')
    expect(progress.topics['t01-01'].lessonRead).toBe(true)
    expect(progress.topics['t01-01'].status).toBe('in_progress')

    const m01 = getModule('m01')!
    const secondTopic = m01.topics[1]
    expect(nextTopicInModule(m01, progress).id).toBe(secondTopic.id)
  })
})

/* ── Daily session + mock interviews ───────────────────────────────────────── */

describe('buildDailySession', () => {
  it('builds a session for the given topic with exercise + questions', () => {
    const session = buildDailySession('m01', 't01-01', ['Some earlier topic'])
    expect(session.moduleId).toBe('m01')
    expect(session.topicId).toBe('t01-01')
    expect(session.exercise.length).toBeGreaterThan(0)
    expect(session.completed).toBe(false)
    expect(session.revisionPrompts.length).toBeLessThanOrEqual(2)
  })
})

describe('buildMockInterview', () => {
  it('creates an active 4–6 question session with answers pre-created', () => {
    const mock = buildMockInterview('Intermediate', null)
    expect(mock.status).toBe('active')
    expect(mock.questionIds.length).toBeGreaterThanOrEqual(4)
    expect(mock.questionIds.length).toBeLessThanOrEqual(6)
    expect(Object.keys(mock.answers)).toHaveLength(mock.questionIds.length)
    for (const id of mock.questionIds) {
      expect(mock.answers[id]).toMatchObject({ questionId: id, attempt: '', score: null })
    }
  })

  it('ladders difficulty upward and marks escalation', () => {
    const mock = buildMockInterview('Beginner', null)
    const ranks = mock.questionIds.map((id) => difficultyRankOf(id))
    expect(mock.escalated).toBe(true)
    // Non-decreasing difficulty ladder.
    for (let i = 1; i < ranks.length; i += 1) {
      expect(ranks[i]).toBeGreaterThanOrEqual(ranks[i - 1])
    }
  })

  it('respects a focused module when the bank allows it', () => {
    const mock = buildMockInterview('Intermediate', 'm01')
    expect(mock.questionIds.length).toBeGreaterThan(0)
    for (const id of mock.questionIds) {
      const question = INTERVIEW_BY_ID[id]
      expect(question).toBeDefined()
      expect(question.moduleId === 'm01' || question.moduleId === null).toBe(true)
    }
  })
})

/* ── Data invariants ───────────────────────────────────────────────────────── */

describe('syllabus data', () => {
  it('has 17 modules with unique topic ids carrying the module prefix', () => {
    expect(ML_MODULES).toHaveLength(17)
    const ids = new Set<string>()
    for (const module of ML_MODULES) {
      expect(module.id).toBe(`m${String(module.number).padStart(2, '0')}`)
      for (const topic of module.topics) {
        expect(ids.has(topic.id)).toBe(false)
        ids.add(topic.id)
        expect(topic.id.startsWith(`${module.id.slice(0, 1)}${module.id.slice(1, 3)}-`)).toBe(true)
      }
    }
  })

  it('every module has a test bank, every quiz maps to a real topic', () => {
    for (const module of ML_MODULES) {
      const quiz = questionsForModule(module.id)
      expect(quiz.length).toBeGreaterThan(0)
      const topicIds = new Set(module.topics.map((t) => t.id))
      for (const question of quiz) {
        expect(topicIds.has(question.topicId)).toBe(true)
        expect(question.answerIndex).toBeGreaterThanOrEqual(0)
        expect(question.answerIndex).toBeLessThan(question.options.length)
      }
    }
  })
})

describe('shuffle', () => {
  it('keeps every element exactly once', () => {
    const input = [1, 2, 3, 4, 5]
    expect(shuffle(input, () => 0)).toEqual([1, 2, 3, 4, 5])
    const shuffled = shuffle(input, () => 0.999)
    expect([...shuffled].sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5])
  })
})

/* ── Test helpers ──────────────────────────────────────────────────────────── */

const DIFFICULTY_RANK = { Beginner: 0, Junior: 1, Intermediate: 2, Advanced: 3 } as const

const INTERVIEW_BY_ID: Record<string, { moduleId: string | null; difficulty: keyof typeof DIFFICULTY_RANK }> = {}

// Fill lazily from the data module (kept out of module scope to avoid cycles in some bundlers).
import { INTERVIEW_QUESTIONS } from '../../data'
for (const question of INTERVIEW_QUESTIONS) {
  INTERVIEW_BY_ID[question.id] = {
    moduleId: question.moduleId,
    difficulty: question.difficulty,
  }
}

function difficultyRankOf(questionId: string): number {
  return DIFFICULTY_RANK[INTERVIEW_BY_ID[questionId].difficulty]
}

function fakeModuleResult(moduleId: string, percentage: number): AssessmentResult {
  const topics = getModule(moduleId)!.topics
  const questionResults: AssessmentQuestionResult[] = topics.map((topic) => ({
    questionId: `fake-${topic.id}`,
    topicId: topic.id,
    selectedIndex: percentage >= 50 ? 0 : null,
    correct: percentage >= MODULE_TEST_PASS_PERCENTAGE,
  }))
  return {
    id: `fake-${moduleId}-${percentage}`,
    kind: 'module_test',
    moduleId,
    submittedAt: new Date().toISOString(),
    correctCount: percentage >= MODULE_TEST_PASS_PERCENTAGE ? topics.length : 0,
    totalQuestions: topics.length,
    percentage,
    topicScores: {},
    passed: percentage >= MODULE_TEST_PASS_PERCENTAGE,
    questionResults,
  }
}
