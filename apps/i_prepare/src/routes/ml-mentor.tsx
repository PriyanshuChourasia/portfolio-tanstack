import { createFileRoute } from '@tanstack/react-router'
import { MLMentorPage } from '@/features/ml-mentor/MLMentorPage'

export const Route = createFileRoute('/ml-mentor')({
  component: MLMentorPage,
  head: () => ({
    meta: [
      { title: 'iPrepare — ML Interview Preparation' },
      {
        name: 'description',
        content:
          'Structured ML interview mentor: 17 modules, baseline placement, daily sessions, module tests, mock interviews and weak-area tracking with persistent progress.',
      },
    ],
  }),
})
