import { Plus, Trash2 } from 'lucide-react'
import type { CanvasBand, SocialPlatform } from '../usePhotofolioImages'
import { SOCIAL_PLATFORMS, bandHasLinks, footerFields, resolveFooterContent } from './HeaderTemplates'

const inputClass = 'h-6 w-full min-w-0 rounded border border-border bg-background px-1.5 text-[10px] text-foreground'
const labelClass = 'text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/60'

/** Sidebar settings for whatever the chosen footer design shows: brand, headings and contact icons. */
export function FooterEditor({ footer, onChange }: { footer: CanvasBand; onChange: (footer: CanvasBand) => void }) {
  const fields = footerFields(footer.variant)
  const content = resolveFooterContent(footer)
  const { socials } = content

  const setSocials = (next: typeof socials) => onChange({ ...footer, socials: next })
  const addSocial = () => {
    const used = new Set(socials.map((s) => s.platform))
    const platform = (Object.keys(SOCIAL_PLATFORMS) as SocialPlatform[]).find((p) => !used.has(p)) ?? 'website'
    setSocials([...socials, { id: crypto.randomUUID(), platform, value: '' }])
  }

  return (
    <div className="space-y-2.5">
      {fields.includes('brand') && (
        <label className="block space-y-1">
          <span className={labelClass}>Brand name</span>
          <input type="text" value={content.brand} onChange={(e) => onChange({ ...footer, brand: e.target.value })} className={inputClass} />
        </label>
      )}

      {fields.includes('headings') && (
        <div className="grid grid-cols-2 gap-1.5">
          <label className="block space-y-1">
            <span className={labelClass}>Links title</span>
            <input type="text" value={content.linksTitle} onChange={(e) => onChange({ ...footer, linksTitle: e.target.value })} className={inputClass} />
          </label>
          <label className="block space-y-1">
            <span className={labelClass}>Contact title</span>
            <input type="text" value={content.contactTitle} onChange={(e) => onChange({ ...footer, contactTitle: e.target.value })} className={inputClass} />
          </label>
        </div>
      )}

      {fields.includes('socials') && (
        <div className="space-y-1.5">
          <p className={labelClass}>Contact icons</p>
          {socials.map((social) => {
            const { icon: Icon, placeholder } = SOCIAL_PLATFORMS[social.platform]
            return (
              <div key={social.id} className="space-y-1 rounded-md border border-border/50 bg-background/40 p-1.5">
                <div className="flex items-center gap-1">
                  <Icon className="size-3.5 shrink-0 text-muted-foreground" />
                  <select
                    value={social.platform}
                    onChange={(e) => setSocials(socials.map((s) => (s.id === social.id ? { ...s, platform: e.target.value as SocialPlatform } : s)))}
                    className="h-6 min-w-0 flex-1 rounded border border-border bg-background px-1 text-[10px] text-foreground"
                  >
                    {(Object.entries(SOCIAL_PLATFORMS) as [SocialPlatform, (typeof SOCIAL_PLATFORMS)[SocialPlatform]][]).map(([id, p]) => (
                      <option key={id} value={id}>{p.label}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setSocials(socials.filter((s) => s.id !== social.id))}
                    aria-label={`Delete ${SOCIAL_PLATFORMS[social.platform].label}`}
                    className="flex size-6 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>
                <input
                  type="text"
                  value={social.value}
                  placeholder={placeholder}
                  onChange={(e) => setSocials(socials.map((s) => (s.id === social.id ? { ...s, value: e.target.value } : s)))}
                  className={inputClass}
                />
              </div>
            )
          })}
          <button
            type="button"
            onClick={addSocial}
            className="flex w-full items-center justify-center gap-1 rounded-md border border-dashed border-border/60 py-1 text-[10px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <Plus className="size-3" />
            Add icon
          </button>
        </div>
      )}

      {bandHasLinks('footer', footer.variant) && (
        <p className="text-[9px] text-muted-foreground/60">Links are shared with the header. Edit them under Pages and SPA.</p>
      )}
    </div>
  )
}
