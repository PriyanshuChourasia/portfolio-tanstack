import type { Point, CanvasItemData } from './types'
import { CANVAS_DEFAULTS } from './constants'

/** Clamp a number between min and max. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/** Snap a point to the grid. */
export function snapPointToGrid(point: Point, gridSize: number): Point {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize,
  }
}

/** Calculate the new zoom level, clamped between min and max. */
export function calculateZoom(
  currentZoom: number,
  delta: number,
  minZoom: number,
  maxZoom: number,
): number {
  const factor = 1 + delta * 0.001
  return clamp(currentZoom * factor, minZoom, maxZoom)
}

/** Find the highest zIndex among items and return z + 1. */
export function nextZIndex(items: CanvasItemData[]): number {
  if (items.length === 0) return 1
  return Math.max(...items.map((i) => i.zIndex)) + 1
}

/** Generate a unique ID for canvas items. */
export function generateItemId(photoId: number): string {
  return `photo-${photoId}-${Date.now()}`
}

/** Default dimensions for a photo placed on canvas. */
export const DEFAULT_ITEM_SIZE = { width: 280, height: 210 } as const
