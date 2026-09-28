import { useMemo, useState } from 'react'
import { CheckCircle2, ChevronDown, MinusCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { TestResult } from '@/data/reasoning'
import { cn } from '@/lib/utils'
import { DIFFICULTY_LABELS, formatSeconds } from '../engine/evaluation'
import { OptionSelector } from './OptionSelector'

type Filter = 'all' | 'correct' | 'incorrect' | 'unanswered' | 'marked'

const FILTERS: Array<{ value: Filter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'correct', label: 'Correct' },
  { value: 'incorrect', label: 'Incorrect' },
  { value: 'unanswered', label: 'Unanswered' },
  { value: 'marked', label: 'Marked for review' },
]

function OutcomeBadge({ outcome }: { outcome: 'correct' | 'incorrect' | 'unanswered' }) {
  if (outcome === 'correct') {
    return (
      <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
        <CheckCircle2 className="size-3.5" /> Correct
      </span>
    )
  }
  if (outcome === 'incorrect') {
    return (
      <span className="flex items-center gap-1 rounded-full bg-destructive/15 px-2.5 py-0.5 text-[11px] font-semibold text-destructive">
        <XCircle className="size-3.5" /> Incorrect
      </span>
    )
  }
  return (
    <span className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
      <MinusCircle className="size-3.5" /> Unanswered
    </span>
  )
}

export function QuestionReview({ result }: { result: TestResult }) {
  const [filter, setFilter] = useState<Filter>('all')
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const counts = useMemo(() => {
    const questions = result.questionResults
    return {
      all: questions.length,
      correct: questions.filter((item) => item.outcome === 'correct').length,
      incorrect: questions.filter((item) => item.outcome === 'incorrect').length,
      unanswered: questions.filter((item) => item.outcome === 'unanswered').length,
      marked: questions.filter((item) => item.markedForReview).length,
    } satisfies Record<Filter, number>
  }, [result.questionResults])

  const visible = result.questionResults.filter((item) => {
    if (filter === 'all') return true
    if (filter === 'marked') return item.markedForReview
    return item.outcome === filter
  })

  const toggle = (questionId: string) => {
    setExpanded((previous) => {
      const next = new Set(previous)
      if (next.has(questionId)) next.delete(questionId)
      else next.add(questionId)
      return next
    })
  }

  return (
    <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Question Review</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Your answer against the correct answer, with the explanation for every question.
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((item) => (
            <Button
              key={item.value}
              size="xs"
              variant={filter === item.value ? 'default' : 'outline'}
              onClick={() => setFilter(item.value)}
            >
              {item.label} ({counts[item.value]})
            </Button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">No questions match this filter.</p>
      ) : (
        <ol className="mt-5 space-y-4">
          {visible.map((item) => {
            const isExpanded = expanded.has(item.questionId)
            return (
              <li key={item.questionId} className="rounded-xl border border-border/60 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold">Q{item.index + 1}</span>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      {item.topic}
                    </span>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      {DIFFICULTY_LABELS[item.difficulty]}
                    </span>
                    {item.markedForReview && (
                      <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                        Marked for review
                      </span>
                    )}
                  </div>
                  <OutcomeBadge outcome={item.outcome} />
                </div>

                <p className="mt-3 whitespace-pre-line text-sm font-medium leading-relaxed">
                  {item.questionText}
                </p>

                <div className="mt-3">
                  <OptionSelector
                    options={item.options}
                    selected={item.selectedOption}
                    reveal
                    correctOption={item.correctOption}
                    disabled
                  />
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[11px] text-muted-foreground">
                  <span>
                    Your answer: <strong>{item.selectedOption ?? 'Not Attempted'}</strong> · Correct answer:{' '}
                    <strong>{item.correctOption}</strong>
                    {item.timeSpentMs > 0 && ` · Time: ${formatSeconds(item.timeSpentMs / 1000)}`}
                  </span>
                  <Button size="xs" variant="ghost" onClick={() => toggle(item.questionId)}>
                    {isExpanded ? 'Hide Explanation' : 'Show Explanation'}
                    <ChevronDown className={cn('size-3.5 transition-transform', isExpanded && 'rotate-180')} />
                  </Button>
                </div>

                {isExpanded && (
                  <div className="mt-3 rounded-xl bg-muted/40 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Explanation
                    </p>
                    <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed">{item.explanation}</p>
                    <p className="mt-2 text-[10px] text-muted-foreground">{item.sourceNote}</p>
                  </div>
                )}
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}
