import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from 'framer-motion'
import { Pause, Play } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface AnimationStep {
  title: string
  caption: string
  duration: number
}

// Auto-advances through steps while the figure is on screen.
export function useStepPlayer(
  steps: ReadonlyArray<AnimationStep>,
  onStepChange?: (step: number, running: boolean) => void,
) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { amount: 0.4 })
  const reduceMotion = useReducedMotion() ?? false
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)
  const running = playing && inView && !reduceMotion

  useEffect(() => {
    if (!running) return
    const timer = setTimeout(() => {
      const next = (step + 1) % steps.length
      setStep(next)
      onStepChange?.(next, true)
    }, steps[step].duration)
    return () => clearTimeout(timer)
  }, [running, step, steps, onStepChange])

  function goTo(index: number) {
    setStep(index)
    onStepChange?.(index, running)
  }

  return { ref, step, goTo, playing, setPlaying, running, reduceMotion }
}

export function AnimationFrame({
  player,
  steps,
  children,
}: {
  player: ReturnType<typeof useStepPlayer>
  steps: ReadonlyArray<AnimationStep>
  children: ReactNode
}) {
  const { ref, step, goTo, playing, setPlaying, reduceMotion } = player

  return (
    <figure
      ref={ref}
      className="my-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 sm:p-6"
    >
      {children}

      <figcaption className="mt-4 min-h-12 text-sm text-neutral-600">
        <AnimatePresence mode="wait">
          <motion.p
            key={step}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
          >
            {steps[step].caption}
          </motion.p>
        </AnimatePresence>
      </figcaption>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {!reduceMotion && (
          <button
            type="button"
            onClick={() => setPlaying((current) => !current)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100"
            aria-label={playing ? 'Pause animation' : 'Play animation'}
          >
            {playing ? (
              <Pause className="h-3.5 w-3.5" />
            ) : (
              <Play className="h-3.5 w-3.5" />
            )}
          </button>
        )}
        {steps.map((item, index) => (
          <button
            key={item.title}
            type="button"
            onClick={() => goTo(index)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
              index === step
                ? 'border-blue-600 bg-blue-600 text-white'
                : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100',
            )}
          >
            {index + 1}. {item.title}
          </button>
        ))}
      </div>
    </figure>
  )
}

export function ActorCard({
  icon,
  label,
  name,
  accent = false,
}: {
  icon: ReactNode
  label: string
  name: string
  accent?: boolean
}) {
  return (
    <div className="flex w-24 flex-col items-center text-center sm:w-28">
      <div
        className={cn(
          'flex h-14 w-14 items-center justify-center rounded-full border-2 bg-white shadow-sm',
          accent
            ? 'border-blue-600 text-blue-600'
            : 'border-neutral-300 text-neutral-700',
        )}
      >
        {icon}
      </div>
      <div className="mt-2 h-6 overflow-hidden text-sm font-semibold text-neutral-900">
        <AnimatePresence mode="wait">
          <motion.span
            key={name}
            className="block"
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
          >
            {name}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[11px] tracking-wide text-neutral-500 uppercase">
        {label}
      </span>
    </div>
  )
}

// A dashed line with a token that travels left to right (or right to left).
export function TransactionTrack({
  runKey,
  delay = 0,
  reverse = false,
  token = '₹',
}: {
  runKey: string
  delay?: number
  reverse?: boolean
  token?: ReactNode
}) {
  return (
    <div className="relative h-8">
      <div className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-neutral-300" />
      <motion.div
        key={runKey}
        className="absolute inset-0"
        initial={{ x: reverse ? '100%' : '0%', opacity: 0 }}
        animate={{ x: reverse ? '0%' : '100%', opacity: [0, 1, 1, 0] }}
        transition={{ delay, duration: 0.9, ease: 'easeInOut' }}
      >
        <span className="flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow">
          {token}
        </span>
      </motion.div>
    </div>
  )
}

// Ledger "T" layout: debit on the left, credit on the right.
export function TAccount({
  title,
  debit,
  credit,
  highlight,
}: {
  title: string
  debit: ReactNode
  credit: ReactNode
  highlight?: 'debit' | 'credit'
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-3 shadow-sm">
      <p className="text-center text-xs font-semibold tracking-wide text-neutral-900 uppercase sm:text-sm">
        {title}
      </p>
      <div className="mt-2 grid min-h-24 grid-cols-2 border-t-2 border-neutral-900">
        <div
          className={cn(
            'border-r-2 border-neutral-900 p-2 transition-colors',
            highlight === 'debit' && 'bg-blue-50',
          )}
        >
          <p className="text-[11px] font-semibold tracking-wide text-blue-700 uppercase">
            Debit (left)
          </p>
          <ul className="mt-1 space-y-1">
            <AnimatePresence>{debit}</AnimatePresence>
          </ul>
        </div>
        <div
          className={cn(
            'p-2 transition-colors',
            highlight === 'credit' && 'bg-emerald-50',
          )}
        >
          <p className="text-right text-[11px] font-semibold tracking-wide text-emerald-700 uppercase">
            Credit (right)
          </p>
          <ul className="mt-1 space-y-1">
            <AnimatePresence>{credit}</AnimatePresence>
          </ul>
        </div>
      </div>
    </div>
  )
}

export function TEntry({
  side,
  children,
  delay = 0,
}: {
  side: 'debit' | 'credit'
  children: ReactNode
  delay?: number
}) {
  return (
    <motion.li
      className={cn(
        'flex items-center justify-between gap-2 rounded px-1.5 py-0.5 text-xs font-medium sm:text-sm',
        side === 'debit'
          ? 'bg-blue-50 text-blue-800'
          : 'bg-emerald-50 text-emerald-800',
      )}
      initial={{ opacity: 0, x: side === 'debit' ? -24 : 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      {children}
    </motion.li>
  )
}
