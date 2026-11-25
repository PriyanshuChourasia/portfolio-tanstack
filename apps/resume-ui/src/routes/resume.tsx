import { createFileRoute } from '@tanstack/react-router'
import { BuilderLayout } from '@/features/resume-builder/components/BuilderLayout'

export const Route = createFileRoute('/resume')({
  validateSearch: (search: Record<string, unknown>): { template?: string } => ({
    template: typeof search.template === 'string' ? search.template : undefined,
  }),
  component: BuilderLayout,
})
