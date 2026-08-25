import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { ParallaxCards } from './ProjectCard'

export function Projects() {
  return (
    <section
      id="projects"
      className="relative w-full bg-slate-50 dark:bg-background"
    >
      {/* Section heading */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-foreground">
            Featured <span className="text-primary-accent">Projects</span>
          </h2>
          <p className="mt-2 text-slate-500 text-muted-foreground text-sm">
            Scroll through to explore recent work
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          viewport={{ once: true }}
        >
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 border-border px-5 py-2 text-sm font-semibold text-slate-600 text-foreground hover:border-primary-accent hover:text-primary dark:hover:border-primary-accent hover:text-primary-accent transition-colors"
          >
            All projects
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>

      {/* Parallax card stack */}
      <div className="w-full py-4 sm:py-6 md:py-8">
        <ParallaxCards />
      </div>
    </section>
  )
}
