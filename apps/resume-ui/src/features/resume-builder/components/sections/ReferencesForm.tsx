import { Plus, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RepeatableCard } from '../RepeatableCard'
import { createEmptyReference } from '../../constants'
import type { ReferenceEntry } from '../../types'

interface ReferencesFormProps {
  items: Array<ReferenceEntry>
  add: (item: ReferenceEntry) => void
  update: (index: number, patch: Partial<ReferenceEntry>) => void
  remove: (index: number) => void
}

export function ReferencesForm({
  items,
  add,
  update,
  remove,
}: ReferencesFormProps) {
  return (
    <div className="space-y-4">
      {items.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-8 text-center">
          <Users className="size-8 text-muted-foreground/30" />
          <p className="text-xs text-muted-foreground/60">No references yet</p>
        </div>
      )}

      {items.map((ref, index) => (
        <RepeatableCard key={ref.id} onRemove={() => remove(index)} index={index}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Name</Label>
              <Input
                value={ref.name}
                placeholder="Jane Smith"
                onChange={(e) => update(index, { name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Title</Label>
              <Input
                value={ref.title}
                placeholder="Engineering Manager"
                onChange={(e) => update(index, { title: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Company</Label>
              <Input
                value={ref.company}
                placeholder="Acme Corp"
                onChange={(e) => update(index, { company: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Email</Label>
              <Input
                value={ref.email}
                placeholder="jane.smith@acme.com"
                onChange={(e) => update(index, { email: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Phone</Label>
              <Input
                value={ref.phone}
                placeholder="+1 (555) 123-4567"
                onChange={(e) => update(index, { phone: e.target.value })}
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
        onClick={() => add(createEmptyReference())}
      >
        <Plus className="size-4" /> Add Reference
      </Button>
    </div>
  )
}
