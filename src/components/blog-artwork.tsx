import { BookOpen } from 'lucide-react'
import { useEffect, useState } from 'react'

type BlogArtworkProps = {
  src?: string
  alt: string
  className?: string
  placeholderLabel?: string
}

export function BlogArtwork({
  src,
  alt,
  className = '',
  placeholderLabel = 'Blog post',
}: BlogArtworkProps) {
  const [hasImageError, setHasImageError] = useState(false)

  useEffect(() => {
    setHasImageError(false)
  }, [src])

  const shouldShowImage = Boolean(src?.trim()) && !hasImageError

  if (!shouldShowImage) {
    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center gap-4 bg-linear-to-br from-cyan-500/10 via-slate-900/85 to-blue-950/80 text-center ${className}`}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-200 shadow-lg shadow-cyan-950/20">
          <BookOpen className="h-8 w-8" aria-hidden="true" />
        </div>
        <div className="space-y-1 px-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
            {placeholderLabel}
          </p>
          <p className="text-sm leading-6 text-slate-300">
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
