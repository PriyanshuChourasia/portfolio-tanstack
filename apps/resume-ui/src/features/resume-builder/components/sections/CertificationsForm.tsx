import { Award, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createEmptyCertification } from '../../constants'
import type { CertificationEntry } from '../../types'

interface CertificationsFormProps {
  items: Array<CertificationEntry>
  add: (item: CertificationEntry) => void
  update: (index: number, patch: Partial<CertificationEntry>) => void
  remove: (index: number) => void
}

export function CertificationsForm({
  items,
  add,
  update,
  remove,
}: CertificationsFormProps) {
  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-8 text-center">
          <Award className="size-8 text-muted-foreground/30" />
          <p className="text-xs text-muted-foreground/60">No certifications yet</p>
        </div>
      )}

      {items.map((cert, index) => (
        <div
          key={cert.id}
          className="group relative rounded-lg border border-input bg-background/50 px-3 py-2.5 transition-all hover:border-border hover:bg-background"
        >
          <div className="flex items-center gap-2.5">
            <Award className="mt-0.5 size-4 shrink-0 self-start text-muted-foreground/40" />
            <div className="min-w-0 flex-1 space-y-2">
              <Input
                className="h-8 border-0 bg-transparent px-0 text-sm shadow-none placeholder:text-muted-foreground/40 focus-visible:ring-0"
                value={cert.name}
                placeholder="AWS Certified Developer"
                onChange={(e) => update(index, { name: e.target.value })}
              />
              <Input
                className="h-7 border-0 bg-transparent px-0 text-xs text-muted-foreground shadow-none placeholder:text-muted-foreground/30 focus-visible:ring-0"
                value={cert.url}
                placeholder="Certificate URL (optional)"
                onChange={(e) => update(index, { url: e.target.value })}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 shrink-0 self-start transition-all"
              onClick={() => remove(index)}
              aria-label="Remove certification"
              title="Delete certification"
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
        onClick={() => add(createEmptyCertification())}
      >
        <Plus className="size-4" /> Add Certification
      </Button>
    </div>
  )
}
