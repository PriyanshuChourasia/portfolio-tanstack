import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import worksData from '@/data/works-data.json'

type Category = string

function CategoryPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
        active
          ? 'bg-cyan-500 border-cyan-500 text-white shadow-lg shadow-cyan-500/25'
          : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-400'
      }`}
    >
      {label}
    </motion.button>
  )
}

function ProjectCard({ project, index, id }: { project: typeof worksData.items[0]; index: number; id: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      viewport={{ once: true }}
      className="group flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900 overflow-hidden hover:border-cyan-400/50 dark:hover:border-cyan-500/40 hover:shadow-lg dark:hover:shadow-cyan-500/5 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-white/90 dark:bg-slate-900/90 backdrop-blur border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300">
            {project.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {project.client && (
          <p className="text-[11px] uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-semibold mb-2">
            {project.client}
          </p>
        )}

        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
          {project.title}
        </h3>

        <p className="text-sm leading-6 text-slate-500 dark:text-slate-400 flex-1 mb-5">
          {project.description}
        </p>

        <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Link
            to="/projects/$id"
            params={{ id: String(id) }}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
          >
            View details
            <ArrowRight size={14} />
          </Link>

          {project.link && project.link !== '#' && (
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              className="ml-auto inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <ExternalLink size={13} />
              Live
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('All')

  const categories = ['All', ...worksData.categories.filter((c) => c !== 'All')]

  const filtered = activeCategory === 'All'
    ? worksData.items
    : worksData.items.filter((p) => p.category === activeCategory)

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar />

      <main className="pt-24 pb-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="inline-block mb-4 px-4 py-2 rounded-full border border-cyan-400/30 bg-cyan-50 dark:bg-cyan-400/10 text-xs font-semibold uppercase tracking-widest text-cyan-600 dark:text-cyan-300">
              Portfolio
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              My <span className="text-cyan-500">Projects</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto">
              A selection of products and systems I&apos;ve built — from web portals to mobile apps and backend services.
            </p>
          </motion.div>

          {/* Category filter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((cat) => (
              <CategoryPill
                key={cat}
                label={cat}
                active={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
              />
            ))}
          </motion.div>

          {/* Projects grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-24 text-slate-400 dark:text-slate-500">
              No projects in this category yet.
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((project, index) => {
                const originalIndex = worksData.items.indexOf(project)
                return (
                  <ProjectCard
                    key={project.title}
                    project={project}
                    index={index}
                    id={originalIndex + 1}
                  />
                )
              })}
            </motion.div>
          )}

          {/* Back link */}
          <div className="mt-16 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
