import { GraduationCap } from 'lucide-react'
import { motion } from 'framer-motion'

interface Education {
  period: string
  title: string
  company: string
  desc: string
}

interface EducationSectionProps {
  education: Education[]
}

export function EducationSection({ education }: EducationSectionProps) {
  return (
    <div className="flex-1">
      <div className="flex items-center gap-3 mb-8">
        <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Education</h3>
      </div>
      <div className="space-y-4">
        {education.map((edu, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            viewport={{ once: true, margin: '100px' }}
            className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-500/50 dark:border-slate-700/50 dark:bg-slate-800/50 dark:hover:border-blue-500/30 transition-colors"
          >
            <p className="font-semibold text-blue-600 dark:text-blue-300">{edu.title}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {edu.company} <span className="text-slate-300 dark:text-slate-500 mx-1">•</span> {edu.period}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{edu.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
