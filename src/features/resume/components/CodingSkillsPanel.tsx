import { ScrollCircularProgress } from './ScrollCircularProgress'
import { Code2 } from 'lucide-react'

interface CodingSkill {
  name: string
  value: number
}

interface CodingSkillsPanelProps {
  codingSkills: CodingSkill[]
  progress: any
}

export function CodingSkillsPanel({ codingSkills, progress }: CodingSkillsPanelProps) {
  return (
    <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/60 p-6 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <Code2 className="w-5 h-5 text-blue-400" />
        <h3 className="text-base font-bold text-white">Coding Skills</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {codingSkills.map((skill, i) => (
          <ScrollCircularProgress
            key={i}
            percentage={skill.value}
            label={skill.name}
            progress={progress}
          />
        ))}
      </div>
    </div>
  )
}
