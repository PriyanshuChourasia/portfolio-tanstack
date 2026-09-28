import { useEffect, useRef, useState } from 'react'
import {
  
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform
} from 'framer-motion'
import { Link } from '@tanstack/react-router'
import {
  Briefcase,
  Folder,
  Github,
  Home,
  Lightbulb,
  Linkedin,
  Mail,
  Phone,
  Send,
  Twitter,
  User,
} from 'lucide-react'
import {
  SiAnthropic,
  SiCss,
  SiDocker,
  SiFlutter,
  SiGit,
  SiGo,
  SiHtml5,
  SiJavascript,
  SiLaravel,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenai,
  SiPostgresql,
  SiPython,
  SiReact,
  SiSpringboot,
  SiTailwindcss,
  SiTypescript,
} from 'react-icons/si'
import { FaJava } from 'react-icons/fa6'

import socialLinks from '../data/social-link.json'
import resumeData from '../data/resume-data.json'
import { HaveAnIdeaModal } from './HaveAnIdeaModal'
import type {MotionValue} from 'framer-motion';

function seeded(seed: number) {
  const x =
    Math.sin(seed * 127.1 + 311.7) *
    43758.5453

  return x - Math.floor(x)
}

const isNarrow =
  typeof window !== 'undefined'
    ? window.innerWidth < 640
    : false

const stars = Array.from(
  {
    length: isNarrow ? 24 : 70,
  },
  (_, i) => ({
    x: seeded(i * 37.1 + 11) * 100,
    y: seeded(i * 41.3 + 12) * 100,
    s: 1 + (i % 3),
    twinkle: i % 6 === 3,
    o: 0.35 + (i % 5) * 0.13,
  }),
)

const bgDecorIcons: Array<React.ComponentType<any>> = [
  SiReact,
  SiTypescript,
  SiJavascript,
  SiNodedotjs,
  SiPython,
  SiNextdotjs,
  SiTailwindcss,
  SiDocker,
  SiGit,
  SiHtml5,
  SiCss,
  FaJava,
  SiGo,
  SiMongodb,
  SiMysql,
  SiPostgresql,
  SiSpringboot,
  SiLaravel,
  SiFlutter,
  SiOpenai,
  SiAnthropic,
]

const bgDecorWords = ['Freelancer', 'Developer', 'Engineer']

type BgDecorItem =
  | { type: 'icon'; Icon: React.ComponentType<any> }
  | { type: 'word'; label: string }

const bgDecorItems: Array<BgDecorItem> = [
  ...bgDecorWords.flatMap((label) => [
    { type: 'word' as const, label },
    { type: 'word' as const, label },
    { type: 'word' as const, label },
  ]),
  // Icon set duplicated to give the watermark denser coverage.
  ...bgDecorIcons.map((Icon) => ({
    type: 'icon' as const,
    Icon,
  })),
  ...bgDecorIcons.map((Icon) => ({
    type: 'icon' as const,
    Icon,
  })),
]

// Grid-cell distribution over a cell pool larger than the item count, so
// duplicates/neighbors always land with unused buffer cells between them
// instead of clumping into one seeded-random hot spot.
const BG_DECOR_COLS = 9
const BG_DECOR_CELL_BUFFER = 1.25
const BG_DECOR_ROWS = Math.ceil(
  (bgDecorItems.length * BG_DECOR_CELL_BUFFER) / BG_DECOR_COLS,
)
const BG_DECOR_TOTAL_CELLS = BG_DECOR_COLS * BG_DECOR_ROWS

const bgDecorCellPool = Array.from(
  { length: BG_DECOR_TOTAL_CELLS },
  (_, i) => i,
).sort(
  (a, b) =>
    seeded(a * 61.3 + 211) -
    seeded(b * 61.3 + 211),
)

const bgDecorLayout = bgDecorItems.map((_, i) => {
  const cell = bgDecorCellPool[i]

  const col = cell % BG_DECOR_COLS
  const row = Math.floor(cell / BG_DECOR_COLS)

  const cellW = 100 / BG_DECOR_COLS
  const cellH = 100 / BG_DECOR_ROWS

  const jitterX = (seeded(i * 71.3 + 21) - 0.5) * cellW * 0.7
  const jitterY = (seeded(i * 83.7 + 22) - 0.5) * cellH * 0.7

  return {
    x: Math.min(
      95,
      Math.max(5, col * cellW + cellW / 2 + jitterX),
    ),
    y: Math.min(
      95,
      Math.max(5, row * cellH + cellH / 2 + jitterY),
    ),
    rotate: (seeded(i * 97.1 + 23) - 0.5) * 22,
    scale: 0.85 + seeded(i * 61.9 + 24) * 0.5,
    accent: i % 2 === 0,
  }
})

/* =========================================================
    MACOS-STYLE DOCK
========================================================= */

const DOCK_BASE_SIZE = 46
const DOCK_MAGNIFY_SIZE = 78
const DOCK_MAGNIFY_RANGE = 130

type DockIconEntry = {
  kind: 'item'
  key: string
  label: string
  icon: React.ComponentType<{
    className?: string
    strokeWidth?: number
  }>
  href?: string
  to?: '/projects'
  external?: boolean
  active?: boolean
  onClick?: () => void
}

type DockEntry =
  | DockIconEntry
  | { kind: 'divider'; key: string }

function DockItem({
  entry,
  mouseX,
  reduced,
}: {
  entry: DockIconEntry
  mouseX: MotionValue<number>
  reduced: boolean | null
}) {
  const ref = useRef<HTMLDivElement>(null)

  const Icon = entry.icon

  const distance = useTransform(
    mouseX,
    (val: number) => {
      const bounds =
        ref.current?.getBoundingClientRect()

      if (!bounds) {
        return Number.POSITIVE_INFINITY
      }

      return (
        val - bounds.x - bounds.width / 2
      )
    },
  )

  const sizeRaw = useTransform(
    distance,
    [
      -DOCK_MAGNIFY_RANGE,
      0,
      DOCK_MAGNIFY_RANGE,
    ],
    reduced
      ? [
          DOCK_BASE_SIZE,
          DOCK_BASE_SIZE,
          DOCK_BASE_SIZE,
        ]
      : [
          DOCK_BASE_SIZE,
          DOCK_MAGNIFY_SIZE,
          DOCK_BASE_SIZE,
        ],
  )

  const size = useSpring(sizeRaw, {
    mass: 0.1,
    stiffness: 180,
    damping: 13,
  })

  return (
    // Only the width takes part in layout; the height stays at the base size
    // and the magnified icon grows upward out of it, so hovering the dock
    // never changes its height or shifts the rest of the page.
    <motion.div
      ref={ref}
      style={{
        width: size,
        height: DOCK_BASE_SIZE,
      }}
      className="group relative"
    >
      <motion.div
        style={{ height: size }}
        className="absolute inset-x-0 bottom-0"
      >
      {entry.to ? (
        <Link
          to={entry.to}
          title={entry.label}
          aria-label={entry.label}
          aria-current={
            entry.active ? 'page' : undefined
          }
          className="block h-full w-full cursor-pointer rounded-[26%] outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <DockIconFace
            icon={<Icon className="h-[55%] w-[55%] text-white/90" strokeWidth={1.75} />}
            label={entry.label}
            active={entry.active}
          />
        </Link>
      ) : entry.href ? (
        <a
          href={entry.href}
          title={entry.label}
          aria-label={entry.label}
          aria-current={
            entry.active ? 'page' : undefined
          }
          {...(entry.external
            ? {
                target: '_blank',
                rel: 'noopener noreferrer',
              }
            : {})}
          className="block h-full w-full cursor-pointer rounded-[26%] outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <DockIconFace
            icon={<Icon className="h-[55%] w-[55%] text-white/90" strokeWidth={1.75} />}
            label={entry.label}
            active={entry.active}
          />
        </a>
      ) : (
        <button
          type="button"
          onClick={entry.onClick}
          title={entry.label}
          aria-label={entry.label}
          className="block h-full w-full cursor-pointer rounded-[26%] outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <DockIconFace
            icon={<Icon className="h-[55%] w-[55%] text-white/90" strokeWidth={1.75} />}
            label={entry.label}
            active={entry.active}
          />
        </button>
      )}
      </motion.div>
    </motion.div>
  )
}

function DockIconFace({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode
  label: string
  active?: boolean
}) {
  return (
    <>
      <span className="flex h-full w-full items-center justify-center rounded-[26%] border border-[#BE2ED6]/20 bg-white/[0.06] shadow-[0_4px_16px_rgba(0,0,0,0.35)] backdrop-blur-md transition-colors duration-200 group-hover:border-[#BE2ED6] group-hover:bg-[#BE2ED6] group-focus-within:border-[#BE2ED6] group-focus-within:bg-[#BE2ED6]">
        {icon}
      </span>

      {/* Tooltip */}
      <span
        className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-[#BE2ED6]/30 bg-[#1a0b2e]/95 px-2 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-white/85 opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {label}
      </span>

      {/* macOS "running app" dot */}
      {active && (
        <span className="absolute -bottom-2.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#BE2ED6] shadow-[0_0_6px_#BE2ED6]" />
      )}
    </>
  )
}

/* =========================================================
    MACOS-STYLE EXPERIENCE WIDGET
========================================================= */

// Earliest start year across all roles, e.g. "2022 - Present" -> 2022
const careerStartYear = Math.min(
  ...resumeData.experience.map((e) =>
    parseInt(e.period, 10),
  ),
)
const yearsOfExperience =
  new Date().getFullYear() - careerStartYear

const RING_RADIUS = 34
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

// Glass card with a gradient border that sweeps around it continuously
function AnimatedBorderCard({
  children,
  delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) {
  return (
    <div className="relative overflow-hidden rounded-[22px] bg-white/10 p-[1.5px] shadow-[0_16px_48px_rgba(0,0,0,0.55)]">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[250%] -translate-x-1/2 -translate-y-1/2 animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0%,#BE2ED6_12%,#EF1D25_25%,transparent_40%,transparent_60%,#7C41A8_75%,#BE2ED6_88%,transparent_100%)] motion-reduce:animate-none"
        style={{ animationDelay: `${delay}s` }}
      />
      <div className="relative h-full rounded-[20.5px] bg-[#0c0a10]/95 backdrop-blur-xl">
        {children}
      </div>
    </div>
  )
}

function ExperienceWidget({
  reduced,
}: {
  reduced: boolean | null
}) {
  return (
    <div className="flex w-32 flex-col items-center gap-1.5 h-full p-3 sm:w-40 sm:p-4">
      <span className="self-start font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-white/60">
        Experience
      </span>

      <div className="relative h-20 w-20 sm:h-24 sm:w-24">
        <svg
          viewBox="0 0 80 80"
          className="h-full w-full -rotate-90"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="exp-ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#BE2ED6" />
              <stop offset="100%" stopColor="#EF1D25" />
            </linearGradient>
          </defs>
          <circle
            cx="40"
            cy="40"
            r={RING_RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="7"
          />
          <motion.circle
            cx="40"
            cy="40"
            r={RING_RADIUS}
            fill="none"
            stroke="url(#exp-ring)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={RING_CIRCUMFERENCE}
            initial={{
              strokeDashoffset: reduced ? 0 : RING_CIRCUMFERENCE,
            }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 1.6, ease: 'easeOut', delay: 0.3 }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold leading-none text-white sm:text-3xl">
            {yearsOfExperience}+
          </span>
          <span className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.2em] text-white/60">
            Years
          </span>
        </div>
      </div>

      <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/45">
        Since {careerStartYear}
      </span>
    </div>
  )
}

function ClockWidget() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const timeParts = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).formatToParts(now)
  const time = timeParts
    .filter((p) => p.type !== 'dayPeriod')
    .map((p) => p.value)
    .join('')
    .trim()
  const meridiem = timeParts.find(
    (p) => p.type === 'dayPeriod',
  )?.value

  return (
    <div className="flex w-32 flex-col h-full p-3 sm:w-40 sm:p-4">
      <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-[#EF1D25]">
        {now.toLocaleDateString('en-US', { weekday: 'long' })}
      </span>

      <div className="flex flex-1 items-center">
        <span className="text-3xl font-bold leading-none tabular-nums text-white sm:text-4xl">
          {time}
        </span>
        <span className="ml-1 self-end pb-2 font-mono text-[9px] uppercase tracking-[0.15em] text-white/60 sm:pb-3">
          {meridiem}
        </span>
      </div>

      <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/45">
        {now.toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })}
      </span>
    </div>
  )
}

export function HeroSection() {
  const mouseX = useMotionValue(
    Number.POSITIVE_INFINITY,
  )

  const reducedMotion =
    useReducedMotion()

  const [ideaModalOpen, setIdeaModalOpen] =
    useState(false)

  const github = socialLinks.find(
    (l) => l.name === 'Github',
  )

  const linkedin = socialLinks.find(
    (l) => l.name === 'LinkedIn',
  )

  const twitter = socialLinks.find(
    (l) => l.name === 'Twitter',
  )

  const gmail = socialLinks.find(
    (l) => l.name === 'Gmail',
  )

  const contactPhone = {
    label: '+91 6203163193',
    href: 'tel:+916203163193',
  }

  const dockEntries = ([
    {
      kind: 'item',
      key: 'home',
      label: 'Home',
      icon: Home,
      href: '#home',
      active: true,
    },
    {
      kind: 'item',
      key: 'about',
      label: 'About',
      icon: User,
      href: '#about',
    },
    {
      kind: 'item',
      key: 'experience',
      label: 'Experience',
      icon: Briefcase,
      href: '#experience',
    },
    {
      kind: 'item',
      key: 'projects',
      label: 'Projects',
      icon: Folder,
      to: '/projects',
    },
    { kind: 'divider', key: 'd1' },
    {
      kind: 'item',
      key: 'github',
      label: 'GitHub',
      icon: Github,
      href: github?.url,
      external: true,
    },
    {
      kind: 'item',
      key: 'linkedin',
      label: 'LinkedIn',
      icon: Linkedin,
      href: linkedin?.url,
      external: true,
    },
    {
      kind: 'item',
      key: 'twitter',
      label: 'Twitter',
      icon: Twitter,
      href: twitter?.url,
      external: true,
    },
    {
      kind: 'item',
      key: 'mail',
      label: 'Email',
      icon: Mail,
      href: gmail
        ? `mailto:${gmail.url}`
        : undefined,
    },
    {
      kind: 'item',
      key: 'phone',
      label: contactPhone.label,
      icon: Phone,
      href: contactPhone.href,
    },
    { kind: 'divider', key: 'd2' },
    {
      kind: 'item',
      key: 'idea',
      label: 'Have an idea?',
      icon: Lightbulb,
      onClick: () => setIdeaModalOpen(true),
    },
    {
      kind: 'item',
      key: 'contact',
      label: 'Contact',
      icon: Send,
      href: '#contact',
    },
  ] as Array<DockEntry>).filter(
    (entry) =>
      entry.kind === 'divider' ||
      Boolean(entry.href) ||
      Boolean(entry.to) ||
      Boolean(entry.onClick),
  )

  return (
    <section
      id="home"
      className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#070707] lg:h-screen"
    >
      {/* =====================================================
          BACKGROUND
      ===================================================== */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              'linear-gradient(rgba(225, 29, 36, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(225, 29, 36, 0.06) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />


        {/* Twinkling stars */}
        {stars.map((star, i) => (
          <span
            key={i}
            className={`pointer-events-none absolute rounded-full bg-white ${star.twinkle
              ? 'animate-pulse motion-reduce:animate-none'
              : ''
              }`}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.s,
              height: star.s,
              opacity: star.o,
              animationDuration: `${2 + (i % 5) * 0.6}s`,
            }}
          />
        ))}

        {/* Tech / role icon-words watermark — outline only, no fills */}
        {bgDecorItems.map((item, i) => {
          const layout = bgDecorLayout[i]

          return (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${layout.x}%`,
                top: `${layout.y}%`,
                transform: `translate(-50%, -50%) rotate(${layout.rotate}deg) scale(${layout.scale})`,
              }}
            >
              {item.type === 'icon' ? (
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-full border-2 bg-transparent ${layout.accent
                    ? 'border-[#EF1D25]/25'
                    : 'border-[#5D328E]/40'
                    }`}
                >
                  <item.Icon
                    className={`h-5 w-5 ${layout.accent
                      ? 'text-[#EF1D25]/30'
                      : 'text-[#5D328E]/55'
                      }`}
                  />
                </span>
              ) : (
                <span
                  className={`whitespace-nowrap rounded-full border-2 bg-transparent px-3.5 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] ${layout.accent
                    ? 'border-[#EF1D25]/25 text-[#EF1D25]/30'
                    : 'border-[#5D328E]/40 text-[#5D328E]/55'
                    }`}
                >
                  {item.label}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* =====================================================
          TOP-LEFT WIDGETS — EXPERIENCE + CLOCK
      ===================================================== */}
      <div className="absolute left-4 top-4 z-20 flex items-stretch gap-3 sm:left-6 sm:top-6">
        <AnimatedBorderCard>
          <ExperienceWidget reduced={reducedMotion} />
        </AnimatedBorderCard>
        <AnimatedBorderCard delay={-2}>
          <ClockWidget />
        </AnimatedBorderCard>
      </div>

      {/* =====================================================
          CENTER IDENTITY
      ===================================================== */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-5 px-4 pb-16 pt-24 text-center">
        <h1 aria-label="Priyanshu Chourasia" className="relative mb-[0.35em] mt-[0.2em] flex items-center justify-center gap-[0.35em] text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
          {/* Purple reflection split along the slant — light on the left,
              dark on the right — fading out to the black edges */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[600px] w-[min(1050px,130vw)] -translate-x-1/2 -translate-y-1/2 opacity-80"
            style={{
              backgroundImage:
                'linear-gradient(110deg, #7F4EA8 0%, #BE2ED6 49.8%, #5D328E 50.2%, #42156F 100%)',
              maskImage:
                'radial-gradient(ellipse at center, black 0%, rgba(0,0,0,0.6) 45%, transparent 75%)',
              WebkitMaskImage:
                'radial-gradient(ellipse at center, black 0%, rgba(0,0,0,0.6) 45%, transparent 75%)',
            }}
          />

          <span className="-translate-y-[0.2em]">PRIYANSHU</span>

          {/* Big slanted divider between first and last name */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[min(70vh,560px)] w-[3px] -translate-x-1/2 -translate-y-1/2 rotate-[20deg] rounded-full bg-[linear-gradient(to_bottom,transparent,#BE2ED6_20%,#7C41A8_50%,#42156F_80%,transparent)] shadow-[0_0_18px_#BE2ED6]"
          />

          <span className="translate-y-[0.35em] text-[#EF1D25]">
            CHOURASIA
          </span>
        </h1>

        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-red-400">
          Software Engineer — India
        </p>

        <p className="max-w-md text-sm leading-relaxed text-white/65 sm:text-base">
          Building scalable software and thoughtful digital products.
        </p>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 rounded-full border border-[#EF1D25]/60 bg-[#EF1D25]/10 px-5 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#EF1D25] transition-colors duration-200 hover:bg-[#EF1D25]/20"
          >
            View Projects

            <Folder className="h-3.5 w-3.5" />
          </Link>

          <button
            type="button"
            onClick={() => setIdeaModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80 transition-colors duration-200 hover:border-white/40 hover:text-white"
          >
            Have an idea?

            <Lightbulb className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* =====================================================
          MACOS-STYLE DOCK MENU BAR
      ===================================================== */}
      <div className="relative z-30 flex justify-center px-4 pb-4 sm:pb-5">
        <motion.div
          onMouseMove={(e) => mouseX.set(e.clientX)}
          onMouseLeave={() =>
            mouseX.set(Number.POSITIVE_INFINITY)
          }
          className="flex max-w-full flex-wrap items-end justify-center gap-2 rounded-2xl border border-[#BE2ED6]/30 px-2.5 pb-3.5 pt-2.5 shadow-[0_16px_48px_rgba(0,0,0,0.55),0_0_32px_rgba(190,46,214,0.25)] backdrop-blur-xl sm:flex-nowrap"
          style={{
            // Same slant split as the hero glow — light on the left, dark on the right
            backgroundImage:
              'linear-gradient(110deg, rgba(127,78,168,0.35) 0%, rgba(190,46,214,0.35) 49.8%, rgba(93,50,142,0.4) 50.2%, rgba(66,21,111,0.5) 100%)',
          }}
        >
          {dockEntries.map((entry) =>
            entry.kind === 'divider' ? (
              <span
                key={entry.key}
                className="mx-1 h-9 w-px self-center rotate-[20deg] bg-[#BE2ED6]/40"
                aria-hidden="true"
              />
            ) : (
              <DockItem
                key={entry.key}
                entry={entry}
                mouseX={mouseX}
                reduced={reducedMotion}
              />
            ),
          )}
        </motion.div>
      </div>

      <HaveAnIdeaModal
        open={ideaModalOpen}
        onOpenChange={setIdeaModalOpen}
      />
    </section>
  )
}
