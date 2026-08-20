import { memo } from 'react'
import type { CanvasTransform } from '../types'
import { CANVAS_COLORS } from '../constants'

interface CanvasGridProps {
  transform: CanvasTransform
  gridSize: number
}

export const CanvasGrid = memo(function CanvasGrid({ transform, gridSize }: CanvasGridProps) {
  const scaledGrid = gridSize * transform.zoom
  if (scaledGrid < 4) return null

  const offsetX = transform.offset.x % scaledGrid
  const offsetY = transform.offset.y % scaledGrid

  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" style={{ zIndex: 0 }}>
      <defs>
        <pattern id="grid-minor" width={scaledGrid} height={scaledGrid} patternUnits="userSpaceOnUse" x={offsetX} y={offsetY}>
          <path d={`M ${scaledGrid} 0 L 0 0 0 ${scaledGrid}`} fill="none" stroke={CANVAS_COLORS.GRID_LINE} strokeWidth={0.5} />
        </pattern>
        <pattern id="grid-major" width={scaledGrid * 5} height={scaledGrid * 5} patternUnits="userSpaceOnUse" x={offsetX} y={offsetY}>
          <path d={`M ${scaledGrid * 5} 0 L 0 0 0 ${scaledGrid * 5}`} fill="none" stroke={CANVAS_COLORS.GRID_LINE_STRONG} strokeWidth={1} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-minor)" />
      <rect width="100%" height="100%" fill="url(#grid-major)" />
    </svg>
  )
})
