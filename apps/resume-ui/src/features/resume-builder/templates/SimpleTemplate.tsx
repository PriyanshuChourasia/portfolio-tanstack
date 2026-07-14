import type { ReactNode } from 'react'
import type { ResumeTemplateProps, ResumeTheme } from './types'

export function SimpleTemplate({ data, theme = data.theme }: ResumeTemplateProps) {
  const { personalInfo, summary, experience, education, skills, certifications } =
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
    .join(' • ')

  return (
    <main
      className="mx-auto max-w-[850px] bg-white px-14 py-12 font-sans text-[13.5px] leading-relaxed shadow-sm print:p-0 print:shadow-none"
      style={{ color: theme.text, backgroundColor: theme.background }}
    >
      <header>
        <h1
          className="text-3xl font-bold"
          style={{ color: theme.primary }}
        >
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {contactLine && (
          <p className="mt-2" style={{ color: theme.muted }}>
            {contactLine}
          </p>
        )}
      </header>

      {summary && (
        <SimpleSection title="Professional Summary" theme={theme}>
          <p className="text-neutral-700">{summary}</p>
        </SimpleSection>
      )}

      {experience.length > 0 && (
        <SimpleSection title="Experience" theme={theme}>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="break-inside-avoid">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-bold">{exp.role}</span>
                  <span className="shrink-0 text-neutral-600">
                    {[exp.startDate, exp.endDate].filter(Boolean).join(' - ')}
                  </span>
                </div>
                {exp.company && <p>{exp.company}</p>}
                {exp.location && (
                  <p className="text-neutral-500">{exp.location}</p>
                )}
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
        </SimpleSection>
      )}

      {flatSkills.length > 0 && (
        <SimpleSection title="Skills" theme={theme}>
          <ul className="space-y-1 text-neutral-700">
            {flatSkills.map((skill, i) => (
              <li key={i}>{'•'} {skill}</li>
            ))}
          </ul>
        </SimpleSection>
      )}

      {education.length > 0 && (
        <SimpleSection title="Education" theme={theme}>
          <div className="space-y-3">
            {education.map((ed) => (
              <div key={ed.id}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-bold">
                    {[ed.degree, ed.fieldOfStudy].filter(Boolean).join(' in ')}
                  </span>
                  <span className="shrink-0 text-neutral-600">
                    {ed.startDate
                      ? [ed.startDate, ed.endDate || 'Present'].join(' - ')
                      : ed.date}
                  </span>
                </div>
                <p>{ed.institution}</p>
                {(ed.state || ed.location) && (
                  <p className="text-neutral-500">{ed.state || ed.location}</p>
                )}
              </div>
            ))}
          </div>
        </SimpleSection>
      )}

      {certifications.length > 0 && (
        <SimpleSection title="Certifications" theme={theme}>
          <div className="space-y-2">
            {certifications.map((c) => (
              <p key={c.id} className="font-bold">
                {c.name}
              </p>
            ))}
          </div>
        </SimpleSection>
      )}
    </main>
  )
}

function SimpleSection({
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
        className="mb-2 text-lg font-bold"
        style={{ color: sectionTheme.primary }}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}
