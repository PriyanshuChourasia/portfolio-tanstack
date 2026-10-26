import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { AnimationFrame, useStepPlayer } from './AnimationFrame'

const STEPS = [
  {
    title: 'Two types',
    caption: 'There are two types of accounts: Personal and Impersonal.',
    duration: 3500,
  },
  {
    title: 'Personal',
    caption:
      'A personal account involves a natural person, an artificial person and a representative person.',
    duration: 4500,
  },
  {
    title: 'Impersonal',
    caption: 'An impersonal account is of two types: Real A/C and Nominal A/C.',
    duration: 4500,
  },
  {
    title: 'Real & Nominal',
    caption:
      'Real accounts hold assets, tangible and intangible. Nominal accounts hold expenses and income.',
    duration: 5500,
  },
]

export function AccountTypesAnimation() {
  const player = useStepPlayer(STEPS)
  const { step } = player

  return (
    <AnimationFrame player={player} steps={STEPS}>
      <div className="flex min-h-72 flex-col items-center">
        <Node active={step === 0}>Accounts</Node>
        <Stem />
        <div className="grid w-full grid-cols-2 gap-3">
          <div className="flex flex-col items-center">
            <Node active={step === 1} delay={0.3}>
              Personal
            </Node>
            <Reveal show={step >= 1}>
              <Stem />
              <div className="flex flex-col items-center gap-1.5">
                {['Natural', 'Artificial', 'Representative'].map(
                  (label, index) => (
                    <Leaf key={label} delay={0.3 + index * 0.25}>
                      {label}
                    </Leaf>
                  ),
                )}
              </div>
            </Reveal>
          </div>
          <div className="flex flex-col items-center">
            <Node active={step === 2} delay={0.3}>
              Impersonal
            </Node>
            <Reveal show={step >= 2}>
              <Stem />
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col items-center">
                  <Node active={step === 3} delay={0.3} small>
                    Real
                  </Node>
                  <Reveal show={step >= 3}>
                    <Stem />
                    <div className="flex flex-col items-center gap-1.5">
                      <Leaf delay={0.3}>Tangible</Leaf>
                      <Leaf delay={0.55}>Intangible</Leaf>
                    </div>
                  </Reveal>
                </div>
                <div className="flex flex-col items-center">
                  <Node active={step === 3} delay={0.55} small>
                    Nominal
                  </Node>
                  <Reveal show={step >= 3}>
                    <Stem />
                    <div className="flex flex-col items-center gap-1.5">
                      <Leaf delay={0.8}>Expense</Leaf>
                      <Leaf delay={1.05}>Income</Leaf>
                    </div>
                  </Reveal>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </AnimationFrame>
  )
}

function Node({
  children,
  active,
  delay = 0,
  small = false,
}: {
  children: ReactNode
  active: boolean
  delay?: number
  small?: boolean
}) {
  return (
    <motion.div
      className={cn(
        'rounded-lg border-2 bg-white font-semibold shadow-sm transition-colors duration-500',
        small ? 'px-2 py-1 text-xs sm:text-sm' : 'px-4 py-1.5 text-sm sm:text-base',
        active
          ? 'border-blue-600 text-blue-700'
          : 'border-neutral-300 text-neutral-800',
      )}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      {children}
    </motion.div>
  )
}

function Leaf({ children, delay }: { children: ReactNode; delay: number }) {
  return (
    <motion.span
      className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-medium text-blue-800 sm:text-xs"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
    >
      {children}
    </motion.span>
  )
}

function Stem() {
  return <div className="h-4 w-0.5 bg-neutral-300" />
}

function Reveal({ show, children }: { show: boolean; children: ReactNode }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
