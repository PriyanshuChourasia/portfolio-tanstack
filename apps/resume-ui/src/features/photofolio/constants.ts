/**
 * Canvas configuration constants.
 */
export const CANVAS_DEFAULTS = {
  ZOOM_MIN: 0.1,
  ZOOM_MAX: 5,
  ZOOM_STEP: 0.1,
  ZOOM_INITIAL: 1,
  GRID_SIZE: 20,
  GRID_VISIBLE: true,
  ITEM_MIN_SIZE: 80,
  ITEM_MAX_SIZE: 800,
} as const

export const CANVAS_COLORS = {
  GRID_LINE: 'rgba(0, 212, 255, 0.06)',
  GRID_LINE_STRONG: 'rgba(0, 212, 255, 0.12)',
} as const
