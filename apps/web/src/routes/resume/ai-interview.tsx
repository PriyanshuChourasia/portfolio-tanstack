import { createFileRoute } from '@tanstack/react-router'
import { AIInterviewPage } from '@/features/ai-interview'

const SITE_URL = 'https://codymitra.com'

export const Route = createFileRoute('/resume/ai-interview')({
  head: () => ({
    meta: [
      { title: 'Interview Prep | Cody Mitra' },
      {
        name: 'description',
        content:
          'Practice interview questions across Frontend, Backend, DevOps, Behavioral, and System Design categories with detailed answers.',
      },
      { property: 'og:title', content: 'Interview Prep | Cody Mitra' },
      {
        property: 'og:description',
        content:
          'Practice interview questions across Frontend, Backend, DevOps, Behavioral, and System Design categories.',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: `${SITE_URL}/resume/ai-interview` },
      { name: 'twitter:card', content: 'summary_large_image' },
      {
        name: 'twitter:title',
        content: 'Interview Prep | Cody Mitra',
      },
    ],
    links: [
      { rel: 'canonical', href: `${SITE_URL}/resume/ai-interview` },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return <AIInterviewPage />
}
