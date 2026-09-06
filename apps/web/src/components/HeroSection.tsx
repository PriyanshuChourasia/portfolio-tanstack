import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimationFrame, useMotionValue, useReducedMotion } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import { ArrowUpRight, Briefcase, ChevronDown, Folder, Home, Lightbulb, Mail, Newspaper, Shield, Sparkles, Terminal, User } from 'lucide-react'
import { SiAnthropic, SiCss, SiDocker, SiFlutter, SiGit, SiGo, SiHtml5, SiJavascript, SiLaravel, SiMongodb, SiMysql, SiNextdotjs, SiNodedotjs, SiOpenai, SiPostgresql, SiPython, SiReact, SiSpringboot, SiTailwindcss, SiTypescript } from 'react-icons/si'
import { FaJava } from 'react-icons/fa6'
import worksData from '../data/works-data.json'
import socialLinks from '../data/social-link.json'

const allWorks = (worksData as { items: Array<any> }).items
const featuredWorks = [...allWorks].reverse().slice(0, 4)

const skillGroups: Array<{ label: string; icon: React.ComponentType<any>; items: Array<{ label: string; icon: React.ComponentType<any> }> }> = [
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

const aiTools: Array<{ label: string; icon: React.ComponentType<any> }> = [
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
}> = [
  { label: 'Home', icon: Home, href: '#home' },
  { label: 'About', icon: User, href: '#about' },
  { label: 'Experience', icon: Briefcase, href: '#experience' },
  { label: 'Projects', icon: Folder, to: '/projects' },
  { label: 'Blogs', icon: Newspaper, to: '/blog' },
]

type SkillItem = { label: string; icon: React.ComponentType<any>; tint: string }

const groupTints: Record<string, string> = {
  Languages: 'rgba(242, 162, 92, 0.16)',
  Frameworks: 'rgba(99, 102, 241, 0.16)',
  Databases: 'rgba(16, 185, 129, 0.16)',
  DevOps: 'rgba(59, 130, 246, 0.16)',
}

const allSkills: Array<SkillItem> = [
  ...skillGroups.flatMap((group) =>
    group.items.map((item) => ({
      ...item,
      tint: groupTints[group.label] ?? 'rgba(148, 163, 184, 0.16)',
    })),
  ),
  ...aiTools.map((tool) => ({ ...tool, tint: 'rgba(20, 184, 166, 0.18)' })),
]

function seeded(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

// Assign each skill to a distinct cell in a coarse grid (shuffled so
// categories don't band together), then jitter within the cell. This
// guarantees minimum spacing while still reading as "scattered".
const GRID_COLS = 6
const GRID_ROWS = Math.ceil(allSkills.length / GRID_COLS)

const shuffledCells = allSkills
  .map((_, i) => i)
  .sort((a, b) => seeded(a * 53.7 + 91) - seeded(b * 53.7 + 91))
const cellOfSkill: Array<number> = []
shuffledCells.forEach((skillIndex, cellIndex) => {
  cellOfSkill[skillIndex] = cellIndex
})

const chipLayout = allSkills.map((_, i) => {
  const cell = cellOfSkill[i]
  const col = cell % GRID_COLS
  const row = Math.floor(cell / GRID_COLS)
  const cellW = 100 / GRID_COLS
  const cellH = 100 / GRID_ROWS
  const jitterX = (seeded(i * 5.1 + 3) - 0.5) * cellW * 0.5
  const jitterY = (seeded(i * 11.3 + 4) - 0.5) * cellH * 0.5

  return {
    x: col * cellW + cellW / 2 + jitterX,
    y: row * cellH + cellH / 2 + jitterY,
    ampX: (seeded(i * 5.1 + 3) - 0.5) * 8,
    ampY: (seeded(i * 11.3 + 4) - 0.5) * 7,
    durX: 5 + seeded(i * 17.9 + 5) * 5,
    durY: 4 + seeded(i * 19.7 + 6) * 6,
    phaseX: seeded(i * 23.1 + 7) * Math.PI * 2,
    phaseY: seeded(i * 29.3 + 8) * Math.PI * 2,
  }
})

const isNarrow = typeof window !== 'undefined' ? window.innerWidth < 640 : false

const stars = Array.from({ length: isNarrow ? 24 : 70 }, (_, i) => ({
  x: seeded(i * 37.1 + 11) * 100,
  y: seeded(i * 41.3 + 12) * 100,
  s: 1 + (i % 3),
  twinkle: i % 6 === 3,
  o: 0.35 + (i % 5) * 0.13,
}))

const chipRadii = [
  { py: 'py-0.5 pl-1.5 pr-2', text: 'text-[8px]', icon: 'h-3.5 w-3.5' },
  { py: 'py-1 pl-2 pr-2.5', text: 'text-[9px]', icon: 'h-4 w-4' },
  { py: 'py-1.5 pl-2 pr-3', text: 'text-[10px]', icon: 'h-4.5 w-4.5' },
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
    mx.set(layout.ampX * Math.sin((t.current * Math.PI * 2) / layout.durX + layout.phaseX))
    my.set(layout.ampY * Math.sin((t.current * Math.PI * 2) / layout.durY + layout.phaseY))
  })

  return (
    <motion.button
      type="button"
      title={item.label}
      aria-label={item.label}
      onHoverStart={() => onHoverChange(true)}
      onHoverEnd={() => onHoverChange(false)}
      onTapStart={() => onHoverChange(true)}
      onTapCancel={() => onHoverChange(false)}
      onBlur={() => onHoverChange(false)}
      whileHover={{ scale: 1.35 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 320, damping: 18 }}
      className={`absolute left-0 top-0 flex items-center gap-1.5 rounded-full border will-change-transform ${chipRadii[tier].py} ${
        active
          ? 'z-30 border-white/40 bg-white/15'
          : 'z-0 border-white/10 bg-white/5 hover:border-primary-accent/60 hover:bg-white/10'
      }`}
      style={{ left: `${layout.x}%`, top: `${layout.y}%`, x: mx, y: my }}
    >
      <span
        className={`flex items-center justify-center rounded-full ${chipRadii[tier].icon}`}
        style={{ backgroundColor: item.tint }}
      >
        <Icon className="h-[55%] w-[55%] text-white/90" />
      </span>
      <span className={`whitespace-nowrap font-semibold ${chipRadii[tier].text} ${active ? 'text-white' : 'text-white/80'}`}>
        {item.label}
      </span>
    </motion.button>
  )
}

export function HeroSection() {
  const [featuredIndex, setFeaturedIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setFeaturedIndex((i) => (i + 1) % featuredWorks.length)
    }, 3200)
    return () => clearInterval(id)
  }, [])

  const featuredWork = featuredWorks[featuredIndex]
  const github = socialLinks.find((l) => l.name === 'Github')
  const twitter = socialLinks.find((l) => l.name === 'Twitter')
  const [activeSkill, setActiveSkill] = useState<number | null>(null)
  const reducedMotion = useReducedMotion()

  return (
    <section
      id="home"
      className="relative h-screen w-full overflow-hidden bg-white"
    >
      <div className="flex h-full items-center justify-center relative">
        <div className="grid w-full max-w-6xl h-[72vh] grid-cols-2 grid-rows-2 gap-4 p-4 relative">
        {/* Q1 — Profile image (floating) */}
        <div className="relative rounded-2xl overflow-hidden">
          <img
            src="/myimage.webp"
            alt="Priyanshu Chourasia"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <nav className="absolute inset-x-0 bottom-3 z-20 flex justify-center px-3">
            <div className="flex flex-wrap items-center justify-center gap-1 rounded-2xl border border-red-900/60 bg-black/80 px-3 py-2 shadow-lg backdrop-blur-md">
              {heroNavItems.map((item) => {
                const Icon = item.icon
                const chipClass =
                  'group flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-primary-accent'
                return item.to ? (
                  <Link key={item.label} to={item.to} className={chipClass}>
                    <Icon className="h-3.5 w-3.5" />
                    {item.label}
                  </Link>
                ) : (
                  <a key={item.label} href={item.href} className={chipClass}>
                    <Icon className="h-3.5 w-3.5" />
                    {item.label}
                  </a>
                )
              })}
            </div>
          </nav>
        </div>

        {/* Q2 — 4-grid projects + socials (etched) */}
        <div className="relative grid grid-cols-2 grid-rows-2 gap-3 rounded-2xl bg-[#2b0303] p-3 shadow-[inset_0_4px_12px_rgba(0,0,0,0.5),inset_0_-2px_6px_rgba(255,255,255,0.06)] overflow-hidden">
          {/* 1. LinkedIn */}
          <a
            href="https://www.linkedin.com/in/priyanshu-chourasia-17833120a/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative rounded-xl border border-border overflow-hidden"
          >
            <img
              src="/linkedin.png"
              alt="LinkedIn"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span className="absolute bottom-0 inset-x-0 text-center text-[10px] font-medium text-primary-foreground bg-primary/80 py-1">
              LinkedIn
            </span>
          </a>

          {/* 2. Project slider */}
          <div className="relative rounded-xl border border-border overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={featuredWork?.title}
                src={featuredWork?.image}
                alt={featuredWork?.title}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-2">
              <AnimatePresence mode="wait">
                <motion.p
                  key={featuredWork?.title}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="text-[10px] font-semibold text-foreground truncate"
                >
                  {featuredWork?.title}
                </motion.p>
              </AnimatePresence>
              <div className="flex gap-0.5 mt-1">
                {featuredWorks.map((_, i) => (
                  <span
                    key={i}
                    className={`h-0.5 rounded-full transition-all duration-300 ${i === featuredIndex ? 'w-2 bg-primary' : 'w-0.5 bg-muted'
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 3. GitHub */}
          {github && (
            <a
              href={github.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-xl border border-border overflow-hidden"
            >
              <img
                src="/githubprofile.png"
                alt="GitHub"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span className="absolute bottom-0 inset-x-0 text-center text-[10px] font-medium text-white bg-primary/80 py-1">
                GitHub
              </span>
            </a>
          )}

          {/* 4. Twitter */}
          {twitter && (
            <a
              href={twitter.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-xl border border-border overflow-hidden"
            >
              <img
                src="/twitterImage.png"
                alt="Twitter"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span className="absolute bottom-0 inset-x-0 text-center text-[10px] font-medium text-white bg-[#2b0303]/90 py-1">
                Twitter
              </span>
            </a>
          )}
        </div>

        {/* Q3 — Skills (space field) */}
        <div
          className="relative rounded-2xl border border-red-900/60 overflow-hidden shadow-[inset_0_4px_12px_rgba(0,0,0,0.6),inset_0_-2px_6px_rgba(255,255,255,0.05)] flex flex-col"
          style={{
            background:
              'radial-gradient(ellipse 120% 90% at 30% 0%, #330606 0%, #170303 55%, #000000 100%)',
          }}
        >
          <div className="relative z-20 flex items-center gap-2 px-5 pt-4 pb-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary-accent/15">
              <Sparkles className="h-3.5 w-3.5 text-primary-accent" />
            </span>
            <span className="text-[12px] font-bold uppercase tracking-widest text-white/70">
              Buy Service
            </span>
          </div>

          <div className="relative z-0 min-h-0 flex-1 overflow-hidden">
            {stars.map((star, i) => (
              <span
                key={i}
                className={`pointer-events-none absolute rounded-full bg-white ${star.twinkle ? 'animate-pulse' : ''}`}
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
              <div className="absolute -top-8 -left-6 h-28 w-28 rounded-full bg-primary-accent/12 blur-2xl" />
              <div className="absolute -bottom-10 -right-8 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl" />
              <div className="absolute top-1/3 left-1/2 h-24 w-24 rounded-full bg-indigo-500/10 blur-3xl" />
            </div>

            {allSkills.map((skill, i) => (
              <FloatingChip
                key={skill.label}
                item={skill}
                layout={chipLayout[i]}
                index={i}
                paused={activeSkill === i}
                active={activeSkill === i}
                reduced={reducedMotion}
                onHoverChange={(a) => setActiveSkill(a ? i : null)}
              />
            ))}
          </div>
        </div>

        {/* Q4 — My Projects */}
        <Link
          to="/projects"
          title="View My Projects"
          className="relative block rounded-2xl bg-[#120303] border border-red-900/60 overflow-hidden shadow-[inset_0_4px_12px_rgba(0,0,0,0.5),inset_0_-2px_6px_rgba(255,255,255,0.06)] hover:border hover:border-primary-accent/40 transition-colors"
        >
          <img
            src={featuredWork?.image}
            alt="My Projects"
            className="absolute inset-0 h-full w-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/80 border border-red-800/50 px-2.5 py-1 text-[10px] font-semibold text-white/90">
            My Projects
            <ArrowUpRight className="h-3 w-3" />
          </span>
        </Link>
          <a
            href="#contact"
            title="Contact"
            className="absolute left-0 top-0 z-20 flex rotate-45 -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border border-primary-accent/50 bg-black/85 px-3 py-2 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-primary-accent hover:text-white"
          >
            <Mail className="h-4 w-4" />
            <span className="text-[10px] font-semibold uppercase tracking-wide">
              Contact
            </span>
          </a>
          <a
            href="#contact"
            title="Have an idea?"
            className="absolute left-0 top-1/2 z-20 flex -rotate-45 -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border border-primary-accent/50 bg-black/85 px-3 py-2 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-primary-accent hover:text-white"
          >
            <Lightbulb className="h-4 w-4" />
            <span className="text-[10px] font-semibold uppercase tracking-wide">
              Have Idea?
            </span>
          </a>
      </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-30 flex flex-col items-center gap-2">
        <span className="text-lg font-bold uppercase tracking-widest text-red-500">
          Hire Me
        </span>
        <a href="#services" title="View my services" className="pointer-events-auto">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="h-5 w-5 text-red-500" />
          </motion.div>
        </a>
      </div>
    </section>
  )
}
