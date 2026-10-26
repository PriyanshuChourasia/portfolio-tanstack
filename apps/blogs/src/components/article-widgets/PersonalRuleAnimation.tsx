import { User } from 'lucide-react'
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
    title: 'Give & receive',
    caption: 'In every personal transaction, one person gives and another receives.',
    duration: 3500,
  },
  {
    title: 'Debit the receiver',
    caption: 'Debit the receiver: it is recorded on the debit (left) side.',
    duration: 3500,
  },
  {
    title: 'Credit the giver',
    caption: 'Credit the giver: it is recorded on the credit (right) side.',
    duration: 4000,
  },
]

export function PersonalRuleAnimation() {
  const player = useStepPlayer(STEPS)
  const { step } = player

  return (
    <AnimationFrame player={player} steps={STEPS}>
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 sm:gap-4">
        <ActorCard
          icon={<User className="h-7 w-7" />}
          label="Credit"
          name="Giver"
        />
        <TransactionTrack runKey={`give-${step}`} delay={0.3} />
        <ActorCard
          icon={<User className="h-7 w-7" />}
          label="Debit"
          name="Receiver"
          accent
        />
      </div>
      <div className="mt-6">
        <TAccount
          title="Personal A/C"
          highlight={step === 1 ? 'debit' : step === 2 ? 'credit' : undefined}
          debit={
            step >= 1 && (
              <TEntry key="receiver" side="debit" delay={0.4}>
                Receiver
              </TEntry>
            )
          }
          credit={
            step >= 2 && (
              <TEntry key="giver" side="credit" delay={0.4}>
                Giver
              </TEntry>
            )
          }
        />
      </div>
    </AnimationFrame>
  )
}
