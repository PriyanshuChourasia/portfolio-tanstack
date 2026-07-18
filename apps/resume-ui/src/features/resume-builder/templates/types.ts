import type { ComponentType } from 'react'
import type { ResumeData, ResumeTheme as RT } from '../types'

export type ResumeTheme = RT

export interface ResumeTemplateProps {
  data: ResumeData
  theme?: ResumeTheme
  /** Present only in the interactive builder preview — lets a template make its text clickable-to-recolor. */
  onElementColorChange?: (id: string, color: string) => void
  /** Present only in the interactive builder preview — lets a template make its photo clickable-to-upload. */
  onPhotoChange?: (dataUrl: string) => void
}

export interface ResumeTemplateDefinition {
  id: string
  name: string
  description: string
  component: ComponentType<ResumeTemplateProps>
}
