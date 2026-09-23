import { useMemo } from 'react'
import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { ReasoningTopic, TestResult } from '@/data/reasoning'
import { formatDate } from '../lib/time'

interface AttemptPoint {
  label: string
  date: string
  percentage: number
  accuracy: number
  attemptRate: number
}

function topicTrend(results: TestResult[]): Array<{ topic: ReasoningTopic; first: number; latest: number; delta: number; attempts: number }> {
  const byTopic = new Map<ReasoningTopic, Array<{ percentage: number; at: number }>>()

  for (const result of results) {
    for (const topic of result.topicPerformance) {
      if (topic.attempted === 0) continue
      const bucket = byTopic.get(topic.topic) ?? []
      bucket.push({ percentage: topic.accuracy, at: Date.parse(result.submittedAt) })
      byTopic.set(topic.topic, bucket)
    }
  }

  return [...byTopic.entries()]
    .map(([topic, points]) => {
      const ordered = [...points].sort((a, b) => a.at - b.at)
      const first = ordered[0].percentage
      const latest = ordered[ordered.length - 1].percentage
      return { topic, first, latest, delta: Math.round((latest - first) * 100) / 100, attempts: ordered.length }
    })
    .filter((row) => row.attempts > 0)
    .sort((a, b) => b.delta - a.delta)
}

export function ProgressChart({ results }: { results: TestResult[] }) {
  const chronological = useMemo(
    () => [...results].sort((a, b) => Date.parse(a.submittedAt) - Date.parse(b.submittedAt)),
    [results],
  )

  const data: AttemptPoint[] = chronological.map((result, index) => ({
    label: `T${index + 1}`,
    date: formatDate(result.submittedAt),
    percentage: result.overall.percentage,
    accuracy: result.overall.accuracy,
    attemptRate: result.overall.attemptRate,
  }))

  const trends = topicTrend(chronological)

  if (data.length === 0) return null

  return (
    <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
      <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Progress Tracking</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Percentage, accuracy and attempt rate across {data.length} completed test{data.length === 1 ? '' : 's'}.
      </p>

      <div className="mt-4 h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="currentColor" opacity={0.6} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="currentColor" opacity={0.6} />
            <Tooltip
              contentStyle={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 12,
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="percentage" name="Score %" unit="%" stroke="#0ea5e9" strokeWidth={2} dot />
            <Line type="monotone" dataKey="accuracy" name="Accuracy %" unit="%" stroke="#10b981" strokeWidth={2} dot />
            <Line
              type="monotone"
              dataKey="attemptRate"
              name="Attempt rate %"
              unit="%"
              stroke="#f59e0b"
              strokeWidth={2}
              dot
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {trends.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Topic improvement (first attempt → latest attempt)
          </h3>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {trends.map((row) => (
              <li
                key={row.topic}
                className="flex items-center justify-between gap-3 rounded-xl bg-muted/40 px-3 py-2 text-xs"
              >
                <span className="font-medium">{row.topic}</span>
                <span className="flex items-center gap-1.5 tabular-nums text-muted-foreground">
                  {row.first}% → {row.latest}%
                  <span
                    className={
                      row.delta > 0
                        ? 'flex items-center gap-0.5 font-semibold text-emerald-600 dark:text-emerald-400'
                        : row.delta < 0
                          ? 'flex items-center gap-0.5 font-semibold text-destructive'
                          : 'flex items-center gap-0.5 font-semibold text-muted-foreground'
                    }
                  >
                    {row.delta > 0 ? (
                      <ArrowUpRight className="size-3.5" />
                    ) : row.delta < 0 ? (
                      <ArrowDownRight className="size-3.5" />
                    ) : (
                      <ArrowRight className="size-3.5" />
                    )}
                    {row.delta > 0 ? '+' : ''}
                    {row.delta}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
