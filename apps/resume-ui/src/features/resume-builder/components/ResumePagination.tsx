import { useLayoutEffect, useRef } from 'react'
import type { ReactNode } from 'react'

export interface PageLayout {
  breaks: Array<number>
  totalHeight: number
}

interface ResumePaginationProps {
  children: ReactNode
  onLayoutChange?: (layout: PageLayout) => void
  /** Section ids that must start on a fresh page, regardless of overflow. */
  forcedSectionIds?: ReadonlyArray<string>
}

/** Approximate A4 height in pixels at 96dpi (297mm) */
export const A4_HEIGHT_PX = 1123

/**
 * Finds Y-offsets (relative to `root`) where a new page should start so
 * that no page break lands in the middle of a leaf element (a line of
 * text, a bullet, a heading). Breaks only ever fall on a leaf's top edge —
 * including forced breaks, which snap to the top edge of a section's first
 * leaf (its heading) rather than the section wrapper's own box, so the
 * invariant holds for manual breaks too.
 */
function computePageBreaks(
  root: HTMLElement,
  pageHeight: number,
  forcedSectionIds: ReadonlySet<string> = new Set(),
): Array<number> {
  const rootTop = root.getBoundingClientRect().top

  const leaves = Array.from(root.querySelectorAll<HTMLElement>('*')).filter(
    (el) => el.children.length === 0 && (el.textContent?.trim().length ?? 0) > 0,
  )

  if (root.scrollHeight <= pageHeight && forcedSectionIds.size === 0) return []

  const breaks: Array<number> = []
  let pageStart = 0
  let lastSectionId: string | null = null

  for (const leaf of leaves) {
    const sectionEl = leaf.closest<HTMLElement>('[data-section-id]')
    const sectionId = sectionEl?.dataset.sectionId ?? null
    const isFirstLeafOfSection = sectionId !== null && sectionId !== lastSectionId
    lastSectionId = sectionId

    const rect = leaf.getBoundingClientRect()
    const top = rect.top - rootTop
    const bottom = rect.bottom - rootTop

    const forcedBreakHere =
      isFirstLeafOfSection && sectionId !== null && forcedSectionIds.has(sectionId)

    if (top > pageStart && (forcedBreakHere || bottom - pageStart > pageHeight)) {
      breaks.push(top)
      pageStart = top
    }
  }
  return breaks
}

/**
 * Measures the rendered resume and reports the Y-offsets where it should
 * be split into pages. Renders children untouched — this stays the single
 * source of truth used for the browser's native print pagination and for
 * Word/PDF export, so it must never be duplicated or visually altered here.
 */
export function ResumePagination({ children, onLayoutChange, forcedSectionIds = [] }: ResumePaginationProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const prevLayoutRef = useRef<PageLayout>({ breaks: [], totalHeight: 0 })
  const forcedKey = forcedSectionIds.join(',')

  useLayoutEffect(() => {
    const el = contentRef.current
    if (!el) return
    const forcedSet = new Set(forcedKey ? forcedKey.split(',') : [])
    const measure = () => {
      const breaks = computePageBreaks(el, A4_HEIGHT_PX, forcedSet)
      const totalHeight = el.scrollHeight
      const prev = prevLayoutRef.current
      const unchanged =
        totalHeight === prev.totalHeight &&
        breaks.length === prev.breaks.length &&
        breaks.every((offset, i) => offset === prev.breaks[i])
      if (unchanged) return
      prevLayoutRef.current = { breaks, totalHeight }
      onLayoutChange?.({ breaks, totalHeight })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [children, onLayoutChange, forcedKey])

  // `overflow: hidden` has no visual effect here (no fixed height is set,
  // so nothing actually overflows) — it only establishes a block formatting
  // context so a template's own top margin is contained as real internal
  // space instead of collapsing through this div. The visible page sheets
  // in PaginatedPreviewPages also use `overflow: hidden` (for clipping), so
  // without this, margins would collapse differently in the two contexts
  // and the same offset wouldn't land on the same content in both places.
  return (
    <div ref={contentRef} style={{ overflow: 'hidden' }}>
      {children}
    </div>
  )
}
