import { AnimatePresence, motion } from 'framer-motion'
import { Armchair, ArrowRight, Banknote, Building2 } from 'lucide-react'
import {
  ActorCard,
  AnimationFrame,
  TAccount,
  TEntry,
  TransactionTrack,
  useStepPlayer,
} from './AnimationFrame'

const STEPS = [
  {
    title: 'In & out',
    caption:
      'Furniture of Rs 5,000 is purchased in cash: furniture comes in, cash goes out.',
    duration: 4000,
  },
  {
    title: 'Debit what comes in',
    caption: 'Furniture comes in, so it is recorded on the debit (left) side.',
    duration: 3500,
  },
  {
    title: 'Credit what goes out',
    caption: 'Cash is moving out, so it is recorded on the credit (right) side.',
    duration: 3500,
  },
  {
    title: 'Carry forward',
    caption:
      'A real account is permanent: furniture does not go to zero in the next financial year, it carries forward.',
    duration: 5000,
  },
]

export function RealAccountAnimation() {
  const player = useStepPlayer(STEPS)
  const { step } = player

  return (
    <AnimationFrame player={player} steps={STEPS}>
      <div className="min-h-80">
        <AnimatePresence mode="wait">
          {step < 3 ? (
            <motion.div
              key="entry"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
                <div>
                  <p className="mb-1 text-center text-[11px] font-semibold tracking-wide text-blue-700 uppercase">
                    Comes in
                  </p>
                  <TransactionTrack
                    runKey={`furniture-${step}`}
                    delay={0.3}
                    token={<Armchair className="h-4 w-4" />}
                  />
                </div>
                <ActorCard
                  icon={<Building2 className="h-7 w-7" />}
                  label="Business"
                  name="Books"
                  accent
                />
                <div>
                  <p className="mb-1 text-center text-[11px] font-semibold tracking-wide text-emerald-700 uppercase">
                    Goes out
                  </p>
                  <TransactionTrack
                    runKey={`cash-${step}`}
                    delay={1.1}
                    token={<Banknote className="h-4 w-4" />}
                  />
                </div>
              </div>
              <div className="mt-6">
                <TAccount
                  title="Real A/C entry"
                  highlight={
                    step === 1 ? 'debit' : step === 2 ? 'credit' : undefined
                  }
                  debit={
                    step >= 1 && (
                      <TEntry key="furniture" side="debit" delay={0.4}>
                        <span>Furniture A/C</span>
                        <span>₹5,000</span>
                      </TEntry>
                    )
                  }
                  credit={
                    step >= 2 && (
                      <TEntry key="cash" side="credit" delay={0.4}>
                        <span>Cash A/C</span>
                        <span>₹5,000</span>
                      </TEntry>
                    )
                  }
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="carry"
              className="grid min-h-80 grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <YearBook label="This financial year" note="Closing" />
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <ArrowRight className="h-6 w-6 text-blue-600" />
              </motion.div>
              <YearBook label="Next financial year" note="Opening" delay={1.4} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimationFrame>
  )
}

function YearBook({
  label,
  note,
  delay = 0,
}: {
  label: string
  note: string
  delay?: number
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-3 shadow-sm">
      <p className="text-xs font-semibold text-neutral-900 sm:text-sm">
        {label}
      </p>
      <p className="text-[11px] tracking-wide text-neutral-500 uppercase">
        {note}
      </p>
      <motion.div
        className="mt-3 flex items-center justify-between gap-2 rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-800 sm:text-sm"
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
      >
        <span className="flex items-center gap-1.5">
          <Armchair className="h-3.5 w-3.5" />
          Furniture
        </span>
        <span>₹5,000</span>
      </motion.div>
    </div>
  )
}
