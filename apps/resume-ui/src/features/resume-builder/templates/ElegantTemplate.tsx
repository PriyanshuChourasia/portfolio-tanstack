import type { ReactNode } from 'react'
import type { ResumeTemplateProps, ResumeTheme } from './types'

export function ElegantTemplate({ data, theme = data.theme }: ResumeTemplateProps) {
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

  return (
    <main
      className="mx-auto max-w-[850px] bg-white px-14 py-12 font-serif text-[13.5px] leading-relaxed shadow-sm print:p-0 print:shadow-none"
      style={{ color: theme.text, backgroundColor: theme.background }}
    >
      <header className="text-center">
        <h1
          className="text-3xl font-bold tracking-wide"
          style={{ color: theme.primary }}
        >
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.title && (
          <p
            className="mt-1 text-base font-bold"
            style={{ color: theme.primary }}
          >
            {personalInfo.title}
          </p>
        )}
        {personalInfo.location && (
          <p className="mt-1" style={{ color: theme.muted }}>
            {personalInfo.location}
          </p>
        )}
      </header>

      {(personalInfo.phone || personalInfo.email) && (
        <div className="mt-4 flex items-baseline justify-between text-sm font-semibold">
          <span>{personalInfo.phone}</span>
          <span>{personalInfo.email}</span>
        </div>
      )}

      <div
        className="mt-1 border-t-[6px] border-double"
        style={{ borderColor: theme.primary }}
      />

      {summary && (
        <ElegantSection title="Profile" theme={theme}>
          <p
            className="text-center text-[13px] italic"
            style={{ color: theme.text }}
          >
            {summary}
          </p>
        </ElegantSection>
      )}

      {experience.length > 0 && (
        <ElegantSection title="Experience" theme={theme}>
          <div className="space-y-5">
            {experience.map((exp) => (
              <div key={exp.id} className="break-inside-avoid">
                <div className="flex items-start justify-between gap-3">
              <span
                className="font-bold whitespace-nowrap"
                style={{ color: theme.primary }}
              >
                ❖ {[exp.role, exp.company].filter(Boolean).join(' - ')}
              </span>
              <span
                className="mx-2 flex-1 translate-y-[-2px] border-b border-dotted"
                style={{ borderColor: theme.muted }}
              />
              <span
                className="shrink-0 text-right text-xs"
                style={{ color: theme.muted }}
              >
                    <span className="block">
                      {[exp.startDate, exp.endDate].filter(Boolean).join(' - ')}
                    </span>
                    {exp.location && <span className="block">{exp.location}</span>}
                  </span>
                </div>
                {exp.bullets && (
                  <ul
                    className="mt-2 list-disc space-y-1 pl-5 marker:text-neutral-400"
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
        </ElegantSection>
      )}

      {education.length > 0 && (
        <ElegantSection title="Education" theme={theme}>
          <div className="space-y-3">
            {education.map((ed) => (
              <div key={ed.id} className="flex items-start justify-between gap-3">
              <span
                className="font-bold whitespace-nowrap"
                style={{ color: theme.primary }}
              >
                ❖ {ed.degree}
                {ed.fieldOfStudy && <span className="font-normal"> {'—'} {ed.fieldOfStudy}</span>}
              </span>
              <span
                className="mx-2 flex-1 translate-y-[-2px] border-b border-dotted"
                style={{ borderColor: theme.muted }}
              />
              <span
                className="shrink-0 text-right text-xs"
                style={{ color: theme.muted }}
              >
                  <span className="block">
                    {ed.startDate
                      ? [ed.startDate, ed.endDate || 'Present'].join(' - ')
                      : ed.date}
                  </span>
                  {ed.institution && <span className="block">{ed.institution}</span>}
                </span>
              </div>
            ))}
          </div>
        </ElegantSection>
      )}

      {flatSkills.length > 0 && (
        <ElegantSection title="Skills" theme={theme}>
          <p className="text-center" style={{ color: theme.text }}>
            {flatSkills.join(' • ')}
          </p>
        </ElegantSection>
      )}

      {(certifications.length > 0 || languages.length > 0) && (
        <ElegantSection title="Additional Information" theme={theme}>
          <ul className="space-y-1 text-center" style={{ color: theme.text }}>
            {languages.length > 0 && (
              <li>
                <span className="font-bold">Languages: </span>
                {languages.map((l) => l.name).join(', ')}
              </li>
            )}
            {certifications.length > 0 && (
              <li>
                <span className="font-bold">Certificates: </span>
                {certifications.map((c) => c.name).join(', ')}
              </li>
            )}
          </ul>
        </ElegantSection>
      )}
    </main>
  )
}

function ElegantSection({
  title,
  children,
  theme: sectionTheme,
}: {
  title: string
  children: ReactNode
  theme: ResumeTheme
}) {
  return (
    <section className="mt-8">
      <h2
        className="py-1.5 text-center text-base font-bold tracking-[0.2em] uppercase underline decoration-1 underline-offset-4"
        style={{
          color: sectionTheme.primary,
          backgroundColor: sectionTheme.muted + '20',
        }}
      >
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}
