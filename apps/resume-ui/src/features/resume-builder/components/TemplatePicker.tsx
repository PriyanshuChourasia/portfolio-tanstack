import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { resumeTemplates } from '../templates/registry'

interface TemplatePickerProps {
  selectedId: string
  onSelect: (id: string) => void
}

const templateColors: Record<string, string> = {
  classic: 'bg-amber-600',
  modern: 'bg-sky-600',
  bold: 'bg-blue-700',
  elegant: 'bg-rose-600',
  minimal: 'bg-stone-600',
  sidebar: 'bg-teal-600',
  accent: 'bg-violet-600',
  premium: 'bg-cyan-700',
  fresh: 'bg-emerald-500',
  navy: 'bg-indigo-800',
  simple: 'bg-gray-500',
  visual: 'bg-pink-600',
}

export function TemplatePicker({ selectedId, onSelect }: TemplatePickerProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const selected = resumeTemplates.find((t) => t.id === selectedId)

  // Close on click outside (using pointerdown for earlier detection)
  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    // Delay so the trigger's own click doesn't immediately close the dropdown
    const timer = setTimeout(() => document.addEventListener('click', handleClick), 0)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('click', handleClick)
    }
  }, [open])

  const handleSelect = (id: string) => {
    onSelect(id)
    setOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return

    const items = listRef.current?.querySelectorAll<HTMLButtonElement>('[role="option"]')
    if (!items || items.length === 0) return

    const currentIndex = Array.from(items).findIndex(
      (item) => item.getAttribute('data-id') === selectedId,
    )

    let nextIndex = currentIndex

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
        items[nextIndex]?.focus()
        break
      case 'ArrowUp':
        e.preventDefault()
        nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
        items[nextIndex]?.focus()
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        // Use the focused element's data-id, not the selectedId index
        const focusedItem =
          document.activeElement?.closest<HTMLButtonElement>('[role="option"]')
        const focusedId = focusedItem?.getAttribute('data-id')
        if (focusedId) handleSelect(focusedId)
        break
      case 'Escape':
        e.preventDefault()
        setOpen(false)
        // Return focus to the trigger button
        containerRef.current?.querySelector<HTMLButtonElement>('[aria-haspopup]')?.focus()
        break
    }
  }

  return (
    <div ref={containerRef} className="relative" onKeyDown={handleKeyDown}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select a resume template"
        onClick={() => setOpen(!open)}
        className={cn(
          'inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium transition-all',
          'hover:bg-accent focus-visible:ring-ring focus-visible:ring-2',
          open
            ? 'border-primary ring-primary/30 ring-2'
            : 'border-input text-muted-foreground hover:border-border hover:text-foreground',
        )}
      >
        {selected && (
          <span
            className={cn(
              'inline-block size-3 shrink-0 rounded-sm',
              templateColors[selected.id] ?? 'bg-gray-500',
            )}
          />
        )}
        <span>{selected?.name ?? 'Select template'}</span>
        <svg
          className={`size-3.5 text-muted-foreground transition-transform ${
            open ? 'rotate-180' : ''
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          ref={listRef}
          role="listbox"
          aria-label="Resume templates"
          className="bg-popover text-popover-foreground absolute left-0 top-full z-50 mt-1 w-60 origin-top-right rounded-lg border shadow-lg dark:shadow-2xl"
        >
          <div className="max-h-72 overflow-y-auto p-1">
            {resumeTemplates.map((template) => {
              const isSelected = selectedId === template.id
              const colorClass = templateColors[template.id] ?? 'bg-gray-500'

              return (
                <button
                  key={template.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  data-id={template.id}
                  onClick={() => handleSelect(template.id)}
                  className={cn(
                    'flex w-full items-start gap-3 rounded-md px-2.5 py-2 text-left text-xs transition-colors',
                    isSelected
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-accent text-foreground/80 hover:text-foreground',
                  )}
                >
                  <span
                    className={cn(
                      'mt-0.5 inline-block size-3.5 shrink-0 rounded-sm',
                      colorClass,
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{template.name}</span>
                    {template.description && (
                      <span className="text-muted-foreground mt-0.5 block leading-tight">
                        {template.description}
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <svg
                      className="mt-0.5 size-3.5 shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
