import { useEffect, useState } from 'react'
import { AlertTriangle, Send } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
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

        <div className="space-y-2">
          {[
            { label: 'Answered', value: answered },
            { label: 'Unanswered', value: unanswered },
            { label: 'Marked for review', value: marked },
            { label: 'Time remaining', value: formatClock(timeRemainingSeconds) },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-semibold">{item.value}</span>
            </div>
          ))}
        </div>

        {needsAcknowledgement && (
          <Alert variant="destructive">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <AlertTitle>Unanswered questions</AlertTitle>
            <AlertDescription>
              You have {unanswered} unanswered question{unanswered === 1 ? '' : 's'}. Are you sure you want to submit?
            </AlertDescription>
          </Alert>
        )}

        {needsAcknowledgement && (
          <label className="mt-3 flex items-center gap-2 text-xs font-medium">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(event) => setAcknowledged(event.target.checked)}
              className="size-4 rounded border-border accent-primary"
            />
            Yes, submit with {unanswered} unanswered question{unanswered === 1 ? '' : 's'}.
          </label>
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