import { motion } from 'framer-motion'

export function AboutSection() {
  return (
    <section id="about" className="mx-auto max-w-5xl px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-sm font-medium uppercase tracking-widest text-neutral-400">
          About
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900">
          Priyanshu Chourasia
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-neutral-500">
          Full stack developer building modern, performant web applications.
          I write about the things I build and the lessons I pick up along the
          way.
        </p>
      </motion.div>
    </section>
  )
}
