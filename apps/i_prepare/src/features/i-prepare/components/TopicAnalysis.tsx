import type { TopicPerformance } from '@/data/reasoning'
import { cn } from '@/lib/utils'
import { formatSeconds } from '../engine/evaluation'

function accuracyTone(accuracy: number): string {
  if (accuracy >= 80) return 'bg-emerald-500'
  if (accuracy >= 60) return 'bg-sky-500'
  if (accuracy >= 40) return 'bg-amber-500'
  return 'bg-rose-500'
}

export function TopicAnalysis({ topics }: { topics: TopicPerformance[] }) {
  return (
    <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
      <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Topic-wise Analysis</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Attempted, correct, wrong and accuracy for every topic that appeared in this paper.
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border/60 text-left text-[11px] uppercase tracking-wide text-muted-foreground">
              <th className="py-2 pr-3 font-semibold">Topic</th>
              <th className="py-2 pr-3 text-right font-semibold">Attempted</th>
              <th className="py-2 pr-3 text-right font-semibold">Correct</th>
              <th className="py-2 pr-3 text-right font-semibold">Wrong</th>
              <th className="py-2 pr-3 text-right font-semibold">Accuracy</th>
              <th className="py-2 pr-3 text-right font-semibold">Avg time</th>
            </tr>
          </thead>
          <tbody>
            {topics.map((topic) => (
              <tr key={topic.topic} className="border-b border-border/40 last:border-0">
                <td className="py-2.5 pr-3 font-medium">{topic.topic}</td>
                <td className="py-2.5 pr-3 text-right tabular-nums">{topic.attempted}</td>
                <td className="py-2.5 pr-3 text-right tabular-nums text-emerald-600 dark:text-emerald-400">
                  {topic.correct}
                </td>
                <td className="py-2.5 pr-3 text-right tabular-nums text-destructive">{topic.incorrect}</td>
                <td className="py-2.5 pr-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="tabular-nums font-semibold">{topic.accuracy}%</span>
                    <span className="hidden h-1.5 w-20 overflow-hidden rounded-full bg-muted sm:block">
                      <span
                        className={cn('block h-full rounded-full', accuracyTone(topic.accuracy))}
                        style={{ width: `${Math.min(100, topic.accuracy)}%` }}
                      />
                    </span>
                  </div>
                </td>
                <td className="py-2.5 pr-3 text-right tabular-nums text-muted-foreground">
                  {topic.avgTimeSeconds > 0 ? formatSeconds(topic.avgTimeSeconds) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {topics.some((topic) => topic.unanswered > 0) && (
        <p className="mt-3 text-[11px] text-muted-foreground">
          Unattempted by topic:{' '}
          {topics
            .filter((topic) => topic.unanswered > 0)
            .map((topic) => `${topic.topic} (${topic.unanswered})`)
            .join(', ')}
        </p>
      )}
    </section>
  )
}
