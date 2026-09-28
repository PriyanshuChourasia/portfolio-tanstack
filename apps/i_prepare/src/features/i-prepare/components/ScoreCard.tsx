import { CheckCircle2, MinusCircle, Timer, XCircle } from 'lucide-react'
import type { TestResult } from '@/data/reasoning'
import { cn } from '@/lib/utils'
import { formatDurationWords } from '../lib/time'

function Metric({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card px-3 py-2.5">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-sm font-bold">{value}</p>
      {hint && <p className="mt-0.5 text-[10px] text-muted-foreground">{hint}</p>}
    </div>
  )
}

function OutcomeTile({
  label,
  value,
  tone,
  icon,
}: {
  label: string
  value: number
  tone: 'good' | 'bad' | 'muted'
  icon: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-2xl border px-4 py-3.5',
        tone === 'good' && 'border-emerald-500/40 bg-emerald-500/5',
        tone === 'bad' && 'border-destructive/40 bg-destructive/5',
        tone === 'muted' && 'border-border/60 bg-card',
      )}
    >
      <span
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-full',
          tone === 'good' && 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
          tone === 'bad' && 'bg-destructive/15 text-destructive',
          tone === 'muted' && 'bg-muted text-muted-foreground',
        )}
      >
        {icon}
      </span>
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="text-2xl font-black leading-tight">{value}</p>
      </div>
    </div>
  )
}

export function ScoreCard({ result }: { result: TestResult }) {
  const { overall } = result

  return (
    <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Test Complete</p>
        <p className="mt-3 text-5xl font-black tracking-tight">
          {overall.score}
          <span className="text-2xl font-medium text-muted-foreground"> / {overall.maxScore}</span>
        </p>
        <p className="mt-1 text-2xl font-bold text-primary">{overall.percentage}%</p>
        <p className="mt-2 text-xs text-muted-foreground">
          {result.examName} · {result.testTitle} · marking +{result.marking.positiveMarks} /
          −{result.marking.negativeMarks}
          {result.submitReason === 'timeout' && ' · auto-submitted when the timer expired'}
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <OutcomeTile
          label="Correct"
          value={overall.correct}
          tone="good"
          icon={<CheckCircle2 className="size-4" />}
        />
        <OutcomeTile
          label="Incorrect"
          value={overall.incorrect}
          tone="bad"
          icon={<XCircle className="size-4" />}
        />
        <OutcomeTile
          label="Unanswered"
          value={overall.unanswered}
          tone="muted"
          icon={<MinusCircle className="size-4" />}
        />
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Accuracy" value={`${overall.accuracy}%`} hint="correct ÷ attempted" />
        <Metric label="Attempt rate" value={`${overall.attemptRate}%`} hint="attempted ÷ total" />
        <Metric label="Attempted" value={`${overall.attempted} / ${overall.totalQuestions}`} />
        <Metric
          label="Time used"
          value={formatDurationWords(result.timeUsedSeconds)}
          hint={`of ${formatDurationWords(result.durationSeconds)}`}
        />
      </div>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
        <Timer className="size-3.5" />
        Score = (correct × {result.marking.positiveMarks}) − (incorrect × {result.marking.negativeMarks}) ={' '}
        {overall.correct} × {result.marking.positiveMarks} − {overall.incorrect} × {result.marking.negativeMarks} ={' '}
        {overall.score}
      </p>
    </section>
  )
}
