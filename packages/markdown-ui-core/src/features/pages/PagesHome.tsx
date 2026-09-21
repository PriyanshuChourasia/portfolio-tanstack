import { useState, useEffect } from 'react'
import { Plus, FileText, Trash2 } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Dialog } from '../../components/ui/dialog'
import { useStorage } from '../../lib/context'
import { timeAgo } from '../../lib/utils'
import type { PageMeta } from '../../lib/types'

interface PagesHomeProps {
  projectId: string
  projectName: string
  onSelectPage: (id: string) => void
}

export function PagesHome({ projectId, projectName, onSelectPage }: PagesHomeProps) {
  const adapter = useStorage()
  const [pages, setPages] = useState<PageMeta[]>([])
  const [showDialog, setShowDialog] = useState(false)
  const [newName, setNewName] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      let pages_: PageMeta[] = []
      try {
        pages_ = await adapter.listPages(projectId)
      } catch {
        pages_ = []
      }
      if (cancelled) return
      setPages(pages_)
    })()
    return () => {
      cancelled = true
    }
  }, [adapter, projectId])

  const handleCreate = async () => {
    if (!newName.trim()) return
    const entry = await adapter.createPage(projectId, newName.trim())
    setNewName('')
    setShowDialog(false)
    onSelectPage(entry.id)
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    await adapter.deletePage(projectId, id)
    setPages((prev) => prev.filter((p) => p.id !== id))
  }

  const addPageDialog = () => {
    if (!showDialog) return null
    return (
      <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
        <h3 className="text-lg font-semibold mb-4">Add Page</h3>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleCreate()
          }}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring mb-4"
          placeholder="Page name"
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setShowDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!newName.trim()}>
            Create
          </Button>
        </div>
      </Dialog>
    )
  }

  const emptyStateCard = () => (
    <div className="max-w-md mx-auto rounded-lg border border-border bg-card p-8">
      <div className="flex flex-col items-center text-center">
        <FileText className="h-10 w-10 text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-6">No pages yet</p>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleCreate()
          }}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring mb-4"
          placeholder="Page name"
        />
        <Button onClick={handleCreate} disabled={!newName.trim()} className="w-full">
          Create Page
        </Button>
      </div>
    </div>
  )

  const pageGrid = () => (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {pages.map((p) => (
        <button
          key={p.id}
          onClick={() => onSelectPage(p.id)}
          className="group flex items-start gap-3 rounded-lg border border-border bg-card p-4 text-left transition-colors hover:bg-accent/50 cursor-pointer"
        >
          <FileText className="h-5 w-5 mt-0.5 shrink-0 text-muted-foreground" />
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{p.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Updated {timeAgo(p.updatedAt)}</p>
          </div>
          <button
            onClick={(e) => handleDelete(p.id, e)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive cursor-pointer"
            title="Delete page"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </button>
      ))}
    </div>
  )

  return (
    <div className="flex-1 overflow-y-auto p-6">
      {pages.length > 0 && (
        <div className="flex justify-end mb-6">
          <Button onClick={() => setShowDialog(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Page
          </Button>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">{projectName}</h1>
          <p className="text-muted-foreground mt-1">Pages in this project</p>
        </div>
        {pages.length === 0 ? emptyStateCard() : pageGrid()}
      </div>

      {addPageDialog()}
    </div>
  )
}
