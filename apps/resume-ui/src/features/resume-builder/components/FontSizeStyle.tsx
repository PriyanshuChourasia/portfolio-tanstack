interface FontSizeStyleProps {
  size: 'small' | 'medium' | 'large'
}

/**
 * Font size multipliers applied to the common font‑size scales used by templates.
 *   small  = 0.88×   12 px base → ~10.5 px
 *   medium = 1.0×    13.5 px base (default)
 *   large  = 1.15×   13.5 px base → ~15.5 px
 */
const SCALE: Record<string, number> = {
  small: 0.88,
  medium: 1.0,
  large: 1.15,
}

/**
 * Maps a Tailwind semantic class → base px value.
 * Only classes actually used by the 11 templates are listed.
 */
const FONT_MAP: Array<[string, number]> = [
  ['text-xs', 12],
  ['text-sm', 14],
  ['text-base', 16],
  ['text-lg', 18],
  ['text-xl', 20],
  ['text-2xl', 24],
  ['text-3xl', 30],
  ['text-4xl', 36],
]

export function FontSizeStyle({ size }: FontSizeStyleProps) {
  const scale = SCALE[size] ?? 1
  if (scale === 1) return null // medium = default, no overrides needed

  const rules = FONT_MAP.map(
    ([cls, px]) =>
      `.fs-preview .${cls} { font-size: ${Math.round(px * scale)}px !important; }`,
  ).join('\n')

  // Arbitrary px sizes used by templates (e.g. text-[13.5px])
  const arbitrarySizes = [
    9.5, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 15, 17, 22, 44,
  ]
  const arbitraryRules = arbitrarySizes
    .map(
      (px) =>
        `.fs-preview [class*="text-[${px}px]"] { font-size: ${Math.round(px * scale)}px !important; }`,
    )
    .join('\n')

  // Also handle inline style font-size overrides on the root of each template
  const rootRule = `.fs-preview main, .fs-preview .ats-page { font-size: ${Math.round(13.5 * scale)}px !important; }`

  return (
    <style>{`
/* FontSizeStyle: size=${size}, scale=${scale} */
${rules}
${arbitraryRules}
${rootRule}
`}</style>
  )
}
