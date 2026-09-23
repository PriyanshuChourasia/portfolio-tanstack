import { useEffect, useState } from 'react'
import { AlertTriangle, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { TestSession } from '@/data/reasoning'
import { formatClock } from '../lib/time'

export function SubmitConfirmation({
  open,
  onOpenChange,
  session,
  onConfirm,
  timeRemainingSeconds,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  session: TestSession
  onConfirm: () => void
  timeRemainingSeconds: number
}) {
  const [acknowledged, setAcknowledged] = useState(false)

  useEffect(() => {
    if (open) setAcknowledged(false)
  }, [open])

  const ids = session.questionIds
  const answered = ids.filter((id) => Boolean(session.answers[id]?.selectedOption)).length
  const marked = ids.filter((id) => session.answers[id]?.markedForReview).length
  const unanswered = ids.length - answered
  const needsAcknowledgement = unanswered > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Submit test?</DialogTitle>
          <DialogDescription>
            Once submitted the test is locked, the timer stops and your score becomes final.
          </DialogDescription>
        </DialogHeader>

        <ul className="space-y-2 text-sm">
          <li className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
            <span className="text-muted-foreground">Answered</span>
            <span className="font-semibold">{answered}</span>
          </li>
          <li className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
            <span className="text-muted-foreground">Unanswered</span>
            <span className="font-semibold">{unanswered}</span>
          </li>
          <li className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
            <span className="text-muted-foreground">Marked for review</span>
            <span className="font-semibold">{marked}</span>
          </li>
          <li className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
            <span className="text-muted-foreground">Time remaining</span>
            <span className="font-mono font-semibold">{formatClock(timeRemainingSeconds)}</span>
          </li>
        </ul>

        {needsAcknowledgement && (
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3">
            <p className="flex items-start gap-2 text-xs font-medium text-amber-800 dark:text-amber-200">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              You have {unanswered} unanswered question{unanswered === 1 ? '' : 's'}. Are you sure you want to
              submit?
            </p>
            <label className="mt-3 flex items-center gap-2 text-xs font-medium">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(event) => setAcknowledged(event.target.checked)}
                className="size-4 rounded border-border accent-primary"
              />
              Yes, submit with {unanswered} unanswered question{unanswered === 1 ? '' : 's'}.
            </label>
          </div>
        )}

        <DialogFooter className="gap-2 sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Go back to test
          </Button>
          <Button disabled={needsAcknowledgement && !acknowledged} onClick={onConfirm}>
            <Send className="size-4" />
            {needsAcknowledgement ? 'Submit anyway' : 'Submit test'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
