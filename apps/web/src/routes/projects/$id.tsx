import { ProjectDetailPage } from '@/features/works/components/project-detail-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/projects/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  return <ProjectDetailPage projectId={parseInt(id)} />
}