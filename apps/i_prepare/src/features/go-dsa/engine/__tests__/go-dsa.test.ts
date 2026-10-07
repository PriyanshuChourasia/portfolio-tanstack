import { describe, expect, it } from 'vitest'
import { MODULES, PRODUCTION_PROBLEMS, WEEKLY_CHALLENGES, allProblems, getModule, getProblem, getTopic, totals } from '../../data'
import type { GoDsaState, ProblemAttempt } from '../../types'
import { TOPICS_PER_REVISION } from '../../types'
import {
  completedTopicCount,
  emptyAttempt,
  emptyState,
  hydrateState,
  isProblemUnlocked,
  nextTopic,
  revisionsDue,
  solutionUnlocked,
  topicRows,
  topicStatus,
} from '../progress'
import { buildExam, buildReviewPrompt, buildRevision, gradeExam, interviewCandidates } from '../sessions'
import { mulberry32 } from '../random'

function done(problemId: string, score = 8): ProblemAttempt {
  return { ...emptyAttempt(problemId), attempts: 1, score }
}

function completeTopic(state: GoDsaState, topicId: string, score = 8): GoDsaState {
  const topic = getTopic(topicId)!.topic
  const attempts = { ...state.attempts }
  for (const p of topic.problems) attempts[p.id] = done(p.id, score)
  return { ...state, attempts }
}

/* ── Data integrity ────────────────────────────────────────────────────────── */

describe('syllabus data', () => {
  it('covers all 33 modules in order with unique ids', () => {
    expect(MODULES).toHaveLength(33)
    MODULES.forEach((m, i) => expect(m.number).toBe(i + 1))
    const ids = allProblems().map((e) => e.problem.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('gives every topic at least 3 problems with hints and a solution', () => {
    for (const m of MODULES) {
      for (const t of m.topics) {
        expect(t.problems.length, t.id).toBeGreaterThanOrEqual(3)
        expect(t.problems[0].tier, t.id).toBe('foundation')
        for (const p of t.problems) {
          expect(p.id.startsWith(t.id), p.id).toBe(true)
          expect(p.hints.length, p.id).toBeGreaterThan(0)
          expect(p.solution.trim().length, p.id).toBeGreaterThan(0)
          if (p.check) {
            expect(p.check.answerIndex, p.id).toBeLessThan(p.check.options.length)
          }
        }
      }
    }
  })

  it('splits the tracks: Go 1–17, DSA 18–33', () => {
    expect(MODULES.filter((m) => m.track === 'go')).toHaveLength(17)
    expect(MODULES.filter((m) => m.track === 'dsa')).toHaveLength(16)
  })

  it('starts the course with variables, constants, types, zero values, inference and conversion', () => {
    expect(getModule('m01')!.topics[0].title).toMatch(/Variables, Constants, Types, Zero Values/)
  })

  it('links weekly challenges to existing modules and has production problems', () => {
    for (const c of WEEKLY_CHALLENGES) expect(getModule(c.afterModuleId), c.id).toBeDefined()
    expect(PRODUCTION_PROBLEMS.length).toBeGreaterThanOrEqual(10)
    expect(totals().problems).toBeGreaterThan(200)
  })
})

/* ── Progress ──────────────────────────────────────────────────────────────── */

describe('progress', () => {
  it('hydrates garbage into a usable empty state', () => {
    expect(hydrateState(null)).toEqual(emptyState())
    expect(hydrateState({ attempts: 'nope', lessonsRead: ['m01-t1'] }).lessonsRead).toEqual(['m01-t1'])
  })

  it('unlocks problems one at a time', () => {
    const topic = getTopic('m01-t1')!.topic
    let state = emptyState()
    expect(isProblemUnlocked(topic, 0, state)).toBe(true)
    expect(isProblemUnlocked(topic, 1, state)).toBe(false)
    state = { ...state, attempts: { [topic.problems[0].id]: { ...emptyAttempt(topic.problems[0].id), attempts: 1 } } }
    expect(isProblemUnlocked(topic, 1, state)).toBe(true)
    expect(isProblemUnlocked(topic, 2, state)).toBe(false)
  })

  it('gates the solution behind reasonable effort', () => {
    const problem = getProblem('m01-t1-p2')!.problem
    expect(solutionUnlocked(problem, undefined)).toBe(false)
    const one = { ...emptyAttempt(problem.id), attempts: 1 }
    expect(solutionUnlocked(problem, one)).toBe(false)
    expect(solutionUnlocked(problem, { ...one, hintsRevealed: problem.hints.length })).toBe(true)
    expect(solutionUnlocked(problem, { ...one, attempts: 2 })).toBe(true)
  })

  it('moves topics through the status lifecycle', () => {
    let state = emptyState()
    const topic = getTopic('m01-t2')!.topic
    expect(topicStatus(topic, state)).toBe('not_started')
    state = { ...state, lessonsRead: ['m01-t2'] }
    expect(topicStatus(topic, state)).toBe('in_progress')
    expect(topicStatus(topic, completeTopic(state, 'm01-t2', 9))).toBe('completed')
    expect(topicStatus(topic, completeTopic(state, 'm01-t2', 3))).toBe('needs_revision')
  })

  it('suggests the first unfinished topic', () => {
    const state = completeTopic(emptyState(), 'm01-t1')
    expect(nextTopic(topicRows(state))!.topic.id).toBe('m01-t2')
  })
})

/* ── Revision, exam, interview ─────────────────────────────────────────────── */

describe('revision rounds', () => {
  it('become due after every 5 completed topics', () => {
    let state = emptyState()
    const ids = ['m01-t1', 'm01-t2', 'm01-t3', 'm01-t4', 'm01-t5']
    for (const id of ids.slice(0, 4)) state = completeTopic(state, id)
    expect(revisionsDue(topicRows(state), state)).toBe(0)
    state = completeTopic(state, ids[4])
    const rows = topicRows(state)
    expect(completedTopicCount(rows)).toBe(TOPICS_PER_REVISION)
    expect(revisionsDue(rows, state)).toBe(1)
  })

  it('composes 13 unique questions with the required mix', () => {
    const state = emptyState()
    const round = buildRevision(topicRows(state), state, mulberry32(42))
    expect(round.problemIds).toHaveLength(13)
    expect(new Set(round.problemIds).size).toBe(13)
    const kinds = round.problemIds.map((id) => getProblem(id)!.problem.kind)
    expect(kinds.filter((k) => k === 'debug').length).toBeGreaterThanOrEqual(2)
    expect(kinds.filter((k) => k === 'predict').length).toBeGreaterThanOrEqual(2)
  })
})

describe('exam mode', () => {
  it('builds a mixed, auto-gradable paper and scores it', () => {
    const exam = buildExam(mulberry32(7))
    expect(exam.problemIds.length).toBe(20)
    const modules = new Set(exam.problemIds.map((id) => getProblem(id)!.module!.id))
    expect(modules.size).toBeGreaterThan(10)
    const answers = Object.fromEntries(exam.problemIds.map((id) => [id, getProblem(id)!.problem.check!.answerIndex]))
    const graded = gradeExam({ ...exam, answers }, (id) => getProblem(id)?.problem)
    expect(graded.percentage).toBe(100)
    expect(gradeExam(exam, (id) => getProblem(id)?.problem).percentage).toBe(0)
  })
})

describe('interview + review prompt', () => {
  it('has coding candidates in both tracks', () => {
    expect(interviewCandidates('go').length).toBeGreaterThan(5)
    expect(interviewCandidates('dsa').length).toBeGreaterThan(20)
  })

  it('builds a review prompt that asks for hints, not solutions', () => {
    const problem = getProblem('m18-t1-p1')!.problem
    const prompt = buildReviewPrompt(problem, { ...emptyAttempt(problem.id), approach: 'track min', code: 'func X() {}', attempts: 1 }, 'Arrays')
    expect(prompt).toContain('do NOT give me the full solution')
    expect(prompt).toContain('func X() {}')
    expect(prompt).not.toContain(problem.solution)
  })
})
