import GetToKnowMe from '@/features/aboutus/components/GetToKnowMe'
import AboutSection from '@/features/aboutus/components/aboutus'
import { ResumeSection } from '@/features/resume/components/resume'
import { Projects } from '@/features/works/components/works'
import ArticlePreviewSection from '@/features/articles/components/article-preview'
import Articles from '@/features/articles/components/articles'
import ContactSection from '@/features/contact/components/contact'
import { HeroSection } from '@/components/HeroSection'

export default function Home() {
  return (
    <main className="text-slate-900 text-foreground">
      <HeroSection />
      <GetToKnowMe />
      <AboutSection />
      <ResumeSection />
      <ArticlePreviewSection />
      <Projects />
      <Articles />
      <ContactSection />
    </main>
  )
}
