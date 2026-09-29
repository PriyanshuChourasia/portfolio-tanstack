import { useRef } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

import worksData from '@/data/works-data.json'

type Work = (typeof worksData.items)[number]

const works = worksData.items

type WorkDetails = {
  tagline?: string
  stack?: Array<{ group: string; items: Array<string> }>
}

function workDetails(work: Work): WorkDetails | undefined {
  return 'details' in work ? work.details : undefined
}

function workStack(work: Work): Array<string> {
  const stack = workDetails(work)?.stack ?? []
  return stack.flatMap((group) => group.items).slice(0, 8)
}

/* =========================================================
    PROJECT PANEL — one full-viewport parallax scene per project
========================================================= */

function ProjectPanel({ work, index }: { work: Work; index: number }) {
  const reducedMotion = useReducedMotion()
  const panelRef = useRef<HTMLElement>(null)

  // 0 when the panel enters from below, 1 when it leaves off the top
  const { scrollYProgress } = useScroll({
    target: panelRef,
    offset: ['start end', 'end start'],
  })

  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  })

  const still = (value: string) => (reducedMotion ? [value, value] : null)

  // Three layers at different speeds: image (slow), ghost number (fast), copy (medium)
  const imageY = useTransform(progress, [0, 1], still('0%') ?? ['-12%', '12%'])
  const ghostY = useTransform(progress, [0, 1], still('0%') ?? ['40%', '-40%'])
  const contentY = useTransform(progress, [0, 1], still('0px') ?? ['80px', '-80px'])
  const contentOpacity = useTransform(
    progress,
    [0, 0.3, 0.7, 1],
    reducedMotion ? [1, 1, 1, 1] : [0, 1, 1, 0],
  )

  const number = String(index + 1).padStart(2, '0')
  const stack = workStack(work)
  const hasLink = Boolean(work.link) && work.link !== '#'
  const alignRight = index % 2 === 1

  return (
    <section
      ref={panelRef}
      aria-label={work.title}
      className="relative flex h-screen w-full items-center overflow-hidden bg-[#070707]"
    >
      {/* Background image — slow layer */}
      <motion.div
        aria-hidden="true"
        style={{ y: imageY }}
        className="absolute inset-[-15%_0]"
      >
        <img
          src={work.image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover opacity-45"
        />
      </motion.div>

      {/* Readability scrims */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 ${
          alignRight
            ? 'bg-linear-to-l from-[#070707] via-[#070707]/80 to-[#070707]/20'
            : 'bg-linear-to-r from-[#070707] via-[#070707]/80 to-[#070707]/20'
        }`}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-[#070707] via-transparent to-[#070707]/70"
      />

      {/* Ghost index number — fast layer */}
      <motion.span
        aria-hidden="true"
        style={{ y: ghostY }}
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 select-none text-[40vw] font-black leading-none tracking-tighter text-white/[0.04] sm:text-[28vw] ${
          alignRight ? 'left-[-2vw]' : 'right-[-2vw]'
        }`}
      >
        {number}
      </motion.span>

      {/* Copy — medium layer */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className={`relative z-10 mx-auto flex w-full max-w-7xl px-6 sm:px-10 lg:px-16 ${
          alignRight ? 'justify-end text-right' : 'justify-start'
        }`}
      >
        <div
          className={`flex max-w-xl flex-col gap-5 ${
            alignRight ? 'items-end' : 'items-start'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-white/60">
              {number} / {String(works.length).padStart(2, '0')}
            </span>
            <span className="rounded-full border border-[#EF1D25]/50 bg-[#EF1D25]/10 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#EF1D25]">
              {work.category}
            </span>
          </div>

          <h3 className="text-3xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {work.title}
          </h3>

          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#BE2ED6]">
            {work.client}
          </p>

          <p className="text-sm leading-relaxed text-white/70 sm:text-base">
            {workDetails(work)?.tagline ?? work.description}
          </p>

          {stack.length > 0 && (
            <ul
              className={`flex flex-wrap gap-2 ${
                alignRight ? 'justify-end' : 'justify-start'
              }`}
            >
              {stack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-white/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-white/70"
                >
                  {tech}
                </li>
              ))}
            </ul>
          )}

          {hasLink && (
            <a
              href={work.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex w-fit items-center gap-2 rounded-full border border-[#EF1D25]/60 bg-[#EF1D25]/10 px-5 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#EF1D25] transition-colors duration-200 hover:bg-[#EF1D25]/20"
            >
              Visit live
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </motion.div>
    </section>
  )
}

/* =========================================================
    SECTION
========================================================= */

export function ProjectsParallax() {
  return (
    <section id="projects" className="relative w-full bg-[#070707]">
      {/* Intro */}
      <div className="relative mx-auto flex max-w-7xl flex-col px-6 pb-8 pt-24 sm:px-10 lg:px-16">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#EF1D25]">
          Selected Work
        </span>

        <h2 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
          Projects I&apos;ve{' '}
          <span className="bg-linear-to-r from-[#BE2ED6] to-[#7F4EA8] bg-clip-text text-transparent">
            worked on
          </span>{' '}
          &amp; made
        </h2>
      </div>

      {works.map((work, i) => (
        <ProjectPanel key={work.title} work={work} index={i} />
      ))}
    </section>
  )
}
