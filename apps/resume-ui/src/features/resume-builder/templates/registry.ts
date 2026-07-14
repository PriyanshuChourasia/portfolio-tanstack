import { AccentTemplate } from './AccentTemplate'
import { BoldTemplate } from './BoldTemplate'
import { ClassicTemplate } from './ClassicTemplate'
import { ElegantTemplate } from './ElegantTemplate'
import { FreshTemplate } from './FreshTemplate'
import { MinimalTemplate } from './MinimalTemplate'
import { ModernTemplate } from './ModernTemplate'
import { NavyTemplate } from './NavyTemplate'
import { PremiumTemplate } from './PremiumTemplate'
import { SidebarTemplate } from './SidebarTemplate'
import { SimpleTemplate } from './SimpleTemplate'
import { VisualTemplate } from './VisualTemplate'
import type { ResumeTemplateDefinition } from './types'

export const resumeTemplates: Array<ResumeTemplateDefinition> = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Serif, single-column ATS-friendly layout.',
    component: ClassicTemplate,
  },
  {
    id: 'modern',
    name: 'Modern',
    description:
      'Sans-serif two-column header with a clean, flowing section layout.',
    component: ModernTemplate,
  },
  {
    id: 'bold',
    name: 'Bold',
    description:
      'Blue accented headings with an optional photo and a flat skills grid.',
    component: BoldTemplate,
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description:
      'Centered serif header, banner section titles, and dotted date leaders.',
    component: ElegantTemplate,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Compact serif layout with underlined section rules.',
    component: MinimalTemplate,
  },
  {
    id: 'sidebar',
    name: 'Sidebar',
    description:
      'Two-column layout with contact, skills, and education in a right sidebar.',
    component: SidebarTemplate,
  },
  {
    id: 'accent',
    name: 'Accent',
    description:
      'Centered serif header with muted gray meta text and centered section rules.',
    component: AccentTemplate,
  },
  {
    id: 'premium',
    name: 'Premium',
    description:
      'Enhancv-inspired two-column layout with a deep teal sidebar, categorized skills, language proficiency dots, and generous whitespace.',
    component: PremiumTemplate,
  },
  {
    id: 'fresh',
    name: 'Fresh',
    description:
      'Mint-accented icon sections with a pill-styled title badge under the name.',
    component: FreshTemplate,
  },
  {
    id: 'navy',
    name: 'Navy',
    description:
      'Navy and blue two-column layout with icon contact row and pill skill tags.',
    component: NavyTemplate,
  },
  {
    id: 'simple',
    name: 'Simple',
    description:
      'Plain sans-serif single column with unadorned bold section headings.',
    component: SimpleTemplate,
  },
  {
    id: 'visual',
    name: 'Visual',
    description:
      'Photo-centric design with a prominent rounded hero image, dark primary header bar, contact strip, and pill-styled skill tags.',
    component: VisualTemplate,
  },
]
