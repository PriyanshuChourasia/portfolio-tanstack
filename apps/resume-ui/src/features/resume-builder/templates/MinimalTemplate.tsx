import type { ReactNode } from 'react'
import { DEFAULT_SECTION_ORDER, type SectionId } from '../types'
import type { ResumeTemplateProps, ResumeTheme } from './types'

export function MinimalTemplate({ data, theme = data.theme }: ResumeTemplateProps) {
  const { personalInfo, experience, education, skills, certifications, languages } =
    data

  const flatSkills = skills
    .flatMap((s) => s.value.split(','))
    .map((v) => v.trim())
    .filter(Boolean)

  const contactLine = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
  ]
    .filter(Boolean)
    .join(' | ')

  const order = data.sectionOrder?.length ? data.sectionOrder : DEFAULT_SECTION_ORDER

  const sectionRenderers: Partial<Record<SectionId, ReactNode>> = {
    experience: experience.length > 0 && (
      <MinimalSection title="Experience" theme={theme}>
        <div className="space-y-4">
          {experience.map((exp) => (
            <div key={exp.id} className="break-inside-avoid">
              <div className="flex items-baseline justify-between gap-3">
                <span
                  className="font-bold"
                  style={{ color: theme.primary }}
                >
                  {exp.company}
                </span>
                <span
                  className="shrink-0 font-bold"
                  style={{ color: theme.primary }}
                >
                  {[exp.startDate, exp.endDate].filter(Boolean).join(' – ')}
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <span>{exp.role}</span>
                <span className="shrink-0">{exp.location}</span>
              </div>
              {exp.bullets && (
                <ul className="mt-1.5 list-disc space-y-1 pl-5">
                  {exp.bullets
                    .split('\n')
                    .filter(Boolean)
                    .map((line, i) => <li key={i}>{line}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      </MinimalSection>
    ),

    education: education.length > 0 && (
      <MinimalSection title="Education" theme={theme}>
        <div className="space-y-3">
          {education.map((ed) => (
            <div key={ed.id}>
              <div className="flex items-baseline justify-between gap-3">
                <span
                  className="font-bold"
                  style={{ color: theme.primary }}
                >
                  {ed.institution}
                </span>
                <span
                  className="shrink-0 font-bold"
                  style={{ color: theme.primary }}
                >
                  {ed.startDate
                    ? [ed.startDate, ed.endDate || 'Present'].join(' – ')
                    : ed.date}
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <span>
                  {ed.degree}
                  {ed.fieldOfStudy && <span> — {ed.fieldOfStudy}</span>}
                </span>
                <span className="shrink-0">{ed.state || ed.location}</span>
              </div>
            </div>
          ))}
        </div>
      </MinimalSection>
    ),

    skills: flatSkills.length > 0 && (
      <MinimalSection title="Technical Skills" theme={theme}>
        <p>{flatSkills.join(', ')}</p>
      </MinimalSection>
    ),

    certifications: certifications.length > 0 && (
      <MinimalSection title="Certifications & Training" theme={theme}>
        <p>{certifications.map((c) => c.name).join(', ')}</p>
      </MinimalSection>
    ),

    languages: languages.length > 0 && (
      <MinimalSection title="Languages" theme={theme}>
        <p>
          {languages
            .map((l) => (l.level ? `${l.name} (${l.level})` : l.name))
            .join(', ')}
        </p>
      </MinimalSection>
    ),
  }

  return (
    <main
      className="mx-auto max-w-[850px] bg-white px-14 py-12 font-serif text-[13.5px] leading-relaxed shadow-sm print:p-0 print:shadow-none"
      style={{ color: theme.text, backgroundColor: theme.background }}
    >
      <header>
        <h1
          className="text-3xl font-bold"
          style={{ color: theme.primary }}
        >
          {personalInfo.fullName || 'First Last'}
        </h1>
        {contactLine && <p className="mt-1" style={{ color: theme.muted }}>{contactLine}</p>}
      </header>

      {order.map((id) => sectionRenderers[id] && <div key={id} data-section-id={id}>{sectionRenderers[id]}</div>)}
    </main>
  )
}

function MinimalSection({
  title,
  children,
  theme: sectionTheme,
}: {
  title: string
  children: ReactNode
  theme: ResumeTheme
}) {
  return (
    <section className="mt-6">
      <h2
        className="border-b pb-1 text-base font-bold uppercase"
        style={{ color: sectionTheme.primary, borderColor: sectionTheme.primary }}
      >
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  )
}
