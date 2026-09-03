import { useState, useEffect, useCallback, useRef } from 'react'
import { useStorage, StorageProvider } from './lib/context'
import type { StorageAdapter, UserConfig } from './lib/types'
import { AppShell } from './components/AppShell'
import { SetupScreen } from './features/setup/SetupScreen'
import { ProjectsHome } from './features/projects/ProjectsHome'
import { EditorPane } from './features/editor/EditorPane'
import { PreviewPane } from './features/preview/PreviewPane'

type Stage = 'loading' | 'setup' | 'home' | 'editor'

function MarkdownUIInner() {
  const adapter = useStorage()
  const [stage, setStage] = useState<Stage>('loading')
  const [config, setConfig] = useState<UserConfig | null>(null)
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null)
  const [markdown, setMarkdown] = useState('')
  const [showEditor, setShowEditor] = useState(true)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const currentContentRef = useRef('')

  const init = useCallback(async () => {
    try {
      const cfg = await adapter.readConfig()
      if (cfg) {
        setConfig(cfg)
        setStage('home')
        return
      }
    } catch {
      // ignore
    }
    setStage('setup')
  }, [adapter])

  useEffect(() => {
    init()
  }, [init])

  const handleSetupComplete = useCallback((cfg: UserConfig) => {
    setConfig(cfg)
    setStage('home')
  }, [])

  const handleOpenProject = useCallback(
    async (id: string) => {
      const content = await adapter.readProject(id)
      setCurrentProjectId(id)
      setMarkdown(content)
      currentContentRef.current = content
      setStage('editor')
    },
    [adapter],
  )

  const handleContentChange = useCallback(
    (value: string) => {
      setMarkdown(value)
      currentContentRef.current = value
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
      saveTimerRef.current = setTimeout(() => {
        if (currentProjectId) {
          adapter.writeProject(currentProjectId, value)
        }
      }, 500)
    },
    [adapter, currentProjectId],
  )

  const handleBackToProjects = useCallback(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    if (currentProjectId) {
      adapter.writeProject(currentProjectId, currentContentRef.current)
    }
    setCurrentProjectId(null)
    setMarkdown('')
    currentContentRef.current = ''
    setStage('home')
  }, [adapter, currentProjectId])

  useEffect(() => {
    if (stage !== 'editor' || !currentProjectId) return
    if (markdown) return
    ;(async () => {
      const content = await adapter.readProject(currentProjectId)
      setMarkdown(content)
      currentContentRef.current = content
    })()
  }, [stage, currentProjectId, adapter, markdown])

  if (stage === 'loading') {
    return (
      <div className="h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-muted-foreground text-sm">Loading…</p>
      </div>
    )
  }

  return (
    <AppShell
      stage={stage}
      userName={config?.name}
      showEditorToggle={stage === 'editor'}
      editorOpen={showEditor}
      onToggleEditor={() => setShowEditor(!showEditor)}
      onBackToProjects={handleBackToProjects}
    >
      {stage === 'setup' && (
        <SetupScreen onComplete={handleSetupComplete} />
      )}

      {stage === 'home' && (
        <ProjectsHome onSelectProject={handleOpenProject} />
      )}

      {stage === 'editor' && (
        <div className="flex-1 flex overflow-hidden min-h-0">
          {showEditor && (
            <div className="w-1/2 border-r border-border flex flex-col min-h-0">
              <div className="px-4 py-2 border-b border-border text-xs font-medium uppercase tracking-wider text-muted-foreground shrink-0">
                Editor
              </div>
              <EditorPane value={markdown} onChange={handleContentChange} />
            </div>
          )}
          <div
            className={`${showEditor ? 'w-1/2' : 'w-full'} flex flex-col min-h-0`}
          >
            <div className="px-4 py-2 border-b border-border text-xs font-medium uppercase tracking-wider text-muted-foreground shrink-0">
              Preview
            </div>
            <PreviewPane markdown={markdown} />
          </div>
        </div>
      )}
    </AppShell>
  )
}

export interface MarkdownUIProps {
  adapter: StorageAdapter
}

export function MarkdownUI({ adapter }: MarkdownUIProps) {
  return (
    <StorageProvider adapter={adapter}>
      <MarkdownUIInner />
    </StorageProvider>
  )
}
