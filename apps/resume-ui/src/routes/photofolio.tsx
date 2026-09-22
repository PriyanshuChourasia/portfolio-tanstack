import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { usePhotofolioProjects } from '@/features/photofolio'
import { format } from 'date-fns'

export const Route = createFileRoute('/photofolio')({
  component: PhotofolioLanding,
  head: () => ({
    meta: [
      { title: 'Photofolio — Your Visual Portfolio Projects' },
      { name: 'description', content: 'Create and manage multiple visual portfolio projects.' },
    ],
  }),
})

function PhotofolioLanding() {
  const { list, create, remove } = usePhotofolioProjects()
  const navigate = useNavigate()
  const projects = list()

  const handleCreate = () => {
    const name = prompt('Project name:')
    if (!name?.trim()) return
    const project = create(name.trim())
    navigate({ to: `/photofolio/${project.id}` })
  }

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Delete project "${name}"? This cannot be undone.`)) return
    remove(id)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-8">
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Photofolio</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your visual portfolio projects</p>
          </div>
          <button
            type="button"
            onClick={handleCreate}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            + New Project
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <p className="text-lg font-medium mb-2">No projects yet</p>
            <p className="text-sm mb-4">Create your first project to get started</p>
            <button type="button" onClick={handleCreate} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              Create Your First Project
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div key={project.id} className="group relative rounded-xl border border-border/60 bg-card p-5 transition-shadow hover:shadow-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-bold">{project.name}</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Edited {format(project.updatedAt, 'MMM d, yyyy')}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleDelete(project.id, project.name) }}
                    className="rounded-md px-2 py-1 text-xs text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    Delete
                  </button>
                </div>
                <Link to={`/photofolio/${project.id}` as string} className="absolute inset-0" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
