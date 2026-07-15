import { Plus, Puzzle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RepeatableCard } from '../RepeatableCard'
import { createEmptyCustomSection } from '../../constants'
import type { CustomSectionEntry } from '../../types'

interface CustomSectionsFormProps {
  items: Array<CustomSectionEntry>
  add: (item: CustomSectionEntry) => void
  update: (index: number, patch: Partial<CustomSectionEntry>) => void
  remove: (index: number) => void
}

export function CustomSectionsForm({
  items,
  add,
  update,
  remove,
}: CustomSectionsFormProps) {
  return (
    <div className="space-y-4">
      {items.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-8 text-center">
          <Puzzle className="size-8 text-muted-foreground/30" />
          <p className="text-xs text-muted-foreground/60">No custom sections yet</p>
        </div>
      )}

      {items.map((section, index) => (
        <RepeatableCard key={section.id} onRemove={() => remove(index)} index={index}>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Section Title</Label>
            <Input
              value={section.title}
              placeholder="Volunteer Work"
              onChange={(e) => update(index, { title: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Content</Label>
            <Textarea
              rows={5}
              value={section.content}
              placeholder="Add any additional information here..."
              onChange={(e) => update(index, { content: e.target.value })}
            />
          </div>
        </RepeatableCard>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full border-dashed"
        onClick={() => add(createEmptyCustomSection())}
      >
        <Plus className="size-4" /> Add Custom Section
      </Button>
    </div>
  )
}
