import { createFileRoute } from '@tanstack/react-router'
import { InterviewPage } from '@/features/interview'

export const Route = createFileRoute('/interview')({
  component: InterviewPage,
  head: () => ({
    meta: [
      { title: 'Interview Questions — Resume Builder' },
      {
        name: 'description',
        content:
          'Curated interview questions and answers grouped by topic to help you prepare for technical interviews.',
      },
    ],
  }),
})
