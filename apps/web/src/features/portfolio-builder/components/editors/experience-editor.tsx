import { Briefcase, GripVertical, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useBuilder } from '../../store/portfolio-store'
import type { EmploymentType } from '../../types/portfolio'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

export function ExperienceEditor() {
  const { activePortfolio, addExperience, updateExperience, deleteExperience } =
    useBuilder()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (!activePortfolio) return null
  const { experiences } = activePortfolio

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-xs">Work Experience</Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={addExperience}
          className="h-7 text-xs gap-1"
        >
          <Plus className="h-3 w-3" />
          Add
        </Button>
      </div>

      {experiences.length === 0 ? (
        <div className="text-center py-8 space-y-2">
          <Briefcase className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto" />
          <p className="text-xs text-slate-400 dark:text-slate-500">
            No experience yet. Add your work history.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {experiences.map((exp) => {
            const isExpanded = expandedId === exp.id || !exp.company
            return (
              <Card key={exp.id} className="overflow-hidden">
                <button
                  onClick={() =>
                    setExpandedId(isExpanded && exp.company ? null : exp.id)
                  }
                  className="w-full flex items-center gap-2 p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                >
                  <GripVertical className="h-4 w-4 text-slate-300 dark:text-slate-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                      {exp.position || 'New Position'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {exp.company || 'Company'}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-slate-400 hover:text-red-500 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteExperience(exp.id)
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </button>

                {isExpanded && (
                  <div className="px-3 pb-3 space-y-3 border-t border-slate-100 dark:border-slate-800/50 pt-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-[11px]">Position</Label>
                        <Input
                          value={exp.position}
                          onChange={(e) =>
                            updateExperience(exp.id, {
                              position: e.target.value,
                            })
                          }
                          placeholder="Software Engineer"
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px]">Company</Label>
                        <Input
                          value={exp.company}
                          onChange={(e) =>
                            updateExperience(exp.id, {
                              company: e.target.value,
                            })
                          }
                          placeholder="Google"
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-[11px]">Location</Label>
                        <Input
                          value={exp.location}
                          onChange={(e) =>
                            updateExperience(exp.id, {
                              location: e.target.value,
                            })
                          }
                          placeholder="San Francisco, CA"
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px]">Type</Label>
                        <Select
                          value={exp.employmentType}
                          onValueChange={(v) =>
                            updateExperience(exp.id, {
                              employmentType: v as EmploymentType,
                            })
                          }
                        >
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="full-time">Full-time</SelectItem>
                            <SelectItem value="part-time">Part-time</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                            <SelectItem value="freelance">Freelance</SelectItem>
                            <SelectItem value="internship">
                              Internship
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-[11px]">Start Date</Label>
                        <Input
                          type="month"
                          value={exp.startDate}
                          onChange={(e) =>
                            updateExperience(exp.id, {
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
                          value={exp.endDate}
                          onChange={(e) =>
                            updateExperience(exp.id, {
                              endDate: e.target.value,
                            })
                          }
                          disabled={exp.currentlyWorking}
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={exp.currentlyWorking}
                        onCheckedChange={(checked) =>
                          updateExperience(exp.id, {
                            currentlyWorking: checked,
                            endDate: checked ? '' : exp.endDate,
                          })
                        }
                      />
                      <Label className="text-xs">Currently working here</Label>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[11px]">Description</Label>
                      <Textarea
                        value={exp.description}
                        onChange={(e) =>
                          updateExperience(exp.id, {
                            description: e.target.value,
                          })
                        }
                        placeholder="Describe your role and achievements..."
                        rows={3}
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[11px]">
                        Technologies (comma-separated)
                      </Label>
                      <Input
                        value={exp.technologies.join(', ')}
                        onChange={(e) =>
                          updateExperience(exp.id, {
                            technologies: e.target.value
                              .split(',')
                              .map((t) => t.trim())
                              .filter(Boolean),
                          })
                        }
                        placeholder="React, Node.js, PostgreSQL"
                        className="h-8 text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[11px]">Company Website</Label>
                      <Input
                        type="url"
                        value={exp.companyUrl}
                        onChange={(e) =>
                          updateExperience(exp.id, {
                            companyUrl: e.target.value,
                          })
                        }
                        placeholder="https://..."
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
