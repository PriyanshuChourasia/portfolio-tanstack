import { useState, type FormEvent } from 'react'
import { FolderOpen, Plus, X } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { useStorage } from '../../lib/context'
import type { UserConfig } from '../../lib/types'

interface SetupScreenProps {
  onComplete: (config: UserConfig) => void
}

export function SetupScreen({ onComplete }: SetupScreenProps) {
  const adapter = useStorage()
  const [locationLabel, setLocationLabel] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [github, setGithub] = useState('')
  const [socials, setSocials] = useState<Array<{ label: string; url: string }>>([])
  const [busy, setBusy] = useState(false)

  const chooseLocation = async () => {
    const label = await adapter.pickLocation()
    if (label) setLocationLabel(label)
  }

  const addSocial = () => {
    setSocials([...socials, { label: '', url: '' }])
  }

  const updateSocial = (
    index: number,
    field: 'label' | 'url',
    value: string,
  ) => {
    const next = [...socials]
    next[index] = { ...next[index], [field]: value }
    setSocials(next)
  }

  const removeSocial = (index: number) => {
    setSocials(socials.filter((_, i) => i !== index))
  }

  const canSubmit = locationLabel !== '' && name.trim().length > 0

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setBusy(true)
    try {
      const config: UserConfig = {
        name: name.trim(),
        email: email.trim() || undefined,
        github: github.trim() || undefined,
        socials: socials.filter((s) => s.label.trim() || s.url.trim()),
        createdAt: new Date().toISOString(),
      }
      await adapter.writeConfig(config)
      onComplete(config)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
      <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Welcome</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Set up your workspace to get started.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Storage Location</label>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={chooseLocation}
          >
            <FolderOpen className="h-4 w-4" />
            {locationLabel || adapter.getDefaultLocationLabel() || 'Choose Folder…'}
          </Button>
        </div>

        <div className="space-y-2">
          <label htmlFor="setup-name" className="text-sm font-medium">
            Name <span className="text-destructive">*</span>
          </label>
          <input
            id="setup-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            placeholder="Your name"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="setup-email" className="text-sm font-medium">
            Email <span className="text-muted-foreground">(optional)</span>
          </label>
          <input
            id="setup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="setup-github" className="text-sm font-medium">
            GitHub <span className="text-muted-foreground">(optional)</span>
          </label>
          <input
            id="setup-github"
            type="url"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            placeholder="https://github.com/username"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              Social Links <span className="text-muted-foreground">(optional)</span>
            </label>
            <Button type="button" variant="ghost" size="sm" onClick={addSocial}>
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
          </div>
          {socials.map((s, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                type="text"
                value={s.label}
                onChange={(e) => updateSocial(i, 'label', e.target.value)}
                className="w-1/3 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="Label"
              />
              <input
                type="url"
                value={s.url}
                onChange={(e) => updateSocial(i, 'url', e.target.value)}
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="https://…"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeSocial(i)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <Button type="submit" className="w-full" disabled={!canSubmit || busy}>
          {busy ? 'Setting up…' : 'Get Started'}
        </Button>
      </form>
    </div>
  )
}
