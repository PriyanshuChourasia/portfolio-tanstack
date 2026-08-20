import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { BuilderLayout, BuilderProvider } from '@/features/portfolio-builder'
import { createNewPortfolio } from '@/features/portfolio-builder/data/defaults'

export const Route = createFileRoute('/portfolio/new')({
  component: RouteComponent,
})

function RouteComponent() {
  const [portfolioId, setPortfolioId] = useState<string | null>(null)

  useEffect(() => {
    const portfolio = createNewPortfolio()
    const portfolios = JSON.parse(
      localStorage.getItem('portfolio-builder.portfolios') ?? '[]',
    )
    portfolios.unshift(portfolio)
    localStorage.setItem(
      'portfolio-builder.portfolios',
      JSON.stringify(portfolios),
    )
    setPortfolioId(portfolio.id)
  }, [])

  if (!portfolioId) return null

  return (
    <BuilderProvider>
      <BuilderLayout portfolioId={portfolioId} />
    </BuilderProvider>
  )
}
