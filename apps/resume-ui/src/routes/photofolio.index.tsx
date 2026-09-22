import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { usePhotofolioProjects } from '@/features/photofolio'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { format } from 'date-fns'
import { useState } from 'react'

export const Route = createFileRoute('/photofolio/')({
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

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newName, setNewName] = useState('')

  const handleCreate = () => {
    const trimmed = newName.trim()
    if (!trimmed) return
    const project = create(trimmed)
    setNewName('')
    setIsCreateOpen(false)
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
          <Button onClick={() => setIsCreateOpen(true)}>
            + New Project
          </Button>
        </div>

        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <p className="text-lg font-medium mb-2">No projects yet</p>
            <p className="text-sm mb-4">Create your first project to get started</p>
            <Button onClick={() => setIsCreateOpen(true)}>
              Create Your First Project
            </Button>
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

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>Give your project a name to get started.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <Label htmlFor="project-name">Project name</Label>
            <Input
              id="project-name"
              placeholder="My Photofolio"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleCreate() }}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setNewName(''); setIsCreateOpen(false) }}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!newName.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
