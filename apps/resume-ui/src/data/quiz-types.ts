export interface QuizQuestion {
  id: string
  section: string
  question: string
  options: [string, string, string, string]
  correctIndex: 0 | 1 | 2 | 3
  explanation: string
}

export interface QuizConfig {
  title: string
  durationMinutes: number
  marksPerQuestion: number
  negativeMarking: number
  storageKey: string
  sections: string[]
  questions: QuizQuestion[]
}
