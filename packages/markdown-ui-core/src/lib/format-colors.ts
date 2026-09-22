/**
 * Shared color palette for inline text-color formatting.
 *
 * Single source of truth so the editor toolbar swatches and stored HTML use
 * the same values. TipTap's Color extension accepts arbitrary CSS color
 * strings, so these are applied verbatim as mark attributes.
 */

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
