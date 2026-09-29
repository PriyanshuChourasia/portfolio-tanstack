import { useState } from 'react'
import { ArrowRight, Scale, SkipForward } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { KIND_META, LEVEL_LABELS, type JavaQuestionResult } from '../types'
import { useJavaExamStore } from '../store'

const GRADE_LABELS: Array<{ grade: number; label: string; tone: string }> = [
  { grade: 0, label: '0 — No answer', tone: 'border-destructive/50 text-destructive' },
  { grade: 1, label: '1 — Mostly missing', tone: 'text-destructive' },
  { grade: 2, label: '2 — Weak', tone: 'text-amber-500' },
  { grade: 3, label: '3 — Partial', tone: 'text-amber-500' },
  { grade: 4, label: '4 — Good', tone: 'text-emerald-500' },
  { grade: 5, label: '5 — Strong hire', tone: 'text-emerald-500' },
]

/**
 * Post-submission self-grading loop: model answer + rubric are revealed for each
 * subjective question and the candidate awards their own marks. Honest grading is
 * what feeds the mastery tracker, so the UI makes the rubric the anchor.
 */
export function RevealScreen() {
  const pendingResult = useJavaExamStore((state) => state.pendingResult)
  const gradeCurrentReveal = useJavaExamStore((state) => state.gradeCurrentReveal)
  const skipCurrentReveal = useJavaExamStore((state) => state.skipCurrentReveal)

  const ungraded = pendingResult?.questionResults.filter(
    (item) => KIND_META[item.kind].subjective && item.selfGrade === null,
  )
  const current: JavaQuestionResult | undefined = ungraded?.[0]
  const totalSubjective = pendingResult?.questionResults.filter((item) => KIND_META[item.kind].subjective).length ?? 0
  const gradedCount = totalSubjective - (ungraded?.length ?? 0)

  const [hoverGrade, setHoverGrade] = useState<number | null>(null)

  if (!pendingResult || !current) return null

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
      <header className="space-y-1">
        <Badge variant="secondary" className="gap-1.5 rounded-full px-3 py-1">
          <Scale className="size-3.5 text-primary" />
          Self-grading {gradedCount + 1} of {totalSubjective}
        </Badge>
        <h1 className="text-2xl font-black tracking-tight">Grade your answer honestly</h1>
        <p className="text-sm text-muted-foreground">
          Compare against the model answer and rubric. These grades feed your domain mastery — inflating them only
          cheats your own revision plan.
        </p>
      </header>

      <Card className="mt-6">
        <CardContent className="space-y-5 p-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="rounded-full">{current.domain}</Badge>
            <Badge variant="outline" className="rounded-full">{LEVEL_LABELS[current.level]}</Badge>
            <Badge variant="secondary" className="rounded-full">{KIND_META[current.kind].label}</Badge>
          </div>

          <p className="whitespace-pre-wrap text-sm font-medium leading-relaxed">{current.prompt}</p>
          {current.code && (
            <pre className="overflow-x-auto rounded-lg border bg-muted/50 p-4 font-mono text-xs leading-relaxed">
              {current.code}
            </pre>
          )}

          <div>
            <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">Your answer</p>
            <div className="rounded-lg border bg-muted/30 p-4 text-sm whitespace-pre-wrap">
              {current.answerText.trim() !== '' ? current.answerText : <em className="text-muted-foreground">Left blank</em>}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
              Model answer
            </p>
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm leading-relaxed whitespace-pre-wrap">
              {current.modelAnswer ?? '—'}
            </div>
          </div>

          {current.rubric && current.rubric.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                What a complete answer covers
              </p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {current.rubric.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {current.trap && (
            <p className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-muted-foreground">
              <strong className="text-amber-600 dark:text-amber-400">Common trap:</strong> {current.trap}
            </p>
          )}

          {/* grade picker */}
          <div className="border-t pt-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Your marks (0–5)
            </p>
            <div className="flex flex-wrap gap-2">
              {GRADE_LABELS.map(({ grade, label, tone }) => (
                <button
                  key={grade}
                  type="button"
                  onClick={() => void gradeCurrentReveal(grade)}
                  onMouseEnter={() => setHoverGrade(grade)}
                  onMouseLeave={() => setHoverGrade(null)}
                  className={cn(
                    'rounded-lg border px-3 py-2 text-xs font-semibold transition-all hover:-translate-y-0.5 hover:shadow-sm',
                    tone,
                    hoverGrade === grade && 'border-primary bg-primary/5',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={() => void skipCurrentReveal()}>
                <SkipForward className="size-4" />
                Skip (0 marks)
              </Button>
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                Next question
                <ArrowRight className="size-3" />
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
