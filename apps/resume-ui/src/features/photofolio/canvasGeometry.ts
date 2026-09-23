/** Shared geometry for boxes on the Photofolio canvas (photos and content blocks). */

export const MIN_SIZE = 40

export type ResizeHandle = 't' | 'b' | 'l' | 'r' | 'tl' | 'tr' | 'bl' | 'br'

export const RESIZE_HANDLES: ResizeHandle[] = ['t', 'b', 'l', 'r', 'tl', 'tr', 'bl', 'br']

/** Box position and size as 0..1 fractions of the canvas. */
export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

export const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))

/**
 * Resizes `orig` by dragging `handle` by (dx, dy) canvas fractions, keeping the opposite edge fixed,
 * the box inside the canvas, and at least MIN_SIZE px on each side.
 */
export function resizeRect(orig: Rect, handle: ResizeHandle, dx: number, dy: number, canvasW: number, canvasH: number): Rect {
  const minW = Math.min(MIN_SIZE / canvasW, orig.width)
  const minH = Math.min(MIN_SIZE / canvasH, orig.height)
  const right = orig.x + orig.width
  const bottom = orig.y + orig.height
  let { x, y, width, height } = orig
  if (handle.includes('r')) width = clamp(orig.width + dx, minW, 1 - orig.x)
  if (handle.includes('l')) { x = clamp(orig.x + dx, 0, right - minW); width = right - x }
  if (handle.includes('b')) height = clamp(orig.height + dy, minH, 1 - orig.y)
  if (handle.includes('t')) { y = clamp(orig.y + dy, 0, bottom - minH); height = bottom - y }
  return { x, y, width, height }
}

/** Tailwind classes that place and cursor each resize handle on its box. */
export const HANDLE_CLASSES: Record<ResizeHandle, string> = {
  t: 'top-0 inset-x-0 cursor-ns-resize',
  b: 'bottom-0 inset-x-0 cursor-ns-resize',
  l: 'left-0 inset-y-0 cursor-ew-resize',
  r: 'right-0 inset-y-0 cursor-ew-resize',
  tl: 'left-0 top-0 cursor-nwse-resize',
  br: 'right-0 bottom-0 cursor-nwse-resize',
  tr: 'right-0 top-0 cursor-nesw-resize',
  bl: 'left-0 bottom-0 cursor-nesw-resize',
}
