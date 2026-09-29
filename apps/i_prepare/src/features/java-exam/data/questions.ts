import type { JavaQuestion, JavaQuestionInput } from '../types'
import { fundamentalsQuestions } from './fundamentals'
import { oopQuestions } from './oop'
import { collectionsQuestions } from './collections'
import { genericsExceptionsQuestions } from './generics-exceptions'
import { streamsQuestions } from './streams'
import { jvmMemoryQuestions } from './jvm-memory'
import { concurrencyQuestions } from './concurrency'
import { backendQuestions } from './backend'
import { dsaDesignQuestions } from './dsa-design'

/**
 * Java question bank — aggregated from the per-domain files in this folder.
 * Add questions to a domain file; nothing else needs to change.
 */
export const JAVA_QUESTIONS: JavaQuestion[] = [
  ...fundamentalsQuestions,
  ...oopQuestions,
  ...collectionsQuestions,
  ...genericsExceptionsQuestions,
  ...streamsQuestions,
  ...jvmMemoryQuestions,
  ...concurrencyQuestions,
  ...backendQuestions,
  ...dsaDesignQuestions,
]

export * from './fundamentals'
export * from './oop'
export * from './collections'
export * from './generics-exceptions'
export * from './streams'
export * from './jvm-memory'
export * from './concurrency'
export * from './backend'
export * from './dsa-design'

// Re-exported so domain files can share the input type without deep imports.
export type { JavaQuestionInput }
