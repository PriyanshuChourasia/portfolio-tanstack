import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { useIPrepareStore } from '../store'
import { ActiveTestRecovery } from './ActiveTestRecovery'
import { ExamSelector } from './ExamSelector'
import { ResultDashboard } from './ResultDashboard'
import { TestConfiguration } from './TestConfiguration'
import { TestHistory } from './TestHistory'
import { TestInstructions } from './TestInstructions'
import { TestWizard } from './TestWizard'

/**
 * Screen router for the mock-test flow.
 *
 * Hydration happens once and restores whatever the user was doing — including an
 * in-progress test, which the store routes to the recovery screen instead of the
 * wizard so nothing resumes silently.
 */
export function IPreparePage() {
  const hydrate = useIPrepareStore((state) => state.hydrate)
  const hydrated = useIPrepareStore((state) => state.hydrated)
  const screen = useIPrepareStore((state) => state.screen)

  useEffect(() => {
    void hydrate()
  }, [hydrate])

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading your saved tests…
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {screen === 'exams' && <ExamSelector />}
      {screen === 'config' && <TestConfiguration />}
      {screen === 'instructions' && <TestInstructions />}
      {screen === 'test' && <TestWizard />}
      {screen === 'recovery' && <ActiveTestRecovery />}
      {screen === 'result' && <ResultDashboard />}
      {screen === 'history' && <TestHistory />}
    </div>
  )
}
