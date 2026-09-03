import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from 'next-themes'
import App from './App'
import './styles.css'

ReactDOM.createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
