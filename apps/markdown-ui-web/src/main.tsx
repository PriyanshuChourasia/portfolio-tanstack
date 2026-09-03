import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from 'next-themes'
import { MarkdownUI } from 'markdown-ui-core'
import { webAdapter } from './web-adapter'
import 'markdown-ui-core/styles.css'

ReactDOM.createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <MarkdownUI adapter={webAdapter} />
    </ThemeProvider>
  </StrictMode>,
)
