/**
 * Shared color palette for inline formatting (highlight + text color).
 *
 * Single source of truth so the editor toolbar swatches, CSS, and stored HTML
 * all use the same values. TipTap's Highlight/Color extensions accept arbitrary
 * CSS color strings, so these are applied verbatim as mark attributes.
 */

/** Pastel background colors offered as highlight swatches. */
export const HIGHLIGHT_SWATCHES = [
  { name: 'yellow', value: '#fde68a' },
  { name: 'green', value: '#bbf7d0' },
  { name: 'blue', value: '#bfdbfe' },
  { name: 'pink', value: '#fbcfe8' },
  { name: 'orange', value: '#fed7aa' },
  { name: 'purple', value: '#e9d5ff' },
] as const

export type HighlightSwatch = (typeof HIGHLIGHT_SWATCHES)[number]

/** Ink color used on top of the light pastel highlight backgrounds. */
export const HIGHLIGHT_TEXT_COLOR = '#1f2937'

/** Colors offered as quick picks in the text-color popover. */
export const COMMON_TEXT_COLORS = [
  '#000000',
  '#ffffff',
  '#ef4444',
  '#f59e0b',
  '#22c55e',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
] as const

export const DEFAULT_TEXT_COLOR = '#000000'
