import GetToKnowMe from '@/features/aboutus/components/GetToKnowMe'
import JourneySection from '@/features/aboutus/components/JourneySection'
import StackSection from '@/features/aboutus/components/StackSection'
import WhereIBuiltSection from '@/features/aboutus/components/WhereIBuiltSection'
import { HeroSection } from '@/components/HeroSection'
import { ProjectsParallax } from '@/features/works/components/ProjectsParallax'
import LetsConnectSection from '@/features/contact/components/LetsConnectSection'

export default function Home() {
  return (
    <main className="text-slate-900 text-foreground">
      <HeroSection />
      <ProjectsParallax />
      <GetToKnowMe />
      <JourneySection />
      <WhereIBuiltSection />
      <StackSection />
      <LetsConnectSection />
    </main>
  )
}