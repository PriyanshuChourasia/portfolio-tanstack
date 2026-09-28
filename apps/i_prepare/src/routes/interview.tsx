import { createFileRoute } from '@tanstack/react-router'
import { InterviewPage } from '@/features/interview/InterviewPage'

export const Route = createFileRoute('/interview')({
  component: InterviewPage,
  head: () => ({
    meta: [
      { title: 'iPrepare — Senior Software Engineer Interview' },
      {
        name: 'description',
        content:
          'Take a comprehensive mixed technical interview covering Java, Go, OOP, DSA, System Design, and more.',
      },
    ],
  }),
})
