import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import worksData from '@/data/works-data.json'

export function Projects() {
  const projects = worksData.items.slice(0, 4)

  return (
    <section id="projects" className="py-20">
      <div className="max-w-2xl mx-auto px-6">

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Projects
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
          {projects.map((project, i) => (
            <div key={i}>
              <div className="flex items-start justify-between py-5 gap-4">
                <div>
                  <p className="text-base font-semibold text-slate-900 dark:text-white">
                    {project.title}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    {project.client}
                  </p>
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0 mt-1">
                  {project.category}
                </span>
              </div>
              {i < projects.length - 1 && (
                <hr className="border-slate-100 dark:border-slate-800/50" />
              )}
            </div>
          ))}
        </motion.div>

        <hr className="border-slate-200 dark:border-slate-800 mb-5" />

        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          All Projects <ArrowRight size={13} />
        </Link>
      </div>
    </section>
  )
}
