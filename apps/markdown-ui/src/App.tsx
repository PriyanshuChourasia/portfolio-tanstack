import { useState } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun, PanelLeftClose, PanelLeft } from 'lucide-react'
import { useMarkdown } from './hooks/useMarkdown'
import { EditorPane } from './features/editor/EditorPane'
import { PreviewPane } from './features/preview/PreviewPane'
import { Button } from './components/ui/button'

const DEFAULT_MARKDOWN = `# Welcome to Markdown UI

A simple, split-pane **Markdown editor** with live preview.

## Features

- **Live preview** as you type
- GitHub Flavored Markdown (tables, strikethrough, task lists)
- Syntax-highlighted code blocks
- Dark / light theme toggle
- Responsive split-pane layout

## Code Example

\`\`\`typescript
function greet(name: string): string {
  return \`Hello, \${name}!\`
}

console.log(greet("World"))
\`\`\`

## Table

| Feature        | Status |
|----------------|--------|
| Editor         | ✅     |
| Live Preview   | ✅     |
| GFM            | ✅     |
| Syntax Highlight | ✅   |

## Task List

- [x] Create project scaffold
- [x] Add editor pane
- [x] Add preview pane
- [ ] Add more themes
`

export default function App() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN)
  const [showEditor, setShowEditor] = useState(true)
  const { theme, setTheme } = useTheme()

  useMarkdown(markdown)

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-border px-4 py-2 shrink-0">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowEditor(!showEditor)}
            title={showEditor ? 'Hide editor' : 'Show editor'}
          >
            {showEditor ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
          </Button>
          <h1 className="text-sm font-semibold tracking-tight">Markdown UI</h1>
        </div>
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
      </header>

      <main className="flex-1 flex overflow-hidden min-h-0">
        {showEditor && (
          <div className="w-1/2 border-r border-border flex flex-col min-h-0">
            <div className="px-4 py-2 border-b border-border text-xs font-medium uppercase tracking-wider text-muted-foreground shrink-0">
              Editor
            </div>
            <EditorPane value={markdown} onChange={setMarkdown} />
          </div>
        )}
        <div className={`${showEditor ? 'w-1/2' : 'w-full'} flex flex-col min-h-0`}>
          <div className="px-4 py-2 border-b border-border text-xs font-medium uppercase tracking-wider text-muted-foreground shrink-0">
            Preview
          </div>
          <PreviewPane markdown={markdown} />
        </div>
      </main>
    </div>
  )
}
