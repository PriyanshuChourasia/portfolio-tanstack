import type { ReactNode } from 'react'
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

      {experience.length > 0 && (
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
      )}

      {education.length > 0 && (
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
                      ? [ed.startDate, ed.endDate || 'Present'].join(' \u2013 ')
                      : ed.date}
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <span>
                    {ed.degree}
                    {ed.fieldOfStudy && <span> \u2014 {ed.fieldOfStudy}</span>}
                  </span>
                  <span className="shrink-0">{ed.state || ed.location}</span>
                </div>
              </div>
            ))}
          </div>
        </MinimalSection>
      )}

      {(flatSkills.length > 0 ||
        certifications.length > 0 ||
        languages.length > 0) && (
        <MinimalSection title="Other" theme={theme}>
          <ul className="list-disc space-y-1 pl-5">
            {flatSkills.length > 0 && (
              <li>
                <span className="font-bold">Technical Skills</span>:{' '}
                {flatSkills.join(', ')}
              </li>
            )}
            {certifications.length > 0 && (
              <li>
                <span className="font-bold">Certifications & Training</span>:{' '}
                {certifications.map((c) => c.name).join(', ')}
              </li>
            )}
            {languages.length > 0 && (
              <li>
                <span className="font-bold">Languages</span>:{' '}
                {languages
                  .map((l) => (l.level ? `${l.name} (${l.level})` : l.name))
                  .join(', ')}
              </li>
            )}
          </ul>
        </MinimalSection>
      )}
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
