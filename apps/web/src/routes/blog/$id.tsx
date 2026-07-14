import { BlogPostDetailPage } from '@/features/blog/components/blog-detail-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/blog/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  return <BlogPostDetailPage postId={parseInt(id)} />
}
