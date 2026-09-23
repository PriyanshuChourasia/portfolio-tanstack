import { AlertTriangle, Check, Loader2 } from 'lucide-react'
import { useReasoningMockStore } from '../store'
import { STORAGE_LABELS } from '../lib/storage'

/** Auto-save status. Failure is surfaced loudly — answers must never vanish silently. */
export function AutosaveIndicator() {
  const saveStatus = useReasoningMockStore((state) => state.saveStatus)
  const storageKind = useReasoningMockStore((state) => state.storageKind)
  const storageError = useReasoningMockStore((state) => state.storageError)

  if (saveStatus === 'error') {
    return (
      <span
        className="flex items-center gap-1.5 rounded-lg border border-amber-500/50 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-700 dark:text-amber-300"
        title={storageError ?? undefined}
      >
        <AlertTriangle className="size-3.5" />
        Unable to sync — your answer is kept in this tab only
      </span>
    )
  }

  if (saveStatus === 'saving') {
    return (
      <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
        <Loader2 className="size-3.5 animate-spin" />
        Saving…
      </span>
    )
  }

  if (saveStatus === 'saved') {
    return (
      <span
        className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400"
        title={STORAGE_LABELS[storageKind ?? 'memory']}
      >
        <Check className="size-3.5" />
        Answer saved
      </span>
    )
  }

  return <span className="text-[11px] text-muted-foreground">{STORAGE_LABELS[storageKind ?? 'memory']}</span>
}
