import { PortfolioLayout } from '@/features/portfolio-main/components/portfoliolayout'
import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <PortfolioLayout/>
}
