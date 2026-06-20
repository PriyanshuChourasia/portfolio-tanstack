import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Carousal'
import { ResumeSection } from '@/features/resume/components/resume'
import { Projects } from '@/features/works/components/works'
import ArticlePreviewSection from '@/features/articles/components/article-preview'
import ContactSection from '@/features/contact/components/contact'

export default function Home() {
  return (
    <main className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      <Navbar />
      <Hero />
      <ResumeSection />
      <Projects />
      <ArticlePreviewSection />
      <ContactSection />
    </main>
  )
}
