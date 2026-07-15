import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Send,
  Quote,
  Calendar,
  ArrowUp,
  Github,
  Linkedin,
  Twitter,
  Globe,
  ChevronRight,
  Download,
  Play,
} from 'lucide-react'
import type { PortfolioTemplateProps } from './types'

/* ── Folio: dark, clean, minimalist with orange/warm accents ── */

export function FolioTemplate({ data }: PortfolioTemplateProps) {
  const { hero, about, services, skills, stats, projects, testimonials, blog, contact, footer, sections } = data
  const [activeFilter, setActiveFilter] = useState('All')

  const categories = ['All', ...new Set(projects.map((p) => p.category))]

  const fadeUp = {
    hidden: { opacity: 0, y: 25 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' },
    }),
  }

  const accent = '#f97316' // orange-500
  const accentBg = '#ffedd5' // orange-100
  const darkBg = '#0c0c0c'
  const cardBg = '#1a1a1a'
  const surfaceBg = '#141414'
  const borderColor = '#2a2a2a'
  const textMuted = '#a3a3a3'
  const textColor = '#fafafa'

  return (
    <div className="min-h-screen" style={{ backgroundColor: darkBg, color: textColor }}>

      {/* ─── NAV ─── */}
      <nav className="fixed top-0 z-50 w-full backdrop-blur-md" style={{ backgroundColor: `${darkBg}dd`, borderBottom: `1px solid ${borderColor}` }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#home" className="text-lg font-bold tracking-tight" style={{ color: textColor }}>
            <span style={{ color: accent }}>/</span>
            {hero.name ? hero.name.split(' ')[0] : 'Portfolio'}
          </a>
          <div className="hidden items-center gap-8 md:flex">
            {[
              { id: 'home', label: 'Home', show: sections.hero },
              { id: 'services', label: 'Services', show: sections.services || sections.skills },
              { id: 'projects', label: 'Work', show: sections.projects },
              { id: 'about', label: 'About', show: sections.about },
              { id: 'blog', label: 'Blog', show: sections.blog },
              { id: 'contact', label: 'Contact', show: sections.contact },
            ].filter((s) => s.show).map((item) => (
              <a key={item.id} href={`#${item.id}`} className="text-sm font-medium transition-colors" style={{ color: textMuted }}
                onMouseEnter={(e) => e.currentTarget.style.color = accent}
                onMouseLeave={(e) => e.currentTarget.style.color = textMuted}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      {sections.hero && (
        <section id="home" className="flex min-h-screen items-center pt-20" style={{ backgroundColor: darkBg }}>
          <div className="mx-auto flex w-full max-w-6xl flex-col-reverse items-center gap-12 px-6 py-16 md:flex-row md:py-24">
            <motion.div initial="hidden" animate="visible" className="flex-1 space-y-6 text-center md:text-left">
              <motion.p variants={fadeUp} className="inline-block rounded-md px-3 py-1 text-xs font-semibold uppercase tracking-widest" style={{ backgroundColor: accentBg, color: accent }}>
                Freelance Designer
              </motion.p>
              <motion.h1 variants={fadeUp} className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl" style={{ color: textColor }}>
                Hi, I'm{' '}
                <span style={{ color: accent }}>{hero.name || 'Your Name'}</span>
              </motion.h1>
              <motion.p variants={fadeUp} className="text-lg sm:text-xl" style={{ color: textMuted }}>
                {hero.title || 'Your Title'}
              </motion.p>
              {hero.tagline && (
                <motion.p variants={fadeUp} className="max-w-lg text-sm leading-relaxed md:mx-0" style={{ color: textMuted }}>
                  {hero.tagline}
                </motion.p>
              )}
              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4 pt-2 md:justify-start">
                {hero.resumeUrl && (
                  <a href={hero.resumeUrl} className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90" style={{ backgroundColor: accent }}>
                    <Download className="size-4" /> Download CV
                  </a>
                )}
                {hero.videoUrl && (
                  <a href={hero.videoUrl} className="inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-all hover:bg-white/5" style={{ borderColor: borderColor, color: textColor }}>
                    <Play className="size-4" /> Watch Video
                  </a>
                )}
              </motion.div>
              {hero.socialLinks.length > 0 && (
                <motion.div variants={fadeUp} className="flex items-center gap-3 pt-2 md:justify-start">
                  {hero.socialLinks.map((link, i) => (
                    <a key={i} href={link.url} className="flex size-10 items-center justify-center rounded-full transition-all hover:-translate-y-0.5" style={{ border: `1px solid ${borderColor}`, color: textMuted }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = borderColor; e.currentTarget.style.color = textMuted }}
                    >
                      {link.icon === 'github' ? <Github className="size-4" /> :
                       link.icon === 'linkedin' ? <Linkedin className="size-4" /> :
                       link.icon === 'twitter' ? <Twitter className="size-4" /> :
                       <Globe className="size-4" />}
                    </a>
                  ))}
                </motion.div>
              )}
            </motion.div>
            {hero.profileImage && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative shrink-0">
                <div className="absolute -inset-4 rounded-2xl opacity-20 blur-xl" style={{ backgroundColor: accent }} />
                <div className="relative size-60 overflow-hidden rounded-2xl sm:size-72" style={{ boxShadow: `0 20px 60px rgba(0,0,0,0.5)` }}>
                  <img src={hero.profileImage} alt={hero.name} className="size-full object-cover" />
                </div>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* ─── SERVICES ─── */}
      {sections.services && services.length > 0 && (
        <section id="services" className="py-20 sm:py-28" style={{ backgroundColor: surfaceBg }}>
          <div className="mx-auto max-w-6xl px-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-14 text-center">
              <motion.p variants={fadeUp} className="mb-3 inline-block rounded-md px-3 py-1 text-xs font-semibold uppercase tracking-widest" style={{ backgroundColor: accentBg, color: accent }}>
                What I Do
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-3xl font-bold sm:text-4xl" style={{ color: textColor }}>Services</motion.h2>
              <motion.div variants={fadeUp} className="mx-auto mt-4 h-0.5 w-14 rounded-full" style={{ backgroundColor: accent }} />
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { transition: { staggerChildren: 0.08 } } }} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <motion.div key={s.id} variants={fadeUp} className="group rounded-xl border p-6 transition-all hover:-translate-y-1" style={{ backgroundColor: cardBg, borderColor: borderColor }}>
                  <div className="mb-4 flex size-12 items-center justify-center rounded-lg" style={{ backgroundColor: `${accent}15`, color: accent }}>
                    <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      {s.icon === 'code' ? (
                        <><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></>
                      ) : s.icon === 'palette' ? (
                        <><circle cx="13.5" cy="6.5" r="0.5" fill="currentColor"/><circle cx="17.5" cy="10.5" r="0.5" fill="currentColor"/><circle cx="8.5" cy="7.5" r="0.5" fill="currentColor"/><circle cx="6.5" cy="12.5" r="0.5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.504 5.555-5.555C17.965 6.012 15.461 2 12 2z"/></>
                      ) : (
                        <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></>
                      )}
                    </svg>
                  </div>
                  <h3 className="mb-2 text-base font-semibold" style={{ color: textColor }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: textMuted }}>{s.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── SKILLS ─── */}
      {sections.skills && skills.length > 0 && (
        <section className="py-20 sm:py-24" style={{ backgroundColor: darkBg }}>
          <div className="mx-auto max-w-4xl px-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-14 text-center">
              <motion.p variants={fadeUp} className="mb-3 inline-block rounded-md px-3 py-1 text-xs font-semibold uppercase tracking-widest" style={{ backgroundColor: accentBg, color: accent }}>
                Expertise
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-3xl font-bold sm:text-4xl" style={{ color: textColor }}>Skills</motion.h2>
              <motion.div variants={fadeUp} className="mx-auto mt-4 h-0.5 w-14 rounded-full" style={{ backgroundColor: accent }} />
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid gap-x-12 gap-y-6 sm:grid-cols-2">
              {skills.map((skill, i) => (
                <motion.div key={skill.id} variants={fadeUp} custom={i}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium" style={{ color: textColor }}>{skill.name}</span>
                    <span className="font-semibold" style={{ color: accent }}>{skill.percentage}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full" style={{ backgroundColor: borderColor }}>
                    <motion.div className="h-full rounded-full" style={{ backgroundColor: accent, backgroundImage: `linear-gradient(90deg, ${accent}, #fb923c)` }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── STATS ─── */}
      {sections.stats && stats.length > 0 && (
        <section className="border-y py-16" style={{ backgroundColor: surfaceBg, borderColor }}>
          <div className="mx-auto max-w-5xl px-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { transition: { staggerChildren: 0.12 } } }} className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat) => (
                <motion.div key={stat.id} variants={fadeUp} className="text-center">
                  <p className="text-3xl font-bold sm:text-4xl" style={{ color: accent }}>{stat.value}<span className="text-lg opacity-60">{stat.suffix}</span></p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wider" style={{ color: textMuted }}>{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── PROJECTS ─── */}
      {sections.projects && projects.length > 0 && (
        <section id="projects" className="py-20 sm:py-28" style={{ backgroundColor: surfaceBg }}>
          <div className="mx-auto max-w-6xl px-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-14 text-center">
              <motion.p variants={fadeUp} className="mb-3 inline-block rounded-md px-3 py-1 text-xs font-semibold uppercase tracking-widest" style={{ backgroundColor: accentBg, color: accent }}>
                My Work
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-3xl font-bold sm:text-4xl" style={{ color: textColor }}>Projects</motion.h2>
              <motion.div variants={fadeUp} className="mx-auto mt-4 h-0.5 w-14 rounded-full" style={{ backgroundColor: accent }} />
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-10 flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setActiveFilter(cat)}
                  className="rounded-md px-4 py-1.5 text-xs font-medium transition-all"
                  style={{
                    backgroundColor: activeFilter === cat ? accent : 'transparent',
                    color: activeFilter === cat ? '#fff' : textMuted,
                    border: activeFilter === cat ? 'none' : `1px solid ${borderColor}`,
                  }}
                >
                  {cat}
                </button>
              ))}
            </motion.div>

            <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(activeFilter === 'All' ? projects : projects.filter((p) => p.category === activeFilter)).map((project) => (
                <motion.div key={project.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group overflow-hidden rounded-xl" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {project.image ? (
                      <img src={project.image} alt={project.title} className="size-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="flex size-full items-center justify-center text-2xl" style={{ backgroundColor: cardBg, color: textMuted }}>🖼️</div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-90" style={{ backgroundColor: `${accent}e0` }}>
                      <a href={project.link} className="flex size-12 items-center justify-center rounded-full bg-white shadow-lg transition-transform hover:scale-110" style={{ color: darkBg }}>
                        <ExternalLink className="size-5" />
                      </a>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider" style={{ color: accent }}>{project.category}</p>
                    <h3 className="mb-1.5 font-semibold" style={{ color: textColor }}>{project.title}</h3>
                    <p className="line-clamp-2 text-sm" style={{ color: textMuted }}>{project.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── ABOUT ─── */}
      {sections.about && (
        <section id="about" className="py-20 sm:py-28" style={{ backgroundColor: darkBg }}>
          <div className="mx-auto max-w-6xl px-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-14 text-center">
              <motion.p variants={fadeUp} className="mb-3 inline-block rounded-md px-3 py-1 text-xs font-semibold uppercase tracking-widest" style={{ backgroundColor: accentBg, color: accent }}>
                About
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-3xl font-bold sm:text-4xl" style={{ color: textColor }}>{about.title || 'About Me'}</motion.h2>
              <motion.div variants={fadeUp} className="mx-auto mt-4 h-0.5 w-14 rounded-full" style={{ backgroundColor: accent }} />
            </motion.div>
            <div className="grid items-center gap-12 lg:grid-cols-5 lg:gap-16">
              {about.image && (
                <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-2">
                  <div className="relative mx-auto max-w-sm">
                    <div className="absolute -inset-3 rounded-2xl opacity-20" style={{ backgroundColor: accent }} />
                    <div className="relative overflow-hidden rounded-xl">
                      <img src={about.image} alt={about.title} className="w-full object-cover" />
                    </div>
                  </div>
                </motion.div>
              )}
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className={about.image ? 'lg:col-span-3' : 'lg:col-span-5 mx-auto max-w-3xl'}>
                <div className="space-y-4 text-sm leading-relaxed" style={{ color: textMuted }}>
                  {about.description.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
                {about.stats.length > 0 && (
                  <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {about.stats.map((stat, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="rounded-xl p-4 text-center" style={{ backgroundColor: surfaceBg }}>
                        <p className="text-xl font-bold sm:text-2xl" style={{ color: accent }}>{stat.value}</p>
                        <p className="mt-1 text-xs" style={{ color: textMuted }}>{stat.label}</p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* ─── TESTIMONIALS ─── */}
      {sections.testimonials && testimonials.length > 0 && (
        <section className="py-20 sm:py-28" style={{ backgroundColor: surfaceBg }}>
          <div className="mx-auto max-w-4xl px-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-14 text-center">
              <motion.p variants={fadeUp} className="mb-3 inline-block rounded-md px-3 py-1 text-xs font-semibold uppercase tracking-widest" style={{ backgroundColor: accentBg, color: accent }}>
                Testimonials
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-3xl font-bold sm:text-4xl" style={{ color: textColor }}>What People Say</motion.h2>
              <motion.div variants={fadeUp} className="mx-auto mt-4 h-0.5 w-14 rounded-full" style={{ backgroundColor: accent }} />
            </motion.div>
            <div className="grid gap-6 sm:grid-cols-2">
              {testimonials.map((t, i) => (
                <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="rounded-xl border p-6" style={{ backgroundColor: cardBg, borderColor }}>
                  <Quote className="mb-3 size-5" style={{ color: `${accent}40` }} />
                  <p className="mb-4 text-sm leading-relaxed" style={{ color: textMuted }}>"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    {t.avatar ? (
                      <img src={t.avatar} alt={t.name} className="size-10 rounded-full object-cover" />
                    ) : (
                      <div className="flex size-10 items-center justify-center rounded-full text-sm font-bold" style={{ backgroundColor: `${accent}20`, color: accent }}>{t.name.charAt(0)}</div>
                    )}
                    <div>
                      <p className="text-sm font-semibold" style={{ color: textColor }}>{t.name}</p>
                      <p className="text-xs" style={{ color: textMuted }}>{t.role} — {t.company}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── BLOG ─── */}
      {sections.blog && blog.length > 0 && (
        <section id="blog" className="py-20 sm:py-28" style={{ backgroundColor: darkBg }}>
          <div className="mx-auto max-w-6xl px-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-14 text-center">
              <motion.p variants={fadeUp} className="mb-3 inline-block rounded-md px-3 py-1 text-xs font-semibold uppercase tracking-widest" style={{ backgroundColor: accentBg, color: accent }}>
                Blog
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-3xl font-bold sm:text-4xl" style={{ color: textColor }}>Latest Articles</motion.h2>
              <motion.div variants={fadeUp} className="mx-auto mt-4 h-0.5 w-14 rounded-full" style={{ backgroundColor: accent }} />
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blog.map((post) => (
                <motion.article key={post.id} variants={fadeUp} className="group overflow-hidden rounded-xl transition-all hover:-translate-y-1" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {post.image ? <img src={post.image} alt={post.title} className="size-full object-cover transition-transform group-hover:scale-105" /> : <div className="flex size-full items-center justify-center" style={{ color: textMuted }}>📝</div>}
                    <span className="absolute left-3 top-3 rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white" style={{ backgroundColor: accent }}>{post.category}</span>
                  </div>
                  <div className="p-5">
                    <div className="mb-2 flex items-center gap-2 text-xs" style={{ color: textMuted }}><Calendar className="size-3" /> {post.date}</div>
                    <h3 className="mb-2 line-clamp-2 text-sm font-semibold" style={{ color: textColor }}>{post.title}</h3>
                    <a href={post.link} className="inline-flex items-center gap-1 text-xs font-medium transition-all group-hover:gap-1.5" style={{ color: accent }}>
                      Read More <ChevronRight className="size-3" />
                    </a>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── CONTACT ─── */}
      {sections.contact && (
        <section id="contact" className="py-20 sm:py-28" style={{ backgroundColor: surfaceBg }}>
          <div className="mx-auto max-w-6xl px-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-14 text-center">
              <motion.p variants={fadeUp} className="mb-3 inline-block rounded-md px-3 py-1 text-xs font-semibold uppercase tracking-widest" style={{ backgroundColor: accentBg, color: accent }}>
                Contact
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-3xl font-bold sm:text-4xl" style={{ color: textColor }}>Get In Touch</motion.h2>
              <motion.div variants={fadeUp} className="mx-auto mt-4 h-0.5 w-14 rounded-full" style={{ backgroundColor: accent }} />
            </motion.div>
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input type="text" placeholder="Your Name" className="w-full rounded-lg border px-4 py-3 text-sm outline-none transition-colors focus:ring-2" style={{ backgroundColor: cardBg, borderColor, color: textColor }} />
                    <input type="email" placeholder="Your Email" className="w-full rounded-lg border px-4 py-3 text-sm outline-none transition-colors focus:ring-2" style={{ backgroundColor: cardBg, borderColor, color: textColor }} />
                  </div>
                  <input type="text" placeholder="Subject" className="w-full rounded-lg border px-4 py-3 text-sm outline-none transition-colors focus:ring-2" style={{ backgroundColor: cardBg, borderColor, color: textColor }} />
                  <textarea rows={4} placeholder="Message" className="w-full resize-none rounded-lg border px-4 py-3 text-sm outline-none transition-colors focus:ring-2" style={{ backgroundColor: cardBg, borderColor, color: textColor }} />
                  <button type="submit" className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90" style={{ backgroundColor: accent }}>
                    <Send className="size-3.5" /> Send Message
                  </button>
                </form>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-5">
                {contact.email && (
                  <div className="flex items-center gap-4" style={{ color: textMuted }}>
                    <div className="flex size-12 items-center justify-center rounded-xl" style={{ backgroundColor: `${accent}15` }}><Mail className="size-5" style={{ color: accent }} /></div>
                    <div><p className="text-xs" style={{ color: textMuted }}>Email</p><p className="text-sm font-medium" style={{ color: textColor }}>{contact.email}</p></div>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center gap-4" style={{ color: textMuted }}>
                    <div className="flex size-12 items-center justify-center rounded-xl" style={{ backgroundColor: `${accent}15` }}><Phone className="size-5" style={{ color: accent }} /></div>
                    <div><p className="text-xs" style={{ color: textMuted }}>Phone</p><p className="text-sm font-medium" style={{ color: textColor }}>{contact.phone}</p></div>
                  </div>
                )}
                {contact.address && (
                  <div className="flex items-center gap-4" style={{ color: textMuted }}>
                    <div className="flex size-12 items-center justify-center rounded-xl" style={{ backgroundColor: `${accent}15` }}><MapPin className="size-5" style={{ color: accent }} /></div>
                    <div><p className="text-xs" style={{ color: textMuted }}>Location</p><p className="text-sm font-medium" style={{ color: textColor }}>{contact.address}</p></div>
                  </div>
                )}
                {contact.newsletterTitle && (
                  <div className="mt-6 rounded-xl border p-5" style={{ backgroundColor: cardBg, borderColor }}>
                    <h4 className="mb-1 text-sm font-semibold" style={{ color: textColor }}>{contact.newsletterTitle}</h4>
                    <p className="mb-3 text-xs" style={{ color: textMuted }}>{contact.newsletterDescription}</p>
                    <div className="flex gap-2">
                      <input type="email" placeholder="your@email.com" className="flex-1 rounded-lg border px-3 py-2 text-xs outline-none focus:ring-2" style={{ backgroundColor: darkBg, borderColor, color: textColor }} />
                      <button className="rounded-lg px-4 py-2 text-xs font-semibold text-white hover:opacity-90" style={{ backgroundColor: accent }}>Subscribe</button>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* ─── FOOTER ─── */}
      {sections.footer && (
        <footer className="border-t py-12" style={{ backgroundColor: darkBg, borderColor }}>
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 px-6 text-center">
            {footer.socialLinks.length > 0 && (
              <div className="flex gap-3">
                {footer.socialLinks.map((link, i) => (
                  <a key={i} href={link.url} className="flex size-10 items-center justify-center rounded-full transition-all hover:-translate-y-0.5" style={{ border: `1px solid ${borderColor}`, color: textMuted }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = borderColor; e.currentTarget.style.color = textMuted }}
                  >
                    {link.icon === 'github' ? <Github className="size-4" /> :
                     link.icon === 'linkedin' ? <Linkedin className="size-4" /> :
                     link.icon === 'twitter' ? <Twitter className="size-4" /> :
                     <Globe className="size-4" />}
                  </a>
                ))}
              </div>
            )}
            {footer.madeWith && <p className="text-xs" style={{ color: textMuted }}>{footer.madeWith}</p>}
            {footer.copyright && <p className="text-[10px]" style={{ color: textMuted, opacity: 0.6 }}>{footer.copyright}</p>}
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex size-8 items-center justify-center rounded-full transition-all" style={{ backgroundColor: accent, color: '#fff' }}>
              <ArrowUp className="size-3.5" />
            </button>
          </div>
        </footer>
      )}
    </div>
  )
}
