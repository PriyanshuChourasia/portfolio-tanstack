import { createFileRoute } from '@tanstack/react-router'
import { ReasoningMockPage } from '@/features/reasoning-mock'

export const Route = createFileRoute('/reasoning-mock')({
  component: ReasoningMockPage,
  head: () => ({
    meta: [
      { title: 'Reasoning & English Mock Test — SSC CHSL, SBI PO, IBPS PO, SBI English & Analogy Practice' },
      {
        name: 'description',
        content:
          'Take exam-style reasoning mock tests for SSC CHSL, SBI PO and IBPS PO, an SBI PO / Clerk English Language paper, plus a 100-question level-by-level Analogy practice paper, with one question at a time, a persistent timer, auto-saved answers and a detailed topic, difficulty and time analysis after submission.',
      },
    ],
  }),
})
