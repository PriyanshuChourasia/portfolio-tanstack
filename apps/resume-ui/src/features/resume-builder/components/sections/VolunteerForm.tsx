import { Heart, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DateRangeFields } from '../DateRangeFields'
import { RepeatableCard } from '../RepeatableCard'
import { createEmptyVolunteer } from '../../constants'
import type { VolunteerEntry } from '../../types'

interface VolunteerFormProps {
  items: Array<VolunteerEntry>
  add: (item: VolunteerEntry) => void
  update: (index: number, patch: Partial<VolunteerEntry>) => void
  remove: (index: number) => void
}

export function VolunteerForm({
  items,
  add,
  update,
  remove,
}: VolunteerFormProps) {
  return (
    <div className="space-y-4">
      {items.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-8 text-center">
          <Heart className="size-8 text-muted-foreground/30" />
          <p className="text-xs text-muted-foreground/60">No volunteer experience yet</p>
        </div>
      )}

      {items.map((vol, index) => (
        <RepeatableCard key={vol.id} onRemove={() => remove(index)} index={index}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Role / Title</Label>
              <Input
                value={vol.role}
                placeholder="Volunteer Coordinator"
                onChange={(e) => update(index, { role: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Organization</Label>
              <Input
                value={vol.organization}
                placeholder="Habitat for Humanity"
                onChange={(e) => update(index, { organization: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Location</Label>
              <Input
                value={vol.location}
                placeholder="Pune, India"
                onChange={(e) => update(index, { location: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Dates</Label>
              <DateRangeFields
                startDate={vol.startDate}
                endDate={vol.endDate}
                onStartDateChange={(value) => update(index, { startDate: value })}
                onEndDateChange={(value) => update(index, { endDate: value })}
                presentCheckboxLabel="Currently volunteering"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">
              Description
              <span className="text-muted-foreground/50 ml-1 font-normal">
                (one per line)
              </span>
            </Label>
            <Textarea
              rows={4}
              value={vol.bullets}
              placeholder="Organized community outreach events for 200+ attendees..."
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
        onClick={() => add(createEmptyVolunteer())}
      >
        <Plus className="size-4" /> Add Volunteer Experience
      </Button>
    </div>
  )
}
