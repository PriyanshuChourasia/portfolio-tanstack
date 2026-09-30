import { useEffect } from 'react'
import { motion, useAnimate, useReducedMotion } from 'framer-motion'

const DEEP = '#441573'
const ACCENT = '#8353AD'
const SOFT = '#C19ADD'

/* =========================================================
    GEAR GEOMETRY — 8 teeth around (0, 0)
========================================================= */

const TEETH = 8
const OUTER_R = 34
const ROOT_R = 27

function gearPath() {
  const point = (r: number, deg: number) => {
    const rad = (deg * Math.PI) / 180
    return `${(Math.cos(rad) * r).toFixed(2)} ${(Math.sin(rad) * r).toFixed(2)}`
  }

  const step = 360 / TEETH
  const points = Array.from({ length: TEETH }, (_, i) => {
    const a = i * step
    // Wider at the root than the tip, so each tooth tapers
    return [
      point(ROOT_R, a - 14),
      point(OUTER_R, a - 8),
      point(OUTER_R, a + 8),
      point(ROOT_R, a + 14),
    ]
  }).flat()

  return `M ${points.join(' L ')} Z`
}

const GEAR_PATH = gearPath()

// "</>" glyph at the start of the first code line
const GLYPH_PATH = 'M64 38 L58 42 L64 46 M71 36 L67 48 M74 38 L80 42 L74 46'

// Code lines inside the screen, typed in this order
const CODE_LINES = [
  { x1: 86, x2: 124, y: 42 },
  { x1: 66, x2: 136, y: 54 },
  { x1: 66, x2: 110, y: 66 },
  { x1: 58, x2: 124, y: 78 },
]

const stroke = {
  fill: 'none',
  strokeWidth: 3,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

/* =========================================================
    ANIMATION — gear spins, collapses into a monitor, code types in
========================================================= */

export default function GearToCodeAnimation({
  className = '',
}: {
  className?: string
}) {
  const reducedMotion = Boolean(useReducedMotion())
  const [scope, animate] = useAnimate<SVGSVGElement>()

  useEffect(() => {
    if (reducedMotion) return

    // Set by the cleanup when the slide unmounts mid-sequence
    let cancelled = false
    const stopped = () => cancelled

    const run = async () => {
      // 0.0 – 1.2s: gear fades in and turns
      animate(
        '.glow',
        { opacity: [0, 0.5, 0.3], scale: [0.8, 1.1, 1] },
        { duration: 1.2, ease: 'easeInOut' },
      )
      await animate(
        '.gear',
        { opacity: [0, 1], rotate: [0, 180] },
        { duration: 1.2, ease: 'easeInOut' },
      )
      if (stopped()) return

      // 1.2 – 2.0s: gear spins faster and shrinks while the monitor draws
      animate('.teeth', { opacity: 0 }, { duration: 0.6 })
      animate('.glow', { opacity: 0 }, { duration: 0.8 })
      animate(
        '.frame',
        { pathLength: [0, 1], opacity: [0, 1] },
        { duration: 0.8, ease: 'easeInOut' },
      )
      await animate(
        '.gear',
        { rotate: 360, scale: 0.35 },
        { duration: 0.8, ease: 'easeIn' },
      )
      if (stopped()) return

      // 2.0 – 2.4s: what's left of the gear becomes the power dot
      animate('.gear', { opacity: 0, scale: 0.1 }, { duration: 0.4 })
      await animate(
        '.power',
        { opacity: [0, 1], scale: [0, 1] },
        { duration: 0.4, ease: 'easeOut' },
      )
      if (stopped()) return

      // 2.4 – 4.2s: code types in, one line at a time
      const lines = scope.current.querySelectorAll('.code')
      for (const line of lines) {
        await animate(
          line,
          { pathLength: [0, 1], opacity: [0, 1] },
          { duration: 0.35, ease: 'easeOut' },
        )
        if (stopped()) return
        await new Promise((resolve) => setTimeout(resolve, 100))
        if (stopped()) return
      }

      // 4.2s →: blinking cursor, everything else holds
      animate(
        '.cursor',
        { opacity: [1, 0] },
        { duration: 0.5, repeat: Infinity, repeatType: 'reverse' },
      )
    }

    run()

    return () => {
      cancelled = true
    }
  }, [animate, reducedMotion, scope])

  // Reduced motion: the finished computer-with-code frame, no gear, no blink
  const hidden = reducedMotion ? 1 : 0

  return (
    <svg
      ref={scope}
      viewBox="0 0 200 140"
      role="img"
      aria-label="A mechanical gear transforming into a computer showing code"
      className={className}
    >
      {/* Soft glow behind the gear */}
      <motion.circle
        className="glow"
        cx={100}
        cy={63}
        r={42}
        fill={SOFT}
        initial={{ opacity: 0 }}
      />

      {/* Gear */}
      {!reducedMotion && (
        <g transform="translate(100 63)">
          <motion.g className="gear" initial={{ opacity: 0 }}>
            <motion.path
              className="teeth"
              d={GEAR_PATH}
              stroke={DEEP}
              {...stroke}
            />
            <circle r={10} stroke={ACCENT} {...stroke} />
          </motion.g>
        </g>
      )}

      {/* Monitor */}
      <motion.rect
        className="frame"
        x={45}
        y={25}
        width={110}
        height={72}
        rx={8}
        stroke={DEEP}
        {...stroke}
        initial={{ pathLength: hidden, opacity: hidden }}
      />
      <motion.path
        className="frame"
        d="M100 97 L100 108 M78 112 L122 112"
        stroke={DEEP}
        {...stroke}
        initial={{ pathLength: hidden, opacity: hidden }}
      />

      {/* Power dot — where the gear's hub ends up */}
      <motion.circle
        className="power"
        cx={146}
        cy={90}
        r={2.5}
        fill={ACCENT}
        initial={{ opacity: hidden, scale: hidden }}
      />

      {/* Code */}
      <motion.path
        className="code"
        d={GLYPH_PATH}
        stroke={ACCENT}
        {...stroke}
        strokeWidth={2.5}
        initial={{ pathLength: hidden, opacity: hidden }}
      />
      {CODE_LINES.map((line, i) => (
        <motion.path
          key={line.y}
          className="code"
          d={`M${line.x1} ${line.y} L${line.x2} ${line.y}`}
          stroke={i % 2 === 0 ? DEEP : SOFT}
          {...stroke}
          initial={{ pathLength: hidden, opacity: hidden }}
        />
      ))}

      {/* Cursor */}
      <motion.rect
        className="cursor"
        x={129}
        y={73}
        width={5}
        height={10}
        rx={1}
        fill={ACCENT}
        initial={{ opacity: hidden }}
      />
    </svg>
  )
}
