import { useState } from 'react'
import { ArrowLeftRight, FileText, Hash, Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { HeaderLink, HeaderLinkType } from '../usePhotofolioImages'
import { linkHref } from './HeaderTemplates'

const SECTION_COPY: Record<HeaderLinkType, { title: string; item: string; icon: typeof FileText }> = {
  page: { title: 'Pages', item: 'page', icon: FileText },
  spa: { title: 'SPA', item: 'section', icon: Hash },
}

/**
 * Sidebar list of the header links of one type. Pages are separate canvases; SPA entries are
 * sections of the single-page site. Edits write straight back to the header links.
 */
export function PagesPanel({
  type,
  links,
  activeId,
  photoCounts,
  onSelect,
  onLinksChange,
}: {
  type: HeaderLinkType
  /** All header links; this panel shows and edits only those of `type`. */
  links: HeaderLink[]
  activeId: string
  photoCounts: Map<string, number>
  onSelect: (id: string) => void
  onLinksChange: (links: HeaderLink[]) => void
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const copy = SECTION_COPY[type]
  const Icon = copy.icon
  const items = links.filter((l) => l.type === type)
  const otherType: HeaderLinkType = type === 'page' ? 'spa' : 'page'

  const update = (id: string, patch: Partial<HeaderLink>) =>
    onLinksChange(links.map((l) => (l.id === id ? { ...l, ...patch } : l)))

  const add = () => {
    const link: HeaderLink = { id: crypto.randomUUID(), label: `New ${copy.item} ${items.length + 1}`, type }
    onLinksChange([...links, link])
    onSelect(link.id)
    setEditingId(link.id)
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">{copy.title}</h3>
        {items.length > 0 && (
          <button
            type="button"
            onClick={add}
            aria-label={`Add ${copy.item}`}
            className="flex size-5 items-center justify-center rounded-md border border-border/60 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
          >
            <Plus className="size-3" />
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <button
          type="button"
          onClick={add}
          className="flex w-full items-center justify-center gap-1 rounded-md border border-dashed border-border/60 py-1.5 text-[10px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
        >
          <Plus className="size-3" />
          Add {copy.item}
        </button>
      ) : (
        <ul className="space-y-1">
          {items.map((link) => {
            const isActive = link.id === activeId
            const count = photoCounts.get(link.id) ?? 0
            return (
              <li
                key={link.id}
                className={cn(
                  'group flex items-center gap-1.5 rounded-md border px-1.5 py-1 transition-colors',
                  isActive ? 'border-primary/40 bg-primary/10' : 'border-transparent hover:bg-muted/50',
                )}
              >
                <Icon className={cn('size-3 shrink-0', isActive ? 'text-primary' : 'text-muted-foreground/60')} />
                {editingId === link.id ? (
                  <input
                    autoFocus
                    type="text"
                    value={link.label}
                    onChange={(e) => update(link.id, { label: e.target.value })}
                    onBlur={() => setEditingId(null)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') setEditingId(null) }}
                    className="h-5 min-w-0 flex-1 rounded border border-border bg-background px-1 text-[10px] text-foreground"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelect(link.id)}
                    onDoubleClick={() => setEditingId(link.id)}
                    title={`${linkHref(link)} · double-click to rename`}
                    className={cn('min-w-0 flex-1 truncate text-left text-[10px] font-medium', isActive ? 'text-primary' : 'text-foreground/80')}
                  >
                    {link.label || 'Untitled'}
                  </button>
                )}
                <span className="shrink-0 text-[9px] text-muted-foreground/60">{count}</span>
                <div className="flex shrink-0 items-center opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                  <button
                    type="button"
                    onClick={() => update(link.id, { type: otherType })}
                    aria-label={`Move to ${SECTION_COPY[otherType].title}`}
                    title={`Move to ${SECTION_COPY[otherType].title}`}
                    className="flex size-5 items-center justify-center rounded text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  >
                    <ArrowLeftRight className="size-2.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onLinksChange(links.filter((l) => l.id !== link.id))}
                    aria-label={`Delete ${link.label}`}
                    className="flex size-5 items-center justify-center rounded text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="size-2.5" />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
