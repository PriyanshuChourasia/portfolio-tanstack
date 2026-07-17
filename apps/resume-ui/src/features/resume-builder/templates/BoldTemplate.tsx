import type { ReactNode } from 'react'
import { DEFAULT_SECTION_ORDER, type SectionId } from '../types'
import type { ResumeTemplateProps } from './types'

export function BoldTemplate({ data, theme = data.theme }: ResumeTemplateProps) {
  const {
    personalInfo,
    summary,
    experience,
    education,
    skills,
    certifications,
    languages,
  } = data

  const flatSkills = skills
    .flatMap((s) => s.value.split(','))
    .map((v) => v.trim())
    .filter(Boolean)

  const contactLine = [
    personalInfo.location,
    personalInfo.phone,
    personalInfo.email,
  ]
    .filter(Boolean)
    .join(' | ')

  const order = data.sectionOrder?.length ? data.sectionOrder : DEFAULT_SECTION_ORDER

  const sectionRenderers: Partial<Record<SectionId, ReactNode>> = {
    summary: summary && (
      <BoldSection title="Summary">
        <p className="text-neutral-700">{summary}</p>
      </BoldSection>
    ),

    experience: experience.length > 0 && (
      <BoldSection title="Professional Experience">
        <div className="space-y-4">
          {experience.map((exp) => (
            <div key={exp.id} className="break-inside-avoid">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-bold">
                  {[exp.role, exp.company].filter(Boolean).join(', ')}
                </span>
                <span className="shrink-0 text-xs font-semibold text-neutral-600">
                  {[exp.startDate, exp.endDate].filter(Boolean).join(' — ')}
                </span>
              </div>
              {exp.bullets && (
                <ul className="mt-1.5 list-disc space-y-1 pl-5 text-neutral-700">
                  {exp.bullets
                    .split('\n')
                    .filter(Boolean)
                    .map((line, i) => <li key={i}>{line}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      </BoldSection>
    ),

    education: education.length > 0 && (
      <BoldSection title="Education">
        <div className="space-y-3">
          {education.map((ed) => (
            <div key={ed.id}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-bold">
                  {ed.degree}
                  {ed.fieldOfStudy && <span className="font-normal"> — {ed.fieldOfStudy}</span>}
                </span>
                <span className="shrink-0 text-xs font-semibold text-neutral-600">
                  {ed.startDate
                    ? [ed.startDate, ed.endDate || 'Present'].join(' — ')
                    : ed.date}
                </span>
              </div>
              <p className="text-neutral-600">
                {[ed.institution, ed.state || ed.location].filter(Boolean).join(', ')}
              </p>
            </div>
          ))}
        </div>
      </BoldSection>
    ),

    skills: flatSkills.length > 0 && (
      <BoldSection title="Technical Skills">
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-neutral-700 sm:grid-cols-4">
          {flatSkills.map((skill, i) => (
            <p key={i}>{skill}</p>
          ))}
        </div>
      </BoldSection>
    ),

    certifications: certifications.length > 0 && (
      <BoldSection title="Certifications">
        <ul className="list-disc space-y-1 pl-5 text-neutral-700">
          {certifications.map((c) => (
            <li key={c.id}>{c.name}</li>
          ))}
        </ul>
      </BoldSection>
    ),

    languages: languages.length > 0 && (
      <BoldSection title="Languages">
        <p className="text-neutral-700">
          {languages.map((l) => l.name).join(', ')}
        </p>
      </BoldSection>
    ),
  }

  return (
    <main
      className="mx-auto max-w-[850px] bg-white px-14 py-12 font-sans text-[13.5px] leading-relaxed shadow-sm print:p-0 print:shadow-none"
      style={{
        color: theme.text,
        backgroundColor: theme.background,
        '--bold-accent': theme.accent,
      } as React.CSSProperties}
    >
      <header className="flex items-start justify-between gap-6">
        <div>
          <h1
            className="text-4xl font-extrabold tracking-tight uppercase"
            style={{ color: theme.accent }}
          >
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {personalInfo.title && (
            <p
              className="mt-2 text-lg font-bold uppercase"
              style={{ color: theme.primary }}
            >
              {personalInfo.title}
            </p>
          )}
          {contactLine && (
            <p className="mt-2" style={{ color: theme.muted }}>
              {contactLine}
            </p>
          )}
        </div>
        {personalInfo.photoUrl && (
          <img
            src={personalInfo.photoUrl}
            alt={personalInfo.fullName}
            className="h-24 w-24 shrink-0 rounded object-cover"
          />
        )}
      </header>

      {order.map((id) => sectionRenderers[id] && <div key={id} data-section-id={id}>{sectionRenderers[id]}</div>)}
    </main>
  )
}

function BoldSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="mt-6">
      <h2
        className="border-b-2 pb-1 text-base font-bold tracking-wide uppercase"
        style={{
          color: 'var(--bold-accent, #2563eb)',
          borderColor: 'var(--bold-accent, #2563eb)',
        }}
      >
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  )
}
