import type { OptionKey, Question, UserAnswer } from '@/data/reasoning'
import { DIFFICULTY_LABELS } from '../engine/evaluation'
import { cn } from '@/lib/utils'
import { OptionSelector } from './OptionSelector'

const DIFFICULTY_STYLES: Record<Question['difficulty'], string> = {
  easy: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  moderate: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
  difficult: 'bg-rose-500/10 text-rose-700 dark:text-rose-300',
}

export function QuestionCard({
  question,
  index,
  total,
  answer,
  onSelect,
}: {
  question: Question
  index: number
  total: number
  answer: UserAnswer | undefined
  onSelect: (option: OptionKey) => void
}) {
  const progress = total > 0 ? ((index + 1) / total) * 100 : 0

  return (
    <article className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-muted-foreground">
          Question {index + 1} of {total}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
            {question.topic}
          </span>
          <span
            className={cn(
              'rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize',
              DIFFICULTY_STYLES[question.difficulty],
            )}
          >
            {DIFFICULTY_LABELS[question.difficulty]}
          </span>
          <span className="rounded-full border border-border/60 px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
            {question.sourceType === 'actual_pyq' ? 'Actual PYQ' : 'PYQ-pattern'}
          </span>
        </div>
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-6 whitespace-pre-line text-base font-medium leading-relaxed sm:text-lg">
        {question.questionText}
      </p>

      <div className="mt-6">
        <OptionSelector
          options={question.options}
          selected={answer?.selectedOption ?? null}
          onSelect={onSelect}
        />
      </div>

      {question.subtopic && (
        <p className="mt-4 text-[11px] text-muted-foreground">Subtopic: {question.subtopic}</p>
      )}
    </article>
  )
}
