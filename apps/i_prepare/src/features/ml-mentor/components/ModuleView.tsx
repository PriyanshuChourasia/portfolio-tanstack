import { useState } from 'react'
import {
  ArrowLeft,
  BookOpen,
  Check,
  FlaskConical,
  Lightbulb,
  ListChecks,
  MessagesSquare,
  Play,
  Terminal,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { STATUS_META, LEARNING_CYCLE } from '../types'
import type { MLTopic } from '../types'
import { useMLMentorStore, getModule, interviewQuestionsForModule } from '../store'
import { cn } from '@/lib/utils'

export function ModuleView() {
  const activeModuleId = useMLMentorStore((state) => state.activeModuleId)
  const progress = useMLMentorStore((state) => state.progress)
  const go = useMLMentorStore((state) => state.go)
  const startModuleTest = useMLMentorStore((state) => state.startModuleTest)

  const module = getModule(activeModuleId ?? progress.currentModuleId)
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null)

  if (!module) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10 text-center">
        <p className="text-sm text-muted-foreground">Module not found.</p>
        <Button className="mt-4" variant="outline" onClick={() => go('dashboard')}>
          <ArrowLeft className="size-4" />
          Back to dashboard
        </Button>
      </div>
    )
  }

  const moduleProgress = progress.modules[module.id]
  const testPassed = (moduleProgress?.bestTestPercentage ?? 0) >= 70
  const interviewQuestions = interviewQuestionsForModule(module.id)

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={() => go('dashboard')}>
          <ArrowLeft className="size-4" />
          Dashboard
        </Button>
        <span className="text-lg" title={STATUS_META[moduleStatus(progress, module.id)].label}>
          {STATUS_META[moduleStatus(progress, module.id)].emoji}
        </span>
      </div>

      <header className="mt-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Module {module.number} of 17
        </p>
        <h1 className="text-2xl font-black tracking-tight sm:text-3xl">{module.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{module.tagline}</p>
        <div className="mt-3 rounded-lg bg-muted/60 p-3 text-xs leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground">Interview goal: </span>
          {module.interviewGoal}
        </div>
      </header>

      {/* Learning cycle */}
      <div className="mt-5 flex flex-wrap items-center gap-1.5">
        {LEARNING_CYCLE.map((step, index) => (
          <span key={step} className="flex items-center gap-1.5">
            <Badge variant="outline" className="rounded-full text-[10px]">
              {index + 1}. {step}
            </Badge>
            {index < LEARNING_CYCLE.length - 1 && <span className="text-[10px] text-muted-foreground">→</span>}
          </span>
        ))}
      </div>

      {/* Topics */}
      <div className="mt-6 space-y-3">
        {module.topics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            expanded={expandedTopicId === topic.id}
            onToggle={() => setExpandedTopicId(expandedTopicId === topic.id ? null : topic.id)}
          />
        ))}
      </div>

      {/* Interview questions for this module */}
      {interviewQuestions.length > 0 && (
        <Card className="mt-6">
          <CardContent className="p-5">
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <MessagesSquare className="size-4 text-primary" />
              Interview questions ({interviewQuestions.length})
            </h2>
            <div className="mt-3 space-y-2">
              {interviewQuestions.map((question) => (
                <details key={question.id} className="group rounded-lg border border-border">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-2 p-3 text-sm font-medium">
                    <span>{question.prompt}</span>
                    <Badge variant="outline" className="shrink-0 rounded-full text-[10px]">
                      {question.difficulty}
                    </Badge>
                  </summary>
                  <div className="border-t border-border p-3 text-xs leading-relaxed text-muted-foreground">
                    <p className="font-semibold text-foreground">Model answer</p>
                    <p className="mt-1">{question.modelAnswer}</p>
                    <p className="mt-3 font-semibold text-foreground">Follow-up</p>
                    <p className="mt-1">{question.followUp}</p>
                  </div>
                </details>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Module test */}
      <Card className={cn('mt-6', testPassed ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-primary/30 bg-primary/5')}>
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <p className="text-sm font-bold">
              Module {module.number} test · {testPassed ? 'passed ✓' : '70% to pass'}
            </p>
            <p className="text-xs text-muted-foreground">
              {moduleProgress?.testAttempts
                ? `Best: ${moduleProgress.bestTestPercentage}% across ${moduleProgress.testAttempts} attempt(s). Wrong answers re-flag their topics for revision.`
                : 'One MCQ per topic. Wrong answers drop the topic score and can flag it as a weak area.'}
            </p>
          </div>
          <Button onClick={() => startModuleTest(module.id)}>
            <Play className="size-4" />
            {moduleProgress?.testAttempts ? 'Retake test' : 'Start test'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

/* ── Topic card ────────────────────────────────────────────────────────────── */

function TopicCard({
  topic,
  expanded,
  onToggle,
}: {
  topic: MLTopic
  expanded: boolean
  onToggle: () => void
}) {
  const topicState = useMLMentorStore((state) => state.progress.topics[topic.id])
  const markStep = useMLMentorStore((state) => state.markStep)
  const moduleQuestions = interviewQuestionsForModule(topic.id.slice(0, 3))

  const steps: Array<{ key: 'lessonRead' | 'practiceDone' | 'codingDone' | 'interviewDone'; label: string; done: boolean }> = [
    { key: 'lessonRead', label: 'Lesson read', done: topicState?.lessonRead ?? false },
    { key: 'practiceDone', label: 'Practice done', done: topicState?.practiceDone ?? false },
    { key: 'codingDone', label: 'Coding task done', done: topicState?.codingDone ?? false },
    { key: 'interviewDone', label: 'Interview questions done', done: topicState?.interviewDone ?? false },
  ]

  return (
    <Card className="p-0">
      <CardContent className="p-0">
        <button
          type="button"
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-3 p-4 text-left"
        >
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold">{topic.title}</span>
            <span className="mt-0.5 block text-xs text-muted-foreground">{topic.summary}</span>
          </span>
          <span className="flex shrink-0 items-center gap-2">
            {topicState?.score !== null && topicState?.score !== undefined && (
              <Badge variant="outline" className="rounded-full text-[10px]">
                {topicState.score}/10
              </Badge>
            )}
            <span title={STATUS_META[topicState?.status ?? 'not_started'].label}>
              {STATUS_META[topicState?.status ?? 'not_started'].emoji}
            </span>
          </span>
        </button>

        {expanded && (
          <div className="border-t border-border p-4">
            {/* Learn */}
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary">
              <BookOpen className="size-3.5" />
              Learn
            </p>
            <div className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground">
              {topic.lesson.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Understand */}
            <p className="mt-4 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary">
              <Lightbulb className="size-3.5" />
              Understand
            </p>
            <p className="mt-1.5 rounded-lg bg-primary/5 p-3 text-sm italic leading-relaxed">{topic.intuition}</p>

            {/* Key points */}
            <p className="mt-4 text-xs font-bold uppercase tracking-wide text-primary">Key points</p>
            <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {topic.keyPoints.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>

            {/* Example code */}
            {topic.exampleCode && (
              <pre className="custom-scrollbar mt-4 overflow-x-auto rounded-lg bg-zinc-950 p-3 text-[11px] leading-relaxed text-zinc-100">
                <code>{topic.exampleCode}</code>
              </pre>
            )}

            {/* Practice */}
            <p className="mt-4 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary">
              <FlaskConical className="size-3.5" />
              Practice
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{topic.practiceExercise}</p>

            {/* Code */}
            {topic.codingTask && (
              <>
                <p className="mt-4 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary">
                  <Terminal className="size-3.5" />
                  Code
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{topic.codingTask}</p>
              </>
            )}

            {/* Interview questions tied to this topic's module */}
            {moduleQuestions.length > 0 && (
              <div className="mt-4 rounded-lg border border-border p-3">
                <p className="text-xs font-bold">
                  {moduleQuestions.length} interview question(s) for this module
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Answer aloud before opening each one, then check the model answer and follow-up.
                </p>
              </div>
            )}

            {/* Mark progress */}
            <div className="mt-4 flex flex-wrap gap-2">
              {steps.map((step) => (
                <button
                  key={step.key}
                  type="button"
                  onClick={() => markStep(topic.id, step.key)}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                    step.done
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
                  )}
                >
                  {step.done ? <Check className="size-3.5" /> : <ListChecks className="size-3.5" />}
                  {step.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/* ── Helpers ───────────────────────────────────────────────────────────────── */

function moduleStatus(
  progress: ReturnType<typeof useMLMentorStore.getState>['progress'],
  moduleId: string,
) {
  const topics = getModule(moduleId)?.topics ?? []
  const states = topics.map((topic) => progress.topics[topic.id])
  const completed = states.filter((state) => state?.status === 'completed').length
  if (completed === topics.length && completed > 0) return 'completed' as const
  if (completed > 0 || states.some((state) => state?.status === 'in_progress')) return 'in_progress' as const
  return 'not_started' as const
}
