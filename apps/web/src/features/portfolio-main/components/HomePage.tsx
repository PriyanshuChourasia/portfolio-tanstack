import GetToKnowMe from '@/features/aboutus/components/GetToKnowMe'
import AboutSection from '@/features/aboutus/components/aboutus'
import JourneySection from '@/features/aboutus/components/JourneySection'
import WhereIBuiltSection from '@/features/aboutus/components/WhereIBuiltSection'
import StackSection from '@/features/aboutus/components/StackSection'
import ContactSection from '@/features/contact/components/contact'
import { HeroSection } from '@/components/HeroSection'
import { ProjectsParallax } from '@/features/works/components/ProjectsParallax'

export default function Home() {
  return (
    <main className="text-slate-900 text-foreground">
      <HeroSection />
      <ProjectsParallax />
      <GetToKnowMe />
      <JourneySection />
      <WhereIBuiltSection />
      <StackSection />
      <AboutSection />
      <ContactSection />
    </main>
  )
}
