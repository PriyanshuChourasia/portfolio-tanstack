import { useState } from 'react'
import {
  ArrowLeft,
  BookOpenCheck,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Clock3,
  MinusCircle,
  TrendingUp,
  Trophy,
  XCircle,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { formatDateTime, formatDurationWords } from '@/features/i-prepare/lib/time'
import { KIND_META, LEVEL_LABELS, MASTERY_LABELS, type JavaQuestionResult, type JavaOutcome } from '../types'
import { useJavaExamStore } from '../store'

const OUTCOME_STYLE: Record<JavaOutcome, { icon: typeof CheckCircle2; className: string; label: string }> = {
  correct: { icon: CheckCircle2, className: 'text-emerald-500', label: 'Correct' },
  partial: { icon: MinusCircle, className: 'text-amber-500', label: 'Partial' },
  incorrect: { icon: XCircle, className: 'text-destructive', label: 'Incorrect' },
  unanswered: { icon: CircleAlert, className: 'text-muted-foreground', label: 'Unanswered' },
}

export function ResultScreen() {
  const results = useJavaExamStore((state) => state.results)
  const activeResultId = useJavaExamStore((state) => state.activeResultId)
  const goToCatalogue = useJavaExamStore((state) => state.goToCatalogue)
  const goToHistory = useJavaExamStore((state) => state.goToHistory)
  const goToMastery = useJavaExamStore((state) => state.goToMastery)
  const mastery = useJavaExamStore((state) => state.mastery)

  const result = results.find((item) => item.id === activeResultId) ?? results[0]
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (!result) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-sm text-muted-foreground">No result selected.</p>
        <Button className="mt-4" onClick={goToCatalogue}>
          Back to exams
        </Button>
      </div>
    )
  }

  const { overall } = result
  const verdict =
    overall.percentage >= 85
      ? 'Senior-ready performance'
      : overall.percentage >= 70
        ? 'Interview ready — polish the weak domains'
        : overall.percentage >= 50
          ? 'Developing — revision exam recommended'
          : 'Learning — focus on fundamentals first'

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-12">
      <button
        type="button"
        onClick={goToCatalogue}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Exams
      </button>

      {/* header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">{result.examName}</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatDateTime(result.submittedAt)} · {formatDurationWords(result.timeUsedSeconds)} used of{' '}
            {formatDurationWords(result.durationSeconds)}
            {result.submitReason === 'timeout' && ' · auto-submitted'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-4xl font-black tracking-tight text-primary">{overall.percentage}%</p>
          <p className="text-xs text-muted-foreground">
            {overall.score}/{overall.maxScore} marks · {verdict}
          </p>
        </div>
      </div>

      {/* summary cards */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Attempted', value: `${overall.attempted}/${overall.totalQuestions}`, icon: BookOpenCheck },
          { label: 'Correct', value: String(overall.correct), icon: CheckCircle2 },
          { label: 'Partial', value: String(overall.partial), icon: MinusCircle },
          { label: 'Incorrect', value: String(overall.incorrect), icon: XCircle },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label} className="gap-0 border-border/60 py-0">
            <CardContent className="flex items-center gap-3 p-4">
              <Icon className="size-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-lg font-black">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {/* domain breakdown */}
        <Card>
          <CardContent className="p-5">
            <p className="mb-4 flex items-center gap-2 text-sm font-bold">
              <Trophy className="size-4 text-primary" />
              Domain performance
            </p>
            <div className="space-y-3">
              {result.domainScores.map((domain) => (
                <div key={domain.domain}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-semibold">{domain.domain}</span>
                    <span className="text-muted-foreground">
                      {domain.earned}/{domain.max} · {domain.percentage}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        domain.percentage >= 75
                          ? 'bg-emerald-500'
                          : domain.percentage >= 50
                            ? 'bg-amber-500'
                            : 'bg-destructive/70',
                      )}
                      style={{ width: `${domain.percentage}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {domain.correct} correct · {domain.partial} partial · {domain.incorrect} incorrect ·{' '}
                    {domain.unanswered} unanswered · {domain.avgTimeSeconds}s avg
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {/* question kinds */}
          <Card>
            <CardContent className="p-5">
              <p className="mb-4 flex items-center gap-2 text-sm font-bold">
                <BookOpenCheck className="size-4 text-primary" />
                Question formats
              </p>
              <div className="space-y-2 text-xs">
                {result.kindScores.map((kind) => (
                  <div key={kind.kind} className="flex items-center justify-between gap-2">
                    <span className="font-semibold">{kind.label}</span>
                    <span className="text-muted-foreground">
                      {kind.attempted}/{kind.total} attempted · {kind.percentage}%
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-1.5 text-xs">
                {result.levelScores.map((level) => (
                  <div key={level.level} className="flex items-center justify-between gap-2">
                    <span className="text-muted-foreground">{level.label}</span>
                    <span className="font-semibold">{level.percentage}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* strengths / weaknesses */}
          <Card>
            <CardContent className="space-y-3 p-5 text-xs">
              {result.strongDomains.length > 0 && (
                <div>
                  <p className="mb-1 font-bold text-emerald-600 dark:text-emerald-400">Strong areas</p>
                  <p className="text-muted-foreground">
                    {result.strongDomains.map((item) => `${item.domain} (${item.percentage}%)`).join(' · ')}
                  </p>
                </div>
              )}
              {result.weakDomains.length > 0 && (
                <div>
                  <p className="mb-1 font-bold text-destructive">Weak areas</p>
                  <p className="text-muted-foreground">
                    {result.weakDomains.map((item) => `${item.domain} (${item.percentage}%)`).join(' · ')}
                  </p>
                </div>
              )}
              <div>
                <p className="mb-1 font-bold">Time</p>
                <p className="text-muted-foreground">
                  <Clock3 className="mr-1 inline size-3" />
                  {overall.avgTimePerAnsweredSeconds}s per answered question
                  {result.timeAnalysis.slowest && ` · slowest ${result.timeAnalysis.slowest.seconds}s`}
                </p>
              </div>
              <Button size="sm" variant="outline" className="w-full" onClick={goToMastery}>
                <TrendingUp className="size-4" />
                View mastery tracker
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* summary + recommendations */}
      <Card className="mt-4">
        <CardContent className="grid gap-6 p-5 md:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-bold">Summary</p>
            <ul className="list-disc space-y-1.5 pl-5 text-xs text-muted-foreground">
              {result.summary.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 text-sm font-bold">Next steps</p>
            <ul className="list-disc space-y-1.5 pl-5 text-xs text-muted-foreground">
              {result.recommendations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* review */}
      <div className="mt-8">
        <h2 className="text-lg font-black tracking-tight">Review every question</h2>
        <div className="mt-4 space-y-2">
          {result.questionResults.map((item) => (
            <QuestionReview
              key={item.questionId}
              item={item}
              expanded={expandedId === item.questionId}
              onToggle={() => setExpandedId(expandedId === item.questionId ? null : item.questionId)}
              masteryLabel={MASTERY_LABELS[mastery[item.domain]?.state ?? 'not_started']}
            />
          ))}
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <Button variant="outline" className="flex-1" onClick={goToCatalogue}>
          Take another exam
        </Button>
        <Button variant="outline" className="flex-1" onClick={goToHistory}>
          All results
        </Button>
      </div>
    </div>
  )
}

function QuestionReview({
  item,
  expanded,
  onToggle,
  masteryLabel,
}: {
  item: JavaQuestionResult
  expanded: boolean
  onToggle: () => void
  masteryLabel: string
}) {
  const outcome = OUTCOME_STYLE[item.outcome]
  const OutcomeIcon = outcome.icon

  return (
    <Card className="gap-0 border-border/60 py-0">
      <button type="button" onClick={onToggle} className="flex w-full items-center gap-3 p-4 text-left">
        <OutcomeIcon className={cn('size-4 shrink-0', outcome.className)} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{item.prompt}</p>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[11px] text-muted-foreground">
            <span>{item.domain}</span>
            <span>· {LEVEL_LABELS[item.level]}</span>
            <span>· {KIND_META[item.kind].label}</span>
            <span>· {Math.round(item.timeSpentMs / 1000)}s</span>
            <span>
              · {item.earned}/{item.max}
            </span>
            {item.selfGrade !== null && <span>· self-graded {item.selfGrade}/5</span>}
          </p>
        </div>
        <Badge variant="outline" className="hidden shrink-0 rounded-full text-[10px] sm:inline-flex">
          {masteryLabel}
        </Badge>
        <ChevronDown className={cn('size-4 shrink-0 text-muted-foreground transition-transform', expanded && 'rotate-180')} />
      </button>

      {expanded && (
        <CardContent className="space-y-4 border-t px-6 pb-6 pt-4 text-sm">
          {item.code && (
            <pre className="overflow-x-auto rounded-lg border bg-muted/50 p-4 font-mono text-xs leading-relaxed">
              {item.code}
            </pre>
          )}

          {item.options && item.selectedIndex !== null && (
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">Your answer</p>
              <p className="rounded-lg border p-3">
                {String.fromCharCode(65 + item.selectedIndex)}. {item.options[item.selectedIndex]}
              </p>
            </div>
          )}
          {item.options && item.selectedIndices.length > 0 && (
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">Your answers</p>
              <p className="rounded-lg border p-3">
                {item.selectedIndices.map((index) => `${String.fromCharCode(65 + index)}`).join(', ')}
              </p>
            </div>
          )}
          {item.answerText.trim() !== '' && (
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">Your answer</p>
              <p className="rounded-lg border bg-muted/30 p-3 whitespace-pre-wrap">{item.answerText}</p>
            </div>
          )}

          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
              Correct / model answer
            </p>
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
              {item.options && typeof item.answerKey === 'number' && (
                <p className="mb-1 font-semibold">
                  {String.fromCharCode(65 + item.answerKey)}. {item.options[item.answerKey]}
                </p>
              )}
              {Array.isArray(item.answerKey) && item.options && (
                <p className="mb-1 font-semibold">
                  {item.answerKey.map((index) => String.fromCharCode(65 + index)).join(', ')}
                </p>
              )}
              {item.acceptedAnswers && <p className="mb-1 font-mono text-xs">{item.acceptedAnswers.join('  |  ')}</p>}
              {item.modelAnswer && <p className="whitespace-pre-wrap leading-relaxed">{item.modelAnswer}</p>}
            </div>
          </div>

          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">Explanation</p>
            <p className="leading-relaxed text-muted-foreground">{item.explanation}</p>
          </div>

          {item.trap && (
            <p className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-muted-foreground">
              <strong className="text-amber-600 dark:text-amber-400">Trap:</strong> {item.trap}
            </p>
          )}

          {item.followUps && item.followUps.length > 0 && (
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Interview follow-ups to practise
              </p>
              <ul className="list-disc space-y-1 pl-5 text-xs text-muted-foreground">
                {item.followUps.map((followUp) => (
                  <li key={followUp}>{followUp}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
