import { BookOpen, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useBuilder } from '../../store/portfolio-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function PublicationEditor() {
  const {
    activePortfolio,
    addPublication,
    updatePublication,
    deletePublication,
  } = useBuilder()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (!activePortfolio) return null
  const { publications } = activePortfolio

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-xs">Publications</Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={addPublication}
          className="h-7 text-xs gap-1"
        >
          <Plus className="h-3 w-3" /> Add
        </Button>
      </div>
      {publications.length === 0 ? (
        <div className="text-center py-8 space-y-2">
          <BookOpen className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto" />
          <p className="text-xs text-slate-400 dark:text-slate-500">
            No publications yet.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {publications.map((pub) => {
            const isExpanded = expandedId === pub.id || !pub.title
            return (
              <Card key={pub.id} className="overflow-hidden">
                <button
                  onClick={() =>
                    setExpandedId(isExpanded && pub.title ? null : pub.id)
                  }
                  className="w-full flex items-center gap-2 p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                      {pub.title || 'New Publication'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {pub.publisher || 'Publisher'}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-slate-400 hover:text-red-500 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      deletePublication(pub.id)
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </button>
                {isExpanded && (
                  <div className="px-3 pb-3 space-y-3 border-t border-slate-100 dark:border-slate-800/50 pt-3">
                    <div className="space-y-1">
                      <Label className="text-[11px]">Title</Label>
                      <Input
                        value={pub.title}
                        onChange={(e) =>
                          updatePublication(pub.id, { title: e.target.value })
                        }
                        placeholder="Article Title"
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-[11px]">Publisher</Label>
                        <Input
                          value={pub.publisher}
                          onChange={(e) =>
                            updatePublication(pub.id, {
                              publisher: e.target.value,
                            })
                          }
                          placeholder="Medium"
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px]">Date</Label>
                        <Input
                          type="date"
                          value={pub.date}
                          onChange={(e) =>
                            updatePublication(pub.id, { date: e.target.value })
                          }
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">Description</Label>
                      <Textarea
                        value={pub.description}
                        onChange={(e) =>
                          updatePublication(pub.id, {
                            description: e.target.value,
                          })
                        }
                        placeholder="Brief description..."
                        rows={2}
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">URL</Label>
                      <Input
                        type="url"
                        value={pub.url}
                        onChange={(e) =>
                          updatePublication(pub.id, { url: e.target.value })
                        }
                        placeholder="https://..."
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
