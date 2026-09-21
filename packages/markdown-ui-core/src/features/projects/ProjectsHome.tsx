import { useState, useEffect } from 'react'
import { Plus, FileText, Trash2, FolderOpen, FolderPlus } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Dialog } from '../../components/ui/dialog'
import { useStorage } from '../../lib/context'
import { timeAgo } from '../../lib/utils'
import type { ProjectMeta, UserConfig } from '../../lib/types'

interface ProjectsHomeProps {
  onSelectProject: (id: string, name: string) => void
}

export function ProjectsHome({ onSelectProject }: ProjectsHomeProps) {
  const adapter = useStorage()
  const [projects, setProjects] = useState<ProjectMeta[]>([])
  const [location, setLocation] = useState<string | null>(null)
  const [configCreatedAt, setConfigCreatedAt] = useState<string | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [newName, setNewName] = useState('')
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [pickingFolder, setPickingFolder] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      let projects_: ProjectMeta[] = []
      let cfg: UserConfig | null = null
      try {
        projects_ = await adapter.listProjects()
      } catch {
        projects_ = []
      }
      try {
        cfg = await adapter.readConfig()
      } catch {
        cfg = null
      }
      if (cancelled) return
      setProjects(projects_)
      setLocation(cfg?.locationLabel ?? adapter.getDefaultLocationLabel())
      setConfigCreatedAt(cfg?.createdAt ?? null)
    })()
    return () => {
      cancelled = true
    }
  }, [adapter])

  const handlePickFolder = async () => {
    setPickingFolder(true)
    try {
      const path = await adapter.pickProjectFolder()
      if (path) {
        setSelectedPath(path)
      }
    } catch {
      // ignore picker errors
    } finally {
      setPickingFolder(false)
    }
  }

  const handleCreate = async () => {
    if (!newName.trim() || !selectedPath) return
    const cfg: UserConfig = { locationLabel: location ?? '', createdAt: configCreatedAt ?? new Date().toISOString() }
    await adapter.writeConfig(cfg)
    setConfigCreatedAt(cfg.createdAt)
    const entry = await adapter.createProject(newName.trim(), selectedPath)
    setNewName('')
    setSelectedPath(null)
    setShowDialog(false)
    onSelectProject(entry.id, entry.name)
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    await adapter.deleteProject(id)
    setProjects((prev) => prev.filter((p) => p.id !== id))
  }

  const addProjectDialog = () => {
    if (!showDialog) return null
    const canCreate = newName.trim().length > 0 && selectedPath !== null && selectedPath !== ''
    return (
      <Dialog open={showDialog} onClose={() => { setShowDialog(false); setSelectedPath(null) }}>
        <h3 className="text-lg font-semibold mb-4">Add Project</h3>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleCreate()
          }}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring mb-4"
          placeholder="Project name"
          autoFocus
        />
        <div className="flex flex-col items-start gap-2 w-full mb-4">
          <label className="text-sm text-muted-foreground">Choose Folder</label>
          <div className="flex w-full gap-2">
            <input
              type="text"
              value={selectedPath ?? ''}
              readOnly
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="No folder chosen"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handlePickFolder}
              disabled={pickingFolder}
            >
              <FolderPlus className="h-4 w-4 mr-1" />
              {pickingFolder ? 'Picking...' : 'Choose'}
            </Button>
          </div>
          {selectedPath && (
            <p className="text-xs text-muted-foreground/70 truncate w-full">{selectedPath}</p>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => { setShowDialog(false); setSelectedPath(null) }}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!canCreate}>
            Create
          </Button>
        </div>
      </Dialog>
    )
  }

  const emptyStateCard = () => {
    const nameFilled = newName.trim().length > 0
    const folderPicked = selectedPath !== null && selectedPath !== ''
    const canCreate = nameFilled && folderPicked

    const handleCreateFirstProject = async () => {
      if (!canCreate) return
      const cfg: UserConfig = { locationLabel: location ?? '', createdAt: configCreatedAt ?? new Date().toISOString() }
      await adapter.writeConfig(cfg)
      setConfigCreatedAt(cfg.createdAt)
      const entry = await adapter.createProject(newName.trim(), selectedPath as string)
      onSelectProject(entry.id, entry.name)
    }

    return (
      <div className="max-w-md mx-auto rounded-lg border border-border bg-card p-8">
        <div className="flex flex-col items-center text-center">
          <FolderOpen className="h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-6">No projects yet</p>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring mb-4"
            placeholder="Project name"
          />
          <div className="flex flex-col items-start gap-2 w-full mb-6">
            <label className="text-sm text-muted-foreground">Choose Folder</label>
            <div className="flex w-full gap-2">
              <input
                type="text"
                value={selectedPath ?? ''}
                readOnly
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="No folder chosen"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handlePickFolder}
                disabled={pickingFolder}
              >
                <FolderPlus className="h-4 w-4 mr-1" />
                {pickingFolder ? 'Picking...' : 'Choose'}
              </Button>
            </div>
            {selectedPath && (
              <p className="text-xs text-muted-foreground/70 truncate w-full">{selectedPath}</p>
            )}
          </div>
          <Button onClick={handleCreateFirstProject} disabled={!canCreate} className="w-full">
            Create Project
          </Button>
        </div>
      </div>
    )
  }

  const projectGrid = () => (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => (
        <button
          key={p.id}
          onClick={() => onSelectProject(p.id, p.name)}
          className="group flex items-start gap-3 rounded-lg border border-border bg-card p-4 text-left transition-colors hover:bg-accent/50 cursor-pointer"
        >
          <FileText className="h-5 w-5 mt-0.5 shrink-0 text-muted-foreground" />
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{p.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{p.path}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Updated {timeAgo(p.updatedAt)}</p>
          </div>
          <button
            onClick={(e) => handleDelete(p.id, e)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive cursor-pointer"
            title="Delete project"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </button>
      ))}
    </div>
  )

  return (
    <div className="flex-1 overflow-y-auto p-6">
      {projects.length > 0 && (
        <div className="flex justify-end mb-6">
          <Button onClick={() => { setShowDialog(true); setSelectedPath(null) }}>
            <Plus className="h-4 w-4 mr-1" />
            Add Project
          </Button>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Welcome to Markdown-AI</h1>
          <p className="text-muted-foreground mt-1">
            A local-first Markdown workspace — your files stay on this device.
          </p>
        </div>
        {projects.length === 0 ? emptyStateCard() : projectGrid()}
      </div>

      {addProjectDialog()}
    </div>
  )
}
