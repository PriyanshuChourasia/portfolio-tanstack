export type BulletType = 'disc' | 'circle' | 'square' | 'dash' | 'check' | 'arrow' | 'decimal'

interface BulletStyleProps {
  type: BulletType
}

/**
 * Maps bullet type to its CSS `list-style-type` value.
 * Custom types (dash, check, arrow) use pseudo-elements instead.
 */
const BULLET_MAP: Record<BulletType, { css: string; marker: string }> = {
  disc:   { css: 'disc', marker: '' },
  circle: { css: 'circle', marker: '' },
  square: { css: 'square', marker: '' },
  dash:   { css: 'none', marker: '"–"' },
  check:  { css: 'none', marker: '"✓"' },
  arrow:  { css: 'none', marker: '"→"' },
  decimal: { css: 'decimal', marker: '' },
}

export function BulletStyle({ type }: BulletStyleProps) {
  const config = BULLET_MAP[type]
  if (type === 'disc') return null // default — no overrides needed

  if (config.css === 'none') {
    // Custom pseudo-element bullets
    return (
      <style>{`
.fs-preview ul, .fs-preview ol {
  list-style: none !important;
  padding-left: 1.25em !important;
}
.fs-preview li {
  position: relative !important;
}
.fs-preview li::before {
  content: ${config.marker} !important;
  position: absolute !important;
  left: -1.1em !important;
}
`}</style>
    )
  }

  // Standard CSS list-style-type override
  return (
    <style>{`
.fs-preview ul, .fs-preview ol {
  list-style-type: ${config.css} !important;
}
`}</style>
  )
}
