import type { ReactNode } from 'react'
import { Moon, Sun, PanelLeftClose, PanelLeft, ArrowLeft } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from './ui/button'
import { cn } from '../lib/utils'

interface AppShellProps {
  stage: 'home' | 'pages' | 'editor'
  showEditorToggle?: boolean
  editorOpen?: boolean
  onToggleEditor?: () => void
  onBack?: () => void
  /**
   * Optional toolbar strip rendered inside the header, between the nav buttons
   * and the theme toggle. Used to lift the editor's formatting palette out of
   * the editor pane (only meaningful when a document is open).
   */
  headerToolbar?: ReactNode
  children: ReactNode
}

export function AppShell({
  stage,
  showEditorToggle = false,
  editorOpen = false,
  onToggleEditor,
  onBack,
  headerToolbar,
  children,
}: AppShellProps) {
  const { theme, setTheme } = useTheme()

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      <header
        className={cn(
          'border-b border-border px-4 py-2 shrink-0',
          // Two rows on narrow viewports when the palette is present so it
          // can wrap onto its own line instead of squeezing the title row.
          headerToolbar
            ? 'flex flex-wrap items-center justify-between gap-x-3 gap-y-1'
            : 'flex items-center justify-between',
        )}
      >
        <div className="flex items-center gap-2">
          {stage !== 'home' && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                title={stage === 'editor' ? 'Back to pages' : 'Back to projects'}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              {showEditorToggle && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleEditor}
                  title={editorOpen ? 'Hide editor' : 'Show editor'}
                >
                  {editorOpen ? (
                    <PanelLeftClose className="h-4 w-4" />
                  ) : (
                    <PanelLeft className="h-4 w-4" />
                  )}
                </Button>
              )}
            </>
          )}
          <h1 className="text-sm font-semibold tracking-tight">Markdown-AI</h1>
        </div>
        {headerToolbar && (
          <div
            className="order-last flex w-full items-center gap-1 overflow-x-auto sm:w-auto sm:order-none sm:flex-1 sm:justify-center sm:overflow-visible min-w-0"
          >
            {headerToolbar}
          </div>
        )}
        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col overflow-hidden min-h-0">
        {children}
      </main>

      <footer className="shrink-0 border-t border-border px-4 py-2 text-xs text-muted-foreground flex items-center justify-between">
        <span>© 2026 Priyanshu Chourasia</span>
        <a
          href="https://github.com/PriyanshuChourasia"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors underline underline-offset-2"
        >
          GitHub
        </a>
      </footer>
    </div>
  )
}
