import { useCallback, useRef, useState, useEffect, useMemo } from 'react'
import { useDropzone } from 'react-dropzone'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { ChevronRight, ImagePlus, LayoutTemplate, Plus, Settings, Trash2, X, ZoomIn, ZoomOut } from 'lucide-react'
import {
  HOME_PAGE_ID,
  photoPageId,
  usePhotofolioImages,
  usePhotofolioCanvasSettings,
  type CanvasBand,
  type HeaderLink,
  type Photo,
} from '../usePhotofolioImages'
import { CanvasSettingsDialog } from './CanvasSettingsDialog'
import {
  BandPickerDialog,
  CanvasFooter,
  CanvasHeader,
  DEFAULT_HEADER_LINKS,
  HeaderLinksEditor,
  linkHref,
  resolveFooterContent,
  headerHasLinks,
  type BandKind,
  type FooterVariant,
  type HeaderVariant,
} from './HeaderTemplates'
import { PagesPanel } from './PagesPanel'
import { FooterEditor } from './FooterEditor'
import { SectionAddMenu, type SectionTemplate } from './SectionAddMenu'
import { ResizeHandles } from './ResizeHandles'
import { TextBlockBox } from './TextBlockBox'
import { useCanvasBlocks, type ContentBlock } from '../useCanvasBlocks'
import { MIN_SIZE, clamp, resizeRect, type Rect, type ResizeHandle } from '../canvasGeometry'

const MIN_ZOOM = 1
const MAX_ZOOM = 3
const GRID_GAP = 12
const GRID_PADDING = 12

interface GridLayout {
  cols: number
  cellPx: number
  rects: Rect[]
}

interface DragState {
  type: 'move' | 'resize' | 'pan'
  grid: boolean
  moved: boolean
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

/** Dark or light text depending on the canvas background, so header/footer stay readable. */
function readableTextColor(hex: string): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex)
  if (!m) return '#111827'
  const n = parseInt(m[1], 16)
  const luminance = (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255
  return luminance > 0.6 ? '#111827' : '#ffffff'
}

function BandControl({
  label,
  band,
  onChange,
  onPickStyle,
  summary,
  children,
}: {
  label: string
  band: CanvasBand
  onChange: (band: CanvasBand) => void
  /** When set, adding opens a style picker instead of enabling directly. */
  onPickStyle?: () => void
  /** Shown next to the label while collapsed. */
  summary?: string
  /** Extra settings shown under the text input while expanded. */
  children?: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)
  const isOpen = band.enabled && !collapsed

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[10px] font-medium text-muted-foreground">
        {band.enabled ? (
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-expanded={isOpen}
            className="flex min-w-0 flex-1 items-center gap-1 rounded text-left transition-colors hover:text-foreground"
          >
            <ChevronRight className={cn('size-3 shrink-0 transition-transform duration-200', isOpen && 'rotate-90')} />
            {label}
            {collapsed && summary && <span className="truncate font-normal text-muted-foreground/60">· {summary}</span>}
          </button>
        ) : (
          <span className="pl-4">{label}</span>
        )}
        {band.enabled ? (
          <div className="flex items-center gap-0.5">
          {onPickStyle && (
            <button
              type="button"
              onClick={onPickStyle}
              aria-label={`Change ${label.toLowerCase()} style`}
              title="Change style"
              className="flex size-5 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            >
              <LayoutTemplate className="size-3" />
            </button>
          )}
          <button
            type="button"
            onClick={() => onChange({ ...band, enabled: false })}
            aria-label={`Remove ${label.toLowerCase()}`}
            className="flex size-5 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="size-3" />
          </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => (onPickStyle ? onPickStyle() : onChange({ ...band, enabled: true }))}
            aria-label={`Add ${label.toLowerCase()}`}
            className="flex size-5 items-center justify-center rounded-md border border-border/60 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
          >
            <Plus className="size-3" />
          </button>
        )}
      </div>
      {isOpen && (
        <div className="space-y-2 pl-4">
          <input
            type="text"
            value={band.text}
            placeholder={`${label} text`}
            onChange={(e) => onChange({ ...band, text: e.target.value })}
            className="h-7 w-full rounded border border-border bg-background px-2 text-[10px] text-foreground"
          />
          {children}
        </div>
      )}
    </div>
  )
}

/** Square cells that fit every photo inside the canvas. */
function computeGridLayout(count: number, columns: number, canvasW: number, canvasH: number): GridLayout | null {
  if (!count || !canvasW || !canvasH) return null
  const cols = Math.max(1, Math.min(columns, count))
  const rows = Math.ceil(count / cols)
  const availW = canvasW - GRID_PADDING * 2 - GRID_GAP * (cols - 1)
  const availH = canvasH - GRID_PADDING * 2 - GRID_GAP * (rows - 1)
  const cellPx = Math.max(MIN_SIZE, Math.min(availW / cols, availH / rows))
  const rects = Array.from({ length: count }, (_, i) => {
    const c = i % cols
    const r = Math.floor(i / cols)
    return {
      x: (GRID_PADDING + c * (cellPx + GRID_GAP)) / canvasW,
      y: (GRID_PADDING + r * (cellPx + GRID_GAP)) / canvasH,
      width: cellPx / canvasW,
      height: cellPx / canvasH,
    }
  })
  return { cols, cellPx, rects }
}

function PhotoBox({
  photo,
  rect,
  canvasW,
  canvasH,
  isSelected,
  onSelect,
  onRemove,
  onUpdate,
  onGridDrop,
  isGridMode,
}: {
  photo: Photo
  rect: Rect
  canvasW: number
  canvasH: number
  isSelected: boolean
  onSelect: (id: string) => void
  onRemove: (id: string) => void
  onUpdate: (id: string, updates: Partial<Pick<Photo, 'x' | 'y' | 'width' | 'height' | 'zoom' | 'offsetX' | 'offsetY'>>) => void
  onGridDrop: (id: string, clientX: number, clientY: number) => void
  isGridMode: boolean
}) {
  const boxRef = useRef<HTMLDivElement>(null)
  const dragStateRef = useRef<DragState | null>(null)
  // Pixel offset while dragging a grid cell; the photo snaps to its new slot on drop.
  const [gridDrag, setGridDrag] = useState<{ dx: number; dy: number } | null>(null)

  const boxPxW = rect.width * canvasW
  const boxPxH = rect.height * canvasH
  const imgPxW = boxPxW * photo.zoom
  const imgPxH = boxPxH * photo.zoom
  const excessW = imgPxW - boxPxW
  const excessH = imgPxH - boxPxH
  const canPan = isSelected && photo.zoom > 1

  const handlePointerDown = useCallback((e: React.PointerEvent, mode: DragState['type'], handle?: ResizeHandle) => {
    if (e.button !== 0) return
    e.stopPropagation()
    e.preventDefault()
    onSelect(photo.id)
    dragStateRef.current = {
      type: mode,
      grid: isGridMode,
      moved: false,
      photoId: photo.id,
      startX: e.clientX,
      startY: e.clientY,
      origX: rect.x,
      origY: rect.y,
      origW: rect.width,
      origH: rect.height,
      origOffsetX: photo.offsetX,
      origOffsetY: photo.offsetY,
      origZoom: photo.zoom,
      handle,
    }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }, [photo, rect, isGridMode, onSelect])

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const state = dragStateRef.current
      if (!state || !canvasW || !canvasH) return
      const pxDx = e.clientX - state.startX
      const pxDy = e.clientY - state.startY
      if (!state.moved && Math.hypot(pxDx, pxDy) < 3) return
      state.moved = true
      const dx = pxDx / canvasW
      const dy = pxDy / canvasH

      if (state.type === 'move' && state.grid) {
        setGridDrag({ dx: pxDx, dy: pxDy })
      } else if (state.type === 'move') {
        onUpdate(state.photoId, {
          x: clamp(state.origX + dx, 0, 1 - state.origW),
          y: clamp(state.origY + dy, 0, 1 - state.origH),
        })
      } else if (state.type === 'resize' && state.handle) {
        const orig = { x: state.origX, y: state.origY, width: state.origW, height: state.origH }
        onUpdate(state.photoId, resizeRect(orig, state.handle, dx, dy, canvasW, canvasH))
      } else if (state.type === 'pan') {
        // Offsets are 0..1 fractions of the image's overflow; dragging right reveals the left side.
        const exW = state.origW * canvasW * (state.origZoom - 1)
        const exH = state.origH * canvasH * (state.origZoom - 1)
        onUpdate(state.photoId, {
          offsetX: exW > 0 ? clamp(state.origOffsetX - pxDx / exW, 0, 1) : 0,
          offsetY: exH > 0 ? clamp(state.origOffsetY - pxDy / exH, 0, 1) : 0,
        })
      }
    }

    const onUp = (e: PointerEvent) => {
      const state = dragStateRef.current
      dragStateRef.current = null
      if (state?.grid && state.type === 'move' && state.moved) {
        onGridDrop(state.photoId, e.clientX, e.clientY)
      }
      setGridDrag(null)
    }

    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', onUp)
    document.addEventListener('pointercancel', onUp)
    return () => {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', onUp)
      document.removeEventListener('pointercancel', onUp)
    }
  }, [onUpdate, onGridDrop, canvasW, canvasH])

  const handleZoom = useCallback((delta: number) => {
    const newZoom = clamp(photo.zoom + delta, MIN_ZOOM, MAX_ZOOM)
    onUpdate(photo.id, {
      zoom: newZoom,
      offsetX: newZoom > 1 ? photo.offsetX : 0,
      offsetY: newZoom > 1 ? photo.offsetY : 0,
    })
  }, [photo, onUpdate])

  // React's onWheel is passive, so preventDefault only works on a native listener.
  const handleZoomRef = useRef(handleZoom)
  handleZoomRef.current = handleZoom
  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()
      handleZoomRef.current(e.deltaY > 0 ? -0.1 : 0.1)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  const stopPointer = (e: React.PointerEvent) => e.stopPropagation()

  const boxStyle: React.CSSProperties = {
    left: rect.x * canvasW,
    top: rect.y * canvasH,
    width: boxPxW,
    height: boxPxH,
    touchAction: 'none',
    transform: gridDrag ? `translate(${gridDrag.dx}px, ${gridDrag.dy}px)` : undefined,
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
      ref={boxRef}
      data-photo-box
      onClick={(e) => { e.stopPropagation(); onSelect(photo.id) }}
      onPointerDown={(e) => handlePointerDown(e, canPan ? 'pan' : 'move')}
      className={cn(
        'absolute select-none overflow-hidden border-2 rounded-lg shadow-lg',
        canPan ? 'cursor-grab active:cursor-grabbing' : 'cursor-move',
        isGridMode && !gridDrag && 'transition-[left,top,width,height] duration-200',
        gridDrag ? 'z-40 opacity-80 shadow-2xl' : isSelected && 'z-10',
        isSelected ? 'border-primary ring-2 ring-primary/30' : 'border-border/60 hover:border-primary/40',
      )}
      style={boxStyle}
    >
      <img src={photo.url} alt={photo.name} draggable={false} className="pointer-events-none absolute max-w-none" style={imgStyle} />

      {isSelected && (
        <>
          <div
            onPointerDown={(e) => handlePointerDown(e, 'move')}
            className="absolute top-1 left-1 z-20 flex cursor-move items-center gap-1 bg-black/50 rounded px-1.5 py-0.5"
          >
            <span className="max-w-24 truncate text-[9px] font-bold text-white">{photo.name}</span>
            <span className="text-[9px] font-bold text-white/70">{photo.zoom.toFixed(2)}x</span>
            <button type="button" onPointerDown={stopPointer} onClick={(e) => { e.stopPropagation(); handleZoom(-0.25) }} className="flex h-4 w-4 items-center justify-center rounded bg-black/60 text-white hover:bg-blue-600">
              <ZoomOut className="size-2.5" />
            </button>
            <button type="button" onPointerDown={stopPointer} onClick={(e) => { e.stopPropagation(); handleZoom(0.25) }} className="flex h-4 w-4 items-center justify-center rounded bg-black/60 text-white hover:bg-blue-600">
              <ZoomIn className="size-2.5" />
            </button>
            <button type="button" onPointerDown={stopPointer} onClick={(e) => { e.stopPropagation(); onRemove(photo.id) }} className="flex h-4 w-4 items-center justify-center rounded bg-black/60 text-white hover:bg-red-600">
              <Trash2 className="size-2.5" />
            </button>
          </div>

          {canPan && (
            <div className="pointer-events-none absolute bottom-1 left-1 z-20 bg-black/50 rounded px-1.5 py-0.5">
              <span className="text-[8px] text-white/70">Drag image to pan · drag title to move</span>
            </div>
          )}

          {!isGridMode && <ResizeHandles onStart={(e, handle) => handlePointerDown(e, 'resize', handle)} />}
        </>
      )}
    </div>
  )
}

/** One photo canvas: a Page, or a single SPA section. Owns its grid layout and drag-to-reorder hit testing. */
function PhotoSurface({
  photos,
  blocks,
  width,
  height,
  isGridMode,
  columns,
  selectedId,
  onSelectPhoto,
  onRemove,
  onUpdate,
  onReorder,
  onSelectBlock,
  onUpdateBlock,
  onRemoveBlock,
  onBackgroundClick,
  emptyTitle,
  emptyAction,
  addAction,
  className,
  style,
  children,
}: {
  photos: Photo[]
  blocks: ContentBlock[]
  width: number
  height: number
  isGridMode: boolean
  columns: number
  selectedId: string | null
  onSelectPhoto: (id: string) => void
  onRemove: (id: string) => void
  onUpdate: React.ComponentProps<typeof PhotoBox>['onUpdate']
  onReorder: (id: string, targetId: string) => void
  onSelectBlock: (id: string) => void
  onUpdateBlock: React.ComponentProps<typeof TextBlockBox>['onUpdate']
  onRemoveBlock: (id: string) => void
  onBackgroundClick: () => void
  emptyTitle: string
  /** Replaces the default empty-state hint (e.g. the SPA section add menu). */
  emptyAction?: React.ReactNode
  /** Shown at the bottom of the surface once it has content (e.g. a compact add menu). */
  addAction?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}) {
  const surfaceRef = useRef<HTMLDivElement>(null)
  const isEmpty = photos.length === 0 && blocks.length === 0

  // Grid positions are derived, never written to the photos, so free-mode positions survive toggling.
  const gridLayout = useMemo(
    () => (isGridMode ? computeGridLayout(photos.length, columns, width, height) : null),
    [isGridMode, photos.length, columns, width, height],
  )

  const handleGridDrop = useCallback((id: string, clientX: number, clientY: number) => {
    const el = surfaceRef.current
    if (!el || !gridLayout) return
    const bounds = el.getBoundingClientRect()
    const step = gridLayout.cellPx + GRID_GAP
    const col = clamp(Math.floor((clientX - bounds.left - GRID_PADDING) / step), 0, gridLayout.cols - 1)
    const row = Math.max(0, Math.floor((clientY - bounds.top - GRID_PADDING) / step))
    const target = photos[clamp(row * gridLayout.cols + col, 0, photos.length - 1)]
    if (target) onReorder(id, target.id)
  }, [gridLayout, photos, onReorder])

  return (
    <div
      ref={surfaceRef}
      data-canvas
      onClick={(e) => { if (e.target === e.currentTarget) onBackgroundClick() }}
      className={cn('relative w-full overflow-hidden', className)}
      style={style}
    >
      {children}
      {isEmpty && emptyAction ? (
        <div className="pointer-events-none flex h-full items-center justify-center">{emptyAction}</div>
      ) : isEmpty ? (
        <div className="pointer-events-none flex h-full flex-col items-center justify-center gap-3 text-muted-foreground/40">
          <ImagePlus className="size-12" />
          <p className="text-sm">Nothing on {emptyTitle} yet</p>
          <p className="text-[10px]">Select it and upload images from the sidebar</p>
        </div>
      ) : width > 0 && (
        <>
        {photos.map((photo, i) => (
          <PhotoBox
            key={photo.id}
            photo={photo}
            rect={gridLayout?.rects[i] ?? photo}
            canvasW={width}
            canvasH={height}
            isSelected={selectedId === photo.id}
            onSelect={onSelectPhoto}
            onRemove={onRemove}
            onUpdate={onUpdate}
            onGridDrop={handleGridDrop}
            isGridMode={isGridMode}
          />
        ))}
        {blocks.map((block) => (
          <TextBlockBox
            key={block.id}
            block={block}
            canvasW={width}
            canvasH={height}
            isSelected={selectedId === block.id}
            onSelect={onSelectBlock}
            onUpdate={onUpdateBlock}
            onRemove={onRemoveBlock}
          />
        ))}
        {addAction && (
          <div className="pointer-events-none absolute bottom-4 left-1/2 z-30 -translate-x-1/2">{addAction}</div>
        )}
        </>
      )}
    </div>
  )
}

interface PhotofolioPageProps {
  projectId: string
}

export function PhotofolioPage({ projectId }: PhotofolioPageProps) {
  const { photos, addPhotos, removePhoto, updatePhoto, reorderPhoto, clearAll } = usePhotofolioImages(projectId)
  const { blocks, addBlocks, updateBlock, removeBlock, clearBlocks } = useCanvasBlocks(projectId)
  const { layoutMode, setLayoutMode, columns, setColumns, canvasBgColor, setCanvasBgColor, header, setHeader, footer, setFooter } = usePhotofolioCanvasSettings(projectId)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [pickerKind, setPickerKind] = useState<BandKind | null>(null)
  const [activePageId, setActivePageId] = useState(HOME_PAGE_ID)
  const [canvasW, setCanvasW] = useState(0)
  const [canvasH, setCanvasH] = useState(0)
  const viewportRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef(new Map<string, HTMLElement>())
  const pendingScrollRef = useRef<string | null>(null)
  const templateInputRef = useRef<HTMLInputElement>(null)
  const pendingTemplateRef = useRef<{ sectionId: string; template: SectionTemplate } | null>(null)
  const isGridMode = layoutMode === 'grid'
  const bandTextColor = readableTextColor(canvasBgColor)
  // Header and footer share one list of site links; each one is a Page or an SPA section with its own canvas.
  const headerLinks = header.links ?? DEFAULT_HEADER_LINKS
  const footerContent = resolveFooterContent(footer)
  const activeLink = headerLinks.find((l) => l.id === activePageId)
  // SPA links render as stacked sections on one scrolling canvas; Pages each get a canvas of their own.
  const spaLinks = useMemo(() => headerLinks.filter((l) => l.type === 'spa'), [headerLinks])
  const isSpaView = activeLink?.type === 'spa'
  const photosByPage = useMemo(() => {
    const map = new Map<string, Photo[]>()
    photos.forEach((p) => {
      const id = photoPageId(p)
      map.set(id, [...(map.get(id) ?? []), p])
    })
    return map
  }, [photos])
  const pagePhotos = photosByPage.get(activePageId) ?? []
  const blocksByPage = useMemo(() => {
    const map = new Map<string, ContentBlock[]>()
    blocks.forEach((b) => map.set(b.pageId, [...(map.get(b.pageId) ?? []), b]))
    return map
  }, [blocks])
  const pageBlocks = blocksByPage.get(activePageId) ?? []
  // Photos plus content blocks on each page/section.
  const photoCounts = useMemo(() => {
    const counts = new Map<string, number>()
    photosByPage.forEach((list, id) => counts.set(id, list.length))
    blocksByPage.forEach((list, id) => counts.set(id, (counts.get(id) ?? 0) + list.length))
    return counts
  }, [photosByPage, blocksByPage])
  const clearPage = useCallback((pageId: string) => {
    clearAll(pageId)
    clearBlocks(pageId)
  }, [clearAll, clearBlocks])

  // Fall back to the home canvas when the active page/section is deleted.
  useEffect(() => {
    if (activePageId !== HOME_PAGE_ID && !activeLink) setActivePageId(HOME_PAGE_ID)
  }, [activePageId, activeLink])

  const selectPage = useCallback((id: string) => {
    setActivePageId(id)
    setSelectedId(null)
    pendingScrollRef.current = id
  }, [])

  // Scroll an SPA section into view once it's selected (and mounted, for newly added sections).
  useEffect(() => {
    const id = pendingScrollRef.current
    if (!id || !isSpaView) return
    pendingScrollRef.current = null
    sectionRefs.current.get(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [activePageId, isSpaView, spaLinks])

  // Scroll spy: the section filling most of the viewport becomes the active one.
  const handleViewportScroll = useCallback(() => {
    const el = viewportRef.current
    if (!el || !isSpaView || !canvasH || pendingScrollRef.current) return
    const link = spaLinks[clamp(Math.round(el.scrollTop / canvasH), 0, spaLinks.length - 1)]
    if (link && link.id !== activePageId) setActivePageId(link.id)
  }, [isSpaView, canvasH, spaLinks, activePageId])

  // Section add menu: remember the target and template, then let the user choose files.
  // Text-only templates are added right away; ones with photos wait for the files so nothing is half-added on cancel.
  const handlePickTemplate = useCallback((sectionId: string, template: SectionTemplate) => {
    setActivePageId(sectionId)
    if (!template.photos) {
      if (template.blocks) addBlocks(template.blocks, sectionId)
      return
    }
    const input = templateInputRef.current
    if (!input) return
    pendingTemplateRef.current = { sectionId, template }
    input.multiple = template.photos.multiple
    input.value = ''
    input.click()
  }, [addBlocks])

  const handleTemplateFiles = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const pending = pendingTemplateRef.current
    pendingTemplateRef.current = null
    const files = Array.from(e.target.files ?? [])
    if (!pending || files.length === 0) return
    addPhotos(files, pending.sectionId, pending.template.photos?.place)
    if (pending.template.blocks) addBlocks(pending.template.blocks, pending.sectionId)
  }, [addPhotos, addBlocks])

  const handleSelectPhoto = useCallback((id: string) => {
    setSelectedId(id)
    const photo = photos.find((p) => p.id === id)
    if (photo) setActivePageId(photoPageId(photo))
  }, [photos])

  const handleSelectBlock = useCallback((id: string) => {
    setSelectedId(id)
    const block = blocks.find((b) => b.id === id)
    if (block) setActivePageId(block.pageId)
  }, [blocks])

  /** Confirms before dropping links that still have photos, then removes those photos. Returns false if cancelled. */
  const confirmLinkRemoval = useCallback((links: HeaderLink[]) => {
    const removed = headerLinks.filter((l) => !links.some((n) => n.id === l.id) && photoCounts.get(l.id))
    if (removed.length === 0) return true
    const names = removed.map((l) => `"${l.label}"`).join(', ')
    if (!window.confirm(`Delete ${names} and everything on it?`)) return false
    removed.forEach((l) => clearPage(l.id))
    return true
  }, [headerLinks, photoCounts, clearPage])

  const setSiteLinks = useCallback((links: HeaderLink[]) => {
    if (confirmLinkRemoval(links)) setHeader({ ...header, links })
  }, [header, setHeader, confirmLinkRemoval])

  // ResizeObserver for full-screen responsive canvas; each page or SPA section is one viewport in size.
  useEffect(() => {
    const el = viewportRef.current
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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    addPhotos(acceptedFiles, activePageId)
  }, [addPhotos, activePageId])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, multiple: true })

  const surfaceProps = {
    width: canvasW,
    height: canvasH,
    isGridMode,
    columns,
    selectedId,
    onSelectPhoto: handleSelectPhoto,
    onRemove: removePhoto,
    onUpdate: updatePhoto,
    onReorder: reorderPhoto,
    onSelectBlock: handleSelectBlock,
    onUpdateBlock: updateBlock,
    onRemoveBlock: removeBlock,
  }

  const handleColumnsChange = useCallback((val: number) => {
    setColumns(Math.max(1, Math.min(8, val)))
  }, [setColumns])

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
          <span className="text-xs text-muted-foreground">/</span>
          <span className="text-xs font-semibold">{activeLink?.label || 'Home'}</span>
          <span className="rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-medium uppercase text-muted-foreground">
            {activeLink?.type === 'page' ? 'Page' : 'SPA'}
          </span>
          <span className="text-xs text-muted-foreground">{pagePhotos.length} photo{pagePhotos.length !== 1 ? 's' : ''}</span>
        </div>
        <button type="button" onClick={() => setSettingsOpen(true)} className="flex items-center gap-1.5 rounded-lg border border-border/60 px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <Settings className="size-3.5" />
          Canvas Settings
        </button>
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
            <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Header & Footer</h3>
            <div className="space-y-2.5">
              <BandControl
                label="Header"
                band={header}
                onChange={setHeader}
                onPickStyle={() => setPickerKind('header')}
                summary={headerHasLinks(header.variant) ? `${headerLinks.length} link${headerLinks.length !== 1 ? 's' : ''}` : header.text}
              >
                {headerHasLinks(header.variant) && (
                  <div className="space-y-1.5">
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/60">Header links</p>
                    <HeaderLinksEditor compact links={headerLinks} onChange={setSiteLinks} />
                  </div>
                )}
              </BandControl>
              <BandControl
                label="Footer"
                band={footer}
                onChange={setFooter}
                onPickStyle={() => setPickerKind('footer')}
                summary={footer.text}
              >
                <FooterEditor footer={footer} onChange={setFooter} />
              </BandControl>
            </div>
          </div>

          <PagesPanel type="page" links={headerLinks} activeId={activePageId} photoCounts={photoCounts} onSelect={selectPage} onLinksChange={setSiteLinks} />
          <PagesPanel type="spa" links={headerLinks} activeId={activePageId} photoCounts={photoCounts} onSelect={selectPage} onLinksChange={setSiteLinks} />

          {pagePhotos.length + pageBlocks.length > 0 && (
            <button type="button" onClick={() => clearPage(activePageId)} className="w-full rounded-lg border border-destructive/30 py-2 text-[10px] font-medium text-destructive hover:bg-destructive/10">
              Clear {activeLink?.label || 'Home'} ({pagePhotos.length + pageBlocks.length})
            </button>
          )}
        </aside>

        <main className="flex flex-1 flex-col overflow-hidden" style={{ backgroundColor: canvasBgColor, color: bandTextColor }}>
          {header.enabled && (
            <div className="shrink-0">
              <CanvasHeader
                variant={header.variant as HeaderVariant | undefined}
                text={header.text}
                links={headerLinks}
                activeLinkId={activePageId}
                onLinkClick={selectPage}
              />
            </div>
          )}
          <input ref={templateInputRef} type="file" accept="image/*" className="hidden" onChange={handleTemplateFiles} />
          <div
            ref={viewportRef}
            onScroll={handleViewportScroll}
            className={cn('relative min-h-0 w-full flex-1', isSpaView ? 'custom-scrollbar overflow-y-auto' : 'overflow-hidden')}
          >
            {isSpaView ? (
              spaLinks.map((link) => (
                <section
                  key={link.id}
                  ref={(el) => { if (el) sectionRefs.current.set(link.id, el); else sectionRefs.current.delete(link.id) }}
                  className={cn(
                    'relative border-b border-dashed border-current/20 last:border-b-0',
                    link.id === activePageId && 'outline-2 -outline-offset-2 outline-primary/40',
                  )}
                >
                  <PhotoSurface
                    {...surfaceProps}
                    photos={photosByPage.get(link.id) ?? []}
                    blocks={blocksByPage.get(link.id) ?? []}
                    emptyTitle={link.label || 'this section'}
                    emptyAction={
                      <SectionAddMenu sectionName={link.label || 'this section'} onPick={(template) => handlePickTemplate(link.id, template)} />
                    }
                    addAction={
                      <SectionAddMenu
                        variant="compact"
                        sectionName={link.label || 'this section'}
                        onPick={(template) => handlePickTemplate(link.id, template)}
                      />
                    }
                    style={{ height: canvasH }}
                    onBackgroundClick={() => { setSelectedId(null); setActivePageId(link.id) }}
                  >
                    <span className="pointer-events-none absolute top-3 right-3 rounded-full bg-current/10 px-2 py-0.5 text-[10px] font-medium opacity-70">
                      {link.label || 'Untitled'} · {linkHref(link)}
                    </span>
                  </PhotoSurface>
                </section>
              ))
            ) : (
              <PhotoSurface
                {...surfaceProps}
                photos={pagePhotos}
                blocks={pageBlocks}
                emptyTitle={activeLink?.label || 'Home'}
                className="h-full"
                onBackgroundClick={() => setSelectedId(null)}
              />
            )}
          </div>
          {footer.enabled && (
            <div className="shrink-0">
              <CanvasFooter
                variant={footer.variant as FooterVariant | undefined}
                text={footer.text}
                links={headerLinks}
                footerContent={footerContent}
                activeLinkId={activePageId}
                onLinkClick={selectPage}
              />
            </div>
          )}
        </main>
      </div>

      <BandPickerDialog
        kind={pickerKind ?? 'header'}
        open={pickerKind !== null}
        onOpenChange={(open) => { if (!open) setPickerKind(null) }}
        selected={(() => {
          const band = pickerKind === 'footer' ? footer : header
          return band.enabled ? band.variant ?? (pickerKind === 'footer' ? 'simple' : 'centered') : undefined
        })()}
        text={pickerKind === 'footer' ? footer.text : header.text}
        links={headerLinks}
        footerContent={footerContent}
        bgColor={canvasBgColor}
        textColor={bandTextColor}
        onApply={(variant, links) => {
          if (!confirmLinkRemoval(links)) return
          // Links live on the header; apply them first so a footer pick doesn't overwrite them.
          if (pickerKind === 'footer') {
            setHeader({ ...header, links })
            setFooter({ ...footer, enabled: true, variant })
          } else {
            setHeader({ ...header, enabled: true, variant, links })
          }
          setPickerKind(null)
        }}
      />

      <CanvasSettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        layoutMode={layoutMode}
        onLayoutModeChange={setLayoutMode}
        columns={columns}
        onColumnsChange={handleColumnsChange}
        canvasBgColor={canvasBgColor}
        onCanvasBgColorChange={setCanvasBgColor}
      />
    </div>
  )
}
