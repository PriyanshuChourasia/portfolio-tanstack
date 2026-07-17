import { useCallback, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Pencil, Eye } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'
import { useResumeStore } from '../store'
import { resumeTemplates } from '../templates/registry'
import { extractTextFromPdf } from '../utils/pdf-parse'
import { extractTextFromImage } from '../utils/extract-text-from-image'
import { parseResumeText } from '../utils/parse-resume-text'
import { exportAsWord } from '../utils/export-word'
import { generatePdf } from '../utils/generate-pdf'
import { BuilderHeader } from './BuilderHeader'
import { BuilderSidebar } from './BuilderSidebar'
import { BulletStyle } from './BulletStyle'
import { FontSizeStyle } from './FontSizeStyle'
import { PaginatedPreviewPages } from './PaginatedPreviewPages'
import { ResumePagination } from './ResumePagination'
import type { PageLayout } from './ResumePagination'
import { ResumePreview } from './ResumePreview'

export function BuilderLayout() {
  const [templateId, setTemplateId] = useState(resumeTemplates[0].id)
  const [importing, setImporting] = useState(false)
  const [exporting, setExporting] = useState<'pdf' | 'word' | null>(null)
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit')
  const [pageLayout, setPageLayout] = useState<PageLayout>({ breaks: [], totalHeight: 0 })

  const settings = useResumeStore((s) => s.history.present.settings)
  const builder = useResumeStore(
    useShallow((s) => ({
      updatePersonalInfo: s.updatePersonalInfo,
      experience: s.experience,
      education: s.education,
      skills: s.skills,
      projects: s.projects,
      certifications: s.certifications,
      languages: s.languages,
      awards: s.awards,
      volunteer: s.volunteer,
      references: s.references,
      publications: s.publications,
      interests: s.interests,
      customSections: s.customSections,
    })),
  )
  const data = useResumeStore((s) => s.history.present)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  const templateName =
    resumeTemplates.find((t) => t.id === templateId)?.name ?? 'Resume'

  const handleExportPdf = useCallback(async () => {
    const el = previewRef.current
    if (!el) return
    setExporting('pdf')
    await new Promise((r) => setTimeout(r, 50))
    try {
      await generatePdf(el, `${templateName}.pdf`, settings.orientation, settings.margins)
    } catch (err) {
      console.error('PDF export failed:', err)
      alert('Failed to generate PDF. Trying browser print instead.')
      window.print()
    } finally {
      setExporting(null)
    }
  }, [templateName, settings.orientation, settings.margins])

  const handleExportWord = useCallback(async () => {
    const el = previewRef.current
    if (!el) return
    setExporting('word')
    await new Promise((r) => setTimeout(r, 50))
    try {
      const clone = el.cloneNode(true) as HTMLElement
      exportAsWord(clone.innerHTML, `${templateName}.doc`, settings.orientation)
    } finally {
      setExporting(null)
    }
  }, [templateName, settings.orientation])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const hasData =
      data.personalInfo.fullName ||
      data.summary ||
      data.experience.length > 0 ||
      data.education.length > 0 ||
      data.skills.length > 0 ||
      data.projects.length > 0

    if (hasData) {
      const action = confirm(
        'You already have data in the form.\n\n' +
          '•  Press OK to append parsed data to your existing entries.\n' +
          '•  Press Cancel to skip, then hit "Reset" first for a clean slate.',
      )
      if (!action) {
        if (fileInputRef.current) fileInputRef.current.value = ''
        return
      }
    }

    setImporting(true)
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    try {
      const rawText = isPdf ? await extractTextFromPdf(file) : await extractTextFromImage(file)

      if (!rawText) {
        alert('No text could be extracted from this file. Try a different file.')
        return
      }

      const parsed = parseResumeText(rawText)

      if (parsed.personalInfo) builder.updatePersonalInfo(parsed.personalInfo)
      parsed.experience?.forEach((exp) => builder.experience.add(exp))
      parsed.education?.forEach((edu) => builder.education.add(edu))
      parsed.skills?.forEach((skill) => builder.skills.add(skill))
      parsed.projects?.forEach((proj) => builder.projects.add(proj))
      parsed.certifications?.forEach((cert) => builder.certifications.add(cert))
      parsed.languages?.forEach((lang) => builder.languages.add(lang))

      const summaryParts: string[] = []
      if (parsed.personalInfo?.fullName) summaryParts.push(`Name: ${parsed.personalInfo.fullName}`)
      if (parsed.summary) {
        const lineCount = parsed.summary.split('\n').filter(Boolean).length
        summaryParts.push(`Summary: ${lineCount} line${lineCount > 1 ? 's' : ''}`)
      }
      if (parsed.experience?.length) summaryParts.push(`Experience: ${parsed.experience.length}`)
      if (parsed.education?.length) summaryParts.push(`Education: ${parsed.education.length}`)
      if (parsed.skills?.length) summaryParts.push(`Skills: ${parsed.skills.length}`)
      if (parsed.projects?.length) summaryParts.push(`Projects: ${parsed.projects.length}`)

      if (summaryParts.length > 0) {
        alert(`Import complete\n\n${summaryParts.join('\n')}`)
      }
    } catch (err) {
      console.error(`Failed to parse ${isPdf ? 'PDF' : 'image'}:`, err)
      alert(`Could not parse this ${isPdf ? 'PDF' : 'image'}. Try copying the text and pasting it manually.`)
    } finally {
      setImporting(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background md:h-screen md:overflow-hidden print:bg-white print:h-auto print:overflow-visible">
      <input ref={fileInputRef} type="file" accept=".pdf,.png,.jpg,.jpeg,.webp,.bmp,.tiff,.tif" className="hidden" onChange={handleFileUpload} />

      {/* Header */}
      <BuilderHeader
        templateId={templateId}
        onTemplateChange={setTemplateId}
        onExportPdf={handleExportPdf}
        onExportWord={handleExportWord}
        onImport={() => fileInputRef.current?.click()}
        exporting={exporting}
        importing={importing}
      />

      {/* Main content: form + preview */}
      <div className="flex flex-1 flex-col md:flex-row md:min-h-0 print:block">
        {/* Sidebar — mobile: only visible when edit tab is active */}
        <div className={mobileTab === 'edit' ? 'flex md:flex md:h-full md:min-h-0 md:overflow-hidden' : 'hidden md:flex md:h-full md:min-h-0 md:overflow-hidden'}>
          <BuilderSidebar templateId={templateId} />
        </div>

        {/* Preview — mobile: only visible when preview tab is active */}
        <div className={`${mobileTab === 'preview' ? 'flex' : 'hidden'} md:flex print:flex min-w-0 flex-1 flex-col overflow-hidden print:overflow-visible md:h-full md:min-h-0`}>
          {/* Preview header */}
          <div className="flex items-center gap-2 border-b bg-card/50 px-4 py-1.5 sm:px-5 sm:py-2 print:hidden">
            <svg className="size-3 shrink-0 text-muted-foreground sm:size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/70 sm:text-xs">
              Preview
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-muted-foreground/20 to-transparent" />
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary sm:px-2.5 sm:text-[11px]">
              {templateName}
            </span>
          </div>

          {/* Preview area */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="flex-1 min-h-0 overflow-y-auto p-3 pb-8 sm:p-4 sm:pb-32 md:p-6 md:pb-28 print:overflow-visible print:bg-transparent dark:bg-muted/20 bg-muted/30"
          >
            <div className="flex flex-col items-center gap-4 print:block">
              {/* Collapsed to zero height on screen when paginated (kept in
                  normal, non-absolute flow so its width — and therefore its
                  text wrapping and measured break points — exactly matches
                  the visible sliced pages below). Restored for print, where
                  it's the only thing that renders, using the browser's
                  native pagination. Also the untouched source for Word/PDF export. */}
              <div
                className={`w-full ${pageLayout.breaks.length > 0 ? 'h-0 overflow-hidden print:h-auto print:overflow-visible' : ''}`}
              >
                <div
                  ref={previewRef}
                  className={`w-full rounded-sm shadow-xl ring-1 ring-black/5 dark:ring-white/10 print:shadow-none fs-preview ${
                    settings.orientation === 'landscape' ? 'max-w-[1100px]' : 'max-w-[850px]'
                  }`}
                  style={{ overflowX: 'auto' }}
                >
                  <FontSizeStyle size={settings.fontSize} />
                  <BulletStyle type={settings.bulletStyle} />
                  <div style={{ minWidth: 'min(320px, 100%)' }}>
                    <ResumePagination onLayoutChange={setPageLayout} forcedSectionIds={data.pageBreakBefore}>
                      <ResumePreview templateId={templateId} data={data} />
                    </ResumePagination>
                  </div>
                </div>
              </div>

              {pageLayout.breaks.length > 0 && (
                <PaginatedPreviewPages
                  templateId={templateId}
                  data={data}
                  settings={settings}
                  pageBreaks={pageLayout.breaks}
                  totalHeight={pageLayout.totalHeight}
                  className={settings.orientation === 'landscape' ? 'max-w-[1100px]' : 'max-w-[850px]'}
                />
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile toggle bar — visible below md breakpoint */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-card/95 backdrop-blur-md md:hidden print:hidden">
        <div className="mx-auto flex max-w-xs gap-2 p-2">
          <button
            onClick={() => setMobileTab('edit')}
            className="relative flex flex-1 items-center justify-center gap-1.5 rounded-full py-2.5 text-sm font-medium transition-colors"
          >
            {mobileTab === 'edit' && (
              <motion.span
                layoutId="mobile-tab-indicator"
                className="absolute inset-0 rounded-full bg-primary"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <Pencil className="relative z-10 size-3.5" />
            <span className={`relative z-10 ${mobileTab === 'edit' ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
              Edit
            </span>
          </button>
          <button
            onClick={() => setMobileTab('preview')}
            className="relative flex flex-1 items-center justify-center gap-1.5 rounded-full py-2.5 text-sm font-medium transition-colors"
          >
            {mobileTab === 'preview' && (
              <motion.span
                layoutId="mobile-tab-indicator"
                className="absolute inset-0 rounded-full bg-primary"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <Eye className="relative z-10 size-3.5" />
            <span className={`relative z-10 ${mobileTab === 'preview' ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
              Preview
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
