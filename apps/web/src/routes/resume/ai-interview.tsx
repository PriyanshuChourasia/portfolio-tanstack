import { createFileRoute } from '@tanstack/react-router'
import { AIInterviewPage } from '@/features/ai-interview'
import { SITE_URL, buildMeta } from '@/lib/seo'

const TITLE = 'Interview Prep | Priyanshu Chourasia'
const DESCRIPTION =
  'Practice interview questions across Frontend, Backend, DevOps, Behavioral, and System Design categories with detailed answers.'
const URL = `${SITE_URL}/resume/ai-interview`

export const Route = createFileRoute('/resume/ai-interview')({
  head: () => buildMeta({ title: TITLE, description: DESCRIPTION, url: URL }),
  component: RouteComponent,
})

function RouteComponent() {
  return <AIInterviewPage />
}
