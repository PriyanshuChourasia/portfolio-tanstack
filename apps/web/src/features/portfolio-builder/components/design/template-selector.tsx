import { Check } from 'lucide-react'
import { useBuilder } from '../../store/portfolio-store'
import type { PortfolioTemplate } from '../../types/portfolio'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'

const TEMPLATES: Array<{
  id: PortfolioTemplate
  name: string
  description: string
}> = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean, typography-focused with generous whitespace',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Cards, subtle borders, and strong visual hierarchy',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Large typography, gradients, and visual flair',
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Clean corporate design, perfect for consultants',
  },
]

export function TemplateSelector() {
  const { activePortfolio, updateSettings } = useBuilder()
  if (!activePortfolio) return null
  const current = activePortfolio.settings.template

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-xs">Select Template</Label>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
          Choose a template. Your content stays the same.
        </p>
      </div>

      <div className="space-y-2">
        {TEMPLATES.map((tpl) => {
          const isActive = current === tpl.id
          return (
            <Card
              key={tpl.id}
              className={`p-3 cursor-pointer transition-all ${
                isActive
                  ? 'border-cyan-500 dark:border-cyan-400 ring-1 ring-cyan-500/20 dark:ring-cyan-400/20'
                  : 'hover:border-slate-300 dark:hover:border-slate-700'
              }`}
              onClick={() => updateSettings({ template: tpl.id })}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {tpl.name}
                    </h4>
                    {isActive && (
                      <Check className="h-3.5 w-3.5 text-cyan-500" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {tpl.description}
                  </p>
                </div>
                <div
                  className="w-12 h-16 rounded border border-slate-200 dark:border-slate-800 flex-shrink-0 ml-3"
                  style={{
                    background: isActive
                      ? 'var(--portfolio-primary, #0ea5e9)'
                      : undefined,
                    opacity: isActive ? 0.1 : 1,
                  }}
                />
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
