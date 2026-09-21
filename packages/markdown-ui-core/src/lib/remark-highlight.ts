import { findAndReplace } from 'mdast-util-find-and-replace'
import type { PhrasingContent, Root } from 'mdast'

export const HIGHLIGHT_COLORS = ['yellow', 'green', 'blue', 'pink', 'orange', 'purple'] as const
export type HighlightColor = (typeof HIGHLIGHT_COLORS)[number]

const highlightRegex = new RegExp(`==(?:(${HIGHLIGHT_COLORS.join('|')}):)?([^=]+)==`, 'g')

// mdast's PhrasingContent union doesn't know about this custom `<mark>` node —
// `data.hName`/`data.hProperties` is how remark-rehype is told which hast tag
// (and class, to pick the color) to emit for it.
function markNode(value: string, color: HighlightColor): PhrasingContent {
  return {
    type: 'mark',
    data: { hName: 'mark', hProperties: { className: `hl-${color}` } },
    children: [{ type: 'text', value }],
  } as unknown as PhrasingContent
}

/** Turns `==highlighted==` (default yellow) or `==blue:highlighted==` into a colored `<mark>` element. */
export function remarkHighlight() {
  return (tree: Root) => {
    findAndReplace(tree, [
      [
        highlightRegex,
        (_match: string, color: string | undefined, value: string) =>
          markNode(value, (color as HighlightColor | undefined) ?? 'yellow'),
      ],
    ])
  }
}
