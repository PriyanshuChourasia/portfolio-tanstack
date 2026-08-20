import { useBuilder } from '../../store/portfolio-store'
import { ProfileEditor } from '../editors/profile-editor'
import { AboutEditor } from '../editors/about-editor'
import { ExperienceEditor } from '../editors/experience-editor'
import { ProjectEditor } from '../editors/project-editor'
import { SkillEditor } from '../editors/skill-editor'
import { EducationEditor } from '../editors/education-editor'
import { CertificationEditor } from '../editors/certification-editor'
import { ServiceEditor } from '../editors/service-editor'
import { TestimonialEditor } from '../editors/testimonial-editor'
import { PublicationEditor } from '../editors/publication-editor'
import { SocialLinksEditor } from '../editors/social-links-editor'
import { TemplateSelector } from '../design/template-selector'
import { ColorCustomizer } from '../design/color-customizer'
import { TypographyCustomizer } from '../design/typography-customizer'
import { LayoutCustomizer } from '../design/layout-customizer'
import { ScrollArea } from '@/components/ui/scroll-area'

export function BuilderEditor() {
  const { contentPanel, editorPanel } = useBuilder()

  const renderContentEditor = () => {
    switch (contentPanel) {
      case 'profile':
        return <ProfileEditor />
      case 'about':
        return <AboutEditor />
      case 'experience':
        return <ExperienceEditor />
      case 'projects':
        return <ProjectEditor />
      case 'skills':
        return <SkillEditor />
      case 'education':
        return <EducationEditor />
      case 'certifications':
        return <CertificationEditor />
      case 'services':
        return <ServiceEditor />
      case 'testimonials':
        return <TestimonialEditor />
      case 'publications':
        return <PublicationEditor />
      case 'social-links':
        return <SocialLinksEditor />
      case 'templates':
        return <TemplateSelector />
      case 'colors':
        return <ColorCustomizer />
      case 'typography':
        return <TypographyCustomizer />
      case 'layout':
        return <LayoutCustomizer />
      default:
        return <ProfileEditor />
    }
  }

  return (
    <aside className="h-full border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 w-80 lg:w-96 flex flex-col shrink-0">
      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/50">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {editorPanel === 'content' ? 'Edit Section' : 'Design Settings'}
        </h3>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4">{renderContentEditor()}</div>
      </ScrollArea>
    </aside>
  )
}
