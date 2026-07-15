import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Combobox } from '@/components/ui/combobox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DateRangeFields } from '../DateRangeFields'
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
  '10th', '12th', 'Diploma',
  'BE', 'B.Tech', 'B.Sc', 'BCA', 'B.Com', 'BA', 'BBA', 'B.Des',
  'B.Arch', 'LLB',
  'ME', 'M.Tech', 'M.Sc', 'MCA', 'M.Com', 'MA', 'MBA', 'M.Des',
  'LLM', 'PhD', 'Other',
]

const DEGREE_OPTIONS = COMMON_DEGREES.map((d) => ({ value: d, label: d }))

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

const STATE_OPTIONS = INDIAN_STATES.map((s) => ({ value: s, label: s }))

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
              <Combobox
                options={DEGREE_OPTIONS}
                value={ed.degree}
                onChange={(value) => update(index, { degree: value })}
                placeholder="Select degree"
                searchPlaceholder="Search degree..."
              />
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
              <Combobox
                options={STATE_OPTIONS}
                value={ed.state}
                onChange={(value) => update(index, { state: value })}
                placeholder="Select state"
                searchPlaceholder="Search state..."
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Dates</Label>
              <DateRangeFields
                startDate={ed.startDate}
                endDate={ed.endDate}
                onStartDateChange={(value) => update(index, { startDate: value })}
                onEndDateChange={(value) => update(index, { endDate: value })}
                presentCheckboxLabel="Currently pursuing / ongoing"
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
        onClick={() => add(createEmptyEducation())}
      >
        <Plus className="size-4" /> Add Education
      </Button>
    </div>
  )
}
