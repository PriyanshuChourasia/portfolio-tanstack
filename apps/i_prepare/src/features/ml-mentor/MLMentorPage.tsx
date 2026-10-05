import { useEffect, lazy, Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import { useMLMentorStore, mlStorageLabel } from './store'
import { Dashboard } from './components/Dashboard'
import { ModuleTestRunner } from './components/ModuleTestRunner'

const LazyBaselineQuiz = lazy(() =>
  import('./components/Baseline').then((m) => ({ default: m.BaselineQuiz })),
)
const LazyBaselineResult = lazy(() =>
  import('./components/Baseline').then((m) => ({ default: m.BaselineResult })),
)
const LazyModuleView = lazy(() =>
  import('./components/ModuleView').then((m) => ({ default: m.ModuleView })),
)
const LazyTestResult = lazy(() =>
  import('./components/TestResult').then((m) => ({ default: m.TestResult })),
)
const LazyDailySessionView = lazy(() =>
  import('./components/DailySession').then((m) => ({ default: m.DailySessionView })),
)
const LazySessionResult = lazy(() =>
  import('./components/DailySession').then((m) => ({ default: m.SessionResult })),
)
const LazyInterviewRoom = lazy(() =>
  import('./components/InterviewRoom').then((m) => ({ default: m.InterviewRoom })),
)
const LazyHistory = lazy(() =>
  import('./components/History').then((m) => ({ default: m.History })),
)

function ScreenFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
      <Loader2 className="mr-2 size-4 animate-spin" />
      Loading…
    </div>
  )
}

export function MLMentorPage() {
  const hydrate = useMLMentorStore((state) => state.hydrate)
  const hydrated = useMLMentorStore((state) => state.hydrated)
  const screen = useMLMentorStore((state) => state.screen)
  const storageKind = useMLMentorStore((state) => state.storageKind)

  useEffect(() => {
    void hydrate()
  }, [hydrate])

  if (!hydrated) {
    return (
      <div className="flex min-h-full items-center justify-center p-16">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading your ML mentor…
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full">
      {screen === 'dashboard' && <Dashboard />}
      {screen === 'baseline' && <Suspense fallback={<ScreenFallback />}><LazyBaselineQuiz /></Suspense>}
      {screen === 'baseline_result' && <Suspense fallback={<ScreenFallback />}><LazyBaselineResult /></Suspense>}
      {screen === 'module' && <Suspense fallback={<ScreenFallback />}><LazyModuleView /></Suspense>}
      {screen === 'test' && <ModuleTestRunner />}
      {screen === 'test_result' && <Suspense fallback={<ScreenFallback />}><LazyTestResult /></Suspense>}
      {screen === 'session' && <Suspense fallback={<ScreenFallback />}><LazyDailySessionView /></Suspense>}
      {screen === 'session_result' && <Suspense fallback={<ScreenFallback />}><LazySessionResult /></Suspense>}
      {screen === 'interview' && <Suspense fallback={<ScreenFallback />}><LazyInterviewRoom /></Suspense>}
      {screen === 'history' && <Suspense fallback={<ScreenFallback />}><LazyHistory /></Suspense>}
      {storageKind === 'memory' && (
        <p className="border-t px-4 py-2 text-center text-[11px] text-muted-foreground">
          {mlStorageLabel(storageKind)}
        </p>
      )}
    </div>
  )
}
