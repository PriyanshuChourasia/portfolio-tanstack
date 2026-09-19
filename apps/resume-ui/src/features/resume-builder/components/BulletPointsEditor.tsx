import { GripVertical, Plus, Trash2 } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SortableList } from './SortableList'

interface BulletPointsEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

/** Stores bullets as a newline-joined string (unchanged on-disk format) but edits them as a drag-reorderable list of single lines. */
export function BulletPointsEditor({ value, onChange, placeholder }: BulletPointsEditorProps) {
  const lines = value.split('\n')

  const setLines = (next: Array<string>) => onChange(next.join('\n'))

  const updateLine = (index: number, text: string) => {
    const next = [...lines]
    next[index] = text
    setLines(next)
  }

  const removeLine = (index: number) => {
    const next = lines.filter((_, i) => i !== index)
    setLines(next)
  }

  const addLine = () => setLines([...lines, ''])

  const reorderLines = (fromIndex: number, toIndex: number) => {
    const next = [...lines]
    const [moved] = next.splice(fromIndex, 1)
    next.splice(toIndex, 0, moved)
    setLines(next)
  }

  // Stable ids for dnd-kit — line content can repeat, so key off position-based ids.
  const ids = lines.map((_, i) => `bullet-${i}`)

  return (
    <div className="space-y-1.5">
      <SortableList ids={ids} onReorder={reorderLines}>
        {lines.map((line, index) => (
          <BulletRow
            key={ids[index]}
            id={ids[index]}
            value={line}
            placeholder={index === 0 ? placeholder : undefined}
            onChange={(text) => updateLine(index, text)}
            onRemove={() => removeLine(index)}
          />
        ))}
      </SortableList>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full border-dashed"
        onClick={addLine}
      >
        <Plus className="size-3.5" /> Add Bullet Point
      </Button>
    </div>
  )
}

function BulletRow({
  id,
  value,
  placeholder,
  onChange,
  onRemove,
}: {
  id: string
  value: string
  placeholder?: string
  onChange: (value: string) => void
  onRemove: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-1.5 ${isDragging ? 'opacity-90' : ''}`}
    >
      <button
        type="button"
        className="shrink-0 cursor-grab touch-none text-muted-foreground/40 hover:text-muted-foreground active:cursor-grabbing"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder bullet"
      >
        <GripVertical className="size-3.5" />
      </button>
      <Input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 flex-1 text-[13px]"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="shrink-0 text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10"
        onClick={onRemove}
        aria-label="Remove bullet"
        title="Delete bullet"
      >
        <Trash2 className="size-3.5" />
      </Button>
    </div>
  )
}
