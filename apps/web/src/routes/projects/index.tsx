import { createFileRoute } from '@tanstack/react-router'
import { ProjectsPage } from '@/features/works/components/projects-page'
import { SITE_URL, buildMeta } from '@/lib/seo'

export const Route = createFileRoute('/projects/')({
  head: () =>
    buildMeta({
      title: 'Projects | Priyanshu Chourasia',
      description: 'Browse projects built by Priyanshu Chourasia.',
      url: `${SITE_URL}/projects`,
    }),
  component: RouteComponent,
})

function RouteComponent() {
  return <ProjectsPage />
}
