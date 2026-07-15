import type { ComponentType } from 'react'
import type { PortfolioData } from '../types'

export interface PortfolioTemplateProps {
  data: PortfolioData
}

export interface PortfolioTemplateDefinition {
  id: string
  name: string
  description: string
  component: ComponentType<PortfolioTemplateProps>
}
