import { Plus, Trash2 } from 'lucide-react'
import { useBuilder } from '../../store/portfolio-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function AboutEditor() {
  const {
    activePortfolio,
    updateAbout,
    addAboutStat,
    updateAboutStat,
    removeAboutStat,
  } = useBuilder()
  if (!activePortfolio) return null
  const about = activePortfolio.about ?? {
    title: 'About Me',
    description: '',
    stats: [],
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label className="text-xs">Section Title</Label>
        <Input
          value={about.title}
          onChange={(e) => updateAbout({ title: e.target.value })}
          placeholder="About Me"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Description</Label>
        <Textarea
          value={about.description}
          onChange={(e) => updateAbout({ description: e.target.value })}
          placeholder="Tell visitors about yourself..."
          rows={4}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Statistics</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={addAboutStat}
            className="h-7 text-xs gap-1"
          >
            <Plus className="h-3 w-3" />
            Add
          </Button>
        </div>

        {about.stats.length === 0 && (
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-4">
            No statistics yet. Add stats to highlight your achievements.
          </p>
        )}

        <div className="space-y-2">
          {about.stats.map((stat) => (
            <Card key={stat.id} className="p-3">
              <div className="flex items-start gap-2">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <Input
                    value={stat.value}
                    onChange={(e) =>
                      updateAboutStat(stat.id, {
                        ...stat,
                        value: e.target.value,
                      })
                    }
                    placeholder="5+"
                    className="h-8 text-sm"
                  />
                  <Input
                    value={stat.label}
                    onChange={(e) =>
                      updateAboutStat(stat.id, {
                        ...stat,
                        label: e.target.value,
                      })
                    }
                    placeholder="Years Experience"
                    className="h-8 text-sm"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-red-500"
                  onClick={() => removeAboutStat(stat.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
