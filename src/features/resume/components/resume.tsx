import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import resumeData from '@/data/resume-data.json'

export function ResumeSection() {
  const experience = resumeData.experience

  return (
    <section id="experience" className="py-20">
      <div className="max-w-2xl mx-auto px-6">

        {/* Section header row */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Employment
          </h2>
          <span className="text-xs text-slate-400 dark:text-slate-500">Featured</span>
        </div>

        <hr className="border-slate-200 dark:border-slate-800" />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          {experience.map((exp, i) => (
            <div key={i}>
              <div className="flex items-start justify-between py-5 gap-4">
                <div>
                  <p className="text-base font-semibold text-slate-900 dark:text-white">
                    {exp.company}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    {exp.title}
                  </p>
                </div>
                <span className="text-sm text-slate-400 dark:text-slate-500 shrink-0 mt-0.5">
                  {exp.period}
                </span>
              </div>
              {i < experience.length - 1 && (
                <hr className="border-slate-100 dark:border-slate-800/50" />
              )}
            </div>
          ))}
        </motion.div>

        <hr className="border-slate-200 dark:border-slate-800 mb-5" />

        <a
          href="#"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          All Employment <ArrowRight size={13} />
        </a>
      </div>
    </section>
  )
}
