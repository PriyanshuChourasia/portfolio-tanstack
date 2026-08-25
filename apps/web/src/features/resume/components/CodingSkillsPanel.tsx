import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Code2 } from 'lucide-react'

interface CodingSkill {
  name: string
  value: number
  color: string
}

interface CodingSkillsPanelProps {
  codingSkills: Array<CodingSkill>
}

export function CodingSkillsPanel({ codingSkills }: CodingSkillsPanelProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <Code2 className="h-4.5 w-4.5 text-primary" />
        </div>
        <h3 className="text-base font-bold text-foreground">Coding Skills</h3>
      </div>

      <div className="flex flex-col gap-4">
        {codingSkills.map((skill, i) => (
          <div key={i} className="group">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-foreground">
                {skill.name}
              </span>
              <motion.span
                className="text-xs font-semibold text-primary"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.2 + i * 0.08 }}
              >
                {skill.value}%
              </motion.span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary-bg">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${skill.color}, ${skill.color}aa)`,
                }}
                initial={{ width: 0 }}
                animate={inView ? { width: `${skill.value}%` } : { width: 0 }}
                transition={{
                  duration: 1,
                  delay: 0.1 + i * 0.08,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
