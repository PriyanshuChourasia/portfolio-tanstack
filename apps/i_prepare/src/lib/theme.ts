import { useCallback, useEffect, useState } from 'react'

/**
 * Light/dark theme state, kept in sync with the blocking script in `index.html`
 * that applies the `.dark`/`.light` class before first paint (key: `i-prepare:theme`).
 */
const STORAGE_KEY = 'i-prepare:theme'

type Theme = 'light' | 'dark'

function currentTheme(): Theme {
  if (typeof document === 'undefined') return 'dark'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(currentTheme)

  const apply = useCallback((next: Theme) => {
    document.documentElement.classList.toggle('dark', next === 'dark')
    document.documentElement.classList.toggle('light', next === 'light')
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Ignore — theme is cosmetic.
    }
    setThemeState(next)
  }, [])

  const toggle = useCallback(() => {
    apply(currentTheme() === 'dark' ? 'light' : 'dark')
  }, [apply])

  // Follow OS preference changes only while the user has not chosen explicitly.
  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) return
    } catch {
      return
    }
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const listener = (event: MediaQueryListEvent) => apply(event.matches ? 'dark' : 'light')
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [apply])

  return { theme, setTheme: apply, toggle }
}
