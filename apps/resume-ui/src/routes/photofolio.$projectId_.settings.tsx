import { createFileRoute, Link } from '@tanstack/react-router'
import { usePhotofolioCanvasSettings } from '@/features/photofolio'

export const Route = createFileRoute('/photofolio/$projectId_/settings')({
  component: CanvasSettingsPage,
  head: () => ({
    meta: [
      { title: 'Canvas Settings — Photofolio' },
      { name: 'description', content: 'Configure canvas appearance for this photofolio project.' },
    ],
  }),
})

function CanvasSettingsPage() {
  const { projectId } = Route.useParams()
  const { canvasBgColor, setCanvasBgColor } = usePhotofolioCanvasSettings(projectId)

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border/60 bg-card/40 px-4">
        <Link to="/photofolio/$projectId" params={{ projectId }} className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          ← Back to Editor
        </Link>
        <span className="text-xs text-muted-foreground">|</span>
        <span className="text-sm font-bold">Canvas Settings</span>
      </header>

      <div className="mx-auto w-full max-w-md p-6 space-y-5">
        <div>
          <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Canvas</h3>
          <label className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 text-sm text-muted-foreground">
            Background color
            <input
              type="color"
              value={canvasBgColor}
              onChange={(e) => setCanvasBgColor(e.target.value)}
              className="h-7 w-14 rounded border border-border cursor-pointer"
            />
          </label>
        </div>
      </div>
    </div>
  )
}
