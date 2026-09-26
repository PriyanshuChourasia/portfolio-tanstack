import { Clock, History, ListChecks, Target, Trophy } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EXAMS, SUBJECT_LABELS, questionsForExam, topicsForExam } from '@/data/reasoning'
import type { ExamDefinition, TestResult } from '@/data/reasoning'
import { useReasoningMockStore } from '../store'

function previousBest(results: TestResult[], examId: ExamDefinition['id']): TestResult | null {
  const forExam = results.filter((result) => result.examId === examId)
  if (forExam.length === 0) return null
  return forExam.reduce((best, current) =>
    current.overall.percentage > best.overall.percentage ? current : best,
  )
}

export function ExamSelector() {
  const selectExam = useReasoningMockStore((state) => state.selectExam)
  const goToHistory = useReasoningMockStore((state) => state.goToHistory)
  const results = useReasoningMockStore((state) => state.results)

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-14">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge variant="secondary" className="mb-3 rounded-full px-3 py-1 text-xs">
            Reasoning & English
          </Badge>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Reasoning & English Mock Test</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Practise reasoning and English for competitive exams with a real exam-style wizard: one question at a
            time, a persistent timer, an answer palette and a detailed evaluation at the end.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={goToHistory}>
          <History className="size-4" />
          Test History
          {results.length > 0 && (
            <span className="rounded-full bg-muted px-1.5 text-[10px] font-semibold">{results.length}</span>
          )}
        </Button>
      </header>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {EXAMS.map((exam) => {
          const bank = questionsForExam(exam.id)
          const topics = topicsForExam(exam.id)
          const best = previousBest(results, exam.id)
          const attempts = results.filter((result) => result.examId === exam.id).length

          return (
            <button
              key={exam.id}
              type="button"
              onClick={() => selectExam(exam.id)}
              className="group flex h-full flex-col rounded-2xl border border-border/60 bg-card p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <div className={`mb-4 h-1.5 w-12 rounded-full bg-gradient-to-r ${exam.accent}`} />
              <h2 className="text-lg font-bold tracking-tight">{exam.name}</h2>
              <p className="mt-1 text-xs font-medium text-muted-foreground">
                {exam.kind === 'practice' ? 'Topic practice paper' : `${SUBJECT_LABELS[exam.subject]} section`}
              </p>

              <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3 text-xs">
                <div className="flex items-start gap-2">
                  <Target className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                  <div>
                    <dt className="text-muted-foreground">Difficulty</dt>
                    <dd className="font-semibold">{exam.difficultyLabel}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <ListChecks className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                  <div>
                    <dt className="text-muted-foreground">Questions</dt>
                    <dd className="font-semibold">{bank.length} in bank</dd>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                  <div>
                    <dt className="text-muted-foreground">Duration</dt>
                    <dd className="font-semibold">{exam.defaultDurationMinutes} min</dd>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Trophy className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                  <div>
                    <dt className="text-muted-foreground">Best score</dt>
                    <dd className="font-semibold">
                      {best ? `${best.overall.score}/${best.overall.maxScore} · ${best.overall.percentage}%` : '—'}
                    </dd>
                  </div>
                </div>
              </dl>

              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{exam.description}</p>

              <div className="mt-4 flex flex-wrap gap-1">
                {topics.slice(0, 4).map((topic) => (
                  <span key={topic} className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {topic}
                  </span>
                ))}
                {topics.length > 4 && (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    +{topics.length - 4} more
                  </span>
                )}
              </div>

              <p className="mt-4 text-[11px] font-medium text-muted-foreground">{exam.patternNote}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {attempts > 0 ? `${attempts} previous attempt(s)` : 'No attempts yet'}
              </p>

              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                Configure test
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
              </span>
            </button>
          )
        })}
      </div>

      <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
        Every question in this bank is newly written to follow the previous-year pattern of the respective
        exam and is labelled <strong>PYQ-pattern</strong> in the review screens. No generated question is
        presented as an actual previous-year question.
      </p>
    </div>
  )
}
