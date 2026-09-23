import { useCallback, useEffect, useState } from 'react'
import type { Rect } from './canvasGeometry'
import { HOME_PAGE_ID } from './usePhotofolioImages'

export type BlockKind = 'heading' | 'paragraph' | 'quote' | 'button' | 'contact'
export type BlockAlign = 'left' | 'center' | 'right'

/** A text content block placed on a page or SPA section, alongside its photos. */
export interface ContentBlock extends Rect {
  id: string
  pageId: string
  kind: BlockKind
  text: string
  align: BlockAlign
  /** Frosted-glass background, for text sitting on top of a photo. */
  blur: boolean
}

export type NewContentBlock = Omit<ContentBlock, 'id' | 'pageId'>

function loadBlocks(projectId: string): ContentBlock[] {
  try {
    const raw = localStorage.getItem(`photofolio-blocks-${projectId}`)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function useCanvasBlocks(projectId: string) {
  const [blocks, setBlocks] = useState<ContentBlock[]>(() => loadBlocks(projectId))

  useEffect(() => {
    try { localStorage.setItem(`photofolio-blocks-${projectId}`, JSON.stringify(blocks)) } catch { /* ignore */ }
  }, [blocks, projectId])

  const addBlocks = useCallback((newBlocks: NewContentBlock[], pageId: string = HOME_PAGE_ID) => {
    setBlocks((prev) => [...prev, ...newBlocks.map((b) => ({ ...b, id: crypto.randomUUID(), pageId }))])
  }, [])

  const updateBlock = useCallback((id: string, updates: Partial<NewContentBlock>) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)))
  }, [])

  const removeBlock = useCallback((id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id))
  }, [])

  const clearBlocks = useCallback((pageId: string) => {
    setBlocks((prev) => prev.filter((b) => b.pageId !== pageId))
  }, [])

  return { blocks, addBlocks, updateBlock, removeBlock, clearBlocks }
}
