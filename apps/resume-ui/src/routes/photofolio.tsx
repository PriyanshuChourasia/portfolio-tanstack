import { createFileRoute } from '@tanstack/react-router'
import { PhotofolioPage } from '@/features/photofolio'

export const Route = createFileRoute('/photofolio')({
  component: PhotofolioPage,
  head: () => ({
    meta: [
      { title: 'Photofolio — Create Your Personal Photo Gallery' },
      {
        name: 'description',
        content: 'Build a stunning personal photo gallery with customizable grids, category filters, and a drag-and-drop canvas editor.',
      },
    ],
  }),
})
