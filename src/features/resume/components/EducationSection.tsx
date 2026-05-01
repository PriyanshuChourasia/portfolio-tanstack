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
        <GraduationCap className="w-6 h-6 text-blue-400" />
        <h3 className="text-xl font-bold text-white">Education</h3>
      </div>
      <div className="space-y-6">
        {education.map((edu, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.05 }}
            viewport={{ once: true, margin: '100px' }}
            className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/30 transition-colors"
          >
            <p className="font-semibold text-blue-300">{edu.title}</p>
            <p className="text-sm text-slate-400 mt-1">
              {edu.company} <span className="text-slate-600">•</span> {edu.period}
            </p>
            <p className="text-sm text-slate-300 mt-2">{edu.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
