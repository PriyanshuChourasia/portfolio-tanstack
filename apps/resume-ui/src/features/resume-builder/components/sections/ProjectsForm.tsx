import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DateRangeFields } from '../DateRangeFields'
import { RepeatableCard } from '../RepeatableCard'
import { createEmptyProject } from '../../constants'
import type { ProjectEntry } from '../../types'

interface ProjectsFormProps {
  items: Array<ProjectEntry>
  add: (item: ProjectEntry) => void
  update: (index: number, patch: Partial<ProjectEntry>) => void
  remove: (index: number) => void
}

export function ProjectsForm({ items, add, update, remove }: ProjectsFormProps) {
  return (
    <div className="space-y-4">
      {items.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-8 text-center">
          <svg className="size-8 text-muted-foreground/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          <p className="text-xs text-muted-foreground/60">No projects yet</p>
        </div>
      )}

      {items.map((project, index) => (
        <RepeatableCard key={project.id} onRemove={() => remove(index)} index={index}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-medium">Project Name</Label>
              <Input
                value={project.name}
                placeholder="My Awesome Project"
                onChange={(e) => update(index, { name: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Project Domain</Label>
              <Input
                placeholder="Web Dev, Data Science, Mobile..."
                value={project.domain}
                onChange={(e) => update(index, { domain: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Dates</Label>
              <DateRangeFields
                startDate={project.startDate}
                endDate={project.endDate}
                onStartDateChange={(value) => update(index, { startDate: value })}
                onEndDateChange={(value) => update(index, { endDate: value })}
                presentCheckboxLabel="In progress"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-medium">Tech Stack</Label>
              <Input
                placeholder="React, Node.js, PostgreSQL, Docker, AWS"
                value={project.stack}
                onChange={(e) => update(index, { stack: e.target.value })}
              />
              {project.stack && (
                <div className="flex flex-wrap gap-1">
                  {project.stack.split(',').map((t, i) => (
                    <span
                      key={i}
                      className="inline-block rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary"
                    >
                      {t.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-medium">
                Bullet Points
                <span className="text-muted-foreground/50 ml-1 font-normal">
                  (one per line)
                </span>
              </Label>
              <Textarea
                rows={4}
                placeholder="Designed and implemented the core API that reduced response time by 40%..."
                value={project.bullets}
                onChange={(e) => update(index, { bullets: e.target.value })}
              />
            </div>
          </div>
        </RepeatableCard>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full border-dashed"
        onClick={() => add(createEmptyProject())}
      >
        <Plus className="size-4" /> Add Project
      </Button>
    </div>
  )
}
