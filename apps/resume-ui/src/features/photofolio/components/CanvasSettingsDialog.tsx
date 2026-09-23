import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface CanvasSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  layoutMode: 'free' | 'grid'
  onLayoutModeChange: (mode: 'free' | 'grid') => void
  columns: number
  onColumnsChange: (val: number) => void
  canvasBgColor: string
  onCanvasBgColorChange: (color: string) => void
}

export function CanvasSettingsDialog({
  open,
  onOpenChange,
  layoutMode,
  onLayoutModeChange,
  columns,
  onColumnsChange,
  canvasBgColor,
  onCanvasBgColorChange,
}: CanvasSettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Canvas Settings</DialogTitle>
          <DialogDescription>
            Configure the layout and canvas appearance for this photofolio project.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
              Layout
            </h3>
            <div className="mb-2 flex gap-1 rounded-lg bg-muted/40 p-0.5">
              {(['free', 'grid'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onLayoutModeChange(mode)}
                  className={cn(
                    'flex-1 rounded-md py-1 text-xs font-medium capitalize transition-colors',
                    layoutMode === mode ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-muted/60',
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>
            {layoutMode === 'grid' && (
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                Columns
                <input
                  type="number"
                  min={1}
                  max={8}
                  value={columns}
                  onChange={(e) => onColumnsChange(parseInt(e.target.value, 10) || 1)}
                  className="h-6 w-14 rounded border border-border text-center text-xs text-foreground"
                />
              </label>
            )}
          </div>

          <div>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
              Canvas
            </h3>
            <label className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 text-sm text-muted-foreground">
              Background color
              <input
                type="color"
                value={canvasBgColor}
                onChange={(e) => onCanvasBgColorChange(e.target.value)}
                className="h-7 w-14 cursor-pointer rounded border border-border"
              />
            </label>
          </div>
        </div>

        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  )
}