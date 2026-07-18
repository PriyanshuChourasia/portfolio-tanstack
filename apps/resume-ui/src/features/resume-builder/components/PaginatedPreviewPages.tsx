import { FontSizeStyle } from './FontSizeStyle'
import { BulletStyle } from './BulletStyle'
import { ResumePreview } from './ResumePreview'
import type { ResumeData, ResumeSettings } from '../types'

interface PaginatedPreviewPagesProps {
  templateId: string
  data: ResumeData
  settings: ResumeSettings
  pageBreaks: Array<number>
  totalHeight: number
  className?: string
  onElementColorChange?: (id: string, color: string) => void
  onPhotoChange?: (dataUrl: string) => void
}

/**
 * Screen-only visual: slices the resume into separate A4-height sheets with
 * a gap between them, so a multi-page resume is obviously multiple pages
 * instead of one continuous scroll with a faint break line. Each sheet is
 * an independent re-render of the resume, clipped to its own page window
 * via a translateY offset — purely decorative, never used for print/export.
 * `pageBreaks` are Y-offsets chosen to land between elements (never mid-line).
 */
export function PaginatedPreviewPages({
  templateId,
  data,
  settings,
  pageBreaks,
  totalHeight,
  className = '',
  onElementColorChange,
  onPhotoChange,
}: PaginatedPreviewPagesProps) {
  const startOffsets = [0, ...pageBreaks]

  return (
    <div className={`fs-preview w-full space-y-7 print:hidden ${className}`}>
      <FontSizeStyle size={settings.fontSize} />
      <BulletStyle type={settings.bulletStyle} />
      {startOffsets.map((offset, i) => {
        // Each page is clipped exactly at the next page's break (or, for
        // the last page, at the resume's true end) — never at a fixed page
        // height — so it never shows a sliver of an element pushed onto
        // the next page. A CSS transform doesn't shrink layout size, so
        // the last page needs an explicit height too, not "auto".
        const nextOffset = startOffsets[i + 1] ?? totalHeight
        const height = nextOffset - offset

        return (
          <div key={i}>
            <div className="bg-background/80 text-muted-foreground sticky top-3 z-10 mx-auto mb-3 flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium shadow-xs backdrop-blur-sm">
              Page {i + 1} of {startOffsets.length}
            </div>
            <div
              className="relative overflow-hidden rounded-sm shadow-xl ring-1 ring-black/5 dark:ring-white/10"
              style={{ height, backgroundColor: data.theme.background }}
            >
              <div style={{ transform: `translateY(-${offset}px)` }}>
                <ResumePreview
                  templateId={templateId}
                  data={data}
                  onElementColorChange={onElementColorChange}
                  onPhotoChange={onPhotoChange}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
