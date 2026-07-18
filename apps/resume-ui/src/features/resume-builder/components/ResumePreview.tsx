import { resumeTemplates } from '../templates/registry'
import type { ResumeData } from '../types'

interface ResumePreviewProps {
  templateId: string
  data: ResumeData
  onElementColorChange?: (id: string, color: string) => void
  onPhotoChange?: (dataUrl: string) => void
}

export function ResumePreview({ templateId, data, onElementColorChange, onPhotoChange }: ResumePreviewProps) {
  const template =
    resumeTemplates.find((t) => t.id === templateId) ?? resumeTemplates[0]
  const Template = template.component

  return (
    <Template
      data={data}
      theme={data.theme}
      onElementColorChange={onElementColorChange}
      onPhotoChange={onPhotoChange}
    />
  )
}
