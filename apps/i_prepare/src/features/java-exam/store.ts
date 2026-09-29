import { create } from 'zustand'
import type {
  DomainMastery,
  JavaDomain,
  JavaExamResult,
  JavaExamSession,
  JavaQuestion,
  RevisionPlan,
} from './types'
import { JAVA_EXAMS } from './types'
import { buildJavaExamResult, evaluateJavaExam } from './engine/scoring'
import { createJavaSession, selectQuestions } from './engine/question-select'
import {
  buildRevisionPlan,
  hydrateMastery,
  updateMastery,
} from './engine/mastery'
import { createJavaStorage, JAVA_STORAGE_LABELS, type JavaStorageKind } from './lib/storage'
import { JAVA_QUESTIONS } from './data/questions'

/**
 * Single source of truth for the Java exam flow.
 *
 * Mirrors the reasoning store's discipline: every mutation persists immediately,
 * so a refresh or crash resumes exactly where the user was. Objective answers are
 * graded live; subjective answers pause at a reveal step on submission for
 * self-grading against the model answer before the result is finalised.
 */

export type JavaScreen =
  | 'catalogue'
  | 'instructions'
  | 'test'
  | 'reveal'
  | 'result'
  | 'history'
  | 'mastery'

export type JavaSaveStatus = 'idle' | 'saving' | 'saved' | 'error'

interface JavaKvState {
  screen: JavaScreen
  activeSessionId: string | null
  activeResultId: string | null
}

const KV_KEY = 'state'

interface JavaExamState {
  hydrated: boolean
  storageKind: JavaStorageKind | null
  screen: JavaScreen
  session: JavaExamSession | null
  /** Staged result between submission and the end of the self-grading reveal step. */
  pendingResult: JavaExamResult | null
  results: JavaExamResult[]
  activeResultId: string | null
  mastery: Record<JavaDomain, DomainMastery>
  revisionPlan: RevisionPlan
  saveStatus: JavaSaveStatus
  storageError: string | null

  hydrate: () => Promise<void>
  goToCatalogue: () => void
  goToHistory: () => void
  goToMastery: () => void
  startExam: (examId: string) => void
  /** Arms the created session and enters the test screen (timer starts here). */
  beginTest: () => Promise<void>
  goToInstructions: () => void
  goToQuestion: (index: number) => void
  nextQuestion: () => void
  previousQuestion: () => void
  selectOption: (questionId: string, index: number) => void
  toggleOption: (questionId: string, index: number) => void
  setText: (questionId: string, text: string) => void
  clearAnswer: (questionId: string) => void
  toggleMarkForReview: (questionId: string) => void
  submitExam: () => Promise<void>
  /** Applies the self-grade to the question at `revealIndex` and advances the step. */
  gradeCurrentReveal: (grade: number) => Promise<void>
  skipCurrentReveal: () => Promise<void>
  finaliseResult: () => Promise<void>
  openResult: (resultId: string) => void
  /** Generates a revision exam targeting the weakest domains from history. */
  startRevisionExam: () => void
  /** Clears the active session (abandon without submitting). */
  discardSession: () => Promise<void>
}

let storage: Awaited<ReturnType<typeof createJavaStorage>>

function db() {
  if (!storage) throw new Error('Java storage has not been initialised')
  return storage
}

/** Is the session clock expired? Timeout auto-submit happens on hydrate. */
function isSessionExpired(session: JavaExamSession): boolean {
  const elapsedMs = Date.now() - Date.parse(session.startedAt)
  return elapsedMs >= session.durationSeconds * 1000
}

/** Adds on-screen time to the current question, then restarts the interval. */
function flushTiming(session: JavaExamSession, nowIso: string): JavaExamSession {
  if (!session.activeSince) return session
  const delta = Date.parse(nowIso) - Date.parse(session.activeSince)
  const currentId = session.questionIds[session.currentQuestionIndex]
  const current = currentId ? session.answers[currentId] : undefined
  const answers =
      current && delta > 0
        ? { ...session.answers, [current.questionId]: { ...current, timeSpentMs: current.timeSpentMs + delta } }
        : session.answers
  return { ...session, answers, activeSince: nowIso }
}

function withVisited(session: JavaExamSession, index: number): JavaExamSession {
  const questionId = session.questionIds[index]
  const answer = questionId ? session.answers[questionId] : undefined
  if (!questionId || !answer || answer.visited) return session
  return { ...session, answers: { ...session.answers, [questionId]: { ...answer, visited: true } } }
}

async function persistSession(session: JavaExamSession): Promise<void> {
  useJavaExamStore.setState({ saveStatus: 'saving' })
  try {
    await db().put('java-sessions', session)
    useJavaExamStore.setState({ saveStatus: 'saved', storageError: null })
  } catch (error) {
    useJavaExamStore.setState({
      saveStatus: 'error',
      storageError: error instanceof Error ? error.message : 'Unable to save the answer',
    })
  }
}

async function persistKv(overrides: Partial<JavaKvState> = {}): Promise<void> {
  const state = useJavaExamStore.getState()
  const snapshot: JavaKvState = {
    screen: state.screen,
    activeSessionId: state.session && state.session.status === 'active' ? state.session.id : null,
    activeResultId: state.activeResultId,
    ...overrides,
  }
  try {
    await db().put('java-kv', { key: KV_KEY, value: snapshot })
  } catch (error) {
    useJavaExamStore.setState({
      storageError: error instanceof Error ? error.message : 'Unable to write local storage',
    })
  }
}

async function persistMastery(mastery: Record<JavaDomain, DomainMastery>): Promise<void> {
  try {
    await db().put('java-mastery', { key: 'mastery', value: mastery })
  } catch (error) {
    useJavaExamStore.setState({
      storageError: error instanceof Error ? error.message : 'Unable to save mastery',
    })
  }
}

export const useJavaExamStore = create<JavaExamState>((set, get) => {
  async function updateSession(mutate: (session: JavaExamSession) => JavaExamSession): Promise<void> {
    const session = get().session
    if (!session || session.status !== 'active') return
    const next = mutate(session)
    set({ session: next })
    await persistSession(next)
    await persistKv()
  }

  /** Submits the session: objective graded, subjective staged for the reveal step. */
  async function submitSession(reason: 'user' | 'timeout'): Promise<void> {
    const session = get().session
    if (!session || session.status !== 'active') return
    const now = new Date().toISOString()
    const flushed = flushTiming({ ...session, activeSince: session.activeSince ?? now }, now)
    const finished: JavaExamSession = {
      ...flushed,
      activeSince: null,
      status: 'submitted',
      submittedAt: now,
      submitReason: reason,
    }

    // Build the result with ungraded subjective answers left at 0; the reveal step
    // applies self-grades and re-finalises.
    const provisional = buildJavaExamResult(finished, questionsForSession(finished))
    set({
      session: finished,
      pendingResult: provisional,
      screen: 'reveal',
      saveStatus: 'saving',
    })
    try {
      await db().put('java-sessions', finished)
    } catch (error) {
      set({
        saveStatus: 'error',
        storageError: error instanceof Error ? error.message : 'Unable to save the session',
      })
    }
    await persistKv({ screen: 'reveal', activeSessionId: null })
  }

  function questionsForSession(session: JavaExamSession): JavaQuestion[] {
    return session.questionIds
      .map((id) => JAVA_QUESTIONS.find((question) => question.id === id))
      .filter((question): question is JavaQuestion => Boolean(question))
  }

  return {
    hydrated: false,
    storageKind: null,
    screen: 'catalogue',
    session: null,
    pendingResult: null,
    results: [],
    activeResultId: null,
    mastery: hydrateMastery(null),
    revisionPlan: [],
    saveStatus: 'idle',
    storageError: null,

    hydrate: async () => {
      if (get().hydrated) return
      const adapter = await createJavaStorage()
      storage = adapter

      const [kvRecord, sessionRecords, resultRecords, masteryRecord] = await Promise.all([
        adapter.get<{ key: string; value: JavaKvState }>('java-kv', KV_KEY).catch(() => null),
        adapter.getAll<JavaExamSession>('java-sessions').catch(() => []),
        adapter.getAll<JavaExamResult>('java-results').catch(() => []),
        adapter.get<{ key: string; value: Record<JavaDomain, DomainMastery> }>('java-mastery', 'mastery').catch(() => null),
      ])

      const results = [...resultRecords].sort(
        (a, b) => Date.parse(b.submittedAt) - Date.parse(a.submittedAt),
      )
      const mastery = hydrateMastery(masteryRecord?.value ?? null)
      const active = sessionRecords
        .filter((item) => item.status === 'active')
        .sort((a, b) => Date.parse(b.startedAt) - Date.parse(a.startedAt))[0] ?? null

      const kv = kvRecord?.value ?? null

      set({
        hydrated: true,
        storageKind: adapter.kind,
        results,
        mastery,
        revisionPlan: buildRevisionPlan(mastery),
        activeResultId: kv?.activeResultId ?? results[0]?.id ?? null,
        screen: active ? 'test' : (kv?.screen as JavaScreen | undefined) ?? 'catalogue',
        session: active,
      })

      // A session whose clock ran out while the tab was closed is submitted now.
      if (active && isSessionExpired(active)) {
        await submitSession('timeout')
        return
      }

      // Refresh mid-reveal: rebuild the provisional result so grading can finish.
      if (!active && kv?.screen === 'reveal') {
        const lastSubmitted = sessionRecords
          .filter((item) => item.status === 'submitted')
          .sort((a, b) => Date.parse(b.submittedAt ?? '') - Date.parse(a.submittedAt ?? ''))[0]
        const hasUngraded =
          lastSubmitted &&
          Object.values(lastSubmitted.answers).some(
            (answer) => answer.text.trim() !== '' && answer.selfGrade === null,
          )
        if (lastSubmitted && hasUngraded) {
          set({
            pendingResult: buildJavaExamResult(lastSubmitted, questionsForSession(lastSubmitted)),
            session: lastSubmitted,
            screen: 'reveal',
          })
          return
        }
      }

      // Guard against stale screens that need a live session.
      if (!active && ['test', 'instructions'].includes(kv?.screen ?? '')) {
        set({ screen: 'catalogue' })
      }
    },

    goToCatalogue: () => {
      set({ screen: 'catalogue' })
      void persistKv({ screen: 'catalogue' })
    },

    goToHistory: () => {
      set({ screen: 'history' })
      void persistKv({ screen: 'history' })
    },

    goToMastery: () => {
      set({ screen: 'mastery' })
      void persistKv({ screen: 'mastery' })
    },

    startExam: (examId) => {
      const definition = JAVA_EXAMS.find((exam) => exam.id === examId)
      if (!definition) return
      const selected = selectQuestions(
        JAVA_QUESTIONS,
        { levels: definition.levels, kinds: definition.kinds },
        definition.questionCount,
      )
      if (selected.length === 0) return
      const session = createJavaSession(
        definition.id,
        definition.name,
        selected,
        definition.durationMinutes,
        true,
      )
      set({ session, screen: 'instructions' })
      void persistKv({ screen: 'instructions' })
    },

    beginTest: async () => {
      const session = get().session
      if (!session || session.status !== 'active') return
      set({ session, screen: 'test' })
      await persistSession(session)
      await persistKv({ screen: 'test', activeSessionId: session.id })
    },

    goToInstructions: () => {
      set({ screen: 'instructions' })
      void persistKv({ screen: 'instructions' })
    },

    goToQuestion: (index) => {
      const session = get().session
      if (!session || session.status !== 'active') return
      const bounded = Math.max(0, Math.min(index, session.questionIds.length - 1))
      if (bounded === session.currentQuestionIndex) return
      const now = new Date().toISOString()
      const next = withVisited(
        { ...flushTiming(session, now), currentQuestionIndex: bounded, activeSince: now },
        bounded,
      )
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

    selectOption: (questionId, index) => {
      void updateSession((session) => {
        const answer = session.answers[questionId]
        if (!answer) return session
        const now = new Date().toISOString()
        return {
          ...flushTiming({ ...session, activeSince: session.activeSince ?? now }, now),
          activeSince: now,
          answers: {
            ...session.answers,
            [questionId]: { ...answer, selectedIndex: index, answeredAt: now, visited: true },
          },
        }
      })
    },

    toggleOption: (questionId, index) => {
      void updateSession((session) => {
        const answer = session.answers[questionId]
        if (!answer) return session
        const has = answer.selectedIndices.includes(index)
        return {
          ...session,
          answers: {
            ...session.answers,
            [questionId]: {
              ...answer,
              selectedIndices: has
                ? answer.selectedIndices.filter((item) => item !== index)
                : [...answer.selectedIndices, index].sort((a, b) => a - b),
              visited: true,
            },
          },
        }
      })
    },

    setText: (questionId, text) => {
      void updateSession((session) => {
        const answer = session.answers[questionId]
        if (!answer) return session
        return {
          ...session,
          answers: {
            ...session.answers,
            [questionId]: { ...answer, text, visited: true },
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
            [questionId]: {
              ...answer,
              selectedIndex: null,
              selectedIndices: [],
              text: '',
              answeredAt: null,
            },
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

    submitExam: async () => {
      await submitSession('user')
    },

    gradeCurrentReveal: async (grade) => {
      const { pendingResult, session } = get()
      if (!pendingResult || !session) return
      const index = pendingResult.questionResults.findIndex(
        (item) => item.kind !== undefined && isSubjectiveKind(item.kind) && item.selfGrade === null,
      )
      if (index === -1) {
        await get().finaliseResult()
        return
      }
      const questionResults = [...pendingResult.questionResults]
      questionResults[index] = {
        ...questionResults[index],
        selfGrade: grade,
        earned: grade,
        outcome: grade >= 4 ? 'correct' : grade >= 3 ? 'partial' : grade > 0 ? 'incorrect' : questionResults[index].outcome,
      }
      set({ pendingResult: { ...pendingResult, questionResults } })
      // Persist the self-grade into the stored session answers too.
      const questionId = questionResults[index].questionId
      const answer = session.answers[questionId]
      if (answer) {
        const updatedSession: JavaExamSession = {
          ...session,
          answers: { ...session.answers, [questionId]: { ...answer, selfGrade: grade } },
        }
        set({ session: updatedSession })
        await persistSession(updatedSession)
      }
      // If that was the last ungraded subjective question, finish.
      if (!questionResults.some((item) => isSubjectiveKind(item.kind) && item.selfGrade === null)) {
        await get().finaliseResult()
      }
    },

    skipCurrentReveal: async () => {
      const { pendingResult } = get()
      if (!pendingResult) return
      const index = pendingResult.questionResults.findIndex(
        (item) => isSubjectiveKind(item.kind) && item.selfGrade === null,
      )
      if (index === -1) {
        await get().finaliseResult()
        return
      }
      const questionResults = [...pendingResult.questionResults]
      questionResults[index] = { ...questionResults[index], selfGrade: 0, earned: 0 }
      set({ pendingResult: { ...pendingResult, questionResults } })
      if (!questionResults.some((item) => isSubjectiveKind(item.kind) && item.selfGrade === null)) {
        await get().finaliseResult()
      }
    },

    finaliseResult: async () => {
      const { pendingResult, session } = get()
      if (!pendingResult || !session) return
      const questions = questionsForSession(session)
      // Re-run the evaluation over the graded answers for accurate aggregates.
      const gradedSession: JavaExamSession = {
        ...session,
        answers: Object.fromEntries(
          Object.entries(session.answers).map(([id, answer]) => {
            const graded = pendingResult.questionResults.find((item) => item.questionId === id)
            return graded && graded.selfGrade !== null ? [id, { ...answer, selfGrade: graded.selfGrade }] : [id, answer]
          }),
        ),
      }
      const result = buildJavaExamResult(gradedSession, questions)
      const mastery = updateMastery(get().mastery, result)
      set((state) => ({
        pendingResult: null,
        results: [result, ...state.results.filter((item) => item.id !== result.id)],
        activeResultId: result.id,
        mastery,
        revisionPlan: buildRevisionPlan(mastery),
        screen: 'result',
        saveStatus: 'saving',
      }))
      try {
        await db().put('java-results', result)
        set({ saveStatus: 'saved', storageError: null })
      } catch (error) {
        set({
          saveStatus: 'error',
          storageError: error instanceof Error ? error.message : 'Unable to save the result',
        })
      }
      await persistMastery(mastery)
      await persistKv({ screen: 'result', activeResultId: result.id })
    },

    openResult: (resultId) => {
      set({ activeResultId: resultId, screen: 'result' })
      void persistKv({ screen: 'result', activeResultId: resultId })
    },

    startRevisionExam: () => {
      const plan = get().revisionPlan
      const weakDomains = plan.map((item) => item.domain)
      const selected = selectQuestions(JAVA_QUESTIONS, { domains: weakDomains }, 20)
      if (selected.length === 0) return
      const session = createJavaSession('java-revision', 'Weak-Area Revision', selected, 30, true)
      set({ session, screen: 'instructions' })
      void persistKv({ screen: 'instructions' })
    },

    discardSession: async () => {
      const session = get().session
      if (session) {
        try {
          await db().remove('java-sessions', session.id)
        } catch {
          // Ignore — dropped from memory regardless.
        }
      }
      set({ session: null, screen: 'catalogue' })
      await persistKv({ screen: 'catalogue', activeSessionId: null })
    },
  }
})

function isSubjectiveKind(kind: JavaQuestion['kind']): boolean {
  return ['coding', 'debugging', 'short_answer', 'architecture', 'system_design'].includes(kind)
}

export function javaStorageLabel(kind: JavaStorageKind | null): string {
  return kind ? JAVA_STORAGE_LABELS[kind] : ''
}

export { evaluateJavaExam }
