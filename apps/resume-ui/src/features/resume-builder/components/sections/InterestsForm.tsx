import { Plus, Star, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createEmptyInterest } from '../../constants'
import type { InterestEntry } from '../../types'

interface InterestsFormProps {
  items: Array<InterestEntry>
  add: (item: InterestEntry) => void
  update: (index: number, patch: Partial<InterestEntry>) => void
  remove: (index: number) => void
}

export function InterestsForm({
  items,
  add,
  update,
  remove,
}: InterestsFormProps) {
  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-8 text-center">
          <Star className="size-8 text-muted-foreground/30" />
          <p className="text-xs text-muted-foreground/60">No interests yet</p>
        </div>
      )}

      {items.map((interest, index) => (
        <div
          key={interest.id}
          className="group relative rounded-lg border border-input bg-background/50 px-3 py-2.5 transition-all hover:border-border hover:bg-background"
        >
          <div className="flex items-center gap-2.5">
            <Star className="mt-0.5 size-4 shrink-0 self-start text-muted-foreground/40" />
            <div className="min-w-0 flex-1 space-y-2">
              <Input
                className="h-8 border-0 bg-transparent px-0 text-sm shadow-none placeholder:text-muted-foreground/40 focus-visible:ring-0"
                value={interest.name}
                placeholder="Open Source Contribution"
                onChange={(e) => update(index, { name: e.target.value })}
              />
              <Input
                className="h-7 border-0 bg-transparent px-0 text-xs text-muted-foreground shadow-none placeholder:text-muted-foreground/30 focus-visible:ring-0"
                value={interest.description}
                placeholder="Description (optional)"
                onChange={(e) => update(index, { description: e.target.value })}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 shrink-0 self-start transition-all"
              onClick={() => remove(index)}
              aria-label="Remove interest"
              title="Delete interest"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full border-dashed"
        onClick={() => add(createEmptyInterest())}
      >
        <Plus className="size-4" /> Add Interest
      </Button>
    </div>
  )
}
