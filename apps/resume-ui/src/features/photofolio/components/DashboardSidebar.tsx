import { memo, useState } from 'react'
import {
  Image as ImageIcon,
  LayoutGrid,
  Type,
  Palette,
  Wand2,
  Sparkles,
  Music,
  SlidersHorizontal,
  Globe,
  Share2,
  Settings,
  HelpCircle,
  ChevronDown,
  Layers,
  Frame,
  Sun,
  CloudUpload,
  CreditCard,
  BarChart3,
  Link2,
  Shield,
  Smartphone,
  MousePointerClick,
  Star,
  Zap,
  Blocks,
  Paintbrush,
  Move,
  Crop,
  RotateCcw,
  FlipHorizontal2,
  Aperture,
  Camera,
  FileText,
  BookOpen,
  MessageSquare,
  Gift,
  TrendingUp,
  FolderOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ComponentStack, type StackEntry } from './ComponentStack'

interface SidebarTool {
  id: string
  label: string
  icon: typeof ImageIcon
  badge?: string
}

interface SidebarSection {
  title: string
  tools: SidebarTool[]
}

const SECTIONS: SidebarSection[] = [
  {
    title: 'Projects',
    tools: [
      { id: 'projects', label: 'My Projects', icon: FolderOpen },
    ],
  },
  {
    title: 'Content',
    tools: [
      { id: 'photos', label: 'Photos', icon: ImageIcon },
      { id: 'videos', label: 'Videos', icon: Camera },
      { id: 'text', label: 'Text & Captions', icon: Type },
      { id: 'audio', label: 'Music & Audio', icon: Music },
      { id: 'files', label: 'File Manager', icon: CloudUpload },
    ],
  },
  {
    title: 'Design',
    tools: [
      { id: 'layouts', label: 'Layouts', icon: LayoutGrid },
      { id: 'design', label: 'Header & Footer', icon: Palette },
      { id: 'templates', label: 'Templates', icon: Blocks },
      { id: 'themes', label: 'Themes & Colors', icon: Palette },
      { id: 'fonts', label: 'Fonts & Typography', icon: Type },
      { id: 'filters', label: 'Filters & Effects', icon: Aperture },
      { id: 'frames', label: 'Frames & Borders', icon: Frame },
    ],
  },
  {
    title: 'Edit',
    tools: [
      { id: 'crop', label: 'Crop & Resize', icon: Crop },
      { id: 'transform', label: 'Transform', icon: Move },
      { id: 'rotate', label: 'Rotate & Flip', icon: FlipHorizontal2 },
      { id: 'adjust', label: 'Brightness & Contrast', icon: Sun },
      { id: 'retouch', label: 'Retouch & Enhance', icon: Wand2 },
    ],
  },
  {
    title: 'Pages',
    tools: [
      { id: 'pages', label: 'Page Manager', icon: Layers },
      { id: 'sections', label: 'Sections', icon: Blocks },
      { id: 'transitions', label: 'Transitions', icon: Sparkles },
    ],
  },
  {
    title: 'Customize',
    tools: [
      { id: 'animations', label: 'Animations', icon: Zap },
      { id: 'slideshow', label: 'Slideshow Settings', icon: Move },
      { id: 'grid', label: 'Grid Options', icon: LayoutGrid },
      { id: 'spacing', label: 'Spacing & Margins', icon: SlidersHorizontal },
      { id: 'backgrounds', label: 'Backgrounds', icon: Paintbrush },
    ],
  },
  {
    title: 'SEO & Meta',
    tools: [
      { id: 'seo', label: 'SEO Settings', icon: TrendingUp },
      { id: 'meta', label: 'Meta Tags', icon: FileText },
      { id: 'og-image', label: 'OG Image', icon: ImageIcon },
      { id: 'sitemap', label: 'Sitemap', icon: Globe },
    ],
  },
  {
    title: 'Publish',
    tools: [
      { id: 'domain', label: 'Custom Domain', icon: Link2 },
      { id: 'share', label: 'Share & Social', icon: Share2 },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      { id: 'password', label: 'Password Protect', icon: Shield },
      { id: 'mobile', label: 'Mobile Preview', icon: Smartphone },
    ],
  },
  {
    title: 'Manage',
    tools: [
      { id: 'comments', label: 'Comments', icon: MessageSquare },
      { id: 'feedback', label: 'Visitor Feedback', icon: Star },
      { id: 'versions', label: 'Version History', icon: RotateCcw },
      { id: 'backup', label: 'Backup & Restore', icon: CreditCard },
      { id: 'integrations', label: 'Integrations', icon: Gift },
    ],
  },
  {
    title: 'Help',
    tools: [
      { id: 'docs', label: 'Documentation', icon: BookOpen },
      { id: 'tips', label: 'Tips & Tricks', icon: MousePointerClick },
      { id: 'support', label: 'Support', icon: HelpCircle },
    ],
  },
]

interface DashboardSidebarProps {
  activeTool: string
  onToolChange: (tool: string) => void
  collapsed: boolean
  onToggleCollapse: () => void
  history: StackEntry[]
  onUndo: (entry: StackEntry) => void
  onRedo: (entry: StackEntry) => void
  onClearHistory: () => void
}

export const DashboardSidebar = memo(function DashboardSidebar({
  activeTool,
  onToolChange,
  collapsed,
  history,
  onUndo,
  onRedo,
  onClearHistory,
}: DashboardSidebarProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(['Projects', 'Content']),
  )

  const toggleSection = (title: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev)
      if (next.has(title)) next.delete(title)
      else next.add(title)
      return next
    })
  }

  if (collapsed) {
    return (
      <div className="flex w-[52px] shrink-0 flex-col items-center border-r border-border/60 bg-card/40 py-3 gap-1 overflow-y-auto custom-scrollbar">
        {SECTIONS.flatMap((section) =>
          section.tools.map((tool) => {
            const Icon = tool.icon
            return (
              <button
                key={tool.id}
                onClick={() => onToolChange(tool.id)}
                title={tool.label}
                className={cn(
                  'relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
                  activeTool === tool.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <Icon className="h-4 w-4" />
                {tool.badge && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                    {tool.badge}
                  </span>
                )}
              </button>
            )
          }),
        )}
      </div>
    )
  }

  return (
    <div className="flex w-[260px] shrink-0 flex-col border-r border-border/60 bg-card/40 overflow-hidden">
      {/* Sidebar header */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-border/60 px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="text-xs font-bold text-foreground tracking-wide">TOOLS</span>
        </div>
      </div>

      {/* Tool sections */}
      <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
        {SECTIONS.map((section) => {
          const isOpen = openSections.has(section.title)
          return (
            <div key={section.title} className="mb-1">
              {/* Section header */}
              <button
                onClick={() => toggleSection(section.title)}
                className="flex w-full items-center justify-between px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 hover:text-muted-foreground transition-colors"
              >
                {section.title}
                <ChevronDown
                  className={cn(
                    'h-3 w-3 transition-transform duration-200',
                    isOpen ? 'rotate-0' : '-rotate-90',
                  )}
                />
              </button>

              {/* Tools */}
              {isOpen && (
                <div className="space-y-0.5 px-2">
                  {section.tools.map((tool) => {
                    const Icon = tool.icon
                    const isActive = activeTool === tool.id
                    return (
                      <button
                        key={tool.id}
                        onClick={() => onToolChange(tool.id)}
                        className={cn(
                          'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-xs transition-all duration-150',
                          isActive
                            ? 'bg-primary/10 text-primary font-semibold'
                            : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                        )}
                      >
                        <Icon className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{tool.label}</span>
                        {tool.badge && (
                          <span
                            className={cn(
                              'ml-auto flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold',
                              isActive
                                ? 'bg-primary/20 text-primary'
                                : 'bg-muted text-muted-foreground',
                            )}
                          >
                            {tool.badge}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Stack section */}
      <div className="shrink-0 border-t border-border/60">
        <ComponentStack
          history={history}
          onUndo={onUndo}
          onRedo={onRedo}
          onClear={onClearHistory}
        />
      </div>

      {/* Sidebar footer */}
      <div className="shrink-0 border-t border-border/60 p-2 space-y-0.5">
        <button className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors">
          <Settings className="h-3.5 w-3.5" />
          Settings
        </button>
        <button className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors">
          <HelpCircle className="h-3.5 w-3.5" />
          Help & Support
        </button>
      </div>
    </div>
  )
})
