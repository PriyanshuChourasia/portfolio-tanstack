import { useCallback, useState } from 'react'

const STORAGE_KEY = 'portfolio-section-labels'

const DEFAULT_LABELS: Record<string, string> = {
  ABOUT: 'ABOUT',
  RESUME: 'RESUME',
  WORKS: 'WORKS',
  BLOG: 'BLOG',
  CONTACT: 'CONTACT',
}

function loadLabels(): Record<string, string> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return { ...DEFAULT_LABELS, ...JSON.parse(stored) }
  } catch {}
  return { ...DEFAULT_LABELS }
}

function saveLabels(labels: Record<string, string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(labels))
}

export function useSectionLabels() {
  const [labels, setLabels] = useState<Record<string, string>>(loadLabels)

  const updateLabel = useCallback((key: string, value: string) => {
    setLabels((prev) => {
      const next = { ...prev, [key]: value || key }
      saveLabels(next)
      return next
    })
  }, [])

  const getLabel = useCallback((key: string) => labels[key] || key, [labels])

  return { labels, updateLabel, getLabel }
}
