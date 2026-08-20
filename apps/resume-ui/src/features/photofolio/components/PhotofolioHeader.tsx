import { Camera, Grid3X3, PenTool } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Link } from '@tanstack/react-router'

interface PhotofolioHeaderProps {
  viewMode: 'gallery' | 'canvas'
  onViewModeChange: (mode: 'gallery' | 'canvas') => void
}

export function PhotofolioHeader({ viewMode, onViewModeChange }: PhotofolioHeaderProps) {
  return (
    <header className="h-14 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 gap-4 shrink-0 sticky top-0 z-50">
      <div className="flex items-center gap-3 min-w-0">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20">
            <Camera className="w-4 h-4 text-primary" />
          </div>
          <span className="text-sm font-semibold text-foreground hidden sm:inline">Photofolio</span>
        </Link>

        <div className="h-5 w-px bg-border hidden sm:block" />

        <nav className="hidden sm:flex items-center gap-1">
          <button
            onClick={() => onViewModeChange('gallery')}
            className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200', viewMode === 'gallery' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50')}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            Gallery
          </button>
          <button
            onClick={() => onViewModeChange('canvas')}
            className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200', viewMode === 'canvas' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50')}
          >
            <PenTool className="w-3.5 h-3.5" />
            Canvas
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex sm:hidden items-center gap-1 bg-muted/50 rounded-lg p-0.5">
          <button onClick={() => onViewModeChange('gallery')} className={cn('p-1.5 rounded-md transition-colors', viewMode === 'gallery' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground')}>
            <Grid3X3 className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onViewModeChange('canvas')} className={cn('p-1.5 rounded-md transition-colors', viewMode === 'canvas' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground')}>
            <PenTool className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={() => onViewModeChange(viewMode === 'gallery' ? 'canvas' : 'gallery')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-lg"
        >
          <PenTool className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{viewMode === 'gallery' ? 'Open Canvas' : 'Back to Gallery'}</span>
          <span className="sm:hidden">{viewMode === 'gallery' ? 'Canvas' : 'Gallery'}</span>
        </button>
      </div>
    </header>
  )
}
