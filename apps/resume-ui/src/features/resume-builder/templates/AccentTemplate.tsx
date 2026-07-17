import type { ReactNode } from 'react'
import { DEFAULT_SECTION_ORDER, type SectionId } from '../types'
import type { ResumeTemplateProps, ResumeTheme } from './types'

export function AccentTemplate({ data, theme = data.theme }: ResumeTemplateProps) {
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

  const flatSkills = skills
    .flatMap((s) => s.value.split(','))
    .map((v) => v.trim())
    .filter(Boolean)

  const contactParts = [
    personalInfo.phone,
    personalInfo.email,
    personalInfo.linkedin,
    personalInfo.website,
    personalInfo.location,
  ].filter(Boolean)

  const order = data.sectionOrder?.length ? data.sectionOrder : DEFAULT_SECTION_ORDER

  const sectionRenderers: Partial<Record<SectionId, ReactNode>> = {
    summary: summary && (
      <AccentSection title="Summary" theme={theme}>
        <p style={{ color: theme.text }}>{summary}</p>
      </AccentSection>
    ),

    skills: flatSkills.length > 0 && (
      <AccentSection title="Skills" theme={theme}>
        <p style={{ color: theme.text }}>{flatSkills.join(' · ')}</p>
      </AccentSection>
    ),

    experience: experience.length > 0 && (
      <AccentSection title="Experience" theme={theme}>
        <div className="space-y-4">
          {experience.map((exp) => (
            <div key={exp.id} className="break-inside-avoid">
              <div className="flex items-baseline justify-between gap-3">
                <span style={{ color: theme.muted }}>{exp.company}</span>
                <span className="shrink-0 text-xs" style={{ color: theme.muted }}>
                  {exp.location}
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <span
                  className="font-semibold"
                  style={{ color: theme.primary }}
                >
                  {exp.role}
                </span>
                <span className="shrink-0 text-xs" style={{ color: theme.muted }}>
                  {[exp.startDate, exp.endDate].filter(Boolean).join(' - ')}
                </span>
              </div>
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
      </AccentSection>
    ),

    education: education.length > 0 && (
      <AccentSection title="Education" theme={theme}>
        <div className="space-y-3">
          {education.map((ed) => (
            <div key={ed.id} className="break-inside-avoid">
              <div className="flex items-baseline justify-between gap-3">
                <span style={{ color: theme.muted }}>{ed.institution}</span>
                <span className="shrink-0 text-xs" style={{ color: theme.muted }}>
                  {ed.state || ed.location}
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <span
                  className="font-semibold"
                  style={{ color: theme.primary }}
                >
                  {ed.degree}
                  {ed.fieldOfStudy && <span className="font-normal"> — {ed.fieldOfStudy}</span>}
                </span>
                <span className="shrink-0 text-xs" style={{ color: theme.muted }}>
                  {ed.startDate
                    ? [ed.startDate, ed.endDate || 'Present'].join(' - ')
                    : ed.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </AccentSection>
    ),

    projects: projects.length > 0 && (
      <AccentSection title="Projects" theme={theme}>
        <div className="space-y-3">
          {projects.map((p) => (
            <div key={p.id} className="break-inside-avoid">
              <div className="flex items-baseline justify-between gap-3">
                <span
                  className="font-semibold"
                  style={{ color: theme.primary }}
                >
                  {p.name}
                </span>
                <span className="shrink-0 text-xs" style={{ color: theme.muted }}>
                  {p.startDate
                    ? [p.startDate, p.endDate || 'Present'].join(' - ')
                    : ''}
                </span>
              </div>
              {p.domain && (
                <p style={{ color: theme.muted }}>{p.domain}</p>
              )}
              {p.stack && (
                <p className="text-xs italic" style={{ color: theme.muted }}>{p.stack}</p>
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
      </AccentSection>
    ),

    certifications: certifications.length > 0 && (
      <AccentSection title="Certificates" theme={theme}>
        <ul className="space-y-1" style={{ color: theme.text }}>
          {certifications.map((c) => (
            <li key={c.id}>{c.name}</li>
          ))}
        </ul>
      </AccentSection>
    ),

    languages: languages.length > 0 && (
      <AccentSection title="Languages" theme={theme}>
        <p style={{ color: theme.text }}>
          {languages.map((l) => l.name).join(', ')}
        </p>
      </AccentSection>
    ),
  }

  return (
    <main
      className="mx-auto max-w-[850px] bg-white px-14 py-12 text-[13.5px] leading-relaxed shadow-sm print:p-0 print:shadow-none"
      style={{ color: theme.text, backgroundColor: theme.background }}
    >
      <header className="text-center">
        <h1
          className="font-serif text-3xl font-bold tracking-wide"
          style={{ color: theme.primary }}
        >
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.title && (
          <p className="mt-1 text-base" style={{ color: theme.muted }}>
            {personalInfo.title}
          </p>
        )}
        {contactParts.length > 0 && (
          <p className="mt-1 text-xs" style={{ color: theme.muted }}>
            {contactParts.join('  •  ')}
          </p>
        )}
      </header>

      {order.map((id) => sectionRenderers[id] && <div key={id} data-section-id={id}>{sectionRenderers[id]}</div>)}
    </main>
  )
}

function AccentSection({ title, children, theme: sectionTheme }: { title: string; children: ReactNode; theme: ResumeTheme }) {
  return (
    <section className="mt-6">
      <h2
        className="border-b pb-1.5 text-center font-serif text-base font-bold"
        style={{ color: sectionTheme.primary, borderColor: sectionTheme.primary }}
      >
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  )
}
