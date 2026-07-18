import { Calendar, Camera, Link2, Mail, MapPin, Phone, Trash2 } from 'lucide-react'
import type { ChangeEvent, ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { ColorableText } from '../components/ColorableText'
import { DEFAULT_SECTION_ORDER, type SectionId } from '../types'
import type { ResumeTemplateProps, ResumeTheme } from './types'

const ASIDE_SECTIONS: Array<SectionId> = ['skills', 'languages', 'certifications']
const MAIN_SECTIONS: Array<SectionId> = ['summary', 'experience', 'education', 'projects']

export function MechTemplate({ data, theme = data.theme, onElementColorChange, onPhotoChange }: ResumeTemplateProps) {
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages } = data
  const elementColors = data.elementColors ?? {}
  const setColor = onElementColorChange
    ? (id: string, color: string) => onElementColorChange(id, color)
    : undefined

  const flatSkills = skills
    .flatMap((s) => s.value.split(','))
    .map((v) => v.trim())
    .filter(Boolean)

  const contactItems: Array<{ icon: ReactNode; value: string; href?: string }> = []
  if (personalInfo.phone)
    contactItems.push({ icon: <Phone className="size-3.5" />, value: personalInfo.phone })
  if (personalInfo.email)
    contactItems.push({
      icon: <Mail className="size-3.5" />,
      value: personalInfo.email,
      href: `mailto:${personalInfo.email}`,
    })
  if (personalInfo.location)
    contactItems.push({ icon: <MapPin className="size-3.5" />, value: personalInfo.location })
  if (personalInfo.linkedin)
    contactItems.push({ icon: <Link2 className="size-3.5" />, value: personalInfo.linkedin })
  if (personalInfo.website)
    contactItems.push({ icon: <Link2 className="size-3.5" />, value: personalInfo.website })

  // Mech's aside is always a light neutral panel by design (matching the reference layout) —
  // it intentionally does not read theme.sidebar, since every preset in this app defines that
  // field as a *dark* panel color meant for other templates' dark sidebars.
  const sidebarBg = '#f1f5f9'
  const order = data.sectionOrder?.length ? data.sectionOrder : DEFAULT_SECTION_ORDER
  const orderedAside = order.filter((id) => ASIDE_SECTIONS.includes(id))
  const orderedMain = order.filter((id) => MAIN_SECTIONS.includes(id))

  const sectionRenderers: Partial<Record<SectionId, ReactNode>> = {
    skills: flatSkills.length > 0 && (
      <MechAsideSection id="heading:skills" title="Skills" theme={theme} elementColors={elementColors} onElementColorChange={setColor}>
        <ul className="space-y-1.5">
          {flatSkills.map((skill, i) => (
            <li key={i} className="flex items-center gap-2 text-xs" style={{ color: theme.text }}>
              <span
                className="inline-block size-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: theme.accent }}
              />
              {skill}
            </li>
          ))}
        </ul>
      </MechAsideSection>
    ),

    languages: languages.length > 0 && (
      <MechAsideSection id="heading:languages" title="Languages" theme={theme} elementColors={elementColors} onElementColorChange={setColor}>
        <ul className="space-y-1.5">
          {languages.map((lang) => (
            <li key={lang.id} className="flex items-center gap-2 text-xs" style={{ color: theme.text }}>
              <span
                className="inline-block size-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: theme.accent }}
              />
              {lang.name}
              {lang.level && <span style={{ color: theme.muted }}> · {lang.level}</span>}
            </li>
          ))}
        </ul>
      </MechAsideSection>
    ),

    certifications: certifications.length > 0 && (
      <MechAsideSection id="heading:certifications" title="Certifications" theme={theme} elementColors={elementColors} onElementColorChange={setColor}>
        <ul className="space-y-1.5">
          {certifications.map((c) => (
            <li key={c.id} className="flex items-center gap-2 text-xs" style={{ color: theme.text }}>
              <span
                className="inline-block size-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: theme.accent }}
              />
              {c.name}
            </li>
          ))}
        </ul>
      </MechAsideSection>
    ),

    summary: summary && (
      <MechMainSection id="heading:summary" title="Profile" theme={theme} elementColors={elementColors} onElementColorChange={setColor}>
        <p className="text-[12.5px] leading-relaxed" style={{ color: theme.text }}>
          {summary}
        </p>
      </MechMainSection>
    ),

    experience: experience.length > 0 && (
      <MechMainSection id="heading:experience" title="Work Experience" theme={theme} timeline elementColors={elementColors} onElementColorChange={setColor}>
        {experience.map((exp) => (
          <MechTimelineEntry key={exp.id} theme={theme}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[13.5px] font-semibold" style={{ color: theme.primary }}>
                {exp.role}
              </span>
              {(exp.startDate || exp.endDate) && (
                <span
                  className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-xs"
                  style={{ color: theme.muted }}
                >
                  <Calendar className="size-3" />
                  {[exp.startDate, exp.endDate].filter(Boolean).join(' – ')}
                </span>
              )}
            </div>
            <p className="text-xs font-medium" style={{ color: theme.accent }}>
              {[exp.company, exp.location].filter(Boolean).join(' · ')}
            </p>
            {exp.bullets && (
              <ul className="mt-1.5 list-disc space-y-1 pl-4 text-[12.5px] leading-relaxed" style={{ color: theme.text }}>
                {exp.bullets
                  .split('\n')
                  .filter(Boolean)
                  .map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
              </ul>
            )}
          </MechTimelineEntry>
        ))}
      </MechMainSection>
    ),

    education: education.length > 0 && (
      <MechMainSection id="heading:education" title="Education" theme={theme} timeline elementColors={elementColors} onElementColorChange={setColor}>
        {education.map((ed) => (
          <MechTimelineEntry key={ed.id} theme={theme}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[13.5px] font-semibold" style={{ color: theme.primary }}>
                {ed.degree}
                {ed.fieldOfStudy && <span className="font-normal"> — {ed.fieldOfStudy}</span>}
              </span>
              <span
                className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-xs"
                style={{ color: theme.muted }}
              >
                <Calendar className="size-3" />
                {ed.startDate ? [ed.startDate, ed.endDate || 'Present'].join(' – ') : ed.date}
              </span>
            </div>
            <p className="text-xs font-medium" style={{ color: theme.accent }}>
              {[ed.institution, ed.state || ed.location].filter(Boolean).join(', ')}
            </p>
          </MechTimelineEntry>
        ))}
      </MechMainSection>
    ),

    projects: projects.length > 0 && (
      <MechMainSection id="heading:projects" title="Projects" theme={theme} timeline elementColors={elementColors} onElementColorChange={setColor}>
        {projects.map((p) => (
          <MechTimelineEntry key={p.id} theme={theme}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[13.5px] font-semibold" style={{ color: theme.primary }}>
                {p.name}
              </span>
              {(p.startDate || p.endDate) && (
                <span
                  className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-xs"
                  style={{ color: theme.muted }}
                >
                  <Calendar className="size-3" />
                  {p.startDate ? [p.startDate, p.endDate || 'Present'].join(' – ') : ''}
                </span>
              )}
            </div>
            {p.domain && (
              <p className="text-xs" style={{ color: theme.muted }}>
                {p.domain}
              </p>
            )}
            {p.stack && (
              <p className="text-xs italic" style={{ color: theme.accent }}>
                {p.stack}
              </p>
            )}
            {p.bullets && (
              <ul className="mt-1.5 list-disc space-y-1 pl-4 text-[12.5px] leading-relaxed" style={{ color: theme.text }}>
                {p.bullets
                  .split('\n')
                  .filter(Boolean)
                  .map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
              </ul>
            )}
          </MechTimelineEntry>
        ))}
      </MechMainSection>
    ),
  }

  return (
    <main
      className="mx-auto max-w-[900px] bg-white font-sans shadow-sm print:shadow-none"
      style={{ backgroundColor: theme.background }}
    >
      <header
        className="relative flex items-center gap-6 px-8 pt-6 pb-6"
        style={{
          backgroundColor: theme.primary,
          printColorAdjust: 'exact',
          WebkitPrintColorAdjust: 'exact',
        }}
      >
        <div className="shrink-0" style={{ marginBottom: -24 }}>
          <PhotoUpload photoUrl={personalInfo.photoUrl} fullName={personalInfo.fullName} onPhotoChange={onPhotoChange} />
        </div>
        <div className="min-w-0">
          <ColorableText
            as="h1"
            className="text-[26px] font-bold tracking-wide uppercase"
            color={elementColors.name || '#ffffff'}
            onChange={setColor ? (c) => setColor('name', c) : undefined}
          >
            {personalInfo.fullName || 'Your Name'}
          </ColorableText>
          {personalInfo.title && (
            <ColorableText
              as="p"
              className="mt-1.5 text-xs font-semibold tracking-[0.25em] uppercase"
              color={elementColors.title || theme.accent}
              onChange={setColor ? (c) => setColor('title', c) : undefined}
            >
              {personalInfo.title}
            </ColorableText>
          )}
        </div>
      </header>

      {/*
        Deliberately float-based, not flexbox: browsers largely refuse to
        fragment a flex container's children across print page breaks (a
        long main column either gets clipped or shoved onto the next page
        as one atomic block, leaving the sidebar's page blank beside it).
        Floats are classic block layout and paginate correctly — the aside
        renders once wherever it fits, and the main column keeps flowing
        page after page beside/beneath it via the ml-[220px] offset.
      */}
      {/*
        display:flow-root (not overflow-hidden) to contain the floated aside.
        overflow-hidden was tried here first and is dangerous for print: some
        print/PDF engines CLIP overflowing content instead of paginating it
        across pages when a container has overflow:hidden, which is exactly
        what silently deleted the main column on Windows exports — it wasn't
        pushed to another page, it was clipped out of existence. flow-root
        gives the same float-containment behavior with zero clipping risk.
      */}
      <div style={{ display: 'flow-root' }}>
        <aside
          className="float-left w-[220px] space-y-5 px-5 py-6"
          style={{
            backgroundColor: sidebarBg,
            printColorAdjust: 'exact',
            WebkitPrintColorAdjust: 'exact',
          }}
        >
          {contactItems.length > 0 && (
            <MechAsideSection id="heading:contact" title="Contact" theme={theme} elementColors={elementColors} onElementColorChange={setColor}>
              <ul className="space-y-2">
                {contactItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs" style={{ color: theme.text }}>
                    <span className="mt-0.5 shrink-0" style={{ color: theme.accent }}>
                      {item.icon}
                    </span>
                    <span className="break-all">
                      {item.href ? (
                        <a href={item.href} className="underline underline-offset-2">
                          {item.value}
                        </a>
                      ) : (
                        item.value
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </MechAsideSection>
          )}

          {orderedAside.map(
            (id) => sectionRenderers[id] && <div key={id} data-section-id={id}>{sectionRenderers[id]}</div>,
          )}
        </aside>

        <div className="space-y-6 px-6 py-6 ml-[220px]">
          {orderedMain.map(
            (id) => sectionRenderers[id] && <div key={id} data-section-id={id}>{sectionRenderers[id]}</div>,
          )}
        </div>
      </div>
    </main>
  )
}

function MechAsideSection({
  id,
  title,
  children,
  theme: sectionTheme,
  elementColors,
  onElementColorChange,
}: {
  id: string
  title: string
  children: ReactNode
  theme: ResumeTheme
  elementColors: Record<string, string>
  onElementColorChange?: (id: string, color: string) => void
}) {
  const color = elementColors[id] || sectionTheme.primary
  return (
    <section>
      <div style={{ breakAfter: 'avoid', pageBreakAfter: 'avoid' }}>
        <ColorableText
          as="h2"
          className="text-xs font-bold tracking-widest uppercase"
          color={color}
          onChange={onElementColorChange ? (c) => onElementColorChange(id, c) : undefined}
        >
          {title}
        </ColorableText>
        <div className="mt-1.5 mb-3 h-[2px] w-10" style={{ backgroundColor: color }} />
      </div>
      {children}
    </section>
  )
}

function MechMainSection({
  id,
  title,
  children,
  theme: sectionTheme,
  timeline = false,
  elementColors,
  onElementColorChange,
}: {
  id: string
  title: string
  children: ReactNode
  theme: ResumeTheme
  timeline?: boolean
  elementColors: Record<string, string>
  onElementColorChange?: (id: string, color: string) => void
}) {
  const color = elementColors[id] || sectionTheme.primary
  return (
    <section>
      <div
        className="grid grid-cols-[28px_1fr] items-center gap-4"
        style={{ breakAfter: 'avoid', pageBreakAfter: 'avoid', breakInside: 'avoid' }}
      >
        <span className="mx-auto block size-7 shrink-0 rounded-full" style={{ backgroundColor: color }} />
        <div>
          <ColorableText
            as="h2"
            className="text-sm font-bold tracking-widest uppercase"
            color={color}
            onChange={onElementColorChange ? (c) => onElementColorChange(id, c) : undefined}
          >
            {title}
          </ColorableText>
          <div className="mt-1.5 h-[2px] w-14" style={{ backgroundColor: color }} />
        </div>
      </div>
      <div className="relative mt-4">
        {timeline && (
          <div
            className="absolute top-0 bottom-1 w-px"
            style={{ left: 14, backgroundColor: sectionTheme.muted + '35' }}
          />
        )}
        <div className={timeline ? 'space-y-5' : ''}>{children}</div>
      </div>
    </section>
  )
}

function MechTimelineEntry({ children, theme: entryTheme }: { children: ReactNode; theme: ResumeTheme }) {
  return (
    <div className="grid grid-cols-[28px_1fr] gap-4" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
      <div className="flex justify-center pt-1">
        <span
          className="size-2.5 shrink-0 rounded-full border-2 bg-white"
          style={{ borderColor: entryTheme.primary }}
        />
      </div>
      <div>{children}</div>
    </div>
  )
}

function PhotoUpload({
  photoUrl,
  fullName,
  onPhotoChange,
}: {
  photoUrl: string
  fullName: string
  onPhotoChange?: (dataUrl: string) => void
}) {
  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onPhotoChange?.(reader.result as string)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const avatar = photoUrl ? (
    <img
      src={photoUrl}
      alt={fullName || 'Profile photo'}
      className="size-32 rounded-full border-4 object-cover"
      style={{ borderColor: 'rgba(255,255,255,0.9)' }}
    />
  ) : (
    <div
      className="flex size-32 items-center justify-center rounded-full border-4"
      style={{ borderColor: 'rgba(255,255,255,0.9)', backgroundColor: 'rgba(255,255,255,0.15)' }}
    >
      <span className="select-none text-3xl font-bold tracking-tight text-white/70">
        {fullName ? fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : '?'}
      </span>
    </div>
  )

  if (!onPhotoChange) return avatar

  return <PhotoUploadInteractive avatar={avatar} photoUrl={photoUrl} onFile={handleFile} onPhotoChange={onPhotoChange} />
}

function PhotoUploadInteractive({
  avatar,
  photoUrl,
  onFile,
  onPhotoChange,
}: {
  avatar: ReactNode
  photoUrl: string
  onFile: (e: ChangeEvent<HTMLInputElement>) => void
  onPhotoChange: (dataUrl: string) => void
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const timer = setTimeout(() => document.addEventListener('click', handleClick), 0)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('click', handleClick)
    }
  }, [open])

  return (
    <div ref={containerRef} className="relative">
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onFile} />

      <button
        type="button"
        onClick={() => (photoUrl ? setOpen((v) => !v) : fileInputRef.current?.click())}
        className="group relative block size-32 cursor-pointer rounded-full print:cursor-auto"
        title={photoUrl ? 'Click to edit photo' : 'Click to upload a photo'}
      >
        {avatar}
        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 opacity-0 transition-all group-hover:bg-black/45 group-hover:opacity-100 print:hidden">
          <Camera className="size-6 text-white" />
        </span>
      </button>

      {open && photoUrl && (
        <div
          className="bg-popover text-popover-foreground absolute left-1/2 top-full z-50 mt-2 w-44 -translate-x-1/2 rounded-lg border p-1.5 shadow-lg dark:shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => {
              fileInputRef.current?.click()
              setOpen(false)
            }}
            className="hover:bg-accent flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-xs font-medium"
          >
            <Camera className="size-3.5" />
            Change photo
          </button>
          <button
            type="button"
            onClick={() => {
              onPhotoChange('')
              setOpen(false)
            }}
            className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-xs font-medium"
          >
            <Trash2 className="size-3.5" />
            Remove photo
          </button>
        </div>
      )}
    </div>
  )
}
