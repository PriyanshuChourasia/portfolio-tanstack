import { useMemo } from 'react'
import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { getModule, WEEKLY_CHALLENGES } from '../data'
import { moduleStatus, topicRows } from '../engine/progress'
import { useGoDsaStore } from '../store'
import { BackButton, StatusEmoji } from './shared'

export function ModuleView() {
  const moduleId = useGoDsaStore((state) => state.moduleId)
  const data = useGoDsaStore((state) => state.data)
  const go = useGoDsaStore((state) => state.go)
  const openTopic = useGoDsaStore((state) => state.openTopic)
  const rows = useMemo(() => topicRows(data), [data])
  const module = moduleId ? getModule(moduleId) : undefined

  if (!module) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <BackButton label="Dashboard" onClick={() => go('dashboard')} />
        <p className="mt-6 text-sm text-muted-foreground">Module not found.</p>
      </div>
    )
  }

  const own = rows.filter((row) => row.module.id === module.id)
  const challenge = WEEKLY_CHALLENGES.find((item) => item.afterModuleId === module.id)

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-12">
      <div className="flex items-center justify-between">
        <BackButton label="Dashboard" onClick={() => go('dashboard')} />
        <StatusEmoji status={moduleStatus(rows, module.id)} />
      </div>
      <header className="mt-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Module {module.number} · {module.track === 'go' ? 'Golang' : 'DSA & Algorithms'}
        </p>
        <h1 className="text-2xl font-black tracking-tight sm:text-3xl">{module.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{module.tagline}</p>
      </header>

      <div className="mt-6 space-y-3">
        {own.map((row, index) => (
          <button
            key={row.topic.id}
            type="button"
            onClick={() => openTopic(row.topic.id)}
            className="flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/40"
          >
            <span className="min-w-0">
              <span className="text-[11px] font-semibold text-muted-foreground">Topic {index + 1}</span>
              <span className="block text-sm font-bold">{row.topic.title}</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">{row.topic.summary}</span>
            </span>
            <span className="flex shrink-0 items-center gap-2">
              <Badge variant="outline" className="rounded-full text-[10px] tabular-nums">
                {row.solved}/{row.total}
              </Badge>
              {row.score !== null && (
                <Badge variant="secondary" className="rounded-full text-[10px] tabular-nums">
                  {row.score}/10
                </Badge>
              )}
              <StatusEmoji status={row.status} />
              <ArrowRight className="size-4 text-muted-foreground" />
            </span>
          </button>
        ))}
      </div>

      {challenge && (
        <Card className="mt-6 border-primary/30 bg-primary/5">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <p className="text-sm font-bold">Weekly challenge unlocked by this section: {challenge.title}</p>
              <p className="text-xs text-muted-foreground">{challenge.brief}</p>
            </div>
            <button type="button" className="text-xs font-semibold text-primary" onClick={() => go('challenges')}>
              Open challenges →
            </button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
