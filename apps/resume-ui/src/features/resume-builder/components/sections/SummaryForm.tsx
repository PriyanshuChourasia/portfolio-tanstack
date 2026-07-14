import { Textarea } from '@/components/ui/textarea'

interface SummaryFormProps {
  value: string
  onChange: (value: string) => void
}

const MAX_CHARS = 1000

export function SummaryForm({ value, onChange }: SummaryFormProps) {
  const charCount = value.length
  const isNearLimit = charCount > MAX_CHARS * 0.9
  const isOverLimit = charCount > MAX_CHARS

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor="summary"
          className="flex items-center gap-1.5 text-xs font-medium"
        >
          <svg
            className="size-3.5 text-muted-foreground"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          Professional Summary
        </label>
        <span
          className={`text-[10px] tabular-nums transition-colors ${
            isOverLimit
              ? 'text-destructive font-medium'
              : isNearLimit
                ? 'text-amber-500'
                : 'text-muted-foreground/50'
          }`}
        >
          {charCount}/{MAX_CHARS}
        </span>
      </div>
      <Textarea
        id="summary"
        rows={4}
        value={value}
        placeholder="A short summary of your experience and strengths..."
        onChange={(e) => onChange(e.target.value)}
      />
      {value.length > 0 && value.length < 20 && (
        <p className="text-[10px] text-muted-foreground/60">
          Tip: A good summary is 2-3 sentences highlighting your key achievements.
        </p>
      )}
    </div>
  )
}
