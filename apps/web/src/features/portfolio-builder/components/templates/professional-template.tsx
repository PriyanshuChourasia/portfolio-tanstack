import type { Portfolio } from '../../types/portfolio'

interface TemplateProps {
  portfolio: Portfolio
  style: React.CSSProperties
}

export function ProfessionalTemplate({ portfolio, style }: TemplateProps) {
  const {
    profile,
    about,
    experiences,
    projects,
    skills,
    education,
    certifications,
    services,
    testimonials,
    publications,
    socialLinks,
    sections,
  } = portfolio
  const enabledIds = new Set(sections.filter((s) => s.enabled).map((s) => s.id))
  const primary = 'var(--portfolio-primary)'
  const muted = 'var(--portfolio-muted)'

  return (
    <div
      style={{
        ...style,
        color: 'var(--portfolio-text)',
        fontFamily: 'var(--portfolio-font)',
        background: 'var(--portfolio-bg)',
        lineHeight: 'var(--portfolio-line-height)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--portfolio-width)',
          margin: '0 auto',
          padding: '0 2rem',
        }}
      >
        {enabledIds.has('profile') && (
          <header
            style={{
              padding: 'var(--portfolio-spacing) 0',
              borderBottom: `2px solid ${primary}`,
            }}
          >
            <h1
              style={{
                fontSize: 'var(--portfolio-heading-size)',
                fontWeight: 'var(--portfolio-heading-weight)',
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              {profile.firstName} {profile.lastName}
            </h1>
            {profile.title && (
              <p
                style={{
                  fontSize: '1.125rem',
                  color: primary,
                  marginTop: '0.5rem',
                  fontWeight: 500,
                }}
              >
                {profile.title}
              </p>
            )}
            <div
              style={{
                display: 'flex',
                gap: '1.5rem',
                marginTop: '1rem',
                flexWrap: 'wrap',
                fontSize: '0.8125rem',
                color: muted,
              }}
            >
              {profile.location && <span>{profile.location}</span>}
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  style={{ color: primary, textDecoration: 'none' }}
                >
                  {profile.email}
                </a>
              )}
              {profile.phone && <span>{profile.phone}</span>}
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: primary, textDecoration: 'none' }}
                >
                  {profile.website}
                </a>
              )}
            </div>
            {socialLinks.length > 0 && (
              <div
                style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}
              >
                {socialLinks.map((l) => (
                  <a
                    key={l.id}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: '0.8125rem',
                      color: primary,
                      textDecoration: 'none',
                    }}
                  >
                    {l.platform.charAt(0).toUpperCase() + l.platform.slice(1)}
                  </a>
                ))}
              </div>
            )}
          </header>
        )}

        {enabledIds.has('about') && about && (
          <section
            style={{
              padding: 'var(--portfolio-spacing) 0',
              borderBottom: '1px solid #e5e7eb',
            }}
          >
            <h2
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.15em',
                color: 'var(--portfolio-text)',
                marginBottom: '1rem',
              }}
            >
              {about.title || 'Summary'}
            </h2>
            {about.description && (
              <p
                style={{
                  fontSize: 'var(--portfolio-body-size)',
                  color: 'var(--portfolio-text)',
                  whiteSpace: 'pre-line',
                }}
              >
                {about.description}
              </p>
            )}
            {about.stats.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  gap: '3rem',
                  marginTop: '1.5rem',
                  flexWrap: 'wrap',
                }}
              >
                {about.stats.map((stat) => (
                  <div key={stat.id}>
                    <span
                      style={{
                        fontSize: '1.5rem',
                        fontWeight: 'var(--portfolio-heading-weight)',
                        color: primary,
                      }}
                    >
                      {stat.value}
                    </span>
                    <span
                      style={{
                        fontSize: '0.875rem',
                        color: muted,
                        marginLeft: '0.5rem',
                      }}
                    >
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {enabledIds.has('experience') && experiences.length > 0 && (
          <section
            style={{
              padding: 'var(--portfolio-spacing) 0',
              borderBottom: '1px solid #e5e7eb',
            }}
          >
            <h2
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.15em',
                color: 'var(--portfolio-text)',
                marginBottom: '1.5rem',
              }}
            >
              Professional Experience
            </h2>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
              }}
            >
              {experiences.map((exp) => (
                <div key={exp.id}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontSize: '1rem',
                          fontWeight: 'var(--portfolio-heading-weight)',
                          margin: 0,
                        }}
                      >
                        {exp.position}
                      </h3>
                      <p
                        style={{
                          fontSize: '0.9375rem',
                          color: primary,
                          margin: '0.125rem 0 0',
                          fontWeight: 500,
                        }}
                      >
                        {exp.company}
                      </p>
                    </div>
                    <div
                      style={{
                        fontSize: '0.8125rem',
                        color: muted,
                        textAlign: 'right',
                      }}
                    >
                      <div>
                        {exp.startDate} —{' '}
                        {exp.currentlyWorking ? 'Present' : exp.endDate}
                      </div>
                      <div>{exp.location}</div>
                    </div>
                  </div>
                  {exp.description && (
                    <p
                      style={{
                        fontSize: 'var(--portfolio-body-size)',
                        color: 'var(--portfolio-muted)',
                        marginTop: '0.75rem',
                        whiteSpace: 'pre-line',
                      }}
                    >
                      {exp.description}
                    </p>
                  )}
                  {exp.technologies.length > 0 && (
                    <p
                      style={{
                        fontSize: '0.8125rem',
                        color: muted,
                        marginTop: '0.5rem',
                      }}
                    >
                      <strong>Technologies:</strong>{' '}
                      {exp.technologies.join(' · ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {enabledIds.has('projects') && projects.length > 0 && (
          <section
            style={{
              padding: 'var(--portfolio-spacing) 0',
              borderBottom: '1px solid #e5e7eb',
            }}
          >
            <h2
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.15em',
                color: 'var(--portfolio-text)',
                marginBottom: '1.5rem',
              }}
            >
              Projects
            </h2>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
              }}
            >
              {projects.map((project) => (
                <div key={project.id}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      gap: '1rem',
                    }}
                  >
                    <h3
                      style={{
                        fontSize: '1rem',
                        fontWeight: 'var(--portfolio-heading-weight)',
                        margin: 0,
                      }}
                    >
                      {project.title}
                    </h3>
                    <div
                      style={{
                        display: 'flex',
                        gap: '1rem',
                        fontSize: '0.8125rem',
                        flexShrink: 0,
                      }}
                    >
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: primary, textDecoration: 'none' }}
                        >
                          GitHub
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: primary, textDecoration: 'none' }}
                        >
                          Live
                        </a>
                      )}
                    </div>
                  </div>
                  {project.shortDescription && (
                    <p
                      style={{
                        fontSize: 'var(--portfolio-body-size)',
                        color: muted,
                        marginTop: '0.375rem',
                      }}
                    >
                      {project.shortDescription}
                    </p>
                  )}
                  {project.technologies.length > 0 && (
                    <p
                      style={{
                        fontSize: '0.8125rem',
                        color: muted,
                        marginTop: '0.375rem',
                      }}
                    >
                      {project.technologies.join(' · ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {enabledIds.has('skills') && skills.length > 0 && (
          <section
            style={{
              padding: 'var(--portfolio-spacing) 0',
              borderBottom: '1px solid #e5e7eb',
            }}
          >
            <h2
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.15em',
                color: 'var(--portfolio-text)',
                marginBottom: '1rem',
              }}
            >
              Skills
            </h2>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              {skills.map((cat) => (
                <div key={cat.id}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                    {cat.name}:{' '}
                  </span>
                  <span style={{ fontSize: '0.875rem', color: muted }}>
                    {cat.skills.map((s) => s.name).join(' · ')}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {enabledIds.has('education') && education.length > 0 && (
          <section
            style={{
              padding: 'var(--portfolio-spacing) 0',
              borderBottom: '1px solid #e5e7eb',
            }}
          >
            <h2
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.15em',
                color: 'var(--portfolio-text)',
                marginBottom: '1.5rem',
              }}
            >
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: '1rem' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    flexWrap: 'wrap',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '1rem',
                      fontWeight: 'var(--portfolio-heading-weight)',
                      margin: 0,
                    }}
                  >
                    {edu.degree} in {edu.fieldOfStudy}
                  </h3>
                  <span style={{ fontSize: '0.8125rem', color: muted }}>
                    {edu.startDate} — {edu.endDate}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: '0.9375rem',
                    color: primary,
                    margin: '0.125rem 0',
                  }}
                >
                  {edu.institution}
                  {edu.location ? ` · ${edu.location}` : ''}
                </p>
                {edu.description && (
                  <p
                    style={{
                      fontSize: 'var(--portfolio-body-size)',
                      color: muted,
                      marginTop: '0.375rem',
                    }}
                  >
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </section>
        )}

        {enabledIds.has('certifications') && certifications.length > 0 && (
          <section
            style={{
              padding: 'var(--portfolio-spacing) 0',
              borderBottom: '1px solid #e5e7eb',
            }}
          >
            <h2
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.15em',
                color: 'var(--portfolio-text)',
                marginBottom: '1rem',
              }}
            >
              Certifications
            </h2>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              {certifications.map((cert) => (
                <div key={cert.id}>
                  <span style={{ fontSize: '0.9375rem', fontWeight: 600 }}>
                    {cert.name}
                  </span>
                  <span style={{ fontSize: '0.8125rem', color: muted }}>
                    {' '}
                    — {cert.issuer}, {cert.issueDate}
                  </span>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: '0.8125rem',
                        color: primary,
                        textDecoration: 'none',
                        marginLeft: '0.5rem',
                      }}
                    >
                      Link
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {enabledIds.has('services') && services.length > 0 && (
          <section
            style={{
              padding: 'var(--portfolio-spacing) 0',
              borderBottom: '1px solid #e5e7eb',
            }}
          >
            <h2
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.15em',
                color: 'var(--portfolio-text)',
                marginBottom: '1rem',
              }}
            >
              Services
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {services.map((svc) => (
                <div key={svc.id}>
                  <h3
                    style={{
                      fontSize: '1rem',
                      fontWeight: 'var(--portfolio-heading-weight)',
                      margin: 0,
                    }}
                  >
                    {svc.name}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: muted,
                      marginTop: '0.375rem',
                    }}
                  >
                    {svc.description}
                  </p>
                  {svc.price && (
                    <p
                      style={{
                        fontSize: '0.9375rem',
                        fontWeight: 600,
                        color: primary,
                        marginTop: '0.5rem',
                      }}
                    >
                      {svc.price}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {enabledIds.has('testimonials') && testimonials.length > 0 && (
          <section
            style={{
              padding: 'var(--portfolio-spacing) 0',
              borderBottom: '1px solid #e5e7eb',
            }}
          >
            <h2
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.15em',
                color: 'var(--portfolio-text)',
                marginBottom: '1.5rem',
              }}
            >
              Testimonials
            </h2>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
              }}
            >
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  style={{
                    paddingLeft: '1rem',
                    borderLeft: `2px solid ${primary}`,
                  }}
                >
                  <p
                    style={{
                      fontSize: 'var(--portfolio-body-size)',
                      color: 'var(--portfolio-text)',
                      fontStyle: 'italic',
                      margin: 0,
                    }}
                  >
                    "{t.content}"
                  </p>
                  <p
                    style={{
                      fontSize: '0.8125rem',
                      color: muted,
                      marginTop: '0.5rem',
                    }}
                  >
                    — {t.personName}, {t.role}
                    {t.company ? ` at ${t.company}` : ''}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {enabledIds.has('publications') && publications.length > 0 && (
          <section
            style={{
              padding: 'var(--portfolio-spacing) 0',
              borderBottom: '1px solid #e5e7eb',
            }}
          >
            <h2
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.15em',
                color: 'var(--portfolio-text)',
                marginBottom: '1rem',
              }}
            >
              Publications
            </h2>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              {publications.map((pub) => (
                <div key={pub.id}>
                  <a
                    href={pub.url || undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      color: 'var(--portfolio-text)',
                      textDecoration: pub.url ? 'underline' : 'none',
                    }}
                  >
                    {pub.title}
                  </a>
                  <p
                    style={{
                      fontSize: '0.8125rem',
                      color: muted,
                      margin: '0.125rem 0 0',
                    }}
                  >
                    {pub.publisher}, {pub.date}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        <footer
          style={{ padding: 'var(--portfolio-spacing) 0', textAlign: 'center' }}
        >
          <p style={{ fontSize: '0.75rem', color: muted }}>
            {profile.firstName} {profile.lastName} · {profile.email} ·{' '}
            {profile.location}
          </p>
        </footer>
      </div>
    </div>
  )
}
