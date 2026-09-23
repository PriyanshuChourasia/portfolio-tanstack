import { ArrowLeft, CheckCircle2, ListChecks, Play, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getExam } from '@/data/reasoning'
import { useReasoningMockStore } from '../store'
import { STORAGE_LABELS } from '../lib/storage'

const RULES = [
  'Every question is a multiple-choice question with exactly one correct answer.',
  'Select any one option (A, B, C or D) to answer a question.',
  'Use Previous / Next to move between questions, or jump with the question palette.',
  'Mark any question for review if you want to revisit it before submitting.',
  'Clear Answer removes the option you selected for the current question.',
  'Your answers are saved the moment you select them — no need to save manually.',
  'Reloading or closing the page will not lose your answers or reset the timer.',
  'The countdown continues while you move between questions.',
]

export function TestInstructions() {
  const config = useReasoningMockStore((state) => state.config)
  const storageKind = useReasoningMockStore((state) => state.storageKind)
  const goToConfig = useReasoningMockStore((state) => state.goToConfig)
  const startTest = useReasoningMockStore((state) => state.startTest)

  if (!config) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-sm text-muted-foreground">Nothing configured yet.</p>
        <Button className="mt-4" onClick={goToConfig}>
          Back to configuration
        </Button>
      </div>
    )
  }

  const exam = getExam(config.examId)

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
      <button
        type="button"
        onClick={goToConfig}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Configuration
      </button>

      <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Test Instructions</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Read the rules below, then start the timer when you are ready.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {[
          { label: 'Exam', value: exam.name },
          { label: 'Total questions', value: String(config.questionCount) },
          { label: 'Duration', value: `${config.durationMinutes} minutes` },
          { label: 'Question type', value: 'Multiple choice (4 options)' },
          { label: 'Correct answer', value: `+${config.marking.positiveMarks} mark` },
          { label: 'Incorrect answer', value: `−${config.marking.negativeMarks} mark` },
          { label: 'Unanswered', value: '0 marks' },
          { label: 'Difficulty', value: config.difficulty },
        ].map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-card px-4 py-3">
            <span className="text-xs text-muted-foreground">{row.label}</span>
            <span className="text-sm font-semibold capitalize">{row.value}</span>
          </div>
        ))}
      </div>

      <section className="mt-6 rounded-2xl border border-border/60 bg-card p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <ListChecks className="size-4 text-primary" />
          <h2 className="text-sm font-bold uppercase tracking-wide">Rules</h2>
        </div>
        <ul className="mt-4 space-y-2.5">
          {RULES.map((rule) => (
            <li key={rule} className="flex items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary/70" />
              <span>{rule}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex items-start gap-2 rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-4 shrink-0" />
          <p>
            {STORAGE_LABELS[storageKind ?? 'memory']}. The timer is calculated from the recorded start
            time, so it keeps running correctly even if you reload the page. When the clock reaches
            zero the test is submitted automatically.
          </p>
        </div>
      </section>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-[10px]">
            PYQ-pattern bank
          </Badge>
          Questions follow previous-year exam patterns; they are not actual past papers.
        </div>
        <Button size="lg" onClick={startTest}>
          <Play className="size-4" />
          Start Test
        </Button>
      </div>
    </div>
  )
}
