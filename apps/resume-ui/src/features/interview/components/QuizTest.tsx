import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, XCircle, MinusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { QuizConfig } from '@/data/quiz-types'

interface StoredState {
  answers: Record<string, number>
  submitted: boolean
}

function loadState(storageKey: string): StoredState {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return { answers: {}, submitted: false }
    const parsed = JSON.parse(raw)
    return {
      answers: parsed.answers ?? {},
      submitted: Boolean(parsed.submitted),
    }
  } catch {
    return { answers: {}, submitted: false }
  }
}

function saveState(storageKey: string, state: StoredState) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state))
  } catch {
    // localStorage unavailable (private mode, quota, etc.) — selections just won't persist.
  }
}

export function QuizTest({ config }: { config: QuizConfig }) {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const state = loadState(config.storageKey)
    setAnswers(state.answers)
    setSubmitted(state.submitted)
    setHydrated(true)
  }, [config.storageKey])

  const selectOption = (questionId: string, optionIndex: number) => {
    if (submitted) return
    setAnswers((prev) => {
      const next = { ...prev, [questionId]: optionIndex }
      saveState(config.storageKey, { answers: next, submitted: false })
      return next
    })
  }

  const handleSubmit = () => {
    setSubmitted(true)
    saveState(config.storageKey, { answers, submitted: true })
  }

  const handleRetake = () => {
    setAnswers({})
    setSubmitted(false)
    saveState(config.storageKey, { answers: {}, submitted: false })
  }

  const result = useMemo(() => {
    let correct = 0
    let wrong = 0
    let unattempted = 0
    const perSection: Record<string, { correct: number; wrong: number; unattempted: number; total: number }> = {}

    for (const section of config.sections) {
      perSection[section] = { correct: 0, wrong: 0, unattempted: 0, total: 0 }
    }

    for (const q of config.questions) {
      const bucket = perSection[q.section]
      if (bucket) bucket.total += 1
      const picked = answers[q.id]
      if (picked === undefined) {
        unattempted += 1
        if (bucket) bucket.unattempted += 1
      } else if (picked === q.correctIndex) {
        correct += 1
        if (bucket) bucket.correct += 1
      } else {
        wrong += 1
        if (bucket) bucket.wrong += 1
      }
    }

    const maxMarks = config.questions.length * config.marksPerQuestion
    const marks = correct * config.marksPerQuestion - wrong * config.negativeMarking

    return { correct, wrong, unattempted, perSection, maxMarks, marks }
  }, [answers, config])

  const attemptedCount = result.correct + result.wrong

  if (!hydrated) return null

  if (submitted) {
    return (
      <div className="space-y-8">
        <div className="rounded-2xl border border-border/60 bg-card p-6 text-center shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Your Score</p>
          <p className="mt-1 text-4xl font-black tracking-tight">
            {result.marks.toFixed(2)} <span className="text-lg font-medium text-muted-foreground">/ {result.maxMarks}</span>
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Badge variant="secondary">Correct: {result.correct}</Badge>
            <Badge variant="destructive">Wrong: {result.wrong}</Badge>
            <Badge variant="outline">Unattempted: {result.unattempted}</Badge>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {config.marksPerQuestion} mark(s) per question, {config.negativeMarking} deducted per wrong answer.
          </p>
          <Button className="mt-5" variant="outline" onClick={handleRetake}>
            Retake Test
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {config.sections.map((section) => {
            const s = result.perSection[section]
            if (!s) return null
            return (
              <div key={section} className="rounded-xl border border-border/60 bg-card p-4">
                <p className="text-sm font-semibold">{section}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {s.correct} correct · {s.wrong} wrong · {s.unattempted} skipped (of {s.total})
                </p>
              </div>
            )
          })}
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground">Review</h3>
          {config.questions.map((q, idx) => {
            const picked = answers[q.id]
            return (
              <div key={q.id} className="rounded-xl border border-border/60 bg-card p-4">
                <p className="whitespace-pre-line text-sm font-medium">
                  {idx + 1}. {q.question}
                </p>
                <div className="mt-3 space-y-1.5">
                  {q.options.map((opt, i) => {
                    const isCorrect = i === q.correctIndex
                    const isPicked = i === picked
                    return (
                      <div
                        key={i}
                        className={cn(
                          'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm',
                          isCorrect && 'border-green-500/50 bg-green-500/10',
                          isPicked && !isCorrect && 'border-destructive/50 bg-destructive/10',
                          !isCorrect && !isPicked && 'border-border/60',
                        )}
                      >
                        {isCorrect ? (
                          <CheckCircle2 className="size-4 shrink-0 text-green-600" />
                        ) : isPicked ? (
                          <XCircle className="size-4 shrink-0 text-destructive" />
                        ) : (
                          <span className="size-4 shrink-0" />
                        )}
                        <span>{opt}</span>
                      </div>
                    )
                  })}
                  {picked === undefined && (
                    <p className="flex items-center gap-1.5 pt-1 text-xs text-muted-foreground">
                      <MinusCircle className="size-3.5" /> Not attempted
                    </p>
                  )}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">{q.explanation}</p>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/95 p-4 backdrop-blur">
        <div>
          <p className="text-sm font-semibold">{config.title}</p>
          <p className="text-xs text-muted-foreground">
            {config.questions.length} questions · {config.durationMinutes} min · +{config.marksPerQuestion} / -{config.negativeMarking} marking
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            Attempted {attemptedCount} / {config.questions.length}
          </span>
          <Button onClick={handleSubmit}>Submit Test</Button>
        </div>
      </div>

      <div className="space-y-4">
        {config.questions.map((q, idx) => (
          <div key={q.id} className="rounded-xl border border-border/60 bg-card p-4">
            <p className="whitespace-pre-line text-sm font-medium">
              {idx + 1}. {q.question}
            </p>
            <div className="mt-3 space-y-1.5">
              {q.options.map((opt, i) => {
                const selected = answers[q.id] === i
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => selectOption(q.id, i)}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors',
                      selected
                        ? 'border-primary bg-primary/10'
                        : 'border-border/60 hover:border-border hover:bg-muted/30',
                    )}
                  >
                    <span
                      className={cn(
                        'flex size-4 shrink-0 items-center justify-center rounded-full border',
                        selected ? 'border-primary bg-primary' : 'border-border',
                      )}
                    >
                      {selected && <span className="size-1.5 rounded-full bg-primary-foreground" />}
                    </span>
                    {opt}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSubmit}>Submit Test</Button>
      </div>
    </div>
  )
}
