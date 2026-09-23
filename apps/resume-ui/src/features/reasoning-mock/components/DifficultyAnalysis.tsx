import type { DifficultyPerformance } from '@/data/reasoning'
import { cn } from '@/lib/utils'
import { DIFFICULTY_LABELS, formatSeconds } from '../engine/evaluation'

const TONE: Record<DifficultyPerformance['difficulty'], string> = {
  easy: 'bg-emerald-500',
  moderate: 'bg-amber-500',
  difficult: 'bg-rose-500',
}

export function DifficultyAnalysis({ rows }: { rows: DifficultyPerformance[] }) {
  return (
    <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
      <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Difficulty-wise Analysis</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Compare accuracy across levels — a low score on difficult questions only means a different fix than
        losing easy marks.
      </p>

      <div className="mt-5 space-y-5">
        {rows.map((row) => (
          <div key={row.difficulty}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm font-semibold">{DIFFICULTY_LABELS[row.difficulty]}</p>
              <p className="text-xs text-muted-foreground">
                Attempted {row.attempted} · Correct {row.correct} · Accuracy {row.accuracy}%
                {row.avgTimeSeconds > 0 && ` · Avg ${formatSeconds(row.avgTimeSeconds)}`}
              </p>
            </div>
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn('h-full rounded-full transition-all', TONE[row.difficulty])}
                style={{ width: `${Math.min(100, row.accuracy)}%` }}
              />
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {row.total} question(s) of this level in the paper
              {row.total - row.attempted > 0 && ` · ${row.total - row.attempted} left unattempted`}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
