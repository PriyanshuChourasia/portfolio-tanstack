import { Award, CheckCircle2, Lightbulb, Map, Target, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { LEVEL_LABELS } from '../types'
import type { StartingLevel } from '../types'
import { useMLMentorStore, getModule } from '../store'
import { BASELINE_QUESTIONS } from '../data'
import { QuizRunner } from './QuizRunner'

export function BaselineQuiz() {
  const quiz = useMLMentorStore((state) => state.quiz)
  const selectBaselineOption = useMLMentorStore((state) => state.selectBaselineOption)
  const nextBaselineQuestion = useMLMentorStore((state) => state.nextBaselineQuestion)
  const previousBaselineQuestion = useMLMentorStore((state) => state.previousBaselineQuestion)
  const submitBaseline = useMLMentorStore((state) => state.submitBaseline)
  const go = useMLMentorStore((state) => state.go)
  if (!quiz || quiz.kind !== 'baseline') return null

  const questions = BASELINE_QUESTIONS.map((q) => ({
    id: q.id,
    prompt: q.prompt,
    options: q.options,
    topicId: q.topicId,
  }))

  return (
    <div>
      <div className="mx-auto w-full max-w-2xl px-4 pt-6">
        <Button variant="ghost" size="sm" onClick={() => go('dashboard')}>
          ← Back to dashboard
        </Button>
      </div>
      <QuizRunner
        title="Baseline Assessment"
        subtitle="10 questions spanning the curriculum — this decides your starting module. Answer honestly; it is not scored against you."
        questions={questions}
        selections={quiz.selections}
        index={quiz.index}
        onSelect={selectBaselineOption}
        onPrevious={previousBaselineQuestion}
        onNext={nextBaselineQuestion}
        onSubmit={submitBaseline}
      />
    </div>
  )
}

export function BaselineResult() {
  const lastAssessment = useMLMentorStore((state) => state.lastAssessment)
  const progress = useMLMentorStore((state) => state.progress)
  const acceptBaseline = useMLMentorStore((state) => state.acceptBaseline)
  if (!lastAssessment || lastAssessment.kind !== 'baseline') return null

  const startingModule = getModule(progress.startingModuleId ?? progress.currentModuleId)

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-14">
      <Badge variant="secondary" className="gap-1.5 rounded-full px-3 py-1">
        <Award className="size-3.5 text-primary" />
        Baseline complete
      </Badge>
      <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
        You scored {lastAssessment.correctCount}/{lastAssessment.totalQuestions} ({lastAssessment.percentage}%)
      </h1>

      <Card className="mt-6 border-primary/30 bg-primary/5">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Map className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold">Level: {LEVEL_LABELS[levelFromModule(progress.startingModuleId)]}</p>
              <p className="text-xs text-muted-foreground">
                Starting module: {startingModule ? `Module ${startingModule.number} — ${startingModule.title}` : '—'}
              </p>
            </div>
          </div>
          <Button onClick={acceptBaseline}>
            <CheckCircle2 className="size-4" />
            Go to my plan
          </Button>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardContent className="p-5">
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <Target className="size-4 text-amber-500" />
            Weak areas flagged by the baseline
          </h2>
          {progress.weakTopics.length === 0 ? (
            <p className="mt-2 text-xs text-muted-foreground">
              None — a perfect run. Every module ahead is open territory.
            </p>
          ) : (
            <ul className="mt-3 flex flex-wrap gap-2">
              {progress.weakTopics.map((topicId) => (
                <li key={topicId}>
                  <Badge variant="outline" className="gap-1 rounded-full">
                    <XCircle className="size-3 text-amber-500" />
                    {topicTitleFor(topicId)}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 rounded-lg bg-muted/60 p-3 text-xs leading-relaxed text-muted-foreground">
            <p className="flex items-center gap-1.5 font-semibold text-foreground">
              <Lightbulb className="size-3.5 text-primary" />
              How to read this
            </p>
            <p className="mt-1">
              These topics resurface in your daily sessions and revision prompts until their scores recover. You can
              also open any unlocked module and work at your own pace — the mentor follows you, not the other way
              round.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ── Internal helpers ──────────────────────────────────────────────────────── */

function levelFromModule(moduleId: string | null): StartingLevel {
  switch (moduleId) {
    case 'm11':
      return 'intermediate'
    case 'm05':
      return 'advanced_beginner'
    case 'm03':
      return 'beginner'
    default:
      return 'complete_beginner'
  }
}

function topicTitleFor(topicId: string): string {
  const question = BASELINE_QUESTIONS.find((q) => q.topicId === topicId)
  if (!question) return topicId
  return question.prompt.length > 48 ? `${question.prompt.slice(0, 48)}…` : question.prompt
}
