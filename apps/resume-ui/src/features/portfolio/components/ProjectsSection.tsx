import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import type { PortfolioProject, ColorTheme } from '../types'

interface ProjectsSectionProps {
  projects: Array<PortfolioProject>
  theme: ColorTheme
}

export function ProjectsSection({ projects, theme }: ProjectsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const categories = ['All', ...new Set(projects.map((p) => p.category))]

  const filtered =
    activeCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === activeCategory)

  if (projects.length === 0) return null

  return (
    <section
      id="projects"
      className="relative py-24 sm:py-32"
      style={{ backgroundColor: theme.surface, color: theme.text }}
    >
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p
            className="mb-3 inline-block rounded-full px-4 py-1.5 text-sm font-medium tracking-wide"
            style={{
              backgroundColor: `${theme.accent}15`,
              color: theme.accent,
            }}
          >
            My Work
          </p>
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Featured Projects
          </h2>
          <div
            className="mx-auto mt-4 h-1 w-20 rounded-full"
            style={{ backgroundColor: theme.accent }}
          />
        </motion.div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-10 flex flex-wrap justify-center gap-2"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="rounded-full px-5 py-2 text-sm font-medium transition-all duration-300"
              style={{
                backgroundColor:
                  activeCategory === cat ? theme.accent : `${theme.textMuted}15`,
                color: activeCategory === cat ? '#fff' : theme.textMuted,
              }}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Project grid */}
        <motion.div
          layout
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative overflow-hidden rounded-xl"
                style={{ backgroundColor: theme.background }}
              >
                {/* Image */}
                <div className="relative aspect-[3/2] overflow-hidden">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div
                      className="flex size-full items-center justify-center text-2xl font-bold"
                      style={{ backgroundColor: theme.background, color: theme.textMuted }}
                    >
                      🖼️
                    </div>
                  )}
                  {/* Overlay */}
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-90"
                    style={{ backgroundColor: `${theme.accent}e0` }}
                  >
                    <a
                      href={project.link}
                      className="flex size-14 items-center justify-center rounded-full bg-white text-foreground shadow-lg transition-transform duration-300 hover:scale-110"
                    >
                      <ExternalLink className="size-5" />
                    </a>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <p className="mb-1 text-xs font-medium uppercase tracking-wider" style={{ color: theme.accent }}>
                    {project.category}
                  </p>
                  <h3 className="mb-2 text-base font-semibold">{project.title}</h3>
                  <p className="line-clamp-2 text-sm" style={{ color: theme.textMuted }}>
                    {project.description}
                  </p>

                  {/* Tags */}
                  {project.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md px-2 py-0.5 text-[10px] font-medium"
                          style={{
                            backgroundColor: `${theme.accent}12`,
                            color: theme.accent,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
