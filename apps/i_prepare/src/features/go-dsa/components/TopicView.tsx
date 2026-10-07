import { useEffect, useMemo } from 'react'
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  CircleSlash,
  Code2,
  HelpCircle,
  Lightbulb,
  Lock,
  Play,
  Sigma,
  Table2,
  Target,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { allTopics, getTopic } from '../data'
import {
  currentProblemIndex,
  isAttempted,
  isDone,
  isProblemUnlocked,
  topicRows,
} from '../engine/progress'
import { useGoDsaStore } from '../store'
import { STATUS_META, TIER_LABELS } from '../types'
import { BackButton, CodeBlock, ComplexityTable, ProblemBadges, SectionLabel, StatusEmoji } from './shared'

export function TopicView() {
  const topicId = useGoDsaStore((state) => state.topicId)
  const data = useGoDsaStore((state) => state.data)
  const openModule = useGoDsaStore((state) => state.openModule)
  const openProblem = useGoDsaStore((state) => state.openProblem)
  const markLessonRead = useGoDsaStore((state) => state.markLessonRead)
  const go = useGoDsaStore((state) => state.go)
  const entry = topicId ? getTopic(topicId) : undefined
  const row = useMemo(() => topicRows(data).find((item) => item.topic.id === topicId), [data, topicId])

  useEffect(() => {
    window.scrollTo?.({ top: 0 })
  }, [topicId])

  if (!entry || !row) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <BackButton label="Dashboard" onClick={() => go('dashboard')} />
        <p className="mt-6 text-sm text-muted-foreground">Topic not found.</p>
      </div>
    )
  }

  const { module, topic } = entry
  const current = currentProblemIndex(topic, data)
  const lessonRead = data.lessonsRead.includes(topic.id)
  const ordered = allTopics()
  const nextTopic = ordered[ordered.findIndex((item) => item.topic.id === topic.id) + 1]?.topic
  // Complexity discussion pulls every complexity note from problems whose solution is visible.
  const discussed = topic.problems.filter((problem) => problem.complexity && data.attempts[problem.id]?.solutionRevealed)

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-12">
      <div className="flex items-center justify-between">
        <BackButton label={`Module ${module.number}`} onClick={() => openModule(module.id)} />
        <StatusEmoji status={row.status} />
      </div>

      <div className="mt-3 border-y border-border py-3 text-center font-mono text-xs tracking-[0.2em] text-muted-foreground">
        ━━━━━━━━━━━━━━━━━━━━
        <h1 className="my-1 font-sans text-xl font-black uppercase tracking-tight text-foreground sm:text-2xl">
          {topic.title}
        </h1>
        ━━━━━━━━━━━━━━━━━━━━
      </div>
      <p className="mt-3 text-center text-sm text-muted-foreground">{topic.summary}</p>

      {/* 1. Concept */}
      <Card className="mt-6">
        <CardContent className="space-y-5 p-5">
          <div>
            <SectionLabel icon={BookOpen}>1. Concept</SectionLabel>
            <div className="mt-2 space-y-2 text-sm leading-relaxed">
              {topic.concept.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div>
            <SectionLabel icon={HelpCircle}>2. Why?</SectionLabel>
            <p className="mt-2 rounded-lg bg-primary/5 p-3 text-sm leading-relaxed">{topic.why}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
              <p className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="size-3.5" /> Use it when
              </p>
              <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs leading-relaxed">
                {topic.whenToUse.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-3">
              <p className="flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-400">
                <CircleSlash className="size-3.5" /> Don’t use it when
              </p>
              <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs leading-relaxed">
                {topic.whenNotToUse.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <SectionLabel icon={Code2}>3. Go syntax</SectionLabel>
            <CodeBlock code={topic.syntax} className="mt-2" />
          </div>

          <div>
            <SectionLabel icon={Lightbulb}>4. Small example</SectionLabel>
            <CodeBlock code={topic.example.code} className="mt-2" />
            {topic.example.output && (
              <div className="mt-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Output</p>
                <CodeBlock code={topic.example.output} className="mt-1 bg-zinc-900" />
              </div>
            )}
            <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
              {topic.example.notes.map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ol>
          </div>

          <div>
            <SectionLabel icon={AlertTriangle}>5. Common mistakes</SectionLabel>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
              {topic.mistakes.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {!lessonRead && (
            <Button onClick={() => markLessonRead(topic.id)} className="w-full sm:w-auto">
              <CheckCircle2 className="size-4" />
              I’ve read the lesson
            </Button>
          )}
        </CardContent>
      </Card>

      {/* 6–9. Questions, one at a time */}
      <h2 className="mt-8 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
        <Target className="size-4" />
        Questions — one at a time
      </h2>
      <div className="mt-3 space-y-2">
        {topic.problems.map((problem, i) => {
          const unlocked = isProblemUnlocked(topic, i, data)
          const attempt = data.attempts[problem.id]
          const done = isDone(attempt)
          const isCurrent = i === current && !done
          return (
            <div
              key={problem.id}
              className={cn(
                'flex items-center justify-between gap-3 rounded-xl border p-4',
                isCurrent ? 'border-primary/50 bg-primary/5' : 'border-border bg-card',
                !unlocked && 'opacity-60',
              )}
            >
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-muted-foreground">
                  {6 + Math.min(i, 3)}. Question {i + 1} — {TIER_LABELS[problem.tier]}
                </p>
                {unlocked ? (
                  <>
                    <p className="truncate text-sm font-bold">{problem.title}</p>
                    <div className="mt-1">
                      <ProblemBadges level={problem.level} kind={problem.kind} />
                    </div>
                  </>
                ) : (
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Lock className="size-3.5" /> Attempt the previous question first
                  </p>
                )}
              </div>
              {unlocked && (
                <div className="flex shrink-0 items-center gap-2">
                  {attempt?.score !== null && attempt?.score !== undefined && (
                    <span className="text-xs font-semibold tabular-nums">{attempt.score}/10</span>
                  )}
                  <Button
                    size="sm"
                    variant={isCurrent ? 'default' : 'outline'}
                    onClick={() => openProblem(problem.id, 'topic')}
                  >
                    {done ? 'Review' : isAttempted(attempt) ? 'Continue' : (
                      <>
                        <Play className="size-3.5" /> Solve
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 10. Complexity discussion */}
      <Card className="mt-6">
        <CardContent className="p-5">
          <SectionLabel icon={Sigma}>10. Complexity discussion</SectionLabel>
          {discussed.length === 0 ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Complexity breakdowns appear here as you unlock solutions — state your own estimate before you look.
            </p>
          ) : (
            <div className="mt-3 space-y-4">
              {discussed.map((problem) => (
                <div key={problem.id}>
                  <p className="mb-1.5 text-xs font-semibold">{problem.title}</p>
                  <ComplexityTable complexity={problem.complexity!} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 11. Progress update */}
      <Card className="mt-4">
        <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
          <div>
            <SectionLabel icon={Table2}>11. Progress update</SectionLabel>
            <p className="mt-2 text-sm">
              {STATUS_META[row.status].emoji} {STATUS_META[row.status].label} · Score{' '}
              <span className="font-semibold">{row.score ?? '–'}</span> · Attempts{' '}
              <span className="font-semibold">{row.attempts}</span> · Solved {row.solved}/{row.total}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => go('progress')}>
              Full table
            </Button>
            {nextTopic && (row.status === 'completed' || row.status === 'needs_revision') && (
              <Button size="sm" onClick={() => useGoDsaStore.getState().openTopic(nextTopic.id)}>
                Next topic →
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
