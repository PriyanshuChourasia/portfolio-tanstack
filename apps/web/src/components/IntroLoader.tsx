import { useEffect } from 'react'
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion'

export const INTRO_DURATION_MS = 3000

const EASE = [0.22, 1, 0.36, 1] as const

type Glyph = {
  char: string
  x: number
  stroke: string
  fill: string
  delay: number
}

// "P.C." laid out around the same slanted divider used in the hero
const glyphs: Array<Glyph> = [
  { char: 'P', x: 168, stroke: '#E9DDF7', fill: 'url(#pc-white)', delay: 0.1 },
  { char: '.', x: 238, stroke: '#BE2ED6', fill: '#BE2ED6', delay: 0.45 },
  { char: 'C', x: 382, stroke: '#FF5A61', fill: 'url(#pc-red)', delay: 0.3 },
  { char: '.', x: 458, stroke: '#EF1D25', fill: '#EF1D25', delay: 0.6 },
]

const DASH = 900

/**
 * Full-screen intro shown for INTRO_DURATION_MS. The monogram strokes in,
 * fills, and a progress bar fills — the parent unmounts this inside
 * <AnimatePresence> and the `exit` curtain lifts to reveal the page.
 */
export function IntroLoader() {
  const reduced = useReducedMotion()
  const progress = useMotionValue(0)
  const barScale = useTransform(progress, [0, 100], [0, 1])

  useEffect(() => {
    const controls = animate(progress, 100, {
      duration: (INTRO_DURATION_MS - 200) / 1000,
      ease: [0.65, 0, 0.35, 1],
    })

    // Lock scroll while the intro covers the page
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      controls.stop()
      document.body.style.overflow = prevOverflow
    }
  }, [progress])

  return (
    <motion.div
      role="status"
      aria-label="Loading Priyanshu Chourasia's portfolio"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#070707]"
      initial={{ y: 0 }}
      exit={
        reduced
          ? { opacity: 0, transition: { duration: 0.4 } }
          : {
              y: '-100%',
              borderBottomLeftRadius: '50% 12%',
              borderBottomRightRadius: '50% 12%',
              transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] },
            }
      }
    >
      {/* Ambient glow — same slant split as the hero */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[min(900px,130vw)]"
        style={{
          x: '-50%',
          y: '-50%',
          backgroundImage:
            'linear-gradient(110deg, #7F4EA8 0%, #BE2ED6 49.8%, #5D328E 50.2%, #2A0E4A 100%)',
          maskImage:
            'radial-gradient(closest-side, black 0%, rgba(0,0,0,0.45) 45%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(closest-side, black 0%, rgba(0,0,0,0.45) 45%, transparent 100%)',
        }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 0.55, scale: 1 }}
        transition={{ duration: 1.6, ease: EASE }}
      />

      {/* Faint grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(190, 46, 214, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(190, 46, 214, 0.06) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage:
            'radial-gradient(ellipse 60% 50% at 50% 50%, black 10%, transparent 75%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 60% 50% at 50% 50%, black 10%, transparent 75%)',
        }}
      />

      {/* Monogram */}
      <motion.svg
        viewBox="0 0 600 260"
        className="relative w-[min(560px,82vw)] overflow-visible"
        aria-hidden="true"
        initial={reduced ? false : { scale: 0.96 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.6, ease: EASE }}
      >
        <defs>
          <linearGradient id="pc-white" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#D9C6F0" />
          </linearGradient>
          <linearGradient id="pc-red" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF5A61" />
            <stop offset="55%" stopColor="#EF1D25" />
            <stop offset="100%" stopColor="#B3121A" />
          </linearGradient>
          <linearGradient id="pc-line" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E879F9" stopOpacity="0" />
            <stop offset="25%" stopColor="#E879F9" />
            <stop offset="60%" stopColor="#BE2ED6" />
            <stop offset="100%" stopColor="#42156F" stopOpacity="0" />
          </linearGradient>
          <filter id="pc-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Slanted divider */}
        <motion.line
          x1="310"
          y1="10"
          x2="310"
          y2="250"
          stroke="url(#pc-line)"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#pc-glow)"
          style={{ rotate: 20, originX: '310px', originY: '130px' }}
          initial={reduced ? { opacity: 0 } : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
        />

        {glyphs.map((g, i) => (
          <motion.text
            key={i}
            x={g.x}
            y={i < 2 ? 175 : 205}
            textAnchor="middle"
            fontFamily="'Space Grotesk', sans-serif"
            fontWeight={700}
            fontSize={190}
            letterSpacing="-6"
            stroke={g.stroke}
            strokeWidth={2}
            strokeDasharray={DASH}
            initial={
              reduced
                ? { opacity: 0, fillOpacity: 1, strokeDashoffset: 0 }
                : { opacity: 0, fillOpacity: 0, strokeDashoffset: DASH, y: 18 }
            }
            animate={{
              opacity: 1,
              fillOpacity: 1,
              strokeDashoffset: 0,
              y: 0,
            }}
            transition={{
              opacity: { duration: 0.4, delay: g.delay },
              y: { duration: 0.9, delay: g.delay, ease: EASE },
              strokeDashoffset: {
                duration: 1.3,
                delay: g.delay,
                ease: [0.65, 0, 0.35, 1],
              },
              fillOpacity: {
                duration: 0.7,
                delay: g.delay + 0.9,
                ease: EASE,
              },
            }}
            fill={g.fill}
            style={{ filter: 'drop-shadow(0 6px 24px rgba(190,46,214,0.35))' }}
          >
            {g.char}
          </motion.text>
        ))}
      </motion.svg>

      {/* Name reveal */}
      <motion.p
        className="relative mt-6 font-mono text-[10px] uppercase tracking-[0.55em] text-white/60 sm:text-xs"
        initial={{ opacity: 0, letterSpacing: '0.9em' }}
        animate={{ opacity: 1, letterSpacing: '0.55em' }}
        transition={{ duration: 1.2, delay: 1.2, ease: EASE }}
      >
        Priyanshu <span className="text-[#FF6B71]/85">Chourasia</span>
      </motion.p>

      {/* Progress */}
      <div className="absolute inset-x-0 bottom-10 flex flex-col items-center px-6 sm:bottom-14">
        <div className="h-px w-[min(280px,70vw)] overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full origin-left bg-[linear-gradient(90deg,#7F4EA8,#BE2ED6,#EF1D25)] shadow-[0_0_10px_#BE2ED6]"
            style={{ scaleX: barScale }}
          />
        </div>
      </div>
    </motion.div>
  )
}
