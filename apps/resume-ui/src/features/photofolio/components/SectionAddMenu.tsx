import { useEffect, useRef, useState } from 'react'
import {
  Columns2,
  Contact,
  Heading,
  Image,
  ImagePlus,
  LayoutDashboard,
  LayoutGrid,
  MousePointerClick,
  PanelLeft,
  Plus,
  Quote,
  Sparkles,
  Text,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PhotoPlacement } from '../usePhotofolioImages'
import type { NewContentBlock } from '../useCanvasBlocks'

export interface SectionTemplate {
  id: string
  label: string
  description: string
  icon: LucideIcon
  group: 'content' | 'photos'
  /** Opens the file picker; `place` positions photo `i` of `count` (omitted = default free placement). */
  photos?: { multiple: boolean; place?: (i: number, count: number) => PhotoPlacement }
  /** Text blocks added with this template. */
  blocks?: NewContentBlock[]
}

const PAD = 0.04
const GAP = 0.02

const block = (b: Partial<NewContentBlock> & Pick<NewContentBlock, 'kind' | 'text' | 'x' | 'y' | 'width' | 'height'>): NewContentBlock => ({
  align: 'center',
  blur: false,
  ...b,
})

export const SECTION_TEMPLATES: SectionTemplate[] = [
  // Content
  {
    id: 'heading',
    group: 'content',
    label: 'Heading',
    description: 'A large title',
    icon: Heading,
    blocks: [block({ kind: 'heading', text: 'Your heading', x: 0.1, y: 0.38, width: 0.8, height: 0.18 })],
  },
  {
    id: 'text',
    group: 'content',
    label: 'Text',
    description: 'A paragraph of text',
    icon: Text,
    blocks: [block({ kind: 'paragraph', text: 'Write something about this section. Double-click to edit.', x: 0.2, y: 0.36, width: 0.6, height: 0.26 })],
  },
  {
    id: 'intro',
    group: 'content',
    label: 'Heading + text',
    description: 'Title with a short intro below',
    icon: Sparkles,
    blocks: [
      block({ kind: 'heading', text: 'Hello, I’m a photographer', x: 0.12, y: 0.26, width: 0.76, height: 0.18 }),
      block({ kind: 'paragraph', text: 'I capture people, places and the light in between. Double-click to edit.', x: 0.2, y: 0.46, width: 0.6, height: 0.2 }),
    ],
  },
  {
    id: 'quote',
    group: 'content',
    label: 'Quote',
    description: 'A highlighted quote',
    icon: Quote,
    blocks: [block({ kind: 'quote', text: '“Photography is the story I fail to put into words.”', align: 'left', x: 0.18, y: 0.36, width: 0.64, height: 0.24 })],
  },
  {
    id: 'button',
    group: 'content',
    label: 'Button',
    description: 'A call-to-action button',
    icon: MousePointerClick,
    blocks: [block({ kind: 'button', text: 'Book a session', x: 0.35, y: 0.43, width: 0.3, height: 0.14 })],
  },
  {
    id: 'contact',
    group: 'content',
    label: 'Contact details',
    description: 'Heading with email, phone and location',
    icon: Contact,
    blocks: [
      block({ kind: 'heading', text: 'Get in touch', x: 0.2, y: 0.24, width: 0.6, height: 0.16 }),
      block({ kind: 'contact', text: 'you@example.com\n+91 98765 43210\nCity, Country', x: 0.3, y: 0.44, width: 0.4, height: 0.26 }),
    ],
  },
  {
    id: 'overlay',
    group: 'content',
    label: 'Image + blurred text',
    description: 'Full photo with a frosted-glass text card',
    icon: Image,
    photos: { multiple: false, place: () => ({ x: 0, y: 0, width: 1, height: 1 }) },
    blocks: [
      block({ kind: 'heading', text: 'Captured moments', blur: true, x: 0.25, y: 0.32, width: 0.5, height: 0.2 }),
      block({ kind: 'paragraph', text: 'A short line about this photo.', blur: true, x: 0.3, y: 0.55, width: 0.4, height: 0.12 }),
    ],
  },
  {
    id: 'about',
    group: 'content',
    label: 'About (photo + text)',
    description: 'Photo on the left, text on the right',
    icon: PanelLeft,
    photos: { multiple: false, place: () => ({ x: PAD, y: PAD, width: 0.44, height: 1 - PAD * 2 }) },
    blocks: [
      block({ kind: 'heading', text: 'About me', align: 'left', x: 0.54, y: 0.22, width: 0.4, height: 0.16 }),
      block({ kind: 'paragraph', text: 'Tell visitors who you are, what you shoot and how to work with you. Double-click to edit.', align: 'left', x: 0.54, y: 0.4, width: 0.4, height: 0.3 }),
    ],
  },
  // Photos
  { id: 'upload', group: 'photos', label: 'Upload photos', description: 'Add photos and arrange them freely', icon: ImagePlus, photos: { multiple: true } },
  {
    id: 'hero',
    group: 'photos',
    label: 'Hero image',
    description: 'One photo filling the section',
    icon: Image,
    photos: { multiple: false, place: () => ({ x: PAD, y: PAD, width: 1 - PAD * 2, height: 1 - PAD * 2 }) },
  },
  {
    id: 'split',
    group: 'photos',
    label: 'Side by side',
    description: 'Photos in two columns',
    icon: Columns2,
    photos: {
      multiple: true,
      place: (i, count) => {
        const rows = Math.ceil(count / 2)
        const w = (1 - PAD * 2 - GAP) / 2
        const h = (1 - PAD * 2 - GAP * (rows - 1)) / rows
        return { x: PAD + (i % 2) * (w + GAP), y: PAD + Math.floor(i / 2) * (h + GAP), width: w, height: h }
      },
    },
  },
  {
    id: 'grid',
    group: 'photos',
    label: 'Photo grid',
    description: 'Rows of three, sized to fit',
    icon: LayoutGrid,
    photos: {
      multiple: true,
      place: (i, count) => {
        const cols = Math.min(3, count)
        const rows = Math.ceil(count / cols)
        const w = (1 - PAD * 2 - GAP * (cols - 1)) / cols
        const h = (1 - PAD * 2 - GAP * (rows - 1)) / rows
        return { x: PAD + (i % cols) * (w + GAP), y: PAD + Math.floor(i / cols) * (h + GAP), width: w, height: h }
      },
    },
  },
  {
    id: 'collage',
    group: 'photos',
    label: 'Collage',
    description: 'One large photo with smaller ones beside it',
    icon: LayoutDashboard,
    photos: {
      multiple: true,
      place: (i, count) => {
        const bigW = count > 1 ? 0.58 : 1 - PAD * 2
        if (i === 0) return { x: PAD, y: PAD, width: bigW, height: 1 - PAD * 2 }
        const rest = count - 1
        const x = PAD + bigW + GAP
        const h = (1 - PAD * 2 - GAP * (rest - 1)) / rest
        return { x, y: PAD + (i - 1) * (h + GAP), width: 1 - PAD - x, height: h }
      },
    },
  },
]

const GROUPS = [
  { id: 'content', label: 'Content' },
  { id: 'photos', label: 'Photos' },
] as const

/**
 * "+" that opens a menu of ways to fill an SPA section. `large` is the centered button for an
 * empty section; the compact one sits at the bottom of a section that already has content.
 */
export function SectionAddMenu({
  sectionName,
  onPick,
  variant = 'large',
}: {
  sectionName: string
  onPick: (template: SectionTemplate) => void
  variant?: 'large' | 'compact'
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const isLarge = variant === 'large'

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={rootRef} className="pointer-events-auto relative flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Add content to ${sectionName}`}
        aria-expanded={open}
        className={cn(
          'flex items-center justify-center rounded-full border-dashed transition-all hover:scale-105 hover:border-primary hover:text-primary',
          isLarge ? 'size-14 border-2 border-current/40' : 'size-8 border border-current/40 bg-black/20 backdrop-blur-sm',
          open && 'rotate-45 border-primary text-primary',
        )}
      >
        <Plus className={isLarge ? 'size-6' : 'size-4'} />
      </button>
      {isLarge && <p className="text-xs opacity-60">Add content to {sectionName}</p>}

      {open && (
        <div
          role="menu"
          className={cn(
            'custom-scrollbar absolute z-50 max-h-80 w-72 overflow-y-auto rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-xl',
            isLarge ? 'top-full mt-2' : 'bottom-full mb-2',
          )}
        >
          {GROUPS.map((group) => (
            <div key={group.id}>
              <p className="px-2.5 pt-2 pb-1 text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">{group.label}</p>
              {SECTION_TEMPLATES.filter((t) => t.group === group.id).map((template) => {
                const Icon = template.icon
                return (
                  <button
                    key={template.id}
                    type="button"
                    role="menuitem"
                    onClick={() => { setOpen(false); onPick(template) }}
                    className="flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-muted"
                  >
                    <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>
                      <span className="block text-xs font-semibold">{template.label}</span>
                      <span className="block text-[10px] text-muted-foreground">{template.description}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
