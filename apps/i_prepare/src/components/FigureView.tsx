import type { FigureShape, FigureSpec } from '@/data/reasoning'
import { cn } from '@/lib/utils'

/**
 * Renders a FigureSpec as inline SVG on a 100×100 canvas. Whole-figure
 * transforms (rotate / mirror / flip) compose with per-shape rotation, so bank
 * files describe one base figure and the spec derives its variants.
 */
export function FigureView({
  figure,
  className,
  size = 96,
}: {
  figure: FigureSpec
  className?: string
  size?: number
}) {
  const transform: string[] = []
  if (figure.rotate) transform.push(`rotate(${figure.rotate} 50 50)`)
  if (figure.mirror) transform.push('translate(100 0) scale(-1 1)')
  if (figure.flip) transform.push('translate(0 100) scale(1 -1)')

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={cn('shrink-0', className)}
      role="img"
      aria-label={figure.caption ?? 'figure'}
    >
      <g transform={transform.join(' ')}>{figure.shapes.map(renderShape)}</g>
    </svg>
  )
}

function strokeProps(fill?: boolean) {
  return {
    fill: fill ? 'currentColor' : 'none',
    stroke: 'currentColor',
    strokeWidth: 2.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
}

function polygonPoints(points: Array<[number, number]> | number[][]): string {
  return points.map(([x, y]) => `${x},${y}`).join(' ')
}

function starPoints(cx: number, cy: number, size: number): string {
  const outer: Array<[number, number]> = []
  const inner = size * 0.42
  for (let i = 0; i < 10; i += 1) {
    const radius = i % 2 === 0 ? size : inner
    const angle = (Math.PI / 5) * i - Math.PI / 2
    outer.push([cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)])
  }
  return polygonPoints(outer)
}

function renderShape(shape: FigureShape, index: number) {
  switch (shape.kind) {
    case 'circle':
      return <circle key={index} cx={shape.cx} cy={shape.cy} r={shape.r} {...strokeProps(shape.fill)} />
    case 'square': {
      const half = shape.size / 2
      return (
        <rect
          key={index}
          x={shape.cx - half}
          y={shape.cy - half}
          width={shape.size}
          height={shape.size}
          transform={shape.rot ? `rotate(${shape.rot} ${shape.cx} ${shape.cy})` : undefined}
          {...strokeProps(shape.fill)}
        />
      )
    }
    case 'triangle': {
      const s = shape.size
      const points = shape.down
        ? [
            [shape.cx - s / 2, shape.cy - s / 3],
            [shape.cx + s / 2, shape.cy - s / 3],
            [shape.cx, shape.cy + (s * 2) / 3],
          ]
        : [
            [shape.cx, shape.cy - (s * 2) / 3],
            [shape.cx - s / 2, shape.cy + s / 3],
            [shape.cx + s / 2, shape.cy + s / 3],
          ]
      return (
        <polygon
          key={index}
          points={polygonPoints(points)}
          transform={shape.rot && !shape.down ? `rotate(${shape.rot} ${shape.cx} ${shape.cy})` : undefined}
          {...strokeProps(shape.fill)}
        />
      )
    }
    case 'diamond': {
      const s = shape.size / 2
      return (
        <polygon
          key={index}
          points={polygonPoints([
            [shape.cx, shape.cy - s],
            [shape.cx + s, shape.cy],
            [shape.cx, shape.cy + s],
            [shape.cx - s, shape.cy],
          ])}
          {...strokeProps(shape.fill)}
        />
      )
    }
    case 'star':
      return <polygon key={index} points={starPoints(shape.cx, shape.cy, shape.size)} {...strokeProps(shape.fill)} />
    case 'arrow': {
      const s = shape.size
      const points = polygonPoints([
        [shape.cx, shape.cy - s / 2],
        [shape.cx + s / 2.6, shape.cy],
        [shape.cx + s / 6, shape.cy],
        [shape.cx + s / 6, shape.cy + s / 2],
        [shape.cx - s / 6, shape.cy + s / 2],
        [shape.cx - s / 6, shape.cy],
        [shape.cx - s / 2.6, shape.cy],
      ])
      return (
        <polygon
          key={index}
          points={points}
          transform={shape.rot ? `rotate(${shape.rot} ${shape.cx} ${shape.cy})` : undefined}
          {...strokeProps(shape.fill)}
        />
      )
    }
    case 'line':
      return (
        <line
          key={index}
          x1={shape.x1}
          y1={shape.y1}
          x2={shape.x2}
          y2={shape.y2}
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
      )
    case 'dot':
      return <circle key={index} cx={shape.cx} cy={shape.cy} r={shape.r ?? 3} fill="currentColor" />
    case 'cross': {
      const s = shape.size / 2
      return (
        <g key={index} stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
          <line x1={shape.cx - s} y1={shape.cy - s} x2={shape.cx + s} y2={shape.cy + s} />
          <line x1={shape.cx + s} y1={shape.cy - s} x2={shape.cx - s} y2={shape.cy + s} />
        </g>
      )
    }
    case 'text':
      return (
        <text
          key={index}
          x={shape.cx}
          y={shape.cy}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={shape.size ?? 22}
          fontWeight={700}
          fill="currentColor"
          stroke="none"
          fontFamily="ui-monospace, monospace"
        >
          {shape.label}
        </text>
      )
    case 'arc': {
      const rad = (deg: number) => (deg * Math.PI) / 180
      const x1 = shape.cx + shape.r * Math.cos(rad(shape.from))
      const y1 = shape.cy + shape.r * Math.sin(rad(shape.from))
      const x2 = shape.cx + shape.r * Math.cos(rad(shape.to))
      const y2 = shape.cy + shape.r * Math.sin(rad(shape.to))
      const large = Math.abs(shape.to - shape.from) > 180 ? 1 : 0
      const sweep = shape.to > shape.from ? 1 : 0
      return (
        <path
          key={index}
          d={`M ${x1} ${y1} A ${shape.r} ${shape.r} 0 ${large} ${sweep} ${x2} ${y2}`}
          stroke="currentColor"
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
        />
      )
    }
    default:
      return null
  }
}
