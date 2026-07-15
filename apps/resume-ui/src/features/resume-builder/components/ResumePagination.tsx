import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

interface ResumePaginationProps {
  children: ReactNode
}

/** Approximate A4 height in pixels at 96dpi (297mm) */
const A4_HEIGHT_PX = 1123

export function ResumePagination({ children }: ResumePaginationProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)

  // Measure content height to determine total pages
  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    const measure = () => {
      const height = el.scrollHeight
      setTotalPages(Math.max(1, Math.ceil(height / A4_HEIGHT_PX)))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [children])

  // Track scroll position to determine current page
  const handleScroll = useCallback(() => {
    const el = contentRef.current
    if (!el) return
    let parent = el.parentElement
    while (parent) {
      const style = getComputedStyle(parent)
      if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
        const scrollTop = parent.scrollTop
        setCurrentPage(
          Math.min(totalPages, Math.max(1, Math.floor(scrollTop / A4_HEIGHT_PX) + 1)),
        )
        return
      }
      parent = parent.parentElement
    }
  }, [totalPages])

  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    let parent = el.parentElement
    while (parent) {
      const style = getComputedStyle(parent)
      if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
        parent.addEventListener('scroll', handleScroll, { passive: true })
        handleScroll()
        return () => parent?.removeEventListener('scroll', handleScroll)
      }
      parent = parent.parentElement
    }
  }, [handleScroll])

  return (
    <div className="relative" ref={contentRef}>
      {/* Page indicator badge */}
      {totalPages > 1 && (
        <div className="bg-background/80 text-muted-foreground sticky top-3 z-10 mx-auto mb-4 flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium shadow-xs backdrop-blur-sm print:hidden">
          <svg
            className="size-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          Page {currentPage} of {totalPages}
        </div>
      )}

      {/* Full content with subtle page break lines via repeating gradient */}
      <div
        className="rounded-sm print:rounded-none"
        style={{
          backgroundImage:
            totalPages > 1
              ? `repeating-linear-gradient(
                  to bottom,
                  transparent 0,
                  transparent ${A4_HEIGHT_PX - 1}px,
                  hsl(var(--border) / 0.35) ${A4_HEIGHT_PX - 1}px,
                  hsl(var(--border) / 0.35) ${A4_HEIGHT_PX}px,
                  transparent ${A4_HEIGHT_PX}px,
                  transparent ${A4_HEIGHT_PX * 2}px
                )`
              : 'none',
          backgroundPosition: 'top center',
        }}
      >
        {children}
      </div>
    </div>
  )
}
