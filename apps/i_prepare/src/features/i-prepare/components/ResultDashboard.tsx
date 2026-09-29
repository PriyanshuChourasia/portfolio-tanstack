import { ArrowLeft, History, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useIPrepareStore } from '../store'
import { DifficultyAnalysis } from './DifficultyAnalysis'
import { PerformanceInsights } from './PerformanceInsights'
import { QuestionReview } from './QuestionReview'
import { ScoreCard } from './ScoreCard'
import { TimeAnalysis } from './TimeAnalysis'
import { TopicAnalysis } from './TopicAnalysis'

export function ResultDashboard() {
  const results = useIPrepareStore((state) => state.results)
  const activeResultId = useIPrepareStore((state) => state.activeResultId)
  const goToExams = useIPrepareStore((state) => state.goToExams)
  const goToHistory = useIPrepareStore((state) => state.goToHistory)
  const selectExam = useIPrepareStore((state) => state.selectExam)

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
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
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

      <Card>
        <CardContent className="pt-6">
          <ScoreCard result={result} />
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Performance</CardTitle>
          <CardDescription>Detailed breakdown of your test results</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <PerformanceInsights result={result} />
          <Tabs defaultValue="topics">
            <TabsList>
              <TabsTrigger value="topics">Topics</TabsTrigger>
              <TabsTrigger value="difficulty">Difficulty</TabsTrigger>
              <TabsTrigger value="time">Time</TabsTrigger>
              <TabsTrigger value="review">Review</TabsTrigger>
            </TabsList>
            <TabsContent value="topics">
              <TopicAnalysis topics={result.topicPerformance} />
            </TabsContent>
            <TabsContent value="difficulty">
              <DifficultyAnalysis rows={result.difficultyPerformance} />
            </TabsContent>
            <TabsContent value="time">
              <TimeAnalysis analysis={result.timeAnalysis} />
            </TabsContent>
            <TabsContent value="review">
              <QuestionReview result={result} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
