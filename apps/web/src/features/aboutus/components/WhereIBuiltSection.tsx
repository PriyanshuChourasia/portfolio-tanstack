import { motion, useReducedMotion } from 'framer-motion'
import { MapPin } from 'lucide-react'

import workplacesData from '@/data/workplaces-data.json'

type Workplace = (typeof workplacesData.items)[number]

const workplaces = workplacesData.items

// "Primesys Technologies" → "PT", "Freelance" → "F"
const monogram = (name: string) =>
  name
    .split(/\s+/)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

/* =========================================================
    WORKPLACE CARD
========================================================= */

function WorkplaceCard({
  place,
  index,
  reducedMotion,
}: {
  place: Workplace
  index: number
  reducedMotion: boolean
}) {
  return (
    <motion.article
      initial={reducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.1 }}
      className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-1 hover:border-[#C19ADD] md:p-8"
    >
      {/* Light violet glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#C19ADD]/20 blur-3xl"
      />

      {/* Top row */}
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          {place.logo ? (
            <img
              src={place.logo}
              alt={`${place.name} logo`}
              className="h-12 w-12 shrink-0 rounded-xl object-contain"
            />
          ) : (
            <span
              aria-hidden="true"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#C19ADD]/20 font-black text-[#441573]"
            >
              {monogram(place.name)}
            </span>
          )}

          <div className="min-w-0">
            <h3 className="text-xl font-bold text-gray-900">{place.name}</h3>
            <p className="text-sm text-gray-500">{place.role}</p>
          </div>
        </div>

        <span className="shrink-0 pt-1 font-mono text-xs text-[#8353AD]">
          {place.period}
        </span>
      </div>

      {/* Location */}
      <p className="relative mt-4 flex items-center gap-1.5 text-sm text-gray-500">
        <MapPin size={14} className="text-gray-400" />
        {place.location}
      </p>

      <p className="relative mt-4 leading-relaxed text-gray-600">
        {place.summary}
      </p>

      {/* What I built */}
      <span className="relative mt-6 block font-mono text-[10px] uppercase tracking-[0.2em] text-gray-400">
        What I built
      </span>

      <ul className="relative mt-3 space-y-2">
        {place.built.map((project) => (
          <li
            key={project}
            className="flex items-center gap-2.5 text-sm text-gray-800"
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#8353AD]" />
            {project}
          </li>
        ))}
      </ul>

      {/* Stack */}
      <ul className="relative mt-6 flex flex-wrap gap-2">
        {place.stack.map((tech) => (
          <li
            key={tech}
            className="rounded-full border border-gray-200 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-gray-600"
          >
            {tech}
          </li>
        ))}
      </ul>
    </motion.article>
  )
}

/* =========================================================
    SECTION
========================================================= */

export default function WhereIBuiltSection() {
  const reducedMotion = Boolean(useReducedMotion())

  return (
    <section
      id="workplaces"
      className="relative w-full scroll-mt-24 border-t border-gray-200 bg-white pb-20 pt-10 md:pb-28 md:pt-14"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10 lg:px-12">
        {/* =====================================================
            HEADER
        ===================================================== */}
        <motion.header
          initial={reducedMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-10"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-gray-500">
            03 / Workplaces
          </span>

          <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] text-gray-900 md:text-5xl lg:text-6xl">
            Where I&apos;ve built
            <span className="text-gray-400">.</span>
          </h2>

          <p className="mt-4 max-w-xl text-gray-600">
            The teams and clients I&apos;ve shipped software with.
          </p>
        </motion.header>

        {/* =====================================================
            CARDS
        ===================================================== */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {workplaces.map((place, i) => (
            <WorkplaceCard
              key={place.name}
              place={place}
              index={i}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
