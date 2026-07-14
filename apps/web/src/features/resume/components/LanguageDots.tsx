import { LanguageDot } from './LanguageDot'

interface LanguageDotsProps {
  label: string
  level: number
  progress: any
}

export function LanguageDots({ label, level, progress }: LanguageDotsProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-bold text-slate-800 dark:text-white/80">{label}</p>
      <div className="flex gap-2">
        {[...Array(10)].map((_, i) => (
          <LanguageDot key={i} index={i} level={level} progress={progress} />
        ))}
      </div>
    </div>
  )
}
