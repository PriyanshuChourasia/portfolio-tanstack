import { create } from 'zustand'
import type {
  ExamResult,
  GoDsaState,
  GoScreen,
  InterviewSession,
  InterviewStageKey,
  ProblemAttempt,
  ResumePointer,
  ReviewCheckKey,
} from './types'
import { INTERVIEW_STAGES } from './types'
import { getProblem, getTopic, PRODUCTION_TOPIC_ID } from './data'
import { emptyAttempt, emptyState, hydrateState, topicRows } from './engine/progress'
import { buildExam, buildRevision, gradeExam, startInterview } from './engine/sessions'
import { loadState, saveState, storageKind, type GoStorageKind } from './lib/storage'

/**
 * Single source of truth for the Go + DSA mentor. Every change is written to
 * storage (text edits are debounced) so the learner always resumes exactly
 * where they stopped.
 */

/** Where the open problem was launched from — drives the back button and next/prev. */
export type ProblemSource = 'topic' | 'revision' | 'production'

interface GoDsaStore {
  hydrated: boolean
  storageKind: GoStorageKind | null
  saveFailed: boolean
  data: GoDsaState
  screen: GoScreen
  moduleId: string | null
  topicId: string | null
  problemId: string | null
  problemSource: ProblemSource

  hydrate: () => void
  go: (screen: GoScreen) => void
  openModule: (moduleId: string) => void
  openTopic: (topicId: string) => void
  openProblem: (problemId: string, source?: ProblemSource) => void
  resume: () => void
  markLessonRead: (topicId: string) => void

  editAttempt: (problemId: string, patch: Partial<Pick<ProblemAttempt, 'approach' | 'code'>>) => void
  submitAttempt: (problemId: string) => void
  selectOption: (problemId: string, index: number) => void
  revealHint: (problemId: string) => void
  revealSolution: (problemId: string) => void
  toggleReview: (problemId: string, key: ReviewCheckKey) => void
  setScore: (problemId: string, score: number) => void

  startRevision: () => void
  continueRevision: () => void
  moveRevision: (delta: number) => void
  finishRevision: () => void

  startExam: () => void
  answerExam: (problemId: string, index: number) => void
  moveExam: (index: number) => void
  submitExam: () => void
  viewExam: (examId: string) => void
  viewedExamId: string | null

  beginInterview: (problemId: string) => void
  setInterviewResponse: (stage: InterviewStageKey, text: string) => void
  scoreInterviewStage: (stage: InterviewStageKey, score: number) => void
  moveInterviewStage: (delta: number) => void
  finishInterview: () => void
  abandonInterview: () => void

  toggleMilestone: (challengeId: string, index: number) => void
  resetAll: () => void
}

let saveTimer: ReturnType<typeof setTimeout> | null = null

export const useGoDsaStore = create<GoDsaStore>((set, get) => {
  function persist(data: GoDsaState, debounce = false) {
    const write = () => {
      const ok = saveState(data)
      set({ saveFailed: !ok, storageKind: storageKind() })
    }
    if (saveTimer) clearTimeout(saveTimer)
    if (debounce) saveTimer = setTimeout(write, 400)
    else write()
  }

  function commit(data: GoDsaState, debounce = false) {
    set({ data })
    persist(data, debounce)
  }

  function navigate(screen: GoScreen, pointer: Partial<ResumePointer> = {}) {
    const state = get()
    const resume: ResumePointer = {
      screen,
      moduleId: pointer.moduleId !== undefined ? pointer.moduleId : state.moduleId,
      topicId: pointer.topicId !== undefined ? pointer.topicId : state.topicId,
      problemId: pointer.problemId !== undefined ? pointer.problemId : state.problemId,
    }
    set({ screen, moduleId: resume.moduleId, topicId: resume.topicId, problemId: resume.problemId })
    // Only learning screens are worth resuming to; modes restart from their own entry points.
    if (screen === 'module' || screen === 'topic' || screen === 'problem') {
      commit({ ...get().data, resume })
    }
  }

  function updateAttempt(problemId: string, update: (attempt: ProblemAttempt) => ProblemAttempt, debounce = false) {
    const data = get().data
    const current = data.attempts[problemId] ?? emptyAttempt(problemId)
    const next = { ...update(current), updatedAt: new Date().toISOString() }
    commit({ ...data, attempts: { ...data.attempts, [problemId]: next } }, debounce)
  }

  function activeRevision() {
    return get().data.revisions.find((round) => round.completedAt === null) ?? null
  }

  function activeInterview(): InterviewSession | null {
    return get().data.interviews.find((session) => session.completedAt === null) ?? null
  }

  function activeExam(): ExamResult | null {
    return get().data.exams.find((exam) => exam.submittedAt === null) ?? null
  }

  function replaceExam(exam: ExamResult) {
    const data = get().data
    commit({ ...data, exams: data.exams.map((item) => (item.id === exam.id ? exam : item)) })
  }

  function replaceInterview(session: InterviewSession, debounce = false) {
    const data = get().data
    commit(
      { ...data, interviews: data.interviews.map((item) => (item.id === session.id ? session : item)) },
      debounce,
    )
  }

  return {
    hydrated: false,
    storageKind: null,
    saveFailed: false,
    data: emptyState(),
    screen: 'dashboard',
    moduleId: null,
    topicId: null,
    problemId: null,
    problemSource: 'topic',
    viewedExamId: null,

    hydrate: () => {
      if (get().hydrated) return
      const data = hydrateState(loadState())
      set({ hydrated: true, data, storageKind: storageKind(), screen: 'dashboard' })
    },

    go: (screen) => navigate(screen),

    openModule: (moduleId) => navigate('module', { moduleId, topicId: null, problemId: null }),

    openTopic: (topicId) => {
      const entry = getTopic(topicId)
      if (!entry) return
      navigate('topic', { moduleId: entry.module.id, topicId, problemId: null })
    },

    openProblem: (problemId, source = 'topic') => {
      const entry = getProblem(problemId)
      if (!entry) return
      set({ problemSource: source })
      navigate('problem', {
        moduleId: entry.module?.id ?? null,
        topicId: entry.topic?.id ?? (source === 'production' ? PRODUCTION_TOPIC_ID : null),
        problemId,
      })
    },

    resume: () => {
      const { resume } = get().data
      if (resume.screen === 'problem' && resume.problemId && getProblem(resume.problemId)) {
        get().openProblem(resume.problemId, resume.topicId === PRODUCTION_TOPIC_ID ? 'production' : 'topic')
      } else if (resume.topicId && getTopic(resume.topicId)) {
        get().openTopic(resume.topicId)
      } else if (resume.moduleId) {
        get().openModule(resume.moduleId)
      } else {
        get().openTopic('m01-t1')
      }
    },

    markLessonRead: (topicId) => {
      const data = get().data
      if (data.lessonsRead.includes(topicId)) return
      commit({ ...data, lessonsRead: [...data.lessonsRead, topicId] })
    },

    /* ── Problem workspace ────────────────────────────────────────────────── */

    editAttempt: (problemId, patch) => updateAttempt(problemId, (attempt) => ({ ...attempt, ...patch }), true),

    submitAttempt: (problemId) => updateAttempt(problemId, (attempt) => ({ ...attempt, attempts: attempt.attempts + 1 })),

    selectOption: (problemId, index) => {
      const problem = getProblem(problemId)?.problem
      if (!problem?.check) return
      updateAttempt(problemId, (attempt) => {
        if (attempt.selectedOption !== null) return attempt
        const correct = index === problem.check!.answerIndex
        return { ...attempt, selectedOption: index, attempts: attempt.attempts + 1, score: correct ? 10 : 0 }
      })
    },

    revealHint: (problemId) => {
      const problem = getProblem(problemId)?.problem
      if (!problem) return
      updateAttempt(problemId, (attempt) => ({
        ...attempt,
        hintsRevealed: Math.min(attempt.hintsRevealed + 1, problem.hints.length),
      }))
    },

    revealSolution: (problemId) =>
      updateAttempt(problemId, (attempt) => ({
        ...attempt,
        solutionRevealed: true,
        revealedWithoutAttempt: attempt.revealedWithoutAttempt || (attempt.attempts === 0 && attempt.selectedOption === null),
      })),

    toggleReview: (problemId, key) =>
      updateAttempt(problemId, (attempt) => ({ ...attempt, review: { ...attempt.review, [key]: !attempt.review[key] } })),

    setScore: (problemId, score) =>
      updateAttempt(problemId, (attempt) => ({ ...attempt, score: Math.max(0, Math.min(10, Math.round(score))) })),

    /* ── Revision rounds ──────────────────────────────────────────────────── */

    startRevision: () => {
      if (activeRevision()) return get().continueRevision()
      const data = get().data
      const round = buildRevision(topicRows(data), data)
      commit({ ...data, revisions: [...data.revisions, round] })
      navigate('revision')
    },

    continueRevision: () => {
      const round = activeRevision()
      if (!round) return
      navigate('revision')
    },

    moveRevision: (delta) => {
      const round = activeRevision()
      if (!round) return
      const index = Math.max(0, Math.min(round.problemIds.length - 1, round.index + delta))
      const data = get().data
      commit({ ...data, revisions: data.revisions.map((item) => (item.id === round.id ? { ...round, index } : item)) })
    },

    finishRevision: () => {
      const round = activeRevision()
      if (!round) return
      const data = get().data
      commit({
        ...data,
        revisions: data.revisions.map((item) =>
          item.id === round.id ? { ...round, completedAt: new Date().toISOString() } : item,
        ),
      })
      navigate('dashboard')
    },

    /* ── Exam mode ────────────────────────────────────────────────────────── */

    startExam: () => {
      const data = get().data
      if (!activeExam()) commit({ ...data, exams: [buildExam(), ...data.exams] })
      navigate('exam')
    },

    answerExam: (problemId, index) => {
      const exam = activeExam()
      if (!exam) return
      replaceExam({ ...exam, answers: { ...exam.answers, [problemId]: index } })
    },

    moveExam: (index) => {
      const exam = activeExam()
      if (!exam) return
      replaceExam({ ...exam, index: Math.max(0, Math.min(exam.problemIds.length - 1, index)) })
    },

    submitExam: () => {
      const exam = activeExam()
      if (!exam) return
      const graded = gradeExam(exam, (id) => getProblem(id)?.problem)
      replaceExam(graded)
      set({ viewedExamId: graded.id })
      navigate('exam_result')
    },

    viewExam: (examId) => {
      set({ viewedExamId: examId })
      navigate('exam_result')
    },

    /* ── Interview mode ───────────────────────────────────────────────────── */

    beginInterview: (problemId) => {
      const data = get().data
      const session = startInterview(problemId)
      // Only one live interview at a time — an unfinished one is closed out.
      const interviews = data.interviews.map((item) =>
        item.completedAt === null ? { ...item, completedAt: new Date().toISOString() } : item,
      )
      commit({ ...data, interviews: [session, ...interviews] })
      navigate('interview')
    },

    setInterviewResponse: (stage, text) => {
      const session = activeInterview()
      if (!session) return
      replaceInterview({ ...session, responses: { ...session.responses, [stage]: text } }, true)
    },

    scoreInterviewStage: (stage, score) => {
      const session = activeInterview()
      if (!session) return
      replaceInterview({ ...session, scores: { ...session.scores, [stage]: score } })
    },

    moveInterviewStage: (delta) => {
      const session = activeInterview()
      if (!session) return
      const stageIndex = Math.max(0, Math.min(INTERVIEW_STAGES.length, session.stageIndex + delta))
      replaceInterview({ ...session, stageIndex })
    },

    finishInterview: () => {
      const session = activeInterview()
      if (!session) return
      replaceInterview({ ...session, stageIndex: INTERVIEW_STAGES.length, completedAt: new Date().toISOString() })
    },

    abandonInterview: () => {
      const session = activeInterview()
      if (!session) return
      const data = get().data
      commit({ ...data, interviews: data.interviews.filter((item) => item.id !== session.id) })
    },

    /* ── Weekly challenges ────────────────────────────────────────────────── */

    toggleMilestone: (challengeId, index) => {
      const data = get().data
      const done = data.challenges[challengeId] ?? []
      const next = done.includes(index) ? done.filter((i) => i !== index) : [...done, index]
      commit({ ...data, challenges: { ...data.challenges, [challengeId]: next } })
    },

    resetAll: () => {
      const data = emptyState()
      commit(data)
      set({ screen: 'dashboard', moduleId: null, topicId: null, problemId: null, viewedExamId: null })
    },
  }
})

export function selectActiveRevision(data: GoDsaState) {
  return data.revisions.find((round) => round.completedAt === null) ?? null
}

export function selectActiveExam(data: GoDsaState) {
  return data.exams.find((exam) => exam.submittedAt === null) ?? null
}

/** The interview on screen: the live one, else the most recently finished. */
export function selectCurrentInterview(data: GoDsaState) {
  return data.interviews.find((session) => session.completedAt === null) ?? data.interviews[0] ?? null
}
