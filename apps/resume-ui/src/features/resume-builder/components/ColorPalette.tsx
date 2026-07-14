import { cn } from '@/lib/utils'
import type { ResumeTheme } from '../types'
import { DEFAULT_THEME } from '../constants'

interface ColorPaletteProps {
  theme: ResumeTheme
  onChange: (theme: ResumeTheme) => void
}

const COLOR_PRESETS: Array<{ name: string; theme: ResumeTheme }> = [
  {
    name: 'Professional',
    theme: {
      primary: '#0f172a',
      accent: '#2563eb',
      text: '#1e293b',
      muted: '#64748b',
      background: '#ffffff',
      sidebar: '#0f172a',
    },
  },
  {
    name: 'Warm',
    theme: {
      primary: '#1c1917',
      accent: '#d97706',
      text: '#292524',
      muted: '#78716c',
      background: '#ffffff',
      sidebar: '#292524',
    },
  },
  {
    name: 'Elegant',
    theme: {
      primary: '#1a1a2e',
      accent: '#be185d',
      text: '#1f2937',
      muted: '#6b7280',
      background: '#ffffff',
      sidebar: '#1a1a2e',
    },
  },
  {
    name: 'Nature',
    theme: {
      primary: '#111827',
      accent: '#059669',
      text: '#1e293b',
      muted: '#64748b',
      background: '#ffffff',
      sidebar: '#111827',
    },
  },
  {
    name: 'Creative',
    theme: {
      primary: '#1e1b4b',
      accent: '#7c3aed',
      text: '#1e293b',
      muted: '#6b7280',
      background: '#ffffff',
      sidebar: '#1e1b4b',
    },
  },
  {
    name: 'Minimal',
    theme: {
      primary: '#171717',
      accent: '#404040',
      text: '#262626',
      muted: '#737373',
      background: '#ffffff',
      sidebar: '#262626',
    },
  },
  {
    name: 'Navy',
    theme: {
      primary: '#ffffff',
      accent: '#60a5fa',
      text: '#cbd5e1',
      muted: '#64748b',
      background: '#0f172a',
      sidebar: '#0c1222',
    },
  },
  {
    name: 'Coffee',
    theme: {
      primary: '#451a03',
      accent: '#a16207',
      text: '#292524',
      muted: '#78716c',
      background: '#fefce8',
      sidebar: '#451a03',
    },
  },
]

const THEME_LABELS: Record<keyof ResumeTheme, string> = {
  primary: 'Headings',
  accent: 'Accent',
  text: 'Body Text',
  muted: 'Muted',
  background: 'Background',
  sidebar: 'Sidebar',
}

export function ColorPalette({ theme, onChange }: ColorPaletteProps) {
  const isPresetActive = (preset: ResumeTheme) =>
    preset.primary === theme.primary &&
    preset.accent === theme.accent &&
    preset.text === theme.text &&
    preset.muted === theme.muted &&
    preset.background === theme.background

  const handleColorChange = (key: keyof ResumeTheme, value: string) => {
    onChange({ ...theme, [key]: value })
  }

  return (
    <div className="space-y-4">
      {/* Preset color schemes */}
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          Color Scheme
        </p>
        <div className="flex flex-wrap gap-2">
          {COLOR_PRESETS.map((preset) => {
            const active = isPresetActive(preset.theme)
            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => onChange({ ...preset.theme })}
                className={cn(
                  'flex items-center gap-1.5 rounded-md border px-2 py-1.5 text-xs font-medium transition-all',
                  active
                    ? 'border-primary ring-primary/30 ring-2 bg-primary/5'
                    : 'border-input text-muted-foreground hover:border-border hover:text-foreground',
                )}
                title={preset.name}
              >
                <span className="flex -space-x-0.5">
                  <span
                    className="inline-block size-3 rounded-full border border-white"
                    style={{ backgroundColor: preset.theme.primary }}
                  />
                  <span
                    className="inline-block size-3 rounded-full border border-white"
                    style={{ backgroundColor: preset.theme.accent }}
                  />
                  <span
                    className="inline-block size-3 rounded-full border border-white"
                    style={{ backgroundColor: preset.theme.text }}
                  />
                </span>
                <span>{preset.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Individual color pickers */}
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          Custom Colors
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {(Object.keys(THEME_LABELS) as Array<keyof ResumeTheme>).map(
            (key) => (
              <label
                key={key}
                className="flex items-center gap-2.5 rounded-md border border-input bg-background px-2.5 py-1.5 text-xs"
              >
                <input
                  type="color"
                  value={theme[key] ?? DEFAULT_THEME[key] as string}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  className="block size-6 cursor-pointer rounded border border-input bg-transparent p-0.5"
                />
                <span className="text-muted-foreground">
                  {THEME_LABELS[key]}
                </span>
              </label>
            ),
          )}
        </div>
      </div>
    </div>
  )
}
