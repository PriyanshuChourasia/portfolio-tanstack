import { ArrowLeft, Monitor, Smartphone, Tablet } from 'lucide-react'
import { useState } from 'react'
import { useBuilder } from '../../store/portfolio-store'
import { TemplateRenderer } from '../templates/template-renderer'
import type { PreviewDevice } from '../../types/portfolio'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function FullPreview() {
  const { activePortfolio, setPreviewOpen } = useBuilder()
  const [device, setDevice] = useState<PreviewDevice>('desktop')

  if (!activePortfolio) return null

  return (
    <div className="h-screen flex flex-col bg-slate-100 dark:bg-slate-900">
      <div className="h-12 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setPreviewOpen(false)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Portfolio Preview
          </span>
        </div>
        <div className="flex items-center gap-1">
          {[
            { id: 'desktop' as const, icon: Monitor, label: 'Desktop' },
            { id: 'tablet' as const, icon: Tablet, label: 'Tablet' },
            { id: 'mobile' as const, icon: Smartphone, label: 'Mobile' },
          ].map((d) => {
            const Icon = d.icon
            return (
              <Button
                key={d.id}
                variant={device === d.id ? 'default' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setDevice(d.id)}
              >
                <Icon className="h-4 w-4" />
              </Button>
            )
          })}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 flex justify-center">
        <div
          className={cn(
            'bg-white dark:bg-slate-950 shadow-2xl rounded-xl overflow-hidden transition-all duration-300 h-fit',
            device === 'desktop' && 'w-full max-w-6xl',
            device === 'tablet' && 'w-[768px]',
            device === 'mobile' && 'w-[375px]',
          )}
        >
          <TemplateRenderer portfolio={activePortfolio} />
        </div>
      </div>
    </div>
  )
}
