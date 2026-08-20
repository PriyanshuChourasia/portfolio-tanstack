import type { Portfolio } from '../../types/portfolio'

interface TemplateProps {
  portfolio: Portfolio
  style: React.CSSProperties
}

export function ModernTemplate({ portfolio, style }: TemplateProps) {
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
          padding: '0 1.5rem',
        }}
      >
        {enabledIds.has('profile') && (
          <header
            style={{
              padding: '4rem 0 var(--portfolio-spacing)',
              textAlign: portfolio.settings.layout.heroAlignment,
            }}
          >
            <div
              style={{
                display: 'inline-block',
                padding: '0.25rem 0.75rem',
                borderRadius: 'var(--portfolio-radius)',
                background: `${primary}10`,
                color: primary,
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '1.5rem',
              }}
            >
              Welcome
            </div>
            <h1
              style={{
                fontSize: 'var(--portfolio-heading-size)',
                fontWeight: 'var(--portfolio-heading-weight)',
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              Hi, I'm{' '}
              <span style={{ color: primary }}>
                {profile.firstName} {profile.lastName}
              </span>
            </h1>
            {profile.title && (
              <p
                style={{
                  fontSize: '1.25rem',
                  color: muted,
                  marginTop: '0.75rem',
                }}
              >
                {profile.title}
              </p>
            )}
            {profile.tagline && (
              <p
                style={{
                  fontSize: 'var(--portfolio-body-size)',
                  color: muted,
                  marginTop: '1rem',
                  maxWidth: '560px',
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
            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                marginTop: '2rem',
                justifyContent:
                  portfolio.settings.layout.heroAlignment === 'center'
                    ? 'center'
                    : 'flex-start',
                flexWrap: 'wrap',
              }}
            >
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--portfolio-radius)',
                    background: primary,
                    color: '#fff',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    textDecoration: 'none',
                  }}
                >
                  Contact Me
                </a>
              )}
              {socialLinks.slice(0, 3).map((l) => (
                <a
                  key={l.id}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--portfolio-radius)',
                    border: '1px solid #e2e8f0',
                    color: 'var(--portfolio-text)',
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                  }}
                >
                  {l.platform}
                </a>
              ))}
            </div>
          </header>
        )}

        {enabledIds.has('about') && about && (
          <section style={{ padding: 'var(--portfolio-spacing) 0' }}>
            <SectionLabel title={about.title || 'About Me'} />
            {about.description && (
              <p
                style={{
                  fontSize: 'var(--portfolio-body-size)',
                  color: muted,
                  marginTop: '1rem',
                  whiteSpace: 'pre-line',
                  maxWidth: '640px',
                }}
              >
                {about.description}
              </p>
            )}
            {about.stats.length > 0 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${Math.min(about.stats.length, 4)}, 1fr)`,
                  gap: '1.5rem',
                  marginTop: '2rem',
                }}
              >
                {about.stats.map((stat) => (
                  <div
                    key={stat.id}
                    style={{
                      padding: '1.25rem',
                      borderRadius: 'var(--portfolio-radius)',
                      border: '1px solid #f1f5f9',
                      background: '#f8fafc',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '1.75rem',
                        fontWeight: 'var(--portfolio-heading-weight)',
                        color: primary,
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      style={{
                        fontSize: '0.8125rem',
                        color: muted,
                        marginTop: '0.25rem',
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
            <SectionLabel title="Experience" />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0',
                marginTop: '1.5rem',
              }}
            >
              {experiences.map((exp, i) => (
                <div
                  key={exp.id}
                  style={{
                    display: 'flex',
                    gap: '1.5rem',
                    paddingBottom: i < experiences.length - 1 ? '2rem' : 0,
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: primary,
                        flexShrink: 0,
                      }}
                    />
                    {i < experiences.length - 1 && (
                      <div
                        style={{
                          width: '2px',
                          flex: 1,
                          background: '#e2e8f0',
                          marginTop: '4px',
                        }}
                      />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        flexWrap: 'wrap',
                        gap: '0.25rem',
                      }}
                    >
                      <h3
                        style={{
                          fontSize: '1rem',
                          fontWeight: 'var(--portfolio-heading-weight)',
                          margin: 0,
                        }}
                      >
                        {exp.position}
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: muted }}>
                        {exp.startDate} —{' '}
                        {exp.currentlyWorking ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: '0.875rem',
                        color: primary,
                        margin: '0.125rem 0 0',
                      }}
                    >
                      {exp.company}
                      {exp.location ? ` · ${exp.location}` : ''}
                    </p>
                    {exp.description && (
                      <p
                        style={{
                          fontSize: 'var(--portfolio-body-size)',
                          color: muted,
                          marginTop: '0.5rem',
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
                          marginTop: '0.625rem',
                        }}
                      >
                        {exp.technologies.map((t) => (
                          <span
                            key={t}
                            style={{
                              fontSize: '0.6875rem',
                              padding: '0.125rem 0.5rem',
                              borderRadius: '9999px',
                              background: `${primary}10`,
                              color: primary,
                              fontWeight: 500,
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {enabledIds.has('projects') && projects.length > 0 && (
          <section style={{ padding: 'var(--portfolio-spacing) 0' }}>
            <SectionLabel title="Projects" />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1rem',
                marginTop: '1.5rem',
              }}
            >
              {projects.map((project) => (
                <div
                  key={project.id}
                  style={{
                    padding: '1.5rem',
                    borderRadius: 'var(--portfolio-radius)',
                    border: '1px solid #f1f5f9',
                    background: '#fafbfc',
                    transition: 'box-shadow 0.2s',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <FolderIcon />
                    <div
                      style={{
                        display: 'flex',
                        gap: '0.5rem',
                        marginLeft: 'auto',
                      }}
                    >
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: muted, fontSize: '0.75rem' }}
                        >
                          GitHub
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: muted, fontSize: '0.75rem' }}
                        >
                          Live
                        </a>
                      )}
                    </div>
                  </div>
                  <h3
                    style={{
                      fontSize: '1rem',
                      fontWeight: 'var(--portfolio-heading-weight)',
                      margin: 0,
                    }}
                  >
                    {project.title}
                  </h3>
                  {project.shortDescription && (
                    <p
                      style={{
                        fontSize: '0.8125rem',
                        color: muted,
                        marginTop: '0.375rem',
                        lineHeight: 1.5,
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
                          style={{ fontSize: '0.6875rem', color: muted }}
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

        {enabledIds.has('skills') && skills.length > 0 && (
          <section style={{ padding: 'var(--portfolio-spacing) 0' }}>
            <SectionLabel title="Skills" />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '2rem',
                marginTop: '1.5rem',
              }}
            >
              {skills.map((cat) => (
                <div key={cat.id}>
                  <h3
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 'var(--portfolio-heading-weight)',
                      marginBottom: '0.75rem',
                    }}
                  >
                    {cat.name}
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}
                  >
                    {cat.skills.map((s) => (
                      <div
                        key={s.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                      >
                        <span
                          style={{ fontSize: 'var(--portfolio-body-size)' }}
                        >
                          {s.name}
                        </span>
                        {s.level !== undefined && (
                          <div
                            style={{
                              flex: 1,
                              height: '4px',
                              background: '#f1f5f9',
                              borderRadius: '9999px',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                height: '100%',
                                width: `${s.level}%`,
                                background: primary,
                                borderRadius: '9999px',
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {enabledIds.has('education') && education.length > 0 && (
          <section style={{ padding: 'var(--portfolio-spacing) 0' }}>
            <SectionLabel title="Education" />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                marginTop: '1.5rem',
              }}
            >
              {education.map((edu) => (
                <div key={edu.id}>
                  <h3
                    style={{
                      fontSize: '1rem',
                      fontWeight: 'var(--portfolio-heading-weight)',
                      margin: 0,
                    }}
                  >
                    {edu.degree} in {edu.fieldOfStudy}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: primary,
                      margin: '0.125rem 0',
                    }}
                  >
                    {edu.institution}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: muted }}>
                    {edu.startDate} — {edu.endDate} · {edu.location}
                  </span>
                  {edu.description && (
                    <p
                      style={{
                        fontSize: 'var(--portfolio-body-size)',
                        color: muted,
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
            <SectionLabel title="Certifications" />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1rem',
                marginTop: '1.5rem',
              }}
            >
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--portfolio-radius)',
                    border: '1px solid #f1f5f9',
                    background: '#fafbfc',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '0.9375rem',
                      fontWeight: 'var(--portfolio-heading-weight)',
                      margin: 0,
                    }}
                  >
                    {cert.name}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.8125rem',
                      color: muted,
                      margin: '0.25rem 0 0',
                    }}
                  >
                    {cert.issuer} · {cert.issueDate}
                  </p>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: '0.75rem',
                        color: primary,
                        textDecoration: 'none',
                        display: 'inline-block',
                        marginTop: '0.5rem',
                      }}
                    >
                      View →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {enabledIds.has('services') && services.length > 0 && (
          <section style={{ padding: 'var(--portfolio-spacing) 0' }}>
            <SectionLabel title="Services" />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '1rem',
                marginTop: '1.5rem',
              }}
            >
              {services.map((svc) => (
                <div
                  key={svc.id}
                  style={{
                    padding: '1.5rem',
                    borderRadius: 'var(--portfolio-radius)',
                    border: '1px solid #f1f5f9',
                    background: '#fafbfc',
                  }}
                >
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
                      fontSize: '0.8125rem',
                      color: muted,
                      marginTop: '0.5rem',
                      lineHeight: 1.5,
                    }}
                  >
                    {svc.description}
                  </p>
                  {svc.cta && (
                    <span
                      style={{
                        display: 'inline-block',
                        marginTop: '1rem',
                        fontSize: '0.8125rem',
                        color: primary,
                        fontWeight: 500,
                      }}
                    >
                      {svc.cta} →
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {enabledIds.has('testimonials') && testimonials.length > 0 && (
          <section style={{ padding: 'var(--portfolio-spacing) 0' }}>
            <SectionLabel title="Testimonials" />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1rem',
                marginTop: '1.5rem',
              }}
            >
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  style={{
                    padding: '1.5rem',
                    borderRadius: 'var(--portfolio-radius)',
                    border: '1px solid #f1f5f9',
                    background: '#fafbfc',
                  }}
                >
                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: muted,
                      fontStyle: 'italic',
                      margin: 0,
                      lineHeight: 1.6,
                    }}
                  >
                    "{t.content}"
                  </p>
                  <div
                    style={{
                      marginTop: '1rem',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid #f1f5f9',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '0.8125rem',
                        fontWeight: 'var(--portfolio-heading-weight)',
                        margin: 0,
                      }}
                    >
                      {t.personName}
                    </p>
                    <p
                      style={{
                        fontSize: '0.75rem',
                        color: muted,
                        margin: '0.125rem 0 0',
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
            <SectionLabel title="Publications" />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                marginTop: '1.5rem',
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
                      fontSize: '0.8125rem',
                      color: muted,
                      margin: '0.25rem 0 0',
                    }}
                  >
                    {pub.publisher} · {pub.date}
                  </p>
                  {pub.description && (
                    <p
                      style={{
                        fontSize: 'var(--portfolio-body-size)',
                        color: muted,
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
                        color: primary,
                        textDecoration: 'none',
                        marginTop: '0.5rem',
                        display: 'inline-block',
                      }}
                    >
                      Read More →
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
            borderTop: '1px solid #f1f5f9',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '0.8125rem', color: muted }}>
            Built by {profile.firstName} {profile.lastName}
          </p>
        </footer>
      </div>
    </div>
  )
}

function SectionLabel({ title }: { title: string }) {
  return (
    <h2
      style={{
        fontSize: '0.75rem',
        fontWeight: 600,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.1em',
        color: 'var(--portfolio-primary)',
        marginBottom: '0.25rem',
      }}
    >
      {title}
    </h2>
  )
}

function FolderIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 4.5C2 3.67 2.67 3 3.5 3H6.29L7.5 4.21H12.5C13.33 4.21 14 4.88 14 5.71V11.5C14 12.33 13.33 13 12.5 13H3.5C2.67 13 2 12.33 2 11.5V4.5Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ color: 'var(--portfolio-primary)' }}
      />
    </svg>
  )
}
