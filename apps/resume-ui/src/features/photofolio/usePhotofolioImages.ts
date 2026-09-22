import { useState, useCallback, useEffect } from 'react'

export interface Photo {
  id: string
  url: string
  name: string
  x: number
  y: number
  width: number
  height: number
  zoom: number
  offsetX: number
  offsetY: number
}

const DEFAULT_RATIO_W = 0.18
const DEFAULT_RATIO_H = 0.18
const DEFAULT_ZOOM = 1

function loadPhotos(projectId: string): Photo[] {
  try {
    const raw = localStorage.getItem(`photofolio-images-${projectId}`)
    const loaded: Photo[] = raw ? JSON.parse(raw) : []
    return loaded.map((p) => ({
      ...p,
      zoom: p.zoom ?? DEFAULT_ZOOM,
      offsetX: p.offsetX ?? 0,
      offsetY: p.offsetY ?? 0,
      x: p.x ?? 0.02,
      y: p.y ?? 0.02,
      width: p.width ?? DEFAULT_RATIO_W,
      height: p.height ?? DEFAULT_RATIO_H,
      name: p.name ?? 'Photo',
    }))
  } catch {
    return []
  }
}

function savePhotos(projectId: string, photos: Photo[]) {
  try {
    localStorage.setItem(`photofolio-images-${projectId}`, JSON.stringify(photos))
  } catch { /* ignore */ }
}

export function usePhotofolioImages(projectId: string) {
  const [photos, setPhotos] = useState<Photo[]>(() => loadPhotos(projectId))

  useEffect(() => {
    savePhotos(projectId, photos)
  }, [photos, projectId])

  const addPhotos = useCallback((files: File[]) => {
    setPhotos((prev) => {
      const newPhotos: Photo[] = files
        .filter((f) => f.type.startsWith('image/'))
        .map((file, i) => {
          const idx = prev.length + i
          return {
            id: crypto.randomUUID(),
            url: URL.createObjectURL(file),
            name: file.name,
            x: (0.02 + (idx * 0.024)) % 0.5,
            y: (0.02 + (idx * 0.024)) % 0.4,
            width: DEFAULT_RATIO_W,
            height: DEFAULT_RATIO_H,
            zoom: DEFAULT_ZOOM,
            offsetX: 0,
            offsetY: 0,
          }
        })
      return [...prev, ...newPhotos]
    })
  }, [])

  const removePhoto = useCallback((id: string) => {
    setPhotos((prev) => {
      const photo = prev.find((p) => p.id === id)
      if (photo) URL.revokeObjectURL(photo.url)
      return prev.filter((p) => p.id !== id)
    })
  }, [])

  const updatePhoto = useCallback((id: string, updates: Partial<Pick<Photo, 'x' | 'y' | 'width' | 'height' | 'zoom' | 'offsetX' | 'offsetY'>>) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    )
  }, [])

  const clearAll = useCallback(() => {
    photos.forEach((p) => URL.revokeObjectURL(p.url))
    setPhotos([])
  }, [photos])

  return { photos, addPhotos, removePhoto, updatePhoto, clearAll }
}

export function usePhotofolioCanvasSettings(projectId: string) {
  const [layoutMode, setLayoutMode] = useState<'free' | 'grid'>(() => {
    try { return (localStorage.getItem(`photofolio-layout-mode-${projectId}`) as 'free' | 'grid') || 'free' } catch { return 'free' }
  })
  const [columns, setColumns] = useState(() => {
    try { return parseInt(localStorage.getItem(`photofolio-columns-${projectId}`) || '3', 10) } catch { return 3 }
  })
  const [canvasBgColor, setCanvasBgColor] = useState(() => {
    try { return localStorage.getItem(`photofolio-canvas-bg-${projectId}`) || '#ffffff' } catch { return '#ffffff' }
  })
  const [canvasZoom, setCanvasZoom] = useState(() => {
    try { return parseFloat(localStorage.getItem(`photofolio-canvas-zoom-${projectId}`) || '1') } catch { return 1 }
  })

  useEffect(() => {
    try { localStorage.setItem(`photofolio-layout-mode-${projectId}`, layoutMode) } catch { /* ignore */ }
  }, [layoutMode, projectId])
  useEffect(() => {
    try { localStorage.setItem(`photofolio-columns-${projectId}`, columns.toString()) } catch { /* ignore */ }
  }, [columns, projectId])
  useEffect(() => {
    try { localStorage.setItem(`photofolio-canvas-bg-${projectId}`, canvasBgColor) } catch { /* ignore */ }
  }, [canvasBgColor, projectId])
  useEffect(() => {
    try { localStorage.setItem(`photofolio-canvas-zoom-${projectId}`, canvasZoom.toString()) } catch { /* ignore */ }
  }, [canvasZoom, projectId])

  return { layoutMode, setLayoutMode, columns, setColumns, canvasBgColor, setCanvasBgColor, canvasZoom, setCanvasZoom }
}
