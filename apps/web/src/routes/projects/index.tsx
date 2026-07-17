import { ProjectsPage } from '@/features/works/components/projects-page'
import { createFileRoute } from '@tanstack/react-router'

const TITLE = 'Projects | Priyanshu Chourasia'
const DESCRIPTION =
  'Browse projects built by Priyanshu Chourasia across web development, full stack, and frontend engineering.'
const URL = 'https://codymitra.com/projects'

export const Route = createFileRoute('/projects/')({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: 'description', content: DESCRIPTION },
      { property: 'og:title', content: TITLE },
      { property: 'og:description', content: DESCRIPTION },
      { property: 'og:url', content: URL },
    ],
    links: [{ rel: 'canonical', href: URL }],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return <ProjectsPage />
}
