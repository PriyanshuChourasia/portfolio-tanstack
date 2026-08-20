import { useBuilder } from '../../store/portfolio-store'
import type {
  BorderRadius,
  CardStyle,
  ContentWidth,
  HeroAlignment,
  SectionAlignment,
  SectionSpacing,
} from '../../types/portfolio'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function LayoutCustomizer() {
  const { activePortfolio, updateLayout } = useBuilder()
  if (!activePortfolio) return null
  const layout = activePortfolio.settings.layout

  return (
    <div className="space-y-5">
      <div>
        <Label className="text-xs">Layout Settings</Label>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
          Adjust spacing, width, and alignment.
        </p>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Content Width</Label>
          <Select
            value={layout.contentWidth}
            onValueChange={(v) =>
              updateLayout({ contentWidth: v as ContentWidth })
            }
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="narrow">Narrow (640px)</SelectItem>
              <SelectItem value="medium">Medium (800px)</SelectItem>
              <SelectItem value="wide">Wide (1024px)</SelectItem>
              <SelectItem value="full">Full Width</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Section Spacing</Label>
          <Select
            value={layout.sectionSpacing}
            onValueChange={(v) =>
              updateLayout({ sectionSpacing: v as SectionSpacing })
            }
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="compact">Compact</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="relaxed">Relaxed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Border Radius</Label>
          <Select
            value={layout.borderRadius}
            onValueChange={(v) =>
              updateLayout({ borderRadius: v as BorderRadius })
            }
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="small">Small (4px)</SelectItem>
              <SelectItem value="medium">Medium (8px)</SelectItem>
              <SelectItem value="large">Large (16px)</SelectItem>
              <SelectItem value="full">Full Round</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Card Style</Label>
          <Select
            value={layout.cardStyle}
            onValueChange={(v) => updateLayout({ cardStyle: v as CardStyle })}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="bordered">Bordered</SelectItem>
              <SelectItem value="shadow">Shadow</SelectItem>
              <SelectItem value="glass">Glass</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Hero Alignment</Label>
          <Select
            value={layout.heroAlignment}
            onValueChange={(v) =>
              updateLayout({ heroAlignment: v as HeroAlignment })
            }
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Section Alignment</Label>
          <Select
            value={layout.sectionAlignment}
            onValueChange={(v) =>
              updateLayout({ sectionAlignment: v as SectionAlignment })
            }
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
