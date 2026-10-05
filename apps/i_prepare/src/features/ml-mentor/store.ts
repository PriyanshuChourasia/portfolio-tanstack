import { create } from 'zustand'
import type {
  AssessmentResult,
  BaselineEvaluation,
  DailySession,
  InterviewAnswer,
  InterviewDifficulty,
  MockInterviewSession,
  ProgressState,
} from './types'
import {
  BASELINE_QUESTIONS,
  allTopics,
  evaluateBaseline,
  getModule,
  getInterviewQuestion,
  interviewQuestionsForModule,
  questionsForModule,
} from './data'
import {
  applyAssessment as applyAssessmentToProgress,
  applyBaseline as applyBaselineToProgress,
  computeWeakTopics,
  emptyProgress,
  hydrateProgress,
  markTopicStep as markTopicStepIn,
  moduleSummaries,
  nextTopicInModule,
} from './engine/progress'
import {
  buildAssessmentResult,
  buildDailySession,
  buildMockInterview,
} from './engine/scoring'
import { createMLStorage, ML_STORAGE_LABELS, type MLStorageKind } from './lib/storage'

/**
 * Single source of truth for the ML mentor. Every mutation persists immediately,
 * so progress, sessions and mock-interviews survive refreshes and crashes.
 */

export type MLMentorScreen =
  | 'dashboard'
  | 'baseline'
  | 'baseline_result'
  | 'module'
  | 'test'
  | 'test_result'
  | 'session'
  | 'session_result'
  | 'interview'
  | 'history'

export type MLSaveStatus = 'idle' | 'saving' | 'saved' | 'error'

interface MLKvState {
  screen: MLMentorScreen
  activeModuleId: string | null
  activeSessionId: string | null
  activeMockId: string | null
}

const KV_KEY = 'state'

interface MLMentorState {
  hydrated: boolean
  storageKind: MLStorageKind | null
  screen: MLMentorScreen
  progress: ProgressState
  activeModuleId: string | null
  activeTopicId: string | null
  /* assessment in progress */
  quiz: {
    kind: 'baseline' | 'module_test'
    moduleId: string | null
    questionIds: string[]
    selections: Record<string, number | null>
    index: number
  } | null
  lastAssessment: AssessmentResult | null
  assessments: AssessmentResult[]
  dailySession: DailySession | null
  mock: MockInterviewSession | null
  mockHistory: MockInterviewSession[]
  saveStatus: MLSaveStatus
  storageError: string | null

  hydrate: () => Promise<void>
  go: (screen: MLMentorScreen) => void
  openModule: (moduleId: string) => void
  openTopic: (topicId: string) => void
  markStep: (topicId: string, step: 'lessonRead' | 'practiceDone' | 'codingDone' | 'interviewDone') => void
  startBaseline: () => void
  selectBaselineOption: (questionId: string, index: number) => void
  nextBaselineQuestion: () => void
  previousBaselineQuestion: () => void
  submitBaseline: () => void
  /** Internal: applies the evaluated baseline to progress (used by submitBaseline). */
  acceptBaselineImpl: (evaluation: BaselineEvaluation) => void
  acceptBaseline: () => void
  startModuleTest: (moduleId: string) => void
  selectTestOption: (questionId: string, index: number) => void
  nextTestQuestion: () => void
  previousTestQuestion: () => void
  submitModuleTest: () => void
  startDailySession: () => void
  answerSessionQuestion: (questionId: string, index: number) => void
  nextSessionQuestion: () => void
  completeSession: () => void
  startMock: (difficulty: InterviewDifficulty, moduleId: string | null) => void
  setMockAttempt: (questionId: string, text: string) => void
  revealMockAnswer: (questionId: string, score: number) => void
  nextMockQuestion: () => void
  finishMock: () => void
  resetProgress: () => Promise<void>
}

type MLMentorStorage = Awaited<ReturnType<typeof createMLStorage>>

let storage: MLMentorStorage | null = null

function db(): MLMentorStorage {
  if (!storage) throw new Error('ML storage has not been initialised')
  return storage
}

async function writeProgress(progress: ProgressState): Promise<void> {
  try {
    await db().put('ml-progress', { key: 'progress', value: progress })
  } catch (error) {
    useMLMentorStore.setState({
      saveStatus: 'error',
      storageError: error instanceof Error ? error.message : 'Unable to save progress',
    })
  }
}

export const useMLMentorStore = create<MLMentorState>((set, get) => {
  async function persistKv(overrides: Partial<MLKvState> = {}): Promise<void> {
    const state = get()
    try {
      await db().put('ml-kv', {
        key: KV_KEY,
        value: {
          screen: state.screen,
          activeModuleId: state.activeModuleId,
          activeSessionId: state.dailySession?.id ?? null,
          activeMockId: state.mock?.status === 'active' ? state.mock.id : null,
          ...overrides,
        },
      })
    } catch {
      /* kv is a convenience pointer — progress itself is the source of truth */
    }
  }

  async function persistAssessment(result: AssessmentResult): Promise<void> {
    set({ saveStatus: 'saving' })
    try {
      await db().put('ml-assessments', result)
      set({ saveStatus: 'saved', storageError: null })
    } catch (error) {
      set({
        saveStatus: 'error',
        storageError: error instanceof Error ? error.message : 'Unable to save the assessment',
      })
    }
  }

  async function persistMock(mock: MockInterviewSession): Promise<void> {
    set({ saveStatus: 'saving' })
    try {
      await db().put('ml-interviews', mock)
      set({ saveStatus: 'saved', storageError: null })
    } catch (error) {
      set({
        saveStatus: 'error',
        storageError: error instanceof Error ? error.message : 'Unable to save the interview',
      })
    }
  }

  async function persistDaily(session: DailySession): Promise<void> {
    try {
      await db().put('ml-sessions', session)
    } catch {
      /* daily sessions are regenerable */
    }
  }

  return {
    hydrated: false,
    storageKind: null,
    screen: 'dashboard',
    progress: emptyProgress(),
    activeModuleId: null,
    activeTopicId: null,
    quiz: null,
    lastAssessment: null,
    assessments: [],
    dailySession: null,
    mock: null,
    mockHistory: [],
    saveStatus: 'idle',
    storageError: null,

    hydrate: async () => {
      if (get().hydrated) return
      const adapter = await createMLStorage()
      storage = adapter

      const [kvRecord, progressRecord, assessmentRecords, mockRecords] = await Promise.all([
        adapter.get<{ key: string; value: MLKvState }>('ml-kv', KV_KEY).catch(() => null),
        adapter.get<{ key: string; value: ProgressState }>('ml-progress', 'progress').catch(() => null),
        adapter.getAll<AssessmentResult>('ml-assessments').catch(() => []),
        adapter.getAll<MockInterviewSession>('ml-interviews').catch(() => []),
      ])

      const assessments = [...assessmentRecords].sort(
        (a, b) => Date.parse(b.submittedAt) - Date.parse(a.submittedAt),
      )
      const mockHistory = mockRecords
        .filter((mock) => mock.status === 'completed')
        .sort((a, b) => Date.parse(b.startedAt) - Date.parse(a.startedAt))
      const kv = kvRecord?.value ?? null

      set({
        hydrated: true,
        storageKind: adapter.kind,
        progress: hydrateProgress(progressRecord?.value ?? null),
        assessments,
        mockHistory,
        screen: 'dashboard',
        activeModuleId: kv?.activeModuleId ?? null,
      })
    },

    go: (screen) => {
      set({ screen })
      void persistKv({ screen })
    },

    openModule: (moduleId) => {
      set({ activeModuleId: moduleId, activeTopicId: null, screen: 'module' })
      void persistKv({ screen: 'module', activeModuleId: moduleId })
    },

    openTopic: (topicId) => {
      const moduleId = topicId.slice(0, 3)
      set({ activeModuleId: moduleId, activeTopicId: topicId, screen: 'module' })
      void persistKv({ screen: 'module', activeModuleId: moduleId })
    },

    markStep: (topicId, step) => {
      const progress = markTopicStepIn(get().progress, topicId, step)
      set({ progress })
      void writeProgress(progress)
    },

    /* ── Baseline ─────────────────────────────────────────────────────────── */

    startBaseline: () => {
      set({
        quiz: {
          kind: 'baseline',
          moduleId: null,
          questionIds: BASELINE_QUESTIONS.map((q) => q.id),
          selections: {},
          index: 0,
        },
        screen: 'baseline',
      })
      void persistKv({ screen: 'baseline' })
    },

    selectBaselineOption: (questionId, index) => {
      const quiz = get().quiz
      if (!quiz || quiz.kind !== 'baseline') return
      set({ quiz: { ...quiz, selections: { ...quiz.selections, [questionId]: index } } })
    },

    nextBaselineQuestion: () => {
      const quiz = get().quiz
      if (!quiz) return
      set({ quiz: { ...quiz, index: Math.min(quiz.index + 1, quiz.questionIds.length - 1) } })
    },

    previousBaselineQuestion: () => {
      const quiz = get().quiz
      if (!quiz) return
      set({ quiz: { ...quiz, index: Math.max(quiz.index - 1, 0) } })
    },

    submitBaseline: () => {
      const { quiz } = get()
      if (!quiz || quiz.kind !== 'baseline') return

      const selections = quiz.selections
      const missedTopicIds = BASELINE_QUESTIONS.filter(
        (question) => (selections[question.id] ?? null) !== question.answerIndex,
      ).map((question) => question.topicId)
      const correctCount = BASELINE_QUESTIONS.filter(
        (question) => selections[question.id] === question.answerIndex,
      ).length

      const evaluation = evaluateBaseline(correctCount, BASELINE_QUESTIONS.length, missedTopicIds)
      const result = buildAssessmentResult(
        'baseline',
        null,
        BASELINE_QUESTIONS.map((q) => ({ id: q.id, topicId: q.topicId })),
        selections,
        Object.fromEntries(BASELINE_QUESTIONS.map((q) => [q.id, q.answerIndex])),
      )

      set({ lastAssessment: result, screen: 'baseline_result' })
      get().acceptBaselineImpl(evaluation)
    },

    acceptBaselineImpl: (evaluation: BaselineEvaluation) => {
      const progress = applyBaselineToProgress(get().progress, evaluation)
      set({ progress, screen: 'baseline_result' })
      void writeProgress(progress)
      void persistAssessment({
        ...(get().lastAssessment as AssessmentResult),
      })
    },

    acceptBaseline: () => {
      set({ screen: 'dashboard', quiz: null })
      void persistKv({ screen: 'dashboard' })
    },

    /* ── Module test ──────────────────────────────────────────────────────── */

    startModuleTest: (moduleId) => {
      const questions = questionsForModule(moduleId)
      if (questions.length === 0) return
      set({
        quiz: {
          kind: 'module_test',
          moduleId,
          questionIds: questions.map((q) => q.id),
          selections: {},
          index: 0,
        },
        screen: 'test',
      })
      void persistKv({ screen: 'test' })
    },

    selectTestOption: (questionId, index) => {
      const quiz = get().quiz
      if (!quiz || quiz.kind !== 'module_test') return
      set({ quiz: { ...quiz, selections: { ...quiz.selections, [questionId]: index } } })
    },

    nextTestQuestion: () => {
      const quiz = get().quiz
      if (!quiz) return
      set({ quiz: { ...quiz, index: Math.min(quiz.index + 1, quiz.questionIds.length - 1) } })
    },

    previousTestQuestion: () => {
      const quiz = get().quiz
      if (!quiz) return
      set({ quiz: { ...quiz, index: Math.max(quiz.index - 1, 0) } })
    },

    submitModuleTest: () => {
      const { quiz, progress } = get()
      if (!quiz || quiz.kind !== 'module_test' || !quiz.moduleId) return

      const questions = questionsForModule(quiz.moduleId)
      const result = buildAssessmentResult(
        'module_test',
        quiz.moduleId,
        questions.map((q) => ({ id: q.id, topicId: q.topicId })),
        quiz.selections,
        Object.fromEntries(questions.map((q) => [q.id, q.answerIndex])),
      )
      const updated = applyAssessmentToProgress(progress, result)
      set({ lastAssessment: result, progress: updated, screen: 'test_result' })
      void writeProgress(updated)
      void persistAssessment(result)
    },

    /* ── Daily session ────────────────────────────────────────────────────── */

    startDailySession: () => {
      const state = get()
      const module = getModule(state.progress.currentModuleId) ?? getModule('m01')!
      const topic = nextTopicInModule(module, state.progress)
      const completedTitles = allTopics()
        .filter((entry) => state.progress.topics[entry.topic.id]?.status === 'completed')
        .map((entry) => entry.topic.title)
      const session = buildDailySession(module.id, topic.id, completedTitles)
      set({ dailySession: session, screen: 'session' })
      void persistDaily(session)
      void persistKv({ screen: 'session', activeSessionId: session.id })
    },

    answerSessionQuestion: (questionId, index) => {
      const session = get().dailySession
      if (!session) return
      const questions = session.questions
      const question = questions.find((q) => q.questionId === questionId)
      if (!question) return
      const correct = index === question.answerIndex
      const alreadyAnswered = session.answeredTopicIds.includes(questionId)
      const next: DailySession = {
        ...session,
        answeredTopicIds: alreadyAnswered ? session.answeredTopicIds : [...session.answeredTopicIds, questionId],
        correctCount: session.correctCount + (correct && !alreadyAnswered ? 1 : 0),
      }
      set({ dailySession: next })
      void persistDaily(next)
    },

    nextSessionQuestion: () => {
      const session = get().dailySession
      if (!session) return
      // Advancing past the last question completes the check phase.
      const allAnswered = session.questions.every((q) => session.answeredTopicIds.includes(q.questionId))
      if (allAnswered) {
        const progress = markTopicStepIn(get().progress, session.topicId, 'lessonRead')
        set({ progress })
        void writeProgress(progress)
      }
    },

    completeSession: () => {
      const { dailySession: session, progress } = get()
      if (!session) return
      const updatedSession: DailySession = { ...session, completed: true }
      const updated = markTopicStepIn(progress, session.topicId, 'practiceDone')
      set({ dailySession: updatedSession, progress: updated, screen: 'session_result' })
      void persistDaily(updatedSession)
      void writeProgress(updated)
      void persistKv({ screen: 'session_result' })
    },

    /* ── Mock interviews ──────────────────────────────────────────────────── */

    startMock: (difficulty, moduleId) => {
      const mock = buildMockInterview(difficulty, moduleId)
      set({ mock, screen: 'interview' })
      void persistMock(mock)
      void persistKv({ screen: 'interview', activeMockId: mock.id })
    },

    setMockAttempt: (questionId, text) => {
      const mock = get().mock
      if (!mock || mock.status !== 'active') return
      const answer = mock.answers[questionId]
      if (!answer) return
      const answers: Record<string, InterviewAnswer> = {
        ...mock.answers,
        [questionId]: { ...answer, attempt: text },
      }
      set({ mock: { ...mock, answers } })
    },

    revealMockAnswer: (questionId, score) => {
      const mock = get().mock
      if (!mock || mock.status !== 'active') return
      const answer = mock.answers[questionId]
      if (!answer) return
      const answers: Record<string, InterviewAnswer> = {
        ...mock.answers,
        [questionId]: { ...answer, score, scoredAt: new Date().toISOString() },
      }
      set({ mock: { ...mock, answers } })
      void persistMock({ ...get().mock!, answers })
    },

    nextMockQuestion: () => {
      const mock = get().mock
      if (!mock) return
      set({
        mock: { ...mock, currentIndex: Math.min(mock.currentIndex + 1, mock.questionIds.length - 1) },
      })
      void persistMock(get().mock!)
    },

    finishMock: () => {
      const mock = get().mock
      if (!mock || mock.status !== 'active') return
      const scores = Object.values(mock.answers)
        .map((answer) => answer.score)
        .filter((score): score is number => score !== null)
      const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : null

      const finished: MockInterviewSession = {
        ...mock,
        status: 'completed',
        completedAt: new Date().toISOString(),
        averageScore: averageScore === null ? null : Math.round(averageScore * 10) / 10,
      }
      const progress = markTopicStepIn(get().progress, 't17-01', 'lessonRead')
      const withInterviewCount = {
        ...progress,
        modules: {
          ...progress.modules,
          m17: {
            ...progress.modules.m17,
            interviewAnswered: progress.modules.m17.interviewAnswered + scores.length,
          },
        },
      }
      set({ mock: finished, progress: withInterviewCount, screen: 'history' })
      void persistMock(finished)
      void writeProgress(withInterviewCount)
      void persistKv({ screen: 'history' })
    },

    resetProgress: async () => {
      const progress = emptyProgress()
      set({ progress, screen: 'dashboard', quiz: null, lastAssessment: null, dailySession: null, mock: null })
      await writeProgress(progress)
      void persistKv({ screen: 'dashboard' })
    },
  }
})

/** Module view + dashboard helpers re-exported for components. */
export { moduleSummaries, computeWeakTopics, interviewQuestionsForModule, getInterviewQuestion, getModule }
export function mlStorageLabel(kind: MLStorageKind | null): string {
  return kind ? ML_STORAGE_LABELS[kind] : ''
}
