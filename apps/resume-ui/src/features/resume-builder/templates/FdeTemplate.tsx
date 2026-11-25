import type { ReactNode } from 'react'
import { DEFAULT_SECTION_ORDER, type SectionId } from '../types'
import type { ResumeTemplateProps, ResumeTheme } from './types'

/**
 * AI Engineer / Forward Deployed Engineer template.
 * Single column and ATS-safe, tuned for outcome-driven, AI-heavy resumes:
 * a keyword-dense competencies block up top, metrics bolded inside bullets,
 * and projects framed as "Selected AI Builds".
 */

// Numbers with an optional unit/suffix: 60%, 2,000+, 3x, 450ms, 1.5M, 35s
const METRIC_RE = /(\d[\d,.]*\s?(?:%|\+|x|×|ms|s\b|k\b|K\b|M\b|hrs?\b|hours\b|days\b)?\+?)/g

function withMetrics(text: string, color: string): ReactNode {
  const parts = text.split(METRIC_RE)
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold" style={{ color }}>
        {part}
      </strong>
    ) : (
      part
    ),
  )
}

function lines(value: string) {
  return value
    .split('\n')
    .map((l) => l.replace(/^[\s•\-*]+/, '').trim())
    .filter(Boolean)
}

export function FdeTemplate({ data, theme = data.theme }: ResumeTemplateProps) {
  const {
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    languages,
    awards,
    publications,
  } = data

  const contacts = [
    personalInfo.location,
    personalInfo.phone,
    personalInfo.email,
    personalInfo.linkedin,
    personalInfo.website,
  ].filter(Boolean)

  const visibleProjects = projects.filter((p) => !p.hidden)
  const order = data.sectionOrder?.length ? data.sectionOrder : DEFAULT_SECTION_ORDER

  const sectionRenderers: Partial<Record<SectionId, ReactNode>> = {
    summary: summary && (
      <FdeSection title="Profile" theme={theme}>
        <p className="text-justify">{withMetrics(summary, theme.text)}</p>
      </FdeSection>
    ),

    skills: skills.length > 0 && (
      <FdeSection title="Core Competencies" theme={theme}>
        <dl className="grid grid-cols-[minmax(120px,max-content)_1fr] gap-x-4 gap-y-1">
          {skills
            .filter((s) => s.value.trim())
            .map((s) => (
              <div key={s.id} className="contents">
                <dt className="font-semibold" style={{ color: theme.primary }}>
                  {s.label}
                </dt>
                <dd>{s.value}</dd>
              </div>
            ))}
        </dl>
      </FdeSection>
    ),

    experience: experience.length > 0 && (
      <FdeSection title="Experience & Impact" theme={theme}>
        <div className="space-y-3.5">
          {experience.map((exp) => (
            <article key={exp.id} className="break-inside-avoid">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-bold">
                  {exp.role}
                  {exp.company && (
                    <span className="font-normal" style={{ color: theme.muted }}>
                      {' · '}
                      {exp.company}
                    </span>
                  )}
                </h3>
                <span className="shrink-0 text-[0.92em]" style={{ color: theme.muted }}>
                  {[exp.startDate, exp.endDate].filter(Boolean).join(' – ')}
                </span>
              </div>
              {exp.location && (
                <p className="text-[0.92em]" style={{ color: theme.muted }}>
                  {exp.location}
                </p>
              )}
              {exp.bullets && (
                <ul className="mt-1 space-y-0.5">
                  {lines(exp.bullets).map((line, i) => (
                    <li key={i} className="relative pl-4">
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-[0.55em] size-1.5 rounded-full"
                        style={{ backgroundColor: theme.accent }}
                      />
                      {withMetrics(line, theme.text)}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </FdeSection>
    ),

    projects: visibleProjects.length > 0 && (
      <FdeSection title="Selected AI Builds" theme={theme}>
        <div className="space-y-3">
          {visibleProjects.map((p) => (
            <article key={p.id} className="break-inside-avoid">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-bold">
                  {p.name}
                  {p.domain && (
                    <span className="font-normal" style={{ color: theme.muted }}>
                      {' · '}
                      {p.domain}
                    </span>
                  )}
                </h3>
                {p.link && (
                  <a
                    href={p.link}
                    className="shrink-0 text-[0.92em] underline"
                    style={{ color: theme.primary }}
                  >
                    {p.link.replace(/^https?:\/\//, '')}
                  </a>
                )}
              </div>
              {p.stack && (
                <p className="text-[0.92em] italic" style={{ color: theme.muted }}>
                  Stack: {p.stack}
                </p>
              )}
              {p.bullets && (
                <ul className="mt-1 space-y-0.5">
                  {lines(p.bullets).map((line, i) => (
                    <li key={i} className="relative pl-4">
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-[0.55em] size-1.5 rotate-45"
                        style={{ backgroundColor: theme.accent }}
                      />
                      {withMetrics(line, theme.text)}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </FdeSection>
    ),

    certifications: certifications.length > 0 && (
      <FdeSection title="Certifications" theme={theme}>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-0.5">
          {certifications.map((c) => (
            <li key={c.id}>
              {c.url ? (
                <a href={c.url} className="underline decoration-dotted">
                  {c.name}
                </a>
              ) : (
                c.name
              )}
            </li>
          ))}
        </ul>
      </FdeSection>
    ),

    education: education.length > 0 && (
      <FdeSection title="Education" theme={theme}>
        <div className="space-y-1.5">
          {education.map((ed) => (
            <div key={ed.id} className="flex items-baseline justify-between gap-3">
              <p>
                <span className="font-semibold">
                  {[ed.degree, ed.fieldOfStudy].filter(Boolean).join(' in ')}
                </span>
                {ed.institution && (
                  <span style={{ color: theme.muted }}> · {ed.institution}</span>
                )}
              </p>
              <span className="shrink-0 text-[0.92em]" style={{ color: theme.muted }}>
                {ed.startDate
                  ? [ed.startDate, ed.endDate || 'Present'].join(' – ')
                  : ed.date}
              </span>
            </div>
          ))}
        </div>
      </FdeSection>
    ),

    publications: publications.length > 0 && (
      <FdeSection title="Writing & Talks" theme={theme}>
        <ul className="space-y-0.5">
          {publications.map((p) => (
            <li key={p.id}>
              <span className="font-semibold">{p.title}</span>
              {p.publisher && <span style={{ color: theme.muted }}> · {p.publisher}</span>}
              {p.date && <span style={{ color: theme.muted }}> · {p.date}</span>}
            </li>
          ))}
        </ul>
      </FdeSection>
    ),

    awards: awards.length > 0 && (
      <FdeSection title="Recognition" theme={theme}>
        <ul className="space-y-0.5">
          {awards.map((a) => (
            <li key={a.id}>
              <span className="font-semibold">{a.name}</span>
              {a.issuer && <span style={{ color: theme.muted }}> · {a.issuer}</span>}
              {a.date && <span style={{ color: theme.muted }}> · {a.date}</span>}
            </li>
          ))}
        </ul>
      </FdeSection>
    ),

    languages: languages.length > 0 && (
      <FdeSection title="Languages" theme={theme}>
        <p>
          {languages
            .map((l) => (l.level ? `${l.name} (${l.level})` : l.name))
            .join(' · ')}
        </p>
      </FdeSection>
    ),
  }

  return (
    <main
      className="mx-auto max-w-[850px] bg-white px-12 py-10 font-sans text-[13px] leading-[1.55] shadow-sm print:p-0 print:shadow-none"
      style={{ color: theme.text, backgroundColor: theme.background }}
    >
      <header className="border-b-2 pb-3" style={{ borderColor: theme.primary }}>
        <h1 className="text-[28px] font-bold leading-tight tracking-tight" style={{ color: theme.primary }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.title && (
          <p className="mt-0.5 text-[15px] font-semibold" style={{ color: theme.accent }}>
            {personalInfo.title}
          </p>
        )}
        {contacts.length > 0 && (
          <p className="mt-1.5 flex flex-wrap gap-x-2 text-[0.92em]" style={{ color: theme.muted }}>
            {contacts.map((c, i) => (
              <span key={i}>
                {i > 0 && <span className="mr-2" aria-hidden="true">|</span>}
                {c}
              </span>
            ))}
          </p>
        )}
      </header>

      {order.map(
        (id) =>
          sectionRenderers[id] && (
            <div key={id} data-section-id={id}>
              {sectionRenderers[id]}
            </div>
          ),
      )}
    </main>
  )
}

function FdeSection({
  title,
  children,
  theme,
}: {
  title: string
  children: ReactNode
  theme: ResumeTheme
}) {
  return (
    <section className="mt-4">
      <h2
        className="mb-1.5 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em]"
        style={{ color: theme.primary }}
      >
        <span className="h-3.5 w-1 rounded-sm" style={{ backgroundColor: theme.accent }} />
        {title}
        <span className="h-px flex-1 opacity-35" style={{ backgroundColor: theme.muted }} />
      </h2>
      {children}
    </section>
  )
}
