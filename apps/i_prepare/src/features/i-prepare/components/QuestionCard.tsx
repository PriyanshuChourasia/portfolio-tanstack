import { OPTION_KEYS, type OptionKey, type Question, type UserAnswer } from '@/data/reasoning'
import { DIFFICULTY_LABELS } from '../engine/evaluation'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FigureView } from '@/components/FigureView'
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
    <Card className="rounded-2xl border border-border/60 bg-card shadow-sm sm:p-7">
      <CardContent className="pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-muted-foreground">
            Question {index + 1} of {total}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
              {question.topic}
            </Badge>
            <Badge className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize ${DIFFICULTY_STYLES[question.difficulty]}`}>
              {DIFFICULTY_LABELS[question.difficulty]}
            </Badge>
            <Badge variant="outline" className="rounded-full border-border/60 px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
              {question.sourceType === 'actual_pyq' ? 'Actual PYQ' : 'PYQ-pattern'}
            </Badge>
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

        {question.figure && (
          <div className="mt-4 flex flex-wrap items-end gap-4 rounded-xl border border-border/60 bg-muted/30 p-4">
            <FigureView figure={question.figure} size={120} />
          </div>
        )}

        {question.figureOptions ? (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {question.figureOptions.map((spec, index) => {
              const key = OPTION_KEYS[index]
              const isSelected = answer?.selectedOption === key
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onSelect(key)}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-xl border p-3 transition-all',
                    isSelected
                      ? 'border-primary bg-primary/10 shadow-sm'
                      : 'border-border/60 hover:border-primary/50 hover:bg-primary/5',
                  )}
                >
                  <span className="text-[10px] font-bold text-muted-foreground">{key}</span>
                  <FigureView figure={spec} size={72} />
                </button>
              )
            })}
          </div>
        ) : (
          <div className="mt-6">
            <OptionSelector
              options={question.options}
              selected={answer?.selectedOption ?? null}
              onSelect={onSelect}
            />
          </div>
        )}

        {question.subtopic && (
          <p className="mt-4 text-[11px] text-muted-foreground">Subtopic: {question.subtopic}</p>
        )}
      </CardContent>
    </Card>
  )
}
