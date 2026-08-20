import { useBuilder } from '../../store/portfolio-store'
import { FONT_OPTIONS } from '../../data/defaults'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function TypographyCustomizer() {
  const { activePortfolio, updateTypography } = useBuilder()
  if (!activePortfolio) return null
  const typo = activePortfolio.settings.typography

  return (
    <div className="space-y-5">
      <div>
        <Label className="text-xs">Typography</Label>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
          Customize fonts and text sizing.
        </p>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Font Family</Label>
          <Select
            value={typo.fontFamily}
            onValueChange={(v) => updateTypography({ fontFamily: v })}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONT_OPTIONS.map((f) => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Heading Size</Label>
          <Select
            value={typo.headingSize}
            onValueChange={(v) => updateTypography({ headingSize: v })}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1.5rem">Small (1.5rem)</SelectItem>
              <SelectItem value="2rem">Medium (2rem)</SelectItem>
              <SelectItem value="2.5rem">Large (2.5rem)</SelectItem>
              <SelectItem value="3rem">Extra Large (3rem)</SelectItem>
              <SelectItem value="3.5rem">XXL (3.5rem)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Body Size</Label>
          <Select
            value={typo.bodySize}
            onValueChange={(v) => updateTypography({ bodySize: v })}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.875rem">Small (14px)</SelectItem>
              <SelectItem value="1rem">Medium (16px)</SelectItem>
              <SelectItem value="1.125rem">Large (18px)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Heading Weight</Label>
          <Select
            value={typo.headingWeight}
            onValueChange={(v) => updateTypography({ headingWeight: v })}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="500">Medium (500)</SelectItem>
              <SelectItem value="600">Semi Bold (600)</SelectItem>
              <SelectItem value="700">Bold (700)</SelectItem>
              <SelectItem value="800">Extra Bold (800)</SelectItem>
              <SelectItem value="900">Black (900)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Line Height</Label>
          <Select
            value={typo.lineHeight}
            onValueChange={(v) => updateTypography({ lineHeight: v })}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1.2">Tight (1.2)</SelectItem>
              <SelectItem value="1.4">Snug (1.4)</SelectItem>
              <SelectItem value="1.6">Normal (1.6)</SelectItem>
              <SelectItem value="1.8">Relaxed (1.8)</SelectItem>
              <SelectItem value="2">Loose (2)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
          Preview
        </p>
        <h3
          style={{
            fontFamily: typo.fontFamily,
            fontSize: typo.headingSize,
            fontWeight: typo.headingWeight,
            lineHeight: typo.lineHeight,
            margin: 0,
          }}
        >
          Heading Text
        </h3>
        <p
          style={{
            fontFamily: typo.fontFamily,
            fontSize: typo.bodySize,
            lineHeight: typo.lineHeight,
            marginTop: '0.5rem',
            color: 'var(--portfolio-muted)',
          }}
        >
          Body text sample for preview.
        </p>
      </div>
    </div>
  )
}
