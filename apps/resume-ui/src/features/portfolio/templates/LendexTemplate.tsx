import { HeroSection } from '../components/HeroSection'
import { AboutSection } from '../components/AboutSection'
import { ServicesSection } from '../components/ServicesSection'
import { SkillsSection } from '../components/SkillsSection'
import { StatsSection } from '../components/StatsSection'
import { ProjectsSection } from '../components/ProjectsSection'
import { TestimonialsSection } from '../components/TestimonialsSection'
import { BlogSection } from '../components/BlogSection'
import { ContactSection } from '../components/ContactSection'
import { FooterSection } from '../components/FooterSection'
import type { PortfolioTemplateProps } from './types'

export function LendexTemplate({ data }: PortfolioTemplateProps) {
  const { sections, theme } = data

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.background }}>
      {/* Navigation */}
      <nav
        className="fixed top-0 z-50 w-full backdrop-blur-md"
        style={{
          backgroundColor: `${theme.surface}dd`,
          borderBottomColor: `${theme.textMuted}15`,
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span
            className="text-lg font-bold"
            style={{ color: theme.text }}
          >
            {'<'}<span style={{ color: theme.accent }}>Portfolio</span>{'/>'}
          </span>
          <div className="hidden items-center gap-8 md:flex">
            {sections.hero && (
              <a href="#home" className="text-sm font-medium transition-colors duration-200 hover:opacity-80" style={{ color: theme.textMuted }}>Home</a>
            )}
            {sections.about && (
              <a href="#about" className="text-sm font-medium transition-colors duration-200 hover:opacity-80" style={{ color: theme.textMuted }}>About</a>
            )}
            {sections.services && (
              <a href="#services" className="text-sm font-medium transition-colors duration-200 hover:opacity-80" style={{ color: theme.textMuted }}>Services</a>
            )}
            {sections.skills && (
              <a href="#skills" className="text-sm font-medium transition-colors duration-200 hover:opacity-80" style={{ color: theme.textMuted }}>Skills</a>
            )}
            {sections.projects && (
              <a href="#projects" className="text-sm font-medium transition-colors duration-200 hover:opacity-80" style={{ color: theme.textMuted }}>Projects</a>
            )}
            {sections.testimonials && (
              <a href="#testimonials" className="text-sm font-medium transition-colors duration-200 hover:opacity-80" style={{ color: theme.textMuted }}>Testimonials</a>
            )}
            {sections.blog && (
              <a href="#blog" className="text-sm font-medium transition-colors duration-200 hover:opacity-80" style={{ color: theme.textMuted }}>Blog</a>
            )}
            {sections.contact && (
              <a href="#contact" className="rounded-full px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg" style={{ backgroundColor: theme.accent }}>
                Contact
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Sections */}
      {sections.hero && <HeroSection hero={data.hero} theme={theme} />}
      {sections.about && <AboutSection about={data.about} theme={theme} />}
      {sections.services && <ServicesSection services={data.services} theme={theme} />}
      {sections.skills && <SkillsSection skills={data.skills} theme={theme} />}
      {sections.stats && <StatsSection stats={data.stats} theme={theme} />}
      {sections.projects && <ProjectsSection projects={data.projects} theme={theme} />}
      {sections.testimonials && <TestimonialsSection testimonials={data.testimonials} theme={theme} />}
      {sections.blog && <BlogSection posts={data.blog} theme={theme} />}
      {sections.contact && <ContactSection contact={data.contact} theme={theme} />}
      {sections.footer && <FooterSection footer={data.footer} theme={theme} />}
    </div>
  )
}
