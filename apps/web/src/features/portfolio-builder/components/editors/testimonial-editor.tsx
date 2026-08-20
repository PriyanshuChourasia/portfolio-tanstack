import { MessageSquareQuote, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useBuilder } from '../../store/portfolio-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function TestimonialEditor() {
  const {
    activePortfolio,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
  } = useBuilder()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (!activePortfolio) return null
  const { testimonials } = activePortfolio

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-xs">Testimonials</Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={addTestimonial}
          className="h-7 text-xs gap-1"
        >
          <Plus className="h-3 w-3" /> Add
        </Button>
      </div>
      {testimonials.length === 0 ? (
        <div className="text-center py-8 space-y-2">
          <MessageSquareQuote className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto" />
          <p className="text-xs text-slate-400 dark:text-slate-500">
            No testimonials yet.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {testimonials.map((t) => {
            const isExpanded = expandedId === t.id || !t.personName
            return (
              <Card key={t.id} className="overflow-hidden">
                <button
                  onClick={() =>
                    setExpandedId(isExpanded && t.personName ? null : t.id)
                  }
                  className="w-full flex items-center gap-2 p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                      {t.personName || 'New Testimonial'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {t.role
                        ? `${t.role}${t.company ? ` at ${t.company}` : ''}`
                        : 'Role'}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-slate-400 hover:text-red-500 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteTestimonial(t.id)
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </button>
                {isExpanded && (
                  <div className="px-3 pb-3 space-y-3 border-t border-slate-100 dark:border-slate-800/50 pt-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-[11px]">Person Name</Label>
                        <Input
                          value={t.personName}
                          onChange={(e) =>
                            updateTestimonial(t.id, {
                              personName: e.target.value,
                            })
                          }
                          placeholder="Jane Smith"
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px]">Role</Label>
                        <Input
                          value={t.role}
                          onChange={(e) =>
                            updateTestimonial(t.id, { role: e.target.value })
                          }
                          placeholder="CTO"
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">Company</Label>
                      <Input
                        value={t.company}
                        onChange={(e) =>
                          updateTestimonial(t.id, { company: e.target.value })
                        }
                        placeholder="TechCorp"
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">Testimonial</Label>
                      <Textarea
                        value={t.content}
                        onChange={(e) =>
                          updateTestimonial(t.id, { content: e.target.value })
                        }
                        placeholder="What did they say?"
                        rows={3}
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">
                        LinkedIn URL (optional)
                      </Label>
                      <Input
                        type="url"
                        value={t.linkedinUrl ?? ''}
                        onChange={(e) =>
                          updateTestimonial(t.id, {
                            linkedinUrl: e.target.value || undefined,
                          })
                        }
                        placeholder="https://linkedin.com/..."
                        className="h-8 text-sm"
                      />
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
