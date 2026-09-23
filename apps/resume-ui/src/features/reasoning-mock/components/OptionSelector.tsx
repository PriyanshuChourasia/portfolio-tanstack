import { CheckCircle2, XCircle } from 'lucide-react'
import { OPTION_KEYS } from '@/data/reasoning'
import type { OptionKey } from '@/data/reasoning'
import { cn } from '@/lib/utils'

interface OptionSelectorProps {
  options: [string, string, string, string]
  selected: OptionKey | null
  onSelect?: (option: OptionKey) => void
  disabled?: boolean
  /** Review mode highlights the correct option and the user's wrong pick. */
  reveal?: boolean
  correctOption?: OptionKey
}

export function OptionSelector({
  options,
  selected,
  onSelect,
  disabled = false,
  reveal = false,
  correctOption,
}: OptionSelectorProps) {
  return (
    <div className="space-y-2" role="radiogroup">
      {options.map((option, index) => {
        const key = OPTION_KEYS[index]
        const isSelected = selected === key
        const isCorrect = reveal && correctOption === key
        const isWrongPick = reveal && isSelected && correctOption !== key

        return (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={disabled}
            onClick={() => onSelect?.(key)}
            className={cn(
              'flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all',
              !reveal && 'hover:border-primary/50 hover:bg-primary/5',
              !reveal && isSelected && 'border-primary bg-primary/10 font-medium shadow-sm',
              !reveal && !isSelected && 'border-border/60 bg-card',
              reveal && isCorrect && 'border-emerald-500/60 bg-emerald-500/10',
              reveal && isWrongPick && 'border-destructive/60 bg-destructive/10',
              reveal && !isCorrect && !isWrongPick && 'border-border/60 bg-card',
              disabled && 'cursor-default',
            )}
          >
            <span
              className={cn(
                'flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold',
                !reveal && isSelected && 'border-primary bg-primary text-primary-foreground',
                !reveal && !isSelected && 'border-border text-muted-foreground',
                reveal && isCorrect && 'border-emerald-500 bg-emerald-500 text-white',
                reveal && isWrongPick && 'border-destructive bg-destructive text-white',
                reveal && !isCorrect && !isWrongPick && 'border-border text-muted-foreground',
              )}
            >
              {key}
            </span>
            <span className="flex-1 whitespace-pre-line">{option}</span>
            {reveal && isCorrect && <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />}
            {reveal && isWrongPick && <XCircle className="size-4 shrink-0 text-destructive" />}
          </button>
        )
      })}
    </div>
  )
}
