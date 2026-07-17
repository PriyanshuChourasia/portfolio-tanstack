import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Carousal'
import AboutSection from '@/features/aboutus/components/aboutus'
import { ResumeSection } from '@/features/resume/components/resume'
import { Projects } from '@/features/works/components/works'
import ArticlePreviewSection from '@/features/articles/components/article-preview'
import { InterviewPreviewSection } from '@/features/ai-interview'
import Articles from '@/features/articles/components/articles'
import ContactSection from '@/features/contact/components/contact'

export default function Home() {
  return (
    <main className="text-slate-900 dark:text-white">
      <Navbar />
      <Hero />
      <AboutSection />
      <ResumeSection />
      <InterviewPreviewSection />
      <ArticlePreviewSection />
      <Projects />
      <Articles />
      <ContactSection />
    </main>
  )
}
