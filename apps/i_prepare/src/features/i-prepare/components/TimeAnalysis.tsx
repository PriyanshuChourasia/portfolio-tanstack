import { Hourglass, Rabbit, Turtle } from 'lucide-react'
import type { TimeAnalysis as TimeAnalysisData } from '@/data/reasoning'
import { formatDurationWords } from '../lib/time'
import { formatSeconds } from '../engine/evaluation'

export function TimeAnalysis({ analysis }: { analysis: TimeAnalysisData }) {
  return (
    <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
      <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Time Analysis</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Time is measured per question while the tab is visible, so switching away does not inflate these
        numbers.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-muted/40 px-3 py-2.5">
          <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Hourglass className="size-3.5" /> Time used
          </p>
          <p className="text-sm font-bold">{formatDurationWords(analysis.timeUsedSeconds)}</p>
        </div>
        <div className="rounded-xl bg-muted/40 px-3 py-2.5">
          <p className="text-[11px] text-muted-foreground">Average / question</p>
          <p className="text-sm font-bold">{formatSeconds(analysis.avgTimePerQuestionSeconds)}</p>
        </div>
        <div className="rounded-xl bg-muted/40 px-3 py-2.5">
          <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Rabbit className="size-3.5" /> Fastest
          </p>
          <p className="text-sm font-bold">
            Q{(analysis.fastest?.index ?? 0) + 1} · {formatSeconds(analysis.fastest?.seconds ?? 0)}
          </p>
          <p className="text-[10px] text-muted-foreground">{analysis.fastest?.topic ?? '—'}</p>
        </div>
        <div className="rounded-xl bg-muted/40 px-3 py-2.5">
          <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Turtle className="size-3.5" /> Slowest
          </p>
          <p className="text-sm font-bold">
            Q{(analysis.slowest?.index ?? 0) + 1} · {formatSeconds(analysis.slowest?.seconds ?? 0)}
          </p>
          <p className="text-[10px] text-muted-foreground">{analysis.slowest?.topic ?? '—'}</p>
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-3 py-2.5">
          <p className="text-[11px] text-muted-foreground">Average time on correct answers</p>
          <p className="text-sm font-bold">
            {analysis.avgCorrectSeconds > 0 ? formatSeconds(analysis.avgCorrectSeconds) : '—'}
          </p>
        </div>
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2.5">
          <p className="text-[11px] text-muted-foreground">Average time on incorrect answers</p>
          <p className="text-sm font-bold">
            {analysis.avgIncorrectSeconds > 0 ? formatSeconds(analysis.avgIncorrectSeconds) : '—'}
          </p>
        </div>
      </div>

      {analysis.byTopic.length > 0 && (
        <div className="mt-5">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Average time by topic
          </h3>
          <ul className="mt-2 space-y-2">
            {analysis.byTopic.map((row) => {
              const max = analysis.byTopic[0]?.avgTimeSeconds || 1
              return (
                <li key={row.topic} className="flex items-center gap-3">
                  <span className="w-40 shrink-0 truncate text-xs font-medium">{row.topic}</span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <span
                      className="block h-full rounded-full bg-primary/70"
                      style={{ width: `${Math.max(4, (row.avgTimeSeconds / max) * 100)}%` }}
                    />
                  </span>
                  <span className="w-20 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                    {formatSeconds(row.avgTimeSeconds)}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </section>
  )
}
