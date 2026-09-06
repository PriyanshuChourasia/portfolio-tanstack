import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import worksData from '@/data/works-data.json'

type Category = string

const categories = ['All', 'Web Dev', 'Mobile Dev', 'Full Stack', 'Frontend', 'Backend']

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

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
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${active
          ? 'bg-[#EF1D25] border-[#EF1D25] text-white shadow-sm'
          : 'border-[#252525] text-[#858585] hover:border-[#4A1717] hover:text-[#F5F5F5]'
        }`}
    >
      {label}
    </button>
  )
}

function FeaturedProject({
  project,
  index,
}: {
  project: (typeof worksData.items)[0]
  index: number
}) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      className="relative rounded-2xl border border-[#252525] bg-[#0B0B0B] overflow-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Image — 55-60% visual area */}
        <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden bg-[#050505]">
          <motion.img
            src={project.image}
            alt={project.title}
            initial={{ opacity: 0, scale: 1.05 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-transparent" />
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center p-8 md:p-10 lg:p-12 bg-[#0B0B0B]">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#EF1D25]">
            0{index + 1}
          </span>

          {project.client && (
            <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-[#EF1D25]">
              {project.client}
            </p>
          )}

          <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F5F5F5] leading-tight">
            {project.title}
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-[#858585] line-clamp-3">
            {project.description}
          </p>

          {project.link && project.link !== '#' && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#EF1D25] hover:gap-3 transition-all duration-200"
            >
              View project
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function ProjectCard({
  project,
  index,
}: {
  project: (typeof worksData.items)[0]
  index: number
}) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -2 }}
      className="group relative flex flex-col rounded-xl border border-[#252525] bg-[#0B0B0B] overflow-hidden transition-all duration-200 hover:border-[#4A1717]"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#050505] shrink-0">
        <motion.img
          src={project.image}
          alt={project.title}
          initial={{ opacity: 0, scale: 1.05 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-103"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-transparent" />
      </div>

      {/* Info */}
      <div className="flex flex-col p-5 bg-[#0B0B0B]">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#EF1D25]">
          0{index + 1}
        </span>

        {project.client && (
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-[#EF1D25]">
            {project.client}
          </p>
        )}

        <h3 className="mt-2 text-base font-bold text-[#F5F5F5] leading-snug group-hover:text-[#EF1D25] transition-colors duration-200">
          {project.title}
        </h3>

        <p className="mt-2 text-xs leading-relaxed text-[#858585] line-clamp-2 flex-1">
          {project.description}
        </p>

        <p className="mt-3 text-[10px] font-mono text-[#555555]">
          {project.category}
        </p>

        {project.link && project.link !== '#' && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#EF1D25] hover:gap-3 transition-all duration-200"
          >
            View project
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </a>
        )}
      </div>
    </motion.div>
  )
}

export function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('All')

  const filtered =
    activeCategory === 'All'
      ? worksData.items
      : worksData.items.filter((p) => p.category === activeCategory)

  const featured = filtered[0]
  const remaining = filtered.slice(1)

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5]">
      <Navbar />

      {/* Header */}
      <section className="relative overflow-hidden bg-[#050505] pt-16 pb-12 px-6 sm:px-10">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-[#EF1D25]/[0.04] blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.3em] text-[#EF1D25]">
              Portfolio / Selected Work
            </span>

            <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[0.9] text-[#F5F5F5]">
              My Projects
            </h1>

            <p className="mt-4 text-sm text-[#858585] max-w-xl mx-auto">
              A selection of products and systems I&apos;ve built — from web portals and mobile applications to backend services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="px-6 sm:px-10 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <CategoryPill
                key={cat}
                label={cat}
                active={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="px-6 sm:px-10 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Featured project */}
          {featured && filtered.length > 0 && (
            <FeaturedProject project={featured} index={0} />
          )}

          {/* Remaining projects — 2 column grid */}
          {remaining.length > 0 && (
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
              {remaining.map((project, index) => (
                <ProjectCard
                  key={project.title}
                  project={project}
                  index={index}
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="mt-16 text-center">
              <p className="text-sm text-[#858585]">
                No projects in this category yet.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
