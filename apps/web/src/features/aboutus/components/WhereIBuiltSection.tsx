import { useId, useRef, useSyncExternalStore } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import {
  ArrowUpRight,
  Clock,
  Monitor,
  Smartphone,
  Sparkles,
} from 'lucide-react'

import workplacesData from '@/data/workplaces-data.json'

type Workplace = (typeof workplacesData.items)[number]
type Project = Workplace['projects'][number]

const workplaces = workplacesData.items

// One card per project, in JSON order. `placeIndex` picks the accent bar colour
// and marks where the chain switches workplace.
const works = workplaces.flatMap((place, placeIndex) =>
  place.projects.map((project) => ({ place, project, placeIndex })),
)

// Placeholder text is left in the JSON as a reminder — treat it as empty
const isFilled = (value?: string) =>
  Boolean(value && !value.trim().startsWith('TODO'))

// Alternates per workplace so the runs in the chain are easy to tell apart
const ACCENT_BARS = ['bg-[#441573]', 'bg-[#C19ADD]'] as const

// "Primesys Technologies" → "PT", "Freelance" → "F"
const monogram = (name: string) =>
  name
    .split(/\s+/)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

const STACK_CHIP =
  'rounded-full border border-gray-200 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-gray-600'

const DURATION_CHIP =
  'inline-flex shrink-0 items-center gap-1 rounded-full bg-[#C19ADD]/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-[#441573]'

const AI_BADGE =
  'inline-flex shrink-0 items-center gap-1 rounded-full border border-[#8353AD]/30 bg-linear-to-r from-[#C19ADD]/20 to-[#8353AD]/10 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-[#441573]'

/* =========================================================
    WORKPLACE MARK — monogram or logo, small
========================================================= */

function WorkplaceMark({ place }: { place: Workplace }) {
  if (isFilled(place.logo)) {
    return (
      <img
        src={place.logo}
        alt={`${place.name} logo`}
        className="h-8 w-8 shrink-0 rounded-lg object-contain"
      />
    )
  }

  return (
    <span
      aria-hidden="true"
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#C19ADD]/20 text-xs font-black text-[#441573]"
    >
      {monogram(place.name)}
    </span>
  )
}

/* =========================================================
    PROJECT CARD
========================================================= */

function ProjectCard({
  place,
  project,
  placeIndex,
  index,
  reducedMotion,
}: {
  place: Workplace
  project: Project
  placeIndex: number
  index: number
  reducedMotion: boolean
}) {
  const PlatformIcon = project.platform === 'mobile' ? Smartphone : Monitor
  const duration = isFilled(project.duration) ? project.duration : null
  const summary = isFilled(project.summary) ? project.summary : null
  const link = isFilled(project.link) ? project.link : null

  return (
    <motion.article
      initial={reducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-1 hover:border-[#C19ADD] md:p-8"
    >
      {/* Light violet glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[#C19ADD]/20 blur-3xl"
      />

      {/* Accent bar, coloured by workplace */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-6 left-0 w-[3px] rounded-r-full ${ACCENT_BARS[placeIndex % ACCENT_BARS.length]}`}
      />

      {/* Workplace tag */}
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <WorkplaceMark place={place} />

          <span className="min-w-0 truncate text-xs font-medium text-gray-500">
            {place.name} &middot; {place.role}
          </span>
        </div>

        <span className="shrink-0 pt-1 font-mono text-[10px] text-[#8353AD]/80">
          {place.period}
        </span>
      </div>

      {/* Step in the flow */}
      <span className="relative mt-5 block font-mono text-xs text-[#8353AD]">
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Project name */}
      <div className="relative mt-1 flex items-center gap-2.5">
        <PlatformIcon
          size={18}
          className="shrink-0 text-[#8353AD]"
          aria-hidden="true"
        />

        <h3 className="text-xl font-bold text-gray-900 md:text-2xl">
          {link ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-[#8353AD]"
            >
              {project.name}

              <ArrowUpRight size={14} className="shrink-0" aria-hidden="true" />
            </a>
          ) : (
            project.name
          )}
        </h3>
      </div>

      {/* Duration / AI badge */}
      {(duration || project.aiAssisted) && (
        <div className="relative mt-3 flex flex-wrap items-center gap-2">
          {duration && (
            <span className={DURATION_CHIP}>
              <Clock size={12} aria-hidden="true" />

              {duration}
            </span>
          )}

          {project.aiAssisted && (
            <span className={AI_BADGE}>
              <Sparkles size={12} aria-hidden="true" />

              AI-assisted
            </span>
          )}
        </div>
      )}

      {/* Summary */}
      {summary && (
        <p className="relative mt-4 leading-relaxed text-gray-600">{summary}</p>
      )}

      {/* Stack */}
      <ul className="relative mt-5 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <li key={tech} className={STACK_CHIP}>
            {tech}
          </li>
        ))}
      </ul>
    </motion.article>
  )
}

/* =========================================================
    LAYOUT HELPERS
========================================================= */

// Matches Tailwind's lg breakpoint — the zig-zag, drift and tilt are desktop-only
const LG_QUERY = '(min-width: 1024px)'

function useIsDesktop() {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(LG_QUERY)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    () => window.matchMedia(LG_QUERY).matches,
    () => false,
  )
}

// The spine sits in the middle column on desktop, at the left edge on mobile
const SPINE_POSITION = 'left-6 -translate-x-1/2 lg:left-1/2'
const ROW_GRID = 'grid grid-cols-[48px_1fr] lg:grid-cols-[1fr_80px_1fr]'
const SPINE_CELL = 'col-start-1 row-start-1 lg:col-start-2'

/* =========================================================
    CHAIN SPINE — pulled through at its own speed, lit up behind the flow dot
========================================================= */

// One tile = a front-facing link plus a side-on link that hooks into the next
// tile; the side link is drawn twice so it continues across the tile seam
function ChainPattern({ id, color }: { id: string; color: string }) {
  return (
    <svg className="h-full w-full" aria-hidden="true">
      <defs>
        <pattern id={id} width="28" height="48" patternUnits="userSpaceOnUse">
          <ellipse
            cx="14"
            cy="14"
            rx="8"
            ry="11"
            fill="none"
            stroke={color}
            strokeWidth="3"
          />
          <rect
            x="11"
            y="20"
            width="6"
            height="32"
            rx="3"
            fill="none"
            stroke={color}
            strokeWidth="3"
          />
          <rect
            x="11"
            y="-28"
            width="6"
            height="32"
            rx="3"
            fill="none"
            stroke={color}
            strokeWidth="3"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

function ChainSpine({
  listRef,
  reducedMotion,
}: {
  listRef: React.RefObject<HTMLOListElement | null>
  reducedMotion: boolean
}) {
  const id = useId()

  // Slide: the whole time the list is on screen
  const { scrollYProgress: pass } = useScroll({
    target: listRef,
    offset: ['start end', 'end start'],
  })
  // Flow: 0 when the list's top reaches the viewport centre, 1 when its bottom does
  const { scrollYProgress: flow } = useScroll({
    target: listRef,
    offset: ['start center', 'end center'],
  })

  const chainY = useTransform(pass, [0, 1], ['-8%', '8%'])
  const litClip = useTransform(
    flow,
    (p) => `inset(0 0 ${(1 - p) * 100}% 0)`,
  )
  const dotTop = useTransform(flow, [0, 1], ['0%', '100%'])

  return (
    <>
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 w-7 overflow-hidden ${SPINE_POSITION}`}
      >
        {/* Faded chain */}
        <motion.div
          style={reducedMotion ? undefined : { y: chainY }}
          className="absolute inset-x-0 -top-[10%] -bottom-[10%] opacity-40 will-change-transform"
        >
          <ChainPattern id={`${id}-base`} color="#C19ADD" />
        </motion.div>

        {/* Lit chain — revealed down to the flow dot */}
        <motion.div
          style={reducedMotion ? undefined : { clipPath: litClip }}
          className="absolute inset-0"
        >
          <motion.div
            style={reducedMotion ? undefined : { y: chainY }}
            className="absolute inset-x-0 -top-[10%] -bottom-[10%] will-change-transform"
          >
            <ChainPattern id={`${id}-lit`} color="#8353AD" />
          </motion.div>
        </motion.div>
      </div>

      {/* Flow dot — outside the clipped spine so its glow isn't cut off */}
      {!reducedMotion && (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 w-7 ${SPINE_POSITION}`}
        >
          <motion.span
            style={{ top: dotTop }}
            className="absolute left-1/2 z-20 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8353AD] shadow-[0_0_16px_#8353AD]"
          />
        </div>
      )}
    </>
  )
}

/* =========================================================
    CHAIN ROW — spine node + card drifting at its side's speed
========================================================= */

type Work = (typeof works)[number]

function ChainRow({
  work,
  index,
  isDesktop,
  reducedMotion,
}: {
  work: Work
  index: number
  isDesktop: boolean
  reducedMotion: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const nodeRef = useRef<HTMLSpanElement>(null)
  const onLeft = isDesktop && index % 2 === 0

  const { scrollYProgress: cardPass } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  })
  // The two sides drift at different speeds past the chain; mobile gets one gentle drift
  const drift = !isDesktop ? 20 : onLeft ? 40 : 70
  const y = useTransform(cardPass, [0, 1], [drift, -drift])
  const tilt = !isDesktop ? 0 : onLeft ? 2 : -2
  const rotate = useTransform(cardPass, [0, 0.5, 1], [-tilt, 0, tilt])

  // Node fills as it crosses the viewport centre — the same moment the flow dot reaches it
  const { scrollYProgress: nodePass } = useScroll({
    target: nodeRef,
    offset: ['start center', 'end center'],
  })
  const nodeFill = useTransform(nodePass, [0, 1], ['#ffffff', '#8353AD'])

  return (
    <li
      className={`relative ${ROW_GRID} ${index > 0 ? 'mt-10 lg:-mt-16' : ''}`}
    >
      {/* Node + short link out to the card */}
      <div className={`${SPINE_CELL} relative flex justify-center pt-12`}>
        <motion.span
          ref={nodeRef}
          aria-hidden="true"
          style={{ backgroundColor: reducedMotion ? '#8353AD' : nodeFill }}
          className="relative z-10 h-4 w-4 rounded-full border-2 border-[#8353AD]"
        />

        <span
          aria-hidden="true"
          className={`absolute top-[51px] flex ${
            onLeft
              ? 'right-1/2 mr-2 flex-row-reverse'
              : 'left-1/2 ml-2'
          }`}
        >
          <span className="h-2.5 w-4 rounded-full border-2 border-[#C19ADD]" />
          <span className="-ml-1 hidden h-2.5 w-4 rounded-full border-2 border-[#C19ADD] lg:block" />
        </span>
      </div>

      <motion.div
        ref={cardRef}
        style={reducedMotion ? undefined : { y, rotate }}
        className={`row-start-1 min-w-0 will-change-transform ${
          onLeft ? 'lg:col-start-1' : 'col-start-2 lg:col-start-3'
        }`}
      >
        <ProjectCard
          place={work.place}
          project={work.project}
          placeIndex={work.placeIndex}
          index={index}
          reducedMotion={reducedMotion}
        />
      </motion.div>
    </li>
  )
}

/* =========================================================
    SPINE MARKERS — "NOW" at the top, workplace name where the chain switches
========================================================= */

function NowMarker({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <li aria-hidden="true" className={`${ROW_GRID} mb-6`}>
      <div
        className={`${SPINE_CELL} relative z-10 flex flex-col items-center gap-1.5 bg-white py-1`}
      >
        <span className="relative flex h-2 w-2">
          {!reducedMotion && (
            <motion.span
              className="absolute inset-0 rounded-full bg-[#8353AD]"
              animate={{ scale: [1, 2], opacity: [0.6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
            />
          )}

          <span className="relative h-2 w-2 rounded-full bg-[#8353AD]" />
        </span>

        <span className="font-mono text-[10px] tracking-[0.25em] text-[#8353AD]">
          NOW
        </span>
      </div>
    </li>
  )
}

function SwitchMarker({ name }: { name: string }) {
  return (
    <li className={`${ROW_GRID} relative z-10 mt-10 lg:mt-6`}>
      <div className={`${SPINE_CELL} flex justify-start lg:justify-center`}>
        <span className="whitespace-nowrap rounded-full border border-[#C19ADD]/50 bg-white px-3 py-1 font-mono text-[10px] tracking-[0.25em] text-[#441573] uppercase">
          {name}
        </span>
      </div>
    </li>
  )
}

/* =========================================================
    SECTION
========================================================= */

export default function WhereIBuiltSection() {
  const reducedMotion = Boolean(useReducedMotion())
  const isDesktop = useIsDesktop()
  const listRef = useRef<HTMLOListElement>(null)

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
            Where I&apos;ve{' '}
            <span className="pr-1 text-[#8353AD] italic">built</span>
            <span className="text-[#8353AD]">.</span>
          </h2>

          <p className="mt-4 max-w-xl text-gray-600">
            The teams and clients I&apos;ve shipped software with.
          </p>
        </motion.header>

        {/* =====================================================
            PARALLAX CHAIN
        ===================================================== */}
        <ol ref={listRef} className="relative mx-auto max-w-6xl pb-16">
          <ChainSpine listRef={listRef} reducedMotion={reducedMotion} />

          <NowMarker reducedMotion={reducedMotion} />

          {works.map((work, i) => (
            <ChainRowWithSwitch
              key={`${work.place.name}-${work.project.name}`}
              work={work}
              index={i}
              isDesktop={isDesktop}
              reducedMotion={reducedMotion}
            />
          ))}
        </ol>
      </div>
    </section>
  )
}

// Adds the workplace pill on the spine wherever the chain moves to a new workplace
function ChainRowWithSwitch(props: {
  work: Work
  index: number
  isDesktop: boolean
  reducedMotion: boolean
}) {
  const { work, index } = props
  const switched = index > 0 && works[index - 1].placeIndex !== work.placeIndex

  return (
    <>
      {switched && <SwitchMarker name={work.place.name} />}
      <ChainRow {...props} />
    </>
  )
}
