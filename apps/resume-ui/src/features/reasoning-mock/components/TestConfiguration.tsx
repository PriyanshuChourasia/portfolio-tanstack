import { useMemo } from 'react'
import { ArrowLeft, CheckCircle2, Gauge, Info, Timer } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SUBJECT_LABELS, TEST_PRESETS, getExam, topicsForExam } from '@/data/reasoning'
import type { DifficultyFilter, QuestionTopic, TestConfiguration as TestConfig } from '@/data/reasoning'
import { cn } from '@/lib/utils'
import { useReasoningMockStore } from '../store'
import { countMatchingQuestions } from '../engine/test-builder'

const DIFFICULTIES: Array<{ value: DifficultyFilter; label: string; hint: string }> = [
  { value: 'easy', label: 'Easy', hint: 'Warm-up level questions' },
  { value: 'moderate', label: 'Moderate', hint: 'Exam-level questions' },
  { value: 'difficult', label: 'Difficult', hint: 'Toughest questions in the bank' },
  { value: 'mixed', label: 'Mixed', hint: 'Every difficulty level' },
]

const QUICK_COUNTS = [10, 15, 25, 35]
const QUICK_DURATIONS = [10, 15, 20, 25, 35]

export function TestConfiguration() {
  const config = useReasoningMockStore((state) => state.config)
  const selectPreset = useReasoningMockStore((state) => state.selectPreset)
  const updateConfig = useReasoningMockStore((state) => state.updateConfig)
  const goToExams = useReasoningMockStore((state) => state.goToExams)
  const goToInstructions = useReasoningMockStore((state) => state.goToInstructions)

  const available = useMemo(() => (config ? countMatchingQuestions(config) : 0), [config])

  if (!config) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-sm text-muted-foreground">Pick an exam to configure a test.</p>
        <Button className="mt-4" onClick={goToExams}>
          Choose exam
        </Button>
      </div>
    )
  }

  const exam = getExam(config.examId)
  const presets = TEST_PRESETS.filter((preset) => preset.examId === config.examId)
  const allTopics = topicsForExam(config.examId)
  const topicsSelected = new Set(config.topics)

  const patch = (value: Partial<TestConfig>) => updateConfig(value)

  const toggleTopic = (topic: QuestionTopic) => {
    const next = new Set(config.topics)
    if (next.has(topic)) next.delete(topic)
    else next.add(topic)
    patch({ topics: allTopics.filter((item) => next.has(item)) })
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:py-14">
      <button
        type="button"
        onClick={goToExams}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Exam selection
      </button>

      <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Configure your test</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {exam.name} · {SUBJECT_LABELS[exam.subject]} section · marking {config.marking.positiveMarks} mark(s) per correct answer and{' '}
        {config.marking.negativeMarks} deducted per wrong answer.
      </p>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Preset tests</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {presets.map((preset) => {
            const active = preset.id === config.testId
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => selectPreset(preset.id)}
                className={cn(
                  'rounded-xl border p-4 text-left text-sm transition-all',
                  active
                    ? 'border-primary/50 bg-primary/5 shadow-sm'
                    : 'border-border/60 bg-card hover:border-border hover:bg-muted/30',
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold">{preset.title}</span>
                  {active && <CheckCircle2 className="size-4 shrink-0 text-primary" />}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {preset.totalQuestions} questions · {preset.durationMinutes} min · {preset.difficulty}
                </p>
              </button>
            )
          })}
        </div>
      </section>

      <section className="mt-8 grid gap-6 rounded-2xl border border-border/60 bg-card p-5 sm:p-6">
        <div>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <Label htmlFor="question-count" className="text-sm font-semibold">
                Number of questions
              </Label>
              <p className="mt-1 text-xs text-muted-foreground">
                {available} question(s) match the current filters.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Input
                id="question-count"
                type="number"
                min={1}
                max={available}
                value={config.questionCount}
                onChange={(event) => patch({ questionCount: Number(event.target.value) || 1 })}
                className="w-20"
              />
              <span className="text-xs text-muted-foreground">of {available}</span>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {QUICK_COUNTS.filter((count) => count <= available).map((count) => (
              <Button
                key={count}
                type="button"
                size="xs"
                variant={config.questionCount === count ? 'default' : 'outline'}
                onClick={() => patch({ questionCount: count })}
              >
                {count}
              </Button>
            ))}
            <Button
              type="button"
              size="xs"
              variant={config.questionCount === available ? 'default' : 'outline'}
              onClick={() => patch({ questionCount: available })}
            >
              All ({available})
            </Button>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <Gauge className="size-4 text-muted-foreground" />
            <Label className="text-sm font-semibold">Difficulty</Label>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-4">
            {DIFFICULTIES.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => patch({ difficulty: option.value })}
                className={cn(
                  'rounded-xl border px-3 py-3 text-left text-sm transition-all',
                  config.difficulty === option.value
                    ? 'border-primary/50 bg-primary/5'
                    : 'border-border/60 hover:bg-muted/30',
                )}
              >
                <span className="flex items-center gap-2 font-medium">
                  <span
                    className={cn(
                      'flex size-3.5 shrink-0 items-center justify-center rounded-full border',
                      config.difficulty === option.value ? 'border-primary' : 'border-border',
                    )}
                  >
                    {config.difficulty === option.value && <span className="size-1.5 rounded-full bg-primary" />}
                  </span>
                  {option.label}
                </span>
                <span className="mt-1 block text-[11px] text-muted-foreground">{option.hint}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex items-center gap-2">
              <Timer className="size-4 text-muted-foreground" />
              <Label htmlFor="duration" className="text-sm font-semibold">
                Duration (minutes)
              </Label>
            </div>
            <Input
              id="duration"
              type="number"
              min={1}
              max={180}
              value={config.durationMinutes}
              onChange={(event) => patch({ durationMinutes: Number(event.target.value) || 1 })}
              className="w-20"
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {QUICK_DURATIONS.map((minutes) => (
              <Button
                key={minutes}
                type="button"
                size="xs"
                variant={config.durationMinutes === minutes ? 'default' : 'outline'}
                onClick={() => patch({ durationMinutes: minutes })}
              >
                {minutes} min
              </Button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Label className="text-sm font-semibold">Topics</Label>
            <div className="flex gap-2">
              <Button type="button" size="xs" variant="outline" onClick={() => patch({ topics: allTopics })}>
                Select all
              </Button>
              <Button type="button" size="xs" variant="outline" onClick={() => patch({ topics: [] })}>
                Clear
              </Button>
            </div>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {config.topics.length === 0
              ? 'No topic filter — questions are picked from every topic.'
              : `${config.topics.length} of ${allTopics.length} topics selected.`}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {allTopics.map((topic) => {
              const active = topicsSelected.has(topic)
              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => toggleTopic(topic)}
                  className={cn(
                    'rounded-full border px-3 py-1 text-xs font-medium transition-all',
                    active
                      ? 'border-primary/50 bg-primary/10 text-foreground'
                      : 'border-border/60 text-muted-foreground hover:bg-muted/40',
                  )}
                >
                  {topic}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/60 bg-muted/30 p-4">
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0" />
          <p>
            {config.questionCount} question(s) · {config.durationMinutes} minutes ·{' '}
            <Badge variant="secondary" className="mx-1 rounded-full px-2 py-0 text-[10px]">
              {config.difficulty}
            </Badge>{' '}
            difficulty. You can review and change this before the timer starts.
          </p>
        </div>
        <Button size="lg" disabled={available === 0} onClick={goToInstructions}>
          Continue to instructions
        </Button>
      </div>
    </div>
  )
}
