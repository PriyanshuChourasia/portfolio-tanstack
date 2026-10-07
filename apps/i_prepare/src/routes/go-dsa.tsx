import { createFileRoute } from '@tanstack/react-router'
import { GoDsaPage } from '@/features/go-dsa/GoDsaPage'

export const Route = createFileRoute('/go-dsa')({
  component: GoDsaPage,
  head: () => ({
    meta: [
      { title: 'iPrepare — Go + DSA Mentor' },
      {
        name: 'description',
        content:
          'Golang and Data Structures & Algorithms practice mentor: progressive lessons, one-question-at-a-time practice, output prediction, debugging, revision rounds, interview, exam and production modes.',
      },
    ],
  }),
})
