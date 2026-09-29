import { useMemo } from 'react'
import {
  ArrowRight,
  Award,
  BookOpenCheck,
  Clock3,
  History,
  Play,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
  Trophy,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { EXAMS, questionsForExam, topicsForExam } from '@/data/reasoning'
import type { TestResult } from '@/data/reasoning'
import { JAVA_EXAMS } from '@/features/java-exam/types'
import { JAVA_QUESTIONS } from '@/features/java-exam/data/questions'
import { useIPrepareStore } from '@/features/i-prepare/store'
import { formatDateTime } from '@/features/i-prepare/lib/time'
import { useTheme } from '@/lib/theme'
import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ── helpers ─────────────────────────────────────────────────────────────── */

function previousBest(results: TestResult[], examId: string): TestResult | null {
  const forExam = results.filter((result) => result.examId === examId)
  if (forExam.length === 0) return null
  return forExam.reduce((best, current) =>
    current.overall.percentage > best.overall.percentage ? current : best,
  )
}

const KIND_LABEL: Record<'exam' | 'practice', string> = {
  exam: 'Exam section',
  practice: 'Practice paper',
}

/* ── page ────────────────────────────────────────────────────────────────── */

export function LandingPage() {
  const results = useIPrepareStore((state) => state.results)
  const goToHistory = useIPrepareStore((state) => state.goToHistory)
  const selectExam = useIPrepareStore((state) => state.selectExam)
  const { theme, toggle } = useTheme()

  const stats = useMemo(() => {
    const totalQuestions = EXAMS.reduce((sum, exam) => sum + questionsForExam(exam.id).length, 0)
    const attempted = results.length
    const best = results.reduce<TestResult | null>(
      (best, current) =>
        !best || current.overall.percentage > best.overall.percentage ? current : best,
      null,
    )
    const avgAccuracy =
      attempted > 0
        ? Math.round(results.reduce((sum, r) => sum + r.overall.accuracy, 0) / attempted)
        : null
    return { totalQuestions, attempted, best, avgAccuracy }
  }, [results])

  const recentResults = results.slice(0, 3)

  return (
    <div className="relative min-h-full">
      {/* ambient background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-primary/10 to-transparent dark:from-primary/15"
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        {/* ── top bar ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="size-4 text-primary" />
            Reasoning &amp; English mock tests for competitive exams
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={goToHistory}>
              <History className="size-4" />
              History
              {results.length > 0 && (
                <span className="rounded-full bg-muted px-1.5 text-[10px] font-semibold">
                  {results.length}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* ── hero ────────────────────────────────────────────────────── */}
        <section className="mt-10 animate-fade-up text-center">
          <Badge variant="secondary" className="mb-4 gap-1.5 rounded-full px-3 py-1">
            <BookOpenCheck className="size-3.5 text-primary" />
            {EXAMS.length} mock tests · {stats.totalQuestions} questions · verbal + non-verbal
          </Badge>
          <h1 className="mx-auto max-w-2xl text-4xl font-black tracking-tight sm:text-5xl">
            Practice like the{' '}
            <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
              real exam
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
            Exam-style wizard with one question at a time, a persistent timer, an answer palette,
            auto-saved progress and a detailed evaluation at the end.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button size="lg" onClick={() => selectExam(EXAMS[0].id)}>
              <Play className="size-4" />
              Start a mock test
            </Button>
            <Button size="lg" variant="outline" onClick={goToHistory}>
              <TrendingUp className="size-4" />
              View progress
            </Button>
          </div>
        </section>

        {/* ── stat cards ──────────────────────────────────────────────── */}
        <section className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {[
            {
              icon: BookOpenCheck,
              label: 'Mock tests',
              value: String(EXAMS.length),
              hint: 'Reasoning & English',
            },
            {
              icon: Target,
              label: 'Questions in bank',
              value: String(stats.totalQuestions),
              hint: 'PYQ-pattern MCQs',
            },
            {
              icon: Trophy,
              label: 'Tests attempted',
              value: String(stats.attempted),
              hint: stats.attempted > 0 ? 'Keep it going' : 'Start your first',
            },
            {
              icon: TrendingUp,
              label: 'Avg. accuracy',
              value: stats.avgAccuracy !== null ? `${stats.avgAccuracy}%` : '—',
              hint: stats.best ? `Best ${stats.best.overall.percentage}%` : 'No data yet',
            },
          ].map(({ icon: Icon, label, value, hint }) => (
            <Card
              key={label}
              className="gap-0 overflow-hidden border-border/60 py-0 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <CardContent className="flex items-start gap-3 p-4 sm:p-5">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="size-4.5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs text-muted-foreground">{label}</p>
                  <p className="mt-0.5 text-xl font-black tracking-tight sm:text-2xl">{value}</p>
                  <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{hint}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* ── test catalogue ──────────────────────────────────────────── */}
        <section className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-black tracking-tight sm:text-2xl">Choose your test</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Real exam patterns, configurable duration, difficulty and topics.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {EXAMS.map((exam) => {
              const bank = questionsForExam(exam.id)
              const topics = topicsForExam(exam.id)
              const best = previousBest(results, exam.id)

              return (
                <Card
                  key={exam.id}
                  className="group flex h-full flex-col overflow-hidden border-border/60 bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                >
                  <div className={cn('h-1.5 w-full bg-gradient-to-r', exam.accent)} />
                  <CardContent className="flex flex-1 flex-col gap-4 p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold tracking-tight">{exam.name}</h3>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {KIND_LABEL[exam.kind]} · {exam.difficultyLabel}
                        </p>
                      </div>
                      <Badge variant="outline" className="shrink-0 rounded-full text-[10px]">
                        {exam.subject}
                      </Badge>
                    </div>

                    <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {exam.description}
                    </p>

                    <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                      <div className="flex items-center gap-1.5">
                        <BookOpenCheck className="size-3.5 shrink-0 text-muted-foreground" />
                        <span className="text-muted-foreground">{bank.length} questions</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock3 className="size-3.5 shrink-0 text-muted-foreground" />
                        <span className="text-muted-foreground">{exam.defaultDurationMinutes} min</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Timer className="size-3.5 shrink-0 text-muted-foreground" />
                        <span className="text-muted-foreground">{topics.length} topics</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Award className="size-3.5 shrink-0 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {best ? `${best.overall.percentage}% best` : 'No attempts'}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {topics.slice(0, 3).map((topic) => (
                        <span
                          key={topic}
                          className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                        >
                          {topic}
                        </span>
                      ))}
                      {topics.length > 3 && (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                          +{topics.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="mt-auto flex items-center justify-between border-t pt-3">
                      <span className="text-[11px] text-muted-foreground">{exam.patternNote}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-primary hover:text-primary"
                        onClick={() => selectExam(exam.id)}
                      >
                        Start
                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* ── java exams ─────────────────────────────────────────────── */}
        <section className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-black tracking-tight sm:text-2xl">Java Interview Exams</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Timed backend exams with auto-grading, self-graded subjective answers, mastery tracking and
                revision exams — {JAVA_QUESTIONS.length} questions across fundamentals to system design.
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {JAVA_EXAMS.map((exam) => (
              <a
                key={exam.id}
                href="/java-exam"
                className={cn(
                  'group block rounded-xl border border-border/60 bg-gradient-to-br p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md',
                  exam.accent,
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold tracking-tight">{exam.name}</h3>
                  <Badge variant="outline" className="shrink-0 rounded-full bg-card/60 text-[10px]">
                    L{Math.min(...exam.levels)}–L{Math.max(...exam.levels)}
                  </Badge>
                </div>
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {exam.description}
                </p>
                <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{exam.questionCount} questions</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-primary">
                    Open
                    <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ── recent results ──────────────────────────────────────────── */}
        {recentResults.length > 0 && (
          <section className="mt-12">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-black tracking-tight sm:text-2xl">Recent results</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your last three completed tests, saved locally.
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={goToHistory}>
                View all
                <ArrowRight className="size-3.5" />
              </Button>
            </div>

            <div className="mt-6 space-y-3">
              {recentResults.map((result) => (
                <Card
                  key={result.id}
                  className="flex flex-wrap items-center gap-4 border-border/60 py-0 shadow-sm"
                >
                  <CardContent className="flex flex-1 flex-wrap items-center gap-4 p-4">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">
                        {result.examName} · {result.testTitle}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {formatDateTime(result.submittedAt)} · {result.overall.attempted}/
                        {result.overall.totalQuestions} attempted
                        {result.submitReason === 'timeout' && ' · auto-submitted'}
                      </p>
                    </div>
                    <Separator orientation="vertical" className="hidden h-8 sm:block" />
                    <div className="flex items-center gap-4 text-xs">
                      <div>
                        <p className="text-muted-foreground">Score</p>
                        <p className="font-bold">
                          {result.overall.score}/{result.overall.maxScore}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Accuracy</p>
                        <p className="font-bold">{result.overall.accuracy}%</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => useIPrepareStore.getState().openResult(result.id)}>
                        Open
                        <ArrowRight className="size-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* ── footer note ─────────────────────────────────────────────── */}
        <p className="mt-12 text-center text-xs leading-relaxed text-muted-foreground">
          Every question is newly written to follow the previous-year pattern of its exam and is
          labelled <strong>PYQ-pattern</strong> in the review screens — no generated question is
          presented as an actual previous-year question.
        </p>
      </div>
    </div>
  )
}
