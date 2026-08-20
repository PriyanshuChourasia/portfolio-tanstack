import {
  Award,
  BookOpen,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Code2,
  FileText,
  FolderKanban,
  GraduationCap,
  Link2,
  MessageSquareQuote,
  Palette,
  Plus,
  Settings,
  User,
} from 'lucide-react'
import { useBuilder } from '../../store/portfolio-store'
import { SECTION_LABELS } from '../../data/defaults'
import type { ContentPanel, SectionId } from '../../types/portfolio'
import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

const SECTION_ICONS: Record<SectionId, LucideIcon> = {
  profile: User,
  about: FileText,
  experience: Briefcase,
  projects: FolderKanban,
  skills: Code2,
  education: GraduationCap,
  certifications: Award,
  services: Settings,
  testimonials: MessageSquareQuote,
  publications: BookOpen,
  'social-links': Link2,
}

export function BuilderSidebar() {
  const {
    activePortfolio,
    contentPanel,
    setContentPanel,
    editorPanel,
    setEditorPanel,
    sidebarCollapsed,
    setSidebarCollapsed,
    toggleSection,
  } = useBuilder()

  const sections = activePortfolio?.sections ?? []

  const enabledSections = sections.filter((s) => s.enabled)
  const disabledSections = sections.filter((s) => !s.enabled)

  const handleSectionClick = (id: SectionId) => {
    setEditorPanel('content')
    setContentPanel(id)
  }

  return (
    <aside
      className={cn(
        'h-full border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-all duration-300 flex flex-col shrink-0',
        sidebarCollapsed ? 'w-14' : 'w-60',
      )}
    >
      <div className="flex items-center justify-between p-2 border-b border-slate-100 dark:border-slate-800/50">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-1 px-2">
            <Button
              variant={editorPanel === 'content' ? 'default' : 'ghost'}
              size="sm"
              className="h-7 text-xs flex-1"
              onClick={() => setEditorPanel('content')}
            >
              Content
            </Button>
            <Button
              variant={editorPanel === 'design' ? 'default' : 'ghost'}
              size="sm"
              className="h-7 text-xs flex-1"
              onClick={() => setEditorPanel('design')}
            >
              Design
            </Button>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>

      <ScrollArea className="flex-1">
        {editorPanel === 'content' ? (
          <div className="p-2 space-y-1">
            {!sidebarCollapsed && (
              <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 py-1">
                Sections
              </p>
            )}
            {enabledSections.map((section) => {
              const Icon = SECTION_ICONS[section.id]
              const isActive = contentPanel === section.id
              return (
                <button
                  key={section.id}
                  onClick={() => handleSectionClick(section.id)}
                  className={cn(
                    'w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors',
                    isActive
                      ? 'bg-cyan-50 dark:bg-cyan-950/30 text-cyan-600 dark:text-cyan-400 font-medium'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900',
                  )}
                  title={
                    sidebarCollapsed ? SECTION_LABELS[section.id] : undefined
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!sidebarCollapsed && (
                    <span className="truncate">
                      {section.title || SECTION_LABELS[section.id]}
                    </span>
                  )}
                </button>
              )
            })}

            {disabledSections.length > 0 && !sidebarCollapsed && (
              <>
                <Separator className="my-2" />
                <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 py-1">
                  Disabled
                </p>
                {disabledSections.map((section) => {
                  const Icon = SECTION_ICONS[section.id]
                  return (
                    <button
                      key={section.id}
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-slate-400 dark:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors opacity-60"
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">
                        {section.title || SECTION_LABELS[section.id]}
                      </span>
                      <Plus className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100" />
                    </button>
                  )
                })}
              </>
            )}
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {!sidebarCollapsed && (
              <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 py-1">
                Design
              </p>
            )}
            {(['templates', 'colors', 'typography', 'layout'] as const).map(
              (panel) => {
                const labels: Record<string, string> = {
                  templates: 'Templates',
                  colors: 'Colors',
                  typography: 'Typography',
                  layout: 'Layout',
                }
                const icons: Record<string, LucideIcon> = {
                  templates: Palette,
                  colors: Palette,
                  typography: FileText,
                  layout: Settings,
                }
                const Icon = icons[panel]
                return (
                  <button
                    key={panel}
                    onClick={() => {
                      setContentPanel(panel)
                    }}
                    className={cn(
                      'w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors',
                      contentPanel === panel
                        ? 'bg-cyan-50 dark:bg-cyan-950/30 text-cyan-600 dark:text-cyan-400 font-medium'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900',
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {!sidebarCollapsed && <span>{labels[panel]}</span>}
                  </button>
                )
              },
            )}
          </div>
        )}
      </ScrollArea>
    </aside>
  )
}
