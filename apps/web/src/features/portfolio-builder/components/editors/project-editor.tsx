import { FolderKanban, GripVertical, Plus, Star, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useBuilder } from '../../store/portfolio-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'

export function ProjectEditor() {
  const { activePortfolio, addProject, updateProject, deleteProject } =
    useBuilder()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (!activePortfolio) return null
  const { projects } = activePortfolio

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-xs">Projects</Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={addProject}
          className="h-7 text-xs gap-1"
        >
          <Plus className="h-3 w-3" />
          Add
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-8 space-y-2">
          <FolderKanban className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto" />
          <p className="text-xs text-slate-400 dark:text-slate-500">
            No projects yet. Showcase your best work.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={addProject}
            className="gap-1 text-xs"
          >
            <Plus className="h-3 w-3" />
            Add Project
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {projects.map((project) => {
            const isExpanded = expandedId === project.id || !project.title
            return (
              <Card key={project.id} className="overflow-hidden">
                <button
                  onClick={() =>
                    setExpandedId(
                      isExpanded && project.title ? null : project.id,
                    )
                  }
                  className="w-full flex items-center gap-2 p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                >
                  <GripVertical className="h-4 w-4 text-slate-300 dark:text-slate-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                        {project.title || 'New Project'}
                      </p>
                      {project.featured && (
                        <Star className="h-3 w-3 text-amber-500 fill-amber-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {project.category || 'Category'}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-slate-400 hover:text-red-500 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteProject(project.id)
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
                        value={project.title}
                        onChange={(e) =>
                          updateProject(project.id, { title: e.target.value })
                        }
                        placeholder="Project Name"
                        className="h-8 text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-[11px]">Category</Label>
                        <Input
                          value={project.category}
                          onChange={(e) =>
                            updateProject(project.id, {
                              category: e.target.value,
                            })
                          }
                          placeholder="Web App"
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="flex items-end pb-0.5">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={project.featured}
                            onCheckedChange={(checked) =>
                              updateProject(project.id, { featured: checked })
                            }
                          />
                          <Label className="text-xs">Featured</Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[11px]">Short Description</Label>
                      <Input
                        value={project.shortDescription}
                        onChange={(e) =>
                          updateProject(project.id, {
                            shortDescription: e.target.value,
                          })
                        }
                        placeholder="Brief one-liner"
                        className="h-8 text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[11px]">Full Description</Label>
                      <Textarea
                        value={project.description}
                        onChange={(e) =>
                          updateProject(project.id, {
                            description: e.target.value,
                          })
                        }
                        placeholder="Detailed project description..."
                        rows={3}
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[11px]">
                        Technologies (comma-separated)
                      </Label>
                      <Input
                        value={project.technologies.join(', ')}
                        onChange={(e) =>
                          updateProject(project.id, {
                            technologies: e.target.value
                              .split(',')
                              .map((t) => t.trim())
                              .filter(Boolean),
                          })
                        }
                        placeholder="React, TypeScript, Node.js"
                        className="h-8 text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-[11px]">GitHub URL</Label>
                        <Input
                          type="url"
                          value={project.githubUrl}
                          onChange={(e) =>
                            updateProject(project.id, {
                              githubUrl: e.target.value,
                            })
                          }
                          placeholder="https://github.com/..."
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px]">Live URL</Label>
                        <Input
                          type="url"
                          value={project.liveUrl}
                          onChange={(e) =>
                            updateProject(project.id, {
                              liveUrl: e.target.value,
                            })
                          }
                          placeholder="https://..."
                          className="h-8 text-sm"
                        />
                      </div>
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
