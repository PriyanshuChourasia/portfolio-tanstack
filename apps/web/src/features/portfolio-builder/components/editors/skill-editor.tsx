import { Code2, Plus, Trash2 } from 'lucide-react'
import { useBuilder } from '../../store/portfolio-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'

export function SkillEditor() {
  const {
    activePortfolio,
    addSkillCategory,
    updateSkillCategory,
    deleteSkillCategory,
    addSkill,
    updateSkill,
    deleteSkill,
  } = useBuilder()

  if (!activePortfolio) return null
  const { skills } = activePortfolio

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-xs">Skill Categories</Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={addSkillCategory}
          className="h-7 text-xs gap-1"
        >
          <Plus className="h-3 w-3" />
          Add Category
        </Button>
      </div>

      {skills.length === 0 ? (
        <div className="text-center py-8 space-y-2">
          <Code2 className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto" />
          <p className="text-xs text-slate-400 dark:text-slate-500">
            No skills yet. Add your technical skills.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {skills.map((category) => (
            <Card key={category.id} className="p-3 space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  value={category.name}
                  onChange={(e) =>
                    updateSkillCategory(category.id, { name: e.target.value })
                  }
                  placeholder="Category Name"
                  className="h-8 text-sm font-medium"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-red-500 shrink-0"
                  onClick={() => deleteSkillCategory(category.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="space-y-2">
                {category.skills.map((skill) => (
                  <div key={skill.id} className="flex items-center gap-2">
                    <Input
                      value={skill.name}
                      onChange={(e) =>
                        updateSkill(category.id, skill.id, {
                          name: e.target.value,
                        })
                      }
                      placeholder="Skill name"
                      className="h-7 text-xs flex-1"
                    />
                    <div className="w-20">
                      <Slider
                        value={[skill.level ?? 80]}
                        onValueChange={([v]) =>
                          updateSkill(category.id, skill.id, { level: v })
                        }
                        max={100}
                        step={5}
                        className="h-4"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 w-7 text-right">
                      {skill.level ?? 80}%
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-slate-400 hover:text-red-500 shrink-0"
                      onClick={() => deleteSkill(category.id, skill.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addSkill(category.id)}
                  className="h-6 text-xs gap-1 text-slate-500"
                >
                  <Plus className="h-3 w-3" />
                  Add Skill
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
