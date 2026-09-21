import { useState, useEffect, useCallback, useRef } from 'react'
import { useStorage, StorageProvider } from './lib/context'
import type { StorageAdapter } from './lib/types'
import { AppShell } from './components/AppShell'
import { ProjectsHome } from './features/projects/ProjectsHome'
import { PagesHome } from './features/pages/PagesHome'
import { EditorPane } from './features/editor/EditorPane'
import { PreviewPane } from './features/preview/PreviewPane'

type Stage = 'home' | 'pages' | 'editor'

function MarkdownUIInner() {
  const adapter = useStorage()
  const [stage, setStage] = useState<Stage>('home')
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null)
  const [currentProjectName, setCurrentProjectName] = useState('')
  const [currentPageId, setCurrentPageId] = useState<string | null>(null)
  const [markdown, setMarkdown] = useState('')
  const [showEditor, setShowEditor] = useState(true)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const currentContentRef = useRef('')

  const handleOpenProject = useCallback((id: string, name: string) => {
    setCurrentProjectId(id)
    setCurrentProjectName(name)
    setStage('pages')
  }, [])

  const handleOpenPage = useCallback(
    async (pageId: string) => {
      if (!currentProjectId) return
      const content = await adapter.readPage(currentProjectId, pageId)
      setCurrentPageId(pageId)
      setMarkdown(content)
      currentContentRef.current = content
      setStage('editor')
    },
    [adapter, currentProjectId],
  )

  const handleContentChange = useCallback(
    (value: string) => {
      setMarkdown(value)
      currentContentRef.current = value
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
      saveTimerRef.current = setTimeout(() => {
        if (currentProjectId && currentPageId) {
          adapter.writePage(currentProjectId, currentPageId, value)
        }
      }, 500)
    },
    [adapter, currentProjectId, currentPageId],
  )

  const handleBackToPages = useCallback(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    if (currentProjectId && currentPageId) {
      adapter.writePage(currentProjectId, currentPageId, currentContentRef.current)
    }
    setCurrentPageId(null)
    setMarkdown('')
    currentContentRef.current = ''
    setStage('pages')
  }, [adapter, currentProjectId, currentPageId])

  const handleBackToProjects = useCallback(() => {
    setCurrentProjectId(null)
    setCurrentProjectName('')
    setCurrentPageId(null)
    setMarkdown('')
    currentContentRef.current = ''
    setStage('home')
  }, [])

  const handleBack = stage === 'editor' ? handleBackToPages : handleBackToProjects

  useEffect(() => {
    if (stage !== 'editor' || !currentProjectId || !currentPageId) return
    if (markdown) return
    ;(async () => {
      const content = await adapter.readPage(currentProjectId, currentPageId)
      setMarkdown(content)
      currentContentRef.current = content
    })()
  }, [stage, currentProjectId, currentPageId, adapter, markdown])

  return (
    <AppShell
      stage={stage}
      showEditorToggle={stage === 'editor'}
      editorOpen={showEditor}
      onToggleEditor={() => setShowEditor(!showEditor)}
      onBack={handleBack}
    >
      {stage === 'home' && <ProjectsHome onSelectProject={handleOpenProject} />}

      {stage === 'pages' && currentProjectId && (
        <PagesHome
          projectId={currentProjectId}
          projectName={currentProjectName}
          onSelectPage={handleOpenPage}
        />
      )}

      {stage === 'editor' && (
        <div className="flex-1 flex flex-col sm:flex-row overflow-hidden min-h-0">
          {showEditor && (
            <div className="flex-1 border-b sm:border-b-0 sm:border-r border-border flex flex-col min-h-0">
              <div className="px-4 py-2 border-b border-border text-xs font-medium uppercase tracking-wider text-muted-foreground shrink-0">
                Editor
              </div>
              <EditorPane value={markdown} onChange={handleContentChange} />
            </div>
          )}
          <div className="flex-1 flex flex-col min-h-0">
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
