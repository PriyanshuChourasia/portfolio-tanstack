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
  /** Header link (page or SPA section) this photo belongs to; missing means the home canvas. */
  pageId?: string
}

export type PhotoPlacement = Pick<Photo, 'x' | 'y' | 'width' | 'height'>

export const HOME_PAGE_ID = 'home'
export const photoPageId = (photo: Photo) => photo.pageId ?? HOME_PAGE_ID

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

  /** Adds images to a page; `place` optionally positions photo `i` of the batch (e.g. a section template). */
  const addPhotos = useCallback((files: File[], pageId: string = HOME_PAGE_ID, place?: (i: number, count: number) => PhotoPlacement) => {
    setPhotos((prev) => {
      const images = files.filter((f) => f.type.startsWith('image/'))
      const newPhotos: Photo[] = images
        .map((file, i) => {
          const idx = prev.filter((p) => photoPageId(p) === pageId).length + i
          return {
            id: crypto.randomUUID(),
            pageId,
            url: URL.createObjectURL(file),
            name: file.name,
            x: (0.02 + (idx * 0.024)) % 0.5,
            y: (0.02 + (idx * 0.024)) % 0.4,
            width: DEFAULT_RATIO_W,
            height: DEFAULT_RATIO_H,
            zoom: DEFAULT_ZOOM,
            offsetX: 0,
            offsetY: 0,
            ...place?.(i, images.length),
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

  /** Moves a photo into the slot currently held by `targetId` (works within a single page's subset). */
  const reorderPhoto = useCallback((id: string, targetId: string) => {
    setPhotos((prev) => {
      const from = prev.findIndex((p) => p.id === id)
      const to = prev.findIndex((p) => p.id === targetId)
      if (from === -1 || to === -1 || from === to) return prev
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
  }, [])

  /** Removes every photo on the given page, or all photos when no page is given. */
  const clearAll = useCallback((pageId?: string) => {
    setPhotos((prev) => {
      const removed = pageId ? prev.filter((p) => photoPageId(p) === pageId) : prev
      removed.forEach((p) => URL.revokeObjectURL(p.url))
      return pageId ? prev.filter((p) => photoPageId(p) !== pageId) : []
    })
  }, [])

  return { photos, addPhotos, removePhoto, updatePhoto, reorderPhoto, clearAll }
}

export type HeaderLinkType = 'page' | 'spa'

export interface HeaderLink {
  id: string
  label: string
  /** 'page' links to its own route; 'spa' scrolls to a section on the same page. */
  type: HeaderLinkType
}

export interface CanvasBand {
  enabled: boolean
  text: string
  /** Header design id (see HEADER_TEMPLATES); unused for the footer. */
  variant?: string
  /** Nav links for header designs that show them; unused for the footer. */
  links?: HeaderLink[]
  /** Footer only: contact/social icons. */
  socials?: SocialLink[]
  /** Footer only: brand name and column headings used by the Columns design. */
  brand?: string
  linksTitle?: string
  contactTitle?: string
}

export type SocialPlatform =
  | 'instagram' | 'twitter' | 'facebook' | 'linkedin' | 'github' | 'youtube' | 'dribbble'
  | 'email' | 'phone' | 'website' | 'location'

export interface SocialLink {
  id: string
  platform: SocialPlatform
  /** URL, email address, phone number or place, depending on the platform. */
  value: string
}

function loadBand(key: string, fallbackText: string): CanvasBand {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return { enabled: false, text: fallbackText, ...JSON.parse(raw) }
  } catch { /* ignore */ }
  return { enabled: false, text: fallbackText }
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

  const [header, setHeader] = useState<CanvasBand>(() => loadBand(`photofolio-header-${projectId}`, 'My Photofolio'))
  const [footer, setFooter] = useState<CanvasBand>(() => loadBand(`photofolio-footer-${projectId}`, '© Photofolio'))

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

  useEffect(() => {
    try { localStorage.setItem(`photofolio-header-${projectId}`, JSON.stringify(header)) } catch { /* ignore */ }
  }, [header, projectId])
  useEffect(() => {
    try { localStorage.setItem(`photofolio-footer-${projectId}`, JSON.stringify(footer)) } catch { /* ignore */ }
  }, [footer, projectId])

  return { layoutMode, setLayoutMode, columns, setColumns, canvasBgColor, setCanvasBgColor, canvasZoom, setCanvasZoom, header, setHeader, footer, setFooter }
}
