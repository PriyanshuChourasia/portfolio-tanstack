import { useCallback, useState } from 'react'
import type { CanvasItemData } from '../types'
import { generateItemId, nextZIndex, snapPointToGrid, DEFAULT_ITEM_SIZE } from '../utils'
import { CANVAS_DEFAULTS } from '../constants'

export function useCanvasItems() {
  const [items, setItems] = useState<CanvasItemData[]>([])
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)

  const addItem = useCallback(
    (photoId: number, position?: { x: number; y: number }) => {
      const pos = position ?? { x: 100 + Math.random() * 200, y: 100 + Math.random() * 200 }
      const snapped = snapPointToGrid(pos, CANVAS_DEFAULTS.GRID_SIZE)
      const newItem: CanvasItemData = {
        id: generateItemId(photoId),
        photoId,
        x: snapped.x,
        y: snapped.y,
        width: DEFAULT_ITEM_SIZE.width,
        height: DEFAULT_ITEM_SIZE.height,
        rotation: 0,
        zIndex: nextZIndex(items),
      }
      setItems((prev) => [...prev, newItem])
      setSelectedItemId(newItem.id)
      return newItem.id
    },
    [items],
  )

  const moveItem = useCallback((id: string, x: number, y: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...snapPointToGrid({ x, y }, CANVAS_DEFAULTS.GRID_SIZE) } : item,
      ),
    )
  }, [])

  const deleteItem = useCallback(
    (id: string) => {
      setItems((prev) => prev.filter((item) => item.id !== id))
      if (selectedItemId === id) setSelectedItemId(null)
    },
    [selectedItemId],
  )

  const bringToFront = useCallback((id: string) => {
    setItems((prev) => {
      const maxZ = Math.max(...prev.map((i) => i.zIndex))
      return prev.map((item) => (item.id === id ? { ...item, zIndex: maxZ + 1 } : item))
    })
  }, [])

  const selectItem = useCallback((id: string | null) => setSelectedItemId(id), [])

  const clearAll = useCallback(() => {
    setItems([])
    setSelectedItemId(null)
  }, [])

  return { items, selectedItemId, selectItem, addItem, moveItem, deleteItem, bringToFront, clearAll }
}
