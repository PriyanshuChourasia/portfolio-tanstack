import { createFileRoute } from '@tanstack/react-router'
import { ResumeTemplate } from '@/features/resume-builder'

export const Route = createFileRoute('/resume/template')({
  head: () => ({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] }),
  component: RouteComponent,
})

function RouteComponent() {
  return <ResumeTemplate />
}
