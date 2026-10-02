import { createFileRoute } from '@tanstack/react-router'
import { HeroSection } from '@/components/HeroSection'
import { BlogChainSection } from '@/components/BlogChainSection'
import { AboutSection } from '@/components/AboutSection'
import { ContactSection } from '@/components/ContactSection'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <main>
        <HeroSection />
        <BlogChainSection />
        <AboutSection />
        <ContactSection />
      </main>
    </div>
  )
}
