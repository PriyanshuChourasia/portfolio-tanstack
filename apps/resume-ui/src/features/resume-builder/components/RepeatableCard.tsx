import { GripVertical, Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface RepeatableCardProps {
  onRemove: () => void
  children: ReactNode
  index?: number
}

export function RepeatableCard({
  onRemove,
  children,
  index,
}: RepeatableCardProps) {
  return (
    <div className="group relative rounded-lg border bg-card transition-all hover:border-border/80 hover:shadow-sm">
      {/* Header bar with entry number and delete */}
      <div className="flex items-center justify-between border-b bg-muted/30 px-3 py-1.5">
        <div className="flex items-center gap-1.5">
          <GripVertical className="size-3 text-muted-foreground/40" />
          {index !== undefined && (
            <span className="text-[11px] font-medium text-muted-foreground/60">
              #{index + 1}
            </span>
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 transition-all"
          onClick={onRemove}
          aria-label="Remove entry"
          title="Delete entry"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>

      {/* Content */}
      <div className="space-y-3 p-3">{children}</div>
    </div>
  )
}
