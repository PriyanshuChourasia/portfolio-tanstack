import { LanguageDots } from './LanguageDots'
import { Globe } from 'lucide-react'

interface Language {
  name: string
  level: number
}

interface LanguagesPanelProps {
  languages: Language[]
  progress: any
}

export function LanguagesPanel({ languages, progress }: LanguagesPanelProps) {
  return (
    <div className="rounded-2xl border border-slate-700/50 bg-linear-to-br from-slate-900/60 via-slate-800/40 to-slate-900/60 p-6 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <Globe className="w-5 h-5 text-emerald-400" />
        <h3 className="text-base font-bold text-white">Languages</h3>
      </div>
      <div className="space-y-8">
        {languages.map((lang, i) => (
          <LanguageDots key={i} label={lang.name} level={lang.level} progress={progress} />
        ))}
      </div>
    </div>
  )
}
