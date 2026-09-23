import { ChevronLeft, ChevronRight, Eraser, Flag, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useReasoningMockStore } from '../store'
import { cn } from '@/lib/utils'

export function TestNavigation({
  questionId,
  index,
  total,
  marked,
  hasAnswer,
  onSubmitClick,
}: {
  questionId: string
  index: number
  total: number
  marked: boolean
  hasAnswer: boolean
  onSubmitClick: () => void
}) {
  const previousQuestion = useReasoningMockStore((state) => state.previousQuestion)
  const nextQuestion = useReasoningMockStore((state) => state.nextQuestion)
  const toggleMarkForReview = useReasoningMockStore((state) => state.toggleMarkForReview)
  const clearAnswer = useReasoningMockStore((state) => state.clearAnswer)

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-border/60 bg-card p-3 sm:p-4">
      <Button variant="outline" disabled={index === 0} onClick={previousQuestion}>
        <ChevronLeft className="size-4" />
        Previous
      </Button>

      <Button
        variant={marked ? 'secondary' : 'outline'}
        onClick={() => toggleMarkForReview(questionId)}
        className={cn(marked && 'border-amber-500/60 text-amber-700 dark:text-amber-300')}
      >
        <Flag className="size-4" />
        {marked ? 'Unmark review' : 'Mark for Review'}
      </Button>

      <Button variant="ghost" disabled={!hasAnswer} onClick={() => clearAnswer(questionId)}>
        <Eraser className="size-4" />
        Clear Answer
      </Button>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" disabled={index >= total - 1} onClick={nextQuestion}>
          Next
          <ChevronRight className="size-4" />
        </Button>
        <Button onClick={onSubmitClick}>
          <Send className="size-4" />
          Submit
        </Button>
      </div>
    </div>
  )
}
