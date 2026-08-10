import { Briefcase } from 'lucide-react'
import { motion } from 'framer-motion'

interface Experience {
  period: string
  title: string
  company: string
  desc: string
}

interface ExperienceSectionProps {
  experiences: Experience[]
}

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  return (
    <div className="flex-1">
      <div className="flex items-center gap-3 mb-8">
        <Briefcase className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Experience</h3>
      </div>
      <div className="space-y-4">
        {experiences.map((exp, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            viewport={{ once: true, margin: '100px' }}
            className="p-4 rounded-xl border border-slate-200 bg-white hover:border-cyan-500/50 dark:border-slate-700/50 dark:bg-slate-800/50 dark:hover:border-cyan-500/30 transition-colors"
          >
            <p className="font-semibold text-cyan-600 dark:text-cyan-400">{exp.title}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {exp.company} <span className="text-slate-300 dark:text-slate-500 mx-1">•</span> {exp.period}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{exp.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
