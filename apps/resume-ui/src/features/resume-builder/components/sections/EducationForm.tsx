import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RepeatableCard } from '../RepeatableCard'
import { createEmptyEducation } from '../../constants'
import type { EducationEntry } from '../../types'

interface EducationFormProps {
  items: Array<EducationEntry>
  add: (item: EducationEntry) => void
  update: (index: number, patch: Partial<EducationEntry>) => void
  remove: (index: number) => void
}

const COMMON_DEGREES = [
  'BE', 'B.Tech', 'B.Sc', 'BCA', 'B.Com', 'BA', 'BBA', 'B.Des',
  'B.Arch', 'LLB',
  'ME', 'M.Tech', 'M.Sc', 'MCA', 'M.Com', 'MA', 'MBA', 'M.Des',
  'LLM', 'PhD', 'Diploma',
]

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi',
  'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
]

export function EducationForm({ items, add, update, remove }: EducationFormProps) {
  return (
    <div className="space-y-4">
      {items.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-8 text-center">
          <svg className="size-8 text-muted-foreground/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
          <p className="text-xs text-muted-foreground/60">No education entries yet</p>
        </div>
      )}

      {items.map((ed, index) => (
        <RepeatableCard key={ed.id} onRemove={() => remove(index)} index={index}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-medium">Degree</Label>
              <select
                value={ed.degree}
                onChange={(e) => update(index, { degree: e.target.value })}
                className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select degree</option>
                {COMMON_DEGREES.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-medium">Field of Study</Label>
              <Input
                placeholder="Computer Science, Mechanical Engineering..."
                value={ed.fieldOfStudy}
                onChange={(e) => update(index, { fieldOfStudy: e.target.value })}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-medium">Institution</Label>
              <Input
                placeholder="Indian Institute of Technology, Bombay"
                value={ed.institution}
                onChange={(e) => update(index, { institution: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">State</Label>
              <select
                value={ed.state}
                onChange={(e) => update(index, { state: e.target.value })}
                className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select state</option>
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Dates</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={ed.startDate}
                  placeholder="Start"
                  onChange={(e) => update(index, { startDate: e.target.value })}
                />
                <div className="relative">
                  <Input
                    value={ed.endDate === 'Present' ? '' : ed.endDate}
                    placeholder="End"
                    disabled={ed.endDate === 'Present'}
                    onChange={(e) => update(index, { endDate: e.target.value })}
                  />
                </div>
              </div>
              <label className="mt-1 flex cursor-pointer items-center gap-1.5 text-[11px] text-muted-foreground">
                <input
                  type="checkbox"
                  checked={ed.endDate === 'Present'}
                  onChange={(e) => update(index, { endDate: e.target.checked ? 'Present' : '' })}
                  className="size-3.5 rounded border-gray-300 text-primary focus:ring-primary"
                />
                Currently pursuing / ongoing
              </label>
            </div>
          </div>
        </RepeatableCard>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full border-dashed"
        onClick={() => add(createEmptyEducation())}
      >
        <Plus className="size-4" /> Add Education
      </Button>
    </div>
  )
}
