import { Plus, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RepeatableCard } from '../RepeatableCard'
import { createEmptyAward } from '../../constants'
import type { AwardEntry } from '../../types'

interface AwardsFormProps {
  items: Array<AwardEntry>
  add: (item: AwardEntry) => void
  update: (index: number, patch: Partial<AwardEntry>) => void
  remove: (index: number) => void
}

export function AwardsForm({
  items,
  add,
  update,
  remove,
}: AwardsFormProps) {
  return (
    <div className="space-y-4">
      {items.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-8 text-center">
          <Trophy className="size-8 text-muted-foreground/30" />
          <p className="text-xs text-muted-foreground/60">No awards yet</p>
        </div>
      )}

      {items.map((award, index) => (
        <RepeatableCard key={award.id} onRemove={() => remove(index)} index={index}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Award Name</Label>
              <Input
                value={award.name}
                placeholder="Best Innovation Award"
                onChange={(e) => update(index, { name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Issuer</Label>
              <Input
                value={award.issuer}
                placeholder="Tech Conference 2024"
                onChange={(e) => update(index, { issuer: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Date</Label>
              <Input
                value={award.date}
                placeholder="Mar 2024"
                onChange={(e) => update(index, { date: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Description</Label>
            <Textarea
              rows={3}
              value={award.description}
              placeholder="Recognized for outstanding contribution to..."
              onChange={(e) => update(index, { description: e.target.value })}
            />
          </div>
        </RepeatableCard>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full border-dashed"
        onClick={() => add(createEmptyAward())}
      >
        <Plus className="size-4" /> Add Award
      </Button>
    </div>
  )
}
