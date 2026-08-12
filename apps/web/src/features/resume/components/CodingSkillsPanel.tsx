import { ScrollCircularProgress } from './ScrollCircularProgress'
import { Code2 } from 'lucide-react'

interface CodingSkill {
  name: string
  value: number
  color: string
}

interface CodingSkillsPanelProps {
  codingSkills: CodingSkill[]
  progress: any
}

export function CodingSkillsPanel({ codingSkills, progress }: CodingSkillsPanelProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/80 dark:border-slate-700/50 dark:bg-slate-900/60 backdrop-blur-sm p-6">
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{
          background: `linear-gradient(to right, ${codingSkills.map((s) => s.color).join(', ')})`,
        }}
      />
      <div className="flex items-center gap-3 mb-6">
        <Code2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Coding Skills</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {codingSkills.map((skill, i) => (
          <ScrollCircularProgress
            key={i}
            percentage={skill.value}
            label={skill.name}
            progress={progress}
            color={skill.color}
          />
        ))}
      </div>
    </div>
  )
}
