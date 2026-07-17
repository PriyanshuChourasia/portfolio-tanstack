import type { ReactNode } from 'react'
import { DEFAULT_SECTION_ORDER, type SectionId } from '../types'
import type { ResumeTemplateProps } from './types'

export function ModernTemplate({ data, theme = data.theme }: ResumeTemplateProps) {
  const {
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    languages,
  } = data

  const coreSkills = skills
    .flatMap((s) => s.value.split(','))
    .map((v) => v.trim())
    .filter(Boolean)
    .join(', ')

  const order = data.sectionOrder?.length ? data.sectionOrder : DEFAULT_SECTION_ORDER

  const sectionRenderers: Partial<Record<SectionId, ReactNode>> = {
    summary: summary && (
      <section className="mt-6">
        <h2
          className="mb-2 text-base font-bold tracking-wide uppercase"
          style={{ color: theme.primary }}
        >
          Summary
        </h2>
        <p style={{ color: theme.text }}>{summary}</p>
      </section>
    ),

    experience: experience.length > 0 && (
      <section className="mt-6">
        <h2
          className="mb-3 text-base font-bold tracking-wide uppercase"
          style={{ color: theme.primary }}
        >
          Work Experience
        </h2>
        <div className="space-y-4">
          {experience.map((exp) => (
            <div key={exp.id} className="break-inside-avoid">
              <div className="flex items-baseline justify-between gap-3">
                <span
                  className="font-semibold"
                  style={{ color: theme.primary }}
                >
                  {exp.role}
                </span>
                <span
                  className="shrink-0 text-xs"
                  style={{ color: theme.muted }}
                >
                  {[exp.startDate, exp.endDate].filter(Boolean).join(' – ')}
                </span>
              </div>
              <p
                className="text-xs italic"
                style={{ color: theme.muted }}
              >
                {[exp.company, exp.location].filter(Boolean).join(' | ')}
              </p>
              {exp.bullets && (
                <ul
                  className="mt-1.5 list-disc space-y-1 pl-5"
                  style={{ color: theme.text }}
                >
                  {exp.bullets
                    .split('\n')
                    .filter(Boolean)
                    .map((line, i) => <li key={i}>{line}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    ),

    projects: projects.length > 0 && (
      <section className="mt-6">
        <h2 className="mb-3 text-base font-bold tracking-wide uppercase">
          Projects
        </h2>
        <div className="space-y-4">
          {projects.map((p) => (
            <div key={p.id} className="break-inside-avoid">
              <div className="flex items-baseline justify-between gap-3">
                <span
                  className="font-semibold"
                  style={{ color: theme.primary }}
                >
                  {p.name}
                </span>
                <span
                  className="shrink-0 text-xs"
                  style={{ color: theme.muted }}
                >
                  {p.startDate
                    ? [p.startDate, p.endDate || 'Present'].join(' – ')
                    : ''}
                </span>
              </div>
              {p.domain && (
                <p
                  className="text-xs"
                  style={{ color: theme.muted }}
                >
                  {p.domain}
                </p>
              )}
              {p.stack && (
                <p
                  className="text-xs italic"
                  style={{ color: theme.muted }}
                >
                  {p.stack}
                </p>
              )}
              {p.bullets && (
                <ul
                  className="mt-1.5 list-disc space-y-1 pl-5"
                  style={{ color: theme.text }}
                >
                  {p.bullets
                    .split('\n')
                    .filter(Boolean)
                    .map((line, i) => <li key={i}>{line}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    ),

    skills: coreSkills && (
      <section className="mt-6">
        <h2
          className="mb-2 text-base font-bold tracking-wide uppercase"
          style={{ color: theme.primary }}
        >
          Core Skills
        </h2>
        <p style={{ color: theme.text }}>{coreSkills}</p>
      </section>
    ),

    education: education.length > 0 && (
      <section className="mt-6">
        <h2
          className="mb-3 text-base font-bold tracking-wide uppercase"
          style={{ color: theme.primary }}
        >
          Education
        </h2>
        <div className="space-y-3">
          {education.map((ed) => (
            <div key={ed.id}>
              <div className="flex items-baseline justify-between gap-3">
                <span
                  className="font-semibold"
                  style={{ color: theme.primary }}
                >
                  {ed.institution}
                </span>
                <span
                  className="shrink-0 text-xs"
                  style={{ color: theme.muted }}
                >
                  {ed.startDate
                    ? [ed.startDate, ed.endDate || 'Present'].join(' – ')
                    : ed.date}
                </span>
              </div>
              <p style={{ color: theme.text }}>
                {ed.degree}
                {ed.fieldOfStudy && <span> — {ed.fieldOfStudy}</span>}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),

    certifications: certifications.length > 0 && (
      <section className="mt-6">
        <h2
          className="mb-3 text-base font-bold tracking-wide uppercase"
          style={{ color: theme.primary }}
        >
          Certificates
        </h2>
        <div className="space-y-2">
          {certifications.map((c) => (
            <p key={c.id} className="font-medium" style={{ color: theme.text }}>
              {c.name}
            </p>
          ))}
        </div>
      </section>
    ),

    languages: languages.length > 0 && (
      <section className="mt-6">
        <h2
          className="mb-3 text-base font-bold tracking-wide uppercase"
          style={{ color: theme.primary }}
        >
          Languages
        </h2>
        <p style={{ color: theme.text }}>
          {languages.map((l) => `${l.name} (${l.level})`).join(', ')}
        </p>
      </section>
    ),
  }

  return (
    <main
      className="mx-auto max-w-[850px] bg-white px-14 py-12 font-sans text-[13.5px] leading-relaxed shadow-sm print:p-0 print:shadow-none"
      style={{ color: theme.text, backgroundColor: theme.background }}
    >
      <header className="flex items-start justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <h1
            className="text-3xl font-bold tracking-tight"
            style={{ color: theme.primary }}
          >
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {personalInfo.title && (
            <p
              className="mt-1 text-sm"
              style={{ color: theme.muted }}
            >
              {personalInfo.title}
            </p>
          )}
        </div>
        <div
          className="shrink-0 space-y-0.5 text-right text-xs"
          style={{ color: theme.muted }}
        >
          {personalInfo.email && (
            <p>
              <a className="underline" href={`mailto:${personalInfo.email}`}>
                {personalInfo.email}
              </a>
            </p>
          )}
          {personalInfo.linkedin && <p>{personalInfo.linkedin}</p>}
          {personalInfo.website && <p>{personalInfo.website}</p>}
          {personalInfo.phone && <p>{personalInfo.phone}</p>}
          {personalInfo.location && <p>{personalInfo.location}</p>}
        </div>
      </header>

      {order.map((id) => sectionRenderers[id] && <div key={id} data-section-id={id}>{sectionRenderers[id]}</div>)}
    </main>
  )
}
