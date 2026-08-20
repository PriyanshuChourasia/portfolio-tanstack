import { memo, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import photosData from '@/data/photos-data.json'

interface PhotoPickerProps {
  isOpen: boolean
  onToggle: () => void
  onAddPhoto: (photoId: number) => void
  addedPhotoIds: Set<number>
}

export const PhotoPicker = memo(function PhotoPicker({ isOpen, onToggle, onAddPhoto, addedPhotoIds }: PhotoPickerProps) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredPhotos = useMemo(() => {
    return photosData.photos.filter((p) => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory
      const matchesSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [search, activeCategory])

  return (
    <>
      <button
        onClick={onToggle}
        className={cn(
          'absolute top-4 z-30 flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-medium transition-all duration-300 border backdrop-blur-md',
          isOpen ? 'right-[304px] bg-card/90 border-border text-foreground' : 'right-4 bg-card/90 border-border text-muted-foreground hover:text-foreground',
        )}
      >
        <Camera className="w-3.5 h-3.5" />
        {isOpen ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute top-0 right-0 bottom-0 z-20 w-[300px] bg-card/95 backdrop-blur-xl border-l border-border flex flex-col"
          >
            <div className="p-4 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground mb-3">Add Photos</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search photos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>
              <div className="flex flex-wrap gap-1 mt-3">
                {photosData.categories.map((cat) => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} className={cn('px-2 py-0.5 text-[10px] rounded-full transition-colors', activeCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground')}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredPhotos.map((photo) => {
                const isAdded = addedPhotoIds.has(photo.id)
                return (
                  <div key={photo.id} className={cn('group flex items-center gap-3 p-2 rounded-lg border transition-all duration-200', isAdded ? 'border-primary/30 bg-primary/5' : 'border-border hover:border-primary/30 hover:bg-muted/30')}>
                    <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
                      <img src={photo.image} alt={photo.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{photo.title}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{photo.category}</p>
                    </div>
                    <button
                      onClick={() => onAddPhoto(photo.id)}
                      disabled={isAdded}
                      className={cn('p-1.5 rounded-lg transition-all shrink-0', isAdded ? 'bg-primary/20 text-primary cursor-default' : 'bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground')}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )
              })}
              {filteredPhotos.length === 0 && <p className="text-center text-xs text-muted-foreground py-8">No photos found</p>}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
})
