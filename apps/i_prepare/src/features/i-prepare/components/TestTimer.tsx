import { useEffect, useRef, useState } from 'react'
import { AlertTriangle, TimerIcon } from 'lucide-react'
import type { TestSession } from '@/data/reasoning'
import { cn } from '@/lib/utils'
import { formatClock } from '../lib/time'

/**
 * Countdown timer.
 *
 * The remaining time is always derived from the persisted `startedAt` + duration, so
 * reloading the page can never reset or drift the clock. The interval only exists to
 * re-render; it is never the source of truth.
 */
export function TestTimer({
  session,
  onExpire,
}: {
  session: TestSession
  onExpire: () => void
}) {
  const endMs = Date.parse(session.startedAt) + session.durationSeconds * 1000
  const [nowMs, setNowMs] = useState(() => Date.now())
  const firedRef = useRef(false)

  useEffect(() => {
    firedRef.current = false
    setNowMs(Date.now())
    const interval = window.setInterval(() => setNowMs(Date.now()), 1000)
    return () => window.clearInterval(interval)
  }, [session.id, session.startedAt, session.durationSeconds])

  const remainingSeconds = Math.max(0, Math.ceil((endMs - nowMs) / 1000))

  useEffect(() => {
    if (remainingSeconds <= 0 && !firedRef.current && session.status === 'active') {
      firedRef.current = true
      onExpire()
    }
  }, [remainingSeconds, session.status, onExpire])

  const warning = remainingSeconds <= 60 ? 'critical' : remainingSeconds <= 300 ? 'warn' : 'normal'

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-sm font-bold tabular-nums transition-colors',
        warning === 'normal' && 'border-border/60 bg-card text-foreground',
        warning === 'warn' && 'border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-300',
        warning === 'critical' && 'animate-pulse border-destructive/60 bg-destructive/10 text-destructive',
      )}
      role="timer"
      aria-live={warning === 'normal' ? 'off' : 'polite'}
    >
      {warning === 'normal' ? <TimerIcon className="size-4" /> : <AlertTriangle className="size-4" />}
      <span>{formatClock(remainingSeconds)}</span>
      {warning === 'warn' && <span className="hidden text-[10px] font-semibold sm:inline">5 min left</span>}
      {warning === 'critical' && <span className="hidden text-[10px] font-semibold sm:inline">1 min left</span>}
    </div>
  )
}
