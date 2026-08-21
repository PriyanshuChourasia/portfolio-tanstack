import { createFileRoute } from '@tanstack/react-router'
import { PhotofolioPage } from '@/features/photofolio'

export const Route = createFileRoute('/photofolio')({
  component: PhotofolioPage,
  head: () => ({
    meta: [
      { title: 'Photofolio — Create Your Visual Portfolio' },
      {
        name: 'description',
        content: 'Build a stunning visual portfolio to showcase your work with customizable layouts and photo management.',
      },
    ],
  }),
})
