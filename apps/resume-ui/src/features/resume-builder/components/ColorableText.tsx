import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

const SWATCHES = [
  '#111827',
  '#1e293b',
  '#374151',
  '#57534e',
  '#0f766e',
  '#0891b2',
  '#2563eb',
  '#7c3aed',
  '#be185d',
  '#dc2626',
  '#d97706',
  '#059669',
  '#ffffff',
]

interface ColorableTextProps {
  as?: ElementType
  className?: string
  style?: CSSProperties
  color: string
  /** Present only in the interactive builder preview. Omitting it renders plain, non-interactive text. */
  onChange?: (color: string) => void
  children: ReactNode
}

export function ColorableText({ as: Tag = 'span', className, style, color, onChange, children }: ColorableTextProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const timer = setTimeout(() => document.addEventListener('click', handleClick), 0)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('click', handleClick)
    }
  }, [open])

  if (!onChange) {
    return (
      <Tag className={className} style={{ ...style, color }}>
        {children}
      </Tag>
    )
  }

  return (
    <div ref={containerRef} className="relative block w-fit max-w-full">
      <Tag
        className={cn(
          className,
          'cursor-pointer rounded-sm outline-offset-2 transition-shadow hover:outline hover:outline-dashed hover:outline-2',
          'print:cursor-auto print:hover:outline-0',
        )}
        style={{ ...style, color, outlineColor: color }}
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
        title="Click to change color"
      >
        {children}
      </Tag>

      {open && (
        <div
          className="bg-popover text-popover-foreground absolute left-0 top-full z-50 mt-1.5 w-44 max-w-[calc(100vw-2rem)] rounded-lg border p-2.5 shadow-lg dark:shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-2 flex flex-wrap gap-1.5">
            {SWATCHES.map((sw) => (
              <button
                key={sw}
                type="button"
                onClick={() => {
                  onChange(sw)
                  setOpen(false)
                }}
                className={cn(
                  'size-5 shrink-0 rounded-full border transition-transform hover:scale-110',
                  sw.toLowerCase() === color.toLowerCase()
                    ? 'ring-primary ring-2 ring-offset-1'
                    : 'border-black/10 dark:border-white/20',
                )}
                style={{ backgroundColor: sw }}
                aria-label={sw}
              />
            ))}
          </div>

          <label className="flex items-center gap-2 text-xs">
            <input
              type="color"
              value={color}
              onChange={(e) => onChange(e.target.value)}
              className="size-6 shrink-0 cursor-pointer rounded border border-input bg-transparent p-0.5"
            />
            <span className="text-muted-foreground">Custom</span>
          </label>

          <button
            type="button"
            onClick={() => {
              onChange('')
              setOpen(false)
            }}
            className="text-muted-foreground hover:text-foreground mt-2 text-[11px] font-medium hover:underline"
          >
            Reset to theme color
          </button>
        </div>
      )}
    </div>
  )
}
