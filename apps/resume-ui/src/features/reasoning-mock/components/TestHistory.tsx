import { lazy, Suspense } from 'react'
import { ArrowLeft, ClipboardList, ExternalLink, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useReasoningMockStore } from '../store'
import { formatDateTime, formatDurationWords } from '../lib/time'

// Recharts is only needed on this screen, so it stays out of the main bundle.
const ProgressChart = lazy(() =>
  import('./ProgressChart').then((module) => ({ default: module.ProgressChart })),
)

export function TestHistory() {
  const results = useReasoningMockStore((state) => state.results)
  const openResult = useReasoningMockStore((state) => state.openResult)
  const goToExams = useReasoningMockStore((state) => state.goToExams)

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-12">
      <button
        type="button"
        onClick={goToExams}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Exam selection
      </button>

      <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Test History</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Every completed test is stored with its full evaluation, so you can reopen any result later.
      </p>

      {results.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border/60 p-10 text-center">
          <ClipboardList className="mx-auto size-8 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium">No completed tests yet.</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Finish a reasoning mock to see your score, topic analysis and progress here.
          </p>
          <Button className="mt-5" onClick={goToExams}>
            Start a test
          </Button>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          <ul className="grid gap-3">
            {results.map((result) => (
              <li
                key={result.id}
                className="flex flex-wrap items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-sm"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">
                    {result.examName} · {result.testTitle}
                  </p>
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
                    <p className="text-muted-foreground">Accuracy</p>
                    <p className="font-bold">{result.overall.accuracy}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Attempt rate</p>
                    <p className="font-bold">{result.overall.attemptRate}%</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => openResult(result.id)}>
                    Open
                    <ExternalLink className="size-3.5" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          <Suspense
            fallback={
              <div className="flex h-40 items-center justify-center rounded-2xl border border-border/60 bg-card text-sm text-muted-foreground">
                <Loader2 className="mr-2 size-4 animate-spin" />
                Loading progress chart…
              </div>
            }
          >
            <ProgressChart results={results} />
          </Suspense>
        </div>
      )}
    </div>
  )
}
