import { useCallback, useRef, useState } from 'react'
import type { Point } from '../types'

interface DragState {
  isDragging: boolean
  dragTarget: 'item' | 'canvas' | null
  itemId: string | null
  last: Point
}

export function useCanvasInteraction(callbacks: {
  onItemMove: (id: string, dx: number, dy: number) => void
  onPan: (offset: Point) => void
  onZoom: (delta: number, center: Point) => void
  onSelect: (id: string | null) => void
  currentOffset: Point
}) {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragTarget: null,
    itemId: null,
    last: { x: 0, y: 0 },
  })

  const dragRef = useRef(dragState)
  dragRef.current = dragState

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, target: 'item' | 'canvas', itemId?: string) => {
      e.preventDefault()
      e.stopPropagation()
      const point: Point = { x: e.clientX, y: e.clientY }

      if (target === 'item' && itemId) {
        callbacks.onSelect(itemId)
        setDragState({ isDragging: true, dragTarget: 'item', itemId, last: point })
      } else if (target === 'canvas') {
        callbacks.onSelect(null)
        setDragState({ isDragging: true, dragTarget: 'canvas', itemId: null, last: point })
      }

      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    },
    [callbacks],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragRef.current.isDragging) return
      const current: Point = { x: e.clientX, y: e.clientY }
      const { dragTarget, itemId, last } = dragRef.current

      if (dragTarget === 'item' && itemId) {
        callbacks.onItemMove(itemId, current.x - last.x, current.y - last.y)
      } else if (dragTarget === 'canvas') {
        callbacks.onPan({
          x: callbacks.currentOffset.x + (current.x - last.x),
          y: callbacks.currentOffset.y + (current.y - last.y),
        })
      }

      setDragState((prev) => ({ ...prev, last: current }))
    },
    [callbacks],
  )

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    setDragState({ isDragging: false, dragTarget: null, itemId: null, last: { x: 0, y: 0 } })
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
  }, [])

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault()
      callbacks.onZoom(e.deltaY, { x: e.clientX, y: e.clientY })
    },
    [callbacks],
  )

  return {
    isDragging: dragState.isDragging,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleWheel,
  }
}
