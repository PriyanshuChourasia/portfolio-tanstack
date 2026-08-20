import type { Portfolio } from '../../types/portfolio'

interface TemplateProps {
  portfolio: Portfolio
  style: React.CSSProperties
}

export function MinimalTemplate({ portfolio, style }: TemplateProps) {
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
              textAlign: portfolio.settings.layout.heroAlignment,
            }}
          >
            <h1
              style={{
                fontSize: 'var(--portfolio-heading-size)',
                fontWeight: 'var(--portfolio-heading-weight)',
                margin: 0,
                color: 'var(--portfolio-text)',
              }}
            >
              {profile.firstName} {profile.lastName}
            </h1>
            {profile.title && (
              <p
                style={{
                  fontSize: '1.25rem',
                  color: 'var(--portfolio-muted)',
                  marginTop: '0.5rem',
                }}
              >
                {profile.title}
              </p>
            )}
            {profile.tagline && (
              <p
                style={{
                  fontSize: 'var(--portfolio-body-size)',
                  color: 'var(--portfolio-muted)',
                  marginTop: '1rem',
                  maxWidth: '600px',
                  marginLeft:
                    portfolio.settings.layout.heroAlignment === 'center'
                      ? 'auto'
                      : undefined,
                  marginRight:
                    portfolio.settings.layout.heroAlignment === 'center'
                      ? 'auto'
                      : undefined,
                }}
              >
                {profile.tagline}
              </p>
            )}
            {socialLinks.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  marginTop: '1.5rem',
                  justifyContent:
                    portfolio.settings.layout.heroAlignment === 'center'
                      ? 'center'
                      : 'flex-start',
                  flexWrap: 'wrap',
                }}
              >
                {socialLinks.map((l) => (
                  <a
                    key={l.id}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: 'var(--portfolio-primary)',
                      fontSize: '0.875rem',
                      textDecoration: 'none',
                    }}
                  >
                    {l.platform}
                  </a>
                ))}
              </div>
            )}
          </header>
        )}

        {enabledIds.has('about') && about && (
          <section style={{ padding: 'var(--portfolio-spacing) 0' }}>
            <h2
              style={{
                fontWeight: 'var(--portfolio-heading-weight)',
                marginBottom: '1rem',
                color: 'var(--portfolio-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontSize: '0.875rem',
              }}
            >
              {about.title || 'About'}
            </h2>
            {about.description && (
              <p
                style={{
                  fontSize: 'var(--portfolio-body-size)',
                  color: 'var(--portfolio-muted)',
                  whiteSpace: 'pre-line',
                }}
              >
                {about.description}
              </p>
            )}
            {about.stats.length > 0 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${about.stats.length}, 1fr)`,
                  gap: '2rem',
                  marginTop: '2rem',
                }}
              >
                {about.stats.map((stat) => (
                  <div key={stat.id}>
                    <div
                      style={{
                        fontSize: '2rem',
                        fontWeight: 'var(--portfolio-heading-weight)',
                        color: 'var(--portfolio-primary)',
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      style={{
                        fontSize: '0.875rem',
                        color: 'var(--portfolio-muted)',
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {enabledIds.has('experience') && experiences.length > 0 && (
          <section style={{ padding: 'var(--portfolio-spacing) 0' }}>
            <h2
              style={{
                fontSize: '0.875rem',
                fontWeight: 'var(--portfolio-heading-weight)',
                marginBottom: '2rem',
                color: 'var(--portfolio-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Experience
            </h2>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
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
                          fontSize: '1.125rem',
                          fontWeight: 'var(--portfolio-heading-weight)',
                          margin: 0,
                        }}
                      >
                        {exp.position}
                      </h3>
                      <p
                        style={{
                          fontSize: 'var(--portfolio-body-size)',
                          color: 'var(--portfolio-muted)',
                          margin: 0,
                        }}
                      >
                        {exp.company}
                        {exp.location ? ` · ${exp.location}` : ''}
                      </p>
                    </div>
                    <span
                      style={{
                        fontSize: '0.8125rem',
                        color: 'var(--portfolio-muted)',
                      }}
                    >
                      {exp.startDate} —{' '}
                      {exp.currentlyWorking ? 'Present' : exp.endDate}
                    </span>
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
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.375rem',
                        marginTop: '0.75rem',
                      }}
                    >
                      {exp.technologies.map((t) => (
                        <span
                          key={t}
                          style={{
                            fontSize: '0.75rem',
                            padding: '0.125rem 0.5rem',
                            borderRadius: '9999px',
                            border: '1px solid var(--portfolio-accent)',
                            color: 'var(--portfolio-accent)',
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {enabledIds.has('projects') && projects.length > 0 && (
          <section style={{ padding: 'var(--portfolio-spacing) 0' }}>
            <h2
              style={{
                fontSize: '0.875rem',
                fontWeight: 'var(--portfolio-heading-weight)',
                marginBottom: '2rem',
                color: 'var(--portfolio-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Projects
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {projects.map((project) => (
                <div
                  key={project.id}
                  style={{
                    padding: '1.5rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: 'var(--portfolio-radius)',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: 'var(--portfolio-heading-weight)',
                      margin: 0,
                    }}
                  >
                    {project.title}
                  </h3>
                  {project.shortDescription && (
                    <p
                      style={{
                        fontSize: '0.875rem',
                        color: 'var(--portfolio-muted)',
                        marginTop: '0.5rem',
                      }}
                    >
                      {project.shortDescription}
                    </p>
                  )}
                  {project.technologies.length > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.375rem',
                        marginTop: '0.75rem',
                      }}
                    >
                      {project.technologies.map((t) => (
                        <span
                          key={t}
                          style={{
                            fontSize: '0.75rem',
                            padding: '0.125rem 0.5rem',
                            borderRadius: '9999px',
                            background: '#f3f4f6',
                            color: 'var(--portfolio-text)',
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.75rem',
                      marginTop: '1rem',
                    }}
                  >
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '0.8125rem',
                          color: 'var(--portfolio-primary)',
                          textDecoration: 'none',
                        }}
                      >
                        GitHub
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '0.8125rem',
                          color: 'var(--portfolio-primary)',
                          textDecoration: 'none',
                        }}
                      >
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {enabledIds.has('skills') && skills.length > 0 && (
          <section style={{ padding: 'var(--portfolio-spacing) 0' }}>
            <h2
              style={{
                fontSize: '0.875rem',
                fontWeight: 'var(--portfolio-heading-weight)',
                marginBottom: '2rem',
                color: 'var(--portfolio-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Skills
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '2rem',
              }}
            >
              {skills.map((cat) => (
                <div key={cat.id}>
                  <h3
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 'var(--portfolio-heading-weight)',
                      marginBottom: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: 'var(--portfolio-muted)',
                    }}
                  >
                    {cat.name}
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.375rem',
                    }}
                  >
                    {cat.skills.map((s) => (
                      <span
                        key={s.id}
                        style={{
                          fontSize: 'var(--portfolio-body-size)',
                          color: 'var(--portfolio-text)',
                        }}
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {enabledIds.has('education') && education.length > 0 && (
          <section style={{ padding: 'var(--portfolio-spacing) 0' }}>
            <h2
              style={{
                fontSize: '0.875rem',
                fontWeight: 'var(--portfolio-heading-weight)',
                marginBottom: '2rem',
                color: 'var(--portfolio-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Education
            </h2>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
              }}
            >
              {education.map((edu) => (
                <div key={edu.id}>
                  <h3
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: 'var(--portfolio-heading-weight)',
                      margin: 0,
                    }}
                  >
                    {edu.degree} in {edu.fieldOfStudy}
                  </h3>
                  <p
                    style={{
                      fontSize: 'var(--portfolio-body-size)',
                      color: 'var(--portfolio-muted)',
                      margin: 0,
                    }}
                  >
                    {edu.institution}
                    {edu.location ? ` · ${edu.location}` : ''}
                  </p>
                  <span
                    style={{
                      fontSize: '0.8125rem',
                      color: 'var(--portfolio-muted)',
                    }}
                  >
                    {edu.startDate} — {edu.endDate}
                  </span>
                  {edu.description && (
                    <p
                      style={{
                        fontSize: 'var(--portfolio-body-size)',
                        color: 'var(--portfolio-muted)',
                        marginTop: '0.5rem',
                      }}
                    >
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {enabledIds.has('certifications') && certifications.length > 0 && (
          <section style={{ padding: 'var(--portfolio-spacing) 0' }}>
            <h2
              style={{
                fontSize: '0.875rem',
                fontWeight: 'var(--portfolio-heading-weight)',
                marginBottom: '2rem',
                color: 'var(--portfolio-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Certifications
            </h2>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              {certifications.map((cert) => (
                <div key={cert.id}>
                  <h3
                    style={{
                      fontSize: '1rem',
                      fontWeight: 'var(--portfolio-heading-weight)',
                      margin: 0,
                    }}
                  >
                    {cert.name}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--portfolio-muted)',
                      margin: 0,
                    }}
                  >
                    {cert.issuer} · {cert.issueDate}
                    {cert.expirationDate ? ` — ${cert.expirationDate}` : ''}
                  </p>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: '0.8125rem',
                        color: 'var(--portfolio-primary)',
                        textDecoration: 'none',
                      }}
                    >
                      View Credential
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {enabledIds.has('services') && services.length > 0 && (
          <section style={{ padding: 'var(--portfolio-spacing) 0' }}>
            <h2
              style={{
                fontSize: '0.875rem',
                fontWeight: 'var(--portfolio-heading-weight)',
                marginBottom: '2rem',
                color: 'var(--portfolio-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
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
                <div
                  key={svc.id}
                  style={{
                    padding: '1.5rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: 'var(--portfolio-radius)',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: 'var(--portfolio-heading-weight)',
                      margin: 0,
                    }}
                  >
                    {svc.name}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--portfolio-muted)',
                      marginTop: '0.5rem',
                    }}
                  >
                    {svc.description}
                  </p>
                  {svc.price && (
                    <p
                      style={{
                        fontSize: '1rem',
                        fontWeight: 'var(--portfolio-heading-weight)',
                        color: 'var(--portfolio-primary)',
                        marginTop: '0.75rem',
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
          <section style={{ padding: 'var(--portfolio-spacing) 0' }}>
            <h2
              style={{
                fontSize: '0.875rem',
                fontWeight: 'var(--portfolio-heading-weight)',
                marginBottom: '2rem',
                color: 'var(--portfolio-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Testimonials
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  style={{
                    padding: '1.5rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: 'var(--portfolio-radius)',
                  }}
                >
                  <p
                    style={{
                      fontSize: 'var(--portfolio-body-size)',
                      color: 'var(--portfolio-muted)',
                      fontStyle: 'italic',
                      margin: 0,
                    }}
                  >
                    "{t.content}"
                  </p>
                  <div style={{ marginTop: '1rem' }}>
                    <p
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 'var(--portfolio-heading-weight)',
                        margin: 0,
                      }}
                    >
                      {t.personName}
                    </p>
                    <p
                      style={{
                        fontSize: '0.8125rem',
                        color: 'var(--portfolio-muted)',
                        margin: 0,
                      }}
                    >
                      {t.role}
                      {t.company ? ` at ${t.company}` : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {enabledIds.has('publications') && publications.length > 0 && (
          <section style={{ padding: 'var(--portfolio-spacing) 0' }}>
            <h2
              style={{
                fontSize: '0.875rem',
                fontWeight: 'var(--portfolio-heading-weight)',
                marginBottom: '2rem',
                color: 'var(--portfolio-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Publications
            </h2>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
              }}
            >
              {publications.map((pub) => (
                <div key={pub.id}>
                  <h3
                    style={{
                      fontSize: '1rem',
                      fontWeight: 'var(--portfolio-heading-weight)',
                      margin: 0,
                    }}
                  >
                    {pub.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--portfolio-muted)',
                      margin: 0,
                    }}
                  >
                    {pub.publisher} · {pub.date}
                  </p>
                  {pub.description && (
                    <p
                      style={{
                        fontSize: 'var(--portfolio-body-size)',
                        color: 'var(--portfolio-muted)',
                        marginTop: '0.5rem',
                      }}
                    >
                      {pub.description}
                    </p>
                  )}
                  {pub.url && (
                    <a
                      href={pub.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: '0.8125rem',
                        color: 'var(--portfolio-primary)',
                        textDecoration: 'none',
                      }}
                    >
                      Read More
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <footer
          style={{
            padding: 'var(--portfolio-spacing) 0',
            borderTop: '1px solid #e5e7eb',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '0.8125rem', color: 'var(--portfolio-muted)' }}>
            {profile.firstName} {profile.lastName} · {profile.email}
          </p>
        </footer>
      </div>
    </div>
  )
}
