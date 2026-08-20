import type { Portfolio } from '../../types/portfolio'

interface TemplateProps {
  portfolio: Portfolio
  style: React.CSSProperties
}

export function CreativeTemplate({ portfolio, style }: TemplateProps) {
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
  const secondary = 'var(--portfolio-secondary)'
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
      <div style={{ maxWidth: 'var(--portfolio-width)', margin: '0 auto' }}>
        {enabledIds.has('profile') && (
          <header
            style={{
              padding: '5rem 2rem var(--portfolio-spacing)',
              background: `linear-gradient(135deg, ${primary}08, ${secondary}08)`,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-50%',
                right: '-10%',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${primary}10, transparent)`,
              }}
            />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.2em',
                  color: primary,
                  marginBottom: '1rem',
                }}
              >
                Hello World, I'm
              </div>
              <h1
                style={{
                  fontSize: 'clamp(2.5rem, 5vw, var(--portfolio-heading-size))',
                  fontWeight: 'var(--portfolio-heading-weight)',
                  margin: 0,
                  lineHeight: 1.1,
                }}
              >
                {profile.firstName}
                <br />
                <span
                  style={{
                    background: `linear-gradient(135deg, ${primary}, ${secondary})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {profile.lastName}
                </span>
              </h1>
              {profile.title && (
                <p
                  style={{
                    fontSize: '1.5rem',
                    color: muted,
                    marginTop: '1rem',
                    fontWeight: 300,
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
                    maxWidth: '500px',
                    lineHeight: 1.7,
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
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      border: `1px solid ${primary}30`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: primary,
                      fontSize: '0.75rem',
                      textDecoration: 'none',
                      textTransform: 'uppercase',
                    }}
                  >
                    {l.platform.charAt(0).toUpperCase()}
                  </a>
                ))}
              </div>
            </div>
          </header>
        )}

        <div style={{ padding: '0 2rem' }}>
          {enabledIds.has('about') && about && (
            <section style={{ padding: 'var(--portfolio-spacing) 0' }}>
              <h2
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 'var(--portfolio-heading-weight)',
                  margin: 0,
                  lineHeight: 1.1,
                  color: 'var(--portfolio-text)',
                }}
              >
                {about.title || 'About'}{' '}
                <span style={{ color: primary }}>Me</span>
              </h2>
              {about.description && (
                <p
                  style={{
                    fontSize: 'var(--portfolio-body-size)',
                    color: muted,
                    marginTop: '1.5rem',
                    maxWidth: '600px',
                    whiteSpace: 'pre-line',
                    lineHeight: 1.8,
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
                    marginTop: '2.5rem',
                    flexWrap: 'wrap',
                  }}
                >
                  {about.stats.map((stat) => (
                    <div key={stat.id}>
                      <div
                        style={{
                          fontSize: '3rem',
                          fontWeight: 'var(--portfolio-heading-weight)',
                          background: `linear-gradient(135deg, ${primary}, ${secondary})`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          lineHeight: 1,
                        }}
                      >
                        {stat.value}
                      </div>
                      <div
                        style={{
                          fontSize: '0.875rem',
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

          {enabledIds.has('projects') && projects.length > 0 && (
            <section style={{ padding: 'var(--portfolio-spacing) 0' }}>
              <h2
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 'var(--portfolio-heading-weight)',
                  margin: 0,
                }}
              >
                Selected <span style={{ color: primary }}>Work</span>
              </h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '1.5rem',
                  marginTop: '2rem',
                }}
              >
                {projects.map((project, i) => (
                  <div
                    key={project.id}
                    style={{
                      padding: '2rem',
                      borderRadius: 'var(--portfolio-radius)',
                      background:
                        i % 2 === 0
                          ? `linear-gradient(135deg, ${primary}08, ${secondary}05)`
                          : '#f8fafc',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {project.featured && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '1rem',
                          right: '1rem',
                          fontSize: '0.625rem',
                          fontWeight: 700,
                          textTransform: 'uppercase' as const,
                          letterSpacing: '0.1em',
                          color: primary,
                          background: `${primary}10`,
                          padding: '0.25rem 0.5rem',
                          borderRadius: 'var(--portfolio-radius)',
                        }}
                      >
                        Featured
                      </span>
                    )}
                    <h3
                      style={{
                        fontSize: '1.25rem',
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
                          color: muted,
                          marginTop: '0.5rem',
                          lineHeight: 1.6,
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
                          gap: '0.5rem',
                          marginTop: '1rem',
                        }}
                      >
                        {project.technologies.map((t) => (
                          <span
                            key={t}
                            style={{
                              fontSize: '0.6875rem',
                              padding: '0.25rem 0.625rem',
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
                    <div
                      style={{
                        display: 'flex',
                        gap: '1rem',
                        marginTop: '1.25rem',
                      }}
                    >
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: '0.8125rem',
                            color: primary,
                            textDecoration: 'none',
                            fontWeight: 500,
                          }}
                        >
                          Source Code →
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: '0.8125rem',
                            color: secondary,
                            textDecoration: 'none',
                            fontWeight: 500,
                          }}
                        >
                          Live Demo →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {enabledIds.has('experience') && experiences.length > 0 && (
            <section style={{ padding: 'var(--portfolio-spacing) 0' }}>
              <h2
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 'var(--portfolio-heading-weight)',
                  margin: 0,
                }}
              >
                Work <span style={{ color: primary }}>Experience</span>
              </h2>
              <div style={{ marginTop: '2rem' }}>
                {experiences.map((exp) => (
                  <div
                    key={exp.id}
                    style={{
                      display: 'flex',
                      gap: '2rem',
                      padding: '1.5rem 0',
                      borderBottom: '1px solid #f1f5f9',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: muted,
                        whiteSpace: 'nowrap',
                        minWidth: '100px',
                        paddingTop: '0.25rem',
                      }}
                    >
                      {exp.startDate} —{' '}
                      {exp.currentlyWorking ? 'Now' : exp.endDate}
                    </div>
                    <div style={{ flex: 1 }}>
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
                          fontSize: '0.875rem',
                          color: primary,
                          margin: '0.25rem 0 0',
                        }}
                      >
                        {exp.company}
                      </p>
                      {exp.description && (
                        <p
                          style={{
                            fontSize: 'var(--portfolio-body-size)',
                            color: muted,
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
                                fontSize: '0.6875rem',
                                padding: '0.125rem 0.5rem',
                                borderRadius: '9999px',
                                border: `1px solid ${primary}30`,
                                color: primary,
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

          {enabledIds.has('skills') && skills.length > 0 && (
            <section style={{ padding: 'var(--portfolio-spacing) 0' }}>
              <h2
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 'var(--portfolio-heading-weight)',
                  margin: 0,
                }}
              >
                My <span style={{ color: primary }}>Skills</span>
              </h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: '2rem',
                  marginTop: '2rem',
                }}
              >
                {skills.map((cat) => (
                  <div key={cat.id}>
                    <h3
                      style={{
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        textTransform: 'uppercase' as const,
                        letterSpacing: '0.1em',
                        color: primary,
                        marginBottom: '1rem',
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
                            gap: '0.75rem',
                          }}
                        >
                          <span
                            style={{
                              fontSize: 'var(--portfolio-body-size)',
                              minWidth: '80px',
                            }}
                          >
                            {s.name}
                          </span>
                          {s.level !== undefined && (
                            <div
                              style={{
                                flex: 1,
                                height: '3px',
                                background: '#f1f5f9',
                                borderRadius: '9999px',
                                overflow: 'hidden',
                              }}
                            >
                              <div
                                style={{
                                  height: '100%',
                                  width: `${s.level}%`,
                                  background: `linear-gradient(90deg, ${primary}, ${secondary})`,
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
              <h2
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 'var(--portfolio-heading-weight)',
                  margin: 0,
                }}
              >
                Education
              </h2>
              <div style={{ marginTop: '1.5rem' }}>
                {education.map((edu) => (
                  <div
                    key={edu.id}
                    style={{
                      padding: '1.5rem',
                      borderRadius: 'var(--portfolio-radius)',
                      background: '#f8fafc',
                      marginBottom: '1rem',
                    }}
                  >
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
                        fontSize: '0.875rem',
                        color: primary,
                        margin: '0.25rem 0',
                      }}
                    >
                      {edu.institution}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: muted }}>
                      {edu.startDate} — {edu.endDate}
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
              <h2
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 'var(--portfolio-heading-weight)',
                  margin: 0,
                }}
              >
                Certifications
              </h2>
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
                      padding: '1.25rem',
                      borderRadius: 'var(--portfolio-radius)',
                      border: `1px solid ${primary}20`,
                    }}
                  >
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
                        View Credential →
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
                  fontSize: '2.5rem',
                  fontWeight: 'var(--portfolio-heading-weight)',
                  margin: 0,
                }}
              >
                Services
              </h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '1rem',
                  marginTop: '1.5rem',
                }}
              >
                {services.map((svc, i) => (
                  <div
                    key={svc.id}
                    style={{
                      padding: '2rem',
                      borderRadius: 'var(--portfolio-radius)',
                      background:
                        i % 2 === 0
                          ? `linear-gradient(135deg, ${primary}08, ${secondary}05)`
                          : '#f8fafc',
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
                        color: muted,
                        marginTop: '0.5rem',
                        lineHeight: 1.6,
                      }}
                    >
                      {svc.description}
                    </p>
                    {svc.price && (
                      <p
                        style={{
                          fontSize: '1.25rem',
                          fontWeight: 'var(--portfolio-heading-weight)',
                          color: primary,
                          marginTop: '1rem',
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
                  fontSize: '2.5rem',
                  fontWeight: 'var(--portfolio-heading-weight)',
                  margin: 0,
                }}
              >
                Testimonials
              </h2>
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
                      padding: '2rem',
                      borderRadius: 'var(--portfolio-radius)',
                      background: '#f8fafc',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '3rem',
                        color: `${primary}20`,
                        position: 'absolute',
                        top: '0.5rem',
                        left: '1rem',
                        lineHeight: 1,
                      }}
                    >
                      "
                    </div>
                    <p
                      style={{
                        fontSize: '0.9375rem',
                        color: muted,
                        fontStyle: 'italic',
                        margin: 0,
                        lineHeight: 1.7,
                        position: 'relative',
                        zIndex: 1,
                      }}
                    >
                      {t.content}
                    </p>
                    <div
                      style={{
                        marginTop: '1.25rem',
                        paddingTop: '1rem',
                        borderTop: '1px solid #e2e8f0',
                      }}
                    >
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
              <h2
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 'var(--portfolio-heading-weight)',
                  margin: 0,
                }}
              >
                Publications
              </h2>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                  marginTop: '1.5rem',
                }}
              >
                {publications.map((pub) => (
                  <div
                    key={pub.id}
                    style={{
                      padding: '1.5rem',
                      borderRadius: 'var(--portfolio-radius)',
                      border: '1px solid #f1f5f9',
                    }}
                  >
                    <h3
                      style={{
                        fontSize: '1.125rem',
                        fontWeight: 'var(--portfolio-heading-weight)',
                        margin: 0,
                      }}
                    >
                      {pub.title}
                    </h3>
                    <p
                      style={{
                        fontSize: '0.8125rem',
                        color: primary,
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
        </div>

        <footer
          style={{
            padding: 'var(--portfolio-spacing) 2rem',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '0.8125rem', color: muted }}>
            © {new Date().getFullYear()} {profile.firstName} {profile.lastName}
          </p>
        </footer>
      </div>
    </div>
  )
}
