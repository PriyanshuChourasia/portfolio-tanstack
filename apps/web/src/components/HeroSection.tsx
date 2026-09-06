import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from 'framer-motion'
import { Link } from '@tanstack/react-router'
import {
  ArrowUpRight,
  Briefcase,
  ChevronDown,
  Folder,
  Home,
  Newspaper,
  Shield,
  Sparkles,
  Terminal,
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

import worksData from '../data/works-data.json'
import socialLinks from '../data/social-link.json'

const allWorks = (worksData as { items: Array<any> }).items
const featuredWorks = [...allWorks].reverse().slice(0, 4)

const skillGroups: Array<{
  label: string
  icon: React.ComponentType<any>
  items: Array<{ label: string; icon: React.ComponentType<any> }>
}> = [
    {
      label: 'Languages',
      icon: SiJavascript,
      items: [
        { label: 'TypeScript', icon: SiTypescript },
        { label: 'JavaScript', icon: SiJavascript },
        { label: 'HTML', icon: SiHtml5 },
        { label: 'CSS', icon: SiCss },
        { label: 'Java', icon: FaJava },
        { label: 'Go', icon: SiGo },
        { label: 'Python', icon: SiPython },
      ],
    },
    {
      label: 'Frameworks',
      icon: SiReact,
      items: [
        { label: 'React', icon: SiReact },
        { label: 'Next.js', icon: SiNextdotjs },
        { label: 'Node.js', icon: SiNodedotjs },
        { label: 'Spring Boot', icon: SiSpringboot },
        { label: 'Laravel', icon: SiLaravel },
        { label: 'Flutter', icon: SiFlutter },
        { label: 'Tailwind', icon: SiTailwindcss },
      ],
    },
    {
      label: 'Databases',
      icon: SiMysql,
      items: [
        { label: 'MySQL', icon: SiMysql },
        { label: 'PostgreSQL', icon: SiPostgresql },
        { label: 'MongoDB', icon: SiMongodb },
      ],
    },
    {
      label: 'DevOps',
      icon: SiDocker,
      items: [
        { label: 'Git', icon: SiGit },
        { label: 'Docker', icon: SiDocker },
      ],
    },
  ]

const aiTools: Array<{
  label: string
  icon: React.ComponentType<any>
}> = [
    { label: 'Claude Code', icon: SiAnthropic },
    { label: 'GPT', icon: SiOpenai },
    { label: 'FreeBuff', icon: Shield },
    { label: 'Opencode', icon: Terminal },
  ]

const heroNavItems: Array<{
  label: string
  icon: React.ComponentType<any>
  href?: string
  to?: '/projects' | '/blog'
  active?: boolean
}> = [
    { label: 'Home', icon: Home, href: '#home', active: true },
    { label: 'About', icon: User, href: '#about' },
    { label: 'Experience', icon: Briefcase, href: '#experience' },
    { label: 'Projects', icon: Folder, to: '/projects' },
    { label: 'Blogs', icon: Newspaper, to: '/blog' },
  ]

type SkillItem = {
  label: string
  icon: React.ComponentType<any>
  tint: string
}

const groupTints: Record<string, string> = {
  Languages: 'rgba(225, 29, 36, 0.16)',
  Frameworks: 'rgba(239, 29, 37, 0.13)',
  Databases: 'rgba(225, 29, 36, 0.18)',
  DevOps: 'rgba(255, 255, 255, 0.09)',
}

const allSkills: Array<SkillItem> = [
  ...skillGroups.flatMap((group) =>
    group.items.map((item) => ({
      ...item,
      tint:
        groupTints[group.label] ??
        'rgba(239, 29, 37, 0.13)',
    })),
  ),
  ...aiTools.map((tool) => ({
    ...tool,
    tint: 'rgba(225, 29, 36, 0.18)',
  })),
]

function seeded(seed: number) {
  const x =
    Math.sin(seed * 127.1 + 311.7) *
    43758.5453

  return x - Math.floor(x)
}

const GRID_COLS = 6
const GRID_ROWS = Math.ceil(
  allSkills.length / GRID_COLS,
)

const shuffledCells = allSkills
  .map((_, i) => i)
  .sort(
    (a, b) =>
      seeded(a * 53.7 + 91) -
      seeded(b * 53.7 + 91),
  )

const cellOfSkill: Array<number> = []

shuffledCells.forEach(
  (skillIndex, cellIndex) => {
    cellOfSkill[skillIndex] = cellIndex
  },
)

const chipLayout = allSkills.map((_, i) => {
  const cell = cellOfSkill[i]

  const col = cell % GRID_COLS
  const row = Math.floor(cell / GRID_COLS)

  const cellW = 100 / GRID_COLS
  const cellH = 100 / GRID_ROWS

  const jitterX =
    (seeded(i * 5.1 + 3) - 0.5) *
    cellW *
    0.5

  const jitterY =
    (seeded(i * 11.3 + 4) - 0.5) *
    cellH *
    0.5

  return {
    x:
      col * cellW +
      cellW / 2 +
      jitterX,

    y:
      row * cellH +
      cellH / 2 +
      jitterY,

    ampX:
      (seeded(i * 5.1 + 3) - 0.5) * 8,

    ampY:
      (seeded(i * 11.3 + 4) - 0.5) * 7,

    durX:
      5 + seeded(i * 17.9 + 5) * 5,

    durY:
      4 + seeded(i * 19.7 + 6) * 6,

    phaseX:
      seeded(i * 23.1 + 7) *
      Math.PI *
      2,

    phaseY:
      seeded(i * 29.3 + 8) *
      Math.PI *
      2,
  }
})

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

const chipRadii = [
  {
    py: 'py-0.5 pl-1.5 pr-2',
    text: 'text-[8px]',
    icon: 'h-3.5 w-3.5',
  },
  {
    py: 'py-1 pl-2 pr-2.5',
    text: 'text-[9px]',
    icon: 'h-4 w-4',
  },
  {
    py: 'py-1.5 pl-2 pr-3',
    text: 'text-[10px]',
    icon: 'h-4.5 w-4.5',
  },
]

interface FloatingChipProps {
  item: SkillItem
  layout: (typeof chipLayout)[number]
  index: number
  paused: boolean
  active: boolean
  reduced: boolean | null
  onHoverChange: (active: boolean) => void
}

function FloatingChip({
  item,
  layout,
  index,
  paused,
  active,
  reduced,
  onHoverChange,
}: FloatingChipProps) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  const t = useRef(0)

  const Icon = item.icon
  const tier = index % 3

  useAnimationFrame((_, delta) => {
    if (paused || reduced) return

    t.current += delta / 1000

    mx.set(
      layout.ampX *
      Math.sin(
        (t.current * Math.PI * 2) /
        layout.durX +
        layout.phaseX,
      ),
    )

    my.set(
      layout.ampY *
      Math.sin(
        (t.current * Math.PI * 2) /
        layout.durY +
        layout.phaseY,
      ),
    )
  })

  return (
    <motion.button
      type="button"
      title={item.label}
      aria-label={item.label}
      onHoverStart={() =>
        onHoverChange(true)
      }
      onHoverEnd={() =>
        onHoverChange(false)
      }
      onTapStart={() =>
        onHoverChange(true)
      }
      onTapCancel={() =>
        onHoverChange(false)
      }
      onBlur={() =>
        onHoverChange(false)
      }
      whileHover={
        reduced
          ? undefined
          : {
            scale: 1.1,
            y: -3,
          }
      }
      whileTap={{ scale: 0.92 }}
      transition={{
        type: 'spring',
        stiffness: 320,
        damping: 18,
      }}
      className={`absolute left-0 top-0 flex items-center gap-1.5 rounded-full border backdrop-blur-sm will-change-transform ${chipRadii[tier].py
        } ${active
          ? 'z-30 border-primary-accent/70 bg-[#1f0a0a]/95 shadow-[0_0_18px_rgba(225,29,36,0.25)]'
          : 'z-0 border-white/10 bg-[#0D0D0D]/85 hover:border-primary-accent/60 hover:bg-[#161616]'
        }`}
      style={{
        left: `${layout.x}%`,
        top: `${layout.y}%`,
        x: mx,
        y: my,
      }}
    >
      <span
        className={`flex items-center justify-center rounded-full ${chipRadii[tier].icon}`}
        style={{
          backgroundColor: item.tint,
        }}
      >
        <Icon className="h-[55%] w-[55%] text-white/95" />
      </span>

      <span
        className={`whitespace-nowrap font-semibold ${chipRadii[tier].text
          } ${active
            ? 'text-white'
            : 'text-white/80'
          }`}
      >
        {item.label}
      </span>
    </motion.button>
  )
}

export function HeroSection() {
  const [featuredIndex, setFeaturedIndex] =
    useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setFeaturedIndex(
        (i) =>
          (i + 1) %
          featuredWorks.length,
      )
    }, 3200)

    return () => clearInterval(id)
  }, [])

  const featuredWork =
    featuredWorks[featuredIndex]

  const github = socialLinks.find(
    (l) => l.name === 'Github',
  )

  const twitter = socialLinks.find(
    (l) => l.name === 'Twitter',
  )

  const [activeSkill, setActiveSkill] =
    useState<number | null>(null)

  const reducedMotion =
    useReducedMotion()

  const navItemClasses = (
    active: boolean,
  ) =>
    active
      ? 'flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-medium text-white'
      : 'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white'

  return (
    <section
      id="home"
      className="relative min-h-screen w-full overflow-hidden bg-white lg:h-screen"
    >
      {/* =====================================================
          BACKGROUND
      ===================================================== */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'linear-gradient(rgba(225, 29, 36, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(225, 29, 36, 0.05) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="absolute -top-28 left-[12%] h-80 w-80 rounded-full bg-red-600/10 blur-3xl" />

        <div className="absolute -bottom-32 right-[8%] h-96 w-96 rounded-full bg-red-500/10 blur-3xl" />
      </div>

      {/* =====================================================
          BENTO WRAPPER
      ===================================================== */}
      <div className="relative flex items-center justify-center px-4 py-10 sm:px-6 md:py-0 lg:h-screen">
        <div
          className="
            relative
            grid
            w-full
            max-w-6xl
            auto-rows-fr
            grid-cols-1
            gap-4
            md:h-[76vh]
            md:grid-cols-2
            md:grid-rows-2
          "
        >
          {/* =================================================
              Q1 — PROFILE / IDENTITY
          ================================================= */}
          <div
            className="
              group
              relative
              order-1
              overflow-visible
              rounded-2xl
              border
              border-primary/25
              bg-[#0A0A0A]
            "
          >
            {/* =================================================
                PROFILE IMAGE
            ================================================= */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <img
                src="/myimage.webp"
                alt="Priyanshu Chourasia"
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
            </div>

            {/* =================================================
                CONTACT TAG
            ================================================= */}
            <div
              className="
                absolute
                left-0
                top-[27%]
                z-50
                hidden
                -translate-x-full
                pr-3
                md:block
              "
            >
              <a
                href="#contact"
                title="Contact"
                className="group/contact relative block w-max"
              >
                <div
                  className="
                    relative
                    flex
                    items-center
                    gap-2
                    border
                    border-[#3A1515]
                    bg-[#090909]
                    px-3
                    py-2
                    font-mono
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.25em]
                    text-[#888888]
                    transition-all
                    duration-300
                    group-hover/contact:border-[#EF1D25]
                    group-hover/contact:text-[#EF1D25]
                  "
                >
                  {/* Tag marker */}
                  <span
                    className="
                      h-1.5
                      w-1.5
                      shrink-0
                      border
                      border-[#EF1D25]/70
                      transition-colors
                      duration-300
                      group-hover/contact:bg-[#EF1D25]
                    "
                  />

                  <span>CONTACT</span>

                  {/* Connector */}
                  <span
                    className="
                      absolute
                      -right-3
                      top-1/2
                      h-px
                      w-3
                      -translate-y-1/2
                      bg-[#3A1515]
                      transition-colors
                      duration-300
                      group-hover/contact:bg-[#EF1D25]
                    "
                  />

                  {/* Connector endpoint */}
                  <span
                    className="
                      absolute
                      -right-[15px]
                      top-1/2
                      h-1
                      w-1
                      -translate-y-1/2
                      rotate-45
                      bg-[#EF1D25]/70
                    "
                  />
                </div>
              </a>
            </div>

            {/* =================================================
                HAVE AN IDEA? TAG
            ================================================= */}
            <div
              className="
                absolute
                left-0
                top-[62%]
                z-50
                hidden
                -translate-x-full
                pr-3
                md:block
              "
            >
              <a
                href="#contact"
                title="Have an idea?"
                className="group/idea relative block w-max"
              >
                <div
                  className="
                    relative
                    flex
                    items-center
                    gap-2
                    border
                    border-[#3A1515]
                    bg-[#090909]
                    px-3
                    py-2
                    font-mono
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                    text-[#888888]
                    transition-all
                    duration-300
                    group-hover/idea:border-[#EF1D25]
                    group-hover/idea:text-[#EF1D25]
                  "
                >
                  {/* Tag marker */}
                  <span
                    className="
                      h-1.5
                      w-1.5
                      shrink-0
                      border
                      border-[#EF1D25]/70
                      transition-colors
                      duration-300
                      group-hover/idea:bg-[#EF1D25]
                    "
                  />

                  <span>HAVE AN IDEA?</span>

                  {/* Connector */}
                  <span
                    className="
                      absolute
                      -right-3
                      top-1/2
                      h-px
                      w-3
                      -translate-y-1/2
                      bg-[#3A1515]
                      transition-colors
                      duration-300
                      group-hover/idea:bg-[#EF1D25]
                    "
                  />

                  {/* Connector endpoint */}
                  <span
                    className="
                      absolute
                      -right-[15px]
                      top-1/2
                      h-1
                      w-1
                      -translate-y-1/2
                      rotate-45
                      bg-[#EF1D25]/70
                    "
                  />
                </div>
              </a>
            </div>

            {/* =================================================
                BOTTOM IDENTITY + NAV
            ================================================= */}
            <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col gap-3.5 bg-gradient-to-t from-black via-black/50 to-transparent px-4 pb-3.5 pt-20 sm:px-5 sm:pb-4">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-red-400">
                    01 / Profile
                  </span>

                  <h1 className="mt-1.5 text-xl font-bold leading-tight tracking-tight text-white sm:text-2xl md:text-[28px]">
                    PRIYANSHU CHOURASIA
                  </h1>
                </div>

                <div className="pb-0.5 text-right">
                  <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-red-400">
                    Software Engineer
                  </p>

                  <p className="mt-1 flex items-center justify-end gap-1.5 text-[10px] text-white/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    India
                  </p>
                </div>
              </div>

              <p className="max-w-md text-[11px] leading-relaxed text-white/75 sm:text-xs">
                Building scalable software and thoughtful digital products.
              </p>

              <nav
                aria-label="Primary"
                className="flex flex-wrap items-center justify-center gap-1 rounded-full border border-white/10 bg-black/55 px-1.5 py-1 backdrop-blur-sm"
              >
                {heroNavItems.map(
                  (item) => {
                    const Icon = item.icon
                    const active =
                      item.active

                    return (
                      <span
                        key={item.label}
                        className={navItemClasses(
                          Boolean(active),
                        )}
                      >
                        {active && (
                          <span className="h-1 w-1 rounded-full bg-primary-accent" />
                        )}

                        {item.to ? (
                          <Link
                            to={item.to}
                            aria-current={
                              active
                                ? 'page'
                                : undefined
                            }
                            className="flex items-center gap-1.5"
                          >
                            <Icon className="h-3.5 w-3.5" />

                            {item.label}
                          </Link>
                        ) : (
                          <a
                            href={item.href}
                            aria-current={
                              active
                                ? 'page'
                                : undefined
                            }
                            className="flex items-center gap-1.5"
                          >
                            <Icon className="h-3.5 w-3.5" />

                            {item.label}
                          </a>
                        )}
                      </span>
                    )
                  },
                )}
              </nav>
            </div>
          </div>

          {/* =================================================
              Q2 — PROJECTS + SOCIALS
          ================================================= */}
          <div className="relative order-2 rounded-2xl border border-[#1c1c1c] bg-[#080808] p-2.5">
            <div className="flex items-center justify-between px-1 pb-2 pt-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">
                02 / Projects
              </span>

              <span className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-red-500" />

                <span className="font-mono text-[9px] uppercase tracking-widest text-red-400/80">
                  Live
                </span>
              </span>
            </div>

            <div className="grid h-[calc(100%-2.1rem)] grid-cols-2 grid-rows-2 gap-2">
              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/priyanshu-chourasia-17833120a/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-xl border border-white/10 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#3b0a0a]"
              >
                <img
                  src="/linkedin.png"
                  alt="LinkedIn"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />

                <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 border-t border-white/10 bg-black/85 py-1 text-center text-[10px] font-medium text-white/85">
                  <span className="h-1 w-1 rounded-full bg-red-500" />
                  LinkedIn
                </span>
              </a>

              {/* Featured Project */}
              <div className="group relative overflow-hidden rounded-xl border border-white/10 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#3b0a0a]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={featuredWork?.title}
                    src={featuredWork?.image}
                    alt={featuredWork?.title}
                    initial={{
                      opacity: 0,
                      scale: 1.05,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.95,
                    }}
                    transition={{
                      duration: 0.5,
                    }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/90 via-[#050505]/30 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-2">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={featuredWork?.title}
                      initial={{
                        opacity: 0,
                        y: 4,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: -4,
                      }}
                      transition={{
                        duration: 0.3,
                      }}
                      className="truncate text-[10px] font-semibold text-white"
                    >
                      {featuredWork?.title}
                    </motion.p>
                  </AnimatePresence>

                  <div className="mt-1 flex gap-0.5">
                    {featuredWorks.map(
                      (_, i) => (
                        <span
                          key={i}
                          className={`h-0.5 rounded-full transition-all duration-300 ${i === featuredIndex
                            ? 'w-2 bg-primary-accent'
                            : 'w-0.5 bg-white/25'
                            }`}
                        />
                      ),
                    )}
                  </div>
                </div>
              </div>

              {/* GitHub */}
              {github && (
                <a
                  href={github.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-xl border border-white/10 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#3b0a0a]"
                >
                  <img
                    src="/githubprofile.png"
                    alt="GitHub"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />

                  <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 border-t border-white/10 bg-black/85 py-1 text-center text-[10px] font-medium text-white/85">
                    <span className="h-1 w-1 rounded-full bg-red-500" />
                    GitHub
                  </span>
                </a>
              )}

              {/* Twitter */}
              {twitter && (
                <a
                  href={twitter.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-xl border border-white/10 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#3b0a0a]"
                >
                  <img
                    src="/twitterImage.png"
                    alt="Twitter"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />

                  <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 border-t border-white/10 bg-black/85 py-1 text-center text-[10px] font-medium text-white/85">
                    <span className="h-1 w-1 rounded-full bg-red-500" />
                    Twitter
                  </span>
                </a>
              )}
            </div>
          </div>

          {/* =================================================
              Q3 — SKILLS
          ================================================= */}
          <div
            className="relative order-3 flex flex-col overflow-hidden rounded-2xl border border-[#1c1c1c] shadow-[inset_0_4px_12px_rgba(0,0,0,0.6),inset_0_-2px_6px_rgba(255,255,255,0.05)]"
            style={{
              background:
                'radial-gradient(ellipse 120% 90% at 30% 0%, #2a0a0a 0%, #0D0D0D 55%, #050505 100%)',
            }}
          >
            <div className="relative z-20 flex items-center justify-between gap-2 px-4 pb-2 pt-3.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">
                03 / Skills
              </span>

              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-primary-accent" />

                <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                  Buy Service
                </span>
              </span>
            </div>

            <div className="relative z-0 min-h-0 flex-1 overflow-hidden">
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

              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-6 -top-8 h-28 w-28 rounded-full bg-primary-accent/12 blur-2xl" />

                <div className="absolute -bottom-10 -right-8 h-32 w-32 rounded-full bg-[#5a0b0b]/30 blur-3xl" />
              </div>

              {allSkills.map(
                (skill, i) => (
                  <FloatingChip
                    key={skill.label}
                    item={skill}
                    layout={chipLayout[i]}
                    index={i}
                    paused={
                      activeSkill === i
                    }
                    active={
                      activeSkill === i
                    }
                    reduced={reducedMotion}
                    onHoverChange={(a) =>
                      setActiveSkill(
                        a ? i : null,
                      )
                    }
                  />
                ),
              )}
            </div>
          </div>

          {/* =================================================
              Q4 — FEATURED PROJECT
          ================================================= */}
          <Link
            to="/projects"
            title="View My Projects"
            className="group relative order-4 block overflow-hidden rounded-2xl border border-[#1c1c1c] bg-[#0D0D0D] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary-accent/40"
          >
            <img
              src={featuredWork?.image}
              alt="My Projects"
              className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />

            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-red-400">
                04 / Featured
              </p>

              <h3 className="mt-1 truncate text-lg font-bold text-white sm:text-xl">
                {featuredWork?.title}
              </h3>

              <span className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-white/60 transition-colors duration-300 group-hover:text-white">
                View all projects

                <ArrowUpRight className="h-3.5 w-3.5 text-red-400 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* =====================================================
          HIRE ME
      ===================================================== */}
      <div className="pointer-events-none absolute inset-x-0 bottom-5 z-30 hidden flex-col items-center gap-2 md:flex">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-red-600">
          Hire Me
        </span>

        <a
          href="#services"
          title="View my services"
          className="pointer-events-auto"
        >
          <motion.div
            animate={
              reducedMotion
                ? undefined
                : {
                  y: [0, 6, 0],
                }
            }
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <ChevronDown className="h-5 w-5 text-red-500" />
          </motion.div>
        </a>
      </div>
    </section>
  )
}