import { createFileRoute, Link } from '@tanstack/react-router'
import { PhotofolioPage } from '@/features/photofolio'

export const Route = createFileRoute('/photofolio/$projectId')({
  component: PhotofolioEditor,
  head: () => ({
    meta: [
      { title: 'Photofolio Editor' },
      { name: 'description', content: 'Edit your photofolio project.' },
    ],
  }),
})

function PhotofolioEditor() {
  const { projectId } = Route.useParams()

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-border/60 bg-card/40 px-4">
        <div className="flex items-center gap-2">
          <Link to="/photofolio" className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            ← Back to Projects
          </Link>
          <span className="text-xs text-muted-foreground">|</span>
          <span className="text-sm font-bold">Photofolio</span>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <PhotofolioPage projectId={projectId} />
      </div>
    </div>
  )
}
