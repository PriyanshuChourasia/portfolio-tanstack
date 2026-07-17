import {
  Award,
  Briefcase,
  GraduationCap,
  Link2,
  Mail,
  MapPin,
  Phone,
  Rocket,
  User,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { DEFAULT_SECTION_ORDER, type SectionId } from '../types'
import type { ResumeTemplateProps, ResumeTheme } from './types'

const ASIDE_SECTIONS: Array<SectionId> = ['certifications', 'languages']
const MAIN_SECTIONS: Array<SectionId> = ['summary', 'skills', 'experience', 'education']

export function FreshTemplate({ data, theme = data.theme }: ResumeTemplateProps) {
  const PILL_BG = theme.accent + '25'
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

  const contactItems: Array<{
    icon: ReactNode
    value: string
    href?: string
  }> = []
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

  const order = data.sectionOrder?.length ? data.sectionOrder : DEFAULT_SECTION_ORDER
  const orderedAside = order.filter((id) => ASIDE_SECTIONS.includes(id))
  const orderedMain = order.filter((id) => MAIN_SECTIONS.includes(id))

  const sectionRenderers: Partial<Record<SectionId, ReactNode>> = {
    certifications: certifications.length > 0 && (
      <FreshSection icon={<Award className="size-3.5" />} title="Certifications" theme={theme}>
        <ul className="space-y-1.5" style={{ color: theme.text }}>
          {certifications.map((c) => (
            <li key={c.id}>{c.name}</li>
          ))}
        </ul>
      </FreshSection>
    ),

    languages: languages.length > 0 && (
      <FreshSection icon={<User className="size-3.5" />} title="Languages" theme={theme}>
        <p style={{ color: theme.text }}>
          {languages
            .map((l) => (l.level ? `${l.name} (${l.level})` : l.name))
            .join(', ')}
        </p>
      </FreshSection>
    ),

    summary: summary && (
      <FreshSection icon={<User className="size-3.5" />} title="Summary" theme={theme}>
        <p style={{ color: theme.text }}>{summary}</p>
      </FreshSection>
    ),

    skills: flatSkills.length > 0 && (
      <FreshSection icon={<Rocket className="size-3.5" />} title="Skills" theme={theme}>
        <p style={{ color: theme.text }}>{flatSkills.join(' · ')}</p>
      </FreshSection>
    ),

    experience: experience.length > 0 && (
      <FreshSection icon={<Briefcase className="size-3.5" />} title="Experience" theme={theme}>
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
                  className="shrink-0 text-xs"
                  style={{ color: theme.muted }}
                >
                  {exp.location}
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <span>{exp.role}</span>
                <span
                  className="shrink-0 text-xs"
                  style={{ color: theme.muted }}
                >
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
      </FreshSection>
    ),

    education: education.length > 0 && (
      <FreshSection icon={<GraduationCap className="size-3.5" />} title="Education" theme={theme}>
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
                  className="shrink-0 text-xs"
                  style={{ color: theme.muted }}
                >
                  {ed.startDate
                    ? [ed.startDate, ed.endDate || 'Present'].join(' - ')
                    : ed.date}
                </span>
              </div>
              <p style={{ color: theme.text }}>
                {[ed.degree, ed.fieldOfStudy].filter(Boolean).join(' in ')}
              </p>
              {(ed.state || ed.location) && (
                <p className="text-xs" style={{ color: theme.muted }}>
                  {ed.state || ed.location}
                </p>
              )}
            </div>
          ))}
        </div>
      </FreshSection>
    ),
  }

  return (
    <main
      className="mx-auto grid max-w-[900px] grid-cols-[240px_1fr] gap-10 bg-white px-10 py-12 font-sans text-[13px] leading-relaxed shadow-sm print:p-6 print:shadow-none"
      style={{ color: theme.text, backgroundColor: theme.background }}
    >
      <aside className="space-y-6">
        {contactItems.length > 0 && (
          <FreshSection icon={<Mail className="size-3.5" />} title="Contacts" theme={theme}>
            <div className="space-y-1.5" style={{ color: theme.text }}>
              {contactItems.map((item, i) => (
                <p key={i} className="flex items-center gap-2">
                  <span
                    className="shrink-0"
                    style={{ color: theme.accent }}
                  >
                    {item.icon}
                  </span>
                  {item.href ? (
                    <a className="underline" href={item.href}>
                      {item.value}
                    </a>
                  ) : (
                    <span className="break-words">{item.value}</span>
                  )}
                </p>
              ))}
            </div>
          </FreshSection>
        )}

        {orderedAside.map((id) => sectionRenderers[id] && <div key={id} data-section-id={id}>{sectionRenderers[id]}</div>)}
      </aside>

      <div>
        <h1
          className="text-4xl font-bold tracking-tight uppercase"
          style={{ color: theme.primary }}
        >
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.title && (
          <p
            className="mt-3 inline-block rounded-lg px-4 py-2 text-sm font-bold tracking-wide uppercase"
            style={{ backgroundColor: PILL_BG, color: theme.primary }}
          >
            {personalInfo.title}
          </p>
        )}

        {orderedMain.map((id) => sectionRenderers[id] && <div key={id} data-section-id={id}>{sectionRenderers[id]}</div>)}
      </div>
    </main>
  )
}

function FreshSection({
  icon,
  title,
  children,
  theme: sectionTheme,
}: {
  icon: ReactNode
  title: string
  children: ReactNode
  theme: ResumeTheme
}) {
  return (
    <section className="mt-6 first:mt-0">
      <h2
        className="mb-2 flex items-center gap-2 text-sm font-bold tracking-wide uppercase"
        style={{ color: sectionTheme.primary }}
      >
        <span
          className="flex size-5 shrink-0 items-center justify-center rounded text-white"
          style={{ backgroundColor: sectionTheme.accent }}
        >
          {icon}
        </span>
        {title}
      </h2>
      {children}
    </section>
  )
}
