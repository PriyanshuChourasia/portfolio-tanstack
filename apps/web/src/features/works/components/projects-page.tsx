import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { ArrowRight, ExternalLink, Plus } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import worksData from '@/data/works-data.json'

type Category = string

const CornerMark = ({ className }: { className: string }) => (
  <Plus
    className={`absolute h-4 w-4 text-white/40 ${className}`}
    strokeWidth={1.5}
  />
)

function CategoryPill({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
        active
          ? 'bg-primary-accent border-primary-accent text-white shadow-lg shadow-primary-accent/25'
          : 'border-slate-300 border-border text-slate-600 text-muted-foreground hover:border-primary-accent hover:text-primary hover:text-primary-accent'
      }`}
    >
      {label}
    </motion.button>
  )
}

function ProjectCard({
  project,
  index,
  id,
}: {
  project: (typeof worksData.items)[0]
  index: number
  id: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      viewport={{ once: true }}
      className="group flex flex-col rounded-2xl border border-slate-200 border-border bg-white dark:bg-card overflow-hidden hover:border-primary-accent/50 dark:hover:border-primary-accent/40 hover:shadow-lg dark:hover:shadow-primary-accent/5 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-slate-100 bg-card shrink-0">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-white/90 dark:bg-card/90 backdrop-blur border border-slate-200/80 border-border/80 text-slate-700 text-foreground">
            {project.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {project.client && (
          <p className="text-[11px] uppercase tracking-widest text-primary text-primary-accent font-semibold mb-2">
            {project.client}
          </p>
        )}

        <h3 className="text-lg font-bold text-slate-900 text-foreground mb-3 group-hover:text-primary dark:group-hover:text-primary-accent transition-colors">
          {project.title}
        </h3>

        <p className="text-sm leading-6 text-slate-500 text-muted-foreground flex-1 mb-5">
          {project.description}
        </p>

        <div className="flex items-center gap-3 pt-4 border-t border-slate-100 border-border">
          <Link
            to="/projects/$id"
            params={{ id: String(id) }}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary text-primary-accent hover:text-primary hover:text-primary-accent transition-colors"
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

  const filtered =
    activeCategory === 'All'
      ? worksData.items
      : worksData.items.filter((p) => p.category === activeCategory)

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white dark:bg-background">
      <Navbar />

      {/* Banner */}
      <section className="relative w-full shrink-0 overflow-hidden bg-background pt-28 pb-16 px-6 sm:px-10">
        <div className="absolute inset-0 bg-linear-to-b from-slate-900 via-slate-950 to-slate-950" />

        <div className="hidden sm:block absolute inset-6 lg:inset-10 pointer-events-none">
          <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/10" />
          <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/10" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10" />
          <CornerMark className="-left-2 -top-2" />
          <CornerMark className="-right-2 -top-2" />
          <CornerMark className="-left-2 -bottom-2" />
          <CornerMark className="-right-2 -bottom-2" />
        </div>

        <div
          aria-hidden
          className="hidden lg:flex absolute inset-0 items-center justify-center select-none pointer-events-none"
        >
          <span className="text-[9rem] xl:text-[11rem] font-black uppercase tracking-tight text-white/[0.06] leading-none">
            Projects
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center max-w-2xl mx-auto"
        >
          <span className="inline-block mb-4 px-4 py-2 rounded-full border border-primary-accent/30 bg-primary-accent/10 text-xs font-semibold uppercase tracking-widest text-primary-accent">
            Portfolio
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[0.9] text-white mb-4">
            My Projects
          </h1>
          <p className="text-slate-300 text-sm sm:text-base">
            A selection of products and systems I&apos;ve built — from web
            portals to mobile apps and backend services.
          </p>
        </motion.div>
      </section>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 pb-10 custom-scrollbar">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="relative z-10 -mt-6 mb-8 flex flex-wrap justify-center gap-3 rounded-2xl border border-slate-200 border-border bg-white/95 dark:bg-card/95 backdrop-blur-md shadow-xl py-3 px-4"
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

          <div className="mt-10 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-slate-500 text-muted-foreground hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
