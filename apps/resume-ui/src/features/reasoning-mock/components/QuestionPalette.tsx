import type { TestSession } from '@/data/reasoning'
import { cn } from '@/lib/utils'

type PaletteState = 'not-visited' | 'answered' | 'marked' | 'answered-marked' | 'visited'

const STATE_LABELS: Record<PaletteState, string> = {
  'not-visited': 'Not visited',
  answered: 'Answered',
  marked: 'Marked for review',
  'answered-marked': 'Answered & marked for review',
  visited: 'Visited but not answered',
}

const STATE_CLASSES: Record<PaletteState, string> = {
  'not-visited': 'border-border/60 bg-muted/60 text-muted-foreground',
  answered: 'border-sky-500/50 bg-sky-500/15 text-sky-700 dark:text-sky-300 font-semibold',
  marked: 'border-amber-500/60 bg-amber-500/15 text-amber-700 dark:text-amber-300 font-semibold',
  'answered-marked': 'border-emerald-500/60 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold',
  visited: 'border-rose-400/50 bg-rose-500/10 text-rose-700 dark:text-rose-300',
}

export function paletteState(session: TestSession, questionId: string): PaletteState {
  const answer = session.answers[questionId]
  const answered = Boolean(answer?.selectedOption)
  if (answered && answer?.markedForReview) return 'answered-marked'
  if (answered) return 'answered'
  if (answer?.markedForReview) return 'marked'
  if (answer?.visited) return 'visited'
  return 'not-visited'
}

const LEGEND: Array<{ state: PaletteState; label: string }> = [
  { state: 'not-visited', label: 'Not visited' },
  { state: 'visited', label: 'Visited, not answered' },
  { state: 'answered', label: 'Answered' },
  { state: 'marked', label: 'Marked for review' },
  { state: 'answered-marked', label: 'Answered + marked' },
]

export function QuestionPalette({
  session,
  onJump,
}: {
  session: TestSession
  onJump: (index: number) => void
}) {
  const counts = session.questionIds.reduce(
    (accumulator, questionId) => {
      const state = paletteState(session, questionId)
      if (state === 'answered' || state === 'answered-marked') accumulator.answered += 1
      else accumulator.unanswered += 1
      if (state === 'marked' || state === 'answered-marked') accumulator.marked += 1
      if (state === 'not-visited') accumulator.notVisited += 1
      return accumulator
    },
    { answered: 0, unanswered: 0, marked: 0, notVisited: 0 },
  )

  return (
    <section className="rounded-2xl border border-border/60 bg-card p-4">
      <h2 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Question Palette</h2>

      <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-8 lg:grid-cols-5 xl:grid-cols-6">
        {session.questionIds.map((questionId, index) => {
          const state = paletteState(session, questionId)
          const isCurrent = index === session.currentQuestionIndex
          return (
            <button
              key={questionId}
              type="button"
              onClick={() => onJump(index)}
              aria-label={`Question ${index + 1}: ${STATE_LABELS[state]}`}
              aria-current={isCurrent ? 'true' : undefined}
              className={cn(
                'flex h-9 items-center justify-center rounded-lg border text-xs transition-all hover:opacity-80',
                STATE_CLASSES[state],
                isCurrent && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
              )}
            >
              {index + 1}
            </button>
          )
        })}
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
        <div className="rounded-lg bg-muted/40 px-2.5 py-1.5">
          <dt className="text-muted-foreground">Answered</dt>
          <dd className="font-semibold">{counts.answered}</dd>
        </div>
        <div className="rounded-lg bg-muted/40 px-2.5 py-1.5">
          <dt className="text-muted-foreground">Not answered</dt>
          <dd className="font-semibold">{counts.unanswered}</dd>
        </div>
        <div className="rounded-lg bg-muted/40 px-2.5 py-1.5">
          <dt className="text-muted-foreground">Marked</dt>
          <dd className="font-semibold">{counts.marked}</dd>
        </div>
        <div className="rounded-lg bg-muted/40 px-2.5 py-1.5">
          <dt className="text-muted-foreground">Not visited</dt>
          <dd className="font-semibold">{counts.notVisited}</dd>
        </div>
      </dl>

      <div className="mt-4 space-y-1.5">
        {LEGEND.map((item) => (
          <div key={item.state} className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <span className={cn('size-3 shrink-0 rounded border', STATE_CLASSES[item.state])} />
            {item.label}
          </div>
        ))}
      </div>
    </section>
  )
}
