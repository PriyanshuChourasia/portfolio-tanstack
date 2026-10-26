import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AnimationFrame, TAccount, TEntry, useStepPlayer } from './AnimationFrame'

const STEPS = [
  {
    title: 'Debit expenses & losses',
    caption: 'Debit all expenses and losses: they go on the debit (left) side.',
    duration: 3500,
  },
  {
    title: 'Credit income & gains',
    caption: 'Credit all income and gains: they go on the credit (right) side.',
    duration: 3500,
  },
  {
    title: 'To P&L A/C',
    caption: 'A nominal account always goes to the Profit and Loss A/C.',
    duration: 4500,
  },
  {
    title: 'Next year',
    caption:
      'Nominal accounts are temporary: they do not carry over to the next year’s book.',
    duration: 4500,
  },
]

const ITEMS = [
  { label: 'Expense', side: 'debit' },
  { label: 'Loss', side: 'debit' },
  { label: 'Income', side: 'credit' },
  { label: 'Gain', side: 'credit' },
] as const

export function NominalAccountAnimation() {
  const player = useStepPlayer(STEPS)
  const { step } = player

  return (
    <AnimationFrame player={player} steps={STEPS}>
      <div className="min-h-56">
        <AnimatePresence mode="wait">
          {step < 2 && (
            <motion.div
              key="rules"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <TAccount
                title="Nominal A/C"
                highlight={step === 0 ? 'debit' : 'credit'}
                debit={ITEMS.filter((item) => item.side === 'debit').map(
                  (item, index) => (
                    <TEntry key={item.label} side="debit" delay={0.3 + index * 0.4}>
                      {item.label}
                    </TEntry>
                  ),
                )}
                credit={
                  step >= 1 &&
                  ITEMS.filter((item) => item.side === 'credit').map(
                    (item, index) => (
                      <TEntry
                        key={item.label}
                        side="credit"
                        delay={0.3 + index * 0.4}
                      >
                        {item.label}
                      </TEntry>
                    ),
                  )
                }
              />
            </motion.div>
          )}
          {step === 2 && (
            <motion.div
              key="pnl"
              className="grid min-h-56 grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Book title="Nominal A/C" note="Year end">
                {ITEMS.map((item, index) => (
                  <Chip
                    key={item.label}
                    side={item.side}
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0, x: 24 }}
                    delay={0.8 + index * 0.2}
                  >
                    {item.label}
                  </Chip>
                ))}
              </Book>
              <ArrowRight className="h-6 w-6 text-blue-600" />
              <Book title="Profit & Loss A/C" note="Receives all" accent>
                {ITEMS.map((item, index) => (
                  <Chip
                    key={item.label}
                    side={item.side}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    delay={1.1 + index * 0.2}
                  >
                    {item.label}
                  </Chip>
                ))}
              </Book>
            </motion.div>
          )}
          {step === 3 && (
            <motion.div
              key="next-year"
              className="grid min-h-56 grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Book title="This financial year" note="Closed to P&L">
                {ITEMS.map((item) => (
                  <Chip
                    key={item.label}
                    side={item.side}
                    initial={{ opacity: 0.35 }}
                    animate={{ opacity: 0.35 }}
                  >
                    <span className="line-through">{item.label}</span>
                  </Chip>
                ))}
              </Book>
              <motion.div
                className="flex flex-col items-center text-neutral-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <ArrowRight className="h-6 w-6" />
                <span className="text-lg font-bold">✕</span>
              </motion.div>
              <Book title="Next financial year" note="Opening">
                <motion.p
                  className="py-2 text-center text-2xl font-bold text-neutral-900"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  ₹0
                </motion.p>
              </Book>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimationFrame>
  )
}

function Book({
  title,
  note,
  accent = false,
  children,
}: {
  title: string
  note: string
  accent?: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'self-stretch rounded-xl border bg-white p-3 shadow-sm',
        accent ? 'border-blue-600' : 'border-neutral-200',
      )}
    >
      <p
        className={cn(
          'text-xs font-semibold sm:text-sm',
          accent ? 'text-blue-700' : 'text-neutral-900',
        )}
      >
        {title}
      </p>
      <p className="text-[11px] tracking-wide text-neutral-500 uppercase">
        {note}
      </p>
      <ul className="mt-2 space-y-1">{children}</ul>
    </div>
  )
}

function Chip({
  side,
  initial,
  animate,
  delay = 0,
  children,
}: {
  side: 'debit' | 'credit'
  initial: Record<string, number>
  animate: Record<string, number>
  delay?: number
  children: React.ReactNode
}) {
  return (
    <motion.li
      className={cn(
        'rounded px-1.5 py-0.5 text-xs font-medium sm:text-sm',
        side === 'debit'
          ? 'bg-blue-50 text-blue-800'
          : 'bg-emerald-50 text-emerald-800',
      )}
      initial={initial}
      animate={animate}
      transition={{ delay, duration: 0.5 }}
    >
      {children}
    </motion.li>
  )
}
