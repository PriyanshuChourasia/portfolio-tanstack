import { Plus, Settings, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useBuilder } from '../../store/portfolio-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function ServiceEditor() {
  const { activePortfolio, addService, updateService, deleteService } =
    useBuilder()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (!activePortfolio) return null
  const { services } = activePortfolio

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-xs">Services</Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={addService}
          className="h-7 text-xs gap-1"
        >
          <Plus className="h-3 w-3" /> Add
        </Button>
      </div>
      {services.length === 0 ? (
        <div className="text-center py-8 space-y-2">
          <Settings className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto" />
          <p className="text-xs text-slate-400 dark:text-slate-500">
            No services yet. List what you offer.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {services.map((svc) => {
            const isExpanded = expandedId === svc.id || !svc.name
            return (
              <Card key={svc.id} className="overflow-hidden">
                <button
                  onClick={() =>
                    setExpandedId(isExpanded && svc.name ? null : svc.id)
                  }
                  className="w-full flex items-center gap-2 p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                      {svc.name || 'New Service'}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-slate-400 hover:text-red-500 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteService(svc.id)
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </button>
                {isExpanded && (
                  <div className="px-3 pb-3 space-y-3 border-t border-slate-100 dark:border-slate-800/50 pt-3">
                    <div className="space-y-1">
                      <Label className="text-[11px]">Service Name</Label>
                      <Input
                        value={svc.name}
                        onChange={(e) =>
                          updateService(svc.id, { name: e.target.value })
                        }
                        placeholder="Web Development"
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">Description</Label>
                      <Textarea
                        value={svc.description}
                        onChange={(e) =>
                          updateService(svc.id, { description: e.target.value })
                        }
                        placeholder="What does this service include?"
                        rows={2}
                        className="text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-[11px]">Price (optional)</Label>
                        <Input
                          value={svc.price ?? ''}
                          onChange={(e) =>
                            updateService(svc.id, {
                              price: e.target.value || undefined,
                            })
                          }
                          placeholder="$5,000"
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px]">CTA Text</Label>
                        <Input
                          value={svc.cta ?? ''}
                          onChange={(e) =>
                            updateService(svc.id, {
                              cta: e.target.value || undefined,
                            })
                          }
                          placeholder="Get in Touch"
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
