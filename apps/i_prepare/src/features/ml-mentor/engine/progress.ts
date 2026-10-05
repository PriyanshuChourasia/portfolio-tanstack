import type {
  AssessmentResult,
  BaselineEvaluation,
  MLModule,
  ModuleProgress,
  ModuleStatusSummary,
  ProgressState,
  ProgressStatus,
  TopicProgress,
  WeakArea,
} from '../types'
import { MODULE_TEST_PASS_PERCENTAGE, WEAK_TOPIC_THRESHOLD } from '../types'
import { ML_MODULES, allTopics } from '../data'

/**
 * Progress engine — pure functions over the persisted ProgressState.
 * The store calls these; components only read.
 */

export function emptyProgress(): ProgressState {
  const topics: Record<string, TopicProgress> = {}
  const modules: Record<string, ModuleProgress> = {}
  for (const module of ML_MODULES) {
    modules[module.id] = {
      moduleId: module.id,
      bestTestPercentage: null,
      testAttempts: 0,
      interviewAnswered: 0,
    }
    for (const topic of module.topics) {
      topics[topic.id] = {
        topicId: topic.id,
        moduleId: module.id,
        status: 'not_started',
        score: null,
        attempts: 0,
        lessonRead: false,
        practiceDone: false,
        codingDone: false,
        interviewDone: false,
        lastStudiedAt: null,
      }
    }
  }
  return {
    baselineDone: false,
    startingModuleId: null,
    currentModuleId: ML_MODULES[0].id,
    topics,
    modules,
    weakTopics: [],
  }
}

/** Merge a persisted snapshot over the defaults, tolerating schema evolution. */
export function hydrateProgress(stored: Partial<ProgressState> | null): ProgressState {
  const base = emptyProgress()
  if (!stored) return base

  const merged: ProgressState = {
    ...base,
    ...stored,
    topics: { ...base.topics },
    modules: { ...base.modules },
  }

  for (const [topicId, storedTopic] of Object.entries(stored.topics ?? {})) {
    if (base.topics[topicId] && storedTopic) {
      merged.topics[topicId] = { ...base.topics[topicId], ...storedTopic, topicId }
    }
  }
  for (const [moduleId, storedModule] of Object.entries(stored.modules ?? {})) {
    if (base.modules[moduleId] && storedModule) {
      merged.modules[moduleId] = { ...base.modules[moduleId], ...storedModule, moduleId }
    }
  }
  // Never let a stale snapshot lock the user out of a valid module.
  if (!ML_MODULES.some((m) => m.id === merged.currentModuleId)) {
    merged.currentModuleId = ML_MODULES[0].id
  }
  return merged
}

/** Topic score 0–10: latest assessment result for that topic. */
export function scoreForTopic(topics: Record<string, TopicProgress>, topicId: string): number | null {
  return topics[topicId]?.score ?? null
}

function statusForProgress(topic: TopicProgress): ProgressStatus {
  if (topic.score !== null && topic.score < WEAK_TOPIC_THRESHOLD) return 'needs_revision'
  if (topic.lessonRead && topic.practiceDone && topic.interviewDone && topic.score !== null) {
    return 'completed'
  }
  if (topic.lessonRead || topic.practiceDone || topic.interviewDone || topic.attempts > 0) {
    return 'in_progress'
  }
  return 'not_started'
}

export function refreshTopicStatus(topics: Record<string, TopicProgress>): Record<string, TopicProgress> {
  const next: Record<string, TopicProgress> = {}
  for (const [id, topic] of Object.entries(topics)) {
    next[id] = { ...topic, status: statusForProgress(topic) }
  }
  return next
}

/** Applies an assessment: updates topic scores, counts attempts, flags weak topics. */
export function applyAssessment(
  state: ProgressState,
  result: AssessmentResult,
): ProgressState {
  const topics = refreshTopicStatus(state.topics)
  for (const question of result.questionResults) {
    if (!question.topicId) continue
    const topic = topics[question.topicId]
    if (!topic) continue
    // Keep the best score; a re-test can only improve a topic's standing.
    const newScore = question.correct ? 10 : Math.max(0, (topic.score ?? 0) - 0)
    topic.score = topic.score === null ? (question.correct ? 8 : 4) : Math.max(topic.score, newScore)
    topic.attempts += 1
    topic.lastStudiedAt = result.submittedAt
  }

  const modules = { ...state.modules }
  if (result.moduleId) {
    const module = modules[result.moduleId] ?? {
      moduleId: result.moduleId,
      bestTestPercentage: null,
      testAttempts: 0,
      interviewAnswered: 0,
    }
    modules[result.moduleId] = {
      ...module,
      testAttempts: module.testAttempts + 1,
      bestTestPercentage: Math.max(module.bestTestPercentage ?? 0, result.percentage),
    }
  }

  const updated: ProgressState = { ...state, topics, modules }
  return { ...updated, weakTopics: computeWeakTopics(updated).map((w) => w.topicId) }
}

/** Marks one checkbox (lesson/practice/coding/interview) on a topic. */
export function markTopicStep(
  state: ProgressState,
  topicId: string,
  step: 'lessonRead' | 'practiceDone' | 'codingDone' | 'interviewDone',
): ProgressState {
  const topic = state.topics[topicId]
  if (!topic) return state
  const topics = refreshTopicStatus({
    ...state.topics,
    [topicId]: { ...topic, [step]: true, lastStudiedAt: new Date().toISOString() },
  })
  return { ...state, topics }
}

/** A module is unlocked when it is the current one or already completed well. */
export function isModuleUnlocked(state: ProgressState, moduleId: string): boolean {
  const index = ML_MODULES.findIndex((m) => m.id === moduleId)
  if (index <= 0) return true
  const previous = ML_MODULES[index - 1]
  if (state.modules[previous.id]?.bestTestPercentage !== null &&
      (state.modules[previous.id]?.bestTestPercentage ?? 0) >= MODULE_TEST_PASS_PERCENTAGE) {
    return true
  }
  // Walk back: module unlocked if ANY ancestor chain reached the current pointer.
  return state.currentModuleId === moduleId || moduleIndex(state.currentModuleId) >= index
}

function moduleIndex(moduleId: string): number {
  return ML_MODULES.findIndex((m) => m.id === moduleId)
}

export function moduleSummaries(state: ProgressState): ModuleStatusSummary[] {
  return ML_MODULES.map((module) => {
    const progress = state.modules[module.id]
    const topicStates = module.topics.map((topic) => state.topics[topic.id])
    const completed = topicStates.filter((t) => t.status === 'completed').length
    const scored = topicStates.filter((t) => t.score !== null)
    const averageScore =
      scored.length > 0 ? scored.reduce((sum, t) => sum + (t.score ?? 0), 0) / scored.length : null

    let status: ProgressStatus = 'not_started'
    if (completed === module.topics.length && completed > 0) status = 'completed'
    else if (completed > 0 || topicStates.some((t) => t.status === 'in_progress')) status = 'in_progress'
    if (
      progress?.bestTestPercentage !== null &&
      (progress?.bestTestPercentage ?? 0) < MODULE_TEST_PASS_PERCENTAGE &&
      progress?.testAttempts > 0
    ) {
      status = 'needs_revision'
    }

    return {
      module,
      status,
      topicsCompleted: completed,
      totalTopics: module.topics.length,
      averageScore,
      bestTestPercentage: progress?.bestTestPercentage ?? null,
      interviewAnswered: progress?.interviewAnswered ?? 0,
      testAttempts: progress?.testAttempts ?? 0,
    }
  })
}

/** Weak areas: low scores, failed tests and never-tested completed topics. */
export function computeWeakTopics(state: ProgressState): WeakArea[] {
  const weak: WeakArea[] = []
  for (const module of ML_MODULES) {
    for (const topic of module.topics) {
      const progress = state.topics[topic.id]
      if (!progress) continue
      const moduleProgress = state.modules[module.id]
      const testFailed =
        moduleProgress?.testAttempts > 0 &&
        (moduleProgress?.bestTestPercentage ?? 100) < MODULE_TEST_PASS_PERCENTAGE
      if (progress.score !== null && progress.score < WEAK_TOPIC_THRESHOLD) {
        weak.push({
          topicId: topic.id,
          moduleId: module.id,
          topicTitle: topic.title,
          moduleTitle: module.shortTitle,
          score: progress.score,
          reason: 'low_score',
        })
      } else if (testFailed && progress.attempts === 0) {
        weak.push({
          topicId: topic.id,
          moduleId: module.id,
          topicTitle: topic.title,
          moduleTitle: module.shortTitle,
          score: progress.score,
          reason: 'failed_test',
        })
      }
    }
  }
  return weak.sort((a, b) => (a.score ?? 0) - (b.score ?? 0)).slice(0, 8)
}

/** Next unstarted/in-progress topic inside a module, for the daily session. */
export function nextTopicInModule(module: MLModule, state: ProgressState) {
  for (const topic of module.topics) {
    const progress = state.topics[topic.id]
    if (!progress || progress.status !== 'completed') return topic
  }
  return module.topics[module.topics.length - 1]
}

/** Overall completion across all modules, 0–100. */
export function overallCompletion(state: ProgressState): number {
  const total = allTopics().length
  const done = Object.values(state.topics).filter((t) => t.status === 'completed').length
  return total === 0 ? 0 : Math.round((done / total) * 100)
}

/** Applies baseline placement: starting module, initial weak areas. */
export function applyBaseline(state: ProgressState, evaluation: BaselineEvaluation): ProgressState {
  return {
    ...state,
    baselineDone: true,
    startingModuleId: evaluation.startingModuleId,
    currentModuleId: evaluation.startingModuleId,
    weakTopics: evaluation.weakAreas,
  }
}
