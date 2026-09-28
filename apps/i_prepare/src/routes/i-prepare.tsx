import { createFileRoute } from '@tanstack/react-router'
import { IPreparePage } from '@/features/i-prepare'

export const Route = createFileRoute('/i-prepare')({
  component: IPreparePage,
  head: () => ({
    meta: [
      { title: 'iPrepare — Exam Mock Test Preparation' },
      {
        name: 'description',
        content:
          'Take exam-style mock tests for competitive exams with timed practice, auto-saved answers, and detailed analysis.',
      },
    ],
  }),
})
