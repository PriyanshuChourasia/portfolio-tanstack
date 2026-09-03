import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from 'next-themes'
import { MarkdownUI } from 'markdown-ui-core'
import { desktopAdapter } from './desktop-adapter'
import 'markdown-ui-core/styles.css'

ReactDOM.createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <MarkdownUI adapter={desktopAdapter} />
    </ThemeProvider>
  </StrictMode>,
)
