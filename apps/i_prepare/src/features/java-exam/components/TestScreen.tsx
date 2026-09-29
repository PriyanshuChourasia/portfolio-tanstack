import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  CircleDot,
  Flag,
  Loader2,
  Timer as TimerIcon,
  XCircle,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { formatClock } from '@/features/i-prepare/lib/time'
import {
  KIND_META,
  LEVEL_LABELS,
  type JavaAnswer,
  type JavaExamSession,
  type JavaQuestion,
} from '../types'
import { JAVA_QUESTIONS } from '../data/questions'
import { isSubjective } from '../engine/scoring'
import { useJavaExamStore } from '../store'

function computeRemaining(session: JavaExamSession): number {
  const elapsedMs = Date.now() - Date.parse(session.startedAt)
  return Math.max(0, Math.round(session.durationSeconds - elapsedMs / 1000))
}

export function TestScreen() {
  const session = useJavaExamStore((state) => state.session)
  const submitExam = useJavaExamStore((state) => state.submitExam)
  const goToQuestion = useJavaExamStore((state) => state.goToQuestion)
  const nextQuestion = useJavaExamStore((state) => state.nextQuestion)
  const previousQuestion = useJavaExamStore((state) => state.previousQuestion)
  const selectOption = useJavaExamStore((state) => state.selectOption)
  const toggleOption = useJavaExamStore((state) => state.toggleOption)
  const setText = useJavaExamStore((state) => state.setText)
  const clearAnswer = useJavaExamStore((state) => state.clearAnswer)
  const toggleMarkForReview = useJavaExamStore((state) => state.toggleMarkForReview)

  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(true)

  // Auto-submit on timeout.
  useEffect(() => {
    if (session && computeRemaining(session) <= 0) {
      setSubmitting(true)
      void submitExam()
    }
  }, [session, submitExam])

  if (!session || session.status !== 'active') return null

  const remaining = computeRemaining(session)
  const questions = session.questionIds
    .map((id) => JAVA_QUESTIONS.find((item) => item.id === id))
    .filter((item): item is JavaQuestion => Boolean(item))
  const current = questions[session.currentQuestionIndex]
  const answer = current ? session.answers[current.id] : undefined
  const lowTime = remaining <= 60

  const counts = useMemo(() => {
    let answered = 0
    let marked = 0
    let visited = 0
    for (const id of session.questionIds) {
      const item = session.answers[id]
      const hasObjective =
        item && (item.selectedIndex !== null || item.selectedIndices.length > 0 || item.text.trim() !== '')
      if (hasObjective) answered += 1
      if (item?.markedForReview) marked += 1
      if (item?.visited) visited += 1
    }
    return { answered, marked, visited, untouched: session.questionIds.length - visited }
  }, [session])

  if (!current || !answer) return null

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold">{session.examName}</p>
          <p className="text-xs text-muted-foreground">
            Question {session.currentQuestionIndex + 1} of {session.questionIds.length} · {counts.answered} answered ·{' '}
            {counts.marked} marked
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-sm font-bold tabular-nums',
              lowTime ? 'bg-destructive/10 text-destructive' : 'bg-muted',
            )}
          >
            <TimerIcon className={cn('size-4', lowTime && 'animate-pulse')} />
            {formatClock(remaining)}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setPaletteOpen(!paletteOpen)}>
            {paletteOpen ? 'Hide palette' : 'Show palette'}
          </Button>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-4">
        {/* question column */}
        <div className="min-w-0 flex-1">
          <Card>
            <CardContent className="space-y-5 p-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="rounded-full">{current.domain}</Badge>
                <Badge variant="outline" className="rounded-full">{LEVEL_LABELS[current.level]}</Badge>
                <Badge variant="secondary" className="rounded-full">{KIND_META[current.kind].label}</Badge>
                {answer.markedForReview && (
                  <Badge variant="outline" className="rounded-full border-amber-500/50 text-amber-500">
                    <Flag className="size-3" />
                    Marked
                  </Badge>
                )}
                {isSubjective(current.kind) && (
                  <span className="text-[11px] text-muted-foreground">
                    Self-graded after submission · {5} marks
                  </span>
                )}
              </div>

              <p className="whitespace-pre-wrap text-sm font-medium leading-relaxed">{current.prompt}</p>

              {current.code && (
                <pre className="overflow-x-auto rounded-lg border bg-muted/50 p-4 font-mono text-xs leading-relaxed">
                  {current.code}
                </pre>
              )}

              {/* answer area */}
              <AnswerArea
                question={current}
                answer={answer}
                onSelect={(index) => selectOption(current.id, index)}
                onToggle={(index) => toggleOption(current.id, index)}
                onText={(text) => setText(current.id, text)}
              />

              <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={session.currentQuestionIndex === 0}
                    onClick={previousQuestion}
                  >
                    <ArrowLeft className="size-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={session.currentQuestionIndex === session.questionIds.length - 1}
                    onClick={nextQuestion}
                  >
                    Next
                    <ArrowRight className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleMarkForReview(current.id)}
                  >
                    <Flag className="size-4" />
                    {answer.markedForReview ? 'Unmark' : 'Mark for review'}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => clearAnswer(current.id)}>
                    <XCircle className="size-4" />
                    Clear
                  </Button>
                </div>
                <Button
                  size="sm"
                  onClick={() => setShowSubmitConfirm(true)}
                  className="ml-auto"
                >
                  Submit exam
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* palette */}
        {paletteOpen && (
          <aside className="hidden w-56 shrink-0 lg:block">
            <Card className="sticky top-4">
              <CardContent className="p-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Questions
                </p>
                <div className="grid grid-cols-5 gap-1.5">
                  {session.questionIds.map((id, index) => {
                    const item = session.answers[id]
                    const isAnswered =
                      item && (item.selectedIndex !== null || item.selectedIndices.length > 0 || item.text.trim() !== '')
                    const isCurrent = index === session.currentQuestionIndex
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => goToQuestion(index)}
                        className={cn(
                          'relative flex size-8 items-center justify-center rounded-md border text-xs font-semibold transition-colors',
                          isCurrent
                            ? 'border-primary bg-primary text-primary-foreground'
                            : isAnswered
                              ? 'border-transparent bg-primary/15 text-primary'
                              : item?.visited
                                ? 'border-border bg-muted text-muted-foreground'
                                : 'border-dashed border-border text-muted-foreground',
                          item?.markedForReview && !isAnswered && 'border-amber-500/60',
                        )}
                        title={item?.markedForReview ? 'Marked for review' : undefined}
                      >
                        {index + 1}
                        {item?.markedForReview && (
                          <Flag className="absolute -right-1 -top-1 size-2.5 text-amber-500" />
                        )}
                      </button>
                    )
                  })}
                </div>
                <div className="mt-4 space-y-1.5 text-[11px] text-muted-foreground">
                  <p className="flex items-center gap-1.5">
                    <CircleDot className="size-3 text-primary" /> Current
                  </p>
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-3 text-primary/60" /> Answered ({counts.answered})
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Circle className="size-3" /> Visited, unanswered ({counts.visited - counts.answered})
                  </p>
                  <p className="flex items-center gap-1.5">
                    <AlertTriangle className="size-3 text-amber-500" /> Marked ({counts.marked})
                  </p>
                </div>
              </CardContent>
            </Card>
          </aside>
        )}
      </div>

      {/* submit confirmation */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="space-y-4 p-6">
              <p className="font-bold">Submit the exam?</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>
                  {session.questionIds.length - counts.answered} unanswered · {counts.marked} marked for review.
                </p>
                {counts.marked > 0 && <p>Marked questions keep your latest answer.</p>}
              </div>
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  disabled={submitting}
                  onClick={() => {
                    setSubmitting(true)
                    void submitExam()
                  }}
                >
                  {submitting && <Loader2 className="size-4 animate-spin" />}
                  Submit
                </Button>
                <Button variant="outline" onClick={() => setShowSubmitConfirm(false)} disabled={submitting}>
                  Keep working
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

/* ── Answer inputs ─────────────────────────────────────────────────────────── */

function AnswerArea({
  question,
  answer,
  onSelect,
  onToggle,
  onText,
}: {
  question: JavaQuestion
  answer: JavaAnswer
  onSelect: (index: number) => void
  onToggle: (index: number) => void
  onText: (text: string) => void
}) {
  if (question.kind === 'multiple_select') {
    return (
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Select all that apply.</p>
        {(question.options ?? []).map((option, index) => {
          const selected = answer.selectedIndices.includes(index)
          return (
            <button
              key={index}
              type="button"
              onClick={() => onToggle(index)}
              className={cn(
                'flex w-full items-start gap-3 rounded-lg border p-3 text-left text-sm transition-colors',
                selected ? 'border-primary bg-primary/10' : 'hover:border-primary/50 hover:bg-muted/50',
              )}
            >
              <span
                className={cn(
                  'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border',
                  selected ? 'border-primary bg-primary text-primary-foreground' : 'border-border',
                )}
              >
                {selected && <CheckCircle2 className="size-3" />}
              </span>
              <span className="font-mono text-xs text-muted-foreground">{String.fromCharCode(65 + index)}</span>
              <span className="min-w-0">{option}</span>
            </button>
          )
        })}
      </div>
    )
  }

  if (isSubjective(question.kind)) {
    return (
      <div className="space-y-2">
        <textarea
          value={answer.text}
          onChange={(event) => onText(event.target.value)}
          rows={question.kind === 'system_design' || question.kind === 'architecture' ? 10 : 6}
          placeholder={
            question.kind === 'debugging'
              ? 'Describe the root cause, evidence from the code/logs, and the fix…'
              : question.kind === 'coding'
                ? 'Write your approach, the implementation and complexity…'
                : 'Write your answer…'
          }
          className="w-full rounded-lg border bg-background p-3 font-mono text-sm leading-relaxed outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
        />
        <p className="text-[11px] text-muted-foreground">
          {answer.text.trim().length} characters · graded after submission against the model answer
        </p>
      </div>
    )
  }

  // mcq / true_false / output_prediction / code_completion
  return (
    <div className="space-y-2">
      {(question.options ?? []).map((option, index) => {
        const selected = answer.selectedIndex === index
        return (
          <button
            key={index}
            type="button"
            onClick={() => onSelect(index)}
            className={cn(
              'flex w-full items-start gap-3 rounded-lg border p-3 text-left text-sm transition-colors',
              selected ? 'border-primary bg-primary/10' : 'hover:border-primary/50 hover:bg-muted/50',
            )}
          >
            <span
              className={cn(
                'flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold',
                selected ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground',
              )}
            >
              {String.fromCharCode(65 + index)}
            </span>
            <span className="min-w-0 whitespace-pre-wrap">{option}</span>
          </button>
        )
      })}
    </div>
  )
}
