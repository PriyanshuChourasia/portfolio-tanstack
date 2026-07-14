import type { ComponentType } from 'react'
import type { ResumeData, ResumeTheme as RT } from '../types'

export type ResumeTheme = RT

export interface ResumeTemplateProps {
  data: ResumeData
  theme?: ResumeTheme
}

export interface ResumeTemplateDefinition {
  id: string
  name: string
  description: string
  component: ComponentType<ResumeTemplateProps>
}
