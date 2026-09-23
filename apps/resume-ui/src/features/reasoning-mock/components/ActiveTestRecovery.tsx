import { useState } from 'react'
import { History, PlayCircle, RotateCcw, TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { getExam } from '@/data/reasoning'
import { useReasoningMockStore } from '../store'
import { formatClock, formatDateTime } from '../lib/time'

/** Shown when a saved, unfinished session is found — the spec's "Active Test Found" screen. */
export function ActiveTestRecovery() {
  const session = useReasoningMockStore((state) => state.session)
  const resumeSession = useReasoningMockStore((state) => state.resumeSession)
  const discardSession = useReasoningMockStore((state) => state.discardSession)
  const [confirmDiscard, setConfirmDiscard] = useState(false)

  if (!session || session.status !== 'active') {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-sm text-muted-foreground">No unfinished test was found.</p>
      </div>
    )
  }

  const answered = session.questionIds.filter((id) => Boolean(session.answers[id]?.selectedOption)).length
  const remaining = Math.max(
    0,
    Math.ceil((Date.parse(session.startedAt) + session.durationSeconds * 1000 - Date.now()) / 1000),
  )

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-14">
      <div className="rounded-2xl border border-amber-500/40 bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <TriangleAlert className="size-5 text-amber-500" />
          <h1 className="text-xl font-bold tracking-tight">Active test found</h1>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          You have an unfinished <strong>{getExam(session.examId).name}</strong> reasoning test
          ({session.testTitle}). Resume it exactly where you left off.
        </p>

        <dl className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-muted/40 px-3 py-2.5">
            <dt className="text-[11px] text-muted-foreground">Progress</dt>
            <dd className="text-sm font-semibold">
              {answered} / {session.questionIds.length} answered
            </dd>
          </div>
          <div className="rounded-xl bg-muted/40 px-3 py-2.5">
            <dt className="text-[11px] text-muted-foreground">Time remaining</dt>
            <dd className="font-mono text-sm font-semibold">{formatClock(remaining)}</dd>
          </div>
          <div className="rounded-xl bg-muted/40 px-3 py-2.5">
            <dt className="text-[11px] text-muted-foreground">Started</dt>
            <dd className="text-sm font-semibold">{formatDateTime(session.startedAt)}</dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button size="lg" onClick={resumeSession}>
            <PlayCircle className="size-4" />
            Resume Test
          </Button>
          <Button size="lg" variant="outline" onClick={() => setConfirmDiscard(true)}>
            <RotateCcw className="size-4" />
            Start New Test
          </Button>
        </div>
        <p className="mt-4 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <History className="size-3.5" />
          Starting a new test discards this session and its answers permanently.
        </p>
      </div>

      <Dialog open={confirmDiscard} onOpenChange={setConfirmDiscard}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Discard the unfinished test?</DialogTitle>
            <DialogDescription>
              {answered} saved answer{answered === 1 ? '' : 's'} will be deleted and cannot be recovered.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-between">
            <Button variant="outline" onClick={() => setConfirmDiscard(false)}>
              Keep my test
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setConfirmDiscard(false)
                void discardSession()
              }}
            >
              Discard and start new
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
