import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Send,
  ExternalLink,
  Quote,
  Calendar,
  ArrowUp,
  Github,
  Linkedin,
  Twitter,
  Globe,
} from 'lucide-react'
import type { PortfolioTemplateProps } from './types'

/* ── Mikon: minimal, single-page, clean professional design ── */

export function MikonTemplate({ data }: PortfolioTemplateProps) {
  const { hero, about, services, skills, stats, projects, testimonials, blog, contact, footer, sections, theme } = data
  const [activeFilter, setActiveFilter] = useState('All')

  const categories = ['All', ...new Set(projects.map((p) => p.category))]

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.08 },
    }),
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans">

      {/* ─── NAV ─── */}
      <nav className="fixed top-0 z-50 w-full border-b border-zinc-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
          <button onClick={() => scrollTo('home')} className="text-lg font-bold tracking-tight">
            {hero.name ? hero.name.split(' ')[0] : 'Portfolio'}
            <span className="text-blue-600">.</span>
          </button>
          <div className="hidden items-center gap-6 md:flex">
            {['home', 'about', 'services', 'projects', 'contact'].filter((s) => {
              if (s === 'home') return sections.hero
              if (s === 'about') return sections.about
              if (s === 'services') return sections.services || sections.skills
              if (s === 'projects') return sections.projects
              if (s === 'contact') return sections.contact
              return false
            }).map((item) => (
              <button key={item} onClick={() => scrollTo(item)} className="text-sm font-medium capitalize text-zinc-500 transition-colors hover:text-zinc-900">
                {item}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      {sections.hero && (
        <section id="home" className="flex min-h-screen items-center bg-gradient-to-br from-blue-50 via-white to-zinc-50 pt-16">
          <div className="mx-auto flex w-full max-w-5xl flex-col-reverse items-center gap-10 px-6 py-16 md:flex-row md:py-20">
            <motion.div initial="hidden" animate="visible" className="flex-1 space-y-5 text-center md:text-left">
              <motion.p variants={fadeUp} className="inline-block rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-blue-700">
                Portfolio
              </motion.p>
              <motion.h1 variants={fadeUp} className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Hi, I'm{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {hero.name || 'Your Name'}
                </span>
              </motion.h1>
              <motion.h2 variants={fadeUp} className="text-xl font-medium text-zinc-500 sm:text-2xl">
                {hero.title || 'Your Title'}
              </motion.h2>
              {hero.tagline && (
                <motion.p variants={fadeUp} className="mx-auto max-w-lg text-zinc-400 md:mx-0">
                  {hero.tagline}
                </motion.p>
              )}
              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3 pt-2 md:justify-start">
                {hero.resumeUrl && (
                  <a href={hero.resumeUrl} className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-zinc-800">
                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                    Resume
                  </a>
                )}
                <a href="#contact" className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition-all hover:border-zinc-300 hover:bg-zinc-50">
                  Contact Me <ChevronRight className="size-3.5" />
                </a>
              </motion.div>
              {hero.socialLinks.length > 0 && (
                <motion.div variants={fadeUp} className="flex items-center gap-3 pt-2 md:justify-start">
                  {hero.socialLinks.map((link, i) => (
                    <a key={i} href={link.url} className="flex size-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-400 transition-all hover:border-blue-200 hover:text-blue-600" title={link.platform}>
                      {link.icon === 'github' ? <Github className="size-3.5" /> :
                        link.icon === 'linkedin' ? <Linkedin className="size-3.5" /> :
                          link.icon === 'twitter' ? <Twitter className="size-3.5" /> :
                            <Globe className="size-3.5" />}
                    </a>
                  ))}
                </motion.div>
              )}
            </motion.div>
            {hero.profileImage && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="shrink-0">
                <div className="size-56 overflow-hidden rounded-2xl shadow-lg sm:size-64 ring-1 ring-zinc-100">
                  <img src={hero.profileImage} alt={hero.name} className="size-full object-cover" />
                </div>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* ─── ABOUT ─── */}
      {sections.about && (
        <section id="about" className="border-t border-zinc-100 bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mx-auto max-w-3xl text-center">
              <motion.p variants={fadeUp} className="mb-2 inline-block rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-blue-700">
                About
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-3xl font-bold sm:text-4xl">{about.title || 'About Me'}</motion.h2>
              <div className="mx-auto mt-4 h-0.5 w-12 rounded-full bg-blue-500" />
              <motion.p variants={fadeUp} className="mt-6 text-base leading-relaxed text-zinc-500 sm:text-lg">
                {about.description}
              </motion.p>
            </motion.div>
            {about.stats.length > 0 && (
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {about.stats.map((stat, i) => (
                  <motion.div key={i} variants={fadeUp} className="rounded-xl border border-zinc-100 bg-white p-5 text-center shadow-sm">
                    <p className="text-2xl font-bold text-blue-600">{stat.value}</p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wider text-zinc-400">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* ─── SERVICES ─── */}
      {sections.services && services.length > 0 && (
        <section id="services" className="border-t border-zinc-100 bg-zinc-50/50 py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-14 text-center">
              <motion.p variants={fadeUp} className="mb-2 inline-block rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-blue-700">
                What I Do
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-3xl font-bold sm:text-4xl">Services</motion.h2>
              <div className="mx-auto mt-4 h-0.5 w-12 rounded-full bg-blue-500" />
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { transition: { staggerChildren: 0.08 } } }} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <motion.div key={s.id} variants={fadeUp} className="group rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4M12 8h.01" />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-base font-semibold">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-zinc-500">{s.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── SKILLS ─── */}
      {sections.skills && skills.length > 0 && (
        <section className="border-t border-zinc-100 bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-3xl px-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-14 text-center">
              <motion.p variants={fadeUp} className="mb-2 inline-block rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-blue-700">
                Expertise
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-3xl font-bold sm:text-4xl">Skills</motion.h2>
              <div className="mx-auto mt-4 h-0.5 w-12 rounded-full bg-blue-500" />
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-5">
              {skills.map((skill, i) => (
                <motion.div key={skill.id} variants={fadeUp} custom={i}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium">{skill.name}</span>
                    <span className="font-semibold text-blue-600">{skill.percentage}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
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
        <section className="bg-blue-600 py-16 text-white">
          <div className="mx-auto max-w-5xl px-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { transition: { staggerChildren: 0.12 } } }} className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {stats.map((stat) => (
                <motion.div key={stat.id} variants={fadeUp} className="text-center">
                  <p className="text-3xl font-bold sm:text-4xl">{stat.value}<span className="text-lg opacity-70">{stat.suffix}</span></p>
                  <p className="mt-1 text-sm font-medium uppercase tracking-wider opacity-80">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── PROJECTS ─── */}
      {sections.projects && projects.length > 0 && (
        <section id="projects" className="border-t border-zinc-100 bg-zinc-50/50 py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-14 text-center">
              <motion.p variants={fadeUp} className="mb-2 inline-block rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-blue-700">
                Work
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-3xl font-bold sm:text-4xl">Projects</motion.h2>
              <div className="mx-auto mt-4 h-0.5 w-12 rounded-full bg-blue-500" />
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-10 flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setActiveFilter(cat)}
                  className={`rounded-md px-4 py-1.5 text-xs font-medium transition-all ${activeFilter === cat ? 'bg-zinc-900 text-white shadow-sm' : 'bg-white text-zinc-500 hover:text-zinc-800 border border-zinc-200'
                    }`}>
                  {cat}
                </button>
              ))}
            </motion.div>

            <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(activeFilter === 'All' ? projects : projects.filter((p) => p.category === activeFilter)).map((project) => (
                <motion.div key={project.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md">
                  <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
                    {project.image ? (
                      <img src={project.image} alt={project.title} className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="flex size-full items-center justify-center text-zinc-300 text-2xl">🖼️</div>
                    )}
                    <a href={project.link} className="absolute inset-0 flex items-center justify-center bg-zinc-900/50 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="flex size-10 items-center justify-center rounded-full bg-white text-zinc-900 shadow"><ExternalLink className="size-4" /></span>
                    </a>
                  </div>
                  <div className="p-5">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-blue-600">{project.category}</p>
                    <h3 className="mb-1.5 font-semibold">{project.title}</h3>
                    <p className="line-clamp-2 text-sm text-zinc-500">{project.description}</p>
                    {project.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                          <span key={tag} className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── TESTIMONIALS ─── */}
      {sections.testimonials && testimonials.length > 0 && (
        <section className="border-t border-zinc-100 bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-3xl px-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-14 text-center">
              <motion.p variants={fadeUp} className="mb-2 inline-block rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-blue-700">Testimonials</motion.p>
              <motion.h2 variants={fadeUp} className="text-3xl font-bold sm:text-4xl">What People Say</motion.h2>
              <div className="mx-auto mt-4 h-0.5 w-12 rounded-full bg-blue-500" />
            </motion.div>
            <div className="space-y-6">
              {testimonials.map((t, i) => (
                <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="rounded-xl border border-zinc-100 bg-zinc-50 p-6">
                  <Quote className="mb-3 size-6 text-blue-200" />
                  <p className="mb-4 text-sm leading-relaxed text-zinc-500 italic">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    {t.avatar ? (
                      <img src={t.avatar} alt={t.name} className="size-10 rounded-full object-cover" />
                    ) : (
                      <div className="flex size-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">{t.name.charAt(0)}</div>
                    )}
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-zinc-400">{t.role} — {t.company}</p>
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
        <section className="border-t border-zinc-100 bg-zinc-50/50 py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-14 text-center">
              <motion.p variants={fadeUp} className="mb-2 inline-block rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-blue-700">Blog</motion.p>
              <motion.h2 variants={fadeUp} className="text-3xl font-bold sm:text-4xl">Latest Posts</motion.h2>
              <div className="mx-auto mt-4 h-0.5 w-12 rounded-full bg-blue-500" />
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blog.map((post) => (
                <motion.article key={post.id} variants={fadeUp} className="group overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                  <div className="aspect-[16/9] overflow-hidden bg-zinc-100">
                    {post.image ? <img src={post.image} alt={post.title} className="size-full object-cover transition-transform group-hover:scale-105" /> : <div className="flex size-full items-center justify-center text-zinc-300">📝</div>}
                  </div>
                  <div className="p-5">
                    <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400"><Calendar className="size-3" /> {post.date}</div>
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-blue-600">{post.category}</p>
                    <h3 className="mb-2 line-clamp-2 text-sm font-semibold">{post.title}</h3>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── CONTACT ─── */}
      {sections.contact && (
        <section id="contact" className="border-t border-zinc-100 bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-14 text-center">
              <motion.p variants={fadeUp} className="mb-2 inline-block rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-blue-700">Contact</motion.p>
              <motion.h2 variants={fadeUp} className="text-3xl font-bold sm:text-4xl">Get In Touch asjhdfasjdk</motion.h2>
              <div className="mx-auto mt-4 h-0.5 w-12 rounded-full bg-blue-500" />
            </motion.div>
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input type="text" placeholder="Your Name" className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-blue-400" />
                    <input type="email" placeholder="Your Email" className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-blue-400" />
                  </div>
                  <input type="text" placeholder="Subject" className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-blue-400" />
                  <textarea rows={4} placeholder="Message" className="w-full resize-none rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-blue-400" />
                  <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-zinc-800">
                    <Send className="size-3.5" /> Send Message
                  </button>
                </form>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-5">
                {contact.email && (
                  <div className="flex items-center gap-3 text-zinc-500"><div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600"><Mail className="size-4" /></div><div><p className="text-xs text-zinc-400">Email</p><p className="text-sm font-medium text-zinc-800">{contact.email}</p></div></div>
                )}
                {contact.phone && (
                  <div className="flex items-center gap-3 text-zinc-500"><div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600"><Phone className="size-4" /></div><div><p className="text-xs text-zinc-400">Phone</p><p className="text-sm font-medium text-zinc-800">{contact.phone}</p></div></div>
                )}
                {contact.address && (
                  <div className="flex items-center gap-3 text-zinc-500"><div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600"><MapPin className="size-4" /></div><div><p className="text-xs text-zinc-400">Location</p><p className="text-sm font-medium text-zinc-800">{contact.address}</p></div></div>
                )}
                {contact.newsletterTitle && (
                  <div className="mt-6 rounded-xl border border-zinc-100 bg-zinc-50 p-5">
                    <h4 className="mb-1 text-sm font-semibold">{contact.newsletterTitle}</h4>
                    <p className="mb-3 text-xs text-zinc-400">{contact.newsletterDescription}</p>
                    <div className="flex gap-2">
                      <input type="email" placeholder="your@email.com" className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-400" />
                      <button className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700">Subscribe</button>
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
        <footer className="border-t border-zinc-100 bg-zinc-900 text-zinc-400">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-10 text-center">
            {footer.socialLinks.length > 0 && (
              <div className="flex gap-3">
                {footer.socialLinks.map((link, i) => (
                  <a key={i} href={link.url} className="flex size-9 items-center justify-center rounded-full border border-zinc-700 text-zinc-500 transition-all hover:border-zinc-500 hover:text-white">
                    {link.icon === 'github' ? <Github className="size-3.5" /> :
                      link.icon === 'linkedin' ? <Linkedin className="size-3.5" /> :
                        link.icon === 'twitter' ? <Twitter className="size-3.5" /> :
                          <Globe className="size-3.5" />}
                  </a>
                ))}
              </div>
            )}
            {footer.madeWith && <p className="text-xs text-zinc-500">{footer.madeWith}</p>}
            {footer.copyright && <p className="text-[10px] text-zinc-600">{footer.copyright}</p>}
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex size-8 items-center justify-center rounded-full border border-zinc-700 text-zinc-500 transition-all hover:border-white hover:text-white">
              <ArrowUp className="size-3.5" />
            </button>
          </div>
        </footer>
      )}
    </div>
  )
}
