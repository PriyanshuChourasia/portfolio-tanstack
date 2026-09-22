import { useState, useEffect, useCallback, useRef } from 'react'
import type { Editor } from '@tiptap/react'
import { useStorage, StorageProvider } from './lib/context'
import { legacyMdToHtml } from './lib/legacy-md-to-html'
import type { StorageAdapter } from './lib/types'
import { AppShell } from './components/AppShell'
import { ProjectsHome } from './features/projects/ProjectsHome'
import { PagesHome } from './features/pages/PagesHome'
import { EditorPane, EditorToolbar } from './features/editor/EditorPane'
import { PreviewPane } from './features/preview/PreviewPane'

type Stage = 'home' | 'pages' | 'editor'

function MarkdownUIInner() {
  const adapter = useStorage()
  const [stage, setStage] = useState<Stage>('home')
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null)
  const [currentProjectName, setCurrentProjectName] = useState('')
  const [currentPageId, setCurrentPageId] = useState<string | null>(null)
  const [html, setHtml] = useState('')
  const [showEditor, setShowEditor] = useState(true)
  const [editor, setEditor] = useState<Editor | null>(null)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const currentContentRef = useRef('')

  const handleOpenProject = useCallback((id: string, name: string) => {
    setCurrentProjectId(id)
    setCurrentProjectName(name)
    setStage('pages')
  }, [])

  const loadPageContent = useCallback(
    async (projectId: string, pageId: string) => {
      const raw = await adapter.readPage(projectId, pageId)
      // One-time migration: legacy pages stored as sigil markdown are
      // converted to the HTML content model and written back immediately,
      // so the .md → .html switch happens on first open.
      const converted = legacyMdToHtml(raw)
      if (converted !== raw) {
        await adapter.writePage(projectId, pageId, converted)
      }
      setHtml(converted)
      currentContentRef.current = converted
    },
    [adapter],
  )

  const handleOpenPage = useCallback(
    async (pageId: string) => {
      if (!currentProjectId) return
      setCurrentPageId(pageId)
      await loadPageContent(currentProjectId, pageId)
      setStage('editor')
    },
    [currentProjectId, loadPageContent],
  )

  const handleContentChange = useCallback(
    (value: string) => {
      setHtml(value)
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
    setHtml('')
    currentContentRef.current = ''
    setStage('pages')
  }, [adapter, currentProjectId, currentPageId])

  const handleBackToProjects = useCallback(() => {
    setCurrentProjectId(null)
    setCurrentProjectName('')
    setCurrentPageId(null)
    setHtml('')
    currentContentRef.current = ''
    setStage('home')
  }, [])

  const handleBack = stage === 'editor' ? handleBackToPages : handleBackToProjects

  useEffect(() => {
    if (stage !== 'editor' || !currentProjectId || !currentPageId) return
    if (html) return
    ;(async () => {
      await loadPageContent(currentProjectId, currentPageId)
    })()
  }, [stage, currentProjectId, currentPageId, adapter, html, loadPageContent])

  return (
    <AppShell
      stage={stage}
      showEditorToggle={stage === 'editor'}
      editorOpen={showEditor}
      onToggleEditor={() => setShowEditor(!showEditor)}
      onBack={handleBack}
      headerToolbar={
        stage === 'editor' && showEditor ? <EditorToolbar editor={editor} /> : undefined
      }
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
              <EditorPane value={html} onChange={handleContentChange} onEditorReady={setEditor} />
            </div>
          )}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="px-4 py-2 border-b border-border text-xs font-medium uppercase tracking-wider text-muted-foreground shrink-0">
              Preview
            </div>
            <PreviewPane html={html} />
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
