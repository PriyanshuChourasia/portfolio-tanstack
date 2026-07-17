import type { ReactNode } from 'react'
import { DEFAULT_SECTION_ORDER, type SectionId } from '../types'
import type { ResumeTemplateProps, ResumeTheme } from './types'

const ASIDE_SECTIONS: Array<SectionId> = ['skills', 'languages', 'certifications']
const MAIN_SECTIONS: Array<SectionId> = ['summary', 'experience', 'projects', 'education']

/** Approximate perceived luminance of a hex color (0 = dark, 255 = light). */
function luminance(hex: string): number {
  const c = hex.replace('#', '')
  const r = Number.parseInt(c.slice(0, 2), 16)
  const g = Number.parseInt(c.slice(2, 4), 16)
  const b = Number.parseInt(c.slice(4, 6), 16)
  return 0.299 * r + 0.587 * g + 0.114 * b
}

export function PremiumTemplate({ data, theme = data.theme }: ResumeTemplateProps) {
  const ACCENT = theme.accent
  const SIDEBAR_BG = theme.sidebar ?? '#0f172a'
  const isSidebarDark = luminance(SIDEBAR_BG) < 140
  const SIDEBAR_HEADING = isSidebarDark ? '#ffffff' : theme.primary
  const SIDEBAR_TEXT = isSidebarDark ? '#e2e8f0' : theme.text
  const SIDEBAR_MUTED = isSidebarDark ? '#94a3b8' : theme.muted
  const SIDEBAR_ACCENT = ACCENT
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

  /* ── Flatten skills into category groups ── */
  const skillGroups = skills.filter((s) => s.label && s.value.trim())

  /* ── Contact items for sidebar ── */
  const contactItems: Array<{ icon: string; label: string; value: string }> = []
  if (personalInfo.phone)
    contactItems.push({ icon: '☎', label: 'Phone', value: personalInfo.phone })
  if (personalInfo.email)
    contactItems.push({
      icon: '✉',
      label: 'Email',
      value: personalInfo.email,
    })
  if (personalInfo.location)
    contactItems.push({
      icon: '⌂',
      label: 'Location',
      value: personalInfo.location,
    })
  if (personalInfo.linkedin)
    contactItems.push({
      icon: '↗',
      label: 'LinkedIn',
      value: personalInfo.linkedin,
    })
  if (personalInfo.website)
    contactItems.push({
      icon: '↗',
      label: 'Website',
      value: personalInfo.website,
    })

  /* ── Language proficiency dots (5‑level) ── */
  const PROFICIENCY_LEVELS: Record<string, number> = {
    native: 5,
    fluent: 5,
    advanced: 4,
    intermediate: 3,
    basic: 2,
    beginner: 1,
  }

  const toDotCount = (level: string): number => {
    const key = level.toLowerCase().trim()
    return PROFICIENCY_LEVELS[key] ?? 3
  }

  const order = data.sectionOrder?.length ? data.sectionOrder : DEFAULT_SECTION_ORDER
  const orderedAside = order.filter((id) => ASIDE_SECTIONS.includes(id))
  const orderedMain = order.filter((id) => MAIN_SECTIONS.includes(id))

  const sectionRenderers: Partial<Record<SectionId, ReactNode>> = {
    skills: skillGroups.length > 0 && (
      <SidebarSection title="Skills" theme={theme} headingColor={SIDEBAR_HEADING}>
        <div className="flex flex-col gap-4">
          {skillGroups.map((group) => (
            <div key={group.id}>
              <p
                className="mb-1.5 text-[11px] font-bold tracking-wide uppercase"
                style={{ color: SIDEBAR_HEADING }}
              >
                {group.label}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {group.value
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map((skill, i) => (
                    <span
                      key={i}
                      className="inline-block rounded-full px-2.5 py-1 text-[10.5px] leading-tight"
                      style={{
                        backgroundColor: isSidebarDark
                          ? 'rgba(255,255,255,0.08)'
                          : 'rgba(0,0,0,0.06)',
                        color: SIDEBAR_TEXT,
                      }}
                    >
                      {skill}
                    </span>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </SidebarSection>
    ),

    languages: languages.length > 0 && (
      <SidebarSection title="Languages" theme={theme} headingColor={SIDEBAR_HEADING}>
        <div className="flex flex-col gap-3">
          {languages.map((lang) => (
            <div key={lang.id}>
              <div
                className="mb-1 flex items-baseline justify-between text-[12px]"
                style={{ color: SIDEBAR_TEXT }}
              >
                <span className="font-bold" style={{ color: SIDEBAR_HEADING }}>
                  {lang.name}
                </span>
                {lang.level && (
                  <span className="text-[10.5px]" style={{ color: SIDEBAR_MUTED }}>
                    {lang.level}
                  </span>
                )}
              </div>
              {lang.level && (
                <div className="flex gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      className="inline-block h-[9px] w-[9px] rounded-full"
                      style={{
                        backgroundColor:
                          i < toDotCount(lang.level)
                            ? SIDEBAR_ACCENT
                            : isSidebarDark
                              ? 'rgba(255,255,255,0.15)'
                              : 'rgba(0,0,0,0.12)',
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </SidebarSection>
    ),

    certifications: certifications.length > 0 && (
      <SidebarSection title="Certifications" theme={theme} headingColor={SIDEBAR_HEADING}>
        <ul className="flex flex-col gap-2.5" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {certifications.map((cert) => (
            <li key={cert.id} className="text-[11.5px] leading-snug" style={{ color: SIDEBAR_TEXT }}>
              <span
                className="mb-0.5 block text-[9.5px] font-semibold tracking-[0.06em] uppercase"
                style={{ color: SIDEBAR_MUTED }}
              >
                ✓ Certificate
              </span>
              {cert.name}
            </li>
          ))}
        </ul>
      </SidebarSection>
    ),

    summary: summary && (
      <PremiumSection title="Professional Summary" theme={theme}>
        <p className="text-[12px] leading-relaxed" style={{ color: theme.text }}>
          {summary}
        </p>
      </PremiumSection>
    ),

    experience: experience.length > 0 && (
      <PremiumSection title="Experience" theme={theme}>
        <div className="flex flex-col gap-5">
          {experience.map((exp) => (
            <div key={exp.id} className="break-inside-avoid">
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-1.5">
                <span
                  className="text-[15px] font-semibold"
                  style={{ color: theme.primary }}
                >
                  {exp.role}
                </span>
                <span
                  className="whitespace-nowrap text-[10.5px]"
                  style={{ color: theme.muted }}
                >
                  {[exp.startDate, exp.endDate].filter(Boolean).join(' – ')}
                </span>
              </div>
              <p className="text-[13px] font-medium" style={{ color: ACCENT }}>
                {[exp.company, exp.location].filter(Boolean).join(' • ')}
              </p>
              {exp.bullets && (
                <ul
                  className="mt-2 flex flex-col gap-1.5 pl-4 text-[12px] leading-relaxed"
                  style={{ color: theme.text }}
                >
                  {exp.bullets
                    .split('\n')
                    .filter(Boolean)
                    .map((line, i) => (
                      <li key={i}>
                        {line}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </PremiumSection>
    ),

    projects: projects.length > 0 && (
      <PremiumSection title="Projects" theme={theme}>
        <div className="flex flex-col gap-4">
          {projects.map((proj) => (
            <div key={proj.id} className="break-inside-avoid">
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-1.5">
                <span
                  className="text-[15px] font-semibold"
                  style={{ color: theme.primary }}
                >
                  {proj.name}
                </span>
                <span
                  className="whitespace-nowrap text-[10.5px]"
                  style={{ color: theme.muted }}
                >
                  {proj.startDate
                    ? [proj.startDate, proj.endDate || 'Present'].join(' – ')
                    : ''}
                </span>
              </div>
              {proj.domain && (
                <p
                  className="text-[11.5px] font-medium"
                  style={{ color: theme.muted }}
                >
                  {proj.domain}
                </p>
              )}
              {proj.stack && (
                <p className="text-[11.5px] font-medium italic" style={{ color: ACCENT }}>
                  {proj.stack}
                </p>
              )}
              {proj.bullets && (
                <ul
                  className="mt-1.5 flex flex-col gap-1.5 pl-4 text-[12px] leading-relaxed"
                  style={{ color: theme.text }}
                >
                  {proj.bullets
                    .split('\n')
                    .filter(Boolean)
                    .map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </PremiumSection>
    ),

    education: education.length > 0 && (
      <PremiumSection title="Education" theme={theme}>
        <div className="flex flex-col gap-4">
          {education.map((ed) => (
            <div key={ed.id}>
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-1.5">
                <span
                  className="text-[15px] font-semibold"
                  style={{ color: theme.primary }}
                >
                  {ed.degree}
                  {ed.fieldOfStudy && <span className="font-normal"> — {ed.fieldOfStudy}</span>}
                </span>
                <span
                  className="whitespace-nowrap text-[10.5px]"
                  style={{ color: theme.muted }}
                >
                  {ed.startDate
                    ? [ed.startDate, ed.endDate || 'Present'].join(' – ')
                    : ed.date}
                </span>
              </div>
              <p className="text-[13px]" style={{ color: theme.muted }}>
                {[ed.institution, ed.state || ed.location].filter(Boolean).join(', ')}
              </p>
            </div>
          ))}
        </div>
      </PremiumSection>
    ),
  }

  return (
    <main
      className="mx-auto max-w-[900px] font-sans shadow-sm print:shadow-none"
      style={{ backgroundColor: theme.background }}
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: '280px 1fr',
          minHeight: 0,
        }}
      >
        {/* ─────────────────────────────── SIDEBAR ─────────────────────────────── */}
        <aside
          style={{
            backgroundColor: SIDEBAR_BG,
            color: SIDEBAR_TEXT,
            padding: '40px 28px',
            printColorAdjust: 'exact',
            WebkitPrintColorAdjust: 'exact',
          }}
        >
          {/* Photo */}
          {personalInfo.photoUrl && (
            <div className="mb-6 flex justify-center">
              <img
                src={personalInfo.photoUrl}
                alt={personalInfo.fullName}
                className="h-32 w-32 rounded object-cover"
                style={{
                  border: `3px solid ${isSidebarDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'}`,
                  boxShadow: `0 4px 16px ${isSidebarDark ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.1)'}`,
                }}
              />
            </div>
          )}

          {/* Name in sidebar (mobile fallback; main column has large name) */}
          <h1
            className="mb-1 text-center text-[22px] font-bold leading-tight tracking-tight"
            style={{ color: SIDEBAR_HEADING }}
          >
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {personalInfo.title && (
            <p
              className="mb-6 text-center text-[12.5px] font-semibold"
              style={{ color: SIDEBAR_ACCENT }}
            >
              {personalInfo.title}
            </p>
          )}

          {/* Contact */}
          {contactItems.length > 0 && (
            <SidebarSection title="Contact" theme={theme} headingColor={SIDEBAR_HEADING}>
              <ul className="flex flex-col gap-3" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {contactItems.map((item, i) => (
                  <li key={i} className="text-[12px] leading-snug" style={{ wordBreak: 'break-word' }}>
                    <span
                      className="mb-0.5 block text-[9.5px] font-semibold tracking-[0.06em] uppercase"
                      style={{ color: SIDEBAR_MUTED }}
                    >
                      {item.icon} {item.label}
                    </span>
                    <span style={{ color: SIDEBAR_TEXT }}>{item.value}</span>
                  </li>
                ))}
              </ul>
            </SidebarSection>
          )}

          {orderedAside.map((id) => sectionRenderers[id] && <div key={id} data-section-id={id}>{sectionRenderers[id]}</div>)}
        </aside>

        {/* ─────────────────────────── MAIN COLUMN ──────────────────────────── */}
        <div
          style={{
            padding: '44px 42px 48px',
            backgroundColor: theme.background,
          }}
        >
          {/* Name — largest element on the page (Level 1) */}
          <h1
            className="text-[44px] font-bold leading-none tracking-tight"
            style={{ color: theme.primary }}
          >
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {personalInfo.title && (
            <p
              className="mt-2 text-[17px] font-medium"
              style={{ color: ACCENT }}
            >
              {personalInfo.title}
            </p>
          )}

          {orderedMain.map((id) => sectionRenderers[id] && <div key={id} data-section-id={id}>{sectionRenderers[id]}</div>)}
        </div>
      </div>
    </main>
  )
}

/* ──────────────────────────────────────────────────────────────
 * Shared section component (main column)
 * ────────────────────────────────────────────────────────────── */
function PremiumSection({
  title,
  children,
  theme: sectionTheme,
}: {
  title: string
  children: ReactNode
  theme: ResumeTheme
}) {
  return (
    <section className="mt-7">
      <h2
        className="text-[15px] font-semibold tracking-wide uppercase"
        style={{ color: sectionTheme.primary }}
      >
        {title}
      </h2>
      <div
        className="mb-0 mt-1 h-px w-10"
        style={{ backgroundColor: sectionTheme.accent }}
      />
      <div className="mt-3.5">{children}</div>
    </section>
  )
}

/* ──────────────────────────────────────────────────────────────
 * Shared sidebar section component
 * ────────────────────────────────────────────────────────────── */
function SidebarSection({
  title,
  children,
  theme: sectionTheme,
  headingColor,
}: {
  title: string
  children: ReactNode
  theme: ResumeTheme
  headingColor: string
}) {
  return (
    <section className="mb-6 last:mb-0">
      <h2
        className="mb-0.5 text-[12px] font-bold tracking-[0.06em] uppercase"
        style={{ color: headingColor }}
      >
        {title}
      </h2>
      <div
        className="mb-3 mt-0.5 h-px w-7"
        style={{ backgroundColor: sectionTheme.accent }}
      />
      {children}
    </section>
  )
}
