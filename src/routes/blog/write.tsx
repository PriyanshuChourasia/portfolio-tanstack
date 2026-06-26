import { createFileRoute } from '@tanstack/react-router'
import { BlogWritePage } from '@/features/blog/components/write-blog'

export const Route = createFileRoute('/blog/write')({
  component: RouteComponent,
})

function RouteComponent() {
  return <BlogWritePage />
}
