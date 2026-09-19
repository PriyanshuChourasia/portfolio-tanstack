import { Eye, EyeOff, GripVertical, Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/ui/button'

interface RepeatableCardProps {
  /** Stable id used for drag-to-reorder. Omit to render without drag support. */
  id?: string
  onRemove: () => void
  children: ReactNode
  index?: number
  hidden?: boolean
  onToggleHidden?: () => void
}

export function RepeatableCard({
  id,
  onRemove,
  children,
  index,
  hidden,
  onToggleHidden,
}: RepeatableCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: id ?? `__no-drag-${index}`,
    disabled: !id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-lg border bg-card transition-all hover:border-border/80 hover:shadow-sm ${hidden ? 'opacity-60' : ''} ${isDragging ? 'opacity-90 shadow-lg' : ''}`}
    >
      {/* Header bar with entry number, visibility toggle and delete */}
      <div className="flex items-center justify-between border-b bg-muted/30 px-3 py-1.5">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className={`text-muted-foreground/40 hover:text-muted-foreground ${id ? 'cursor-grab touch-none active:cursor-grabbing' : 'cursor-default'}`}
            {...(id ? { ...attributes, ...listeners } : {})}
            aria-label="Drag to reorder"
            disabled={!id}
          >
            <GripVertical className="size-3" />
          </button>
          {index !== undefined && (
            <span className="text-[11px] font-medium text-muted-foreground/60">
              #{index + 1}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {onToggleHidden && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className={`transition-all ${
                hidden
                  ? 'bg-destructive/10 text-destructive hover:bg-destructive/15'
                  : 'text-muted-foreground/30 hover:bg-muted hover:text-muted-foreground'
              }`}
              onClick={onToggleHidden}
              aria-label={hidden ? 'Show on resume' : 'Hide from resume'}
              aria-pressed={!hidden}
              title={hidden ? 'Hidden from resume — click to show' : 'Visible on resume — click to hide'}
            >
              {hidden ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 transition-all"
            onClick={onRemove}
            aria-label="Remove entry"
            title="Delete entry"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3 p-3">{children}</div>
    </div>
  )
}
