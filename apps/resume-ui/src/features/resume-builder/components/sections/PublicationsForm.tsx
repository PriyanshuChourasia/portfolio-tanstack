import { BookOpen, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RepeatableCard } from '../RepeatableCard'
import { createEmptyPublication } from '../../constants'
import type { PublicationEntry } from '../../types'

interface PublicationsFormProps {
  items: Array<PublicationEntry>
  add: (item: PublicationEntry) => void
  update: (index: number, patch: Partial<PublicationEntry>) => void
  remove: (index: number) => void
}

export function PublicationsForm({
  items,
  add,
  update,
  remove,
}: PublicationsFormProps) {
  return (
    <div className="space-y-4">
      {items.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-8 text-center">
          <BookOpen className="size-8 text-muted-foreground/30" />
          <p className="text-xs text-muted-foreground/60">No publications yet</p>
        </div>
      )}

      {items.map((pub, index) => (
        <RepeatableCard key={pub.id} onRemove={() => remove(index)} index={index}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Title</Label>
              <Input
                value={pub.title}
                placeholder="Building Scalable Systems with Microservices"
                onChange={(e) => update(index, { title: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Publisher</Label>
              <Input
                value={pub.publisher}
                placeholder="IEEE Conference"
                onChange={(e) => update(index, { publisher: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Date</Label>
              <Input
                value={pub.date}
                placeholder="Jan 2024"
                onChange={(e) => update(index, { date: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">URL</Label>
              <Input
                value={pub.url}
                placeholder="https://doi.org/..."
                onChange={(e) => update(index, { url: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Description</Label>
            <Textarea
              rows={3}
              value={pub.description}
              placeholder="A comprehensive study on distributed architecture patterns..."
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
        onClick={() => add(createEmptyPublication())}
      >
        <Plus className="size-4" /> Add Publication
      </Button>
    </div>
  )
}
