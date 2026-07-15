import { createFileRoute } from '@tanstack/react-router'
import { PortfolioLayout } from '@/features/portfolio'

export const Route = createFileRoute('/portfolio')({
  component: PortfolioPage,
  head: () => ({
    meta: [
      { title: 'Portfolio Builder — Create Your Personal Portfolio' },
      {
        name: 'description',
        content:
          'Build a stunning personal portfolio website with our drag-and-drop builder. Customize sections, colors, and content — no coding required.',
      },
    ],
  }),
})

function PortfolioPage() {
  return <PortfolioLayout />
}
