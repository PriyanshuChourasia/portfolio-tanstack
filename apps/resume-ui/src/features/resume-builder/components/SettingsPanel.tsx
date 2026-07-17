import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useResumeStore } from '../store'
import type { ResumeSettings } from '../types'
import { ColorPalette } from './ColorPalette'

const FONT_OPTIONS = ['Inter', 'Geist', 'Manrope', 'System'] as const

const PAPER_SIZE_OPTIONS = [
  { value: 'a4' as const, label: 'A4' },
  { value: 'letter' as const, label: 'Letter' },
]

const ORIENTATION_OPTIONS = [
  { value: 'portrait' as const, label: 'Portrait' },
  { value: 'landscape' as const, label: 'Landscape' },
]

const MARGIN_OPTIONS = [
  { value: 'narrow' as const, label: 'Narrow' },
  { value: 'normal' as const, label: 'Normal' },
  { value: 'wide' as const, label: 'Wide' },
]

const FONT_SIZE_OPTIONS = [
  { value: 'small' as const, label: 'Small' },
  { value: 'medium' as const, label: 'Medium' },
  { value: 'large' as const, label: 'Large' },
]

function SettingGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  )
}

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: Array<{ value: T; label: string }>
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div className="flex rounded-lg border border-input bg-muted/40 p-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`relative flex-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all ${
            value === opt.value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function RangeSlider({
  value,
  min,
  max,
  step,
  onChange,
  displaySuffix = '',
}: {
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
  displaySuffix?: string
}) {
  return (
    <div className="flex items-center gap-2.5">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-muted accent-primary [&::-webkit-slider-thumb]:size-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
      />
      <span className="min-w-[2.5rem] rounded-md border border-input bg-muted/40 px-1.5 py-0.5 text-center text-xs font-medium tabular-nums text-foreground">
        {value}{displaySuffix}
      </span>
    </div>
  )
}

export function SettingsPanel() {
  const settings = useResumeStore((s) => s.history.present.settings)
  const updateSettings = useResumeStore((s) => s.updateSettings)
  const theme = useResumeStore((s) => s.history.present.theme)
  const setFullTheme = useResumeStore((s) => s.setFullTheme)

  const patch = <K extends keyof ResumeSettings>(key: K, value: ResumeSettings[K]) =>
    updateSettings({ [key]: value })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="ghost" size="icon-sm" title="Settings">
          <Settings className="size-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Resume Settings</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Font Family */}
          <SettingGroup label="Font Family">
            <select
              value={settings.primaryFont}
              onChange={(e) => patch('primaryFont', e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </SettingGroup>

          {/* Font Size */}
          <SettingGroup label="Font Size">
            <SegmentedControl
              options={FONT_SIZE_OPTIONS}
              value={settings.fontSize}
              onChange={(v) => patch('fontSize', v)}
            />
          </SettingGroup>

          {/* Heading Font Size */}
          <SettingGroup label="Heading Font Size">
            <RangeSlider
              value={settings.headingFontSize}
              min={12}
              max={24}
              step={1}
              onChange={(v) => patch('headingFontSize', v)}
              displaySuffix="px"
            />
          </SettingGroup>

          {/* Body Font Size */}
          <SettingGroup label="Body Font Size">
            <RangeSlider
              value={settings.bodyFontSize}
              min={8}
              max={16}
              step={0.5}
              onChange={(v) => patch('bodyFontSize', v)}
              displaySuffix="px"
            />
          </SettingGroup>

          {/* Section Spacing */}
          <SettingGroup label="Section Spacing">
            <RangeSlider
              value={settings.sectionSpacing}
              min={4}
              max={24}
              step={1}
              onChange={(v) => patch('sectionSpacing', v)}
              displaySuffix="px"
            />
          </SettingGroup>

          {/* Line Height */}
          <SettingGroup label="Line Height">
            <RangeSlider
              value={settings.lineHeight}
              min={1.0}
              max={2.5}
              step={0.1}
              onChange={(v) => patch('lineHeight', v)}
            />
          </SettingGroup>

          {/* Paper Size */}
          <SettingGroup label="Paper Size">
            <SegmentedControl
              options={PAPER_SIZE_OPTIONS}
              value={settings.paperSize}
              onChange={(v) => patch('paperSize', v)}
            />
          </SettingGroup>

          {/* Orientation */}
          <SettingGroup label="Orientation">
            <SegmentedControl
              options={ORIENTATION_OPTIONS}
              value={settings.orientation}
              onChange={(v) => patch('orientation', v)}
            />
          </SettingGroup>

          {/* Margins */}
          <SettingGroup label="Margins">
            <SegmentedControl
              options={MARGIN_OPTIONS}
              value={settings.margins}
              onChange={(v) => patch('margins', v)}
            />
          </SettingGroup>
        </div>

        {/* Colors */}
        <div className="border-t pt-4">
          <Label className="mb-2 block text-xs font-medium text-muted-foreground">
            Colors
          </Label>
          <ColorPalette theme={theme} onChange={setFullTheme} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
