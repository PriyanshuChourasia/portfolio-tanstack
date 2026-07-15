import { useState } from 'react'
import { PortfolioPreview } from './PortfolioPreview'
import { EditorPanel } from './EditorPanel'
import { usePortfolioStore } from '../store'

import { portfolioTemplates } from '../templates/registry'

export function PortfolioLayout() {
  const [editorOpen, setEditorOpen] = useState(true)
  const data = usePortfolioStore((s) => s.data)
  const activeTemplate = usePortfolioStore((s) => s.activeTemplate)
  const currentTemplate = portfolioTemplates.find((t) => t.id === activeTemplate) ?? portfolioTemplates[0]

  return (
    <div className="relative flex min-h-screen bg-background">
      {/* Edit button (when editor closed) */}
      {!editorOpen && (
        <button
          onClick={() => setEditorOpen(true)}
          className="fixed left-4 top-4 z-50 flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
        >
          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Edit Portfolio
        </button>
      )}

      {/* Editor panel */}
      <div
        className={`fixed left-0 top-0 z-50 h-full w-full max-w-md border-r bg-background shadow-2xl transition-transform duration-300 print:hidden ${
          editorOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <EditorPanel onClose={() => setEditorOpen(false)} />
      </div>

      {/* Overlay when editor is open on mobile */}
      {editorOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden print:hidden"
          onClick={() => setEditorOpen(false)}
        />
      )}

      {/* Main content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          editorOpen ? 'md:ml-[448px]' : 'ml-0'
        }`}
      >
        {/* Export bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b bg-background/80 px-6 py-3 backdrop-blur-md print:hidden">
          <div className="flex items-center gap-3">
            <svg className="size-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
              Portfolio Preview
            </h2>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium"
              style={{
                backgroundColor: `${data.theme.accent}15`,
                color: data.theme.accent,
              }}
            >
              <span className="inline-block size-2 rounded-full" style={{ backgroundColor: data.theme.accent }} />
              {currentTemplate.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
            >
              Export PDF
            </button>
          </div>
        </div>

        {/* Preview */}
        <PortfolioPreview data={data} templateId={activeTemplate} />
      </div>
    </div>
  )
}
