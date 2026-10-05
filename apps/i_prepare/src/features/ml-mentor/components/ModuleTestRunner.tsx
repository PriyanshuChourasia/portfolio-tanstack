import { Button } from '@/components/ui/button'
import { useMLMentorStore, getModule } from '../store'
import { questionsForModule } from '../data'
import { QuizRunner } from './QuizRunner'

export function ModuleTestRunner() {
  const quiz = useMLMentorStore((state) => state.quiz)
  const selectTestOption = useMLMentorStore((state) => state.selectTestOption)
  const nextTestQuestion = useMLMentorStore((state) => state.nextTestQuestion)
  const previousTestQuestion = useMLMentorStore((state) => state.previousTestQuestion)
  const submitModuleTest = useMLMentorStore((state) => state.submitModuleTest)
  const go = useMLMentorStore((state) => state.go)
  if (!quiz || quiz.kind !== 'module_test' || !quiz.moduleId) return null

  const questions = questionsForModule(quiz.moduleId)
  const module = getModule(quiz.moduleId)

  return (
    <div>
      <div className="mx-auto w-full max-w-2xl px-4 pt-6">
        <Button variant="ghost" size="sm" onClick={() => go('module')}>
          ← Back to module
        </Button>
      </div>
      <QuizRunner
        title={module ? `Module ${module.number} test — ${module.title}` : 'Module test'}
        subtitle="Answers save as you go. Wrong answers re-flag their topics for revision."
        questions={questions.map((question) => ({
          id: question.id,
          prompt: question.prompt,
          options: question.options,
          topicId: question.topicId,
        }))}
        selections={quiz.selections}
        index={quiz.index}
        onSelect={selectTestOption}
        onPrevious={previousTestQuestion}
        onNext={nextTestQuestion}
        onSubmit={submitModuleTest}
      />
    </div>
  )
}
