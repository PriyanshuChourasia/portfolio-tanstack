import { useInterviewStore } from './store'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, ArrowRight, Send,
  CheckCircle2, AlertCircle, Target,
  Clock, Zap,
} from 'lucide-react'

const DIFFICULTY_LABELS: Record<number, string> = {
  1: 'Basic',
  2: 'Intermediate',
  3: 'Advanced',
  4: 'Senior',
  5: 'Staff/Architect',
}

const CATEGORY_COLORS: Record<string, string> = {
  'Java Fundamentals': 'bg-blue-500/20 text-blue-400',
  'OOP / LLD': 'bg-purple-500/20 text-purple-400',
  'Java 21/25/26': 'bg-orange-500/20 text-orange-400',
  'Collections / Generics / Streams': 'bg-cyan-500/20 text-cyan-400',
  'JVM / Memory / GC': 'bg-red-500/20 text-red-400',
  'Concurrency': 'bg-yellow-500/20 text-yellow-400',
  'DSA / Algorithms': 'bg-green-500/20 text-green-400',
  'Coding / Practical': 'bg-indigo-500/20 text-indigo-400',
  'SQL / Database': 'bg-teal-500/20 text-teal-400',
  'Kafka / Messaging': 'bg-pink-500/20 text-pink-400',
  'Go': 'bg-emerald-500/20 text-emerald-400',
  'System Design': 'bg-violet-500/20 text-violet-400',
  'Debugging / Production': 'bg-slate-500/20 text-slate-400',
  'Security / Testing / Performance': 'bg-amber-500/20 text-amber-400',
  'Design Patterns': 'bg-rose-500/20 text-rose-400',
  'Cross-Technology': 'bg-sky-500/20 text-sky-400',
}

export function InterviewPage() {
  const {
    currentQuestion, currentIndex, questions, isActive, isComplete,
    answers, evaluations, nextQuestion, prevQuestion, submitAnswer,
    submitEvaluation, startInterview, resetInterview, getProgress,
  } = useInterviewStore()

  const [answerText, setAnswerText] = useState('')
  const [showEvaluation, setShowEvaluation] = useState(false)
  const [interviewMode, setInterviewMode] = useState<string>('mixed')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [started, setStarted] = useState(false)

  if (!started) {
    return (
      <div className="max-w-2xl mx-auto p-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto">
            <Zap className="size-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold">Senior Software Engineer Interview</h1>
          <p className="text-muted-foreground text-lg">
            A mixed interview covering Java, Go, OOP, DSA, System Design, and more
          </p>
        </div>

        <div className="border border-border rounded-xl p-6 space-y-6 bg-card">
          <h2 className="text-xl font-bold">Configure Your Interview</h2>
          
          <div>
            <label className="text-sm font-semibold mb-2 block">Interview Mode</label>
            <select
              value={interviewMode}
              onChange={(e) => setInterviewMode(e.target.value)}
              className="w-full p-3 rounded-lg bg-background border border-border text-foreground"
            >
              <option value="mixed">Mixed (All Topics)</option>
              <option value="java-only">Java Only</option>
              <option value="go-only">Go Only</option>
              <option value="dsa-only">DSA / Algorithms</option>
              <option value="system-design">System Design</option>
              <option value="coding">Coding / Practical</option>
              <option value="debugging">Debugging / Production</option>
              <option value="rapid-fire">Rapid Fire</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold mb-2 block">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full p-3 rounded-lg bg-background border border-border text-foreground"
              >
                <option value="">Any</option>
                <option value="1">Basic</option>
                <option value="2">Intermediate</option>
                <option value="3">Advanced</option>
                <option value="4">Senior</option>
                <option value="5">Staff/Architect</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 rounded-lg bg-background border border-border text-foreground"
              >
                <option value="">Any</option>
                <option value="Java Fundamentals">Java Fundamentals</option>
                <option value="OOP / LLD">OOP / LLD</option>
                <option value="Java 21/25/26">Java 21/25/26</option>
                <option value="Concurrency">Concurrency</option>
                <option value="DSA / Algorithms">DSA / Algorithms</option>
                <option value="Go">Go</option>
                <option value="System Design">System Design</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => {
              const mode = interviewMode as any
              const cat = selectedCategory || undefined
              const diff = selectedDifficulty ? parseInt(selectedDifficulty) as any : undefined
              startInterview(mode, cat, diff)
              setStarted(true)
            }}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity"
          >
            <Zap className="size-5 inline mr-2" />
            Start Interview
          </button>
        </div>
      </div>
    )
  }

  if (isComplete || !currentQuestion) {
    const evalList = Object.values(evaluations) as any[]
    const strongCount = evalList.filter((e: any) => e.score === 'Strong').length
    const accuracy = questions.length > 0 ? (strongCount / questions.length) * 100 : 0

    return (
      <div className="max-w-3xl mx-auto p-8 space-y-6">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto">
            <CheckCircle2 className="size-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold">Interview Complete!</h1>
          <p className="text-muted-foreground text-lg">
            You answered {questions.length} questions
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="p-6 rounded-xl border border-border bg-card text-center">
            <p className="text-3xl font-bold">{questions.length}</p>
            <p className="text-sm text-muted-foreground">Questions</p>
          </div>
          <div className="p-6 rounded-xl border border-border bg-card text-center">
            <p className="text-3xl font-bold text-green-400">{strongCount}</p>
            <p className="text-sm text-muted-foreground">Strong</p>
          </div>
          <div className="p-6 rounded-xl border border-border bg-card text-center">
            <p className="text-3xl font-bold text-primary">{accuracy.toFixed(0)}%</p>
            <p className="text-sm text-muted-foreground">Accuracy</p>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">Detailed Evaluation</h3>
          {evalList.map((evaluation: any, i: number) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              {evaluation.score === 'Strong' ? (
                <CheckCircle2 className="size-5 text-green-400" />
              ) : (
                <AlertCircle className="size-5 text-yellow-400" />
              )}
              <div>
                <p className="text-sm font-medium">{evaluation.title}</p>
                <span className="text-xs bg-muted px-2 py-0.5 rounded">{evaluation.score}</span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => { resetInterview(); setStarted(false) }}
          className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity"
        >
          <Zap className="size-5 inline mr-2" />
          New Interview
        </button>
      </div>
    )
  }

  const evaluation = evaluations[currentQuestion.id]
  const progress = getProgress()

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm bg-muted px-3 py-1 rounded-full">
            Q{progress.current} / {progress.total}
          </span>
          <span className="text-sm bg-muted px-3 py-1 rounded-full">
            {DIFFICULTY_LABELS[currentQuestion.difficulty]}
          </span>
          <span className={`text-sm px-3 py-1 rounded-full ${CATEGORY_COLORS[currentQuestion.category] || 'bg-gray-500/20 text-gray-400'}`}>
            {currentQuestion.category}
          </span>
        </div>
        <span className="text-sm text-muted-foreground">{progress.percentage.toFixed(0)}%</span>
      </div>

      <div className="border border-border rounded-xl bg-card shadow-card">
        <div className="p-6 border-b border-border">
          <h2 className="text-2xl font-bold">{currentQuestion.title}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {currentQuestion.type === 'coding' && '💻 Coding'}
            {currentQuestion.type === 'theory' && '📖 Theory'}
            {currentQuestion.type === 'debugging' && '🐛 Debugging'}
            {currentQuestion.type === 'system-design' && '🏗️ System Design'}
            {currentQuestion.type === 'scenario' && '🎯 Scenario'}
            {currentQuestion.type === 'trick' && '🤔 Trick Question'}
          </p>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-base leading-relaxed">{currentQuestion.question}</p>
          
          {currentQuestion.followUps.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-muted-foreground">Follow-up questions:</p>
              {currentQuestion.followUps.map((fu, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <ArrowRight className="size-3 mt-1 shrink-0 text-primary" />
                  <span>{fu}</span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4">
            <label className="text-sm font-semibold mb-2 block">Your Answer</label>
            <textarea
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full min-h-[120px] p-4 rounded-lg bg-background border border-border text-foreground resize-none"
            />
          </div>
        </div>
        <div className="p-6 border-t border-border flex justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => { prevQuestion(); setAnswerText(''); setShowEvaluation(false); }}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 text-sm"
            >
              <ArrowLeft className="size-4 inline mr-1" /> Previous
            </button>
            <button
              onClick={() => { submitAnswer(answerText); setShowEvaluation(true); }}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:opacity-90"
            >
              <Send className="size-4 inline mr-1" /> Submit Answer
            </button>
          </div>
          <button
            onClick={() => nextQuestion()}
            className="px-4 py-2 rounded-lg border border-border hover:bg-muted text-sm"
          >
            Next <ArrowRight className="size-4 inline ml-1" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showEvaluation && evaluation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="border border-primary/30 rounded-xl bg-card overflow-hidden"
          >
            <div className="p-6 border-b border-border">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Target className="size-5 text-primary" />
                Interviewer Evaluation
              </h3>
              <span className="text-sm bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">{evaluation.score}</span>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-green-400">What you explained well:</h4>
                <ul className="space-y-1">
                  {evaluation.doneWell.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm">✓ {item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-yellow-400">What you missed:</h4>
                <ul className="space-y-1">
                  {evaluation.missing.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm">! {item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-red-400">Technical corrections:</h4>
                <ul className="space-y-1">
                  {evaluation.corrections.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm">→ {item}</li>
                  ))}
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-semibold mb-2">Senior-level expectation:</h4>
                <p className="text-sm">{evaluation.seniorExpectation}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30">
                <h4 className="font-semibold mb-2">Better answer:</h4>
                <p className="text-sm">{evaluation.betterAnswer}</p>
              </div>
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <h4 className="font-semibold mb-2 text-blue-400">Follow-up:</h4>
                <p className="text-sm text-blue-300">{evaluation.followUp}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
