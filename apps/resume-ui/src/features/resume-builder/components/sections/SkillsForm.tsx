import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RepeatableCard } from '../RepeatableCard'
import { createEmptySkillCategory } from '../../constants'
import type { SkillCategory } from '../../types'

interface SkillsFormProps {
  items: Array<SkillCategory>
  add: (item: SkillCategory) => void
  update: (index: number, patch: Partial<SkillCategory>) => void
  remove: (index: number) => void
}

export function SkillsForm({ items, add, update, remove }: SkillsFormProps) {
  return (
    <div className="space-y-4">
      {items.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-8 text-center">
          <svg className="size-8 text-muted-foreground/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          <p className="text-xs text-muted-foreground/60">No skill categories yet</p>
        </div>
      )}

      {items.map((skill, index) => (
        <RepeatableCard key={skill.id} onRemove={() => remove(index)} index={index}>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Category</Label>
              <Input
                value={skill.label}
                placeholder="Frontend & Frameworks"
                onChange={(e) => update(index, { label: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">
                Skills
                <span className="text-muted-foreground/50 ml-1 font-normal">
                  (comma separated)
                </span>
              </Label>
              <Textarea
                rows={2}
                value={skill.value}
                placeholder="React, TypeScript, Tailwind CSS, Next.js"
                onChange={(e) => update(index, { value: e.target.value })}
              />
              {skill.value && (
                <div className="flex flex-wrap gap-1">
                  {skill.value.split(',').map((s, i) => (
                    <span
                      key={i}
                      className="inline-block rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary"
                    >
                      {s.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </RepeatableCard>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full border-dashed"
        onClick={() => add(createEmptySkillCategory())}
      >
        <Plus className="size-4" /> Add Skill Category
      </Button>
    </div>
  )
}
