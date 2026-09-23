import { create } from 'zustand'
import type {
  ExamId,
  OptionKey,
  TestConfiguration,
  TestPreset,
  TestResult,
  TestSession,
} from '@/data/reasoning'
import { getExam, getTestPreset, TEST_PRESETS, questionsForExam, topicsForExam } from '@/data/reasoning'
import { buildTestResult } from './engine/evaluation'
import {
  countMatchingQuestions,
  createSession,
  isSessionExpired,
  questionsForSession,
  selectQuestions,
} from './engine/test-builder'
import { createStorage, type PersistAdapter, type StorageKind } from './lib/storage'

/**
 * Single source of truth for the whole mock-test flow.
 *
 * Every screen reads from this store and every mutation persists immediately, so
 * navigation, a component re-render or a full page refresh can never desynchronise
 * the timer, the answers, the palette and the evaluation.
 */

export type Screen =
  | 'exams'
  | 'config'
  | 'instructions'
  | 'test'
  | 'recovery'
  | 'result'
  | 'history'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

interface PersistedState {
  screen: Screen
  examId: ExamId | null
  testId: string | null
  config: TestConfiguration | null
  activeSessionId: string | null
  activeResultId: string | null
}

const KV_KEY = 'app-state'
const RESTORABLE_SCREENS: Screen[] = ['exams', 'config', 'instructions', 'history']

let storage: PersistAdapter | null = null
let storageKind: StorageKind | null = null

function db(): PersistAdapter {
  if (!storage) throw new Error('Storage has not been initialised yet')
  return storage
}

export function defaultConfiguration(examId: ExamId, preset?: TestPreset): TestConfiguration {
  const exam = getExam(examId)
  const resolvedPreset =
    preset ?? TEST_PRESETS.find((item) => item.examId === examId && item.totalQuestions === exam.defaultQuestionCount) ?? TEST_PRESETS.find((item) => item.examId === examId)
  const available = questionsForExam(examId).length

  return {
    examId,
    testId: resolvedPreset?.id ?? `${examId.toLowerCase()}-standard`,
    questionCount: Math.min(resolvedPreset?.totalQuestions ?? exam.defaultQuestionCount, available),
    durationMinutes: resolvedPreset?.durationMinutes ?? exam.defaultDurationMinutes,
    difficulty: resolvedPreset?.difficulty ?? 'mixed',
    topics: resolvedPreset?.topics ?? topicsForExam(examId),
    marking: exam.marking,
  }
}

interface ReasoningMockState {
  hydrated: boolean
  storageKind: StorageKind | null
  screen: Screen
  examId: ExamId | null
  testId: string | null
  config: TestConfiguration | null
  session: TestSession | null
  results: TestResult[]
  activeResultId: string | null
  saveStatus: SaveStatus
  lastSavedAt: string | null
  storageError: string | null

  hydrate: () => Promise<void>
  goToExams: () => void
  goToHistory: () => void
  selectExam: (examId: ExamId) => void
  selectPreset: (testId: string) => void
  updateConfig: (patch: Partial<TestConfiguration>) => void
  goToInstructions: () => void
  goToConfig: () => void
  startTest: () => void
  resumeSession: () => void
  discardSession: () => Promise<void>
  goToQuestion: (index: number) => void
  nextQuestion: () => void
  previousQuestion: () => void
  selectOption: (questionId: string, option: OptionKey) => void
  clearAnswer: (questionId: string) => void
  toggleMarkForReview: (questionId: string) => void
  submitTest: (reason?: 'user' | 'timeout') => Promise<void>
  openResult: (resultId: string) => void
  backToResult: () => void
  pauseTiming: () => void
  resumeTiming: () => void
}

export const useReasoningMockStore = create<ReasoningMockState>((set, get) => {
  /* ── persistence helpers ───────────────────────────────────────────────── */

  function snapshotKv(overrides: Partial<PersistedState> = {}): PersistedState {
    const state = get()
    return {
      screen: state.screen,
      examId: state.examId,
      testId: state.testId,
      config: state.config,
      activeSessionId: state.session && state.session.status === 'active' ? state.session.id : null,
      activeResultId: state.activeResultId,
      ...overrides,
    }
  }

  async function persistKv(overrides: Partial<PersistedState> = {}): Promise<void> {
    try {
      await db().put('kv', { key: KV_KEY, value: snapshotKv(overrides) })
    } catch (error) {
      set({ storageError: error instanceof Error ? error.message : 'Unable to write local storage' })
    }
  }

  async function persistSession(session: TestSession): Promise<void> {
    set({ saveStatus: 'saving' })
    try {
      await db().put('sessions', session)
      set({ saveStatus: 'saved', lastSavedAt: new Date().toISOString(), storageError: null })
    } catch (error) {
      set({
        saveStatus: 'error',
        storageError: error instanceof Error ? error.message : 'Unable to save the answer',
      })
    }
  }

  /** Adds the time the current question has been on screen, then restarts the clock. */
  function flushTiming(session: TestSession, nowIso: string): TestSession {
    if (!session.activeSince) return session
    const delta = Date.parse(nowIso) - Date.parse(session.activeSince)
    const currentId = session.questionIds[session.currentQuestionIndex]
    const current = currentId ? session.answers[currentId] : undefined
    const answers =
      current && delta > 0
        ? { ...session.answers, [current.id]: { ...current, timeSpentMs: current.timeSpentMs + delta } }
        : session.answers
    return { ...session, answers, activeSince: nowIso }
  }

  /** Marks a question as visited (called whenever it becomes the current question). */
  function withVisited(session: TestSession, index: number): TestSession {
    const questionId = session.questionIds[index]
    const answer = questionId ? session.answers[questionId] : undefined
    if (!questionId || !answer || answer.visited) return session
    return { ...session, answers: { ...session.answers, [questionId]: { ...answer, visited: true } } }
  }

  async function updateSession(mutate: (session: TestSession) => TestSession): Promise<void> {
    const session = get().session
    if (!session || session.status !== 'active') return
    const next = mutate(session)
    set({ session: next })
    await persistSession(next)
    await persistKv()
  }

  /** Locks the session, scores it, persists the full result and returns it. */
  async function finalizeSession(
    session: TestSession,
    reason: 'user' | 'timeout',
  ): Promise<TestResult> {
    const questions = questionsForSession(session)
    const finished: TestSession = {
      ...session,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      submitReason: reason,
      activeSince: null,
    }
    const result = buildTestResult(finished, questions, getExam(session.examId).name)

    set((state) => ({
      session: finished,
      results: [result, ...state.results.filter((item) => item.id !== result.id)],
      activeResultId: result.id,
      screen: 'result',
      saveStatus: 'saving',
    }))

    try {
      await db().put('sessions', finished)
      await db().put('results', result)
      set({ saveStatus: 'saved', lastSavedAt: new Date().toISOString(), storageError: null })
    } catch (error) {
      // The result stays in memory even if storage fails, so the user still sees it.
      set({
        saveStatus: 'error',
        storageError: error instanceof Error ? error.message : 'Unable to save the result',
      })
    }
    await persistKv({ screen: 'result', activeSessionId: null, activeResultId: result.id })
    return result
  }

  return {
    hydrated: false,
    storageKind: null,
    screen: 'exams',
    examId: null,
    testId: null,
    config: null,
    session: null,
    results: [],
    activeResultId: null,
    saveStatus: 'idle',
    lastSavedAt: null,
    storageError: null,

    hydrate: async () => {
      if (get().hydrated) return
      const adapter = await createStorage()
      storage = adapter
      storageKind = adapter.kind

      const [kvRecord, sessionRecords, resultRecords] = await Promise.all([
        adapter.get<{ key: string; value: PersistedState }>('kv', KV_KEY).catch(() => null),
        adapter.getAll<TestSession>('sessions').catch(() => []),
        adapter.getAll<TestResult>('results').catch(() => []),
      ])

      const results = [...resultRecords].sort(
        (a, b) => Date.parse(b.submittedAt) - Date.parse(a.submittedAt),
      )
      const activeSessions = sessionRecords
        .filter((session) => session.status === 'active')
        .sort((a, b) => Date.parse(b.startedAt) - Date.parse(a.startedAt))
      const active = activeSessions[0] ?? null
      const kv = kvRecord?.value ?? null

      // A session whose clock ran out while the tab was closed is submitted automatically.
      if (active && isSessionExpired(active)) {
        set({
          hydrated: true,
          storageKind,
          config: kv?.config ?? get().config,
          examId: active.examId,
          results,
          screen: 'test',
          session: active,
        })
        await finalizeSession(active, 'timeout')
        return
      }

      const restoredScreen: Screen =
        kv && RESTORABLE_SCREENS.includes(kv.screen)
          ? kv.screen
          : kv?.screen === 'result' && kv.activeResultId
            ? 'result'
            : 'exams'

      set({
        hydrated: true,
        storageKind,
        screen: active ? 'recovery' : restoredScreen,
        examId: kv?.examId ?? active?.examId ?? null,
        testId: kv?.testId ?? active?.testId ?? null,
        config: kv?.config ?? null,
        session: active,
        results,
        activeResultId: kv?.activeResultId ?? results[0]?.id ?? null,
      })
    },

    goToExams: () => {
      set({ screen: 'exams' })
      void persistKv({ screen: 'exams' })
    },

    goToHistory: () => {
      set({ screen: 'history' })
      void persistKv({ screen: 'history' })
    },

    selectExam: (examId) => {
      const config = defaultConfiguration(examId)
      set({ examId, testId: config.testId, config, screen: 'config' })
      void persistKv({ screen: 'config', examId, testId: config.testId, config })
    },

    selectPreset: (testId) => {
      const preset = getTestPreset(testId)
      const state = get()
      if (!preset || !state.config) return
      const available = questionsForExam(preset.examId).length
      const config: TestConfiguration = {
        ...state.config,
        testId,
        durationMinutes: preset.durationMinutes,
        difficulty: preset.difficulty,
        topics: preset.topics,
        questionCount: Math.max(1, Math.min(preset.totalQuestions, available)),
      }
      set({ testId, config })
      void persistKv({ testId, config })
    },

    updateConfig: (patch) => {
      const state = get()
      if (!state.config) return
      const merged: TestConfiguration = { ...state.config, ...patch }
      const available = countMatchingQuestions(merged)
      const config: TestConfiguration = {
        ...merged,
        questionCount: Math.max(1, Math.min(merged.questionCount, available)),
      }
      set({ config })
      void persistKv({ config })
    },

    goToInstructions: () => {
      set({ screen: 'instructions' })
      void persistKv({ screen: 'instructions' })
    },

    goToConfig: () => {
      set({ screen: 'config' })
      void persistKv({ screen: 'config' })
    },

    startTest: () => {
      const config = get().config
      if (!config) return
      const questions = selectQuestions(config)
      if (questions.length === 0) return
      const session = createSession(config, questions)
      set({ session, screen: 'test', saveStatus: 'saving' })
      void persistSession(session)
      void persistKv({ screen: 'test', activeSessionId: session.id })
    },

    resumeSession: () => {
      const session = get().session
      if (!session || session.status !== 'active') {
        set({ screen: 'exams' })
        return
      }
      const resumed: TestSession = { ...session, activeSince: new Date().toISOString() }
      set({ session: resumed, screen: 'test' })
      void persistSession(resumed)
      void persistKv({ screen: 'test', activeSessionId: resumed.id })
    },

    discardSession: async () => {
      const session = get().session
      if (session) {
        try {
          await db().remove('sessions', session.id)
        } catch {
          // Ignore — the session is dropped from memory regardless.
        }
      }
      set({ session: null, screen: 'exams' })
      await persistKv({ screen: 'exams', activeSessionId: null })
    },

    goToQuestion: (index) => {
      const session = get().session
      if (!session || session.status !== 'active') return
      const bounded = Math.max(0, Math.min(index, session.questionIds.length - 1))
      if (bounded === session.currentQuestionIndex) return
      const now = new Date().toISOString()
      const flushed = flushTiming(session, now)
      const next = withVisited({ ...flushed, currentQuestionIndex: bounded, activeSince: now }, bounded)
      set({ session: next })
      void persistSession(next)
      void persistKv()
    },

    nextQuestion: () => {
      const session = get().session
      if (!session) return
      get().goToQuestion(session.currentQuestionIndex + 1)
    },

    previousQuestion: () => {
      const session = get().session
      if (!session) return
      get().goToQuestion(session.currentQuestionIndex - 1)
    },

    selectOption: (questionId, option) => {
      void updateSession((session) => {
        const answer = session.answers[questionId]
        if (!answer) return session
        const now = new Date().toISOString()
        const flushed = flushTiming({ ...session, activeSince: session.activeSince ?? now }, now)
        const current = flushed.answers[questionId]
        return {
          ...flushed,
          activeSince: now,
          answers: {
            ...flushed.answers,
            [questionId]: {
              ...current,
              selectedOption: option,
              answeredAt: now,
              visited: true,
            },
          },
        }
      })
    },

    clearAnswer: (questionId) => {
      void updateSession((session) => {
        const answer = session.answers[questionId]
        if (!answer) return session
        return {
          ...session,
          answers: {
            ...session.answers,
            [questionId]: { ...answer, selectedOption: null, answeredAt: null },
          },
        }
      })
    },

    toggleMarkForReview: (questionId) => {
      void updateSession((session) => {
        const answer = session.answers[questionId]
        if (!answer) return session
        return {
          ...session,
          answers: {
            ...session.answers,
            [questionId]: { ...answer, markedForReview: !answer.markedForReview },
          },
        }
      })
    },

    submitTest: async (reason = 'user') => {
      const session = get().session
      if (!session || session.status !== 'active') return
      const now = new Date().toISOString()
      const flushed = flushTiming(
        { ...session, activeSince: session.activeSince ?? now },
        now,
      )
      await finalizeSession({ ...flushed, activeSince: null }, reason)
    },

    openResult: (resultId) => {
      set({ activeResultId: resultId, screen: 'result' })
      void persistKv({ screen: 'result', activeResultId: resultId })
    },

    backToResult: () => {
      const resultId = get().activeResultId ?? get().results[0]?.id
      if (!resultId) {
        set({ screen: 'exams' })
        void persistKv({ screen: 'exams' })
        return
      }
      set({ activeResultId: resultId, screen: 'result' })
      void persistKv({ screen: 'result', activeResultId: resultId })
    },

    pauseTiming: () => {
      void updateSession((session) => {
        const now = new Date().toISOString()
        const flushed = flushTiming(session, now)
        return { ...flushed, activeSince: null }
      })
    },

    resumeTiming: () => {
      void updateSession((session) => ({ ...session, activeSince: new Date().toISOString() }))
    },
  }
})

export function getStorageKind(): StorageKind | null {
  return storageKind
}
