import { GraduationCap, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useBuilder } from '../../store/portfolio-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function EducationEditor() {
  const { activePortfolio, addEducation, updateEducation, deleteEducation } =
    useBuilder()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (!activePortfolio) return null
  const { education } = activePortfolio

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-xs">Education</Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={addEducation}
          className="h-7 text-xs gap-1"
        >
          <Plus className="h-3 w-3" />
          Add
        </Button>
      </div>

      {education.length === 0 ? (
        <div className="text-center py-8 space-y-2">
          <GraduationCap className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto" />
          <p className="text-xs text-slate-400 dark:text-slate-500">
            No education entries yet.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {education.map((edu) => {
            const isExpanded = expandedId === edu.id || !edu.institution
            return (
              <Card key={edu.id} className="overflow-hidden">
                <button
                  onClick={() =>
                    setExpandedId(isExpanded && edu.institution ? null : edu.id)
                  }
                  className="w-full flex items-center gap-2 p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                      {edu.degree || 'New Education'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {edu.institution || 'Institution'}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-slate-400 hover:text-red-500 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteEducation(edu.id)
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </button>
                {isExpanded && (
                  <div className="px-3 pb-3 space-y-3 border-t border-slate-100 dark:border-slate-800/50 pt-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-[11px]">Degree</Label>
                        <Input
                          value={edu.degree}
                          onChange={(e) =>
                            updateEducation(edu.id, { degree: e.target.value })
                          }
                          placeholder="B.S."
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px]">Field of Study</Label>
                        <Input
                          value={edu.fieldOfStudy}
                          onChange={(e) =>
                            updateEducation(edu.id, {
                              fieldOfStudy: e.target.value,
                            })
                          }
                          placeholder="Computer Science"
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">Institution</Label>
                      <Input
                        value={edu.institution}
                        onChange={(e) =>
                          updateEducation(edu.id, {
                            institution: e.target.value,
                          })
                        }
                        placeholder="MIT"
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-[11px]">Start Date</Label>
                        <Input
                          type="month"
                          value={edu.startDate}
                          onChange={(e) =>
                            updateEducation(edu.id, {
                              startDate: e.target.value,
                            })
                          }
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px]">End Date</Label>
                        <Input
                          type="month"
                          value={edu.endDate}
                          onChange={(e) =>
                            updateEducation(edu.id, { endDate: e.target.value })
                          }
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">Location</Label>
                      <Input
                        value={edu.location}
                        onChange={(e) =>
                          updateEducation(edu.id, { location: e.target.value })
                        }
                        placeholder="Cambridge, MA"
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">Description</Label>
                      <Textarea
                        value={edu.description}
                        onChange={(e) =>
                          updateEducation(edu.id, {
                            description: e.target.value,
                          })
                        }
                        placeholder="Activities, honors..."
                        rows={2}
                        className="text-sm"
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
