import { BookOpen, Lightbulb, TrendingUp } from 'lucide-react'
import type { TestResult } from '@/data/reasoning'
import { formatSeconds } from '../engine/evaluation'

export function PerformanceInsights({ result }: { result: TestResult }) {
  const { summary, strengths, focusAreas, recommendations } = result

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
          <TrendingUp className="size-4" /> Performance Summary
        </h2>
        <ul className="mt-4 space-y-2.5 text-sm">
          {summary.map((line) => (
            <li key={line} className="flex gap-2">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
              <span>{line}</span>
            </li>
          ))}
        </ul>

        {strengths.length > 0 && (
          <div className="mt-5 border-t border-border/50 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
              What went well
            </h3>
            <ul className="mt-2 space-y-2 text-sm">
              {strengths.map((line) => (
                <li key={line} className="text-muted-foreground">
                  {line}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
          <Lightbulb className="size-4" /> Focus Areas &amp; Recommendations
        </h2>

        {focusAreas.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            No topic fell below your overall accuracy — there is no specific weak area in this attempt.
          </p>
        ) : (
          <ol className="mt-4 space-y-3">
            {focusAreas.map((area, index) => (
              <li key={area.topic} className="rounded-xl bg-muted/40 p-3">
                <p className="text-sm font-semibold">
                  {index + 1}. {area.topic}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Accuracy: {area.accuracy}% · Attempted: {area.attempted} · Correct: {area.correct}
                  {area.avgTimeSeconds > 0 && ` · Average time: ${formatSeconds(area.avgTimeSeconds)}`}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{area.reason}</p>
              </li>
            ))}
          </ol>
        )}

        <div className="mt-5 border-t border-border/50 pt-4">
          <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            <BookOpen className="size-3.5" /> Suggested practice
          </h3>
          <ul className="mt-2 space-y-2 text-sm">
            {recommendations.practice.map((line) => (
              <li key={line} className="flex gap-2 text-muted-foreground">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/70" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
