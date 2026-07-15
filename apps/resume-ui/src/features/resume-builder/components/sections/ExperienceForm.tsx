import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DateRangeFields } from '../DateRangeFields'
import { RepeatableCard } from '../RepeatableCard'
import { createEmptyExperience } from '../../constants'
import type { ExperienceEntry } from '../../types'

interface ExperienceFormProps {
  items: Array<ExperienceEntry>
  add: (item: ExperienceEntry) => void
  update: (index: number, patch: Partial<ExperienceEntry>) => void
  remove: (index: number) => void
}

export function ExperienceForm({
  items,
  add,
  update,
  remove,
}: ExperienceFormProps) {
  return (
    <div className="space-y-4">
      {items.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-8 text-center">
          <svg className="size-8 text-muted-foreground/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
          <p className="text-xs text-muted-foreground/60">No experience entries yet</p>
        </div>
      )}

      {items.map((exp, index) => (
        <RepeatableCard key={exp.id} onRemove={() => remove(index)} index={index}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Role / Title</Label>
              <Input
                value={exp.role}
                placeholder="Senior Frontend Engineer"
                onChange={(e) => update(index, { role: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Company</Label>
              <Input
                value={exp.company}
                placeholder="Acme Corp"
                onChange={(e) => update(index, { company: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Location</Label>
              <Input
                value={exp.location}
                placeholder="San Francisco, CA"
                onChange={(e) => update(index, { location: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Dates</Label>
              <DateRangeFields
                startDate={exp.startDate}
                endDate={exp.endDate}
                onStartDateChange={(value) => update(index, { startDate: value })}
                onEndDateChange={(value) => update(index, { endDate: value })}
                presentCheckboxLabel="Currently working here"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">
              Bullet Points
              <span className="text-muted-foreground/50 ml-1 font-normal">
                (one per line)
              </span>
            </Label>
            <Textarea
              rows={4}
              value={exp.bullets}
              placeholder="Led a team of 5 engineers to deliver a customer-facing dashboard..."
              onChange={(e) => update(index, { bullets: e.target.value })}
            />
          </div>
        </RepeatableCard>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full border-dashed"
        onClick={() => add(createEmptyExperience())}
      >
        <Plus className="size-4" /> Add Experience
      </Button>
    </div>
  )
}
