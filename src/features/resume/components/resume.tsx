import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import resumeData from '@/data/resume-data.json'

export function ResumeSection() {
  const experience = resumeData.experience

  return (
    <section id="experience" className="py-20">
      <div className="max-w-2xl mx-auto px-6">

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-500">
            Employment
          </h2>
          <span className="text-xs text-emerald-600/50 dark:text-emerald-500/50">Featured</span>
        </div>

        <hr className="border-emerald-100 dark:border-[#1a2e22]" />

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
                  <p className="text-base font-semibold text-emerald-950 dark:text-emerald-50">
                    {exp.company}
                  </p>
                  <p className="text-sm text-emerald-700/60 dark:text-emerald-300/50 mt-0.5">
                    {exp.title}
                  </p>
                </div>
                <span className="text-sm text-emerald-600/50 dark:text-emerald-400/50 shrink-0 mt-0.5">
                  {exp.period}
                </span>
              </div>
              {i < experience.length - 1 && (
                <hr className="border-emerald-50 dark:border-[#1a2e22]/60" />
              )}
            </div>
          ))}
        </motion.div>

        <hr className="border-emerald-100 dark:border-[#1a2e22] mb-5" />

        <a
          href="#"
          className="inline-flex items-center gap-1.5 text-sm text-emerald-600/60 dark:text-emerald-400/50 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
        >
          All Employment <ArrowRight size={13} />
        </a>
      </div>
    </section>
  )
}
