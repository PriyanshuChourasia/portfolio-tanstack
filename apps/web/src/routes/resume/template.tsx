import { createFileRoute } from '@tanstack/react-router'
import { ResumeTemplate } from '@/features/resume-builder'

export const Route = createFileRoute('/resume/template')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ResumeTemplate />
}
