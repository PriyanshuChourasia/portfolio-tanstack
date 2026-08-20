import { createFileRoute } from '@tanstack/react-router'
import { BuilderLayout, BuilderProvider } from '@/features/portfolio-builder'

export const Route = createFileRoute('/builder')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <BuilderProvider>
      <BuilderLayout />
    </BuilderProvider>
  )
}
