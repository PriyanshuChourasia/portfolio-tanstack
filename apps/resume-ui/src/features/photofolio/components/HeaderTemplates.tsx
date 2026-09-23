import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  Camera,
  Dribbble,
  Facebook,
  FileText,
  Github,
  Globe,
  Hash,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Plus,
  Trash2,
  Twitter,
  Youtube,
  type LucideIcon,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import type { CanvasBand, HeaderLink, HeaderLinkType, SocialLink, SocialPlatform } from '../usePhotofolioImages'

export type HeaderVariant = 'centered' | 'nav-right' | 'logo-cta' | 'stacked' | 'minimal' | 'banner'
export type FooterVariant = 'simple' | 'links-center' | 'split' | 'social' | 'columns' | 'accent'
export type BandKind = 'header' | 'footer'

/** Editable footer content a design shows, beyond its text line and the shared links. */
export type FooterField = 'socials' | 'brand' | 'headings'

interface BandTemplate<V extends string> {
  id: V
  name: string
  description: string
  hasLinks: boolean
  fields?: FooterField[]
}

export const HEADER_TEMPLATES: BandTemplate<HeaderVariant>[] = [
  { id: 'centered', name: 'Centered', description: 'Bold title in the middle', hasLinks: false },
  { id: 'nav-right', name: 'Classic Nav', description: 'Title left, links right', hasLinks: true },
  { id: 'logo-cta', name: 'Logo + Button', description: 'Logo mark with a call to action', hasLinks: false },
  { id: 'stacked', name: 'Stacked', description: 'Centered title with links below', hasLinks: true },
  { id: 'minimal', name: 'Minimal', description: 'Small spaced-out wordmark', hasLinks: false },
  { id: 'banner', name: 'Banner', description: 'Solid accent bar', hasLinks: true },
]

export const FOOTER_TEMPLATES: BandTemplate<FooterVariant>[] = [
  { id: 'simple', name: 'Simple', description: 'One centered line of text', hasLinks: false },
  { id: 'links-center', name: 'Centered Links', description: 'Links above a copyright line', hasLinks: true },
  { id: 'split', name: 'Split', description: 'Text left, links right', hasLinks: true },
  { id: 'social', name: 'Social', description: 'Text with social icons', hasLinks: false, fields: ['socials'] },
  { id: 'columns', name: 'Columns', description: 'Title, links and contact in columns', hasLinks: true, fields: ['brand', 'headings', 'socials'] },
  { id: 'accent', name: 'Accent Bar', description: 'Solid accent bar with links', hasLinks: true },
]

const TEMPLATES: Record<BandKind, BandTemplate<string>[]> = { header: HEADER_TEMPLATES, footer: FOOTER_TEMPLATES }

export const bandHasLinks = (kind: BandKind, variant?: string) =>
  TEMPLATES[kind].some((t) => t.id === variant && t.hasLinks)
export const headerHasLinks = (variant?: string) => bandHasLinks('header', variant)
export const footerFields = (variant?: string): FooterField[] =>
  FOOTER_TEMPLATES.find((t) => t.id === variant)?.fields ?? []

export const SOCIAL_PLATFORMS: Record<SocialPlatform, { label: string; icon: LucideIcon; placeholder: string }> = {
  instagram: { label: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/you' },
  twitter: { label: 'X / Twitter', icon: Twitter, placeholder: 'https://x.com/you' },
  facebook: { label: 'Facebook', icon: Facebook, placeholder: 'https://facebook.com/you' },
  linkedin: { label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/in/you' },
  github: { label: 'GitHub', icon: Github, placeholder: 'https://github.com/you' },
  youtube: { label: 'YouTube', icon: Youtube, placeholder: 'https://youtube.com/@you' },
  dribbble: { label: 'Dribbble', icon: Dribbble, placeholder: 'https://dribbble.com/you' },
  email: { label: 'Email', icon: Mail, placeholder: 'you@example.com' },
  phone: { label: 'Phone', icon: Phone, placeholder: '+91 98765 43210' },
  website: { label: 'Website', icon: Globe, placeholder: 'https://yoursite.com' },
  location: { label: 'Location', icon: MapPin, placeholder: 'City, Country' },
}

export interface FooterContent {
  socials: SocialLink[]
  brand: string
  linksTitle: string
  contactTitle: string
}

/** Footer content with defaults filled in for anything the user hasn't set yet. */
export function resolveFooterContent(band: CanvasBand): FooterContent {
  return {
    socials: band.socials ?? (['instagram', 'twitter', 'email', 'website'] as const).map((platform) => ({ id: platform, platform, value: '' })),
    brand: band.brand ?? 'Photofolio',
    linksTitle: band.linksTitle ?? 'Explore',
    contactTitle: band.contactTitle ?? 'Contact',
  }
}

export const DEFAULT_HEADER_LINKS: HeaderLink[] = ['Home', 'Gallery', 'About', 'Contact'].map((label) => ({
  id: label.toLowerCase(),
  label,
  type: 'spa',
}))

const slugify = (label: string) =>
  label.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'link'

/** Where a link points: its own route for a page, an in-page anchor for an SPA section. */
export function linkHref(link: HeaderLink): string {
  const slug = slugify(link.label)
  if (link.type === 'page') return slug === 'home' ? '/' : `/${slug}`
  return `#${slug}`
}

interface BandRenderProps {
  text: string
  links?: HeaderLink[]
  /** When set, links become clickable (used on the canvas to switch pages/sections). */
  onLinkClick?: (id: string) => void
  activeLinkId?: string
  /** Footer only; defaults are used when omitted. */
  footerContent?: FooterContent
}

function NavLinks({ links = DEFAULT_HEADER_LINKS, onLinkClick, activeLinkId, className }: Omit<BandRenderProps, 'text' | 'footerContent'> & { className?: string }) {
  if (links.length === 0) return null
  return (
    <nav className={cn('flex min-w-0 flex-wrap items-center gap-x-5 gap-y-1 text-xs font-medium', className)}>
      {links.map((link) => {
        const active = link.id === activeLinkId
        const label = link.label || 'Untitled'
        return onLinkClick ? (
          <button
            key={link.id}
            type="button"
            onClick={() => onLinkClick(link.id)}
            title={linkHref(link)}
            className={cn('transition-opacity hover:opacity-100', active ? 'underline underline-offset-4 opacity-100' : 'opacity-75')}
          >
            {label}
          </button>
        ) : (
          <span key={link.id} title={linkHref(link)} className="opacity-75">{label}</span>
        )
      })}
    </nav>
  )
}

/** Renders a header design; used on the canvas and, scaled down, in the picker previews. */
export function CanvasHeader({ variant = 'centered', text, footerContent: _footerContent, ...linkProps }: BandRenderProps & { variant?: HeaderVariant }) {
  const title = text || 'My Photofolio'

  switch (variant) {
    case 'nav-right':
      return (
        <div className="flex h-16 items-center justify-between gap-6 border-b border-current/15 px-8">
          <h1 className="truncate text-xl font-bold tracking-tight">{title}</h1>
          <NavLinks {...linkProps} />
        </div>
      )
    case 'logo-cta':
      return (
        <div className="flex h-16 items-center justify-between gap-6 border-b border-current/15 px-8">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-current/10">
              <Camera className="size-4" />
            </span>
            <h1 className="truncate text-lg font-semibold">{title}</h1>
          </div>
          <span className="shrink-0 rounded-full border border-current/40 px-4 py-1.5 text-xs font-semibold">Contact me</span>
        </div>
      )
    case 'stacked':
      return (
        <div className="flex flex-col items-center gap-2 border-b border-current/15 px-8 py-4">
          <h1 className="truncate text-2xl font-bold tracking-tight">{title}</h1>
          <NavLinks {...linkProps} className="justify-center" />
        </div>
      )
    case 'minimal':
      return (
        <div className="flex h-12 items-center px-8">
          <h1 className="truncate text-xs font-semibold uppercase tracking-[0.35em]">{title}</h1>
        </div>
      )
    case 'banner':
      return (
        <div className="flex h-16 items-center justify-between gap-6 bg-primary px-8 text-primary-foreground">
          <h1 className="truncate text-xl font-extrabold uppercase tracking-wide">{title}</h1>
          <NavLinks {...linkProps} />
        </div>
      )
    default:
      return (
        <div className="flex h-16 items-center justify-center border-b border-current/15 px-8">
          <h1 className="truncate text-2xl font-bold tracking-tight">{title}</h1>
        </div>
      )
  }
}

/** Renders a footer design; used on the canvas and, scaled down, in the picker previews. */
export function CanvasFooter({ variant = 'simple', text, footerContent, ...linkProps }: BandRenderProps & { variant?: FooterVariant }) {
  const line = text || '© Photofolio'
  const content = footerContent ?? resolveFooterContent({ enabled: true, text })
  const social = content.socials.length > 0 && (
    <div className="flex shrink-0 flex-wrap items-center gap-3 opacity-75">
      {content.socials.map((s) => {
        const { icon: Icon, label } = SOCIAL_PLATFORMS[s.platform]
        return <Icon key={s.id} className="size-4" aria-label={label}><title>{s.value || label}</title></Icon>
      })}
    </div>
  )

  switch (variant) {
    case 'links-center':
      return (
        <div className="flex flex-col items-center gap-1.5 border-t border-current/15 px-8 py-3">
          <NavLinks {...linkProps} className="justify-center" />
          <p className="truncate text-[11px] opacity-60">{line}</p>
        </div>
      )
    case 'split':
      return (
        <div className="flex h-12 items-center justify-between gap-6 border-t border-current/15 px-8">
          <p className="truncate text-xs opacity-80">{line}</p>
          <NavLinks {...linkProps} />
        </div>
      )
    case 'social':
      return (
        <div className="flex h-12 items-center justify-between gap-6 border-t border-current/15 px-8">
          <p className="truncate text-xs opacity-80">{line}</p>
          {social}
        </div>
      )
    case 'columns':
      return (
        <div className="grid grid-cols-3 gap-6 border-t border-current/15 px-8 py-4 text-xs">
          <div className="min-w-0 space-y-1">
            <p className="flex items-center gap-1.5 truncate font-semibold"><Camera className="size-3.5 shrink-0" /> {content.brand}</p>
            <p className="truncate opacity-60">{line}</p>
          </div>
          <div className="min-w-0">
            <p className="mb-1 truncate font-semibold">{content.linksTitle}</p>
            <NavLinks {...linkProps} className="flex-col items-start gap-y-0.5 text-[11px]" />
          </div>
          <div className="min-w-0 space-y-1">
            <p className="truncate font-semibold">{content.contactTitle}</p>
            {social}
          </div>
        </div>
      )
    case 'accent':
      return (
        <div className="flex h-12 items-center justify-between gap-6 bg-primary px-8 text-primary-foreground">
          <p className="truncate text-xs font-semibold">{line}</p>
          <NavLinks {...linkProps} />
        </div>
      )
    default:
      return (
        <div className="flex h-10 items-center justify-center border-t border-current/15 px-8">
          <p className="truncate text-xs opacity-80">{line}</p>
        </div>
      )
  }
}

function CanvasBand({ kind, variant, ...props }: BandRenderProps & { kind: BandKind; variant: string }) {
  return kind === 'header'
    ? <CanvasHeader variant={variant as HeaderVariant} {...props} />
    : <CanvasFooter variant={variant as FooterVariant} {...props} />
}

function LinkTypeToggle({ value, onChange }: { value: HeaderLinkType; onChange: (type: HeaderLinkType) => void }) {
  return (
    <div className="flex shrink-0 rounded-md bg-muted/50 p-0.5">
      {([
        { type: 'page', label: 'Page', icon: FileText },
        { type: 'spa', label: 'SPA', icon: Hash },
      ] as const).map(({ type, label, icon: Icon }) => (
        <button
          key={type}
          type="button"
          onClick={() => onChange(type)}
          title={type === 'page' ? 'Opens its own page' : 'Scrolls to a section on the same page'}
          className={cn(
            'flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors',
            value === type ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground',
          )}
        >
          <Icon className="size-2.5" />
          {label}
        </button>
      ))}
    </div>
  )
}

/** Add, rename, delete links and choose Page vs SPA for each. Used in the sidebar and the picker. */
export function HeaderLinksEditor({
  links,
  onChange,
  compact = false,
}: {
  links: HeaderLink[]
  onChange: (links: HeaderLink[]) => void
  compact?: boolean
}) {
  const update = (id: string, patch: Partial<HeaderLink>) =>
    onChange(links.map((l) => (l.id === id ? { ...l, ...patch } : l)))
  const remove = (id: string) => onChange(links.filter((l) => l.id !== id))
  const add = () =>
    onChange([...links, { id: crypto.randomUUID(), label: `Link ${links.length + 1}`, type: links.at(-1)?.type ?? 'spa' }])

  return (
    <div className="space-y-1.5">
      {links.map((link) => (
        <div
          key={link.id}
          className={cn('rounded-md border border-border/50 bg-background/40 p-1.5', compact ? 'space-y-1' : 'flex items-center gap-2')}
        >
          <div className={cn('flex items-center gap-1', !compact && 'flex-1')}>
            <input
              type="text"
              value={link.label}
              placeholder="Link label"
              onChange={(e) => update(link.id, { label: e.target.value })}
              className={cn('h-6 min-w-0 flex-1 rounded border border-border bg-background px-1.5 text-foreground', compact ? 'text-[10px]' : 'text-xs')}
            />
            {compact && (
              <button
                type="button"
                onClick={() => remove(link.id)}
                aria-label={`Delete ${link.label}`}
                className="flex size-6 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="size-3" />
              </button>
            )}
          </div>
          <div className="flex items-center justify-between gap-2">
            <LinkTypeToggle value={link.type} onChange={(type) => update(link.id, { type })} />
            <code className="truncate text-[9px] text-muted-foreground/70">{linkHref(link)}</code>
          </div>
          {!compact && (
            <button
              type="button"
              onClick={() => remove(link.id)}
              aria-label={`Delete ${link.label}`}
              className="flex size-6 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="size-3.5" />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="flex w-full items-center justify-center gap-1 rounded-md border border-dashed border-border/60 py-1 text-[10px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
      >
        <Plus className="size-3" />
        Add link
      </button>
    </div>
  )
}

/** Two-step picker: choose a header/footer design, then (for designs with links) set each link to Page or SPA. */
export function BandPickerDialog({
  kind,
  open,
  onOpenChange,
  selected,
  text,
  links,
  footerContent,
  bgColor,
  textColor,
  onApply,
}: {
  kind: BandKind
  open: boolean
  onOpenChange: (open: boolean) => void
  selected?: string
  text: string
  links: HeaderLink[]
  footerContent?: FooterContent
  bgColor: string
  textColor: string
  onApply: (variant: string, links: HeaderLink[]) => void
}) {
  const [step, setStep] = useState<'design' | 'links'>('design')
  const [pendingVariant, setPendingVariant] = useState('')
  const [pendingLinks, setPendingLinks] = useState<HeaderLink[]>(links)
  const templates = TEMPLATES[kind]

  // Start fresh each time the modal opens.
  useEffect(() => {
    if (!open) return
    setStep('design')
    setPendingLinks(links)
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  const handlePick = (variant: string) => {
    if (!bandHasLinks(kind, variant)) {
      onApply(variant, pendingLinks)
      return
    }
    setPendingVariant(variant)
    setStep('links')
  }

  const setAllTypes = (type: HeaderLinkType) => setPendingLinks((prev) => prev.map((l) => ({ ...l, type })))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        {step === 'design' ? (
          <>
            <DialogHeader>
              <DialogTitle>Choose a {kind}</DialogTitle>
              <DialogDescription>Pick a {kind} design for your photofolio. You can change it any time.</DialogDescription>
            </DialogHeader>

            <div className="custom-scrollbar grid max-h-[65vh] grid-cols-1 gap-3 overflow-y-auto py-1 sm:grid-cols-2">
              {templates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => handlePick(template.id)}
                  className={cn(
                    'group overflow-hidden rounded-xl border-2 text-left transition-colors',
                    selected === template.id ? 'border-primary ring-2 ring-primary/30' : 'border-border/60 hover:border-primary/50',
                  )}
                >
                  {/* Preview renders at 2x width then scales down, so it matches the real canvas band. */}
                  <div
                    className={cn('pointer-events-none flex h-20 overflow-hidden', kind === 'footer' && 'items-end')}
                    style={{ backgroundColor: bgColor, color: textColor }}
                  >
                    <div className={cn('w-[200%] shrink-0 scale-50', kind === 'header' ? 'origin-top-left' : 'origin-bottom-left')}>
                      <CanvasBand kind={kind} variant={template.id} text={text} links={pendingLinks} footerContent={footerContent} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-border/60 px-3 py-2">
                    <div>
                      <p className="text-xs font-semibold text-foreground">{template.name}</p>
                      <p className="text-[10px] text-muted-foreground">{template.description}</p>
                    </div>
                    {template.hasLinks && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[9px] font-medium text-muted-foreground">Links</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Set up your links</DialogTitle>
              <DialogDescription>
                For each link, choose <strong>Page</strong> (opens its own page) or <strong>SPA</strong> (scrolls to a section on
                this single page). Header and footer share these links, and they appear under Pages and SPA in the sidebar.
              </DialogDescription>
            </DialogHeader>

            <div className="overflow-hidden rounded-xl border border-border/60" style={{ backgroundColor: bgColor, color: textColor }}>
              <CanvasBand kind={kind} variant={pendingVariant} text={text} links={pendingLinks} footerContent={footerContent} />
            </div>

            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              Set all to
              <button type="button" onClick={() => setAllTypes('page')} className="rounded border border-border/60 px-2 py-0.5 hover:bg-muted">
                Page
              </button>
              <button type="button" onClick={() => setAllTypes('spa')} className="rounded border border-border/60 px-2 py-0.5 hover:bg-muted">
                SPA
              </button>
            </div>

            <div className="custom-scrollbar max-h-[40vh] overflow-y-auto pr-1">
              <HeaderLinksEditor links={pendingLinks} onChange={setPendingLinks} />
            </div>

            <DialogFooter className="sm:justify-between">
              <button
                type="button"
                onClick={() => setStep('design')}
                className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <ArrowLeft className="size-3.5" />
                Back to designs
              </button>
              <button
                type="button"
                onClick={() => onApply(pendingVariant, pendingLinks)}
                className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Apply {kind}
              </button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
