import { resumeTemplates } from '../templates/registry'
import type { ResumeData } from '../types'

interface ResumePreviewProps {
  templateId: string
  data: ResumeData
}

export function ResumePreview({ templateId, data }: ResumePreviewProps) {
  const template =
    resumeTemplates.find((t) => t.id === templateId) ?? resumeTemplates[0]
  const Template = template.component

  return <Template data={data} theme={data.theme} />
}
