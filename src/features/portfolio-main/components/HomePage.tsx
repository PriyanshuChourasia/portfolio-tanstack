  

import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Carousal'
import AboutSection from '@/features/aboutus/components/aboutus'
import { ResumeSection } from '@/features/resume/components/resume'
import { Projects } from '@/features/works/components/works'
import ArticlePreviewSection from '@/features/articles/components/article-preview'
import Articles from '@/features/articles/components/articles'
import ContactSection from '@/features/contact/components/contact'

export default function Home() {
  return (
    <main className="bg-slate-950 text-white ">
      <Navbar />
      <Hero />
      <AboutSection />
      <ArticlePreviewSection />
      <ResumeSection />
      <Projects />
      <Articles />
      <ContactSection />
    </main>
  )
}
