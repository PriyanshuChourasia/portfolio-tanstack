import { useCallback, useRef, useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { useResumeBuilder } from '../hooks/useResumeBuilder'
import { resumeTemplates } from '../templates/registry'
import { extractTextFromPdf } from '../utils/pdf-parse'
import { parseResumeText } from '../utils/parse-resume-text'
import { exportAsWord } from '../utils/export-word'
import { generatePdf } from '../utils/generate-pdf'
import { CertificationsForm } from './sections/CertificationsForm'
import { EducationForm } from './sections/EducationForm'
import { ExperienceForm } from './sections/ExperienceForm'
import { LanguagesForm } from './sections/LanguagesForm'
import { PersonalInfoForm } from './sections/PersonalInfoForm'
import { ProjectsForm } from './sections/ProjectsForm'
import { SkillsForm } from './sections/SkillsForm'
import { SummaryForm } from './sections/SummaryForm'
import { ColorPalette } from './ColorPalette'
import { BulletStyle } from './BulletStyle'
import { FontSizeStyle } from './FontSizeStyle'
import { ResumePagination } from './ResumePagination'
import { ResumePreview } from './ResumePreview'
import { TemplatePicker } from './TemplatePicker'

export function BuilderLayout() {
  const [templateId, setTemplateId] = useState(resumeTemplates[0].id)
  const [importing, setImporting] = useState(false)
  const [exporting, setExporting] = useState<'pdf' | 'word' | null>(null)
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium')
  const [bulletStyle, setBulletStyle] = useState<'disc' | 'circle' | 'square' | 'dash' | 'check' | 'arrow' | 'decimal'>('disc')
  const [themeOpen, setThemeOpen] = useState(true)
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false)
  const builder = useResumeBuilder()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  const templateName =
    resumeTemplates.find((t) => t.id === templateId)?.name ?? 'Resume'

  const handleExportPdf = useCallback(async () => {
    const el = previewRef.current
    if (!el) return
    setExporting('pdf')
    // Yield to React so the loading state renders before print dialog blocks
    await new Promise((r) => setTimeout(r, 50))
    try {
      await generatePdf(el, `${templateName}.pdf`, orientation)
    } catch (err) {
      console.error('PDF export failed:', err)
      alert('Failed to generate PDF. Trying browser print instead.')
      window.print()
    } finally {
      setExporting(null)
    }
  }, [templateName, orientation])

  const handleExportWord = useCallback(async () => {
    const el = previewRef.current
    if (!el) return
    setExporting('word')
    await new Promise((r) => setTimeout(r, 50))
    try {
      const clone = el.cloneNode(true) as HTMLElement
      exportAsWord(clone.innerHTML, `${templateName}.doc`, orientation)
    } finally {
      setExporting(null)
    }
  }, [templateName, orientation])

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const hasData =
      builder.data.personalInfo.fullName ||
      builder.data.summary ||
      builder.data.experience.length > 0 ||
      builder.data.education.length > 0 ||
      builder.data.skills.length > 0 ||
      builder.data.projects.length > 0 ||
      builder.data.certifications.length > 0 ||
      builder.data.languages.length > 0

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
    try {
      const rawText = await extractTextFromPdf(file)
      const parsed = parseResumeText(rawText)

      if (parsed.personalInfo) builder.updatePersonalInfo(parsed.personalInfo)
      if (parsed.summary) builder.updateSummary(parsed.summary)
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
      if (parsed.experience?.length) summaryParts.push(`Experience: ${parsed.experience.length} entr${parsed.experience.length > 1 ? 'ies' : 'y'}`)
      if (parsed.education?.length) summaryParts.push(`Education: ${parsed.education.length} entr${parsed.education.length > 1 ? 'ies' : 'y'}`)
      if (parsed.skills?.length) summaryParts.push(`Skills: ${parsed.skills.length} categor${parsed.skills.length > 1 ? 'ies' : 'y'}`)
      if (parsed.projects?.length) summaryParts.push(`Projects: ${parsed.projects.length} entr${parsed.projects.length > 1 ? 'ies' : 'y'}`)
      if (parsed.certifications?.length) summaryParts.push(`Certifications: ${parsed.certifications.length}`)
      if (parsed.languages?.length) summaryParts.push(`Languages: ${parsed.languages.length}`)

      if (summaryParts.length > 0) {
        alert(`✅ Import complete\n\n${summaryParts.join('\n')}`)
      }
    } catch (err) {
      console.error('Failed to parse PDF:', err)
      alert('Could not parse this PDF. Try copying the text and pasting it manually.')
    } finally {
      setImporting(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const allBulletOptions = [
    { id: 'disc' as const, label: '•' },
    { id: 'circle' as const, label: '○' },
    { id: 'square' as const, label: '■' },
    { id: 'dash' as const, label: '-' },
    { id: 'check' as const, label: '✓' },
    { id: 'arrow' as const, label: '→' },
    { id: 'decimal' as const, label: '1.' },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-muted/30 print:bg-white">
      {/* ── Floating top bar ── */}
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-xl print:hidden">
        <div className="flex items-center justify-between gap-1 px-3 py-2 sm:px-4 sm:py-2.5">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <svg className="size-4 shrink-0 text-primary sm:size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="15" x2="8" y2="15" />
                <line x1="16" y1="18" x2="8" y2="18" />
                <line x1="10" y1="12" x2="8" y2="12" />
              </svg>
              <h1 className="hidden text-sm font-bold tracking-tight sm:inline sm:text-base">Resume Builder</h1>
            </div>
            <div>
              <TemplatePicker selectedId={templateId} onSelect={setTemplateId} />
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
            <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handlePdfUpload} />
            <Button type="button" variant="ghost" size="sm" disabled={importing} onClick={() => fileInputRef.current?.click()} className="hidden text-xs sm:inline-flex">
              {importing ? 'Parsing…' : 'Import'}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={builder.resetData} className="hidden text-xs sm:inline-flex">
              Reset
            </Button>
            <Button type="button" size="sm" disabled={exporting !== null} onClick={handleExportPdf} className="text-xs">
              {exporting === 'pdf' ? (
                <><span className="mr-1 inline-block size-3 animate-spin rounded-full border-2 border-current border-t-transparent" />PDF</>
              ) : 'Save PDF'}
            </Button>
          </div>
        </div>
      </header>

      {/* ── Main content: form + preview ── */}
      <div className="flex flex-1 flex-col md:flex-row print:block">
        {/* Left Column — Form Editor */}
        <div className="flex w-full flex-col md:w-[420px] md:border-r print:hidden md:max-h-[calc(100vh-57px)]">
          {/* Theme Palette — collapsible */}
          <div className="border-b bg-background/60 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => setThemeOpen(!themeOpen)}
              className="flex w-full items-center justify-between px-4 py-2.5 text-left transition-colors hover:bg-muted/20 sm:px-5 sm:py-3"
            >
              <span className="flex items-center gap-2 sm:gap-2.5">
                <span className="flex size-6 items-center justify-center rounded-lg bg-primary/10 sm:size-7">
                  <svg className="size-3 text-primary sm:size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" />
                    <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" />
                    <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" />
                    <circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" />
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.504 5.555-5.555C17.965 6.012 15.461 2 12 2z" />
                  </svg>
                </span>
                <span className="text-sm font-semibold">Theme</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary sm:px-2">
                  <span className="inline-block size-2 rounded-full" style={{ backgroundColor: builder.data.theme.primary }} />
                  <span className="inline-block size-2 rounded-full" style={{ backgroundColor: builder.data.theme.accent }} />
                </span>
              </span>
              <svg
                className={`size-3.5 text-muted-foreground transition-transform duration-200 sm:size-4 ${themeOpen ? 'rotate-180' : ''}`}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${themeOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="border-t px-4 pb-3 pt-2 sm:px-5 sm:pb-4 sm:pt-3">
                <ColorPalette theme={builder.data.theme} onChange={builder.setFullTheme} />
              </div>
            </div>
          </div>

          {/* Form sections — scrollable accordion */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <div className="space-y-0.5 p-3 pb-28 sm:p-4 sm:pb-4">
              <div className="mb-2 flex items-center gap-2 px-1 sm:mb-3">
                <h2 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70 sm:text-[11px]">
                  Your Details
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-muted-foreground/20 to-transparent" />
              </div>

              <Accordion
                type="multiple"
                defaultValue={['personal', 'summary', 'experience']}
                className="space-y-1"
              >
                {/* Personal Info */}
                <AccordionItem value="personal" className="overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md">
                  <AccordionTrigger className="group px-3 py-2.5 hover:no-underline sm:px-4 sm:py-3 [&[data-state=open]>svg]:rotate-180">
                    <span className="flex items-center gap-2 sm:gap-2.5">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary sm:size-6">
                        <svg className="size-3 sm:size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </span>
                      <span className="text-sm font-medium">Personal Info</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="border-t px-3 pb-3 pt-2 sm:px-4 sm:pb-4 sm:pt-3">
                    <PersonalInfoForm value={builder.data.personalInfo} onChange={builder.updatePersonalInfo} />
                  </AccordionContent>
                </AccordionItem>

                {/* Summary */}
                <AccordionItem value="summary" className="overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md">
                  <AccordionTrigger className="group px-3 py-2.5 hover:no-underline sm:px-4 sm:py-3 [&[data-state=open]>svg]:rotate-180">
                    <span className="flex items-center gap-2 sm:gap-2.5">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary sm:size-6">
                        <svg className="size-3 sm:size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                      </span>
                      <span className="text-sm font-medium">Summary</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="border-t px-3 pb-3 pt-2 sm:px-4 sm:pb-4 sm:pt-3">
                    <SummaryForm value={builder.data.summary} onChange={builder.updateSummary} />
                  </AccordionContent>
                </AccordionItem>

                {/* Experience */}
                <AccordionItem value="experience" className="overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md">
                  <AccordionTrigger className="group px-3 py-2.5 hover:no-underline sm:px-4 sm:py-3 [&[data-state=open]>svg]:rotate-180">
                    <span className="flex items-center gap-2 sm:gap-2.5">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary sm:size-6">
                        <svg className="size-3 sm:size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                        </svg>
                      </span>
                      <span className="text-sm font-medium">Experience</span>
                      {builder.data.experience.length > 0 && (
                        <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary sm:px-2">
                          {builder.data.experience.length}
                        </span>
                      )}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="border-t px-3 pb-3 pt-2 sm:px-4 sm:pb-4 sm:pt-3">
                    <ExperienceForm {...builder.experience} />
                  </AccordionContent>
                </AccordionItem>

                {/* Education */}
                <AccordionItem value="education" className="overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md">
                  <AccordionTrigger className="group px-3 py-2.5 hover:no-underline sm:px-4 sm:py-3 [&[data-state=open]>svg]:rotate-180">
                    <span className="flex items-center gap-2 sm:gap-2.5">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary sm:size-6">
                        <svg className="size-3 sm:size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                          <path d="M6 12v5c3 3 9 3 12 0v-5" />
                        </svg>
                      </span>
                      <span className="text-sm font-medium">Education</span>
                      {builder.data.education.length > 0 && (
                        <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary sm:px-2">
                          {builder.data.education.length}
                        </span>
                      )}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="border-t px-3 pb-3 pt-2 sm:px-4 sm:pb-4 sm:pt-3">
                    <EducationForm {...builder.education} />
                  </AccordionContent>
                </AccordionItem>

                {/* Skills */}
                <AccordionItem value="skills" className="overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md">
                  <AccordionTrigger className="group px-3 py-2.5 hover:no-underline sm:px-4 sm:py-3 [&[data-state=open]>svg]:rotate-180">
                    <span className="flex items-center gap-2 sm:gap-2.5">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary sm:size-6">
                        <svg className="size-3 sm:size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                      </span>
                      <span className="text-sm font-medium">Skills</span>
                      {builder.data.skills.length > 0 && (
                        <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary sm:px-2">
                          {builder.data.skills.length}
                        </span>
                      )}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="border-t px-3 pb-3 pt-2 sm:px-4 sm:pb-4 sm:pt-3">
                    <SkillsForm {...builder.skills} />
                  </AccordionContent>
                </AccordionItem>

                {/* Projects */}
                <AccordionItem value="projects" className="overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md">
                  <AccordionTrigger className="group px-3 py-2.5 hover:no-underline sm:px-4 sm:py-3 [&[data-state=open]>svg]:rotate-180">
                    <span className="flex items-center gap-2 sm:gap-2.5">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary sm:size-6">
                        <svg className="size-3 sm:size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="7" height="7" />
                          <rect x="14" y="3" width="7" height="7" />
                          <rect x="14" y="14" width="7" height="7" />
                          <rect x="3" y="14" width="7" height="7" />
                        </svg>
                      </span>
                      <span className="text-sm font-medium">Projects</span>
                      {builder.data.projects.length > 0 && (
                        <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary sm:px-2">
                          {builder.data.projects.length}
                        </span>
                      )}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="border-t px-3 pb-3 pt-2 sm:px-4 sm:pb-4 sm:pt-3">
                    <ProjectsForm {...builder.projects} />
                  </AccordionContent>
                </AccordionItem>

                {/* Certifications */}
                <AccordionItem value="certifications" className="overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md">
                  <AccordionTrigger className="group px-3 py-2.5 hover:no-underline sm:px-4 sm:py-3 [&[data-state=open]>svg]:rotate-180">
                    <span className="flex items-center gap-2 sm:gap-2.5">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary sm:size-6">
                        <svg className="size-3 sm:size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="8" r="7" />
                          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                        </svg>
                      </span>
                      <span className="text-sm font-medium">Certifications</span>
                      {builder.data.certifications.length > 0 && (
                        <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary sm:px-2">
                          {builder.data.certifications.length}
                        </span>
                      )}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="border-t px-3 pb-3 pt-2 sm:px-4 sm:pb-4 sm:pt-3">
                    <CertificationsForm {...builder.certifications} />
                  </AccordionContent>
                </AccordionItem>

                {/* Languages */}
                <AccordionItem value="languages" className="overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md">
                  <AccordionTrigger className="group px-3 py-2.5 hover:no-underline sm:px-4 sm:py-3 [&[data-state=open]>svg]:rotate-180">
                    <span className="flex items-center gap-2 sm:gap-2.5">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary sm:size-6">
                        <svg className="size-3 sm:size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="2" y1="12" x2="22" y2="12" />
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                      </span>
                      <span className="text-sm font-medium">Languages</span>
                      {builder.data.languages.length > 0 && (
                        <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary sm:px-2">
                          {builder.data.languages.length}
                        </span>
                      )}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="border-t px-3 pb-3 pt-2 sm:px-4 sm:pb-4 sm:pt-3">
                    <LanguagesForm {...builder.languages} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>

        {/* Right Column — Preview */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden print:overflow-visible md:max-h-[calc(100vh-57px)]">
          <div className="flex items-center gap-2 border-b bg-background/40 px-4 py-1.5 sm:px-5 sm:py-2 print:hidden">
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
              {resumeTemplates.find((t) => t.id === templateId)?.name}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto bg-gradient-to-b from-muted/30 to-muted/50 p-3 pb-28 sm:p-4 sm:pb-32 md:p-6 md:pb-28 print:overflow-visible print:bg-transparent">
            <div className="flex flex-col items-center gap-4 print:block">
              <div
                ref={previewRef}
                className={`w-full shadow-xl ring-1 ring-black/5 print:static print:shadow-none fs-preview ${
                  orientation === 'landscape' ? 'max-w-[1100px]' : 'max-w-[850px]'
                }`}
                style={{ overflowX: 'auto' }}
              >
                <FontSizeStyle size={fontSize} />
                <BulletStyle type={bulletStyle} />
                <div style={{ minWidth: 320 }}>
                  <ResumePagination>
                    <ResumePreview templateId={templateId} data={builder.data} />
                  </ResumePagination>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Desktop floating bottom toolbar ── */}
      <div className="fixed bottom-4 left-1/2 z-40 hidden -translate-x-1/2 items-center gap-1 rounded-xl border bg-background/80 px-2.5 py-2 shadow-2xl backdrop-blur-xl md:flex print:hidden">
        {/* Orientation */}
        <div className="flex items-center gap-0.5 border-r pr-1.5">
          <button
            type="button"
            onClick={() => setOrientation('portrait')}
            className={`rounded-md p-1.5 transition-all ${
              orientation === 'portrait'
                ? 'bg-background text-foreground shadow-sm ring-1 ring-primary/20'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Portrait"
          >
            <svg className="size-3.5" viewBox="0 0 12 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="1" y="1" width="10" height="14" rx="1" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setOrientation('landscape')}
            className={`rounded-md p-1.5 transition-all ${
              orientation === 'landscape'
                ? 'bg-background text-foreground shadow-sm ring-1 ring-primary/20'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Landscape"
          >
            <svg className="size-3.5" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="1" y="1" width="14" height="10" rx="1" />
            </svg>
          </button>
        </div>

        {/* Font Size */}
        <div className="flex items-center gap-0.5 border-r pr-1.5">
          {(['small', 'medium', 'large'] as const).map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setFontSize(size)}
              className={`rounded-md px-1.5 py-1 text-[10px] font-medium transition-all ${
                fontSize === size
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title={`${size.charAt(0).toUpperCase() + size.slice(1)} text`}
            >
              {size === 'small' ? 'S' : size === 'large' ? 'L' : 'M'}
            </button>
          ))}
        </div>

        {/* Bullet Style */}
        <div className="flex items-center gap-0.5 border-r pr-1.5">
          {allBulletOptions.slice(0, 5).map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setBulletStyle(b.id)}
              className={`rounded-md px-1.5 py-1 text-[10px] leading-none transition-all ${
                bulletStyle === b.id
                  ? 'bg-background text-foreground shadow-sm ring-1 ring-primary/20'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title={`${b.id.charAt(0).toUpperCase() + b.id.slice(1)} bullets`}
            >
              {b.label}
            </button>
          ))}
        </div>

        {/* Export */}
        <button
          type="button"
          onClick={handleExportPdf}
          disabled={exporting !== null}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:opacity-50"
        >
          {exporting === 'pdf' ? (
            <><span className="inline-block size-3 animate-spin rounded-full border-2 border-current border-t-transparent" /> PDF</>
          ) : (
            <><svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
            PDF</>
          )}
        </button>
        <button
          type="button"
          onClick={handleExportWord}
          disabled={exporting !== null}
          className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm transition-all hover:bg-muted disabled:opacity-50"
        >
          {exporting === 'word' ? (
            <><span className="inline-block size-3 animate-spin rounded-full border-2 border-current border-t-transparent" /> Word</>
          ) : (
            <><svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
            Word</>
          )}
        </button>
      </div>

      {/* ── Mobile bottom bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur-lg md:hidden print:hidden">
        {/* Main controls row (scrollable horizontally) */}
        <div className="flex items-center gap-2 overflow-x-auto px-3 py-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Orientation */}
          <div className="flex shrink-0 items-center gap-0.5 rounded-lg bg-muted/60 p-0.5">
            <button
              type="button"
              onClick={() => setOrientation('portrait')}
              className={`rounded-md p-2 transition-all ${
                orientation === 'portrait'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground'
              }`}
              title="Portrait"
            >
              <svg className="size-4" viewBox="0 0 12 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="1" y="1" width="10" height="14" rx="1" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setOrientation('landscape')}
              className={`rounded-md p-2 transition-all ${
                orientation === 'landscape'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground'
              }`}
              title="Landscape"
            >
              <svg className="size-4" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="1" y="1" width="14" height="10" rx="1" />
              </svg>
            </button>
          </div>

          {/* Font Size */}
          <div className="flex shrink-0 items-center gap-0.5 rounded-lg bg-muted/60 p-0.5">              {(['small', 'medium', 'large'] as const).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setFontSize(size)}
                className={`rounded-md px-2.5 py-2 text-xs font-medium transition-all ${
                  fontSize === size
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground'
                }`}
              >
                {size === 'small' ? 'S' : size === 'large' ? 'L' : 'M'}
              </button>
            ))}
          </div>

          {/* Separator */}
          <div className="h-6 w-px shrink-0 bg-border/60" />

          {/* Export buttons */}
          <button
            type="button"
            onClick={handleExportPdf}
            disabled={exporting !== null}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-sm disabled:opacity-50"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {exporting === 'pdf' ? '...' : 'PDF'}
          </button>

          <button
            type="button"
            onClick={handleExportWord}
            disabled={exporting !== null}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold text-foreground disabled:opacity-50"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            Word
          </button>

          {/* Separator */}
          <div className="h-6 w-px shrink-0 bg-border/60" />

          {/* More button — opens bullet / import / reset panel */}
          <button
            type="button"
            onClick={() => setMobileMoreOpen(!mobileMoreOpen)}
            className={`inline-flex shrink-0 items-center gap-1 rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
              mobileMoreOpen ? 'bg-muted border-primary/30' : 'text-muted-foreground'
            }`}
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
              <circle cx="5" cy="12" r="1" />
            </svg>
            More
          </button>
        </div>

        {/* Expandable "More" panel */}
        {mobileMoreOpen && (
          <div className="border-t bg-muted/30 px-3 py-2">
            <div className="flex flex-wrap items-center gap-2">
              {/* Bullet styles */}
              <div className="flex items-center gap-0.5 rounded-lg bg-background p-0.5">
                {allBulletOptions.map((b) => (
                  <button
                    key={b.id}
                  type="button"
                  onClick={() => setBulletStyle(b.id)}
                  className={`rounded-md px-2 py-2 text-xs leading-none transition-all ${
                    bulletStyle === b.id
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-muted-foreground'
                  }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handlePdfUpload} />
                <button
                  type="button"
                  disabled={importing}
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium text-muted-foreground"
                >
                  <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  {importing ? 'Parsing...' : 'Import'}
                </button>
                <button
                  type="button"
                  onClick={builder.resetData}
                  className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium text-muted-foreground"
                >
                  <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 4 23 10 17 10" />
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                  </svg>
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
