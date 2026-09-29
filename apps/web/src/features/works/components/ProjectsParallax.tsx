import { useRef, useState } from 'react'
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import type { MotionValue } from 'framer-motion'

import worksData from '@/data/works-data.json'

type Work = (typeof worksData.items)[number]

const works = worksData.items

type WorkDetails = {
  tagline?: string
  stack?: Array<{ group: string; items: Array<string> }>
}

type Shot = { src: string; alt: string; kind: string }

function workDetails(work: Work): WorkDetails | undefined {
  return 'details' in work ? work.details : undefined
}

function workTags(work: Work): Array<string> {
  return ('tags' in work ? work.tags : undefined) ?? []
}

function workStack(work: Work): Array<string> {
  const stack = workDetails(work)?.stack ?? []
  return stack.flatMap((group) => group.items).slice(0, 8)
}

// Projects without a screenshot gallery fall back to their cover image
function workShots(work: Work): Array<Shot> {
  const gallery: Array<Shot> | undefined =
    'gallery' in work ? work.gallery : undefined
  if (gallery?.length) return gallery
  return [{ src: work.image, alt: work.title, kind: 'desktop' }]
}

const toRad = (deg: number) => (deg * Math.PI) / 180

/* =========================================================
    SCREENSHOT WHEEL — scroll position turns the wheel
========================================================= */

// Degrees between neighbouring cards on the wheel
const WHEEL_STEP = 42

function WheelCard({
  shot,
  index,
  position,
  onSelect,
}: {
  shot: Shot
  index: number
  position: MotionValue<number>
  onSelect: (index: number) => void
}) {
  // Signed distance from the front of the wheel (0 = facing you)
  const offset = useTransform(position, (p) => index - p)

  const x = useTransform(
    offset,
    (o) => `${Math.sin(toRad(o * WHEEL_STEP)) * 62}%`,
  )
  const z = useTransform(
    offset,
    (o) => (Math.cos(toRad(o * WHEEL_STEP)) - 1) * 420,
  )
  const rotateY = useTransform(offset, (o) => -o * WHEEL_STEP)
  const scale = useTransform(
    offset,
    (o) => 1 - Math.min(Math.abs(o), 1) * 0.18,
  )
  const opacity = useTransform(offset, (o) => {
    const d = Math.abs(o)
    return d <= 1 ? 1 - d * 0.55 : Math.max(0, 0.45 - (d - 1) * 0.45)
  })
  const zIndex = useTransform(
    offset,
    (o) => 100 - Math.round(Math.abs(o) * 10),
  )

  const isMobile = shot.kind === 'mobile'

  return (
    <motion.figure
      onClick={() => onSelect(index)}
      style={{ x, z, rotateY, scale, opacity, zIndex }}
      className={`absolute inset-0 m-auto cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#0c0a10] shadow-[0_24px_64px_rgba(0,0,0,0.6)] ${
        isMobile ? 'aspect-[9/19] h-full' : 'aspect-[16/10] h-fit w-full'
      }`}
    >
      <img
        src={encodeURI(shot.src)}
        alt={shot.alt}
        loading="lazy"
        draggable={false}
        className="h-full w-full object-cover object-top"
      />
    </motion.figure>
  )
}

function ShotWheel({
  shots,
  title,
  position,
  active,
  onSelect,
}: {
  shots: Array<Shot>
  title: string
  position: MotionValue<number>
  active: number
  onSelect: (index: number) => void
}) {
  const count = shots.length

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={`${title} screenshots`}
      className="flex w-full flex-col items-center gap-6"
    >
      <div className="relative aspect-[4/3] w-full max-w-2xl select-none [perspective:1400px] [transform-style:preserve-3d]">
        {shots.map((shot, i) => (
          <WheelCard
            key={shot.src}
            shot={shot}
            index={i}
            position={position}
            onSelect={onSelect}
          />
        ))}
      </div>

      {count > 1 && (
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => onSelect(Math.max(0, active - 1))}
            disabled={active === 0}
            aria-label="Previous screenshot"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-[#BE2ED6] hover:bg-[#BE2ED6] hover:text-white disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2">
            {shots.map((shot, i) => (
              <button
                key={shot.src}
                type="button"
                onClick={() => onSelect(i)}
                aria-label={`Show screenshot ${i + 1}: ${shot.alt}`}
                aria-current={i === active}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === active
                    ? 'w-6 bg-[#EF1D25]'
                    : 'w-2 bg-white/25 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => onSelect(Math.min(count - 1, active + 1))}
            disabled={active === count - 1}
            aria-label="Next screenshot"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-[#BE2ED6] hover:bg-[#BE2ED6] hover:text-white disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      <p
        aria-live="polite"
        className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50"
      >
        {shots[active].alt}
      </p>
    </div>
  )
}

/* =========================================================
    PROJECT PANEL — pinned while scrolling turns its wheel
========================================================= */

function ProjectPanel({ work, index }: { work: Work; index: number }) {
  const reducedMotion = Boolean(useReducedMotion())
  const sectionRef = useRef<HTMLElement>(null)

  const shots = workShots(work)
  const count = shots.length

  // 0 when the panel pins to the top, 1 when it's about to unpin
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const rawPosition = useTransform(scrollYProgress, [0, 1], [0, count - 1])
  const smoothPosition = useSpring(rawPosition, {
    stiffness: 140,
    damping: 26,
    mass: 0.4,
  })
  const position = reducedMotion ? rawPosition : smoothPosition

  // Violet glow drifts slower than the page — the background parallax layer
  const glowY = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? ['0%', '0%'] : ['-10%', '10%'],
  )

  const [active, setActive] = useState(0)
  useMotionValueEvent(rawPosition, 'change', (p) => {
    setActive(Math.min(count - 1, Math.max(0, Math.round(p))))
  })

  // Buttons, dots and cards scroll the page to where that screenshot faces front
  const scrollToShot = (i: number) => {
    const el = sectionRef.current
    if (!el || count < 2) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const pinnedDistance = el.offsetHeight - window.innerHeight
    window.scrollTo({
      top: top + (i / (count - 1)) * pinnedDistance,
      behavior: reducedMotion ? 'auto' : 'smooth',
    })
  }

  const number = String(index + 1).padStart(2, '0')
  const stack = workStack(work)
  const hasLink = Boolean(work.link) && work.link !== '#'

  const reveal = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 60 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.3 },
      }

  return (
    <section
      ref={sectionRef}
      aria-label={work.title}
      className="relative w-full border-t border-white/5 bg-[#070707]"
      // One screen of scroll per screenshot, so each gets its turn at the front
      style={{ height: `${count * 100}vh` }}
    >
      <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden">
        {/* Violet background shade */}
        <motion.div
          aria-hidden="true"
          style={{ y: glowY }}
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute right-[-10%] top-1/2 h-[80vh] w-[70vw] -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(190,46,214,0.28),rgba(127,78,168,0.14)_55%,transparent)] blur-2xl" />
          <div className="absolute bottom-[-20%] left-[-15%] h-[60vh] w-[50vw] rounded-full bg-[radial-gradient(closest-side,rgba(93,50,142,0.3),transparent)] blur-2xl" />
        </motion.div>

        <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 sm:px-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:px-16">
          {/* About the project — left */}
          <motion.div
            {...reveal}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex flex-col items-start gap-5"
          >
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-white/60">
              {number} / {String(works.length).padStart(2, '0')}
            </span>

            <h3 className="text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl">
              {work.title}
            </h3>

            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#BE2ED6]">
              {work.client}
            </p>

            {workTags(work).length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {workTags(work).map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-[#BE2ED6]/50 bg-[#BE2ED6]/10 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#BE2ED6]"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}

            <p className="line-clamp-6 text-sm leading-relaxed text-white/70 sm:text-base">
              {workDetails(work)?.tagline ?? work.description}
            </p>

            {stack.length > 0 && (
              <ul className="flex flex-wrap gap-2">
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
          </motion.div>

          {/* Screenshot wheel — right */}
          <motion.div
            {...reveal}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
          >
            <ShotWheel
              shots={shots}
              title={work.title}
              position={position}
              active={active}
              onSelect={scrollToShot}
            />
          </motion.div>
        </div>
      </div>
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
