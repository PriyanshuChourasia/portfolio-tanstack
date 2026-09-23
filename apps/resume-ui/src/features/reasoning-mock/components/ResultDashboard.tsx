import { ArrowLeft, History, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useReasoningMockStore } from '../store'
import { DifficultyAnalysis } from './DifficultyAnalysis'
import { PerformanceInsights } from './PerformanceInsights'
import { QuestionReview } from './QuestionReview'
import { ScoreCard } from './ScoreCard'
import { TimeAnalysis } from './TimeAnalysis'
import { TopicAnalysis } from './TopicAnalysis'

export function ResultDashboard() {
  const results = useReasoningMockStore((state) => state.results)
  const activeResultId = useReasoningMockStore((state) => state.activeResultId)
  const goToExams = useReasoningMockStore((state) => state.goToExams)
  const goToHistory = useReasoningMockStore((state) => state.goToHistory)
  const selectExam = useReasoningMockStore((state) => state.selectExam)

  const result = results.find((item) => item.id === activeResultId) ?? results[0]

  if (!result) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-sm text-muted-foreground">No result to display yet.</p>
        <Button className="mt-4" onClick={goToExams}>
          Choose an exam
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Button variant="outline" size="sm" onClick={goToExams}>
          <ArrowLeft className="size-4" />
          Exam selection
        </Button>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={goToHistory}>
            <History className="size-4" />
            Test history
          </Button>
          <Button size="sm" onClick={() => selectExam(result.examId)}>
            <RotateCcw className="size-4" />
            Practise this exam again
          </Button>
        </div>
      </div>

      <ScoreCard result={result} />

      <div className="mt-4">
        <PerformanceInsights result={result} />
      </div>

      <div className="mt-4 grid gap-4">
        <TopicAnalysis topics={result.topicPerformance} />
        <div className="grid gap-4 lg:grid-cols-2">
          <DifficultyAnalysis rows={result.difficultyPerformance} />
          <TimeAnalysis analysis={result.timeAnalysis} />
        </div>
        <QuestionReview result={result} />
      </div>
    </div>
  )
}
