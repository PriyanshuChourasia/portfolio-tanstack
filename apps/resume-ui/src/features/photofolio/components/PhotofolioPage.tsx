import { useCallback, useRef, useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { ImagePlus, Trash2, ZoomIn, ZoomOut } from 'lucide-react'
import { usePhotofolioImages, usePhotofolioCanvasSettings, type Photo } from '../usePhotofolioImages'

const MIN_SIZE = 40
const HANDLE_SIZE = 8
const MIN_ZOOM = 1
const MAX_ZOOM = 3

type ResizeHandle = 't' | 'b' | 'l' | 'r' | 'tl' | 'tr' | 'bl' | 'br'

interface DragState {
  type: 'move' | 'resize' | 'pan'
  photoId: string
  startX: number
  startY: number
  origX: number
  origY: number
  origW: number
  origH: number
  origOffsetX: number
  origOffsetY: number
  origZoom: number
  handle?: ResizeHandle
}

function resizeDelta(handle: ResizeHandle, dxRatio: number, dyRatio: number, minWRatio: number, minHRatio: number): { w: number; h: number; x: number; y: number } {
  switch (handle) {
    case 'br': return { w: Math.max(minWRatio, dxRatio), h: Math.max(minHRatio, dyRatio), x: 0, y: 0 }
    case 'bl': return { w: Math.max(minWRatio, -dxRatio), h: Math.max(minHRatio, dyRatio), x: -dxRatio, y: 0 }
    case 'tr': return { w: Math.max(minWRatio, dxRatio), h: Math.max(minHRatio, -dyRatio), x: 0, y: -dyRatio }
    case 'tl': return { w: Math.max(minWRatio, -dxRatio), h: Math.max(minHRatio, -dyRatio), x: -dxRatio, y: -dyRatio }
    case 'r':  return { w: Math.max(minWRatio, dxRatio), h: 0, x: 0, y: 0 }
    case 'l':  return { w: Math.max(minWRatio, -dxRatio), h: 0, x: -dxRatio, y: 0 }
    case 'b':  return { w: 0, h: Math.max(minHRatio, dyRatio), x: 0, y: 0 }
    case 't':  return { w: 0, h: Math.max(minHRatio, -dyRatio), x: 0, y: -dyRatio }
  }
}

function PhotoBox({
  photo,
  canvasW,
  canvasH,
  isSelected,
  onSelect,
  onRemove,
  onUpdate,
  isGridMode,
}: {
  photo: Photo
  canvasW: number
  canvasH: number
  isSelected: boolean
  onSelect: (id: string) => void
  onRemove: (id: string) => void
  onUpdate: (id: string, updates: Partial<Pick<Photo, 'x' | 'y' | 'width' | 'height' | 'zoom' | 'offsetX' | 'offsetY'>>) => void
  isGridMode: boolean
}) {
  const dragStateRef = useRef<DragState | null>(null)
  const zoomRef = useRef(photo.zoom)

  useEffect(() => {
    zoomRef.current = photo.zoom
  }, [photo.zoom])

  const toPixelX = useCallback((ratio: number) => ratio * canvasW, [canvasW])
  const toPixelY = useCallback((ratio: number) => ratio * canvasH, [canvasH])

  const pxToRatioX = useCallback((px: number) => px / canvasW, [canvasW])
  const pxToRatioY = useCallback((px: number) => px / canvasH, [canvasH])

  const imgPxW = toPixelX(photo.width) * photo.zoom
  const imgPxH = toPixelY(photo.height) * photo.zoom
  const excessW = Math.max(0, imgPxW - toPixelX(photo.width))
  const excessH = Math.max(0, imgPxH - toPixelY(photo.height))

  const getMaxOffsetRatio = useCallback((zoom: number) => {
    const ew = toPixelX(photo.width) * zoom - toPixelX(photo.width)
    const eh = toPixelY(photo.height) * zoom - toPixelY(photo.height)
    return { maxRatioX: ew > 0 ? 1 : 0, maxRatioY: eh > 0 ? 1 : 0 }
  }, [photo.width, photo.height, canvasW, canvasH, toPixelX, toPixelY])

  const handlePointerDown = useCallback((e: React.PointerEvent, mode: 'move' | 'resize' | 'pan', handle?: ResizeHandle) => {
    if (isGridMode) return
    e.stopPropagation()
    e.preventDefault()
    const zoom = zoomRef.current
    dragStateRef.current = {
      type: mode,
      photoId: photo.id,
      startX: e.clientX,
      startY: e.clientY,
      origX: photo.x,
      origY: photo.y,
      origW: photo.width,
      origH: photo.height,
      origOffsetX: photo.offsetX,
      origOffsetY: photo.offsetY,
      origZoom: zoom,
      handle,
    }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [photo])

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const state = dragStateRef.current
      if (!state) return
      const dx = e.clientX - state.startX
      const dy = e.clientY - state.startY

      if (state.type === 'move') {
        const ratioDx = pxToRatioX(dx)
        const ratioDy = pxToRatioY(dy)
        onUpdate(state.photoId, { x: state.origX + ratioDx, y: state.origY + ratioDy })
      } else if (state.type === 'resize') {
        const ratioDx = pxToRatioX(dx)
        const ratioDy = pxToRatioY(dy)
        const minWRatio = MIN_SIZE / canvasW
        const minHRatio = MIN_SIZE / canvasH
        const delta = resizeDelta(state.handle!, ratioDx, ratioDy, minWRatio, minHRatio)
        const newW = Math.max(0.05, state.origW + delta.w)
        const newH = Math.max(0.05, state.origH + delta.h)
        const newX = Math.max(0, Math.min(1 - newW, state.origX + delta.x))
        const newY = Math.max(0, Math.min(1 - newH, state.origY + delta.y))
        onUpdate(state.photoId, { x: newX, y: newY, width: newW, height: newH })
      } else if (state.type === 'pan') {
        const zoom = state.origZoom
        const excessX = toPixelX(state.origW) * zoom - toPixelX(state.origW)
        const excessY = toPixelY(state.origH) * zoom - toPixelY(state.origH)
        const maxRatioX = excessX > 0 ? 1 : 0
        const maxRatioY = excessY > 0 ? 1 : 0
        const maxOffsetX = excessX > 0 ? state.origOffsetX + pxToRatioX(dx) : 0
        const maxOffsetY = excessY > 0 ? state.origOffsetY + pxToRatioY(dy) : 0
        const clampedX = maxRatioX > 0 ? Math.max(0, Math.min(maxOffsetX, maxRatioX)) : 0
        const clampedY = maxRatioY > 0 ? Math.max(0, Math.min(maxOffsetY, maxRatioY)) : 0
        onUpdate(state.photoId, { offsetX: clampedX, offsetY: clampedY })
      }
    }

    const onUp = () => {
      dragStateRef.current = null
    }

    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', onUp)
    return () => {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', onUp)
    }
  }, [onUpdate, pxToRatioX, pxToRatioY, toPixelX, toPixelY, canvasW, canvasH])

  const handleZoom = useCallback((delta: number) => {
    const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, photo.zoom + delta))
    const { maxRatioX, maxRatioY } = getMaxOffsetRatio(newZoom)
    const clampedOffsetX = Math.max(0, Math.min(photo.offsetX, maxRatioX))
    const clampedOffsetY = Math.max(0, Math.min(photo.offsetY, maxRatioY))
    onUpdate(photo.id, { zoom: newZoom, offsetX: clampedOffsetX, offsetY: clampedOffsetY })
  }, [photo, onUpdate, getMaxOffsetRatio])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    e.stopPropagation()
    handleZoom(e.deltaY > 0 ? -0.1 : 0.1)
  }, [handleZoom])

  const handleZoomIn = useCallback(() => handleZoom(0.25), [handleZoom])
  const handleZoomOut = useCallback(() => handleZoom(-0.25), [handleZoom])

  const boxStyle: React.CSSProperties = {
    left: toPixelX(photo.x),
    top: toPixelY(photo.y),
    width: toPixelX(photo.width),
    height: toPixelY(photo.height),
  }

  const imgStyle: React.CSSProperties = {
    width: imgPxW,
    height: imgPxH,
    left: -photo.offsetX * excessW,
    top: -photo.offsetY * excessH,
    objectFit: 'cover',
  }

  return (
    <div
      data-photo-box
      onClick={(e) => { e.stopPropagation(); onSelect(photo.id) }}
      onPointerDown={(e) => handlePointerDown(e, 'move')}
      onWheel={handleWheel}
      className={cn(
        'absolute select-none overflow-hidden border-2 rounded-lg shadow-lg',
        isGridMode ? 'cursor-default' : 'cursor-move',
        isSelected ? 'border-primary ring-2 ring-primary/30' : 'border-border/60 hover:border-primary/40',
      )}
      style={{ ...boxStyle, touchAction: 'none' }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <img src={photo.url} alt={photo.name} className="absolute" style={imgStyle} />
      </div>

      {isSelected && (
        <>
          <div className="absolute top-1 left-1 flex items-center gap-1 bg-black/50 rounded px-1.5 py-0.5">
            <span className="text-[9px] font-bold text-white">{photo.name}</span>
            <span className="text-[9px] font-bold text-white/70">{photo.zoom.toFixed(2)}x</span>
            <button type="button" onClick={(e) => { e.stopPropagation(); handleZoomOut() }} className="flex h-4 w-4 items-center justify-center rounded bg-black/60 text-white hover:bg-blue-600">
              <ZoomOut className="size-2.5" />
            </button>
            <button type="button" onClick={(e) => { e.stopPropagation(); handleZoomIn() }} className="flex h-4 w-4 items-center justify-center rounded bg-black/60 text-white hover:bg-blue-600">
              <ZoomIn className="size-2.5" />
            </button>
            <button type="button" onClick={(e) => { e.stopPropagation(); onRemove(photo.id) }} className="flex h-4 w-4 items-center justify-center rounded bg-black/60 text-white hover:bg-red-600">
              <Trash2 className="size-2.5" />
            </button>
          </div>

          {photo.zoom > 1 && (
            <div className="absolute bottom-1 left-1 bg-black/50 rounded px-1.5 py-0.5">
              <span className="text-[8px] text-white/70">Scroll to zoom · Drag image to pan</span>
            </div>
          )}

          {!isGridMode && (['t', 'b', 'l', 'r', 'br', 'bl', 'tr', 'tl'] as ResizeHandle[]).map((handle) => {
              const isEdge = ['t', 'b', 'l', 'r'].includes(handle)
              const edgeStyle: React.CSSProperties = isEdge
                ? (handle === 't' || handle === 'b')
                  ? { left: 0, right: 0, height: HANDLE_SIZE, margin: 0 }
                  : { top: 0, bottom: 0, width: HANDLE_SIZE, margin: 0 }
                : { width: HANDLE_SIZE, height: HANDLE_SIZE, margin: -HANDLE_SIZE / 2 }
              return (
                <div
                  key={handle}
                  onPointerDown={(e) => handlePointerDown(e, 'resize', handle)}
                  className={cn(
                    'absolute bg-white border border-primary',
                    isEdge ? 'rounded-sm' : 'rounded-full',
                    handle === 'br' && 'right-0 bottom-0 cursor-nwse-resize',
                    handle === 'tl' && 'left-0 top-0 cursor-nwse-resize',
                    handle === 'tr' && 'right-0 top-0 cursor-nesw-resize',
                    handle === 'bl' && 'left-0 bottom-0 cursor-nesw-resize',
                    handle === 'r' && 'right-0 top-1/2 bottom-1/2 cursor-ew-resize',
                    handle === 'l' && 'left-0 top-1/2 bottom-1/2 cursor-ew-resize',
                    handle === 'b' && 'bottom-0 left-0 right-0 cursor-ns-resize',
                    handle === 't' && 'top-0 left-0 right-0 cursor-ns-resize',
                  )}
                  style={edgeStyle}
                >
                  <div className={cn('bg-white border border-primary', isEdge ? 'w-full h-full' : 'w-full h-full rounded-full')} />
                </div>
              )
            })}
        </>
      )}
    </div>
  )
}



interface PhotofolioPageProps {
  projectId: string
}

export function PhotofolioPage({ projectId }: PhotofolioPageProps) {
  const { photos, addPhotos, removePhoto, updatePhoto, clearAll } = usePhotofolioImages(projectId)
  const { layoutMode, setLayoutMode, columns, setColumns, canvasBgColor } = usePhotofolioCanvasSettings(projectId)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [canvasW, setCanvasW] = useState(0)
  const [canvasH, setCanvasH] = useState(0)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const freePositionsRef = useRef<Map<string, { x: number; y: number; width: number; height: number }>>(new Map())
  const isGridMode = layoutMode === 'grid'

  // ResizeObserver for full-screen responsive canvas
  useEffect(() => {
    const el = canvasContainerRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        setCanvasW(width)
        setCanvasH(height)
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Grid layout computation
  useEffect(() => {
    if (!isGridMode || photos.length === 0) return
    const gapRatio = 0.02
    const cellW = (1 - gapRatio * (columns - 1)) / columns
    const cellH = cellW
    const updates: { id: string; x: number; y: number; width: number; height: number }[] = []
    photos.forEach((photo, i) => {
      const r = Math.floor(i / columns)
      const c = i % columns
      updates.push({
        id: photo.id,
        x: c * (cellW + gapRatio),
        y: r * (cellH + gapRatio),
        width: cellW,
        height: cellH,
      })
    })
    updates.forEach(({ id, x, y, width, height }) => updatePhoto(id, { x, y, width, height }))
  }, [isGridMode, photos.length, columns, canvasW, canvasH, updatePhoto])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    addPhotos(acceptedFiles)
  }, [addPhotos])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, multiple: true })

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedId(null)
    }
  }, [])

  const handleLayoutModeToggle = useCallback(() => {
    setLayoutMode((prev) => {
      if (prev === 'free') {
        freePositionsRef.current = new Map()
        photos.forEach((p) => freePositionsRef.current.set(p.id, { x: p.x, y: p.y, width: p.width, height: p.height }))
      } else {
        freePositionsRef.current.forEach((pos, id) => {
          updatePhoto(id, { ...pos })
        })
        freePositionsRef.current = new Map()
      }
      return prev === 'free' ? 'grid' : 'free'
    })
  }, [photos, updatePhoto])

  const handleColumnsChange = useCallback((val: number) => {
    setColumns(Math.max(1, Math.min(8, val)))
  }, [])

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-border/60 bg-card/40 px-4">
        <div className="flex items-center gap-2">
          <Link to="/photofolio" className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            ← Back to Projects
          </Link>
          <span className="text-xs text-muted-foreground">|</span>
          <ImagePlus className="size-4 text-primary" />
          <span className="text-sm font-bold">Photofolio</span>
          <span className="text-xs text-muted-foreground">{photos.length} photo{photos.length !== 1 ? 's' : ''}</span>
        </div>
        <Link to="/photofolio/$projectId/settings" params={{ projectId }} className="flex items-center gap-1.5 rounded-lg border border-border/60 px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          Canvas Settings
        </Link>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-56 shrink-0 border-r border-border/60 bg-card/30 p-4 space-y-5 overflow-y-auto">
          <div>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Upload</h3>
            <div {...getRootProps()} className={cn('flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-6 text-center transition-colors', isDragActive ? 'border-primary/60 bg-primary/10 text-primary' : 'border-border/60 bg-muted/20 text-muted-foreground hover:border-primary/30')}>
              <input {...getInputProps()} />
              <ImagePlus className="size-6" />
              <p className="text-[10px] font-medium">Drop files or click</p>
              <p className="text-[9px] text-muted-foreground/50">Images only</p>
            </div>
          </div>

<div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Layout</h3>
              <div className="flex gap-1 mb-2">
                <button type="button" onClick={handleLayoutModeToggle} className={cn('flex-1 rounded-lg py-1 text-[10px] font-medium transition-colors', isGridMode ? 'bg-primary/20 text-primary' : 'bg-muted/40 text-muted-foreground hover:bg-muted/60')}>
                  {isGridMode ? 'Grid' : 'Free'}
                </button>
              </div>
              {isGridMode && (
                <label className="flex items-center gap-2 text-[10px] text-muted-foreground mb-1.5">
                  Columns
                  <input type="number" min={1} max={8} value={columns} onChange={(e) => handleColumnsChange(parseInt(e.target.value, 10) || 1)} className="h-6 w-14 rounded border border-border text-center text-[10px] text-foreground" />
                </label>
              )}
            </div>

            {photos.length > 0 && (
              <button type="button" onClick={clearAll} className="w-full rounded-lg border border-destructive/30 py-2 text-[10px] font-medium text-destructive hover:bg-destructive/10">
                Clear All ({photos.length})
              </button>
            )}
          </aside>

        <main className="flex-1 overflow-hidden bg-muted/10">
          <div
            ref={canvasContainerRef}
            data-canvas
            onClick={handleCanvasClick}
            className="relative h-full w-full"
            style={{ backgroundColor: canvasBgColor }}
          >
            {photos.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground/40">
                <ImagePlus className="size-12" />
                <p className="text-sm">No photos yet</p>
                <p className="text-[10px]">Upload images from the sidebar to get started</p>
              </div>
            ) : (
              photos.map((photo) => (
                <PhotoBox
                  key={photo.id}
                  photo={photo}
                  canvasW={canvasW}
                  canvasH={canvasH}
                  isSelected={selectedId === photo.id}
                  onSelect={setSelectedId}
                  onRemove={removePhoto}
                  onUpdate={updatePhoto}
                  isGridMode={isGridMode}
                />
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
