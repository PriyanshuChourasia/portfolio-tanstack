import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Aperture, Grid3X3, Layers, Maximize2, Palette, Sparkles, X, SlidersHorizontal, ImageIcon, FolderOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import photosData from '@/data/photos-data.json'
import { Canvas } from './Canvas'
import { PhotofolioHeader } from './PhotofolioHeader'

type Photo = (typeof photosData.photos)[number]

export function PhotofolioPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [viewMode, setViewMode] = useState<'gallery' | 'canvas'>('gallery')

  const filteredPhotos = useMemo(() => {
    if (activeCategory === 'All') return photosData.photos
    return photosData.photos.filter((p) => p.category === activeCategory)
  }, [activeCategory])

  return (
    <div className="min-h-screen flex flex-col">
      <PhotofolioHeader viewMode={viewMode} onViewModeChange={setViewMode} />

      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Info Section */}
          {viewMode === 'gallery' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Camera className="w-6 h-6 text-primary" />
                <span className="text-sm font-semibold uppercase tracking-widest text-primary">Photofolio</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Your Personal <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Photofolio</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-10">
                A beautiful, customizable photo gallery to showcase your best work. Organize your photos into multiple grids, filter by category, and create a stunning visual portfolio.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {[
                  { icon: Grid3X3, title: 'Multiple Grids', description: 'Arrange your photos in customizable grid layouts' },
                  { icon: Layers, title: 'Category Filters', description: 'Organize and filter by genres, themes, or projects' },
                  { icon: Palette, title: 'Lightbox Viewer', description: 'Full-screen viewing with EXIF metadata details' },
                  { icon: Sparkles, title: 'Smooth Animations', description: 'Elegant transitions powered by Framer Motion' },
                ].map((feature, i) => (
                  <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }} className="p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
                    <feature.icon className="w-8 h-8 text-primary mb-3 mx-auto" />
                    <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Canvas mode */}
          {viewMode === 'canvas' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-[70vh] min-h-[500px]">
              <Canvas />
            </motion.div>
          )}

          {/* Gallery mode */}
          {viewMode === 'gallery' && (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left side — Photo Grid */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-foreground">Photos</h2>
                  <span className="text-sm text-muted-foreground">{filteredPhotos.length} photos</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-[180px]">
                  <AnimatePresence mode="popLayout">
                    {filteredPhotos.map((photo, index) => (
                      <PhotoCard key={photo.id} photo={photo} index={index} onClick={() => setSelectedPhoto(photo)} puzzleIndex={index} />
                    ))}
                  </AnimatePresence>
                </div>
                {filteredPhotos.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                    <ImageIcon className="w-12 h-12 mb-3 opacity-40" />
                    <p className="text-sm">No photos in this category</p>
                  </div>
                )}
              </div>

              {/* Right side — Sidebar Panel */}
              <motion.aside initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="w-full lg:w-72 shrink-0 space-y-5">
                {/* Categories */}
                <div className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <FolderOpen className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-bold text-foreground">Categories</h3>
                  </div>
                  <div className="space-y-1">
                    {photosData.categories.map((category) => {
                      const count = category === 'All' ? photosData.photos.length : photosData.photos.filter(p => p.category === category).length
                      return (
                        <button key={category} onClick={() => setActiveCategory(category)} className={cn('w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200', activeCategory === category ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent')}>
                          <span>{category}</span>
                          <span className={cn('text-xs px-2 py-0.5 rounded-full', activeCategory === category ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground')}>{count}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Filters hint */}
                <div className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <SlidersHorizontal className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-bold text-foreground">Display</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Switch to <span className="font-semibold text-foreground">Canvas mode</span> to freely arrange and position photos on an interactive canvas.
                  </p>
                </div>

                {/* Stats */}
                <div className="rounded-xl border border-border bg-card p-5">
                  <h3 className="text-sm font-bold text-foreground mb-3">Quick Stats</h3>
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Total Photos</span>
                      <span className="font-semibold text-foreground">{photosData.photos.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Categories</span>
                      <span className="font-semibold text-foreground">{photosData.categories.length - 1}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Showing</span>
                      <span className="font-semibold text-primary">{filteredPhotos.length}</span>
                    </div>
                  </div>
                </div>
              </motion.aside>
            </div>
          )}

          {/* Lightbox */}
          <AnimatePresence>
            {selectedPhoto && <PhotoLightbox photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

/* Puzzle layout: repeating pattern of sizes that tiles across the grid */
const PUZZLE_CLASSES = [
  'col-span-2 row-span-2',  // large square
  'col-span-1 row-span-1',  // small
  'col-span-1 row-span-2',  // tall
  'col-span-1 row-span-1',  // small
  'col-span-2 row-span-1',  // wide
  'col-span-1 row-span-1',  // small
  'col-span-1 row-span-1',  // small
  'col-span-1 row-span-2',  // tall
  'col-span-2 row-span-1',  // wide
  'col-span-1 row-span-1',  // small
  'col-span-1 row-span-1',  // small
  'col-span-2 row-span-2',  // large square
  'col-span-1 row-span-1',  // small
  'col-span-1 row-span-2',  // tall
  'col-span-1 row-span-1',  // small
  'col-span-2 row-span-1',  // wide
]

function PhotoCard({ photo, index, onClick, puzzleIndex }: { photo: Photo; index: number; onClick: () => void; puzzleIndex: number }) {
  const puzzleClass = PUZZLE_CLASSES[puzzleIndex % PUZZLE_CLASSES.length]
  const isLarge = puzzleClass.includes('col-span-2') && puzzleClass.includes('row-span-2')

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      onClick={onClick}
      className={cn(
        'group relative rounded-xl overflow-hidden cursor-pointer border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl',
        puzzleClass,
      )}
    >
      <img src={photo.image} alt={photo.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Title + category on hover */}
      <div className={cn(
        'absolute left-0 right-0 p-4 transition-all duration-300',
        isLarge ? 'bottom-0 translate-y-full group-hover:translate-y-0' : 'bottom-0 bg-gradient-to-t from-black/70 to-transparent opacity-100 group-hover:opacity-0'
      )}>
        <h3 className={cn('text-white font-semibold', isLarge ? 'text-xl' : 'text-sm')}>{photo.title}</h3>
        {isLarge && <p className="text-white/70 text-sm mt-1">{photo.description}</p>}
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[10px] text-primary font-medium px-2 py-0.5 bg-primary/20 rounded-full">{photo.category}</span>
        </div>
      </div>

      {/* Expand icon on hover */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="p-1.5 bg-black/50 rounded-full backdrop-blur-sm">
          <Maximize2 className="w-3.5 h-3.5 text-white" />
        </div>
      </div>

      {/* Corner accent on large tiles */}
      {isLarge && (
        <div className="absolute top-0 left-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute top-3 left-3 w-10 h-[2px] bg-primary/60" />
          <div className="absolute top-3 left-3 w-[2px] h-10 bg-primary/60" />
        </div>
      )}
    </motion.div>
  )
}

function PhotoLightbox({ photo, onClose }: { photo: Photo; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4" onClick={onClose}>
      <button onClick={onClose} className="absolute top-6 right-6 text-white hover:text-primary transition-colors p-2 z-[110]">
        <X className="w-8 h-8" />
      </button>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ duration: 0.3 }} className="relative max-w-6xl w-full flex flex-col lg:flex-row gap-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex-1 relative rounded-xl overflow-hidden">
          <img src={photo.image} alt={photo.title} className="w-full h-auto max-h-[70vh] object-contain" />
        </div>
        <div className="lg:w-80 bg-card rounded-xl p-6 border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-2">{photo.title}</h2>
          <p className="text-muted-foreground mb-6">{photo.description}</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Camera className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">Camera:</span>
              <span className="text-foreground font-medium">{photo.camera}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Aperture className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">Lens:</span>
              <span className="text-foreground font-medium">{photo.lens}</span>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
              <div className="text-center">
                <div className="text-lg font-bold text-primary">{photo.iso}</div>
                <div className="text-xs text-muted-foreground">ISO</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-primary">{photo.aperture}</div>
                <div className="text-xs text-muted-foreground">Aperture</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-primary">{photo.shutter}</div>
                <div className="text-xs text-muted-foreground">Shutter</div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <span className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">{photo.category}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
