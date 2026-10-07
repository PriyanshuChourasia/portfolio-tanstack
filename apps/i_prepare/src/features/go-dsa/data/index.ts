import type { Module, Problem, Topic } from '../types'
import { MODULE_01, MODULE_02 } from './go-fundamentals'
import { MODULE_03 } from './go-functions'
import { MODULE_04, MODULE_05 } from './go-collections'
import { MODULE_06, MODULE_07 } from './go-types'
import { MODULE_08, MODULE_09 } from './go-packages-errors'
import { MODULE_10 } from './go-concurrency'
import { MODULE_11, MODULE_12, MODULE_13 } from './go-advanced'
import { MODULE_14, MODULE_15 } from './go-stdlib'
import { MODULE_16, MODULE_17 } from './go-testing-tooling'
import { MODULE_18 } from './dsa-fundamentals'
import { MODULE_19, MODULE_20, MODULE_21 } from './dsa-linear'
import { MODULE_22, MODULE_23, MODULE_24 } from './dsa-trees'
import { MODULE_25, MODULE_26, MODULE_27 } from './dsa-graphs'
import { MODULE_28 } from './dsa-advanced'
import { MODULE_29, MODULE_30 } from './algorithms'
import { MODULE_31 } from './dp'
import { MODULE_32, MODULE_33 } from './greedy-bits'
import { PRODUCTION_PROBLEMS } from './production'
import { WEEKLY_CHALLENGES } from './challenges'

export const MODULES: Module[] = [
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
  MODULE_18,
  MODULE_19,
  MODULE_20,
  MODULE_21,
  MODULE_22,
  MODULE_23,
  MODULE_24,
  MODULE_25,
  MODULE_26,
  MODULE_27,
  MODULE_28,
  MODULE_29,
  MODULE_30,
  MODULE_31,
  MODULE_32,
  MODULE_33,
]

export { PRODUCTION_PROBLEMS, WEEKLY_CHALLENGES }

/** Synthetic topic that hosts production-mode problems in the shared workspace. */
export const PRODUCTION_TOPIC_ID = 'production'

export interface ProblemEntry {
  module: Module | null
  topic: Topic | null
  problem: Problem
}

const PROBLEM_INDEX = new Map<string, ProblemEntry>()
const TOPIC_INDEX = new Map<string, { module: Module; topic: Topic }>()

for (const module of MODULES) {
  for (const topic of module.topics) {
    TOPIC_INDEX.set(topic.id, { module, topic })
    for (const problem of topic.problems) {
      PROBLEM_INDEX.set(problem.id, { module, topic, problem })
    }
  }
}
for (const problem of PRODUCTION_PROBLEMS) {
  PROBLEM_INDEX.set(problem.id, { module: null, topic: null, problem })
}

export function getModule(moduleId: string): Module | undefined {
  return MODULES.find((module) => module.id === moduleId)
}

export function getTopic(topicId: string): { module: Module; topic: Topic } | undefined {
  return TOPIC_INDEX.get(topicId)
}

export function getProblem(problemId: string): ProblemEntry | undefined {
  return PROBLEM_INDEX.get(problemId)
}

export function allTopics(): Array<{ module: Module; topic: Topic }> {
  return [...TOPIC_INDEX.values()]
}

export function allProblems(): ProblemEntry[] {
  return [...PROBLEM_INDEX.values()]
}

export function syllabusProblems(): ProblemEntry[] {
  return allProblems().filter((entry) => entry.topic !== null)
}

export function totals() {
  const topics = allTopics().length
  const problems = syllabusProblems().length
  return { modules: MODULES.length, topics, problems, production: PRODUCTION_PROBLEMS.length }
}
