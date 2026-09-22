/**
 * One-time, best-effort conversion of legacy sigil markup to HTML.
 *
 * Old versions of this editor stored pages as markdown with custom string
 * sigils written around the selection:
 *   `==yellow:text==` / `==text==`  → highlighting is no longer supported;
 *                                      the wrapper is dropped and the inner
 *                                      text is kept as plain text
 *   `%%color:#RRGGBB%%text%%`       → <span style="color:...">
 *   `%%note:<encoded>%%text%%`      → <abbr title="...">
 *
 * Sigils were applied with naive string splicing, so overlapping formats
 * corrupted each other (e.g. `%%==yellow:color==:#22c55e%%...`). This
 * converter recovers what it can and degrades gracefully: any sigil that
 * can no longer be paired is left visible as literal text rather than
 * swallowed, so nothing disappears silently.
 *
 * All other markdown (headings, lists, links, images, code blocks…) is
 * converted via `marked` so a legacy .md page becomes real block-level HTML.
 */

import { marked } from 'marked'

const HIGHLIGHT_COLOR_NAME = /^[a-z]+$/

/** Minimal HTML escaping for text content between sigils. */
function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

/**
 * Convert inline legacy sigils to HTML tags. Runs before markdown parsing so
 * that the resulting <mark>/<span> elements survive `marked` untouched.
 */
function convertInlineSigils(markdown: string): string {
  let out = ''
  let i = 0

  const peek = (str: string) => markdown.startsWith(str, i)

  while (i < markdown.length) {
    // Text color: %%color:#hex%%text%%
    if (peek('%%color:')) {
      const m = /^%%color:(#[0-9A-Fa-f]{3,8})%%/.exec(markdown.slice(i))
      if (m) {
        const close = markdown.indexOf('%%', i + m[0].length)
        if (close !== -1) {
          const inner = markdown.slice(i + m[0].length, close)
          out += `<span style="color: ${m[1]}">${convertInlineSigils(inner)}</span>`
          i = close + 2
          continue
        }
      }
    }

    // Note: %%note:<encoded>%%text%%
    if (peek('%%note:')) {
      const m = /^%%note:([^%]*)%%/.exec(markdown.slice(i))
      if (m) {
        const close = markdown.indexOf('%%', i + m[0].length)
        if (close !== -1) {
          const inner = markdown.slice(i + m[0].length, close)
          let title = m[1]
          try {
            title = decodeURIComponent(m[1])
          } catch {
            /* keep raw */
          }
          out += `<abbr title="${escapeHtml(title)}">${convertInlineSigils(inner)}</abbr>`
          i = close + 2
          continue
        }
      }
    }

    // Highlight: ==[color:]text==  — highlighting is removed; drop the
    // wrapper and keep the inner text as plain content.
    if (peek('==')) {
      const m = /^==(?:([a-z]+):)?([\s\S]*?)==/.exec(markdown.slice(i))
      if (m && (!m[1] || HIGHLIGHT_COLOR_NAME.test(m[1]))) {
        out += convertInlineSigils(m[2])
        i += m[0].length
        continue
      }
    }

    out += markdown[i]
    i++
  }

  return out
}

/**
 * Convert a full legacy .md page (markdown + sigils) into the new HTML
 * content model. Unpaired sigils pass through as literal text.
 */
export function legacyMdToHtml(markdown: string): string {
  if (!markdown) return ''
  const html = marked.parse(convertInlineSigils(markdown), { async: false })
  return typeof html === 'string' ? html : ''
}
