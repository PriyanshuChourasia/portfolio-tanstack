import { useCallback, useEffect, useMemo, useState } from 'react'
import { ListChecks, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { OPTION_KEYS, getExam } from '@/data/reasoning'
import { questionsForSession } from '../engine/test-builder'
import { useReasoningMockStore } from '../store'
import { AutosaveIndicator } from './AutosaveIndicator'
import { QuestionCard } from './QuestionCard'
import { QuestionPalette } from './QuestionPalette'
import { SubmitConfirmation } from './SubmitConfirmation'
import { TestNavigation } from './TestNavigation'
import { TestTimer } from './TestTimer'
import { formatClock } from '../lib/time'

export function TestWizard() {
  const session = useReasoningMockStore((state) => state.session)
  const submitTest = useReasoningMockStore((state) => state.submitTest)
  const goToQuestion = useReasoningMockStore((state) => state.goToQuestion)
  const nextQuestion = useReasoningMockStore((state) => state.nextQuestion)
  const previousQuestion = useReasoningMockStore((state) => state.previousQuestion)
  const selectOption = useReasoningMockStore((state) => state.selectOption)
  const toggleMarkForReview = useReasoningMockStore((state) => state.toggleMarkForReview)
  const clearAnswer = useReasoningMockStore((state) => state.clearAnswer)
  const resumeTiming = useReasoningMockStore((state) => state.resumeTiming)
  const pauseTiming = useReasoningMockStore((state) => state.pauseTiming)
  const backToResult = useReasoningMockStore((state) => state.backToResult)
  const goToExams = useReasoningMockStore((state) => state.goToExams)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)

  const sessionId = session?.id
  const sessionActive = session?.status === 'active'
  const questions = useMemo(
    () => (session ? questionsForSession(session) : []),
    // The paper of a session never changes, so the id is enough to cache it.
    [sessionId], // eslint-disable-line react-hooks/exhaustive-deps
  )

  // The question clock only runs while the tab is visible, so time spent away is not billed.
  useEffect(() => {
    if (!sessionActive) return
    resumeTiming()
    return () => pauseTiming()
  }, [sessionActive, resumeTiming, pauseTiming])

  useEffect(() => {
    if (!sessionActive) return
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') pauseTiming()
      else resumeTiming()
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [sessionActive, pauseTiming, resumeTiming])

  useEffect(() => {
    if (!session || !sessionActive) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (confirmOpen) return
      const target = event.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return
      const currentId = session.questionIds[session.currentQuestionIndex]
      if (!currentId) return

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        nextQuestion()
        return
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        previousQuestion()
        return
      }
      const optionIndex = OPTION_KEYS.findIndex(
        (key, index) => event.key === key.toLowerCase() || event.key === String(index + 1),
      )
      if (optionIndex >= 0) {
        event.preventDefault()
        selectOption(currentId, OPTION_KEYS[optionIndex])
        return
      }
      if (event.key.toLowerCase() === 'm') {
        event.preventDefault()
        toggleMarkForReview(currentId)
      } else if (event.key.toLowerCase() === 'c') {
        event.preventDefault()
        clearAnswer(currentId)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    session,
    sessionActive,
    confirmOpen,
    nextQuestion,
    previousQuestion,
    selectOption,
    toggleMarkForReview,
    clearAnswer,
  ])

  const handleExpire = useCallback(() => {
    void submitTest('timeout')
  }, [submitTest])

  if (!session || !sessionActive) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-sm text-muted-foreground">
          This test is no longer active — it has either been submitted or replaced by a new attempt.
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <Button variant="outline" onClick={backToResult}>
            View latest result
          </Button>
          <Button onClick={goToExams}>Exam selection</Button>
        </div>
      </div>
    )
  }

  const index = session.currentQuestionIndex
  const question = questions[index]
  const answer = question ? session.answers[question.id] : undefined
  const remainingSeconds = Math.max(
    0,
    Math.ceil((Date.parse(session.startedAt) + session.durationSeconds * 1000 - Date.now()) / 1000),
  )
  const answeredCount = session.questionIds.filter((id) => Boolean(session.answers[id]?.selectedOption)).length
  const exam = getExam(session.examId)

  if (!question) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-sm text-muted-foreground">This paper has no questions.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold tracking-tight">{session.testTitle}</p>
            <p className="truncate text-[11px] text-muted-foreground">
              {exam.name} · Question {index + 1} of {questions.length} · {answeredCount} answered
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden sm:block">
              <AutosaveIndicator />
            </span>
            <TestTimer session={session} onExpire={handleExpire} />
            <Button size="sm" onClick={() => setConfirmOpen(true)}>
              <Send className="size-4" />
              Submit
            </Button>
          </div>
        </div>
        <div className="h-1 w-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((index + 1) / questions.length) * 100}%` }}
          />
        </div>
        <div className="mx-auto px-4 py-1.5 sm:hidden">
          <AutosaveIndicator />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            <QuestionCard
              question={question}
              index={index}
              total={questions.length}
              answer={answer}
              onSelect={(option) => selectOption(question.id, option)}
            />

            <TestNavigation
              questionId={question.id}
              index={index}
              total={questions.length}
              marked={Boolean(answer?.markedForReview)}
              hasAnswer={Boolean(answer?.selectedOption)}
              onSubmitClick={() => setConfirmOpen(true)}
            />

            <p className="mt-3 hidden text-[11px] text-muted-foreground lg:block">
              Keyboard: ← / → to move, 1–4 or A–D to answer, M to mark for review, C to clear.
            </p>

            <div className="mt-4 lg:hidden">
              <Button variant="outline" size="sm" onClick={() => setPaletteOpen((open) => !open)}>
                <ListChecks className="size-4" />
                {paletteOpen ? 'Hide question palette' : 'Show question palette'}
              </Button>
              {paletteOpen && (
                <div className="mt-3">
                  <QuestionPalette
                    session={session}
                    onJump={(target) => {
                      goToQuestion(target)
                      setPaletteOpen(false)
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <QuestionPalette session={session} onJump={goToQuestion} />
              <p className="mt-3 text-[11px] text-muted-foreground">
                Time remaining {formatClock(remainingSeconds)} · answers save automatically.
              </p>
            </div>
          </aside>
        </div>
      </main>

      <SubmitConfirmation
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        session={session}
        timeRemainingSeconds={remainingSeconds}
        onConfirm={() => {
          setConfirmOpen(false)
          void submitTest('user')
        }}
      />
    </div>
  )
}
