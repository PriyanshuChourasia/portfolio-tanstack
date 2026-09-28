import { useLayoutEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import type { MotionValue } from 'framer-motion'

import worksData from '@/data/works-data.json'

type Work = (typeof worksData.items)[number]

const works = worksData.items

/* =========================================================
    PROJECT CARD
========================================================= */

function ProjectCard({
  work,
  index,
  progress,
}: {
  work: Work
  index: number
  progress: MotionValue<number>
}) {
  // Image drifts against the scroll direction inside its frame
  const imageX = useTransform(progress, [0, 1], ['-8%', '8%'])

  return (
    <Link
      to="/projects/$id"
      params={{ id: String(index + 1) }}
      className="group relative flex h-[62vh] w-[82vw] shrink-0 flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0c0a10] shadow-[0_24px_64px_rgba(0,0,0,0.6)] transition-colors duration-300 hover:border-[#BE2ED6]/60 sm:w-[60vw] lg:w-[38vw]"
    >
      {/* Image with inner parallax */}
      <div className="relative flex-1 overflow-hidden">
        <motion.img
          src={work.image}
          alt={work.title}
          loading="lazy"
          style={{ x: imageX }}
          className="absolute inset-0 h-full w-full scale-[1.2] object-cover transition-transform duration-700 group-hover:scale-[1.26]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#0c0a10] via-[#0c0a10]/30 to-transparent" />

        <span className="absolute left-5 top-5 font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-white/70">
          {String(index + 1).padStart(2, '0')}
        </span>

        <span className="absolute right-5 top-5 rounded-full border border-[#EF1D25]/50 bg-[#EF1D25]/10 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#EF1D25] backdrop-blur-sm">
          {work.category}
        </span>
      </div>

      {/* Details */}
      <div className="relative flex items-end justify-between gap-4 p-5 sm:p-6">
        <div className="min-w-0">
          <h3 className="text-lg font-bold leading-snug text-white sm:text-xl">
            {work.title}
          </h3>
          <p className="mt-1 truncate font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
            {work.client}
          </p>
        </div>

        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors duration-300 group-hover:border-[#BE2ED6] group-hover:bg-[#BE2ED6] group-hover:text-white">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

/* =========================================================
    INTRO PANEL
========================================================= */

function IntroPanel() {
  return (
    <div className="flex w-[82vw] shrink-0 flex-col justify-center sm:w-[60vw] lg:w-[34vw]">
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#EF1D25]">
        Selected Work
      </span>

      <h2 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
        Projects I&apos;ve{' '}
        <span className="bg-linear-to-r from-[#BE2ED6] to-[#7F4EA8] bg-clip-text text-transparent">
          worked on
        </span>{' '}
        &amp; made
      </h2>

      <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60 sm:text-base">
        From client portals to full ERP suites — scroll to explore{' '}
        {works.length} builds.
      </p>

      <Link
        to="/projects"
        className="mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-[#EF1D25]/60 bg-[#EF1D25]/10 px-5 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#EF1D25] transition-colors duration-200 hover:bg-[#EF1D25]/20"
      >
        All Projects
        <ArrowUpRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  )
}

/* =========================================================
    SECTION
========================================================= */

export function ProjectsParallax() {
  const reducedMotion = useReducedMotion()
  // Held at 0 when motion is reduced, so the card images don't drift
  const stillProgress = useMotionValue(0)

  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  // Horizontal distance the track needs to travel, and the section height
  // that gives exactly that much vertical scroll while pinned.
  const [distance, setDistance] = useState(0)
  const [viewportH, setViewportH] = useState(0)

  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return

    const measure = () => {
      setDistance(
        Math.max(0, track.scrollWidth - window.innerWidth),
      )
      setViewportH(window.innerHeight)
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  })

  const trackX = useTransform(smooth, [0, 1], [0, -distance])
  const ghostX = useTransform(smooth, [0, 1], ['0%', '-25%'])
  const barScale = useTransform(smooth, [0, 1], [0, 1])

  /* Reduced motion — plain scrollable row, no pinning */
  if (reducedMotion) {
    return (
      <section
        id="work"
        className="relative w-full overflow-hidden bg-[#070707] py-24"
      >
        <div className="flex gap-6 overflow-x-auto px-6 pb-4 custom-scrollbar sm:px-10">
          <IntroPanel />
          {works.map((work, i) => (
            <ProjectCard
              key={work.title}
              work={work}
              index={i}
              progress={stillProgress}
            />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative w-full bg-[#070707]"
      style={{
        height: viewportH ? distance + viewportH : '400vh',
      }}
    >
      <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden">
        {/* Background — split purple glow like the hero */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[min(1050px,130vw)] -translate-x-1/2 -translate-y-1/2 opacity-40"
          style={{
            backgroundImage:
              'linear-gradient(110deg, #7F4EA8 0%, #BE2ED6 49.8%, #5D328E 50.2%, #42156F 100%)',
            maskImage:
              'radial-gradient(ellipse at center, black 0%, rgba(0,0,0,0.6) 45%, transparent 75%)',
            WebkitMaskImage:
              'radial-gradient(ellipse at center, black 0%, rgba(0,0,0,0.6) 45%, transparent 75%)',
          }}
        />

        {/* Slow ghost word — the back parallax layer */}
        <motion.span
          aria-hidden="true"
          style={{ x: ghostX }}
          className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[22vw] font-black uppercase leading-none tracking-tight text-white/[0.03]"
        >
          Projects · Projects
        </motion.span>

        {/* Card track — the front layer */}
        <motion.div
          ref={trackRef}
          style={{ x: trackX }}
          className="relative z-10 flex items-center gap-6 px-6 sm:gap-8 sm:px-10 lg:px-16"
        >
          <IntroPanel />
          {works.map((work, i) => (
            <ProjectCard
              key={work.title}
              work={work}
              index={i}
              progress={smooth}
            />
          ))}
        </motion.div>

        {/* Progress bar */}
        <div className="absolute bottom-8 left-6 right-6 z-10 h-px bg-white/10 sm:left-10 sm:right-10 lg:left-16 lg:right-16">
          <motion.div
            style={{ scaleX: barScale }}
            className="h-full origin-left bg-linear-to-r from-[#BE2ED6] to-[#EF1D25]"
          />
        </div>
      </div>
    </section>
  )
}
