import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, Building2, User } from 'lucide-react'
import {
  ActorCard,
  AnimationFrame,
  TransactionTrack,
  useStepPlayer,
} from './AnimationFrame'

const NAMES = ['Rahul', 'John', 'Mike', 'Rashi', 'Sonam']
const NAME_INTERVAL = 1400

const STEPS = [
  {
    title: 'Natural person',
    caption:
      'Rahul, John, Mike, Rashi, Sonam — transactions involving them move into the personal account book.',
    duration: NAMES.length * NAME_INTERVAL + 800,
  },
  {
    title: 'Owner ≠ Business',
    caption: 'The business and the owner are two different entities.',
    duration: 4500,
  },
  {
    title: 'Artificial person',
    caption:
      'The business is made by law and has its own identity, so it also moves into the personal account book.',
    duration: 4500,
  },
]

export function PersonalAccountAnimation() {
  const [nameIndex, setNameIndex] = useState(0)
  const handleStepChange = useCallback((next: number, running: boolean) => {
    setNameIndex(next === 0 && running ? 0 : NAMES.length - 1)
  }, [])
  const player = useStepPlayer(STEPS, handleStepChange)
  const { step, running } = player

  useEffect(() => {
    if (!running || step !== 0) return
    const timer = setInterval(() => {
      setNameIndex((current) => Math.min(current + 1, NAMES.length - 1))
    }, NAME_INTERVAL)
    return () => clearInterval(timer)
  }, [running, step])

  const rows = step === 0 ? NAMES.slice(0, nameIndex + 1) : NAMES

  return (
    <AnimationFrame player={player} steps={STEPS}>
      <div className="grid h-64 grid-cols-[auto_1fr_auto] items-center gap-2 sm:gap-4">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="natural"
              className="contents"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ActorCard
                icon={<User className="h-7 w-7" />}
                label="Natural person"
                name={NAMES[nameIndex]}
              />
              <TransactionTrack runKey={`natural-${nameIndex}`} />
            </motion.div>
          )}
          {step === 1 && (
            <motion.div
              key="split"
              className="relative col-span-2 flex h-full items-center justify-center gap-10 sm:gap-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ x: '60%' }}
                animate={{ x: 0 }}
                transition={{ delay: 0.6, duration: 0.9, ease: 'easeInOut' }}
              >
                <ActorCard
                  icon={<User className="h-7 w-7" />}
                  label="Natural person"
                  name="Owner"
                />
              </motion.div>
              <motion.span
                className="absolute text-3xl font-bold text-blue-600"
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.4 }}
              >
                ≠
              </motion.span>
              <motion.div
                initial={{ x: '-60%' }}
                animate={{ x: 0 }}
                transition={{ delay: 0.6, duration: 0.9, ease: 'easeInOut' }}
              >
                <ActorCard
                  icon={<Building2 className="h-7 w-7" />}
                  label="Artificial person"
                  name="Business"
                  accent
                />
              </motion.div>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div
              key="artificial"
              className="contents"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ActorCard
                icon={<Building2 className="h-7 w-7" />}
                label="Artificial person"
                name="Business"
                accent
              />
              <TransactionTrack runKey="artificial" delay={0.6} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-32 self-stretch rounded-xl border border-neutral-200 bg-white p-3 shadow-sm sm:w-44">
          <div className="flex items-center gap-2 border-b border-neutral-200 pb-2 text-xs font-semibold text-neutral-900 sm:text-sm">
            <BookOpen className="h-4 w-4 text-blue-600" />
            Personal A/C
          </div>
          <ul className="mt-2 space-y-1 text-xs sm:text-sm">
            <AnimatePresence initial={false}>
              {rows.map((name) => (
                <motion.li
                  key={name}
                  className="flex items-center gap-1.5 rounded px-1.5 py-0.5 text-neutral-700"
                  initial={{ opacity: 0, y: -6, backgroundColor: '#dbeafe' }}
                  animate={{ opacity: 1, y: 0, backgroundColor: '#ffffff00' }}
                  exit={{ opacity: 0 }}
                  transition={{
                    delay: step === 0 ? 0.8 : 0,
                    backgroundColor: { delay: 1.4, duration: 0.6 },
                  }}
                >
                  <User className="h-3 w-3 shrink-0 text-neutral-400" />
                  {name}
                </motion.li>
              ))}
              {step === 2 && (
                <motion.li
                  key="business"
                  className="flex items-center gap-1.5 rounded bg-blue-50 px-1.5 py-0.5 font-medium text-blue-700"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 1.5 }}
                >
                  <Building2 className="h-3 w-3 shrink-0" />
                  Business
                </motion.li>
              )}
            </AnimatePresence>
          </ul>
        </div>
      </div>
    </AnimationFrame>
  )
}
