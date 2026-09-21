import { findAndReplace } from 'mdast-util-find-and-replace'
import type { PhrasingContent, Root } from 'mdast'

const textColorRegex = /%%color:(#[0-9A-Fa-f]{6})%%(.*?)%%/s

function textColorNode(value: string, hex: string): PhrasingContent {
  return {
    type: 'span',
    data: { hName: 'span', hProperties: { style: `color: ${hex}` } },
    children: [{ type: 'text', value }],
  } as unknown as PhrasingContent
}

/** Turns `%%color:#RRGGBB%%text%%` into a `<span style="color: #RRGGBB">`. */
export function remarkTextColor() {
  return (tree: Root) => {
    findAndReplace(tree, [
      [
        textColorRegex,
        (_match: string, hex: string, value: string) =>
          textColorNode(value, hex),
      ],
    ])
  }
}
