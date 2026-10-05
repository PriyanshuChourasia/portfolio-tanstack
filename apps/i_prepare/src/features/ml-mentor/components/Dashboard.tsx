import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  FileSearch,
  GraduationCap,
  History,
  Loader2,
  Lock,
  MessagesSquare,
  Play,
  RotateCcw,
  Sparkles,
  Target,
  TrendingUp,
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
import {
  STATUS_META,
  WEAK_TOPIC_THRESHOLD,
  INTERVIEW_DIFFICULTIES,
} from '../types'
import type { InterviewDifficulty } from '../types'
import { useMLMentorStore, moduleSummaries, computeWeakTopics, getModule } from '../store'
import { overallCompletion } from '../engine/progress'
import { ML_MODULES } from '../data'
import { cn } from '@/lib/utils'

export function Dashboard() {
  const progress = useMLMentorStore((state) => state.progress)
  const startBaseline = useMLMentorStore((state) => state.startBaseline)
  const startDailySession = useMLMentorStore((state) => state.startDailySession)
  const openModule = useMLMentorStore((state) => state.openModule)
  const startMock = useMLMentorStore((state) => state.startMock)
  const goToHistory = useMLMentorStore((state) => state.go)

  const summaries = useMemo(() => moduleSummaries(progress), [progress])
  const weakAreas = useMemo(() => computeWeakTopics(progress), [progress])
  const completion = overallCompletion(progress)
  const currentModule = getModule(progress.currentModuleId)
  const [mockDifficulty, setMockDifficulty] = useState<InterviewDifficulty>('Intermediate')
  const [mockModuleId, setMockModuleId] = useState<string>('all')
  const [resetOpen, setResetOpen] = useState(false)

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-14">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge variant="secondary" className="mb-3 gap-1.5 rounded-full px-3 py-1">
            <Sparkles className="size-3.5 text-primary" />
            17 modules · {ML_MODULES.reduce((sum, m) => sum + m.topics.length, 0)} topics · {completion}% complete
          </Badge>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">ML Interview Preparation</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            A structured mentor: learn, practice, code, drill interview questions and pass module tests — one module at
            a time. Weak areas are tracked automatically and resurfaced in your daily sessions.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => goToHistory('history')}>
          <History className="size-4" />
          History
        </Button>
      </header>

      {!progress.baselineDone && (
        <Card className="mt-6 border-primary/30 bg-primary/5">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
            <div>
              <p className="flex items-center gap-2 text-sm font-bold">
                <Target className="size-4 text-primary" />
                Take the 10-question baseline assessment
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                It places you at the right starting module and flags your weak areas up front.
              </p>
            </div>
            <Button onClick={startBaseline}>
              <Play className="size-4" />
              Start baseline
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Daily session CTA */}
      <Card className="mt-6">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <CalendarCheck className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold">
                Today's preparation: {currentModule ? `Module ${currentModule.number} — ${currentModule.shortTitle}` : '—'}
              </p>
              <p className="text-xs text-muted-foreground">
                Lesson → practice → code → interview questions on the next unfinished topic, with spaced revision of
                what you already completed.
              </p>
            </div>
          </div>
          <Button onClick={startDailySession}>
            <Play className="size-4" />
            Start today's preparation
          </Button>
        </CardContent>
      </Card>

      {/* Module tracker */}
      <section className="mt-10">
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
          <GraduationCap className="size-4" />
          Module tracker — {STATUS_META.not_started.emoji} ⬜ not started · 🟡 in progress · 🟢 done · 🔴 needs revision
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {summaries.map((summary) => {
            const locked = summary.module.id !== progress.currentModuleId && !moduleUnlockedHint(progress, summary.module.id)
            return (
              <Card
                key={summary.module.id}
                className={cn(
                  'flex h-full flex-col p-0 transition-all',
                  summary.module.id === progress.currentModuleId
                    ? 'border-primary/50 shadow-md shadow-primary/10'
                    : 'hover:border-primary/30',
                  locked && 'opacity-70',
                )}
              >
                <CardContent className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Module {summary.module.number} · {summary.module.shortTitle}
                      </p>
                      <h3 className="truncate font-bold tracking-tight">{summary.module.title}</h3>
                    </div>
                    <span
                      className="shrink-0 text-lg"
                      title={STATUS_META[summary.status].label}
                      aria-label={STATUS_META[summary.status].label}
                    >
                      {STATUS_META[summary.status].emoji}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{summary.module.tagline}</p>
                  <div className="mt-auto flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">
                      {summary.topicsCompleted}/{summary.totalTopics} topics
                      {summary.bestTestPercentage !== null && ` · test ${summary.bestTestPercentage}%`}
                    </span>
                    {locked ? (
                      <Badge variant="outline" className="gap-1 rounded-full text-[10px]">
                        <Lock className="size-3" />
                        Locked
                      </Badge>
                    ) : (
                      <Button size="sm" variant={summary.module.id === progress.currentModuleId ? 'default' : 'outline'} onClick={() => openModule(summary.module.id)}>
                        {summary.status === 'not_started' ? 'Start' : 'Continue'}
                        <ArrowRight className="size-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Weak areas + mock interview launcher */}
      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <AlertTriangle className="size-4 text-amber-500" />
              Weak areas {weakAreas.length > 0 && `(${weakAreas.length})`}
            </h2>
            {weakAreas.length === 0 ? (
              <p className="mt-2 text-xs text-muted-foreground">
                Nothing flagged yet — topics score below {WEAK_TOPIC_THRESHOLD}/10 when a test goes badly, and failed
                modules flag all their untested topics.
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {weakAreas.map((weak) => (
                  <li key={weak.topicId}>
                    <button
                      type="button"
                      onClick={() => openModule(weak.moduleId)}
                      className="flex w-full items-center justify-between gap-3 rounded-lg border border-border p-2.5 text-left transition-colors hover:border-primary/40 hover:bg-muted/50"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">{weak.topicTitle}</span>
                        <span className="block text-[11px] text-muted-foreground">
                          {weak.moduleTitle} ·{' '}
                          {weak.reason === 'low_score'
                            ? `scored ${weak.score}/10`
                            : weak.reason === 'failed_test'
                              ? 'module test failed'
                              : 'awaiting test'}
                        </span>
                      </span>
                      <Badge variant="outline" className="shrink-0 rounded-full text-[10px]">
                        {weak.score !== null ? `${weak.score}/10` : '—'}
                      </Badge>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4 p-5">
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <MessagesSquare className="size-4 text-primary" />
              Mock interview
            </h2>
            <p className="text-xs text-muted-foreground">
              Six questions laddering up from your chosen level. Write your answer first, then reveal the model answer
              and score yourself 0–10 against the rubric.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-xs font-semibold">Difficulty</span>
                <select
                  value={mockDifficulty}
                  onChange={(event) => setMockDifficulty(event.target.value as InterviewDifficulty)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                >
                  {INTERVIEW_DIFFICULTIES.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-semibold">Focus</span>
                <select
                  value={mockModuleId}
                  onChange={(event) => setMockModuleId(event.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                >
                  <option value="all">All modules</option>
                  {ML_MODULES.map((module) => (
                    <option key={module.id} value={module.id}>
                      M{module.number} · {module.shortTitle}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <Button
              className="w-full"
              onClick={() => startMock(mockDifficulty, mockModuleId === 'all' ? null : mockModuleId)}
            >
              <MessagesSquare className="size-4" />
              Start mock interview
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer actions */}
      <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t pt-6 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <ClipboardList className="size-3.5" />
          Pass mark: module tests at 70%
        </span>
        <span className="inline-flex items-center gap-1.5">
          <TrendingUp className="size-3.5" />
          Weak threshold: topic score &lt; 7/10
        </span>
        {progress.baselineDone && (
          <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={startBaseline}>
            <FileSearch className="size-4" />
            Retake baseline
          </Button>
        )}
        <Dialog open={resetOpen} onOpenChange={setResetOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
              {resetOpen ? <Loader2 className="size-4 animate-spin" /> : <RotateCcw className="size-4" />}
              Reset all progress
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reset all ML progress?</DialogTitle>
              <DialogDescription>
                This wipes topic scores, module tests, daily sessions and mock-interview history from this browser.
                It cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setResetOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  void useMLMentorStore.getState().resetProgress()
                  setResetOpen(false)
                }}
              >
                <RotateCcw className="size-4" />
                Reset everything
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <CheckCircle2 className="ml-auto size-4" />
      </div>
    </div>
  )
}

/** Mirrors engine.isModuleUnlocked for display purposes. */
function moduleUnlockedHint(progress: ReturnType<typeof useMLMentorStore.getState>['progress'], moduleId: string): boolean {
  const index = ML_MODULES.findIndex((m) => m.id === moduleId)
  if (index <= 0) return true
  const previous = ML_MODULES[index - 1]
  const previousBest = progress.modules[previous.id]?.bestTestPercentage ?? null
  if (previousBest !== null && previousBest >= 70) return true
  const currentIndex = ML_MODULES.findIndex((m) => m.id === progress.currentModuleId)
  return currentIndex >= index
}
