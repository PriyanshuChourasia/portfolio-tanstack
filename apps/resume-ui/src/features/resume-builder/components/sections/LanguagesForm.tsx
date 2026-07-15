import { Globe, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Combobox } from '@/components/ui/combobox'
import { Input } from '@/components/ui/input'
import { createEmptyLanguage } from '../../constants'
import type { LanguageEntry } from '../../types'

interface LanguagesFormProps {
  items: Array<LanguageEntry>
  add: (item: LanguageEntry) => void
  update: (index: number, patch: Partial<LanguageEntry>) => void
  remove: (index: number) => void
}

const LEVEL_ORDER = ['', 'Native', 'Fluent', 'Advanced', 'Intermediate', 'Beginner']

const LEVEL_OPTIONS = LEVEL_ORDER.filter(Boolean).map((level) => ({
  value: level,
  label: level,
}))

const LEVEL_DOTS: Record<string, number> = {
  Native: 5,
  Fluent: 5,
  Advanced: 4,
  Intermediate: 3,
  Beginner: 1,
}

function ProficencyDots({ level }: { level: string }) {
  const count = LEVEL_DOTS[level] ?? 0
  if (count === 0) return null
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`inline-block h-1.5 w-1.5 rounded-full ${
            i < count ? 'bg-primary/60' : 'bg-muted-foreground/15'
          }`}
        />
      ))}
    </div>
  )
}

export function LanguagesForm({
  items,
  add,
  update,
  remove,
}: LanguagesFormProps) {
  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-8 text-center">
          <Globe className="size-8 text-muted-foreground/30" />
          <p className="text-xs text-muted-foreground/60">No languages added yet</p>
        </div>
      )}

      {items.map((lang, index) => (
        <div
          key={lang.id}
          className="group relative rounded-lg border border-input bg-background/50 px-3 py-2.5 transition-all hover:border-border hover:bg-background"
        >
          <div className="flex items-center gap-2.5">
            <Globe className="size-4 shrink-0 text-muted-foreground/40" />
            <Input
              className="h-8 flex-1 border-0 bg-transparent px-0 text-sm shadow-none placeholder:text-muted-foreground/40 focus-visible:ring-0"
              value={lang.name}
              placeholder="English"
              onChange={(e) => update(index, { name: e.target.value })}
            />
            <Combobox
              options={LEVEL_OPTIONS}
              value={lang.level}
              onChange={(value) => update(index, { level: value })}
              placeholder="Level"
              searchPlaceholder="Search level..."
              className="h-8 w-28 shrink-0 px-2 text-xs"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 shrink-0 transition-all"
              onClick={() => remove(index)}
              aria-label="Remove language"
              title="Delete language"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
          {lang.level && (
            <div className="ml-7 mt-1.5">
              <ProficencyDots level={lang.level} />
            </div>
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full border-dashed"
        onClick={() => add(createEmptyLanguage())}
      >
        <Plus className="size-4" /> Add Language
      </Button>
    </div>
  )
}
