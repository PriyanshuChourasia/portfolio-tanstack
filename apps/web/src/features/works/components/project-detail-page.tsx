import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink, Briefcase, Tag } from 'lucide-react'
import worksData from '@/data/works-data.json'
import { Navbar } from '@/components/Navbar'

export function ProjectDetailPage({ projectId }: { projectId: number }) {
  const project = worksData.items[projectId - 1]

  if (!project) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="max-w-md text-center">
            <p className="text-sm uppercase tracking-widest text-cyan-500 mb-4">404</p>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Project not found
            </h1>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-white hover:bg-cyan-600 transition-colors"
            >
              <ArrowLeft size={16} />
              All projects
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="pt-20"
      >
        {/* Hero image banner */}
        <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden bg-slate-100 dark:bg-slate-900">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover opacity-60 dark:opacity-40"
          />
          <div className="absolute inset-0 bg-linear-to-t from-white dark:from-slate-950 via-white/30 dark:via-slate-950/50 to-transparent" />

          {/* Back link */}
          <div className="absolute top-6 left-4 sm:left-8">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 dark:border-white/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-cyan-400/60 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors"
            >
              <ArrowLeft size={14} />
              All Projects
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 pb-24">
          {/* Main card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900 shadow-xl dark:shadow-slate-900/50 overflow-hidden mb-8"
          >
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-0">
              {/* Left: info */}
              <div className="p-6 sm:p-10 lg:p-12">
                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    <Tag size={10} />
                    {project.category}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">Project {projectId}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold leading-tight text-slate-900 dark:text-white mb-4">
                  {project.title}
                </h1>

                {project.client && (
                  <div className="flex items-center gap-2 mb-6">
                    <Briefcase size={14} className="text-cyan-500 shrink-0" />
                    <span className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">
                      {project.client}
                    </span>
                  </div>
                )}

                <p className="text-base leading-8 text-slate-600 dark:text-slate-300 mb-8">
                  {project.description}
                </p>

                {/* CTA buttons */}
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/projects"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-transparent px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:border-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                  >
                    <ArrowLeft size={14} />
                    All projects
                  </Link>

                  {project.link && project.link !== '#' && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-cyan-500 hover:bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors"
                    >
                      <ExternalLink size={14} />
                      View live project
                    </a>
                  )}
                </div>
              </div>

              {/* Right: image */}
              <div className="border-t border-slate-100 dark:border-white/5 lg:border-t-0 lg:border-l bg-slate-50 dark:bg-slate-800/30 p-4 sm:p-6 flex items-center">
                <div className="w-full h-64 sm:h-80 lg:h-full min-h-[280px] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-100 dark:bg-slate-900">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation between projects */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-between gap-4"
          >
            {projectId > 1 && (
              <Link
                to="/projects/$id"
                params={{ id: String(projectId - 1) }}
                className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                ← Previous project
              </Link>
            )}
            <span className="flex-1" />
            {worksData.items[projectId] && (
              <Link
                to="/projects/$id"
                params={{ id: String(projectId + 1) }}
                className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                Next project →
              </Link>
            )}
          </motion.div>
        </div>
      </motion.main>
    </div>
  )
}
