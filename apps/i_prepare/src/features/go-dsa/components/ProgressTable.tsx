import { useMemo, useState } from 'react'
import { Table2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { topicRows } from '../engine/progress'
import { useGoDsaStore } from '../store'
import type { ProgressStatus } from '../types'
import { STATUS_META } from '../types'
import { BackButton } from './shared'

const FILTERS: Array<ProgressStatus | 'all'> = ['all', 'not_started', 'in_progress', 'completed', 'needs_revision']

/** §42 progress table: Module | Topic | Status | Score | Attempts. */
export function ProgressTable() {
  const data = useGoDsaStore((state) => state.data)
  const go = useGoDsaStore((state) => state.go)
  const openTopic = useGoDsaStore((state) => state.openTopic)
  const rows = useMemo(() => topicRows(data), [data])
  const [filter, setFilter] = useState<ProgressStatus | 'all'>('all')
  const visible = filter === 'all' ? rows : rows.filter((row) => row.status === filter)

  const exams = data.exams.filter((exam) => exam.submittedAt)
  const interviews = data.interviews.filter((session) => session.completedAt)

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-12">
      <BackButton label="Dashboard" onClick={() => go('dashboard')} />
      <h1 className="mt-2 flex items-center gap-2 text-2xl font-black tracking-tight sm:text-3xl">
        <Table2 className="size-6 text-primary" />
        Progress
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {rows.filter((r) => r.status === 'completed').length} completed ·{' '}
        {rows.filter((r) => r.status === 'needs_revision').length} need revision · {data.revisions.length} revision
        rounds · {exams.length} exams · {interviews.length} interviews
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {FILTERS.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium',
              filter === value ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground',
            )}
          >
            {value === 'all' ? 'All' : `${STATUS_META[value].emoji} ${STATUS_META[value].label}`}
          </button>
        ))}
      </div>

      <div className="custom-scrollbar mt-4 overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-muted/60 text-left text-xs">
            <tr>
              <th className="px-3 py-2">Module</th>
              <th className="px-3 py-2">Topic</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2 text-right">Score</th>
              <th className="px-3 py-2 text-right">Attempts</th>
              <th className="px-3 py-2 text-right">Solved</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr
                key={row.topic.id}
                onClick={() => openTopic(row.topic.id)}
                className="cursor-pointer border-t border-border hover:bg-muted/40"
              >
                <td className="px-3 py-2 text-xs text-muted-foreground">
                  {row.module.number}. {row.module.shortTitle}
                </td>
                <td className="px-3 py-2 font-medium">{row.topic.title}</td>
                <td className="whitespace-nowrap px-3 py-2 text-xs">
                  {STATUS_META[row.status].emoji} {STATUS_META[row.status].label}
                </td>
                <td className="px-3 py-2 text-right tabular-nums">{row.score ?? '-'}</td>
                <td className="px-3 py-2 text-right tabular-nums">{row.attempts}</td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {row.solved}/{row.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {exams.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Exam history</h2>
          <div className="mt-2 space-y-2">
            {exams.map((exam) => (
              <button
                key={exam.id}
                type="button"
                onClick={() => useGoDsaStore.getState().viewExam(exam.id)}
                className="flex w-full items-center justify-between rounded-lg border border-border p-3 text-left text-sm hover:border-primary/40"
              >
                <span>{new Date(exam.submittedAt!).toLocaleString()}</span>
                <span className="font-semibold tabular-nums">
                  {exam.correctCount}/{exam.problemIds.length} · {exam.percentage}%
                </span>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
