import { BookOpen } from 'lucide-react'
import { useEffect, useState } from 'react'

type BlogArtworkProps = {
  src?: string
  alt: string
  className?: string
  placeholderLabel?: string
  showPlaceholder?: boolean
  compact?: boolean
  seed?: string | number
}

function hashSeed(value: string | number): number {
  const str = String(value)
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

const GRADIENTS: Array<[string, string, string]> = [
  ['from-primary-accent/15', 'via-indigo-900/80', 'to-primary/95/85'],
  ['from-emerald-500/15', 'via-teal-900/80', 'to-primary/95/85'],
  ['from-violet-500/15', 'via-purple-900/80', 'to-slate-950/85'],
  ['from-rose-500/15', 'via-pink-900/80', 'to-stone-950/85'],
  ['from-amber-500/15', 'via-orange-900/80', 'to-slate-950/85'],
  ['from-sky-500/15', 'via-primary/90/80', 'to-indigo-950/85'],
  ['from-fuchsia-500/15', 'via-pink-900/80', 'to-violet-950/85'],
  ['from-lime-500/15', 'via-green-900/80', 'to-emerald-950/85'],
]

const ICON_COLORS: Array<[string, string, string]> = [
  ['border-primary-accent/15', 'bg-primary-accent/10', 'text-primary-accent/70'],
  ['border-emerald-400/15', 'bg-emerald-400/10', 'text-emerald-300/70'],
  ['border-violet-400/15', 'bg-violet-400/10', 'text-violet-300/70'],
  ['border-rose-400/15', 'bg-rose-400/10', 'text-rose-300/70'],
  ['border-amber-400/15', 'bg-amber-400/10', 'text-amber-300/70'],
  ['border-sky-400/15', 'bg-sky-400/10', 'text-sky-300/70'],
  ['border-fuchsia-400/15', 'bg-fuchsia-400/10', 'text-fuchsia-300/70'],
  ['border-lime-400/15', 'bg-lime-400/10', 'text-lime-300/70'],
]

function pickGradient(
  seedValue: string | number | undefined,
): [string, string, string] {
  const idx = seedValue != null ? hashSeed(seedValue) % GRADIENTS.length : 0
  return GRADIENTS[idx] ?? GRADIENTS[0]
}

function pickIconColor(
  seedValue: string | number | undefined,
): [string, string, string] {
  const idx = seedValue != null ? hashSeed(seedValue) % ICON_COLORS.length : 0
  return ICON_COLORS[idx] ?? ICON_COLORS[0]
}

export function BlogArtwork({
  src,
  alt,
  className = '',
  placeholderLabel = 'Blog post',
  showPlaceholder = true,
  compact = false,
  seed,
}: BlogArtworkProps) {
  const [hasImageError, setHasImageError] = useState(false)

  useEffect(() => {
    setHasImageError(false)
  }, [src])

  const shouldShowImage = Boolean(src?.trim()) && !hasImageError

  if (!shouldShowImage) {
    if (!showPlaceholder) {
      return null
    }

    const [g1, g2, g3] = pickGradient(seed)
    const [ic1, ic2, ic3] = pickIconColor(seed)

    if (compact) {
      return (
        <div
          className={`flex h-full w-full items-center justify-center bg-linear-to-br ${g1} ${g2} ${g3} ${className}`}
        >
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl border ${ic1} ${ic2} ${ic3}`}
          >
            <BookOpen className="h-5 w-5" aria-hidden="true" />
          </div>
        </div>
      )
    }

    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center gap-4 bg-linear-to-br ${g1} ${g2} ${g3} text-center ${className}`}
      >
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl border ${ic1} ${ic2} shadow-lg shadow-black/20`}
        >
          <BookOpen className="h-8 w-8" aria-hidden="true" />
        </div>
        <div className="space-y-1 px-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
            {placeholderLabel}
          </p>
          <p className="text-sm leading-6 text-white/50">
            No cover image provided.
          </p>
        </div>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasImageError(true)}
      className={`h-full w-full object-cover ${className}`}
    />
  )
}
