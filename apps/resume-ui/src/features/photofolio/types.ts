/**
 * Photo item type.
 */
export interface PhotoItem {
  id: number
  title: string
  category: string
  image: string
  description: string
  camera: string
  lens: string
  iso: number
  aperture: string
  shutter: string
}

/**
 * Canvas coordinate types.
 */
export interface Point {
  x: number
  y: number
}

export interface CanvasTransform {
  offset: Point
  zoom: number
}

/** A single item placed on the canvas. */
export interface CanvasItemData {
  id: string
  photoId: number
  x: number
  y: number
  width: number
  height: number
  rotation: number
  zIndex: number
}
