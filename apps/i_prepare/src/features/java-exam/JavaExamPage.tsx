import { useEffect, lazy, Suspense } from 'react'
import {
  AlertTriangle,
  BadgeCheck,
  Brain,
  Clock,
  FileCode2,
  Layers,
  Loader2,
  ListChecks,
  PenLine,
  Play,
  RotateCcw,
  Sparkles,
  Timer,
  TrendingUp,
  Trophy,
  Wand2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { EXAM_DURATIONS, JAVA_EXAMS, KIND_META, LEVEL_LABELS } from './types'
import type { JavaExamDefinition } from './types'
import { useJavaExamStore, javaStorageLabel } from './store'
import { JAVA_QUESTIONS } from './data/questions'
import { formatDurationWords } from '@/features/i-prepare/lib/time'
import { cn } from '@/lib/utils'

const KIND_ICONS: Record<string, typeof ListChecks> = {
  mcq: ListChecks,
  multiple_select: ListChecks,
  true_false: ListChecks,
  output_prediction: FileCode2,
  code_completion: FileCode2,
  coding: FileCode2,
  debugging: AlertTriangle,
  short_answer: PenLine,
  architecture: Layers,
  system_design: Brain,
}

function examQuestionCount(definition: JavaExamDefinition): number {
  return JAVA_QUESTIONS.filter(
    (question) =>
      definition.levels.includes(question.level) &&
      definition.kinds.includes(question.kind),
  ).length
}

export function JavaExamPage() {
  const hydrate = useJavaExamStore((state) => state.hydrate)
  const hydrated = useJavaExamStore((state) => state.hydrated)
  const screen = useJavaExamStore((state) => state.screen)
  const storageKind = useJavaExamStore((state) => state.storageKind)

  useEffect(() => {
    void hydrate()
  }, [hydrate])

  if (!hydrated) {
    return (
      <div className="flex min-h-full items-center justify-center p-16">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading your exam data…
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full">
      {screen === 'catalogue' && <Catalogue />}
      {screen === 'instructions' && <Instructions />}
      {screen === 'test' && <TestScreenLazy />}
      {screen === 'reveal' && <RevealScreenLazy />}
      {screen === 'result' && <ResultScreenLazy />}
      {screen === 'history' && <HistoryScreenLazy />}
      {screen === 'mastery' && <MasteryScreenLazy />}
      {storageKind === 'memory' && (
        <p className="border-t px-4 py-2 text-center text-[11px] text-muted-foreground">
          {javaStorageLabel(storageKind)}
        </p>
      )}
    </div>
  )
}

/* ── Catalogue ─────────────────────────────────────────────────────────────── */

function Catalogue() {
  const startExam = useJavaExamStore((state) => state.startExam)
  const goToHistory = useJavaExamStore((state) => state.goToHistory)
  const goToMastery = useJavaExamStore((state) => state.goToMastery)
  const results = useJavaExamStore((state) => state.results)
  const revisionPlan = useJavaExamStore((state) => state.revisionPlan)
  const startRevisionExam = useJavaExamStore((state) => state.startRevisionExam)

  const lastPercentage = results[0]?.overall.percentage
  const bestPercentage = results.reduce((best, item) => Math.max(best, item.overall.percentage), 0)

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-14">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge variant="secondary" className="mb-3 gap-1.5 rounded-full px-3 py-1">
            <Sparkles className="size-3.5 text-primary" />
            {JAVA_QUESTIONS.length} questions · {new Set(JAVA_QUESTIONS.map((q) => q.domain)).size} domains · L1–L5
          </Badge>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Java Interview Exams</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Timed exams across the full backend curriculum — fundamentals to system design. Objective questions are
            auto-graded; subjective answers are revealed at submission for self-grading against model answers with a
            rubric. Mastery tracking and weak-area revision exams included.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={goToMastery}>
            <TrendingUp className="size-4" />
            Mastery
          </Button>
          <Button variant="outline" size="sm" onClick={goToHistory}>
            <Trophy className="size-4" />
            History
            {results.length > 0 && (
              <span className="rounded-full bg-muted px-1.5 text-[10px] font-semibold">{results.length}</span>
            )}
          </Button>
        </div>
      </header>

      {/* progress strip */}
      <div className="mt-8 grid grid-cols-3 gap-3">
        {[
          { label: 'Exams taken', value: String(results.length), icon: Trophy },
          { label: 'Last score', value: lastPercentage !== undefined ? `${lastPercentage}%` : '—', icon: TrendingUp },
          { label: 'Best score', value: results.length > 0 ? `${bestPercentage}%` : '—', icon: BadgeCheck },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label} className="gap-0 border-border/60 py-0">
            <CardContent className="flex items-center gap-3 p-4">
              <Icon className="size-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-lg font-black">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* revision plan */}
      {revisionPlan.length > 0 && (
        <Card className="mt-6 border-primary/30 bg-primary/5">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
            <div>
              <p className="flex items-center gap-2 text-sm font-bold">
                <Wand2 className="size-4 text-primary" />
                Revision plan ready
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Weakest domains: {revisionPlan.map((item) => `${item.domain} (${item.ema}%)`).join(' · ')}
              </p>
            </div>
            <Button size="sm" onClick={startRevisionExam}>
              <RotateCcw className="size-4" />
              Start revision exam
            </Button>
          </CardContent>
        </Card>
      )}

      {/* exam cards */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {JAVA_EXAMS.map((exam) => {
          const available = examQuestionCount(exam)
          return (
            <Card
              key={exam.id}
              className="group flex h-full flex-col overflow-hidden border-border/60 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <div className={cn('h-1.5 w-full bg-gradient-to-r', exam.accent)} />
              <CardContent className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold tracking-tight">{exam.name}</h3>
                  <Badge variant="outline" className="shrink-0 rounded-full text-[10px]">
                    {exam.levels.map((level) => `L${level}`).join('+')}
                  </Badge>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">{exam.description}</p>
                <div className="mt-auto space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {exam.kinds.slice(0, 5).map((kind) => {
                      const Icon = KIND_ICONS[kind] ?? ListChecks
                      return (
                        <span
                          key={kind}
                          className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                        >
                          <Icon className="size-3" />
                          {KIND_META[kind].label}
                        </span>
                      )
                    })}
                    {exam.kinds.length > 5 && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                        +{exam.kinds.length - 5} more
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <ListChecks className="size-3.5" />
                      {Math.min(exam.questionCount, available)} of {available} available
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Timer className="size-3.5" />
                      {formatDurationWords(exam.durationMinutes * 60)}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    className="w-full"
                    disabled={available === 0}
                    onClick={() => startExam(exam.id)}
                  >
                    <Play className="size-4" />
                    Start exam
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-3.5" />
          Durations: {EXAM_DURATIONS.join(' / ')} min depending on exam
        </span>
        <span>
          Scoring: objective +1 / −0.25 · multiple-select partial credit · subjective self-graded 0–5 against the
          model answer
        </span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Levels: {LEVEL_LABELS[1]} → {LEVEL_LABELS[5]}. The 180-minute final exam certifies senior readiness across
        every question kind.
      </p>
    </div>
  )
}

/* ── Instructions ──────────────────────────────────────────────────────────── */

function Instructions() {
  const session = useJavaExamStore((state) => state.session)
  const beginTest = useJavaExamStore((state) => state.beginTest)
  const discardSession = useJavaExamStore((state) => state.discardSession)
  if (!session) return null

  const subjective = session.questionIds.filter((id) => {
    const question = JAVA_QUESTIONS.find((item) => item.id === id)
    return question && KIND_META[question.kind].subjective
  }).length

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-14">
      <h1 className="text-2xl font-black tracking-tight">{session.examName}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {session.questionIds.length} questions · {formatDurationWords(session.durationSeconds)} · negative marking{' '}
        {session.negativeMarking ? 'on (−0.25 per wrong objective answer)' : 'off'}
      </p>

      <Card className="mt-6">
        <CardContent className="space-y-3 p-6 text-sm">
          <p className="font-semibold">Before you begin</p>
          <ul className="list-disc space-y-1.5 pl-5 text-muted-foreground">
            <li>One question at a time — navigate with the palette or previous/next.</li>
            <li>The timer keeps running; auto-save happens on every action.</li>
            <li>Mark questions for review and revisit them before submitting.</li>
            {subjective > 0 && (
              <li>
                {subjective} subjective question(s): after submission you will see the model answer and rubric and
                grade yourself 0–5 honestly.
              </li>
            )}
            <li>Answers are not revealed during the exam.</li>
          </ul>
        </CardContent>
      </Card>

      <div className="mt-6 flex gap-3">
        <Button onClick={() => void beginTest()} className="flex-1">
          <Play className="size-4" />
          Start now
        </Button>
        <Button variant="outline" onClick={() => void discardSession()}>
          Cancel
        </Button>
      </div>
    </div>
  )
}

/* ── Lazy-loaded heavy screens ─────────────────────────────────────────────── */

const LazyTestScreen = lazy(() => import('./components/TestScreen').then((m) => ({ default: m.TestScreen })))
const LazyRevealScreen = lazy(() => import('./components/RevealScreen').then((m) => ({ default: m.RevealScreen })))
const LazyResultScreen = lazy(() => import('./components/ResultScreen').then((m) => ({ default: m.ResultScreen })))
const LazyHistoryScreen = lazy(() => import('./components/HistoryScreen').then((m) => ({ default: m.HistoryScreen })))
const LazyMasteryScreen = lazy(() => import('./components/HistoryScreen').then((m) => ({ default: m.MasteryScreen })))

function ScreenFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
      <Loader2 className="mr-2 size-4 animate-spin" />
      Loading…
    </div>
  )
}

function TestScreenLazy() {
  return (
    <Suspense fallback={<ScreenFallback />}>
      <LazyTestScreen />
    </Suspense>
  )
}
function RevealScreenLazy() {
  return (
    <Suspense fallback={<ScreenFallback />}>
      <LazyRevealScreen />
    </Suspense>
  )
}
function ResultScreenLazy() {
  return (
    <Suspense fallback={<ScreenFallback />}>
      <LazyResultScreen />
    </Suspense>
  )
}
function HistoryScreenLazy() {
  return (
    <Suspense fallback={<ScreenFallback />}>
      <LazyHistoryScreen />
    </Suspense>
  )
}
function MasteryScreenLazy() {
  return (
    <Suspense fallback={<ScreenFallback />}>
      <LazyMasteryScreen />
    </Suspense>
  )
}
