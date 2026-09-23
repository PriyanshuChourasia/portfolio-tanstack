import { createFileRoute } from '@tanstack/react-router'
import { ReasoningMockPage } from '@/features/reasoning-mock'

export const Route = createFileRoute('/reasoning-mock')({
  component: ReasoningMockPage,
  head: () => ({
    meta: [
      { title: 'Reasoning Mock Test — SSC CHSL, SBI PO & IBPS PO' },
      {
        name: 'description',
        content:
          'Take exam-style reasoning mock tests for SSC CHSL, SBI PO and IBPS PO with one question at a time, a persistent timer, auto-saved answers and a detailed topic, difficulty and time analysis after submission.',
      },
    ],
  }),
})
