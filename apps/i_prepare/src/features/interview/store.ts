import { create } from 'zustand'
import type { Question, Category, Difficulty, Evaluation } from '@/features/interview/data/questions'
import { getRandomQuestion, getQuestionsByCategory, getTotalQuestions, getCategoryCount } from '@/features/interview/data/questions'

interface InterviewState {
  // Core state
  questions: Question[]
  currentIndex: number
  isActive: boolean
  isComplete: boolean
  
  // Tracking
  answers: Record<string, string>
  evaluations: Record<string, Evaluation>
  currentQuestion: Question | null
  
  // Filters
  category: Category | undefined
  difficulty: Difficulty | undefined
  mode: 'mixed' | 'java-only' | 'go-only' | 'dsa-only' | 'system-design' | 'coding' | 'debugging' | 'rapid-fire'
  
  // Stats
  totalQuestionsAnswered: number
  correctCount: number
  
  // Actions
  startInterview: (mode?: string, category?: Category, difficulty?: Difficulty) => void
  nextQuestion: () => void
  prevQuestion: () => void
  submitAnswer: (answer: string) => void
  submitEvaluation: (evaluation: Evaluation) => void
  skipQuestion: () => void
  resetInterview: () => void
  setMode: (mode: string) => void
  setCategory: (category: Category | undefined) => void
  setDifficulty: (difficulty: Difficulty | undefined) => void
  getProgress: () => { current: number; total: number; percentage: number }
  getStats: () => { answered: number; accuracy: number }
}

const DEFAULT_QUESTIONS = [
  'jf-1', 'jf-2', 'jf-3',
  'oop-1', 'oop-2', 'oop-3',
  'java21-1', 'java21-2', 'java25-1',
  'coll-1', 'coll-2', 'coll-3',
  'jvm-1', 'jvm-2',
  'conc-1', 'conc-2', 'conc-3',
  'dsa-1', 'dsa-2', 'dsa-3', 'dsa-4',
  'code-1', 'code-2', 'code-3',
  'sql-1', 'sql-2', 'sql-3',
  'kafka-1', 'kafka-2',
  'go-1', 'go-2', 'go-3',
  'sd-1', 'sd-2', 'sd-3',
  'dbg-1', 'dbg-2',
  'sec-1', 'perf-1', 'perf-2',
  'dp-1', 'dp-2',
  'ct-1', 'ct-2',
]

const CATEGORY_MAP: Record<string, string[]> = {
  'Java Fundamentals': ['jf-1', 'jf-2', 'jf-3'],
  'OOP / LLD': ['oop-1', 'oop-2', 'oop-3'],
  'Java 21/25/26': ['java21-1', 'java21-2', 'java25-1'],
  'Collections / Generics / Streams': ['coll-1', 'coll-2', 'coll-3'],
  'JVM / Memory / GC': ['jvm-1', 'jvm-2'],
  'Concurrency': ['conc-1', 'conc-2', 'conc-3'],
  'DSA / Algorithms': ['dsa-1', 'dsa-2', 'dsa-3', 'dsa-4'],
  'Coding / Practical': ['code-1', 'code-2', 'code-3'],
  'SQL / Database': ['sql-1', 'sql-2', 'sql-3'],
  'Kafka / Messaging': ['kafka-1', 'kafka-2'],
  'Go': ['go-1', 'go-2', 'go-3'],
  'System Design': ['sd-1', 'sd-2', 'sd-3'],
  'Debugging / Production': ['dbg-1', 'dbg-2'],
  'Security / Testing / Performance': ['sec-1', 'perf-1', 'perf-2'],
  'Design Patterns': ['dp-1', 'dp-2'],
  'Cross-Technology': ['ct-1', 'ct-2'],
}

const MODE_MAP: Record<string, string[]> = {
  mixed: DEFAULT_QUESTIONS,
  'java-only': ['jf-1', 'jf-2', 'jf-3', 'java21-1', 'java21-2', 'java25-1', 'coll-1', 'coll-2', 'coll-3', 'jvm-1', 'jvm-2', 'conc-1', 'conc-2', 'conc-3'],
  'go-only': ['go-1', 'go-2', 'go-3'],
  'dsa-only': ['dsa-1', 'dsa-2', 'dsa-3', 'dsa-4'],
  'system-design': ['oop-1', 'oop-3', 'sd-1', 'sd-2', 'sd-3', 'sql-2', 'kafka-1', 'dp-1', 'dp-2'],
  coding: ['code-1', 'code-2', 'code-3', 'dsa-1', 'dsa-2', 'dsa-3', 'dsa-4', 'sql-1'],
  debugging: ['dbg-1', 'dbg-2', 'jvm-2', 'conc-2'],
  'rapid-fire': DEFAULT_QUESTIONS,
}

export const useInterviewStore = create<InterviewState>((set, get) => ({
  questions: [],
  currentIndex: 0,
  isActive: false,
  isComplete: false,
  answers: {},
  evaluations: {},
  currentQuestion: null,
  category: undefined,
  difficulty: undefined,
  mode: 'mixed',
  totalQuestionsAnswered: 0,
  correctCount: 0,

  startInterview: (mode = 'mixed', category?, difficulty?) => {
    let questionIds = MODE_MAP[mode] || MODE_MAP.mixed
    if (category && CATEGORY_MAP[category]) {
      questionIds = CATEGORY_MAP[category]
    }
    const state = get()
    let questions = questionIds
      .map((id) => state.questions.find((q) => q.id === id))
      .filter((q): q is Question => q !== undefined)
    
    if (difficulty) {
      questions = questions.filter((q) => q.difficulty === difficulty)
    }
    
    if (mode === 'rapid-fire') {
      questions = questions.sort(() => Math.random() - 0.5).slice(0, 10)
    }
    
    // Shuffle
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }

    const firstQ = questions[0] || getRandomQuestion()
    set({
      questions,
      currentIndex: 0,
      isActive: true,
      isComplete: false,
      answers: {},
      evaluations: {},
      currentQuestion: firstQ,
      mode: mode as any,
      category,
      difficulty,
      totalQuestionsAnswered: 0,
      correctCount: 0,
    })
  },

  nextQuestion: () => {
    const { questions, currentIndex } = get()
    if (currentIndex + 1 < questions.length) {
      const nextQ = questions[currentIndex + 1]
      set({ currentIndex: currentIndex + 1, currentQuestion: nextQ })
    } else {
      set({ isComplete: true, isActive: false })
    }
  },

  prevQuestion: () => {
    const { currentIndex } = get()
    if (currentIndex > 0) {
      const prevQ = get().questions[currentIndex - 1]
      set({ currentIndex: currentIndex - 1, currentQuestion: prevQ })
    }
  },

  submitAnswer: (answer: string) => {
    const { currentQuestion, answers } = get()
    if (currentQuestion) {
      set({
        answers: { ...answers, [currentQuestion.id]: answer },
        totalQuestionsAnswered: get().totalQuestionsAnswered + 1,
      })
    }
  },

  submitEvaluation: (evaluation: Evaluation) => {
    const { currentQuestion, evaluations } = get()
    if (currentQuestion) {
      set({ evaluations: { ...evaluations, [currentQuestion.id]: evaluation } })
    }
  },

  skipQuestion: () => {
    get().nextQuestion()
  },

  resetInterview: () => {
    set({
      questions: [],
      currentIndex: 0,
      isActive: false,
      isComplete: false,
      answers: {},
      evaluations: {},
      currentQuestion: null,
      totalQuestionsAnswered: 0,
      correctCount: 0,
    })
  },

  setMode: (mode) => set({ mode: mode as any }),
  setCategory: (category) => set({ category }),
  setDifficulty: (difficulty) => set({ difficulty }),

  getProgress: () => {
    const { currentIndex, questions } = get()
    return {
      current: currentIndex + 1,
      total: questions.length,
      percentage: questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0,
    }
  },

  getStats: () => {
    const { totalQuestionsAnswered, evaluations } = get()
    return {
      answered: totalQuestionsAnswered,
      accuracy: totalQuestionsAnswered > 0 ? (Object.values(evaluations).filter((e) => e.score === 'Strong').length / totalQuestionsAnswered) * 100 : 0,
    }
  },
}))


