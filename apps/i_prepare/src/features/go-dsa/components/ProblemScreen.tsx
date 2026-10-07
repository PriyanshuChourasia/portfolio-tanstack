import { useEffect } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getProblem, PRODUCTION_PROBLEMS } from '../data'
import { isProblemUnlocked } from '../engine/progress'
import { useGoDsaStore } from '../store'
import { ProblemWorkspace } from './ProblemWorkspace'
import { BackButton } from './shared'

export function ProblemScreen() {
  const problemId = useGoDsaStore((state) => state.problemId)
  const source = useGoDsaStore((state) => state.problemSource)
  const data = useGoDsaStore((state) => state.data)
  const openTopic = useGoDsaStore((state) => state.openTopic)
  const openProblem = useGoDsaStore((state) => state.openProblem)
  const go = useGoDsaStore((state) => state.go)

  useEffect(() => {
    window.scrollTo?.({ top: 0 })
  }, [problemId])

  const entry = problemId ? getProblem(problemId) : undefined
  if (!entry || !problemId) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <BackButton label="Dashboard" onClick={() => go('dashboard')} />
      </div>
    )
  }

  const { topic, module } = entry
  const siblings = topic ? topic.problems.map((p) => p.id) : PRODUCTION_PROBLEMS.map((p) => p.id)
  const index = siblings.indexOf(problemId)
  const prev = siblings[index - 1]
  const next = siblings[index + 1]
  const nextUnlocked = topic ? isProblemUnlocked(topic, index + 1, data) : true

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-12">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        {topic && module ? (
          <BackButton label={`M${module.number} · ${topic.title}`} onClick={() => openTopic(topic.id)} />
        ) : (
          <BackButton label="Production mode" onClick={() => go('production')} />
        )}
        <span className="text-xs text-muted-foreground">
          Question {index + 1} of {siblings.length}
        </span>
      </div>

      <ProblemWorkspace problemId={problemId} />

      <div className="mt-6 flex items-center justify-between">
        <Button variant="outline" size="sm" disabled={!prev} onClick={() => prev && openProblem(prev, source)}>
          <ArrowLeft className="size-4" /> Previous
        </Button>
        {next ? (
          <Button size="sm" disabled={!nextUnlocked} onClick={() => openProblem(next, source)}>
            {nextUnlocked ? 'Next question' : 'Attempt this one first'} <ArrowRight className="size-4" />
          </Button>
        ) : (
          topic && (
            <Button size="sm" onClick={() => openTopic(topic.id)}>
              Back to topic summary <ArrowRight className="size-4" />
            </Button>
          )
        )}
      </div>
    </div>
  )
}
