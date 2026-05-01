  

import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import worksData from '@/data/works-data.json'

export function ProjectDetailPage({ projectId }: { projectId: number }) {
  const project = worksData.items[projectId - 1]

  if (!project) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-16 text-white sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:rounded-[28px] sm:p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Project not found</p>
          <h1 className="mt-4 text-2xl font-bold sm:text-3xl">This project does not exist.</h1>
          <Link
            to="/"
            className="mt-8 inline-flex w-full items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-200 sm:w-auto"
          >
            Back home
          </Link>
        </div>
      </main>
    )
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-slate-950 px-4 py-4 text-white sm:px-6 sm:py-16"
    >
      <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
       

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-slate-900/90 via-slate-900/75 to-cyan-950/35 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:rounded-4xl">
          <Link
          to="/"
          className="inline-flex items-center gap-2 py-5  px-6 text-sm font-semibold text-cyan-300 transition-colors hover:text-cyan-200"
        >
          <span aria-hidden="true">←</span>
          Back to projects
        </Link>
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-5 sm:p-8 md:p-12 lg:p-14">
              <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-cyan-300">
                <span>{project.category}</span>
                <span className="text-slate-500">•</span>
                <span>Project {projectId}</span>
              </div>

              <h1 className="mt-5 text-3xl font-bold leading-tight sm:mt-6 sm:text-4xl md:text-6xl">
                {project.title}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:mt-6 sm:text-lg sm:leading-8">
                {project.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
                <Link
                  to="/"
                  className="inline-flex w-full items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-200 transition-colors hover:border-cyan-300/40 hover:bg-cyan-400/20 sm:w-auto"
                >
                  Back to homepage
                </Link>
                {project.link && project.link !== '#' ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-white/20 hover:bg-white/10 sm:w-auto"
                  >
                    View live project
                  </a>
                ) : null}
              </div>
            </div>

            <div className="border-t border-white/10 bg-black/10 p-3 sm:p-4 lg:border-l lg:border-t-0 lg:p-6">
              <div className="h-64 overflow-hidden rounded-2xl border border-white/10 bg-slate-900 sm:h-80 sm:rounded-3xl lg:h-full">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.main>
  )
}