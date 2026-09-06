import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion'
import { useMemo, useRef, useState } from 'react'
import { Code2 } from 'lucide-react'

interface CodingSkill {
  name: string
  value: number
  color: string
}

interface CodingSkillsPanelProps {
  codingSkills: Array<CodingSkill>
}

interface OrbitRingProps {
  skill: CodingSkill
  index: number
  paused: boolean
  active: boolean
  reducedMotion: boolean | null
  onHoverChange: (active: boolean) => void
}

const MAX_RADIUS = 112
const MIN_RADIUS = 60

const radiusFor = (value: number) =>
  MAX_RADIUS - (value / 100) * (MAX_RADIUS - MIN_RADIUS)

const sizeFor = (value: number) => 12 + (value / 100) * 12

const glowFor = (color: string, value: number) => {
  const bloom = Math.round(4 + value / 20)
  const halo = Math.round(9 + value / 10)
  return `0 0 ${bloom}px ${color}, 0 0 ${halo}px ${color}66`
}

function OrbitRing({
  skill,
  index,
  paused,
  active,
  reducedMotion,
  onHoverChange,
}: OrbitRingProps) {
  const radius = radiusFor(skill.value)
  const phase = (index * 137.5 + (index % 3) * 23) % 360
  const rotation = useMotionValue(phase)
  const counter = useTransform(rotation, (r) => -r)
  const reverse = index % 2 === 1
  const duration = 9 + (skill.value / 100) * 9
  const yScale = 0.62 + (index % 3) * 0.2
  const size = sizeFor(skill.value)

  useAnimationFrame((_, delta) => {
    if (paused || reducedMotion) return
    const step = (delta / 1000) * (360 / duration) * (reverse ? -1 : 1)
    rotation.set(rotation.get() + step)
  })

  return (
    <motion.div
      className="pointer-events-none absolute left-1/2 top-1/2 rounded-full border border-border/25 will-change-transform"
      style={{
        width: radius * 2,
        height: radius * 2,
        x: -radius,
        y: -radius,
        rotate: rotation,
        scaleY: yScale,
      }}
    >
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="will-change-transform"
          style={{ rotate: counter, scaleY: 1 / yScale }}
        >
          <motion.button
            type="button"
            aria-label={`${skill.name}: ${skill.value}% proficiency`}
            aria-pressed={active}
            onHoverStart={() => onHoverChange(true)}
            onHoverEnd={() => onHoverChange(false)}
            onTapStart={() => onHoverChange(true)}
            onTapCancel={() => onHoverChange(false)}
            onBlur={() => onHoverChange(false)}
            whileHover={{ scale: 1.45 }}
            whileTap={{ scale: 1.25 }}
            transition={{ type: 'spring', stiffness: 380, damping: 18 }}
            className="group relative flex flex-col items-center outline-none cursor-pointer"
          >
            <motion.span
              className="block rounded-full"
              style={{
                width: size,
                height: size,
                backgroundColor: skill.color,
                boxShadow: glowFor(skill.color, skill.value),
              }}
              animate={reducedMotion ? {} : { scale: [1, 1.09, 1] }}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: index * 0.35,
              }}
            />
            <motion.span
              initial={false}
              animate={{ opacity: active ? 1 : 0, y: active ? 0 : 5 }}
              transition={{ duration: 0.18 }}
              className="absolute -top-6 whitespace-nowrap rounded-full bg-foreground px-2.5 py-0.5 text-[10px] font-semibold text-card shadow-md"
            >
              {skill.name} · {skill.value}%
            </motion.span>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}

export function CodingSkillsPanel({ codingSkills }: CodingSkillsPanelProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reducedMotion = useReducedMotion()
  const [hovered, setHovered] = useState<number | null>(null)

  const stars = useMemo(() => {
    let seed = 42
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }
    return Array.from({ length: 48 }, () => ({
      left: rand() * 100,
      top: rand() * 100,
      size: 1 + Math.round(rand() * 2),
      twinkle: rand() > 0.72,
      delay: rand() * 6,
      duration: 3 + rand() * 5,
    }))
  }, [])

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-6"
    >
      <div className="relative z-10 flex items-center gap-3 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.75 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.4 }}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10"
        >
          <Code2 className="h-4.5 w-4.5 text-primary" />
        </motion.div>
        <h3 className="text-base font-bold text-foreground">Coding Skills</h3>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative hidden sm:block mx-auto aspect-square w-full max-w-[320px]"
      >
        <div className="pointer-events-none absolute inset-0">
          {stars.map((star, i) => (
            <span
              key={i}
              className={`absolute rounded-full bg-foreground ${star.twinkle ? 'animate-pulse' : ''}`}
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                width: star.size,
                height: star.size,
                opacity: star.twinkle ? 0.7 : 0.16 + (i % 4) * 0.08,
                animationDelay: `${star.delay}s`,
                animationDuration: `${star.duration}s`,
              }}
            />
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-10 -left-8 h-36 w-36 rounded-full bg-primary-accent/15 blur-3xl" />
          <div className="absolute -bottom-10 -right-8 h-40 w-40 rounded-full bg-primary/12 blur-3xl" />
          <div className="absolute top-1/3 left-1/4 h-28 w-28 rounded-full bg-emerald-500/10 blur-3xl" />
        </div>

        {codingSkills.map((skill, i) => (
          <OrbitRing
            key={skill.name}
            skill={skill}
            index={i}
            paused={hovered === i}
            active={hovered === i}
            reducedMotion={reducedMotion}
            onHoverChange={(a) => setHovered(a ? i : null)}
          />
        ))}

        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="h-12 w-12 rounded-full bg-linear-to-br from-primary to-primary-accent will-change-transform"
            style={{
              boxShadow:
                '0 0 18px var(--primary-accent), 0 0 44px color-mix(in srgb, var(--primary-accent) 40%, transparent)',
            }}
            animate={
              reducedMotion
                ? {}
                : { scale: [1, 1.12, 1], opacity: [0.9, 1, 0.9] }
            }
            transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="sm:hidden flex flex-col divide-y divide-border/40"
      >
        {codingSkills.map((skill) => (
          <div
            key={skill.name}
            className="flex items-center justify-between gap-3 py-2.5"
          >
            <span className="flex items-center gap-2.5 text-sm font-medium text-foreground">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{
                  backgroundColor: skill.color,
                  boxShadow: `0 0 8px ${skill.color}88`,
                }}
              />
              {skill.name}
            </span>
            <span className="text-xs font-semibold text-primary-accent">
              {skill.value}%
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}