import GetToKnowMe from '@/features/aboutus/components/GetToKnowMe'
import AboutSection from '@/features/aboutus/components/aboutus'
import { Projects } from '@/features/works/components/works'
import ContactSection from '@/features/contact/components/contact'
import { HeroSection } from '@/components/HeroSection'
import { ProjectsParallax } from '@/features/works/components/ProjectsParallax'

export default function Home() {
  return (
    <main className="text-slate-900 text-foreground">
      <HeroSection />
      <ProjectsParallax />
      <GetToKnowMe />
      <AboutSection />
      <Projects />
      <ContactSection />
    </main>
  )
}
