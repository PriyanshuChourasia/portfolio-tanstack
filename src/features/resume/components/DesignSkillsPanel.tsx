import { SkillBar } from './SkillBar'
import { Palette } from 'lucide-react'

interface DesignSkill {
  name: string
  value: number
}

interface DesignSkillsPanelProps {
  designSkills: DesignSkill[]
  progress: any
}

export function DesignSkillsPanel({ designSkills, progress }: DesignSkillsPanelProps) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 backdrop-blur-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <Palette className="w-5 h-5 text-cyan-500" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Design Skills</h3>
      </div>
      <div className="space-y-6">
        {designSkills.map((skill, i) => (
          <SkillBar key={i} label={skill.name} value={skill.value} progress={progress} />
        ))}
      </div>
    </div>
  )
}
