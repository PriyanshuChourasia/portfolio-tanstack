import { useState } from 'react'
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  FlaskConical,
  Repeat,
  Sparkles,
  Terminal,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useMLMentorStore, getModule } from '../store'
import { QuizRunner } from './QuizRunner'

export function DailySessionView() {
  const dailySession = useMLMentorStore((state) => state.dailySession)
  const answerSessionQuestion = useMLMentorStore((state) => state.answerSessionQuestion)
  const completeSession = useMLMentorStore((state) => state.completeSession)
  const go = useMLMentorStore((state) => state.go)
  const [sessionIndex, setSessionIndex] = useState(0)
  const [notes, setNotes] = useState('')
  if (!dailySession) return null

  const module = getModule(dailySession.moduleId)
  const topic = module?.topics.find((t) => t.id === dailySession.topicId)

  return (
    <div>
      <div className="mx-auto w-full max-w-2xl px-4 pt-6">
        <Button variant="ghost" size="sm" onClick={() => go('dashboard')}>
          <ArrowLeft className="size-4" />
          Dashboard
        </Button>
      </div>

      <div className="mx-auto w-full max-w-2xl px-4 pb-10">
        <Badge variant="secondary" className="gap-1.5 rounded-full px-3 py-1">
          <Sparkles className="size-3.5 text-primary" />
          Today's preparation · {dailySession.moduleTitle}
        </Badge>
        <h1 className="mt-3 text-2xl font-black tracking-tight">{dailySession.topicTitle}</h1>

        {/* Lesson recap */}
        {topic && (
          <Card className="mt-5">
            <CardContent className="p-5">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary">
                <BookOpen className="size-3.5" />
                Lesson
              </p>
              <div className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground">
                {topic.lesson.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              <p className="mt-4 rounded-lg bg-primary/5 p-3 text-sm italic leading-relaxed">{topic.intuition}</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {topic.keyPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Exercise + coding task */}
        <Card className="mt-4">
          <CardContent className="space-y-3 p-5">
            <div>
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary">
                <FlaskConical className="size-3.5" />
                Practice exercise
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{dailySession.exercise}</p>
            </div>
            {dailySession.codingTask && (
              <div>
                <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary">
                  <Terminal className="size-3.5" />
                  Coding task
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{dailySession.codingTask}</p>
              </div>
            )}
            <Textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Optional: jot your approach or paste code here (kept only in this tab)…"
              className="min-h-20"
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                {dailySession.answeredTopicIds.length}/{dailySession.questions.length} check questions answered
              </p>
              <Button onClick={completeSession}>
                <CheckCircle2 className="size-4" />
                Mark today complete
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Spaced revision prompts */}
        {dailySession.revisionPrompts.length > 0 && (
          <Card className="mt-4 border-amber-500/20 bg-amber-500/5">
            <CardContent className="p-5">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-amber-600 dark:text-amber-400">
                <Repeat className="size-3.5" />
                Spaced revision
              </p>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Explain these earlier topics out loud in 30 seconds each:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {dailySession.revisionPrompts.map((prompt, index) => (
                  <li key={index}>{prompt}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Check questions */}
      {dailySession.questions.length > 0 && (
        <QuizRunner
          title="Knowledge check"
          subtitle={`Questions on "${dailySession.topicTitle}" — instant feedback on selection.`}
          questions={dailySession.questions.map((question) => ({
            id: `session:${question.questionId}`,
            prompt: question.prompt,
            options: question.options,
            topicId: question.topicId,
          }))}
          selections={sessionSelections(dailySession)}
          index={Math.min(sessionIndex, dailySession.questions.length - 1)}
          onSelect={(compositeId, optionIndex) => {
            answerSessionQuestion(compositeId.replace('session:', ''), optionIndex)
            setSessionIndex((index) => Math.min(index + 1, dailySession.questions.length - 1))
          }}
          onPrevious={() => setSessionIndex((index) => Math.max(index - 1, 0))}
          onNext={() => setSessionIndex((index) => Math.min(index + 1, dailySession.questions.length - 1))}
          onSubmit={completeSession}
          onJumpTo={setSessionIndex}
        />
      )}
    </div>
  )
}

/** The session store only tracks answered ids/correctness, so derive selections for display. */
function sessionSelections(session: NonNullable<ReturnType<typeof useMLMentorStore.getState>['dailySession']>) {
  const selections: Record<string, number | null> = {}
  for (const question of session.questions) {
    const answered = session.answeredTopicIds.includes(question.questionId)
    selections[`session:${question.questionId}`] = answered ? question.answerIndex : null
  }
  return selections
}

export function SessionResult() {
  const dailySession = useMLMentorStore((state) => state.dailySession)
  const go = useMLMentorStore((state) => state.go)
  const startDailySession = useMLMentorStore((state) => state.startDailySession)
  if (!dailySession) return null

  const accuracy =
    dailySession.questions.length > 0
      ? Math.round((dailySession.correctCount / dailySession.questions.length) * 100)
      : 0

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-14">
      <Badge variant="secondary" className="gap-1.5 rounded-full px-3 py-1">
        <Sparkles className="size-3.5 text-primary" />
        Session complete
      </Badge>
      <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">Nice work — session logged</h1>

      <Card className="mt-6">
        <CardContent className="space-y-3 p-5 text-sm">
          <p>
            <span className="font-bold">Topic:</span> {dailySession.topicTitle}
          </p>
          <p>
            <span className="font-bold">Check accuracy:</span> {dailySession.correctCount}/
            {dailySession.questions.length} ({accuracy}%)
          </p>
          <p>
            <span className="font-bold">Practice:</span> marked done for this topic
          </p>
          <p className="text-muted-foreground">
            The topic's lesson-read and practice steps are ticked and today's answers are saved. Return tomorrow — the
            mentor queues the next unfinished topic automatically, and anything you missed keeps the topic in the weak
            areas list until its score recovers.
          </p>
        </CardContent>
      </Card>

      <div className="mt-6 flex gap-3">
        <Button className="flex-1" onClick={startDailySession}>
          <Repeat className="size-4" />
          Start another session
        </Button>
        <Button variant="outline" className="flex-1" onClick={() => go('dashboard')}>
          Dashboard
        </Button>
      </div>
    </div>
  )
}
