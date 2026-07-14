import '../../../classic-resume.css'
import type { ResumeTemplateProps } from './types'

export function ClassicTemplate({ data, theme = data.theme }: ResumeTemplateProps) {
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

  const contactParts = [
    personalInfo.phone,
    personalInfo.email,
    personalInfo.linkedin,
    personalInfo.website,
    personalInfo.location,
  ].filter(Boolean)

  return (
    <main
      className="ats-page"
      style={{
        color: theme.text,
        backgroundColor: theme.background,
      }}
    >
      <header className="ats-header">
        <h1 className="ats-name">{personalInfo.fullName || 'Your Name'}</h1>
        {personalInfo.title && (
          <p
            className="ats-contact"
            style={{ fontStyle: 'italic', marginBottom: 6 }}
          >
            {personalInfo.title}
          </p>
        )}
        {contactParts.length > 0 && (
          <p className="ats-contact">
            {contactParts.map((part, i) => (
              <span key={i}>
                {part}
                {i < contactParts.length - 1 && <span className="sep">|</span>}
              </span>
            ))}
          </p>
        )}
      </header>

      {summary && (
        <section className="ats-section">
          <h2 className="ats-section-title">Summary</h2>
          <p style={{ margin: 0 }}>{summary}</p>
        </section>
      )}

      {skills.length > 0 && (
        <section className="ats-section">
          <h2 className="ats-section-title">Technical Skills</h2>
          <div className="ats-skills">
            {skills.map((s) => (
              <p className="ats-skill-line" key={s.id}>
                <span className="ats-skill-label">{s.label}: </span>
                {s.value}
              </p>
            ))}
          </div>
        </section>
      )}

      {experience.length > 0 && (
        <section className="ats-section">
          <h2 className="ats-section-title">Experience</h2>
          {experience.map((exp) => (
            <div className="ats-entry" key={exp.id}>
              <div className="ats-row">
                <span className="ats-row-title">{exp.role}</span>
                <span className="ats-row-date">
                  {[exp.startDate, exp.endDate].filter(Boolean).join(' – ')}
                </span>
              </div>
              <div className="ats-row">
                <span className="ats-row-sub">{exp.company}</span>
                <span className="ats-row-sub">{exp.location}</span>
              </div>
              {exp.bullets && (
                <ul className="ats-bullets">
                  {exp.bullets
                    .split('\n')
                    .filter(Boolean)
                    .map((line, i) => <li key={i}>{line}</li>)}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {projects.length > 0 && (
        <section className="ats-section">
          <h2 className="ats-section-title">Projects</h2>
          {projects.map((p) => (
            <div className="ats-entry" key={p.id}>
              <div className="ats-row">
                <span className="ats-row-title">
                  <span className="ats-project-title">{p.name}</span>
                  {p.stack && (
                    <>
                      {' '}
                      | <span className="ats-project-stack">{p.stack}</span>
                    </>
                  )}
                </span>
                <span className="ats-row-date">
                  {p.startDate
                    ? [p.startDate, p.endDate || 'Present'].join(' – ')
                    : ''}
                </span>
              </div>
              {p.domain && (
                <p className="ats-row-sub" style={{ marginBottom: 4 }}>{p.domain}</p>
              )}
              {p.bullets && (
                <ul className="ats-bullets">
                  {p.bullets
                    .split('\n')
                    .filter(Boolean)
                    .map((line, i) => <li key={i}>{line}</li>)}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section className="ats-section">
          <h2 className="ats-section-title">Education</h2>
          {education.map((ed) => (
            <div className="ats-entry" key={ed.id}>
              <div className="ats-row">
                <span className="ats-row-title">
                  {ed.degree}
                  {ed.fieldOfStudy && <span> — {ed.fieldOfStudy}</span>}
                </span>
                <span className="ats-row-date">
                  {ed.startDate
                    ? [ed.startDate, ed.endDate || 'Present'].join(' – ')
                    : ed.date}
                </span>
              </div>
              <div className="ats-row">
                <span className="ats-row-sub">{ed.institution}</span>
                <span className="ats-row-sub">{ed.state || ed.location}</span>
              </div>
            </div>
          ))}
        </section>
      )}

      {certifications.length > 0 && (
        <section className="ats-section">
          <h2 className="ats-section-title">Certifications</h2>
          {certifications.map((c) => (
            <p style={{ margin: '0 0 2px' }} key={c.id}>
              {c.name}
            </p>
          ))}
        </section>
      )}

      {languages.length > 0 && (
        <section className="ats-section">
          <h2 className="ats-section-title">Languages</h2>
          <p style={{ margin: 0 }}>
            {languages.map((l) => `${l.name} – ${l.level}`).join(' · ')}
          </p>
        </section>
      )}
    </main>
  )
}
