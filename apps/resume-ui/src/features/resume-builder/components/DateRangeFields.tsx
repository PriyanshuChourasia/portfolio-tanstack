import { useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface DateFieldProps {
  value: string
  placeholder: string
  disabled?: boolean
  onChange: (value: string) => void
}

function formatMonthYear(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function parseMonthYear(text: string) {
  const trimmed = text.trim()
  if (!trimmed) return undefined
  const parsed = new Date(trimmed)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

function DateField({ value, placeholder, disabled, onChange }: DateFieldProps) {
  const [open, setOpen] = useState(false)
  const date = parseMonthYear(value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className="flex h-10 w-full items-center gap-1.5 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs transition-colors outline-none hover:border-ring focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CalendarIcon className="size-3.5 shrink-0 text-muted-foreground" />
          <span className={cn('truncate text-left', !value && 'text-muted-foreground')}>
            {value || placeholder}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          captionLayout="dropdown"
          selected={date}
          defaultMonth={date}
          onSelect={(next) => {
            if (next) onChange(formatMonthYear(next))
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

interface DateRangeFieldsProps {
  startDate: string
  endDate: string
  onStartDateChange: (value: string) => void
  onEndDateChange: (value: string) => void
  presentLabel?: string
  presentCheckboxLabel?: string
}

export function DateRangeFields({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  presentLabel = 'Present',
  presentCheckboxLabel = 'Currently ongoing',
}: DateRangeFieldsProps) {
  const isPresent = endDate === presentLabel

  return (
    <div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <DateField value={startDate} placeholder="Start" onChange={onStartDateChange} />
        <DateField
          value={isPresent ? '' : endDate}
          placeholder="End"
          disabled={isPresent}
          onChange={onEndDateChange}
        />
      </div>
      <label className="mt-1 flex cursor-pointer items-center gap-1.5 text-[11px] text-muted-foreground">
        <input
          type="checkbox"
          checked={isPresent}
          onChange={(e) => onEndDateChange(e.target.checked ? presentLabel : '')}
          className="size-3.5 rounded border-gray-300 text-primary focus:ring-primary"
        />
        {presentCheckboxLabel}
      </label>
    </div>
  )
}
