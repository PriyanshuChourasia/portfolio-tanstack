import { createFileRoute } from '@tanstack/react-router'
import { BuilderLayout, BuilderProvider } from '@/features/portfolio-builder'

export const Route = createFileRoute('/builder')({
  head: () => ({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] }),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <BuilderProvider>
      <BuilderLayout />
    </BuilderProvider>
  )
}
