import type { JavaAnswer } from '../types'

/** Fresh answer state for a newly served question. */
export function createEmptyJavaAnswer(sessionId: string, questionId: string): JavaAnswer {
  void sessionId
  return {
    questionId,
    selectedIndex: null,
    selectedIndices: [],
    text: '',
    selfGrade: null,
    markedForReview: false,
    visited: false,
    answeredAt: null,
    timeSpentMs: 0,
  }
}
