import { Upload, User } from 'lucide-react'
import { useBuilder } from '../../store/portfolio-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export function ProfileEditor() {
  const { activePortfolio, updateProfile } = useBuilder()
  if (!activePortfolio) return null
  const { profile } = activePortfolio

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-700">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="h-6 w-6 text-slate-400" />
            )}
          </div>
          <Button
            size="icon"
            className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full"
            variant="secondary"
          >
            <Upload className="h-3 w-3" />
          </Button>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Profile photo
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">First Name</Label>
          <Input
            value={profile.firstName}
            onChange={(e) => updateProfile({ firstName: e.target.value })}
            placeholder="John"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Last Name</Label>
          <Input
            value={profile.lastName}
            onChange={(e) => updateProfile({ lastName: e.target.value })}
            placeholder="Doe"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Professional Title</Label>
        <Input
          value={profile.title}
          onChange={(e) => updateProfile({ title: e.target.value })}
          placeholder="Full Stack Developer"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Tagline</Label>
        <Textarea
          value={profile.tagline}
          onChange={(e) => updateProfile({ tagline: e.target.value })}
          placeholder="I build scalable web applications and developer tools."
          rows={2}
        />
      </div>

      <Separator />

      <div className="space-y-1.5">
        <Label className="text-xs">Location</Label>
        <Input
          value={profile.location}
          onChange={(e) => updateProfile({ location: e.target.value })}
          placeholder="San Francisco, CA"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Email</Label>
        <Input
          type="email"
          value={profile.email}
          onChange={(e) => updateProfile({ email: e.target.value })}
          placeholder="john@example.com"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Phone</Label>
        <Input
          type="tel"
          value={profile.phone}
          onChange={(e) => updateProfile({ phone: e.target.value })}
          placeholder="+1 (555) 123-4567"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Website</Label>
        <Input
          type="url"
          value={profile.website}
          onChange={(e) => updateProfile({ website: e.target.value })}
          placeholder="https://johndoe.dev"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Resume URL</Label>
        <Input
          type="url"
          value={profile.resumeUrl}
          onChange={(e) => updateProfile({ resumeUrl: e.target.value })}
          placeholder="https://..."
        />
      </div>
    </div>
  )
}
