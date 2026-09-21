import { findAndReplace } from 'mdast-util-find-and-replace'
import type { PhrasingContent, Root } from 'mdast'

const noteRegex = /%%note:(.*?)%%(.*?)%%/s

function noteNode(value: string, noteText: string): PhrasingContent {
  return {
    type: 'mark',
    data: { hName: 'abbr', hProperties: { title: noteText, className: 'note' } },
    children: [{ type: 'text', value }],
  } as unknown as PhrasingContent
}

export function remarkNote() {
  return (tree: Root) => {
    findAndReplace(tree, [
      [
        noteRegex,
        (_match: string, noteText: string, value: string) =>
          noteNode(value, decodeURIComponent(noteText)),
      ],
    ])
  }
}
