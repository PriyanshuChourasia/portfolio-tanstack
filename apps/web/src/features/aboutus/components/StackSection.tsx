import { useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { IconType } from 'react-icons'
import {
  SiAndroid,
  SiAnthropic,
  SiApple,
  SiCss,
  SiDart,
  SiDocker,
  SiFlutter,
  SiFramer,
  SiGit,
  SiGithubactions,
  SiGooglemaps,
  SiHtml5,
  SiJavascript,
  SiLangchain,
  SiLaravel,
  SiLinux,
  SiMongodb,
  SiMysql,
  SiNestjs,
  SiNextdotjs,
  SiNginx,
  SiNodedotjs,
  SiOpenai,
  SiPostgresql,
  SiPrisma,
  SiPython,
  SiReact,
  SiRedux,
  SiShadcnui,
  SiSocketdotio,
  SiSpringboot,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiVite,
} from 'react-icons/si'

import stackData from '@/data/stack-data.json'
import { cn } from '@/lib/utils'

type Category = (typeof stackData.categories)[number]

const categories: Array<Category> = stackData.categories

/* =========================================================
    TOOL ICONS
========================================================= */

type ToolEntry = { icon: IconType; color: string }

const TOOL_ICONS = {
  React: { icon: SiReact, color: '#61DAFB' },
  'Next.js': { icon: SiNextdotjs, color: '#000000' },
  TypeScript: { icon: SiTypescript, color: '#3178C6' },
  JavaScript: { icon: SiJavascript, color: '#F7DF1E' },
  'Tailwind CSS': { icon: SiTailwindcss, color: '#06B6D4' },
  'shadcn/ui': { icon: SiShadcnui, color: '#000000' },
  Vite: { icon: SiVite, color: '#646CFF' },
  Redux: { icon: SiRedux, color: '#764ABC' },
  'Framer Motion': { icon: SiFramer, color: '#0055FF' },
  HTML5: { icon: SiHtml5, color: '#E34F26' },
  CSS: { icon: SiCss, color: '#1572B6' },
  'Google Maps SDK': { icon: SiGooglemaps, color: '#4285F4' },
  'Node.js': { icon: SiNodedotjs, color: '#5FA04E' },
  NestJS: { icon: SiNestjs, color: '#E0234E' },
  'Spring Boot': { icon: SiSpringboot, color: '#6DB33F' },
  Laravel: { icon: SiLaravel, color: '#FF2D20' },
  Prisma: { icon: SiPrisma, color: '#2D3748' },
  WebSockets: { icon: SiSocketdotio, color: '#010101' },
  Flutter: { icon: SiFlutter, color: '#02569B' },
  Dart: { icon: SiDart, color: '#0175C2' },
  'React Native': { icon: SiReact, color: '#61DAFB' },
  Android: { icon: SiAndroid, color: '#3DDC84' },
  iOS: { icon: SiApple, color: '#000000' },
  PostgreSQL: { icon: SiPostgresql, color: '#4169E1' },
  MySQL: { icon: SiMysql, color: '#4479A1' },
  MongoDB: { icon: SiMongodb, color: '#47A248' },
  OpenAI: { icon: SiOpenai, color: '#000000' },
  Anthropic: { icon: SiAnthropic, color: '#191919' },
  LangChain: { icon: SiLangchain, color: '#1C3C3C' },
  Python: { icon: SiPython, color: '#3776AB' },
  Docker: { icon: SiDocker, color: '#2496ED' },
  'GitHub Actions': { icon: SiGithubactions, color: '#2088FF' },
  Git: { icon: SiGit, color: '#F05032' },
  Linux: { icon: SiLinux, color: '#FCC624' },
  Nginx: { icon: SiNginx, color: '#009639' },
  Vercel: { icon: SiVercel, color: '#000000' },
} as const satisfies Record<string, ToolEntry>

// A JSON import widens tool names to `string`, so the lookup can't be a
// compile-time key check — it falls back to a monogram instead.
const toolEntry = (name: string): ToolEntry | null =>
  (TOOL_ICONS as Record<string, ToolEntry>)[name] ?? null

function ToolGlyph({ name, size }: { name: string; size: number }) {
  const entry = toolEntry(name)

  if (!entry) {
    return (
      <span
        aria-hidden="true"
        style={{ color: '#9CA3AF', fontSize: Math.round(size * 0.6) }}
        className="flex items-center justify-center font-mono font-bold leading-none"
      >
        {name.slice(0, 1).toUpperCase()}
      </span>
    )
  }

  const { icon: Icon, color } = entry

  return <Icon size={size} color={color} aria-hidden="true" />
}

/* =========================================================
    ORBIT MODEL
========================================================= */

type Tile = { name: string; categoryIds: Set<string> }

// One tile per unique icon — React Native shares React's icon, so it folds in —
// and a tool counts towards every category that lists it.
const tiles: Array<Tile> = []

for (const category of categories) {
  for (const name of category.tools) {
    const entry = toolEntry(name)
    const existing = tiles.find(
      (tile) => tile.name === name || (entry && toolEntry(tile.name)?.icon === entry.icon),
    )

    if (existing) {
      existing.categoryIds.add(category.id)
      continue
    }

    tiles.push({ name, categoryIds: new Set([category.id]) })
  }
}

// Roughly 60% of the tiles on the outer ring, the rest inside
const OUTER_RATIO = 0.6
const outerTiles = tiles.slice(0, Math.round(tiles.length * OUTER_RATIO))
const innerTiles = tiles.slice(outerTiles.length)

// Ring radii as a percentage of the stage; the inner ring is 62% across
const OUTER_RADIUS = 50
const INNER_RADIUS = 50 * 0.62

// Even spacing, starting at the top of the circle
const placeOnOrbit = (index: number, count: number, radius: number) => {
  const angle = (index / count) * Math.PI * 2 - Math.PI / 2

  return {
    left: `${50 + radius * Math.cos(angle)}%`,
    top: `${50 + radius * Math.sin(angle)}%`,
  }
}

const ALL = 'all'

/* =========================================================
    ORBIT TILE
========================================================= */

function OrbitTile({
  tile,
  index,
  count,
  radius,
  spinSeconds,
  direction,
  paused,
  reducedMotion,
  isDimmed,
  isHighlighted,
}: {
  tile: Tile
  index: number
  count: number
  radius: number
  spinSeconds: number
  direction: 'normal' | 'reverse'
  paused: boolean
  reducedMotion: boolean
  isDimmed: boolean
  isHighlighted: boolean
}) {
  const { name } = tile
  const position = placeOnOrbit(index, count, radius)

  return (
    <div
      className="absolute"
      style={{
        left: position.left,
        top: position.top,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Counter-rotation, so the tile stays upright as its ring turns */}
      <div
        className={cn(!reducedMotion && 'animate-spin')}
        style={
          reducedMotion
            ? undefined
            : {
                animationDuration: `${spinSeconds}s`,
                animationDirection: direction,
                animationPlayState: paused ? 'paused' : 'running',
              }
        }
      >
        <div
          role="img"
          aria-label={name}
          className={cn(
            'group relative flex items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition duration-300',
            'h-9 w-9 sm:h-11 sm:w-11 md:h-12 md:w-12',
            isHighlighted && 'ring-2 ring-[#8353AD]',
            isDimmed ? 'opacity-20 grayscale' : 'opacity-100',
          )}
          style={{ scale: isHighlighted ? 1.15 : 1 }}
        >
          <ToolGlyph name={name} size={22} />

          {/* Tooltip */}
          <span
            role="tooltip"
            className="pointer-events-none absolute top-full left-1/2 mt-1.5 -translate-x-1/2 rounded-md bg-gray-900 px-2 py-1 font-mono text-[10px] whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          >
            {name}
          </span>
        </div>
      </div>
    </div>
  )
}

/* =========================================================
    TECH CIRCLE
========================================================= */

function TechCircle({
  active,
  reducedMotion,
}: {
  active: string
  reducedMotion: boolean
}) {
  const [paused, setPaused] = useState(false)
  const isAll = active === ALL
  const category = isAll
    ? undefined
    : categories.find((entry) => entry.id === active)

  const centre = {
    name: isAll ? 'All' : (category?.name ?? ''),
    caption: isAll ? "Everything I've shipped with" : (category?.caption ?? ''),
    count: isAll ? tiles.length : (category?.tools.length ?? 0),
  }

  // animate-spin carries the keyframes; direction/duration are overridden
  const spin = (seconds: number, direction: 'normal' | 'reverse') =>
    reducedMotion
      ? undefined
      : ({
          animationDuration: `${seconds}s`,
          animationDirection: direction,
          animationPlayState: paused ? 'paused' : 'running',
        } satisfies CSSProperties)

  const state = (tile: Tile) => ({
    isDimmed: !isAll && !tile.categoryIds.has(active),
    isHighlighted: !isAll && tile.categoryIds.has(active),
  })

  return (
    <div
      role="img"
      aria-label="Technologies I've worked with"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      className="relative mx-auto aspect-square w-full max-w-[520px]"
    >
      {/* Glow behind the centre disc */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C19ADD]/25 blur-2xl md:h-44 md:w-44"
      />

      {/* Outer ring — clockwise */}
      <div
        className={cn(
          'absolute inset-0 rounded-full border border-dashed border-[#C19ADD]/50',
          !reducedMotion && 'animate-spin',
        )}
        style={spin(60, 'normal')}
      >
        {outerTiles.map((tile, i) => (
          <OrbitTile
            key={tile.name}
            tile={tile}
            index={i}
            count={outerTiles.length}
            radius={OUTER_RADIUS}
            spinSeconds={60}
            direction="reverse"
            paused={paused}
            reducedMotion={reducedMotion}
            {...state(tile)}
          />
        ))}
      </div>

      {/* Inner ring — counter-clockwise */}
      <div
        className={cn(
          'absolute inset-[19%] rounded-full border border-dashed border-[#C19ADD]/50',
          !reducedMotion && 'animate-spin',
        )}
        style={spin(45, 'reverse')}
      >
        {innerTiles.map((tile, i) => (
          <OrbitTile
            key={tile.name}
            tile={tile}
            index={i}
            count={innerTiles.length}
            radius={INNER_RADIUS}
            spinSeconds={45}
            direction="normal"
            paused={paused}
            reducedMotion={reducedMotion}
            {...state(tile)}
          />
        ))}
      </div>

      {/* Centre disc */}
      <div className="absolute top-1/2 left-1/2 flex h-36 w-36 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-gray-200 bg-white px-5 text-center md:h-44 md:w-44">
        <span className="text-2xl font-black text-gray-900">{centre.name}</span>

        <span className="mt-1 text-sm text-gray-500">{centre.caption}</span>

        <span className="mt-1.5 font-mono text-xs text-[#8353AD]">
          {centre.count} tools
        </span>
      </div>
    </div>
  )
}

/* =========================================================
    CATEGORY BUTTONS
========================================================= */

type Option = {
  id: string
  name: string
  caption: string
  tools: Array<string>
}

function CategoryButtons({
  active,
  onSelect,
  reducedMotion,
}: {
  active: string
  onSelect: (id: string) => void
  reducedMotion: boolean
}) {
  const buttons = useRef<Array<HTMLButtonElement | null>>([])

  const options: Array<Option> = [
    {
      id: ALL,
      name: 'All',
      caption: "Everything I've shipped with",
      tools: tiles.map((tile) => tile.name),
    },
    ...categories.map((category) => ({
      id: category.id,
      name: category.name,
      caption: category.caption,
      tools: category.tools,
    })),
  ]

  // Arrow Up/Down walk the stack while a button holds focus
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return

    const from = buttons.current.indexOf(
      event.target as HTMLButtonElement,
    )

    if (from === -1) return

    event.preventDefault()

    const step = event.key === 'ArrowDown' ? 1 : -1
    const next = (from + step + options.length) % options.length

    buttons.current[next]?.focus()
  }

  return (
    <div
      role="group"
      aria-label="Filter by category"
      onKeyDown={onKeyDown}
      className="flex flex-col gap-3"
    >
      {options.map((option, i) => {
        const isActive = option.id === active
        const preview = option.tools.slice(0, 4)

        return (
          <motion.button
            key={option.id}
            ref={(node) => {
              buttons.current[i] = node
            }}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(option.id)}
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.05 }}
            style={{
              // A touch more shadow on each button, so the stack reads as depth
              boxShadow: isActive
                ? '0 10px 30px rgba(131, 83, 173, 0.25)'
                : `0 ${4 + i * 2}px ${14 + i * 4}px rgba(0, 0, 0, ${0.04 + i * 0.01})`,
            }}
            className={cn(
              'flex w-full items-center justify-between gap-4 rounded-2xl border px-5 py-4 text-left transition duration-300 focus-visible:ring-2 focus-visible:ring-[#C19ADD] focus-visible:outline-none',
              isActive
                ? 'border-[#8353AD] bg-[#8353AD] text-white'
                : 'border-gray-200 bg-white text-gray-900 hover:-translate-y-0.5 hover:border-[#C19ADD]',
            )}
          >
            <span className="min-w-0">
              <span className="block text-lg font-bold">{option.name}</span>

              <span
                className={cn(
                  'block text-sm',
                  isActive ? 'text-white/70' : 'text-gray-500',
                )}
              >
                {option.caption}
              </span>
            </span>

            <span className="flex shrink-0 items-center gap-3">
              {/* Overlapping icon preview */}
              <span className="flex">
                {preview.map((name) => (
                  <span
                    key={name}
                    aria-hidden="true"
                    className="-ml-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white ring-1 ring-gray-200 first:ml-0"
                  >
                    <ToolGlyph name={name} size={16} />
                  </span>
                ))}
              </span>

              <span
                className={cn(
                  'rounded-full px-2.5 py-1 font-mono text-[10px]',
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-[#C19ADD]/15 text-[#441573]',
                )}
              >
                {option.tools.length}
              </span>
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}

/* =========================================================
    SECTION
========================================================= */

export default function StackSection() {
  const reducedMotion = Boolean(useReducedMotion())
  const [active, setActive] = useState(ALL)

  return (
    <section
      id="stack"
      className="relative w-full scroll-mt-24 border-t border-gray-200 bg-[#FAFAFA] pt-10 pb-20 md:pt-14 md:pb-28"
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
            04 / Stack
          </span>

          <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] text-gray-900 md:text-5xl lg:text-6xl">
            The stack behind the{' '}
            <span className="pr-1 text-[#8353AD] italic">products</span>
            <span className="text-[#8353AD]">.</span>
          </h2>

          <p className="mt-4 max-w-xl text-gray-600">
            The tools behind the products — pick a category and see where each
            one sits.
          </p>
        </motion.header>

        {/* =====================================================
            CIRCLE + CATEGORY SELECT
        ===================================================== */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16"
        >
          {/* Circle — second on mobile, first on desktop */}
          <div className="order-2 lg:order-1">
            <TechCircle active={active} reducedMotion={reducedMotion} />
          </div>

          {/* Categories — first on mobile, so the controls are reachable */}
          <div className="order-1 lg:order-2">
            <CategoryButtons
              active={active}
              onSelect={setActive}
              reducedMotion={reducedMotion}
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
