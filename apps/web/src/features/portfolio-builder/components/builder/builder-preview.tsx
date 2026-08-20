import { Maximize2, Monitor, Smartphone, Tablet } from 'lucide-react'
import { useBuilder } from '../../store/portfolio-store'
import { TemplateRenderer } from '../templates/template-renderer'
import type { PreviewDevice } from '../../types/portfolio'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const DEVICES: Array<{
  id: PreviewDevice
  icon: typeof Monitor
  label: string
  width: string
}> = [
  { id: 'desktop', icon: Monitor, label: 'Desktop', width: '100%' },
  { id: 'tablet', icon: Tablet, label: 'Tablet', width: '768px' },
  { id: 'mobile', icon: Smartphone, label: 'Mobile', width: '375px' },
]

export function BuilderPreview() {
  const { activePortfolio, previewDevice, setPreviewDevice, setPreviewOpen } =
    useBuilder()

  if (!activePortfolio) return null

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-100 dark:bg-slate-900">
      <div className="h-10 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between px-3 shrink-0">
        <div className="flex items-center gap-1">
          {DEVICES.map((device) => {
            const Icon = device.icon
            return (
              <Button
                key={device.id}
                variant={previewDevice === device.id ? 'default' : 'ghost'}
                size="icon"
                className="h-7 w-7"
                onClick={() => setPreviewDevice(device.id)}
                title={device.label}
              >
                <Icon className="h-3.5 w-3.5" />
              </Button>
            )
          })}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setPreviewOpen(true)}
          title="Open full preview"
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4 flex justify-center">
        <div
          className={cn(
            'bg-white dark:bg-slate-950 shadow-xl rounded-lg overflow-hidden transition-all duration-300 h-fit',
            previewDevice === 'desktop' && 'w-full',
            previewDevice === 'tablet' && 'w-[768px]',
            previewDevice === 'mobile' && 'w-[375px]',
          )}
          style={{
            border:
              previewDevice !== 'desktop'
                ? '1px solid rgb(226 232 240 / 0.5)'
                : undefined,
          }}
        >
          <TemplateRenderer portfolio={activePortfolio} />
        </div>
      </div>
    </div>
  )
}
