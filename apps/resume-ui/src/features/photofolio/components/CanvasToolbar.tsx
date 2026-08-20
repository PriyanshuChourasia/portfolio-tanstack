import { memo } from 'react'
import { Grid3x3, Maximize, Trash2, ZoomIn, ZoomOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CANVAS_DEFAULTS } from '../constants'

interface CanvasToolbarProps {
  zoom: number
  showGrid: boolean
  itemCount: number
  hasSelection: boolean
  onZoomIn: () => void
  onZoomOut: () => void
  onResetView: () => void
  onToggleGrid: () => void
  onDeleteSelected: () => void
  onClearAll: () => void
}

export const CanvasToolbar = memo(function CanvasToolbar({
  zoom,
  showGrid,
  itemCount,
  hasSelection,
  onZoomIn,
  onZoomOut,
  onResetView,
  onToggleGrid,
  onDeleteSelected,
  onClearAll,
}: CanvasToolbarProps) {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 rounded-2xl bg-card/90 backdrop-blur-xl border border-border p-1.5 shadow-2xl">
      <ToolbarButton onClick={onZoomOut} title="Zoom out" disabled={zoom <= CANVAS_DEFAULTS.ZOOM_MIN}>
        <ZoomOut className="w-4 h-4" />
      </ToolbarButton>
      <span className="min-w-[4rem] text-center text-xs font-mono text-muted-foreground select-none">{Math.round(zoom * 100)}%</span>
      <ToolbarButton onClick={onZoomIn} title="Zoom in" disabled={zoom >= CANVAS_DEFAULTS.ZOOM_MAX}>
        <ZoomIn className="w-4 h-4" />
      </ToolbarButton>
      <div className="mx-1 h-6 w-px bg-border" />
      <ToolbarButton onClick={onResetView} title="Reset view">
        <Maximize className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={onToggleGrid} title="Toggle grid" active={showGrid}>
        <Grid3x3 className="w-4 h-4" />
      </ToolbarButton>
      <div className="mx-1 h-6 w-px bg-border" />
      <ToolbarButton onClick={onDeleteSelected} title="Delete selected" disabled={!hasSelection}>
        <Trash2 className="w-4 h-4" />
      </ToolbarButton>
      <span className="ml-2 mr-1 text-[10px] text-muted-foreground select-none">{itemCount} items</span>
    </div>
  )
})

function ToolbarButton({ children, onClick, title, disabled = false, active = false }: {
  children: React.ReactNode
  onClick: () => void
  title: string
  disabled?: boolean
  active?: boolean
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200',
        disabled && 'opacity-30 cursor-not-allowed',
        !disabled && !active && 'hover:bg-muted text-muted-foreground hover:text-foreground',
        !disabled && active && 'bg-primary/10 text-primary',
      )}
    >
      {children}
    </button>
  )
}
