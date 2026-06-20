import { ProjectsPage } from '@/features/works/components/projects-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/projects/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ProjectsPage />
}
