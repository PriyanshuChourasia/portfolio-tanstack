import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  SiHtml5,
  SiTypescript,
  SiSpringboot,
  SiMysql,
  SiMongodb,
  SiReact,
  SiFlutter,
} from 'react-icons/si'
import worksData from '../data/works-data.json'
import socialLinks from '../data/social-link.json'
import resumeData from '../data/resume-data.json'

const allWorks = (worksData as { items: Array<any> }).items
const featuredWorks = [...allWorks].reverse().slice(0, 4)
const languages = resumeData.codingSkills

const languageIcons: Record<string, React.ComponentType<any>> = {
  'HTML / CSS': SiHtml5,
  'TypeScript / JavaScript': SiTypescript,
  'Spring Boot / Laravel': SiSpringboot,
  'MYSQL / PostGres': SiMysql,
  'Mongo-DB': SiMongodb,
  'React / React Native': SiReact,
  'Flutter / Dart': SiFlutter,
}

export function HeroSection() {
  const [featuredIndex, setFeaturedIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setFeaturedIndex((i) => (i + 1) % featuredWorks.length)
    }, 3200)
    return () => clearInterval(id)
  }, [])

  const featuredWork = featuredWorks[featuredIndex]
  const github = socialLinks.find((l) => l.name === 'Github')
  const twitter = socialLinks.find((l) => l.name === 'Twitter')

  return (
    <section
      id="home"
      className="relative h-screen w-full overflow-hidden bg-background"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 12% 15%, color-mix(in oklab, var(--primary-accent) 16%, transparent), transparent 45%), radial-gradient(circle at 88% 85%, color-mix(in oklab, var(--secondary-accent) 22%, transparent), transparent 50%), linear-gradient(135deg, var(--background) 0%, var(--card-dark) 55%, var(--background) 100%)',
        }}
      />
      <div className="h-full grid grid-cols-[1fr_auto_1fr] grid-rows-2 gap-8 p-12 relative">
        {/* Column 1 — Top: Profile image */}
        <div
          className="relative rounded-2xl border border-border overflow-hidden card-shadow hover-lift"
          style={{ backgroundColor: '#F2A25C' }}
        >
          <img
            src="/myimage.webp"
            alt="Priyanshu Chourasia"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </div>

        {/* Column 2 — Language river (spans both rows) */}
        <div className="row-span-2 relative overflow-hidden w-14">
          <div className="language-river flex flex-col items-center gap-3">
            {[...languages, ...languages, ...languages].map((lang, i) => {
              const Icon = languageIcons[lang.name]
              return (
                <div
                  key={`${lang.name}-${i}`}
                  className="flex items-center justify-center h-11 w-11 rounded-xl bg-card border border-border backdrop-blur-md shrink-0"
                  title={lang.name}
                >
                  {Icon ? (
                    <Icon className="h-6 w-6" style={{ color: lang.color }} />
                  ) : (
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: lang.color }}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Column 3 — Top: 4-grid projects + socials */}
        <div
          className="grid grid-cols-2 grid-rows-2 gap-3 rounded-2xl border border-border overflow-hidden p-3 card-shadow"
          style={{ backgroundColor: '#F2A25C' }}
        >
          {/* 1. Ongoing project */}
          <a
            href="https://github.com/PriyanshuChourasia/account_erp"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative rounded-xl border border-border overflow-hidden"
          >
            <img
              src="/opderp.png"
              alt="OPD ERP"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-2">
              <div className="flex items-center gap-1 mb-1">
                <span className="flex h-1.5 w-1.5 shrink-0 items-center justify-center">
                  <span className="absolute inline-flex h-1.5 w-1.5 animate-ping rounded-full bg-destructive opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-destructive" />
                </span>
                <span className="text-[8px] text-destructive font-medium uppercase tracking-wider">
                  Ongoing
                </span>
              </div>
              <p className="text-[10px] font-semibold text-foreground truncate">
                OPD ERP
              </p>
              <p className="text-[8px] text-muted-foreground truncate">
                Accounting &amp; Finance Module
              </p>
            </div>
          </a>

          {/* 2. Project slider */}
          <div className="relative rounded-xl border border-border overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={featuredWork?.title}
                src={featuredWork?.image}
                alt={featuredWork?.title}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-2">
              <AnimatePresence mode="wait">
                <motion.p
                  key={featuredWork?.title}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="text-[10px] font-semibold text-foreground truncate"
                >
                  {featuredWork?.title}
                </motion.p>
              </AnimatePresence>
              <div className="flex gap-0.5 mt-1">
                {featuredWorks.map((_, i) => (
                  <span
                    key={i}
                    className={`h-0.5 rounded-full transition-all duration-300 ${
                      i === featuredIndex ? 'w-2 bg-primary' : 'w-0.5 bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 3. GitHub */}
          {github && (
            <a
              href={github.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-xl border border-border overflow-hidden"
            >
              <img
                src="/githubprofile.png"
                alt="GitHub"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span className="absolute bottom-0 inset-x-0 text-center text-[10px] font-medium text-primary-foreground bg-primary/80 py-1">
                GitHub
              </span>
            </a>
          )}

          {/* 4. Twitter */}
          {twitter && (
            <a
              href={twitter.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-xl border border-border overflow-hidden"
            >
              <img
                src="/twitterImage.png"
                alt="Twitter"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span className="absolute bottom-0 inset-x-0 text-center text-[10px] font-medium text-primary-foreground bg-primary-accent/80 py-1">
                Twitter
              </span>
            </a>
          )}
        </div>

        {/* Column 1 — Bottom: Quadrant 3 */}
        <div
          className="relative rounded-2xl border border-border overflow-hidden card-shadow"
          style={{ backgroundColor: '#F2A25C' }}
        >
          <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold uppercase tracking-wider text-[#3C0100]">
            Quadrant 3
          </span>
        </div>

        {/* Column 3 — Bottom: Quadrant 4 */}
        <div
          className="relative rounded-2xl border border-border overflow-hidden card-shadow"
          style={{ backgroundColor: '#F2A25C' }}
        >
          <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold uppercase tracking-wider text-[#3C0100]">
            Quadrant 4
          </span>
        </div>
      </div>
    </section>
  )
}
