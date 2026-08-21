import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { DashboardSidebar } from './DashboardSidebar'
import { ToolPanel } from './ToolPanel'
import type { StackEntry } from './ComponentStack'
import {
  PanelLeftClose,
  PanelLeftOpen,
  Eye,
  Undo2,
  Redo2,
  Download,
  Sparkles,
} from 'lucide-react'


export type ScreenType = 'desktop' | 'tablet' | 'mobile'
export type LayoutType = 'grid' | 'masonry' | 'single' | 'freeform' | '2col' | '3col' | 'hero' | 'fullscreen' | 'split' | 'carousel' | 'wall' | 'filmstrip' | 'spotlight'

export type HeaderPosition = 'top' | 'left' | 'right'

export interface PhotofolioSettings {
  screenType: ScreenType
  layout: LayoutType
  hasHeader: boolean
  headerPosition: HeaderPosition
  hasFooter: boolean
  columns: { desktop: number; tablet: number; mobile: number }
  gap: number
  accentColor: string
  template: string
}

export interface SelectedProject {
  id: string
  name: string
  description?: string
}

interface DashboardLayoutProps {
  activeTool: string
  onToolChange: (tool: string) => void
}

export function DashboardLayout({ activeTool, onToolChange }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [selectedProject, setSelectedProject] = useState<SelectedProject | null>(null)
  const [history, setHistory] = useState<StackEntry[]>([])
  const [settings, setSettings] = useState<PhotofolioSettings>({
    screenType: 'desktop',
    layout: 'grid',
    hasHeader: true,
    headerPosition: 'top',
    hasFooter: true,
    columns: { desktop: 3, tablet: 2, mobile: 1 },
    gap: 16,
    accentColor: '#00d4ff',
    template: 'modern',
  })

  const updateSettings = useCallback((partial: Partial<PhotofolioSettings>) => {
    setSettings((prev) => {
      // Track the change
      const changedKeys = Object.keys(partial)
      for (const key of changedKeys) {
        const prevValue = prev[key as keyof PhotofolioSettings]
        const newValue = partial[key as keyof PhotofolioSettings]
        if (JSON.stringify(prevValue) !== JSON.stringify(newValue)) {
          const componentName = key.includes('Header') ? 'Header' :
                               key.includes('Footer') ? 'Footer' :
                               key.includes('layout') ? 'Layout' :
                               key.includes('theme') || key.includes('color') ? 'Theme' :
                               key.includes('text') || key.includes('font') ? 'Text' :
                               key.includes('screen') ? 'Screen' : 'Section'
          
          setHistory((h) => [...h, {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            component: componentName,
            action: `Changed ${key}`,
            details: `${prevValue} → ${newValue}`,
            previousValue: prevValue,
            newValue: newValue,
          }])
        }
      }
      return { ...prev, ...partial }
    })
  }, [])

  const handleUndo = useCallback((entry: StackEntry) => {
    if (entry.previousValue !== undefined) {
      setSettings((prev) => ({ ...prev, [entry.action.replace('Changed ', '')]: entry.previousValue }))
    }
  }, [])

  const handleRedo = useCallback((entry: StackEntry) => {
    if (entry.newValue !== undefined) {
      setSettings((prev) => ({ ...prev, [entry.action.replace('Changed ', '')]: entry.newValue }))
    }
  }, [])

  const handleClearHistory = useCallback(() => {
    setHistory([])
  }, [])
  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* ── Sidebar ── */}
      <DashboardSidebar
        activeTool={activeTool}
        onToolChange={onToolChange}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
        history={history}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClearHistory={handleClearHistory}
      />

      {/* ── Main Area ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-border/60 bg-card/40 px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarCollapsed((c) => !c)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              {sidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </button>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="font-medium">Photofolio</span>
              {selectedProject ? (
                <>
                  <span>/</span>
                  <span className="text-foreground font-semibold">{selectedProject.name}</span>
                </>
              ) : (
                <>
                  <span>/</span>
                  <span className="text-foreground font-medium capitalize">{activeTool}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <Undo2 className="h-3.5 w-3.5" />
            </button>
            <button className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <Redo2 className="h-3.5 w-3.5" />
            </button>
            <div className="mx-1 h-4 w-px bg-border/60" />
            <button className="flex h-7 items-center gap-1.5 rounded-lg px-2.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <Eye className="h-3.5 w-3.5" />
              Preview
            </button>
            <button className="flex h-7 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
              <Download className="h-3.5 w-3.5" />
              Publish
            </button>
          </div>
        </header>

        {/* Content area: canvas + right panel */}
        <div className="flex flex-1 overflow-hidden">
          {/* ── Canvas / Preview ── */}
          <div className="flex-1 overflow-auto bg-muted/20">
            <CanvasArea settings={settings} />
          </div>

          {/* ── Right tool panel ── */}
          <div className="w-[300px] shrink-0 border-l border-border/60 bg-card/30 overflow-y-auto">
            <ToolPanel activeTool={activeTool} settings={settings} onUpdateSettings={updateSettings} selectedProject={selectedProject} onSelectProject={setSelectedProject} onToolChange={onToolChange} />
          </div>
        </div>
      </div>
    </div>
  )
}

/** Live preview canvas with device frame */
function CanvasArea({ settings }: { settings: PhotofolioSettings }) {
  const { screenType, hasHeader, headerPosition, hasFooter } = settings
  const deviceClass = screenType === 'mobile'
    ? 'max-w-[375px] min-h-[600px] rounded-[2.5rem] border-[6px] border-black/20'
    : screenType === 'tablet'
    ? 'max-w-[768px] min-h-[600px] rounded-[1.5rem] border-[5px] border-black/20'
    : 'w-full min-h-full rounded-xl border-2 border-black/30'

  return (
    <div className="flex h-full items-start justify-center p-8">
      <div className={cn('flex bg-background overflow-hidden transition-all duration-300', deviceClass, headerPosition === 'left' ? 'flex-row' : headerPosition === 'right' ? 'flex-row-reverse' : 'flex-col')}>
        {/* Device notch (mobile only) */}
        {screenType === 'mobile' && headerPosition === 'top' && (
          <div className="flex justify-center py-1.5">
            <div className="h-1 w-16 rounded-full bg-foreground/10" />
          </div>
        )}

        {/* Header */}
        {hasHeader && headerPosition === 'top' && (
          <div className="shrink-0 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-muted/40" />
              <div className="h-2.5 w-16 rounded bg-muted/30" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-8 rounded bg-muted/20" />
              <div className="h-2 w-8 rounded bg-muted/20" />
              <div className="h-2 w-8 rounded bg-muted/20" />
            </div>
          </div>
        )}

        {/* Header Left */}
        {hasHeader && headerPosition === 'left' && (
          <div className="shrink-0 w-16 flex flex-col items-center gap-4 py-4">
            <div className="h-6 w-6 rounded-md bg-muted/40" />
            <div className="h-2 w-8 rounded bg-muted/30" />
            <div className="h-2 w-8 rounded bg-muted/20" />
            <div className="h-2 w-8 rounded bg-muted/20" />
            <div className="h-2 w-8 rounded bg-muted/20" />
          </div>
        )}

        {/* Header Right */}
        {hasHeader && headerPosition === 'right' && (
          <div className="shrink-0 w-16 flex flex-col items-center gap-4 py-4">
            <div className="h-6 w-6 rounded-md bg-muted/40" />
            <div className="h-2 w-8 rounded bg-muted/30" />
            <div className="h-2 w-8 rounded bg-muted/20" />
            <div className="h-2 w-8 rounded bg-muted/20" />
            <div className="h-2 w-8 rounded bg-muted/20" />
          </div>
        )}

        {/* Content area */}
        <div className="flex-1 overflow-hidden">
          <EmptyCanvas />
        </div>

        {/* Footer */}
        {hasFooter && (
          <div className="shrink-0 px-4 py-3 flex items-center justify-between">
            <div className="h-2 w-20 rounded bg-muted/20" />
            <div className="flex gap-2">
              <div className="h-4 w-4 rounded bg-muted/20" />
              <div className="h-4 w-4 rounded bg-muted/20" />
              <div className="h-4 w-4 rounded bg-muted/20" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyCanvas() {
  return <div className="h-full w-full bg-background" />
}


