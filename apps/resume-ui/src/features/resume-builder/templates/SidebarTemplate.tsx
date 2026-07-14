import type { ReactNode } from 'react'
import type { ResumeTemplateProps, ResumeTheme } from './types'

export function SidebarTemplate({ data, theme = data.theme }: ResumeTemplateProps) {
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

  const hasContact =
    personalInfo.location ||
    personalInfo.phone ||
    personalInfo.email ||
    personalInfo.linkedin

  return (
    <main
      className="mx-auto grid max-w-[850px] grid-cols-[1fr_260px] gap-10 bg-white px-14 py-12 font-sans text-[13.5px] leading-relaxed shadow-sm print:p-0 print:shadow-none"
      style={{ color: theme.text, backgroundColor: theme.background }}
    >
      <div>
        <h1
          className="text-3xl font-bold"
          style={{ color: theme.primary }}
        >
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.title && (
          <p
            className="mt-1 text-xl font-bold"
            style={{ color: theme.primary }}
          >
            {personalInfo.title}
          </p>
        )}
        {summary && (
          <p className="mt-3" style={{ color: theme.muted }}>
            {summary}
          </p>
        )}          {experience.length > 0 && (
            <section className="mt-8">
              <h2
                className="text-sm font-bold tracking-wide uppercase"
                style={{ color: theme.accent }}
              >
                Experience
              </h2>
              <div className="mt-3 space-y-5">
                {experience.map((exp) => (
                  <div key={exp.id} className="break-inside-avoid">
                    <p>
                      <span className="font-bold" style={{ color: theme.primary }}>{exp.company}</span>
                      {exp.location && <span style={{ color: theme.muted }}>, {exp.location}</span>}
                    </p>
                    {exp.role && <p className="font-semibold italic" style={{ color: theme.text }}>{exp.role}</p>}
                    <p style={{ color: theme.muted }}>
                      {[exp.startDate, exp.endDate].filter(Boolean).join(' - ')}
                    </p>
                    {exp.bullets && (
                      <ul className="mt-1.5 list-disc space-y-1 pl-5" style={{ color: theme.text }}>
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
          )}
      </div>

      <aside className="space-y-6 text-sm" style={{ color: theme.text }}>
        {hasContact && (
          <div className="space-y-0.5" style={{ color: theme.text }}>
            {personalInfo.location && <p>{personalInfo.location}</p>}
            {personalInfo.phone && <p>{personalInfo.phone}</p>}
            {personalInfo.email && (
              <p>
                <a
                  className="underline"
                  style={{ color: theme.accent }}
                  href={`mailto:${personalInfo.email}`}
                >
                  {personalInfo.email}
                </a>
              </p>
            )}
            {personalInfo.linkedin && (
              <p style={{ color: theme.accent }}>{personalInfo.linkedin}</p>
            )}
          </div>
        )}

        {flatSkills.length > 0 && (
          <SidebarSection title="Skills" theme={theme}>
            <div className="space-y-1" style={{ color: theme.text }}>
              {flatSkills.map((skill, i) => (
                <p key={i}>{skill}</p>
              ))}
            </div>
          </SidebarSection>
        )}

        {education.length > 0 && (
          <SidebarSection title="Education" theme={theme}>
            <div className="space-y-3">
              {education.map((ed) => (
                <div key={ed.id}>
                  <p className="font-bold" style={{ color: theme.primary }}>{ed.institution}</p>
                  {ed.degree && (
                    <p style={{ color: theme.muted }}>
                      {ed.degree}
                      {ed.fieldOfStudy && <span> {'\u2014'} {ed.fieldOfStudy}</span>}
                    </p>
                  )}
                  {(ed.startDate || ed.date) && (
                    <p style={{ color: theme.muted }}>
                      {ed.startDate
                        ? [ed.startDate, ed.endDate || 'Present'].join(' - ')
                        : ed.date}
                    </p>
                  )}
                  {(ed.state || ed.location) && (
                    <p style={{ color: theme.muted }}>{ed.state || ed.location}</p>
                  )}
                </div>
              ))}
            </div>
          </SidebarSection>
        )}

        {certifications.length > 0 && (
          <SidebarSection title="Other" theme={theme}>
            <ul className="list-disc space-y-1 pl-4" style={{ color: theme.text }}>
              {certifications.map((c) => (
                <li key={c.id}>{c.name}</li>
              ))}
            </ul>
          </SidebarSection>
        )}

        {languages.length > 0 && (
          <SidebarSection title="Languages" theme={theme}>
            <p style={{ color: theme.text }}>
              {languages
                .map((l) => (l.level ? `${l.name} (${l.level})` : l.name))
                .join(', ')}
            </p>
          </SidebarSection>
        )}
      </aside>
    </main>
  )
}

function SidebarSection({
  title,
  children,
  theme: sectionTheme,
}: {
  title: string
  children: ReactNode
  theme: ResumeTheme
}) {
  return (
    <section>
      <h2
        className="text-sm font-bold tracking-wide uppercase"
        style={{ color: sectionTheme.accent }}
      >
        {title}
      </h2>
      <div className="mt-2">{children}</div>
    </section>
  )
}
