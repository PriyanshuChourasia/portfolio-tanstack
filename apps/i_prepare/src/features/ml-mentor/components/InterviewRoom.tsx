import { useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Eye,
  MessagesSquare,
  Scale,
  Timer,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useMLMentorStore, getInterviewQuestion } from '../store'
import { cn } from '@/lib/utils'

export function InterviewRoom() {
  const mock = useMLMentorStore((state) => state.mock)
  const setMockAttempt = useMLMentorStore((state) => state.setMockAttempt)
  const revealMockAnswer = useMLMentorStore((state) => state.revealMockAnswer)
  const nextMockQuestion = useMLMentorStore((state) => state.nextMockQuestion)
  const finishMock = useMLMentorStore((state) => state.finishMock)
  const go = useMLMentorStore((state) => state.go)
  const [scoreDraft, setScoreDraft] = useState<string>('')

  if (!mock) return null
  const question = getInterviewQuestion(mock.questionIds[mock.currentIndex])
  if (!question) return null

  const answer = mock.answers[question.id]
  const revealed = answer?.score !== null && answer?.score !== undefined
  const isLast = mock.currentIndex === mock.questionIds.length - 1

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-12">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button variant="ghost" size="sm" onClick={() => go('dashboard')}>
          <ArrowLeft className="size-4" />
          Exit
        </Button>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1.5 rounded-full">
            <Timer className="size-3.5" />
            {mock.difficulty}{mock.escalated ? ' · escalating' : ''}
          </Badge>
          <Badge variant="outline" className="rounded-full">
            {mock.currentIndex + 1} / {mock.questionIds.length}
          </Badge>
        </div>
      </div>

      <h1 className="mt-4 flex items-center gap-2 text-xl font-black tracking-tight sm:text-2xl">
        <MessagesSquare className="size-5 text-primary" />
        Mock interview
      </h1>

      <Card className="mt-5">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="rounded-full text-[10px]">
              {question.category}
            </Badge>
            <Badge variant="outline" className="rounded-full text-[10px]">
              {question.difficulty}
            </Badge>
          </div>
          <p className="mt-3 text-base font-semibold leading-relaxed">{question.prompt}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Write your answer as you would speak it — direct answer, mechanism, example. Then reveal and score yourself
            honestly.
          </p>

          <Textarea
            value={answer?.attempt ?? ''}
            onChange={(event) => setMockAttempt(question.id, event.target.value)}
            placeholder="Type your spoken-style answer here before revealing the model answer…"
            className="mt-4 min-h-32"
          />

          {!revealed ? (
            <div className="mt-4 space-y-3">
              <ScoreSelector value={scoreDraft} onChange={setScoreDraft} />
              <Button
                className="w-full"
                onClick={() => {
                  const draft = Number(scoreDraft)
                  revealMockAnswer(question.id, Number.isFinite(draft) && draft >= 0 && draft <= 10 ? draft : 0)
                  setScoreDraft('')
                }}
              >
                <Eye className="size-4" />
                Reveal model answer &amp; score
              </Button>
              <p className="text-center text-[11px] text-muted-foreground">
                Pick your 0–10 self-score against the rubric, then reveal.
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-primary">Model answer</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{question.modelAnswer}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-primary">Rubric — a complete answer covers</p>
                <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {question.rubric.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-primary">Follow-up you'd face next</p>
                <p className="mt-1.5 rounded-lg bg-muted/60 p-3 text-sm leading-relaxed">{question.followUp}</p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="flex items-center gap-1.5 text-xs font-bold">
                  <Scale className="size-3.5 text-primary" />
                  Your self-score: {answer?.score}/10
                </p>
                <ScoreSelector
                  value={String(answer?.score ?? '')}
                  onChange={(value) => {
                    const parsed = Number(value)
                    if (Number.isFinite(parsed) && parsed >= 0 && parsed <= 10) {
                      revealMockAnswer(question.id, parsed)
                    }
                  }}
                />
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  setScoreDraft('')
                  if (isLast) {
                    finishMock()
                  } else {
                    nextMockQuestion()
                  }
                }}
              >
                {isLast ? (
                  <>
                    <BadgeCheck className="size-4" />
                    Finish interview
                  </>
                ) : (
                  <>
                    Next question
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

/* ── Score selector ────────────────────────────────────────────────────────── */

function ScoreSelector({
  value,
  onChange,
  disabled = false,
}: {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}) {
  return (
    <div className={cn('flex flex-wrap gap-1.5', disabled && 'opacity-40')}>
      {Array.from({ length: 11 }, (_, score) => (
        <button
          key={score}
          type="button"
          disabled={disabled}
          onClick={() => onChange(String(score))}
          className={cn(
            'flex size-8 items-center justify-center rounded-md border text-xs font-semibold transition-colors',
            value === String(score)
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
          )}
        >
          {score}
        </button>
      ))}
    </div>
  )
}
