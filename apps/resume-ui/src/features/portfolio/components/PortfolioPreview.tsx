import { portfolioTemplates } from '../templates/registry'
import type { PortfolioData } from '../types'

interface PortfolioPreviewProps {
  data: PortfolioData
  templateId?: string
}

export function PortfolioPreview({ data, templateId }: PortfolioPreviewProps) {
  const template =
    portfolioTemplates.find((t) => t.id === templateId) ?? portfolioTemplates[0]
  const Template = template.component

  return <Template data={data} />
}
