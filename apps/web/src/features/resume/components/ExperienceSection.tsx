import { Briefcase } from 'lucide-react'
import { motion } from 'framer-motion'

interface Experience {
  period: string
  title: string
  company: string
  desc: string
}

interface ExperienceSectionProps {
  experiences: Array<Experience>
}

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  return (
    <div className="flex-1">
      <div className="flex items-center gap-3 mb-8">
        <Briefcase className="w-6 h-6 text-primary text-primary-accent" />
        <h3 className="text-xl font-bold text-slate-900 text-foreground">
          Experience
        </h3>
      </div>
      <div className="space-y-4">
        {experiences.map((exp, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            viewport={{ once: true, margin: '100px' }}
            className="p-4 rounded-xl border border-slate-200 bg-white hover:border-primary-accent/50 border-border bg-card/50 dark:hover:border-primary-accent/30 transition-colors"
          >
            <p className="font-semibold text-primary text-primary-accent">
              {exp.title}
            </p>
            <p className="text-sm text-slate-500 text-muted-foreground mt-1">
              {exp.company}{' '}
              <span className="text-slate-300 dark:text-slate-500 mx-1">•</span>{' '}
              {exp.period}
            </p>
            <p className="text-sm text-slate-600 text-foreground mt-2">
              {exp.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
