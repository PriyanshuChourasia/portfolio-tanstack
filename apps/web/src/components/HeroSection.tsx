import { useRef, useState } from 'react'
import {
  
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform
} from 'framer-motion'
import { Link } from '@tanstack/react-router'
import {
  Building2,
  Folder,
  Github,
  Home,
  Layers,
  Lightbulb,
  Linkedin,
  Mail,
  Milestone,
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
  // Brand-style tint for the tile and icon, like a macOS app icon
  color: string
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
            icon={<Icon className={DOCK_ICON_CLASS} strokeWidth={1.75} />}
            label={entry.label}
            color={entry.color}
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
            icon={<Icon className={DOCK_ICON_CLASS} strokeWidth={1.75} />}
            label={entry.label}
            color={entry.color}
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
            icon={<Icon className={DOCK_ICON_CLASS} strokeWidth={1.75} />}
            label={entry.label}
            color={entry.color}
            active={entry.active}
          />
        </button>
      )}
      </motion.div>
    </motion.div>
  )
}

// Icon takes the tile's colour, and turns white when the tile fills on hover
const DOCK_ICON_CLASS =
  'h-[55%] w-[55%] text-[var(--dock-color)] transition-colors duration-200 group-hover:text-white group-focus-within:text-white'

function DockIconFace({
  icon,
  label,
  color,
  active,
}: {
  icon: React.ReactNode
  label: string
  color: string
  active?: boolean
}) {
  return (
    <>
      <span
        style={{ '--dock-color': color } as React.CSSProperties}
        className="flex h-full w-full items-center justify-center rounded-[26%] border border-[color-mix(in_oklab,var(--dock-color)_35%,transparent)] bg-[color-mix(in_oklab,var(--dock-color)_16%,transparent)] shadow-[0_4px_16px_rgba(0,0,0,0.35)] backdrop-blur-md transition-colors duration-200 group-hover:border-[var(--dock-color)] group-hover:bg-[var(--dock-color)] group-focus-within:border-[var(--dock-color)] group-focus-within:bg-[var(--dock-color)]"
      >
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
      color: '#60A5FA',
      label: 'Home',
      icon: Home,
      href: '#home',
      active: true,
    },
    {
      kind: 'item',
      key: 'projects',
      color: '#F59E0B',
      label: 'Projects',
      icon: Folder,
      href: '#projects',
    },
    {
      kind: 'item',
      key: 'about',
      color: '#34D399',
      label: 'About',
      icon: User,
      href: '#about',
    },
    {
      kind: 'item',
      key: 'journey',
      color: '#C19ADD',
      label: 'Journey',
      icon: Milestone,
      href: '#journey',
    },
    {
      kind: 'item',
      key: 'experience',
      color: '#F472B6',
      label: 'Experience',
      icon: Building2,
      href: '#workplaces',
    },
    {
      kind: 'item',
      key: 'stack',
      color: '#22D3EE',
      label: 'Stack',
      icon: Layers,
      href: '#stack',
    },
    { kind: 'divider', key: 'd1' },
    {
      kind: 'item',
      key: 'github',
      color: '#E5E7EB',
      label: 'GitHub',
      icon: Github,
      href: github?.url,
      external: true,
    },
    {
      kind: 'item',
      key: 'linkedin',
      color: '#3B8FE8',
      label: 'LinkedIn',
      icon: Linkedin,
      href: linkedin?.url,
      external: true,
    },
    {
      kind: 'item',
      key: 'twitter',
      color: '#1DA1F2',
      label: 'Twitter',
      icon: Twitter,
      href: twitter?.url,
      external: true,
    },
    {
      kind: 'item',
      key: 'mail',
      color: '#EA4335',
      label: 'Email',
      icon: Mail,
      href: gmail
        ? `mailto:${gmail.url}`
        : undefined,
    },
    {
      kind: 'item',
      key: 'phone',
      color: '#34C759',
      label: contactPhone.label,
      icon: Phone,
      href: contactPhone.href,
    },
    { kind: 'divider', key: 'd2' },
    {
      kind: 'item',
      key: 'idea',
      color: '#FACC15',
      label: 'Have an idea?',
      icon: Lightbulb,
      onClick: () => setIdeaModalOpen(true),
    },
    {
      kind: 'item',
      key: 'contact',
      color: '#BE2ED6',
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
        {/* Aurora washes — soft colour pools so the black never feels flat */}
        <div className="absolute -left-[15%] -top-[20%] h-[70vh] w-[60vw] rounded-full bg-[#5D328E]/25 blur-[140px]" />
        <div className="absolute -bottom-[25%] -right-[10%] h-[65vh] w-[55vw] rounded-full bg-[#EF1D25]/[0.12] blur-[150px]" />

        {/* Grid — fades out toward the edges instead of tiling hard */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(190, 46, 214, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(190, 46, 214, 0.07) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage:
              'radial-gradient(ellipse 70% 60% at 50% 45%, black 20%, transparent 80%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 70% 60% at 50% 45%, black 20%, transparent 80%)',
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

        {/* Tech / role icon-words watermark — outline only, no fills.
            Masked so the centre stays clear for the name, and each badge
            drifts slowly so the field feels alive rather than busy. */}
        <div
          className="absolute inset-0"
          style={{
            maskImage:
              'radial-gradient(ellipse 48% 42% at 50% 46%, transparent 35%, rgba(0,0,0,0.55) 70%, black 100%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 48% 42% at 50% 46%, transparent 35%, rgba(0,0,0,0.55) 70%, black 100%)',
          }}
        >
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
                <div
                  className="hero-drift motion-reduce:animate-none"
                  style={{
                    animationDuration: `${9 + (i % 7) * 1.7}s`,
                    animationDelay: `-${(i * 1.3) % 9}s`,
                  }}
                >
                  {item.type === 'icon' ? (
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-full border bg-white/[0.015] ${layout.accent
                        ? 'border-[#EF1D25]/20'
                        : 'border-[#8B5CC9]/25'
                        }`}
                    >
                      <item.Icon
                        className={`h-5 w-5 ${layout.accent
                          ? 'text-[#EF1D25]/30'
                          : 'text-[#8B5CC9]/40'
                          }`}
                      />
                    </span>
                  ) : (
                    <span
                      className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.28em] ${layout.accent
                        ? 'border-[#EF1D25]/20 text-[#EF1D25]/35'
                        : 'border-[#8B5CC9]/25 text-[#8B5CC9]/45'
                        }`}
                    >
                      {item.label}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Edge vignette + bottom fade so the dock sits on calm ground */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.65)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#070707] via-[#070707]/70 to-transparent" />
      </div>

      {/* =====================================================
          CENTER IDENTITY
      ===================================================== */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-6 px-4 pb-10 pt-24 text-center">
        <h1 aria-label="Priyanshu Chourasia" className="relative mb-[0.35em] mt-[0.1em] flex items-center justify-center gap-[0.4em] text-[2rem] font-bold leading-none tracking-[-0.03em] text-white sm:text-6xl md:text-7xl">
          {/* Purple reflection split along the slant — light on the left,
              dark on the right — fading softly to black on every side */}
          <motion.span
            aria-hidden="true"
            initial={reducedMotion ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 0.75, scale: 1 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[620px] w-[min(1100px,140vw)] blur-[2px]"
            style={{
              x: '-50%',
              y: '-50%',
              backgroundImage:
                'linear-gradient(110deg, #7F4EA8 0%, #BE2ED6 49.8%, #5D328E 50.2%, #2A0E4A 100%)',
              maskImage:
                'radial-gradient(closest-side, black 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.15) 75%, transparent 100%)',
              WebkitMaskImage:
                'radial-gradient(closest-side, black 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.15) 75%, transparent 100%)',
            }}
          />

          <motion.span
            initial={reducedMotion ? false : { opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
            style={{ y: '-0.25em' }}
          >
            <span className="bg-gradient-to-b from-white via-white to-[#D9C6F0] bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(190,46,214,0.35)]">
              PRIYANSHU
            </span>
            <span aria-hidden="true" className="mt-[0.45em] font-mono text-[0.22em] font-medium tracking-[0.55em] text-white/75">
              SOFTWARE
            </span>
          </motion.span>

          {/* Big slanted divider between first and last name */}
          <motion.span
            aria-hidden="true"
            initial={reducedMotion ? false : { scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[min(70vh,560px)] w-[2px] origin-center rounded-full bg-[linear-gradient(to_bottom,transparent,#E879F9_20%,#BE2ED6_50%,#42156F_80%,transparent)] shadow-[0_0_14px_#BE2ED6,0_0_40px_rgba(190,46,214,0.5)]"
            style={{ x: '-50%', y: '-50%', rotate: 20 }}
          />

          <motion.span
            initial={reducedMotion ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
            style={{ y: '0.35em' }}
          >
            <span className="bg-gradient-to-b from-[#FF5A61] via-[#EF1D25] to-[#B3121A] bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(239,29,37,0.35)]">
              CHOURASIA
            </span>
            <span aria-hidden="true" className="mt-[0.45em] font-mono text-[0.22em] font-medium tracking-[0.55em] text-[#FF6B71]/85">
              ENGINEER
            </span>
          </motion.span>
        </h1>

        <p className="sr-only">Software Engineer</p>

        <motion.p
          initial={reducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-md text-balance text-sm leading-relaxed text-white/60 sm:text-base"
        >
          Building <span className="text-white/90">scalable software</span> and{' '}
          <span className="text-white/90">thoughtful digital products</span>.
        </motion.p>
      </div>

      {/* =====================================================
          MACOS-STYLE DOCK MENU BAR
      ===================================================== */}
      <div className="relative z-30 flex justify-center px-4 pb-8 sm:pb-10 lg:pb-12">
        <motion.div
          onMouseMove={(e) => mouseX.set(e.clientX)}
          onMouseLeave={() =>
            mouseX.set(Number.POSITIVE_INFINITY)
          }
          initial={reducedMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="flex max-w-full flex-wrap items-end justify-center gap-2 rounded-[22px] border border-white/10 px-2.5 pb-3.5 pt-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_20px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(190,46,214,0.18)] backdrop-blur-2xl sm:flex-nowrap"
          style={{
            // Same slant split as the hero glow, toned down to frosted glass
            backgroundImage:
              'linear-gradient(110deg, rgba(127,78,168,0.18) 0%, rgba(190,46,214,0.16) 49.8%, rgba(93,50,142,0.2) 50.2%, rgba(42,14,74,0.35) 100%)',
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
