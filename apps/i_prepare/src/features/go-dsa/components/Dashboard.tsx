import { useMemo, useState } from 'react'
import {
  ArrowRight,
  Briefcase,
  ClipboardCheck,
  Code2,
  Factory,
  GraduationCap,
  Play,
  Repeat,
  RotateCcw,
  Sparkles,
  Table2,
  Trophy,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { MODULES, getProblem, getTopic, totals } from '../data'
import { MENTOR_PROMPT } from '../data/mentor-prompt'
import { moduleStatus, nextTopic, overallCompletion, revisionsDue, topicRows, completedTopicCount } from '../engine/progress'
import { selectActiveRevision, useGoDsaStore } from '../store'
import type { Track } from '../types'
import { TOPICS_PER_REVISION } from '../types'
import { CopyButton, StatusEmoji } from './shared'

export function Dashboard() {
  const data = useGoDsaStore((state) => state.data)
  const resume = useGoDsaStore((state) => state.resume)
  const openTopic = useGoDsaStore((state) => state.openTopic)
  const openModule = useGoDsaStore((state) => state.openModule)
  const go = useGoDsaStore((state) => state.go)
  const startRevision = useGoDsaStore((state) => state.startRevision)
  const startExam = useGoDsaStore((state) => state.startExam)
  const resetAll = useGoDsaStore((state) => state.resetAll)
  const [track, setTrack] = useState<Track>('go')
  const [resetOpen, setResetOpen] = useState(false)

  const rows = useMemo(() => topicRows(data), [data])
  const count = totals()
  const completion = overallCompletion(rows)
  const completed = completedTopicCount(rows)
  const next = nextTopic(rows)
  const due = revisionsDue(rows, data)
  const liveRevision = selectActiveRevision(data)
  const hasResume = data.resume.topicId !== null || data.resume.problemId !== null
  const resumeLabel = (() => {
    const { resume: pointer } = data
    if (pointer.problemId) {
      const entry = getProblem(pointer.problemId)
      if (entry) return entry.topic ? `${entry.topic.title} → ${entry.problem.title}` : entry.problem.title
    }
    if (pointer.topicId) return getTopic(pointer.topicId)?.topic.title ?? null
    return null
  })()

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-14">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge variant="secondary" className="mb-3 gap-1.5 rounded-full px-3 py-1">
            <Sparkles className="size-3.5 text-primary" />
            {count.modules} modules · {count.topics} topics · {count.problems} problems · {completion}% complete
          </Badge>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Go + DSA Mentor</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Golang from fundamentals to concurrency, then data structures and algorithms — one question at a time.
            Think first: approach → code → review → hint → second attempt → solution → harder variation.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <CopyButton text={MENTOR_PROMPT} label="Copy mentor prompt" />
          <Button variant="outline" size="sm" onClick={() => go('progress')}>
            <Table2 className="size-4" />
            Progress
          </Button>
        </div>
      </header>

      {/* Continue / start */}
      <Card className="mt-6 border-primary/30 bg-primary/5">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <GraduationCap className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold">
                {hasResume ? 'Continue where you stopped' : 'Start the course'}
              </p>
              <p className="text-xs text-muted-foreground">
                {hasResume && resumeLabel
                  ? resumeLabel
                  : 'Module 1 — Variables, Constants, Types, Zero Values, Type Inference and Type Conversion'}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {hasResume && next && next.topic.id !== data.resume.topicId && (
              <Button variant="outline" onClick={() => openTopic(next.topic.id)}>
                Next unfinished: {next.topic.title}
              </Button>
            )}
            <Button onClick={resume}>
              <Play className="size-4" />
              {hasResume ? 'Continue' : 'Start lesson 1'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Revision cadence */}
      <Card className={cn('mt-4', due > 0 || liveRevision ? 'border-amber-500/40 bg-amber-500/5' : '')}>
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10">
              <Repeat className="size-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-bold">
                {liveRevision
                  ? `Revision round ${liveRevision.number} in progress`
                  : due > 0
                    ? `Revision round ${data.revisions.length + 1} is ready`
                    : 'Revision rounds'}
              </p>
              <p className="text-xs text-muted-foreground">
                Every {TOPICS_PER_REVISION} completed topics: 3 Go · 3 DS · 2 debugging · 2 output prediction · 2
                algorithm · 1 advanced. Concepts are hidden. ({completed} topics completed,{' '}
                {TOPICS_PER_REVISION - (completed % TOPICS_PER_REVISION)} to the next round)
              </p>
            </div>
          </div>
          <Button variant={due > 0 || liveRevision ? 'default' : 'outline'} disabled={due === 0 && !liveRevision} onClick={startRevision}>
            {liveRevision ? 'Continue revision' : 'Start revision'}
          </Button>
        </CardContent>
      </Card>

      {/* Modes */}
      <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: Briefcase,
            title: 'INTERVIEW MODE',
            text: 'Clarify → approach → complexity → edge cases → code → optimisation, with feedback.',
            action: () => go('interview'),
          },
          {
            icon: ClipboardCheck,
            title: 'EXAM MODE',
            text: 'Timed mixed test, no hints, scored at the end.',
            action: startExam,
          },
          {
            icon: Factory,
            title: 'PRODUCTION MODE',
            text: 'Rate limiter, worker pool, LRU, broker… real backend problems in Go.',
            action: () => go('production'),
          },
          {
            icon: Trophy,
            title: 'Weekly challenges',
            text: 'Larger projects after each major section, with milestones.',
            action: () => go('challenges'),
          },
        ].map(({ icon: Icon, title, text, action }) => (
          <button
            key={title}
            type="button"
            onClick={action}
            className="group rounded-xl border border-border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <Icon className="size-5 text-primary" />
            <p className="mt-2 text-sm font-black tracking-tight">{title}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{text}</p>
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
              Open <ArrowRight className="size-3" />
            </span>
          </button>
        ))}
      </section>

      {/* Syllabus */}
      <section className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-lg font-black tracking-tight">
            <Code2 className="size-5 text-primary" />
            Syllabus
          </h2>
          <div className="flex rounded-lg border border-border p-0.5">
            {(['go', 'dsa'] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setTrack(value)}
                className={cn(
                  'rounded-md px-3 py-1 text-xs font-semibold transition-colors',
                  track === value ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {value === 'go' ? 'Golang (1–17)' : 'DSA & Algorithms (18–33)'}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {MODULES.filter((module) => module.track === track).map((module) => {
            const own = rows.filter((row) => row.module.id === module.id)
            const solved = own.reduce((sum, row) => sum + row.solved, 0)
            const total = own.reduce((sum, row) => sum + row.total, 0)
            const pct = total > 0 ? Math.round((solved / total) * 100) : 0
            return (
              <button
                key={module.id}
                type="button"
                onClick={() => openModule(module.id)}
                className="rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Module {module.number}
                    </p>
                    <p className="truncate text-sm font-bold">{module.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{module.tagline}</p>
                  </div>
                  <StatusEmoji status={moduleStatus(rows, module.id)} />
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[11px] tabular-nums text-muted-foreground">
                    {solved}/{total}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      <div className="mt-10 flex justify-end">
        <Dialog open={resetOpen} onOpenChange={setResetOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <RotateCcw className="size-4" />
              Reset all progress
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reset Go + DSA progress?</DialogTitle>
              <DialogDescription>
                This clears every answer, score, revision round, exam, interview and challenge milestone saved on this
                device. It cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setResetOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  resetAll()
                  setResetOpen(false)
                }}
              >
                Reset
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
