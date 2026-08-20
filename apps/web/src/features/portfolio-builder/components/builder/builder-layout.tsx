import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useBuilder } from '../../store/portfolio-store'
import { FullPreview } from '../shared/full-preview'
import { Dashboard } from '../dashboard/dashboard'
import { BuilderHeader } from './builder-header'
import { BuilderSidebar } from './builder-sidebar'
import { BuilderEditor } from './builder-editor'
import { BuilderPreview } from './builder-preview'

interface BuilderLayoutProps {
  portfolioId?: string
}

export function BuilderLayout({ portfolioId }: BuilderLayoutProps) {
  const { view, portfolios, setActivePortfolio, previewOpen } = useBuilder()

  const navigate = useNavigate()

  useEffect(() => {
    if (portfolioId) {
      const exists = portfolios.find((p) => p.id === portfolioId)
      if (exists) {
        setActivePortfolio(portfolioId)
      } else {
        navigate({ to: '/builder' })
      }
    }
  }, [portfolioId, portfolios, setActivePortfolio, navigate])

  if (previewOpen) {
    return <FullPreview />
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <BuilderHeader />
      {view === 'dashboard' ? (
        <Dashboard />
      ) : (
        <div className="flex-1 flex min-h-0">
          <BuilderSidebar />
          <BuilderPreview />
          <BuilderEditor />
        </div>
      )}
    </div>
  )
}
