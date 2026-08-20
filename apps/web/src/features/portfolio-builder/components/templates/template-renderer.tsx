import { MinimalTemplate } from './minimal-template'
import { ModernTemplate } from './modern-template'
import { CreativeTemplate } from './creative-template'
import { ProfessionalTemplate } from './professional-template'
import type { Portfolio } from '../../types/portfolio'

interface TemplateRendererProps {
  portfolio: Portfolio
}

export function TemplateRenderer({ portfolio }: TemplateRendererProps) {
  const { template, colors, typography, layout } = portfolio.settings

  const style = {
    '--portfolio-primary': colors.primary,
    '--portfolio-secondary': colors.secondary,
    '--portfolio-bg': colors.background,
    '--portfolio-text': colors.text,
    '--portfolio-muted': colors.mutedText,
    '--portfolio-accent': colors.accent,
    '--portfolio-font': typography.fontFamily,
    '--portfolio-heading-size': typography.headingSize,
    '--portfolio-body-size': typography.bodySize,
    '--portfolio-heading-weight': typography.headingWeight,
    '--portfolio-line-height': typography.lineHeight,
    '--portfolio-width':
      layout.contentWidth === 'narrow'
        ? '640px'
        : layout.contentWidth === 'medium'
          ? '800px'
          : layout.contentWidth === 'wide'
            ? '1024px'
            : '100%',
    '--portfolio-spacing':
      layout.sectionSpacing === 'compact'
        ? '2rem'
        : layout.sectionSpacing === 'normal'
          ? '4rem'
          : '6rem',
    '--portfolio-radius':
      layout.borderRadius === 'none'
        ? '0'
        : layout.borderRadius === 'small'
          ? '4px'
          : layout.borderRadius === 'medium'
            ? '8px'
            : layout.borderRadius === 'large'
              ? '16px'
              : '9999px',
  } as React.CSSProperties

  const props = { portfolio, style }

  switch (template) {
    case 'minimal':
      return <MinimalTemplate {...props} />
    case 'creative':
      return <CreativeTemplate {...props} />
    case 'professional':
      return <ProfessionalTemplate {...props} />
    case 'modern':
    default:
      return <ModernTemplate {...props} />
  }
}
