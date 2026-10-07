import { useEffect } from 'react'
import { useGoDsaStore } from './store'
import { GO_STORAGE_LABELS } from './lib/storage'
import { Dashboard } from './components/Dashboard'
import { ModuleView } from './components/ModuleView'
import { TopicView } from './components/TopicView'
import { ProblemScreen } from './components/ProblemScreen'
import { ProgressTable } from './components/ProgressTable'
import {
  ChallengesScreen,
  ExamResultScreen,
  ExamScreen,
  InterviewScreen,
  ProductionScreen,
  RevisionScreen,
} from './components/Modes'

export function GoDsaPage() {
  const hydrate = useGoDsaStore((state) => state.hydrate)
  const hydrated = useGoDsaStore((state) => state.hydrated)
  const screen = useGoDsaStore((state) => state.screen)
  const storageKind = useGoDsaStore((state) => state.storageKind)
  const saveFailed = useGoDsaStore((state) => state.saveFailed)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  if (!hydrated) return null

  return (
    <div className="min-h-full">
      {screen === 'dashboard' && <Dashboard />}
      {screen === 'module' && <ModuleView />}
      {screen === 'topic' && <TopicView />}
      {screen === 'problem' && <ProblemScreen />}
      {screen === 'progress' && <ProgressTable />}
      {screen === 'revision' && <RevisionScreen />}
      {screen === 'exam' && <ExamScreen />}
      {screen === 'exam_result' && <ExamResultScreen />}
      {screen === 'interview' && <InterviewScreen />}
      {screen === 'production' && <ProductionScreen />}
      {screen === 'challenges' && <ChallengesScreen />}
      {(storageKind === 'memory' || saveFailed) && (
        <p className="border-t px-4 py-2 text-center text-[11px] text-muted-foreground">{GO_STORAGE_LABELS.memory}</p>
      )}
    </div>
  )
}
