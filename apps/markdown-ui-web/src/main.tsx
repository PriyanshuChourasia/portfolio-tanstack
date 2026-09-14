import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from 'next-themes'
import { MarkdownUI } from 'markdown-ui-core'
import { webAdapter } from './web-adapter'
import { cacheConfigPath, serverAdapter } from './server-adapter'
import 'markdown-ui-core/styles.css'

async function init(): Promise<typeof webAdapter> {
  try {
    const res = await fetch('/api/config-path')
    if (!res.ok) return webAdapter
    const text = await res.text()
    try {
      const data = JSON.parse(text)
      cacheConfigPath(data.path)
      return serverAdapter
    } catch {
      return webAdapter
    }
  } catch {
    return webAdapter
  }
}

const appEl = document.getElementById('app')
if (appEl) {
  appEl.innerHTML = 'Loading...'
  init().then((adapter) => {
    ReactDOM.createRoot(appEl).render(
      <StrictMode>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <MarkdownUI adapter={adapter} />
        </ThemeProvider>
      </StrictMode>,
    )
  })
}
