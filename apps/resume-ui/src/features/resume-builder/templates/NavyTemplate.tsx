import { Calendar, Link2, Mail, MapPin, Phone } from 'lucide-react'
import type { ReactNode } from 'react'
import type { ResumeTemplateProps, ResumeTheme } from './types'

export function NavyTemplate({ data, theme = data.theme }: ResumeTemplateProps) {
  const ACCENT = theme.accent
  const {
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
  } = data

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
  if (personalInfo.linkedin)
    contactItems.push({ icon: <Link2 className="size-3.5" />, value: personalInfo.linkedin })
  if (personalInfo.location)
    contactItems.push({ icon: <MapPin className="size-3.5" />, value: personalInfo.location })

  return (
    <main
      className="mx-auto max-w-[900px] bg-white px-12 py-10 font-sans text-[13px] leading-relaxed shadow-sm print:p-6 print:shadow-none"
      style={{ color: theme.text, backgroundColor: theme.background }}
    >
      <header>
        <h1
          className="text-4xl font-bold tracking-tight uppercase"
          style={{ color: theme.primary }}
        >
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.title && (
          <p className="mt-1 text-base font-medium" style={{ color: ACCENT }}>
            {personalInfo.title}
          </p>
        )}
        {contactItems.length > 0 && (
          <div
            className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 border-b pb-3 text-xs"
            style={{ color: theme.muted, borderColor: theme.muted + '40' }}
          >
            {contactItems.map((item, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <span style={{ color: ACCENT }}>{item.icon}</span>
                {item.href ? (
                  <a className="underline" href={item.href}>
                    {item.value}
                  </a>
                ) : (
                  item.value
                )}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="mt-6 grid grid-cols-[260px_1fr] gap-10">
        <aside className="space-y-6">
          {flatSkills.length > 0 && (
            <NavySection title="Skills" theme={theme}>
              <div className="flex flex-wrap gap-2">
                {flatSkills.map((skill, i) => (
                  <span
                    key={i}
                    className="rounded border px-2.5 py-1 text-xs"
                    style={{ color: theme.text, borderColor: theme.muted + '40', backgroundColor: theme.accent + '12' }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </NavySection>
          )}

          {education.length > 0 && (
            <NavySection title="Education" theme={theme}>
              <div className="space-y-3">
                {education.map((ed) => (
                  <div key={ed.id}>
                    <p
                      className="font-semibold"
                      style={{ color: theme.primary }}
                    >
                      {[ed.degree, ed.fieldOfStudy].filter(Boolean).join(' in ')}
                    </p>
                    {ed.institution && (
                      <p style={{ color: theme.accent }}>{ed.institution}</p>
                    )}
                    <p
                      className="mt-0.5 flex flex-wrap items-center gap-x-3 text-xs"
                      style={{ color: theme.muted }}
                    >
                      {(ed.startDate || ed.date) && (
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {ed.startDate
                            ? [ed.startDate, ed.endDate || 'Present'].join(' - ')
                            : ed.date}
                        </span>
                      )}
                      {(ed.state || ed.location) && (
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3" />
                          {ed.state || ed.location}
                        </span>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </NavySection>
          )}

          {summary && (
            <NavySection title="Summary" theme={theme}>
              <p style={{ color: theme.text }}>{summary}</p>
            </NavySection>
          )}

          {certifications.length > 0 && (
            <NavySection title="Training / Courses" theme={theme}>
              <ul className="space-y-1.5">
                {certifications.map((c) => (
                  <li key={c.id} className="font-medium" style={{ color: theme.accent }}>
                    {c.name}
                  </li>
                ))}
              </ul>
            </NavySection>
          )}
        </aside>

        <div>
          {experience.length > 0 && (
            <NavySection title="Experience" theme={theme}>
              <div className="space-y-5">
                {experience.map((exp) => (
                  <div key={exp.id} className="break-inside-avoid">
                    <p
                      className="font-semibold"
                      style={{ color: theme.primary }}
                    >
                      {exp.role}
                    </p>
                    <div className="mt-0.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                      {exp.company && (
                        <span className="font-medium" style={{ color: theme.accent }}>
                          {exp.company}
                        </span>
                      )}
                      <span
                        className="flex flex-wrap items-center gap-x-3 text-xs"
                        style={{ color: theme.muted }}
                      >
                        {(exp.startDate || exp.endDate) && (
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3" />
                            {[exp.startDate, exp.endDate].filter(Boolean).join(' - ')}
                          </span>
                        )}
                        {exp.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3" />
                            {exp.location}
                          </span>
                        )}
                      </span>
                    </div>
                    {exp.bullets && (
                      <ul
                        className="mt-2 list-disc space-y-1 pl-5"
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
            </NavySection>
          )}

          {projects.length > 0 && (
            <NavySection title="Projects" theme={theme}>
              <div className="space-y-4">
                {projects.map((p) => (
                  <div key={p.id} className="break-inside-avoid">
                    <div className="flex items-baseline justify-between gap-2">
                      <p
                        className="font-semibold"
                        style={{ color: theme.accent }}
                      >
                        {p.name}
                      </p>
                      <span
                        className="shrink-0 text-xs"
                        style={{ color: theme.muted }}
                      >
                        {p.startDate
                          ? [p.startDate, p.endDate || 'Present'].join(' - ')
                          : ''}
                      </span>
                    </div>
                    {p.domain && (
                      <p
                        className="text-xs"
                        style={{ color: theme.accent }}
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
            </NavySection>
          )}
        </div>
      </div>
    </main>
  )
}

function NavySection({ title, children, theme: sectionTheme }: { title: string; children: ReactNode; theme: ResumeTheme }) {
  return (
    <section>
      <h2
        className="mb-2 border-b pb-1 text-xs font-bold tracking-wide uppercase"
        style={{ color: sectionTheme.muted, borderColor: sectionTheme.muted + '40' }}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}
