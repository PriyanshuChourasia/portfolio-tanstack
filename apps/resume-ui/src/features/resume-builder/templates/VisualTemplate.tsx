import {
  Award,
  Briefcase,
  Calendar,
  GraduationCap,
  Link2,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { DEFAULT_SECTION_ORDER, type SectionId } from '../types'
import type { ResumeTemplateProps, ResumeTheme } from './types'

export function VisualTemplate({ data, theme = data.theme }: ResumeTemplateProps) {
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

  const contactItems: Array<{ icon: ReactNode; value: string; href?: string }> = []
  if (personalInfo.phone)
    contactItems.push({ icon: <Phone className="size-3.5" />, value: personalInfo.phone })
  if (personalInfo.email)
    contactItems.push({
      icon: <Mail className="size-3.5" />,
      value: personalInfo.email,
      href: `mailto:${personalInfo.email}`,
    })
  if (personalInfo.location)
    contactItems.push({ icon: <MapPin className="size-3.5" />, value: personalInfo.location })
  if (personalInfo.linkedin)
    contactItems.push({
      icon: <Link2 className="size-3.5" />,
      value: personalInfo.linkedin,
      href: personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : undefined,
    })
  if (personalInfo.website)
    contactItems.push({
      icon: <Link2 className="size-3.5" />,
      value: personalInfo.website,
      href: personalInfo.website.startsWith('http') ? personalInfo.website : undefined,
    })

  /* ── Gradient from primary toward a darker shade ── */
  const heroGradient = `linear-gradient(160deg, ${theme.primary} 0%, ${theme.primary}dd 60%, ${theme.sidebar ?? theme.primary} 100%)`

  const levelMap: Record<string, number> = {
    native: 5,
    fluent: 5,
    advanced: 4,
    intermediate: 3,
    basic: 2,
    beginner: 1,
  }

  const order = data.sectionOrder?.length ? data.sectionOrder : DEFAULT_SECTION_ORDER

  const sectionRenderers: Partial<Record<SectionId, ReactNode>> = {
    experience: experience.length > 0 && (
      <VisualSection title="Experience" icon={<Briefcase className="size-3.5" />} theme={theme}>
        <div className="space-y-5">
          {experience.map((exp) => (
            <div key={exp.id} className="break-inside-avoid">
              <div className="mb-0.5 flex items-baseline justify-between gap-3">
                <span
                  className="text-[14px] font-bold"
                  style={{ color: theme.primary }}
                >
                  {exp.role}
                </span>
                <span
                  className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-xs"
                  style={{ color: theme.muted }}
                >
                  <Calendar className="size-3" />
                  {[exp.startDate, exp.endDate].filter(Boolean).join(' – ') || 'Date'}
                </span>
              </div>
              <p className="text-[12.5px] font-semibold" style={{ color: theme.accent }}>
                {[exp.company, exp.location].filter(Boolean).join(' · ')}
              </p>
              {exp.bullets && (
                <ul
                  className="mt-1.5 space-y-1 pl-4 text-[12.5px] leading-relaxed"
                  style={{ color: theme.text }}
                >
                  {exp.bullets
                    .split('\n')
                    .filter(Boolean)
                    .map((line, i) => (
                      <li
                        key={i}
                        className="pl-2"
                        style={{ color: theme.text }}
                      >
                        <span
                          className="mr-2 inline-block rounded-full"
                          style={{
                            width: 5,
                            height: 5,
                            backgroundColor: theme.accent,
                          }}
                        />
                        {line}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </VisualSection>
    ),

    education: education.length > 0 && (
      <VisualSection title="Education" icon={<GraduationCap className="size-3.5" />} theme={theme}>
        <div className="space-y-4">
          {education.map((ed) => (
            <div key={ed.id}>
              <div className="mb-0.5 flex items-baseline justify-between gap-3">
                <span
                  className="text-[14px] font-bold"
                  style={{ color: theme.primary }}
                >
                  {ed.degree}
                  {ed.fieldOfStudy && (
                    <span className="font-normal"> — {ed.fieldOfStudy}</span>
                  )}
                </span>
                <span
                  className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-xs"
                  style={{ color: theme.muted }}
                >
                  <Calendar className="size-3" />
                  {ed.startDate
                    ? [ed.startDate, ed.endDate || 'Present'].join(' – ')
                    : ed.date}
                </span>
              </div>
              <p className="text-[12.5px]" style={{ color: theme.muted }}>
                {[ed.institution, ed.state || ed.location].filter(Boolean).join(', ')}
              </p>
            </div>
          ))}
        </div>
      </VisualSection>
    ),

    skills: flatSkills.length > 0 && (
      <VisualSection title="Skills" icon={<Award className="size-3.5" />} theme={theme}>
        <div className="flex flex-wrap gap-2">
          {flatSkills.map((skill, i) => (
            <span
              key={i}
              className="inline-block rounded-full px-3.5 py-1.5 text-[11.5px] font-medium leading-tight"
              style={{
                background: `linear-gradient(135deg, ${theme.accent}18, ${theme.accent}08)`,
                color: theme.primary,
                border: `1px solid ${theme.accent}22`,
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </VisualSection>
    ),

    projects: projects.length > 0 && (
      <VisualSection title="Projects" icon={<Briefcase className="size-3.5" />} theme={theme}>
        <div className="space-y-4">
          {projects.map((proj) => (
            <div key={proj.id} className="break-inside-avoid">
              <div className="mb-0.5 flex items-baseline justify-between gap-3">
                <span
                  className="text-[14px] font-bold"
                  style={{ color: theme.primary }}
                >
                  {proj.name}
                </span>
                <span
                  className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-xs"
                  style={{ color: theme.muted }}
                >
                  <Calendar className="size-3" />
                  {proj.startDate
                    ? [proj.startDate, proj.endDate || 'Present'].join(' – ')
                    : ''}
                </span>
              </div>
              {proj.domain && (
                <p className="text-[12px] font-medium" style={{ color: theme.muted }}>
                  {proj.domain}
                </p>
              )}
              {proj.stack && (
                <p className="text-[12px] font-medium italic" style={{ color: theme.accent }}>
                  {proj.stack}
                </p>
              )}
              {proj.bullets && (
                <ul
                  className="mt-1 space-y-0.5 pl-4 text-[12.5px] leading-relaxed"
                  style={{ color: theme.text }}
                >
                  {proj.bullets
                    .split('\n')
                    .filter(Boolean)
                    .map((line, i) => (
                      <li key={i} className="pl-2">
                        <span
                          className="mr-2 inline-block rounded-full"
                          style={{
                            width: 5,
                            height: 5,
                            backgroundColor: theme.accent,
                          }}
                        />
                        {line}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </VisualSection>
    ),

    certifications: certifications.length > 0 && (
      <VisualSection title="Certifications" icon={<Award className="size-3.5" />} theme={theme}>
        <div className="grid gap-2 sm:grid-cols-2">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="rounded-xl border px-4 py-3 text-[12.5px]"
              style={{
                borderColor: theme.accent + '18',
                backgroundColor: theme.accent + '06',
                color: theme.text,
              }}
            >
              <p className="font-medium">{cert.name}</p>
              {cert.url && (
                <a
                  href={cert.url}
                  className="mt-1 inline-flex items-center gap-1 text-[11.5px] font-medium underline underline-offset-2"
                  style={{ color: theme.accent }}
                >
                  <Link2 className="size-3" />
                  View credential
                </a>
              )}
            </div>
          ))}
        </div>
      </VisualSection>
    ),

    languages: languages.length > 0 && (
      <VisualSection title="Languages" icon={<Award className="size-3.5" />} theme={theme}>
        <div className="space-y-3 sm:max-w-sm">
          {languages.map((lang) => (
            <div key={lang.id} className="flex items-center justify-between">
              <span className="text-[13px] font-medium" style={{ color: theme.text }}>
                {lang.name}
              </span>
              {lang.level && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px]" style={{ color: theme.muted }}>
                    {lang.level}
                  </span>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }, (_, i) => {
                      const filled = i < (levelMap[lang.level.toLowerCase().trim()] ?? 3)
                      return (
                        <span
                          key={i}
                          className="inline-block rounded-full"
                          style={{
                            width: filled ? 8 : 6,
                            height: filled ? 8 : 6,
                            backgroundColor: filled
                              ? theme.accent
                              : theme.accent + '20',
                          }}
                        />
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </VisualSection>
    ),
  }

  return (
    <main
      className="mx-auto max-w-[880px] bg-white font-sans shadow-sm print:shadow-none"
      style={{ backgroundColor: theme.background }}
    >
      {/* ── Hero ── */}
      <header
        className="relative overflow-hidden px-10 pb-10 pt-12 text-center"
        style={{
          background: heroGradient,
          color: '#ffffff',
          printColorAdjust: 'exact',
          WebkitPrintColorAdjust: 'exact',
        }}
      >
        {/* Decorative circles */}
        <span
          className="pointer-events-none absolute -right-16 -top-16 block rounded-full opacity-10"
          style={{
            width: 280,
            height: 280,
            backgroundColor: '#ffffff',
          }}
        />
        <span
          className="pointer-events-none absolute -bottom-12 -left-12 block rounded-full opacity-[0.07]"
          style={{
            width: 200,
            height: 200,
            backgroundColor: '#ffffff',
          }}
        />

        {/* Photo */}
        {personalInfo.photoUrl ? (
          <div className="relative mb-6 inline-block">
            <div
              className="absolute -inset-2 rounded-full"
              style={{
                background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}88, transparent 70%)`,
              }}
            />
            <img
              src={personalInfo.photoUrl}
              alt={personalInfo.fullName || 'Profile photo'}
              className="relative h-40 w-40 rounded-full border-[3px] object-cover"
              style={{
                borderColor: '#ffffff',
                boxShadow: `0 8px 32px ${theme.primary}66`,
              }}
            />
          </div>
        ) : (
          <div className="relative mb-6 inline-block">
            <div
              className="absolute -inset-2 rounded-full"
              style={{
                background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}88, transparent 70%)`,
              }}
            />
            <div
              className="relative flex h-40 w-40 items-center justify-center rounded-full border-[3px]"
              style={{
                borderColor: '#ffffff',
                backgroundColor: 'rgba(255,255,255,0.12)',
                boxShadow: `0 8px 32px ${theme.primary}66`,
              }}
            >
              <span className="select-none text-6xl font-bold tracking-tight opacity-60">
                {personalInfo.fullName
                  ? personalInfo.fullName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()
                  : '?'}
              </span>
            </div>
          </div>
        )}

        {/* Name */}
        <h1
          className="relative text-[34px] font-bold leading-tight tracking-tight"
          style={{ color: '#ffffff' }}
        >
          {personalInfo.fullName || 'Your Name'}
        </h1>

        {/* Title */}
        {personalInfo.title && (
          <p
            className="relative mt-1.5 text-sm font-semibold tracking-widest uppercase"
            style={{ color: theme.accent }}
          >
            {personalInfo.title}
          </p>
        )}

        {/* Accent divider */}
        <div
          className="relative mx-auto mt-4 h-[3px] w-16 rounded-full"
          style={{ backgroundColor: theme.accent }}
        />

        {/* Contact strip — pill chips */}
        {contactItems.length > 0 && (
          <div className="relative mt-5 flex flex-wrap justify-center gap-2">
            {contactItems.map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] leading-tight backdrop-blur-sm"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.9)',
                }}
              >
                <span style={{ color: theme.accent }}>{item.icon}</span>
                {item.href ? (
                  <a
                    href={item.href}
                    className="underline underline-offset-2 decoration-white/40 hover:decoration-white/80"
                  >
                    {item.value}
                  </a>
                ) : (
                  <span>{item.value}</span>
                )}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* ── Content ── */}
      <div className="px-10 pb-12 pt-8">
        {/* Summary */}
        {summary && (
          <div className="relative mx-auto mb-8 max-w-2xl rounded-xl border px-6 py-5 text-center"
            style={{
              borderColor: theme.accent + '18',
              backgroundColor: theme.accent + '06',
            }}
          >
            <p
              className="text-[13px] leading-relaxed"
              style={{ color: theme.text }}
            >
              {summary}
            </p>
          </div>
        )}

        {order.map((id) => sectionRenderers[id] && <div key={id} data-section-id={id}>{sectionRenderers[id]}</div>)}
      </div>
    </main>
  )
}

/* ── Section component ── */
function VisualSection({
  title,
  icon,
  children,
  theme: sectionTheme,
}: {
  title: string
  icon: ReactNode
  children: ReactNode
  theme: ResumeTheme
}) {
  return (
    <section className="mt-7 first:mt-0">
      <div className="mb-4 flex items-center gap-3">
        {/* Icon badge — rounded square with slight bottom-right emphasis */}
        <span
          className="flex size-6 shrink-0 items-center justify-center text-white"
          style={{
            backgroundColor: sectionTheme.accent,
            borderRadius: 5,
            borderBottomRightRadius: 8,
          }}
        >
          {icon}
        </span>
        <h2
          className="text-[12px] font-bold tracking-[0.08em] uppercase"
          style={{ color: sectionTheme.primary }}
        >
          {title}
        </h2>
        <div
          className="ml-auto h-px flex-1"
          style={{
            background: `linear-gradient(to right, ${sectionTheme.accent}50, ${sectionTheme.accent}10, transparent)`,
          }}
        />
      </div>
      {children}
    </section>
  )
}
