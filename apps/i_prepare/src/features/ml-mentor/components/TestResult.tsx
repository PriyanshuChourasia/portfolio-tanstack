import { ArrowLeft, CheckCircle2, RefreshCw, TrendingUp, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MODULE_TEST_PASS_PERCENTAGE } from '../types'
import type { AssessmentResult } from '../types'
import { useMLMentorStore, getModule } from '../store'
import { questionsForModule } from '../data'

export function TestResult() {
  const lastAssessment = useMLMentorStore((state) => state.lastAssessment)
  const go = useMLMentorStore((state) => state.go)
  const openModule = useMLMentorStore((state) => state.openModule)
  const startModuleTest = useMLMentorStore((state) => state.startModuleTest)
  if (!lastAssessment || lastAssessment.kind !== 'module_test' || !lastAssessment.moduleId) return null

  const module = getModule(lastAssessment.moduleId)
  const questions = questionsForModule(lastAssessment.moduleId)
  const result: AssessmentResult = lastAssessment
  const passed = result.percentage >= MODULE_TEST_PASS_PERCENTAGE

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-14">
      <Button variant="ghost" size="sm" onClick={() => openModule(lastAssessment.moduleId!)}>
        <ArrowLeft className="size-4" />
        Back to module
      </Button>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="text-4xl">{passed ? '🎉' : '🔴'}</span>
        <div>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
            {module ? `Module ${module.number} test` : 'Module test'}: {result.correctCount}/{result.totalQuestions} ({result.percentage}%)
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {passed
              ? `Passed — the next module is unlocked. New topic scores applied.`
              : `Below the ${MODULE_TEST_PASS_PERCENTAGE}% pass mark — review the mistakes below, then retake. Wrong answers flagged their topics for revision.`}
          </p>
        </div>
      </div>

      <Card className={passed ? 'mt-6 border-emerald-500/30 bg-emerald-500/5' : 'mt-6 border-amber-500/30 bg-amber-500/5'}>
        <CardContent className="p-5">
          <p className="flex items-center gap-2 text-sm font-bold">
            {passed ? <CheckCircle2 className="size-4 text-emerald-500" /> : <RefreshCw className="size-4 text-amber-500" />}
            Topic scores from this attempt
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(result.topicScores).map(([topicId, score]) => (
              <Badge key={topicId} variant="outline" className="rounded-full text-[10px]">
                {topicId}: {score}/10
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <h2 className="mt-8 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
        <TrendingUp className="size-4" />
        Review every question
      </h2>
      <div className="mt-3 space-y-3">
        {result.questionResults.map((questionResult, index) => {
          const question = questions.find((q) => q.id === questionResult.questionId)
          if (!question) return null
          return (
            <Card key={questionResult.questionId} className="p-0">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold">
                    {index + 1}. {question.prompt}
                  </p>
                  {questionResult.correct ? (
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                  ) : (
                    <XCircle className="mt-0.5 size-4 shrink-0 text-red-500" />
                  )}
                </div>
                <div className="mt-2 space-y-1 text-xs">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Your answer:</span>{' '}
                    {questionResult.selectedIndex !== null
                      ? question.options[questionResult.selectedIndex]
                      : 'skipped'}
                  </p>
                  {!questionResult.correct && (
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Correct answer:</span>{' '}
                      {question.options[question.answerIndex]}
                    </p>
                  )}
                  <p className="rounded-lg bg-muted/60 p-2 leading-relaxed text-muted-foreground">
                    <span className="font-medium text-foreground">Why: </span>
                    {question.explanation}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="mt-6 flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => startModuleTest(lastAssessment.moduleId!)}
        >
          <RefreshCw className="size-4" />
          Retake test
        </Button>
        <Button className="flex-1" onClick={() => go('dashboard')}>
          Back to dashboard
        </Button>
      </div>
    </div>
  )
}
