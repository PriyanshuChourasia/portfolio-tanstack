import { useCallback, useMemo, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import type { Point } from '../types'
import type { PhotoItem } from '../types'
import { useCanvasState } from '../hooks/use-canvas-state'
import { useCanvasItems } from '../hooks/use-canvas-items'
import { useCanvasInteraction } from '../hooks/use-canvas-interaction'
import { calculateZoom } from '../utils'
import { CANVAS_DEFAULTS } from '../constants'
import { CanvasGrid } from './CanvasGrid'
import { CanvasItemNode } from './CanvasItem'
import { CanvasToolbar } from './CanvasToolbar'
import { PhotoPicker } from './PhotoPicker'
import photosData from '@/data/photos-data.json'

export function Canvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pickerOpen, setPickerOpen] = useState(false)

  const { transform, showGrid, gridSize, setZoom, setOffset, toggleGrid, resetView } = useCanvasState()
  const { items, selectedItemId, selectItem, addItem, moveItem, deleteItem, bringToFront, clearAll } = useCanvasItems()

  const photoMap = useMemo(() => {
    const map = new Map<number, PhotoItem>()
    for (const p of photosData.photos) map.set(p.id, p)
    return map
  }, [])

  const addedPhotoIds = useMemo(() => new Set(items.map((i) => i.photoId)), [items])

  const itemPositions = useRef(new Map<string, { x: number; y: number }>())
  const handleItemMove = useCallback(
    (id: string, dx: number, dy: number) => {
      const item = items.find((i) => i.id === id)
      if (!item) return
      const current = itemPositions.current.get(id) ?? { x: item.x, y: item.y }
      const next = { x: current.x + dx, y: current.y + dy }
      itemPositions.current.set(id, next)
      moveItem(id, next.x, next.y)
    },
    [items, moveItem],
  )

  const interaction = useCanvasInteraction({
    onItemMove: handleItemMove,
    onPan: setOffset,
    onZoom: useCallback(
      (delta: number, _center: Point) => {
        setZoom(calculateZoom(transform.zoom, -delta, CANVAS_DEFAULTS.ZOOM_MIN, CANVAS_DEFAULTS.ZOOM_MAX))
      },
      [transform.zoom, setZoom],
    ),
    onSelect: selectItem,
    currentOffset: transform.offset,
  })

  const handleZoomIn = useCallback(() => setZoom(transform.zoom + CANVAS_DEFAULTS.ZOOM_STEP), [transform.zoom, setZoom])
  const handleZoomOut = useCallback(() => setZoom(transform.zoom - CANVAS_DEFAULTS.ZOOM_STEP), [transform.zoom, setZoom])
  const handleDeleteSelected = useCallback(() => { if (selectedItemId) deleteItem(selectedItemId) }, [selectedItemId, deleteItem])

  const handleAddPhoto = useCallback(
    (photoId: number) => {
      const pos = { x: 150 + Math.random() * 300, y: 150 + Math.random() * 200 }
      const newId = addItem(photoId, pos)
      itemPositions.current.set(newId, pos)
    },
    [addItem],
  )

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl border border-border bg-background">
      <div
        ref={containerRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        onPointerDown={(e) => interaction.handlePointerDown(e, 'canvas')}
        onPointerMove={interaction.handlePointerMove}
        onPointerUp={interaction.handlePointerUp}
        onWheel={interaction.handleWheel}
      >
        {showGrid && <CanvasGrid transform={transform} gridSize={gridSize} />}

        <div style={{ transform: `translate(${transform.offset.x}px, ${transform.offset.y}px) scale(${transform.zoom})`, transformOrigin: '0 0' }}>
          <AnimatePresence>
            {items.map((item) => (
              <CanvasItemNode
                key={item.id}
                item={item}
                photo={photoMap.get(item.photoId)}
                isSelected={selectedItemId === item.id}
                onPointerDown={(e, _target, id) => {
                  bringToFront(id)
                  interaction.handlePointerDown(e, 'item', id)
                  itemPositions.current.set(id, { x: item.x, y: item.y })
                }}
                onRemove={deleteItem}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {items.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
          <div className="p-4 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50 text-center">
            <p className="text-sm text-muted-foreground font-medium">Canvas is empty</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Open the photo picker to add images</p>
          </div>
        </div>
      )}

      <PhotoPicker isOpen={pickerOpen} onToggle={() => setPickerOpen((o) => !o)} onAddPhoto={handleAddPhoto} addedPhotoIds={addedPhotoIds} />

      <CanvasToolbar
        zoom={transform.zoom}
        showGrid={showGrid}
        itemCount={items.length}
        hasSelection={selectedItemId !== null}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetView={resetView}
        onToggleGrid={toggleGrid}
        onDeleteSelected={handleDeleteSelected}
        onClearAll={clearAll}
      />
    </div>
  )
}
