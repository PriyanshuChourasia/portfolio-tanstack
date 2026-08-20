import { Link2, Plus, Trash2 } from 'lucide-react'
import { useBuilder } from '../../store/portfolio-store'
import type { SocialPlatform } from '../../types/portfolio'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const PLATFORMS: Array<{ value: SocialPlatform; label: string }> = [
  { value: 'github', label: 'GitHub' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'Twitter / X' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'dribbble', label: 'Dribbble' },
  { value: 'behance', label: 'Behance' },
  { value: 'medium', label: 'Medium' },
  { value: 'website', label: 'Website' },
]

export function SocialLinksEditor() {
  const { activePortfolio, addSocialLink, updateSocialLink, deleteSocialLink } =
    useBuilder()

  if (!activePortfolio) return null
  const { socialLinks } = activePortfolio

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-xs">Social Links</Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={addSocialLink}
          className="h-7 text-xs gap-1"
        >
          <Plus className="h-3 w-3" /> Add
        </Button>
      </div>
      {socialLinks.length === 0 ? (
        <div className="text-center py-8 space-y-2">
          <Link2 className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto" />
          <p className="text-xs text-slate-400 dark:text-slate-500">
            No social links yet.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {socialLinks.map((link) => (
            <Card key={link.id} className="p-3">
              <div className="flex items-start gap-2">
                <div className="flex-1 space-y-2">
                  <Select
                    value={link.platform}
                    onValueChange={(v) =>
                      updateSocialLink(link.id, {
                        platform: v as SocialPlatform,
                      })
                    }
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PLATFORMS.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    value={link.url}
                    onChange={(e) =>
                      updateSocialLink(link.id, { url: e.target.value })
                    }
                    placeholder="https://..."
                    className="h-8 text-sm"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-red-500 shrink-0"
                  onClick={() => deleteSocialLink(link.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
