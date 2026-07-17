import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Monitor,
  Server,
  Cloud,
  Users,
  Network,
  ChevronRight,
  Bot,
  User,
  ArrowLeft,
} from 'lucide-react'
import {
  interviewCategories,
  type InterviewCategory,
} from '../data/interview-data'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Monitor,
  Server,
  Cloud,
  Users,
  Network,
}

interface Message {
  id: string
  role: 'question' | 'answer'
  content: string
}

export default function AIInterviewPage() {
  const [activeCategory, setActiveCategory] = useState<InterviewCategory>(
    interviewCategories[0],
  )
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [started, setStarted] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const startInterview = () => {
    setStarted(true)
    setMessages([])
    setCurrentQuestionIndex(0)
    const q = activeCategory.questions[0]
    setMessages([
      { id: `q-${q.id}`, role: 'question', content: q.question },
    ])
    setIsTyping(true)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: `a-${q.id}`, role: 'answer', content: q.answer },
      ])
      setIsTyping(false)
    }, 1200)
  }

  const nextQuestion = () => {
    if (currentQuestionIndex >= activeCategory.questions.length - 1) return
    const nextIdx = currentQuestionIndex + 1
    setCurrentQuestionIndex(nextIdx)
    const q = activeCategory.questions[nextIdx]
    setIsTyping(true)
    setMessages((prev) => [
      ...prev,
      { id: `q-${q.id}`, role: 'question', content: q.question },
    ])
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: `a-${q.id}`, role: 'answer', content: q.answer },
      ])
      setIsTyping(false)
    }, 1200)
  }

  const switchCategory = (cat: InterviewCategory) => {
    setActiveCategory(cat)
    setCurrentQuestionIndex(0)
    setMessages([])
    setStarted(false)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Interview <span className="text-cyan-500">Prep</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Practice questions across key categories with detailed answers.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 max-w-5xl mx-auto">
          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-1.5"
          >
            {interviewCategories.map((cat) => {
              const Icon = iconMap[cat.id] ?? Users
              const active = cat.id === activeCategory.id
              return (
                <button
                  key={cat.id}
                  onClick={() => switchCategory(cat)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left text-sm transition-colors ${
                    active
                      ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-medium'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="flex-1">{cat.label}</span>
                  <span className="text-xs opacity-50">
                    {cat.questions.length}
                  </span>
                </button>
              )
            })}
          </motion.aside>

          {/* Main */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden"
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                {started && (
                  <button
                    onClick={() => {
                      setStarted(false)
                      setMessages([])
                    }}
                    className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    <ArrowLeft className="size-4" />
                  </button>
                )}
                <h2 className="text-sm font-medium text-slate-900 dark:text-white">
                  {activeCategory.label}
                </h2>
              </div>
              {started && (
                <span className="text-xs text-slate-400 dark:text-slate-500 tabular-nums">
                  {currentQuestionIndex + 1}/{activeCategory.questions.length}
                </span>
              )}
            </div>

            {/* Chat Messages */}
            <div className="px-5 py-6 space-y-5 min-h-[420px] max-h-[520px] overflow-y-auto custom-scrollbar">
              {!started && (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <p className="text-sm text-slate-400 dark:text-slate-500 mb-5">
                    {activeCategory.questions.length} questions in this category
                  </p>
                  <button
                    onClick={startInterview}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    Begin
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              )}

              <AnimatePresence mode="popLayout">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-2.5 ${
                      msg.role === 'question' ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    {msg.role === 'question' && (
                      <div className="size-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                        <User className="size-3.5 text-slate-400" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === 'question'
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm'
                          : 'bg-cyan-50 dark:bg-cyan-500/10 text-slate-700 dark:text-slate-300 rounded-tr-sm border border-cyan-100 dark:border-cyan-500/15'
                      }`}
                    >
                      {msg.role === 'answer' && (
                        <span className="block text-[10px] font-medium uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-1">
                          Answer
                        </span>
                      )}
                      {msg.content}
                    </div>
                    {msg.role === 'answer' && (
                      <div className="size-7 rounded-full bg-cyan-500 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="size-3.5 text-white" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2.5"
                >
                  <div className="size-7 rounded-full bg-cyan-500 flex items-center justify-center shrink-0">
                    <Bot className="size-3.5 text-white" />
                  </div>
                  <div className="bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-100 dark:border-cyan-500/15 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1">
                      <span className="size-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0ms]" />
                      <span className="size-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:150ms]" />
                      <span className="size-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Footer */}
            {started && (
              <div className="px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                <button
                  onClick={nextQuestion}
                  disabled={
                    isTyping ||
                    currentQuestionIndex >=
                      activeCategory.questions.length - 1
                  }
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="size-4" />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
