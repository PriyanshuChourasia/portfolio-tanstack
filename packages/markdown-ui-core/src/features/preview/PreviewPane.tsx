import { useMemo } from 'react'
import DOMPurify from 'dompurify'

interface PreviewPaneProps {
  /** HTML produced by the editor (TipTap getHTML()) — the same content model. */
  html: string
}

/** Attributes/styles the text-color marks rely on. */
const PURIFY_CONFIG = {
  ALLOWED_ATTR: ['style', 'color', 'src', 'alt', 'title', 'href'],
  ALLOWED_TAGS: [
    // Block structure
    'p', 'br', 'hr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'blockquote', 'pre', 'code',
    'ul', 'ol', 'li',
    // Inline marks & links/images
    'strong', 'em', 'u', 's', 'code', 'span', 'a', 'img', 'abbr',
    // Tables (GFM-style, kept for hand-written HTML tables)
    'table', 'thead', 'tbody', 'tr', 'th', 'td', 'colgroup', 'col',
  ],
}

export function PreviewPane({ html }: PreviewPaneProps) {
  const clean = useMemo(() => DOMPurify.sanitize(html, PURIFY_CONFIG), [html])

  return (
    <div
      className="flex-1 overflow-y-auto min-h-0 p-6 prose prose-sm dark:prose-invert max-w-none"
      // Content is sanitized above with an explicit tag/attr allowlist.
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  )
}
