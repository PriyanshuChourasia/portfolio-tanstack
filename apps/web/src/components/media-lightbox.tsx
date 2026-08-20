' '
import { Music, PlayCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MediaLightboxProps {
  isOpen: boolean
  onClose: () => void
  item: {
    title: string
    category: string
    image: string
    icon: any
  } | null
}

export function MediaLightbox({ isOpen, onClose, item }: MediaLightboxProps) {
  if (!item) return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 transition-all duration-300',
        isOpen
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none',
      )}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-8 right-8 text-white hover:text-primary transition-colors p-2 z-[110]"
      >
        <X className="w-8 h-8" />
      </button>

      <div
        className="relative max-w-5xl w-full aspect-video bg-black flex items-center justify-center animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {item.category === 'Video' ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-900 group">
            <PlayCircle className="w-24 h-24 text-white opacity-50 group-hover:opacity-100 transition-opacity cursor-pointer" />
          </div>
        ) : item.category === 'Music' ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 text-white gap-6">
            <Music className="w-24 h-24 text-primary" />
            <h3 className="text-xl font-bold uppercase tracking-widest">
              {item.title}
            </h3>
          </div>
        ) : (
          <img
            src={item.image || '/placeholder.svg'}
            alt={item.title}
            className="w-full h-full object-contain"
          />
        )}

        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent text-white">
          <h2 className="text-2xl font-bold uppercase tracking-widest mb-1">
            {item.title}
          </h2>
          <p className="text-sm uppercase tracking-[0.3em] text-primary font-bold">
            {item.category}
          </p>
        </div>
      </div>
    </div>
  )
}
