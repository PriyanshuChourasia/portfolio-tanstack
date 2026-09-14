import { Globe, Linkedin, Mail, MapPin, Phone } from 'lucide-react'
import type { ReactNode } from 'react'
import { ColorableText } from '../components/ColorableText'
import { DEFAULT_SECTION_ORDER, type SectionId } from '../types'
import type { ResumeTemplateProps, ResumeTheme } from './types'

export function ExecutiveTemplate({ data, theme = data.theme, onElementColorChange }: ResumeTemplateProps) {
  const { personalInfo, summary, experience, education, skills, certifications } = data
  const elementColors = data.elementColors ?? {}
  const setColor = onElementColorChange
    ? (id: string, color: string) => onElementColorChange(id, color)
    : undefined

  const flatSkills = skills
    .flatMap((s) => s.value.split(','))
    .map((v) => v.trim())
    .filter(Boolean)

  const contactItems: Array<{ icon: ReactNode; value: string; href?: string }> = []
  if (personalInfo.email)
    contactItems.push({
      icon: <Mail className="size-3.5" style={{ color: theme.accent }} />,
      value: personalInfo.email,
      href: `mailto:${personalInfo.email}`,
    })
  if (personalInfo.phone)
    contactItems.push({ icon: <Phone className="size-3.5" style={{ color: theme.primary }} />, value: personalInfo.phone })
  if (personalInfo.location)
    contactItems.push({ icon: <MapPin className="size-3.5" style={{ color: theme.accent }} />, value: personalInfo.location })
  if (personalInfo.linkedin)
    contactItems.push({ icon: <Linkedin className="size-3.5" style={{ color: theme.primary }} />, value: personalInfo.linkedin })
  if (personalInfo.website)
    contactItems.push({ icon: <Globe className="size-3.5" style={{ color: theme.accent }} />, value: personalInfo.website })

  const order = data.sectionOrder?.length ? data.sectionOrder : DEFAULT_SECTION_ORDER

  const sectionRenderers: Partial<Record<SectionId, ReactNode>> = {
    summary: summary && <p className="text-[13px] leading-relaxed" style={{ color: theme.text }}>{summary}</p>,

    experience: experience.length > 0 && (
      <ExecutiveSection id="heading:experience" title="Work Experience" theme={theme} elementColors={elementColors} onElementColorChange={setColor}>
        <div className="space-y-4">
          {experience.map((exp) => (
            <div key={exp.id} className="break-inside-avoid">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[13.5px] font-semibold" style={{ color: theme.primary }}>
                  {exp.role || 'Position'}
                </span>
                <span className="shrink-0 text-xs" style={{ color: theme.muted }}>
                  {[exp.startDate, exp.endDate].filter(Boolean).join(' – ')}
                </span>
              </div>
              {exp.company && (
                <p className="text-xs" style={{ color: theme.muted }}>
                  {[exp.company, exp.location].filter(Boolean).join(' · ')}
                </p>
              )}
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
            </div>
          ))}
        </div>
      </ExecutiveSection>
    ),

    education: education.length > 0 && (
      <ExecutiveSection id="heading:education" title="Education" theme={theme} elementColors={elementColors} onElementColorChange={setColor}>
        <div className="space-y-3">
          {education.map((ed) => (
            <div key={ed.id}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[13.5px] font-semibold" style={{ color: theme.primary }}>
                  {[ed.degree, ed.fieldOfStudy].filter(Boolean).join(' — ') || 'Degree'}
                </span>
                <span className="shrink-0 text-xs" style={{ color: theme.muted }}>
                  {ed.startDate ? [ed.startDate, ed.endDate || 'Present'].join(' – ') : ed.date}
                </span>
              </div>
              <p className="text-xs" style={{ color: theme.muted }}>
                {[ed.institution, ed.state || ed.location].filter(Boolean).join(', ')}
              </p>
            </div>
          ))}
        </div>
      </ExecutiveSection>
    ),

    skills: flatSkills.length > 0 && (
      <ExecutiveSection id="heading:skills" title="Skills" theme={theme} elementColors={elementColors} onElementColorChange={setColor}>
        <div className="grid grid-cols-3 gap-x-4 gap-y-1.5">
          {flatSkills.map((skill, i) => (
            <span key={i} className="text-[13px]" style={{ color: theme.text }}>
              {skill}
            </span>
          ))}
        </div>
      </ExecutiveSection>
    ),

    certifications: certifications.length > 0 && (
      <ExecutiveSection id="heading:certifications" title="Certificates" theme={theme} elementColors={elementColors} onElementColorChange={setColor}>
        <div className="space-y-1">
          {certifications.map((c) => (
            <p key={c.id} className="text-[13px] font-medium" style={{ color: theme.accent }}>
              {c.name}
            </p>
          ))}
        </div>
      </ExecutiveSection>
    ),
  }

  return (
    <main
      className="mx-auto max-w-[850px] bg-white px-10 py-8 font-sans shadow-sm print:shadow-none"
      style={{ backgroundColor: theme.background }}
    >
      <div className="flex items-center gap-4">
        <div className="shrink-0">
          {personalInfo.photoUrl ? (
            <img
              src={personalInfo.photoUrl}
              alt={personalInfo.fullName || 'Profile photo'}
              className="size-16 rounded-full border object-cover"
              style={{ borderColor: theme.muted + '33' }}
            />
          ) : (
            <div
              className="flex size-16 items-center justify-center rounded-full border"
              style={{ borderColor: theme.muted + '33', backgroundColor: theme.muted + '14' }}
            >
              <span className="select-none text-lg font-bold tracking-tight" style={{ color: theme.muted }}>
                {personalInfo.fullName
                  ? personalInfo.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                  : '?'}
              </span>
            </div>
          )}
        </div>
        <div className="min-w-0">
          <ColorableText
            as="h1"
            className="text-2xl font-bold"
            color={elementColors.name || theme.primary}
            onChange={setColor ? (c) => setColor('name', c) : undefined}
          >
            {personalInfo.fullName || 'Your Name'}
          </ColorableText>
          {personalInfo.title && (
            <ColorableText
              as="p"
              className="mt-0.5 text-sm font-medium"
              color={elementColors.title || theme.accent}
              onChange={setColor ? (c) => setColor('title', c) : undefined}
            >
              {personalInfo.title}
            </ColorableText>
          )}
        </div>
      </div>

      {contactItems.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-xs" style={{ color: theme.muted }}>
          {contactItems.map((item, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {item.icon}
              {item.href ? (
                <a href={item.href} className="hover:underline">
                  {item.value}
                </a>
              ) : (
                item.value
              )}
            </span>
          ))}
        </div>
      )}

      <div className="my-4 border-t" style={{ borderColor: theme.muted + '33' }} />

      <div className="space-y-4">
        {order.map(
          (id) => sectionRenderers[id] && <div key={id} data-section-id={id}>{sectionRenderers[id]}</div>,
        )}
      </div>
    </main>
  )
}

function ExecutiveSection({
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
    <section className="break-inside-avoid">
      <div className="mb-2 border-t pt-3" style={{ borderColor: sectionTheme.muted + '33' }}>
        <ColorableText
          as="h2"
          className="text-sm font-bold tracking-wide uppercase"
          color={color}
          onChange={onElementColorChange ? (c) => onElementColorChange(id, c) : undefined}
        >
          {title}
        </ColorableText>
      </div>
      {children}
    </section>
  )
}
