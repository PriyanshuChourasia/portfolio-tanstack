import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, ListChecks, Send } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface QuizRunnerProps {
  title: string
  subtitle?: string
  questions: Array<{ id: string; prompt: string; options: string[]; topicId?: string }>
  selections: Record<string, number | null>
  index: number
  onSelect: (questionId: string, optionIndex: number) => void
  onPrevious: () => void
  onNext: () => void
  onSubmit: () => void
  /** Jump straight to a question via the palette. */
  onJumpTo?: (index: number) => void
  /** Disable submit until every question is answered. */
  requireAllAnswers?: boolean
}

export function QuizRunner({
  title,
  subtitle,
  questions,
  selections,
  index,
  onSelect,
  onPrevious,
  onNext,
  onSubmit,
  onJumpTo,
  requireAllAnswers = false,
}: QuizRunnerProps) {
  const question = questions[index]
  if (!question) return null
  const selection = selections[question.id] ?? null
  const answeredCount = questions.filter((q) => selections[q.id] !== null && selections[q.id] !== undefined).length
  const allAnswered = answeredCount === questions.length
  const isLast = index === questions.length - 1

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-12">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-black tracking-tight sm:text-2xl">{title}</h1>
          {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <Badge variant="secondary" className="gap-1.5 rounded-full">
          <ListChecks className="size-3.5" />
          {index + 1} / {questions.length}
        </Badge>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${(answeredCount / questions.length) * 100}%` }}
          />
        </div>
        <span className="w-24 text-right text-[11px] tabular-nums text-muted-foreground">
          {answeredCount}/{questions.length} answered
        </span>
      </div>

      <Card className="mt-6">
        <CardContent className="p-6">
          <p className="font-semibold leading-relaxed">{question.prompt}</p>
          <div className="mt-4 space-y-2">
            {question.options.map((option, optionIndex) => {
              const selected = selection === optionIndex
              return (
                <button
                  key={optionIndex}
                  type="button"
                  onClick={() => onSelect(question.id, optionIndex)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg border p-3 text-left text-sm transition-colors',
                    selected
                      ? 'border-primary bg-primary/10 font-medium'
                      : 'border-border hover:border-primary/40 hover:bg-muted/50',
                  )}
                >
                  {selected ? (
                    <CheckCircle2 className="size-4 shrink-0 text-primary" />
                  ) : (
                    <Circle className="size-4 shrink-0 text-muted-foreground" />
                  )}
                  <span>{option}</span>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex items-center justify-between gap-3">
        <Button variant="outline" size="sm" onClick={onPrevious} disabled={index === 0}>
          <ArrowLeft className="size-4" />
          Previous
        </Button>
        {isLast ? (
          <Button
            onClick={onSubmit}
            disabled={requireAllAnswers && !allAnswered}
          >
            <Send className="size-4" />
            Submit ({answeredCount}/{questions.length})
          </Button>
        ) : (
          <Button size="sm" onClick={onNext}>
            Next
            <ArrowRight className="size-4" />
          </Button>
        )}
      </div>

      {/* Question palette — jump straight to any question */}
      <div className="mt-6 flex flex-wrap gap-1.5">
        {questions.map((q, qIndex) => {
          const answered = selections[q.id] !== null && selections[q.id] !== undefined
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => onJumpTo?.(qIndex)}
              className={cn(
                'flex size-7 items-center justify-center rounded-md border text-[11px] font-semibold transition-colors',
                qIndex === index
                  ? 'border-primary bg-primary text-primary-foreground'
                  : answered
                    ? 'border-primary/40 bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground',
              )}
            >
              {qIndex + 1}
            </button>
          )
        })}
      </div>
    </div>
  )
}
