import { ArrowLeft, Award, MessagesSquare, Trophy } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useMLMentorStore, getModule } from '../store'
import { formatDateTime } from '@/features/i-prepare/lib/time'
import type { AssessmentResult, MockInterviewSession } from '../types'

export function History() {
  const assessments = useMLMentorStore((state) => state.assessments)
  const mockHistory = useMLMentorStore((state) => state.mockHistory)
  const go = useMLMentorStore((state) => state.go)

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-12">
      <Button variant="ghost" size="sm" onClick={() => go('dashboard')}>
        <ArrowLeft className="size-4" />
        Dashboard
      </Button>
      <h1 className="mt-2 flex items-center gap-2 text-2xl font-black tracking-tight sm:text-3xl">
        <Trophy className="size-6 text-primary" />
        History
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Every module test, baseline and completed mock interview saved on this device.
      </p>

      <h2 className="mt-8 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
        <Award className="size-4" />
        Assessments ({assessments.length})
      </h2>
      {assessments.length === 0 ? (
        <p className="mt-2 text-xs text-muted-foreground">No assessments yet — take the baseline or a module test.</p>
      ) : (
        <div className="mt-3 space-y-2">
          {assessments.map((assessment) => (
            <AssessmentRow key={assessment.id} assessment={assessment} />
          ))}
        </div>
      )}

      <h2 className="mt-8 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
        <MessagesSquare className="size-4" />
        Mock interviews ({mockHistory.length})
      </h2>
      {mockHistory.length === 0 ? (
        <p className="mt-2 text-xs text-muted-foreground">No completed interviews yet.</p>
      ) : (
        <div className="mt-3 space-y-2">
          {mockHistory.map((mock) => (
            <MockRow key={mock.id} mock={mock} />
          ))}
        </div>
      )}
    </div>
  )
}

function AssessmentRow({ assessment }: { assessment: AssessmentResult }) {
  const openModule = useMLMentorStore((state) => state.openModule)
  const module = assessment.moduleId ? getModule(assessment.moduleId) : undefined
  const passed = assessment.percentage >= (assessment.kind === 'module_test' ? 70 : 50)

  return (
    <button
      type="button"
      onClick={() => assessment.moduleId && openModule(assessment.moduleId)}
      className="flex w-full items-center justify-between gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:border-primary/40 hover:bg-muted/50"
    >
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold">
          {assessment.kind === 'baseline'
            ? 'Baseline assessment'
            : module
              ? `Module ${module.number} test — ${module.title}`
              : 'Module test'}
        </span>
        <span className="block text-[11px] text-muted-foreground">{formatDateTime(assessment.submittedAt)}</span>
      </span>
      <span className="flex shrink-0 items-center gap-2">
        <Badge
          variant="outline"
          className={passed ? 'rounded-full border-emerald-500/40 text-emerald-600' : 'rounded-full border-amber-500/40 text-amber-600'}
        >
          {assessment.percentage}%
        </Badge>
        {passed ? '🟢' : '🔴'}
      </span>
    </button>
  )
}

function MockRow({ mock }: { mock: MockInterviewSession }) {
  const average = mock.averageScore ?? 0
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold">
          {mock.difficulty} mock{mock.escalated ? ' (escalated)' : ''}
        </span>
        <span className="block text-[11px] text-muted-foreground">
          {formatDateTime(mock.completedAt ?? mock.startedAt)} · {mock.questionIds.length} questions
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-2">
        <span className="text-sm font-black">{average.toFixed(1)}/10</span>
        <span>{average >= 7 ? '🟢' : average >= 5 ? '🟡' : '🔴'}</span>
      </span>
    </div>
  )
}
