import { useCallback, useEffect, useRef, useState } from 'react'
import { AlignCenter, AlignLeft, AlignRight, Droplets, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { clamp, resizeRect, type Rect, type ResizeHandle } from '../canvasGeometry'
import type { BlockAlign, BlockKind, ContentBlock, NewContentBlock } from '../useCanvasBlocks'
import { ResizeHandles } from './ResizeHandles'

const KIND_CLASSES: Record<BlockKind, string> = {
  heading: 'text-4xl font-bold leading-tight tracking-tight',
  paragraph: 'text-sm leading-relaxed opacity-85',
  quote: 'border-l-4 border-current/40 pl-4 text-xl italic leading-snug',
  button: 'flex items-center justify-center',
  contact: 'text-sm leading-relaxed',
}

const ALIGN_CLASSES: Record<BlockAlign, string> = { left: 'text-left', center: 'text-center', right: 'text-right' }

interface DragState {
  type: 'move' | 'resize'
  startX: number
  startY: number
  orig: Rect
  handle?: ResizeHandle
}

/** A draggable, resizable text block. Double-click to edit its text. */
export function TextBlockBox({
  block,
  canvasW,
  canvasH,
  isSelected,
  onSelect,
  onUpdate,
  onRemove,
}: {
  block: ContentBlock
  canvasW: number
  canvasH: number
  isSelected: boolean
  onSelect: (id: string) => void
  onUpdate: (id: string, updates: Partial<NewContentBlock>) => void
  onRemove: (id: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const dragRef = useRef<DragState | null>(null)

  useEffect(() => { if (!isSelected) setEditing(false) }, [isSelected])

  const startDrag = useCallback((e: React.PointerEvent, type: DragState['type'], handle?: ResizeHandle) => {
    if (e.button !== 0 || editing) return
    e.stopPropagation()
    e.preventDefault()
    onSelect(block.id)
    dragRef.current = {
      type,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      orig: { x: block.x, y: block.y, width: block.width, height: block.height },
    }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }, [block, editing, onSelect])

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const state = dragRef.current
      if (!state || !canvasW || !canvasH) return
      const dx = (e.clientX - state.startX) / canvasW
      const dy = (e.clientY - state.startY) / canvasH
      if (state.type === 'move') {
        onUpdate(block.id, {
          x: clamp(state.orig.x + dx, 0, 1 - state.orig.width),
          y: clamp(state.orig.y + dy, 0, 1 - state.orig.height),
        })
      } else if (state.handle) {
        onUpdate(block.id, resizeRect(state.orig, state.handle, dx, dy, canvasW, canvasH))
      }
    }
    const onUp = () => { dragRef.current = null }
    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', onUp)
    document.addEventListener('pointercancel', onUp)
    return () => {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', onUp)
      document.removeEventListener('pointercancel', onUp)
    }
  }, [block.id, canvasW, canvasH, onUpdate])

  const textClass = cn(KIND_CLASSES[block.kind], ALIGN_CLASSES[block.align], 'whitespace-pre-wrap break-words')
  const stop = (e: React.PointerEvent) => e.stopPropagation()

  return (
    <div
      data-content-block
      onPointerDown={(e) => startDrag(e, 'move')}
      onClick={(e) => { e.stopPropagation(); onSelect(block.id) }}
      onDoubleClick={(e) => { e.stopPropagation(); setEditing(true) }}
      className={cn(
        'absolute z-20 select-none rounded-lg',
        editing ? 'cursor-text' : 'cursor-move',
        block.blur && 'bg-black/30 text-white shadow-lg backdrop-blur-md',
        isSelected ? 'ring-2 ring-primary' : 'hover:ring-1 hover:ring-primary/40',
      )}
      style={{ left: block.x * canvasW, top: block.y * canvasH, width: block.width * canvasW, height: block.height * canvasH, touchAction: 'none' }}
    >
      <div className={cn('h-full w-full overflow-hidden', block.blur ? 'p-5' : 'p-2')}>
        {editing ? (
          <textarea
            autoFocus
            value={block.text}
            onChange={(e) => onUpdate(block.id, { text: e.target.value })}
            onBlur={() => setEditing(false)}
            onKeyDown={(e) => { if (e.key === 'Escape') setEditing(false) }}
            onPointerDown={stop}
            className={cn(textClass, 'h-full w-full resize-none bg-transparent outline-none', block.kind === 'button' && 'text-center')}
          />
        ) : block.kind === 'button' ? (
          <div className={cn(textClass, 'h-full', block.align === 'left' ? 'justify-start' : block.align === 'right' ? 'justify-end' : 'justify-center')}>
            <span className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow">{block.text || 'Button'}</span>
          </div>
        ) : (
          <p className={textClass}>{block.text || 'Double-click to edit'}</p>
        )}
      </div>

      {isSelected && !editing && (
        <>
          {/* Sits above the box, or just inside it when there's no room above (section edges clip). */}
          <div
            onPointerDown={stop}
            className={cn(
              'absolute z-40 flex items-center gap-0.5 rounded-md bg-black/70 p-0.5 text-white shadow',
              block.y * canvasH < 36 ? 'top-1 left-1' : '-top-8 left-0',
            )}
          >
            {([
              ['left', AlignLeft],
              ['center', AlignCenter],
              ['right', AlignRight],
            ] as const).map(([align, Icon]) => (
              <button
                key={align}
                type="button"
                onClick={(e) => { e.stopPropagation(); onUpdate(block.id, { align }) }}
                aria-label={`Align ${align}`}
                className={cn('flex size-6 items-center justify-center rounded hover:bg-white/20', block.align === align && 'bg-white/25')}
              >
                <Icon className="size-3.5" />
              </button>
            ))}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onUpdate(block.id, { blur: !block.blur }) }}
              aria-label="Toggle blurred background"
              title="Blurred background"
              className={cn('flex size-6 items-center justify-center rounded hover:bg-white/20', block.blur && 'bg-white/25')}
            >
              <Droplets className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onRemove(block.id) }}
              aria-label="Delete block"
              className="flex size-6 items-center justify-center rounded hover:bg-red-600"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
          <ResizeHandles onStart={(e, handle) => startDrag(e, 'resize', handle)} />
        </>
      )}
    </div>
  )
}
