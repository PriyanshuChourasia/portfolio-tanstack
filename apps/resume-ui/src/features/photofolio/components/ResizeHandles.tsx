import { cn } from '@/lib/utils'
import { HANDLE_CLASSES, RESIZE_HANDLES, type ResizeHandle } from '../canvasGeometry'

const HANDLE_SIZE = 8

/** Edge strips and corner dots for resizing a selected canvas box. */
export function ResizeHandles({ onStart }: { onStart: (e: React.PointerEvent, handle: ResizeHandle) => void }) {
  return RESIZE_HANDLES.map((handle) => {
    const isEdge = handle.length === 1
    return (
      <div
        key={handle}
        onPointerDown={(e) => onStart(e, handle)}
        className={cn(
          'absolute z-30',
          isEdge ? 'bg-primary/0 hover:bg-primary/30' : 'rounded-full border border-primary bg-white',
          HANDLE_CLASSES[handle],
        )}
        style={isEdge
          ? (handle === 't' || handle === 'b') ? { height: HANDLE_SIZE / 2 } : { width: HANDLE_SIZE / 2 }
          : { width: HANDLE_SIZE * 1.5, height: HANDLE_SIZE * 1.5 }}
      />
    )
  })
}
