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
    <div className="rounded-2xl border border-slate-700/50 bg-linear-to-br from-slate-900/60 via-slate-800/40 to-slate-900/60 p-6 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <Palette className="w-5 h-5 text-cyan-400" />
        <h3 className="text-base font-bold text-white">Design Skills</h3>
      </div>
      <div className="space-y-6">
        {designSkills.map((skill, i) => (
          <SkillBar key={i} label={skill.name} value={skill.value} progress={progress} />
        ))}
      </div>
    </div>
  )
}
