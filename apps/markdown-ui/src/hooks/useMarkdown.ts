import { useCallback } from 'react'

export function useMarkdown(_markdown: string) {
  const getWordCount = useCallback((text: string) => {
    return text.trim().split(/\s+/).filter(Boolean).length
  }, [])

  const getCharCount = useCallback((text: string) => {
    return text.length
  }, [])

  return { getWordCount, getCharCount }
}
