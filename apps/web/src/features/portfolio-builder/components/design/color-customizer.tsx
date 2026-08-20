import { useBuilder } from '../../store/portfolio-store'
import { COLOR_PRESETS } from '../../data/defaults'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ColorCustomizer() {
  const { activePortfolio, updateColors } = useBuilder()
  if (!activePortfolio) return null
  const colors = activePortfolio.settings.colors

  const colorFields = [
    { key: 'primary' as const, label: 'Primary' },
    { key: 'secondary' as const, label: 'Secondary' },
    { key: 'background' as const, label: 'Background' },
    { key: 'text' as const, label: 'Text' },
    { key: 'mutedText' as const, label: 'Muted Text' },
    { key: 'accent' as const, label: 'Accent' },
  ]

  return (
    <div className="space-y-5">
      <div>
        <Label className="text-xs">Color Presets</Label>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
          Start with a preset or customize individual colors.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {COLOR_PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => updateColors(preset)}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors text-left"
          >
            <div className="flex gap-1 mb-1.5">
              <div
                className="w-4 h-4 rounded-full"
                style={{ background: preset.primary }}
              />
              <div
                className="w-4 h-4 rounded-full"
                style={{ background: preset.secondary }}
              />
              <div
                className="w-4 h-4 rounded-full"
                style={{ background: preset.accent }}
              />
            </div>
            <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300">
              {preset.name}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <Label className="text-xs">Custom Colors</Label>
        {colorFields.map(({ key, label }) => (
          <div key={key} className="flex items-center gap-3">
            <div className="relative">
              <input
                type="color"
                value={colors[key]}
                onChange={(e) => updateColors({ [key]: e.target.value })}
                className="w-8 h-8 rounded-md border border-slate-200 dark:border-slate-800 cursor-pointer p-0 bg-transparent"
              />
            </div>
            <div className="flex-1">
              <Label className="text-[11px]">{label}</Label>
              <Input
                value={colors[key]}
                onChange={(e) => updateColors({ [key]: e.target.value })}
                className="h-7 text-xs font-mono mt-0.5"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
