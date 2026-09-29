import { ArrowLeft, ClipboardList, TrendingUp, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatDateTime, formatDurationWords } from '@/features/i-prepare/lib/time'
import { MASTERY_LABELS, MASTERY_ORDER } from '../types'
import { useJavaExamStore } from '../store'

export function HistoryScreen() {
  const results = useJavaExamStore((state) => state.results)
  const openResult = useJavaExamStore((state) => state.openResult)
  const goToCatalogue = useJavaExamStore((state) => state.goToCatalogue)

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:py-12">
      <button
        type="button"
        onClick={goToCatalogue}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Exams
      </button>

      <h1 className="text-2xl font-black tracking-tight">Exam History</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Every attempt is stored with its full evaluation. Open any result to review the complete question breakdown.
      </p>

      {results.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border/60 bg-card p-10 text-center">
          <ClipboardList className="mx-auto size-8 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium">No exams taken yet.</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Finish your first Java exam to build a mastery profile and unlock revision exams.
          </p>
          <Button className="mt-5" onClick={goToCatalogue}>
            Take an exam
          </Button>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {results.map((result) => (
            <Card key={result.id} className="gap-0 border-border/60 py-0">
              <CardContent className="flex flex-wrap items-center gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{result.examName}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {formatDateTime(result.submittedAt)} · {formatDurationWords(result.timeUsedSeconds)} used
                    {result.submitReason === 'timeout' && ' · auto-submitted'}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <div>
                    <p className="text-muted-foreground">Score</p>
                    <p className="font-bold">
                      {result.overall.score}/{result.overall.maxScore}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Percentage</p>
                    <p className="font-bold">{result.overall.percentage}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Accuracy</p>
                    <p className="font-bold">{result.overall.accuracy}%</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => openResult(result.id)}>
                    Open
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* progress trend */}
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="flex items-start gap-3 p-5">
              <TrendingUp className="mt-0.5 size-5 text-primary" />
              <div className="text-xs text-muted-foreground">
                <p className="text-sm font-bold text-foreground">Trend</p>
                {(() => {
                  const chronological = [...results].reverse()
                  const last = chronological[chronological.length - 1]?.overall.percentage ?? 0
                  const first = chronological[0]?.overall.percentage ?? 0
                  const delta = last - first
                  return (
                    <p className="mt-1">
                      {chronological.map((item) => `${item.overall.percentage}%`).join(' → ')} —{' '}
                      {delta >= 0 ? `+${delta}` : delta} points since your first attempt.
                    </p>
                  )
                })()}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export function MasteryScreen() {
  const mastery = useJavaExamStore((state) => state.mastery)
  const revisionPlan = useJavaExamStore((state) => state.revisionPlan)
  const goToCatalogue = useJavaExamStore((state) => state.goToCatalogue)
  const startRevisionExam = useJavaExamStore((state) => state.startRevisionExam)

  const started = Object.values(mastery).filter((item) => item.attempts > 0)
  const mastered = started.filter((item) => item.state === 'mastered').length
  const interviewReady = started.filter((item) => item.state === 'interview_ready' || item.state === 'advanced').length

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:py-12">
      <button
        type="button"
        onClick={goToCatalogue}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Exams
      </button>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Mastery Tracker</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            A rolling average (EMA) of each domain across your exams. Consistency is required — single strong results
            cannot skip states.
          </p>
        </div>
        <div className="flex gap-4 text-xs">
          <div className="text-center">
            <p className="text-2xl font-black text-emerald-500">{mastered}</p>
            <p className="text-muted-foreground">Mastered</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-primary">{interviewReady}</p>
            <p className="text-muted-foreground">Interview ready+</p>
          </div>
        </div>
      </div>

      {/* legend */}
      <div className="mt-6 flex flex-wrap gap-1.5">
        {MASTERY_ORDER.map((state) => (
          <span key={state} className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
            {MASTERY_LABELS[state]}
          </span>
        ))}
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {Object.values(mastery).map((item) => (
          <Card key={item.domain} className="gap-0 border-border/60 py-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold">{item.domain}</p>
                <span
                  className={
                    'rounded-full px-2 py-0.5 text-[10px] font-semibold ' +
                    (item.state === 'mastered'
                      ? 'bg-emerald-500/15 text-emerald-500'
                      : item.state === 'advanced' || item.state === 'interview_ready'
                        ? 'bg-primary/15 text-primary'
                        : item.state === 'developing'
                          ? 'bg-amber-500/15 text-amber-500'
                          : item.state === 'learning'
                            ? 'bg-muted text-muted-foreground'
                            : 'bg-muted/50 text-muted-foreground/70')
                  }
                >
                  {MASTERY_LABELS[item.state]}
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${Math.min(100, item.ema)}%` }}
                />
              </div>
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                {item.attempts === 0
                  ? 'Not attempted yet'
                  : `${item.ema}% rolling · ${item.attempts} exam(s)`}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {revisionPlan.length > 0 && (
        <Card className="mt-6 border-primary/30 bg-primary/5">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
            <div className="text-xs text-muted-foreground">
              <p className="flex items-center gap-2 text-sm font-bold text-foreground">
                <Trophy className="size-4 text-primary" />
                Suggested revision
              </p>
              <p className="mt-1">
                {revisionPlan.map((item) => `${item.domain}: ~${item.suggestedQuestions} questions`).join(' · ')}
              </p>
            </div>
            <Button size="sm" onClick={startRevisionExam}>
              Start revision exam
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
