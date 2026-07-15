import { LendexTemplate } from './LendexTemplate'
import { MikonTemplate } from './MikonTemplate'
import { FolioTemplate } from './FolioTemplate'
import type { PortfolioTemplateDefinition } from './types'

export const portfolioTemplates: Array<PortfolioTemplateDefinition> = [
  {
    id: 'lendex',
    name: 'Lendex',
    description:
      'Dark-themed creative portfolio with animated sections, progress bars, stats counters, and testimonial carousel.',
    component: LendexTemplate,
  },
  {
    id: 'mikon',
    name: 'Mikon',
    description:
      'Clean, minimalist single-page portfolio with scroll-spy navigation, card-based services, and a professional light design.',
    component: MikonTemplate,
  },
  {
    id: 'folio',
    name: 'Folio',
    description:
      'Dark minimalist portfolio with vibrant orange accents, split hero layout, card-based services grid, and smooth hover animations.',
    component: FolioTemplate,
  },
]
