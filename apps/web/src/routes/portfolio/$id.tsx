import { createFileRoute } from '@tanstack/react-router'
import { BuilderLayout, BuilderProvider } from '@/features/portfolio-builder'

export const Route = createFileRoute('/portfolio/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()

  return (
    <BuilderProvider>
      <BuilderLayout portfolioId={id} />
    </BuilderProvider>
  )
}
