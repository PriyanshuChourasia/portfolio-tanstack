import { memo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { GripVertical, X } from 'lucide-react'
import type { CanvasItemData, PhotoItem } from '../types'
import { cn } from '@/lib/utils'

interface CanvasItemProps {
  item: CanvasItemData
  photo: PhotoItem | undefined
  isSelected: boolean
  onPointerDown: (e: React.PointerEvent, target: 'item', id: string) => void
  onRemove: (id: string) => void
}

export const CanvasItemNode = memo(function CanvasItemNode({
  item,
  photo,
  isSelected,
  onPointerDown,
  onRemove,
}: CanvasItemProps) {
  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onRemove(item.id)
    },
    [item.id, onRemove],
  )

  if (!photo) return null

  return (
    <motion.div
      className={cn(
        'absolute select-none rounded-xl overflow-hidden cursor-grab active:cursor-grabbing',
        'shadow-lg hover:shadow-2xl transition-shadow duration-200',
        isSelected && 'ring-2 ring-primary ring-offset-2 ring-offset-transparent',
      )}
      style={{
        left: item.x,
        top: item.y,
        width: item.width,
        height: item.height,
        transform: `rotate(${item.rotation}deg)`,
        zIndex: item.zIndex,
      }}
      onPointerDown={(e) => onPointerDown(e, 'item', item.id)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.6 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.02 }}
    >
      <img src={photo.image} alt={photo.title} className="h-full w-full object-cover pointer-events-none" draggable={false} />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
        <p className="text-white text-xs font-semibold truncate">{photo.title}</p>
        <p className="text-white/60 text-[10px]">{photo.category}</p>
      </div>
      {isSelected && (
        <>
          <div className="absolute top-2 left-2 p-1 bg-black/60 rounded-md backdrop-blur-sm">
            <GripVertical className="w-3 h-3 text-white/80" />
          </div>
          <button onClick={handleRemove} className="absolute top-2 right-2 p-1 bg-red-500/80 hover:bg-red-500 rounded-md transition-colors backdrop-blur-sm">
            <X className="w-3 h-3 text-white" />
          </button>
          <div className="absolute inset-0 rounded-xl ring-2 ring-primary/60 pointer-events-none" />
        </>
      )}
    </motion.div>
  )
})
