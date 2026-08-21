import { memo, useRef, useState, useCallback } from 'react'
import type { PhotofolioSettings, ScreenType, SelectedProject, LayoutType } from './DashboardLayout'
import {
  Image as ImageIcon,
  Upload,
  Grid2x2,
  Grid3x3,
  LayoutGrid,
  Columns2,
  Rows2,
  Move,
  Palette,
  Maximize2,
  SplitSquareHorizontal,
  GalleryHorizontalEnd,
  Grid3x3 as Wall,
  Film,
  Focus,
  ImagePlay,
  AlignCenter,
  Eye,
  PanelLeftClose,
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  Type,
  SlidersHorizontal,
  Sun,
  Aperture,
  Music,
  Globe,
  Share2,
  BarChart3,
  Shield,
  Smartphone,
  Plus,
  X,
  Trash2,
  GripVertical,
  FileText,
  Link2,
  Layers,
  Sparkles,
  Zap,
  MousePointerClick,
  BookOpen,
  HelpCircle,
  RotateCcw,
  Camera,
  CloudUpload,
  CreditCard,
  Frame,
  Paintbrush,
  Crop,
  Wand2,
  FlipHorizontal2,
  MessageSquare,
  Star,
  Gift,
  TrendingUp,
  Blocks,
  Download,
  Monitor,
  Tablet,
  FolderOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ToolPanelProps {
  activeTool: string
  settings: PhotofolioSettings
  onUpdateSettings: (partial: Partial<PhotofolioSettings>) => void
  selectedProject: SelectedProject | null
  onSelectProject: (project: SelectedProject | null) => void
  onToolChange: (tool: string) => void
}

export const ToolPanel = memo(function ToolPanel({ activeTool, settings, onUpdateSettings, selectedProject, onSelectProject, onToolChange }: ToolPanelProps) {
  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      {renderToolContent(activeTool, settings, onUpdateSettings, selectedProject, onSelectProject, onToolChange)}
    </div>
  )
})

function renderToolContent(toolId: string, settings: PhotofolioSettings, onUpdateSettings: (partial: Partial<PhotofolioSettings>) => void, selectedProject: SelectedProject | null, onSelectProject: (project: SelectedProject | null) => void, onToolChange: (tool: string) => void) {
  switch (toolId) {
    // ── Projects ──
    case 'projects':
      return <ProjectsPanel selectedProject={selectedProject} onSelectProject={onSelectProject} />
    // ── Content ──
    case 'photos':
      return <PhotosPanel />
    case 'videos':
      return <VideosPanel />
    case 'text':
      return <TextPanel />
    case 'audio':
      return <AudioPanel />
    case 'files':
      return <FilesPanel />

    // ── Design ──
    case 'layouts':
      return <LayoutsPanel settings={settings} onUpdateSettings={onUpdateSettings} onToolChange={onToolChange} />
    case 'design':
      return <DesignPanel settings={settings} onUpdateSettings={onUpdateSettings} />
    case 'templates':
      return <TemplatesPanel settings={settings} onUpdateSettings={onUpdateSettings} />
    case 'themes':
      return <ThemesPanel />
    case 'fonts':
      return <FontsPanel />
    case 'filters':
      return <FiltersPanel />
    case 'frames':
      return <FramesPanel />

    // ── Edit ──
    case 'crop':
      return <CropPanel />
    case 'transform':
      return <TransformPanel />
    case 'rotate':
      return <RotatePanel />
    case 'adjust':
      return <AdjustPanel />
    case 'retouch':
      return <RetouchPanel />

    // ── Pages ──
    case 'pages':
      return <PagesPanel />
    case 'sections':
      return <SectionsPanel />
    case 'transitions':
      return <TransitionsPanel />

    // ── Customize ──
    case 'animations':
      return <AnimationsPanel />
    case 'slideshow':
      return <SlideshowPanel />
    case 'grid':
      return <GridOptionsPanel />
    case 'spacing':
      return <SpacingPanel />
    case 'backgrounds':
      return <BackgroundsPanel />

    // ── SEO ──
    case 'seo':
      return <SeoPanel />
    case 'meta':
      return <MetaPanel />
    case 'og-image':
      return <OgImagePanel />
    case 'sitemap':
      return <SitemapPanel />

    // ── Publish ──
    case 'domain':
      return <DomainPanel />
    case 'share':
      return <SharePanel />
    case 'analytics':
      return <AnalyticsPanel />
    case 'password':
      return <PasswordPanel />
    case 'mobile':
      return <MobilePanel />

    // ── Manage ──
    case 'comments':
      return <CommentsPanel />
    case 'feedback':
      return <FeedbackPanel />
    case 'versions':
      return <VersionsPanel />
    case 'backup':
      return <BackupPanel />
    case 'integrations':
      return <IntegrationsPanel />

    // ── Help ──
    case 'docs':
      return <DocsPanel />
    case 'tips':
      return <TipsPanel />
    case 'support':
      return <SupportPanel />

    default:
      return <DefaultPanel />
  }
}

/* ═══════════════════════════════════════════════════════════════
   SHARED UI HELPERS
   ═══════════════════════════════════════════════════════════════ */

function PanelHeader({ icon: Icon, title, subtitle }: { icon: typeof ImageIcon; title: string; subtitle?: string }) {
  return (
    <div className="p-4 border-b border-border/40">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
      </div>
      {subtitle && <p className="text-[11px] text-muted-foreground">{subtitle}</p>}
    </div>
  )
}

function PanelSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-4 border-b border-border/30">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 mb-3">{title}</p>
      {children}
    </div>
  )
}

function SliderRow({ label, value, onChange }: { label: string; value: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex items-center gap-3 mb-2">
      <span className="text-xs text-muted-foreground w-24 shrink-0">{label}</span>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange?.(Number(e.target.value))}
        className="flex-1 h-1 accent-primary"
      />
      <span className="text-[10px] text-muted-foreground w-8 text-right font-mono">{value}</span>
    </div>
  )
}

function ToggleRow({ label, enabled, onChange }: { label: string; enabled: boolean; onChange?: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <button
        onClick={() => onChange?.(!enabled)}
        className={cn(
          'relative h-5 w-9 rounded-full transition-colors',
          enabled ? 'bg-primary' : 'bg-muted',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform',
            enabled ? 'left-[18px]' : 'left-0.5',
          )}
        />
      </button>
    </div>
  )
}

function ColorSwatch({ color, active, onClick }: { color: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'h-7 w-7 rounded-lg border-2 transition-all',
        active ? 'border-primary scale-110' : 'border-transparent hover:scale-105',
      )}
      style={{ backgroundColor: color }}
    />
  )
}

function ToolButton({ icon: Icon, label, onClick }: { icon: typeof ImageIcon; label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-xs text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors w-full"
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PROJECTS PANEL
   ═══════════════════════════════════════════════════════════════ */

interface ProjectItem {
  id: string
  name: string
  description: string
  coverImage: string
  createdAt: string
}

function ProjectsPanel({ selectedProject, onSelectProject }: { selectedProject: SelectedProject | null; onSelectProject: (project: SelectedProject | null) => void }) {
  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    try {
      const stored = localStorage.getItem('photofolio-projects')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })
  const [modalOpen, setModalOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDescription, setNewDescription] = useState('')

  const saveProjects = (updated: ProjectItem[]) => {
    setProjects(updated)
    localStorage.setItem('photofolio-projects', JSON.stringify(updated))
  }

  const handleCreate = () => {
    if (!newName.trim()) return
    const newProject: ProjectItem = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      description: newDescription.trim(),
      coverImage: '',
      createdAt: new Date().toISOString(),
    }
    saveProjects([newProject, ...projects])
    setNewName('')
    setNewDescription('')
    setModalOpen(false)
  }

  const handleDelete = (id: string) => {
    saveProjects(projects.filter((p) => p.id !== id))
  }

  const handleSelect = (p: ProjectItem) => {
    onSelectProject({ id: p.id, name: p.name, description: p.description })
  }

  const handleDeselect = () => {
    onSelectProject(null)
  }

  return (
    <div>
      <PanelHeader icon={FolderOpen} title="Projects" subtitle={selectedProject ? `Editing: ${selectedProject.name}` : `${projects.length} project${projects.length !== 1 ? 's' : ''}`} />

      {/* Active project banner */}
      {selectedProject && (
        <div className="mx-4 mt-3 flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-semibold text-primary flex-1 truncate">{selectedProject.name}</span>
          <button onClick={handleDeselect} className="text-[9px] text-muted-foreground hover:text-foreground transition-colors">Deselect</button>
        </div>
      )}

      {/* Add button */}
      <PanelSection title="Actions">
        <button
          onClick={() => setModalOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-primary/30 bg-primary/5 py-3 text-xs font-semibold text-primary hover:bg-primary/10 transition-all"
        >
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </PanelSection>

      {/* Project list */}
      <PanelSection title="Your Projects">
        {projects.length === 0 ? (
          <div className="text-center py-8">
            <FolderOpen className="h-8 w-8 text-muted-foreground/20 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground/50">No projects yet</p>
            <p className="text-[10px] text-muted-foreground/30">Click "New Project" to create one</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {projects.map((p) => (
              <div
                key={p.id}
                onClick={() => handleSelect(p)}
                className={cn(
                  'group flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-all cursor-pointer',
                  selectedProject?.id === p.id
                    ? 'border-primary/40 bg-primary/8 ring-1 ring-primary/20'
                    : 'border-border/40 hover:border-primary/20 hover:bg-primary/5',
                )}
              >
                <div className="h-9 w-12 shrink-0 rounded-lg bg-muted/40 flex items-center justify-center overflow-hidden">
                  {p.coverImage ? (
                    <img src={p.coverImage} alt={p.name} className="h-full w-full object-cover" />
                  ) : (
                    <ImageIcon className="h-4 w-4 text-muted-foreground/30" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{p.name}</p>
                  {p.description && (
                    <p className="text-[9px] text-muted-foreground/40 truncate">{p.description}</p>
                  )}
                  <p className="text-[9px] text-muted-foreground/50">
                    {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(p.id)
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                >
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground/40 hover:text-destructive" />
                </button>
              </div>
            ))}
          </div>
        )}
      </PanelSection>

      {/* ── New Project Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />
          {/* Dialog */}
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-border/60 bg-card shadow-2xl shadow-black/20 p-6">
            {/* Close */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 mb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Plus className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">New Project</h3>
                <p className="text-[10px] text-muted-foreground">Create a new photofolio project</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1.5 block">
                  Project Name
                </label>
                <input
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                  placeholder="My Photography Portfolio"
                  className="w-full rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/40"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1.5 block">
                  Description <span className="normal-case font-normal opacity-50">(optional)</span>
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="A collection of my best work..."
                  rows={3}
                  className="w-full rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/40 resize-none"
                />
              </div>

              {/* Cover image hint */}
              <div className="rounded-lg border border-dashed border-border/40 bg-muted/10 p-3 text-center">
                <p className="text-[10px] text-muted-foreground/50">Cover image can be added after creation</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 rounded-lg border border-border/60 py-2 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newName.trim()}
                className={cn(
                  'flex-1 rounded-lg py-2 text-xs font-semibold transition-all',
                  newName.trim()
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20'
                    : 'bg-muted text-muted-foreground cursor-not-allowed',
                )}
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   CONTENT PANELS
   ═══════════════════════════════════════════════════════════════ */

interface UploadedPhoto {
  id: string
  name: string
  url: string
  size: string
  addedAt: Date
}

const uploadedPhotosGlobal: UploadedPhoto[] = []
let photosListeners: Array<() => void> = []

function notifyPhotosListeners() {
  photosListeners.forEach((l) => l())
}

function useUploadedPhotos(): [UploadedPhoto[], (files: FileList) => void, (id: string) => void] {
  const [, forceUpdate] = useState(0)

  useState(() => {
    const listener = () => forceUpdate((n) => n + 1)
    photosListeners.push(listener)
    return () => {
      photosListeners = photosListeners.filter((l) => l !== listener)
    }
  })

  const addPhotos = useCallback((fileList: FileList) => {
    for (const file of Array.from(fileList)) {
      if (!file.type.startsWith('image/')) continue
      uploadedPhotosGlobal.push({
        id: crypto.randomUUID(),
        name: file.name,
        url: URL.createObjectURL(file),
        size: formatFileSize(file.size),
        addedAt: new Date(),
      })
    }
    notifyPhotosListeners()
  }, [])

  const removePhoto = useCallback((id: string) => {
    const idx = uploadedPhotosGlobal.findIndex((p) => p.id === id)
    if (idx !== -1) {
      URL.revokeObjectURL(uploadedPhotosGlobal[idx].url)
      uploadedPhotosGlobal.splice(idx, 1)
    }
    notifyPhotosListeners()
  }, [])

  return [uploadedPhotosGlobal, addPhotos, removePhoto]
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function PhotosPanel() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [photos, addPhotos, removePhoto] = useUploadedPhotos()

  const handleFiles = useCallback((fileList: FileList) => {
    addPhotos(fileList)
  }, [addPhotos])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  return (
    <div>
      <PanelHeader icon={ImageIcon} title="Photos" subtitle={`${photos.length} photo${photos.length !== 1 ? 's' : ''} uploaded`} />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files)
          e.target.value = ''
        }}
      />

      <PanelSection title="Upload">
        <div
          className={cn(
            'flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-8 text-xs transition-all cursor-pointer',
            isDragOver
              ? 'border-primary/60 bg-primary/10 text-primary'
              : 'border-border/60 bg-muted/20 text-muted-foreground hover:border-primary/30 hover:bg-primary/5',
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className={cn('h-6 w-6', isDragOver ? 'text-primary' : '')} />
          <p className="font-medium">
            {isDragOver ? 'Drop here' : 'Drop files or click to upload'}
          </p>
          <p className="text-[10px] text-muted-foreground/50">JPG, PNG, WebP, GIF — any size</p>
        </div>
      </PanelSection>

      <PanelSection title="Gallery">
        {photos.length === 0 ? (
          <div className="grid grid-cols-3 gap-1.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-lg bg-muted/40 border border-border/40 flex items-center justify-center">
                <ImageIcon className="h-4 w-4 text-muted-foreground/30" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1.5">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="group relative aspect-square rounded-lg border border-border/40 overflow-hidden"
              >
                <img
                  src={photo.url}
                  alt={photo.name}
                  className="h-full w-full object-cover"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removePhoto(photo.id)
                  }}
                  className="absolute top-0.5 right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </PanelSection>

      <PanelSection title="Sort">
        <div className="space-y-1">
          {['Date added', 'Name', 'Size', 'Custom'].map((opt) => (
            <button key={opt} className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors">
              <GripVertical className="h-3 w-3" />
              {opt}
            </button>
          ))}
        </div>
      </PanelSection>
    </div>
  )
}

function VideosPanel() {
  return (
    <div>
      <PanelHeader icon={Camera} title="Videos" subtitle="Add video content to your portfolio" />
      <PanelSection title="Upload Video">
        <ToolButton icon={Upload} label="Upload video file" />
        <ToolButton icon={Link2} label="Embed from URL" />
      </PanelSection>
      <PanelSection title="Settings">
        <ToggleRow label="Autoplay" enabled={false} />
        <ToggleRow label="Loop" enabled={false} />
        <ToggleRow label="Mute by default" enabled={true} />
        <SliderRow label="Volume" value={75} />
      </PanelSection>
    </div>
  )
}

function TextPanel() {
  return (
    <div>
      <PanelHeader icon={Type} title="Text & Captions" subtitle="Add text overlays to your photos" />
      <PanelSection title="Add Text">
        <div className="space-y-1.5">
          <ToolButton icon={Type} label="Heading" />
          <ToolButton icon={Type} label="Subheading" />
          <ToolButton icon={FileText} label="Paragraph" />
          <ToolButton icon={Type} label="Caption" />
        </div>
      </PanelSection>
      <PanelSection title="Style">
        <div className="space-y-2">
          <select className="w-full rounded-lg border border-border/60 bg-muted/20 px-3 py-1.5 text-xs text-foreground">
            <option>Inter</option>
            <option>Playfair Display</option>
            <option>Space Grotesk</option>
            <option>DM Sans</option>
          </select>
          <div className="flex gap-1.5">
            <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/60 text-xs font-bold hover:bg-muted">B</button>
            <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/60 text-xs italic hover:bg-muted">I</button>
            <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/60 text-xs underline hover:bg-muted">U</button>
          </div>
          <SliderRow label="Size" value={48} />
          <SliderRow label="Line height" value={60} />
          <SliderRow label="Letter spacing" value={0} />
        </div>
      </PanelSection>
      <PanelSection title="Alignment">
        <div className="flex gap-1">
          {['Left', 'Center', 'Right', 'Justify'].map((a) => (
            <button key={a} className="flex-1 rounded-lg border border-border/60 py-1.5 text-[10px] text-muted-foreground hover:bg-muted transition-colors">{a}</button>
          ))}
        </div>
      </PanelSection>
    </div>
  )
}

function AudioPanel() {
  return (
    <div>
      <PanelHeader icon={Music} title="Music & Audio" subtitle="Add background music or audio" />
      <PanelSection title="Upload">
        <ToolButton icon={Upload} label="Upload audio file" />
      </PanelSection>
      <PanelSection title="Track List">
        <div className="text-center py-6 text-xs text-muted-foreground/50">No tracks added yet</div>
      </PanelSection>
      <PanelSection title="Playback">
        <ToggleRow label="Autoplay" enabled={false} />
        <ToggleRow label="Loop" enabled={true} />
        <SliderRow label="Volume" value={50} />
        <SliderRow label="Fade in (ms)" value={500} />
        <SliderRow label="Fade out (ms)" value={500} />
      </PanelSection>
    </div>
  )
}

function FilesPanel() {
  return (
    <div>
      <PanelHeader icon={CloudUpload} title="File Manager" subtitle="Manage all uploaded files" />
      <PanelSection title="Upload">
        <ToolButton icon={Upload} label="Upload files" />
      </PanelSection>
      <PanelSection title="Files">
        <div className="space-y-1">
          {['image-001.jpg', 'photo-set.zip', 'cover.png'].map((f) => (
            <div key={f} className="flex items-center justify-between rounded-lg border border-border/40 px-3 py-2">
              <span className="text-xs text-foreground truncate">{f}</span>
              <Trash2 className="h-3 w-3 text-muted-foreground/40 hover:text-destructive cursor-pointer" />
            </div>
          ))}
        </div>
      </PanelSection>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   DESIGN PANELS
   ═══════════════════════════════════════════════════════════════ */

function LayoutsPanel({ settings, onUpdateSettings, onToolChange }: { settings: PhotofolioSettings; onUpdateSettings: (p: Partial<PhotofolioSettings>) => void; onToolChange: (tool: string) => void }) {
  const screens: { id: ScreenType; label: string; icon: typeof Monitor; desc: string }[] = [
    { id: 'desktop', label: 'Desktop', icon: Monitor, desc: 'Full-width' },
    { id: 'tablet', label: 'Tablet', icon: Tablet, desc: '768px' },
    { id: 'mobile', label: 'Mobile', icon: Smartphone, desc: '375px' },
  ]

  // ── Header styles ──
  const headerStyles = [
    { id: 'minimal', label: 'Minimal', icon: LayoutGrid, desc: 'Logo + Nav links' },
    { id: 'centered', label: 'Centered', icon: AlignCenter, desc: 'Logo centered, nav below' },
    { id: 'full', label: 'Full Width', icon: Maximize2, desc: 'Logo + Nav + CTA button' },
    { id: 'transparent', label: 'Transparent', icon: Eye, desc: 'Overlay on hero image' },
    { id: 'sidebar', label: 'Sidebar', icon: PanelLeftClose, desc: 'Fixed left navigation' },
  ]

  // ── Footer styles ──
  const footerStyles = [
    { id: 'minimal', label: 'Minimal', icon: LayoutGrid, desc: 'Copyright only' },
    { id: 'multi', label: 'Multi-Column', icon: Columns2, desc: 'Links in columns' },
    { id: 'centered', label: 'Centered', icon: AlignCenter, desc: 'Social + Copyright' },
    { id: 'full', label: 'Full Width', icon: Maximize2, desc: 'Newsletter + Links' },
    { id: 'wave', label: 'Wave Shape', icon: Move, desc: 'Curved top edge' },
  ]

  // ── Section layouts ──
  const sectionLayouts = [
    { id: 'grid' as const, label: 'Grid', icon: Grid2x2, preview: 'grid' },
    { id: 'masonry' as const, label: 'Masonry', icon: LayoutGrid, preview: 'masonry' },
    { id: '2col' as const, label: '2 Column', icon: Columns2, preview: '2col' },
    { id: '3col' as const, label: '3 Column', icon: Grid3x3, preview: '3col' },
    { id: 'single' as const, label: 'Single Row', icon: Rows2, preview: 'row' },
    { id: 'freeform' as const, label: 'Freeform', icon: Move, preview: 'free' },
  ]

  // ── Creative sections ──
  const creativeSections = [
    { id: 'hero' as const, label: 'Hero Section', icon: Maximize2, desc: 'Large featured image' },
    { id: 'fullscreen' as const, label: 'Fullscreen Image', icon: ImagePlay, desc: 'Edge-to-edge photo' },
    { id: 'split' as const, label: 'Split Layout', icon: SplitSquareHorizontal, desc: 'Text + Image' },
    { id: 'carousel' as const, label: 'Carousel', icon: GalleryHorizontalEnd, desc: 'Swipeable gallery' },
    { id: 'wall' as const, label: 'Photo Wall', icon: Wall, desc: 'Tight collage' },
    { id: 'filmstrip' as const, label: 'Film Strip', icon: Film, desc: 'Horizontal scroll' },
    { id: 'spotlight' as const, label: 'Spotlight', icon: Focus, desc: 'Single image focus' },
  ]

  const handleLayoutSelect = (layoutId: string, hasHeader: boolean, hasFooter: boolean) => {
    onUpdateSettings({ layout: layoutId as LayoutType, hasHeader, hasFooter })
    onToolChange('design')
  }

  return (
    <div>
      <PanelHeader icon={LayoutGrid} title="Layouts" subtitle="Build your page structure" />

      {/* ── Screen Type ── */}
      <PanelSection title="Screen">
        <div className="grid grid-cols-3 gap-1.5">
          {screens.map((s) => {
            const Icon = s.icon
            const isActive = settings.screenType === s.id
            return (
              <button
                key={s.id}
                onClick={() => onUpdateSettings({ screenType: s.id })}
                className={cn(
                  'flex flex-col items-center gap-1 rounded-lg border p-2.5 transition-all',
                  isActive
                    ? 'border-primary/50 bg-primary/10 text-primary'
                    : 'border-border/60 hover:border-primary/30 hover:bg-primary/5 text-muted-foreground',
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="text-[10px] font-semibold">{s.label}</span>
                <span className="text-[8px] opacity-50">{s.desc}</span>
              </button>
            )
          })}
        </div>
      </PanelSection>

      {/* ── Step 1: Header ── */}
      <PanelSection title="Step 1 — Header">
        <div className="space-y-1">
          {headerStyles.map((h) => {
            const Icon = h.icon
            const active = settings.hasHeader
            return (
              <button
                key={h.id}
                onClick={() => onUpdateSettings({ hasHeader: !active })}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 transition-all text-left',
                  active
                    ? 'border-primary/50 bg-primary/10 text-primary ring-1 ring-primary/20'
                    : 'border-border/40 hover:border-primary/20 hover:bg-primary/5 text-muted-foreground',
                )}
              >
                <div className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-md', active ? 'bg-primary/15' : 'bg-muted/50')}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-semibold block">{h.label}</span>
                  <span className="text-[8px] opacity-40">{h.desc}</span>
                </div>
                {active && (
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20">
                    <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </PanelSection>

      {/* ── Header Position ── */}
      {settings.hasHeader && (
        <PanelSection title="Header Position">
          <div className="grid grid-cols-3 gap-1.5">
            {[{ id: 'top', label: 'Top', icon: ArrowUp, desc: 'Horizontal bar' }, { id: 'left', label: 'Left', icon: ArrowLeft, desc: 'Vertical sidebar' }, { id: 'right', label: 'Right', icon: ArrowRight, desc: 'Vertical sidebar' }].map((pos) => {
              const Icon = pos.icon
              const isActive = settings.headerPosition === pos.id
              return (
                <button
                  key={pos.id}
                  onClick={() => onUpdateSettings({ headerPosition: pos.id as 'top' | 'left' | 'right' })}
                  className={cn(
                    'flex flex-col items-center gap-1 rounded-lg border p-2.5 transition-all',
                    isActive
                      ? 'border-primary/50 bg-primary/10 text-primary ring-1 ring-primary/20'
                      : 'border-border/40 hover:border-primary/20 hover:bg-primary/5 text-muted-foreground',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-[10px] font-semibold">{pos.label}</span>
                  <span className="text-[8px] opacity-50">{pos.desc}</span>
                  {isActive && (
                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/20">
                      <svg className="h-2.5 w-2.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </PanelSection>
      )}

      {/* ── Step 2: Footer ── */}
      <PanelSection title="Step 2 — Footer">
        <div className="space-y-1">
          {footerStyles.map((f) => {
            const Icon = f.icon
            const active = settings.hasFooter
            return (
              <button
                key={f.id}
                onClick={() => onUpdateSettings({ hasFooter: !active })}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 transition-all text-left',
                  active
                    ? 'border-primary/50 bg-primary/10 text-primary ring-1 ring-primary/20'
                    : 'border-border/40 hover:border-primary/20 hover:bg-primary/5 text-muted-foreground',
                )}
              >
                <div className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-md', active ? 'bg-primary/15' : 'bg-muted/50')}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-semibold block">{f.label}</span>
                  <span className="text-[8px] opacity-40">{f.desc}</span>
                </div>
                {active && (
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20">
                    <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </PanelSection>

      {/* ── Step 3: Sections ── */}
      <PanelSection title="Step 3 — Sections">
        <p className="text-[9px] text-muted-foreground/50 mb-2">Choose the content layout</p>
        <div className="space-y-1">
          {sectionLayouts.map((l) => {
            const Icon = l.icon
            const active = settings.layout === l.id
            return (
              <button
                key={l.id}
                onClick={() => handleLayoutSelect(l.id, settings.hasHeader, settings.hasFooter)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 transition-all text-left',
                  active
                    ? 'border-primary/50 bg-primary/10 text-primary ring-1 ring-primary/20'
                    : 'border-border/40 hover:border-primary/20 hover:bg-primary/5 text-muted-foreground',
                )}
              >
                <div className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-md', active ? 'bg-primary/15' : 'bg-muted/50')}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-semibold block">{l.label}</span>
                </div>
                <LayoutMiniPreview type={l.preview} header={settings.hasHeader} footer={settings.hasFooter} />
                {active && (
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20">
                    <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </PanelSection>

      {/* ── Step 3b: Creative Sections ── */}
      <PanelSection title="Creative Sections">
        <div className="grid grid-cols-2 gap-1.5">
          {creativeSections.map((l) => {
            const Icon = l.icon
            const active = settings.layout === l.id
            return (
              <button
                key={l.id}
                onClick={() => handleLayoutSelect(l.id, settings.hasHeader, settings.hasFooter)}
                className={cn(
                  'flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all',
                  active
                    ? 'border-primary/50 bg-primary/10 text-primary ring-1 ring-primary/20'
                    : 'border-border/40 hover:border-primary/20 hover:bg-primary/5 text-muted-foreground',
                )}
              >
                <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', active ? 'bg-primary/15' : 'bg-muted/50')}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-semibold leading-tight text-center">{l.label}</span>
                <span className="text-[7px] opacity-40 text-center leading-tight">{l.desc}</span>
                {active && (
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/20">
                    <svg className="h-2.5 w-2.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </PanelSection>

      {/* ── Columns & Gap ── */}
      <PanelSection title="Columns">
        <SliderRow label="Desktop" value={settings.columns.desktop} onChange={(v) => onUpdateSettings({ columns: { ...settings.columns, desktop: v } })} />
        <SliderRow label="Tablet" value={settings.columns.tablet} onChange={(v) => onUpdateSettings({ columns: { ...settings.columns, tablet: v } })} />
        <SliderRow label="Mobile" value={settings.columns.mobile} onChange={(v) => onUpdateSettings({ columns: { ...settings.columns, mobile: v } })} />
      </PanelSection>
      <PanelSection title="Gap">
        <SliderRow label="Gap size" value={settings.gap} onChange={(v) => onUpdateSettings({ gap: v })} />
      </PanelSection>
    </div>
  )
}

/** Tiny inline preview for each layout option */
function LayoutMiniPreview({ type, header, footer }: { type: string; header?: boolean; footer?: boolean }) {
  const bg = 'bg-foreground/8'
  const accent = 'bg-primary/25'

  return (
    <div className="w-10 h-8 shrink-0 rounded border border-border/40 bg-background p-0.5 flex flex-col gap-px overflow-hidden">
      {header && <div className={cn('h-1 w-full rounded-sm', bg)} />}
      <div className="flex-1 flex flex-col gap-px">
        {type === 'grid' && (
          <div className="grid grid-cols-3 gap-px flex-1"><div className={accent} /><div className={accent} /><div className={accent} /><div className={accent} /><div className={accent} /><div className={accent} /></div>
        )}
        {type === 'masonry' && (
          <div className="grid grid-cols-3 gap-px flex-1"><div className={cn(accent, 'row-span-2')} /><div className={accent} /><div className={accent} /><div className={cn(accent, 'row-span-2')} /><div className={accent} /><div className={accent} /></div>
        )}
        {type === '2col' && (
          <div className="grid grid-cols-2 gap-px flex-1"><div className={accent} /><div className={accent} /><div className={accent} /><div className={accent} /></div>
        )}
        {type === '3col' && (
          <div className="grid grid-cols-3 gap-px flex-1"><div className={accent} /><div className={accent} /><div className={accent} /><div className={accent} /><div className={accent} /><div className={accent} /></div>
        )}
        {type === 'row' && (
          <div className="flex gap-px flex-1"><div className={cn(accent, 'flex-1')} /><div className={cn(accent, 'flex-1')} /><div className={cn(accent, 'flex-1')} /></div>
        )}
        {type === 'free' && (
          <div className="relative flex-1"><div className={cn(accent, 'absolute top-0 left-0 w-3 h-2 rounded-sm')} /><div className={cn(accent, 'absolute top-1 right-0 w-2 h-2 rounded-sm')} /><div className={cn(accent, 'absolute bottom-0 left-1 w-3 h-2 rounded-sm')} /></div>
        )}
      </div>
      {footer && <div className={cn('h-1 w-full rounded-sm', bg)} />}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   DESIGN PANEL — Header & Footer configuration
   ═══════════════════════════════════════════════════════════════ */

function DesignPanel({ settings, onUpdateSettings }: { settings: PhotofolioSettings; onUpdateSettings: (p: Partial<PhotofolioSettings>) => void }) {
  const [headerStyle, setHeaderStyle] = useState('minimal')
  const [footerStyle, setFooterStyle] = useState('minimal')

  return (
    <div>
      <PanelHeader icon={Palette} title="Header & Footer" subtitle="Design your page structure" />

      {/* ── Current Layout Info ── */}
      <PanelSection title="Current Layout">
        <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
          <LayoutMiniPreview type={settings.layout} header={settings.hasHeader} footer={settings.hasFooter} />
          <div>
            <p className="text-[11px] font-semibold text-foreground capitalize">{settings.layout} Layout</p>
            <p className="text-[9px] text-muted-foreground/60">
              {settings.hasHeader && settings.hasFooter ? 'Header + Footer' :
               settings.hasHeader ? 'Header only' :
               settings.hasFooter ? 'Footer only' : 'No header or footer'}
              {' · '}{settings.screenType}
            </p>
          </div>
        </div>
      </PanelSection>

      {/* ── Header ── */}
      <PanelSection title="Header">
        <ToggleRow
          label="Show Header"
          enabled={settings.hasHeader}
          onChange={(v) => onUpdateSettings({ hasHeader: v })}
        />
        {settings.hasHeader && (
          <>
            <div className="mt-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 mb-2">Header Style</p>
              <div className="grid grid-cols-2 gap-1.5">
                {[{ id: 'minimal', label: 'Minimal', desc: 'Logo + Nav' }, { id: 'centered', label: 'Centered', desc: 'Logo center' }, { id: 'full', label: 'Full Width', desc: 'Logo + Nav + CTA' }, { id: 'transparent', label: 'Transparent', desc: 'Overlay on hero' }].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setHeaderStyle(s.id)}
                    className={cn(
                      'flex flex-col items-center gap-0.5 rounded-lg border p-2 transition-all',
                      headerStyle === s.id
                        ? 'border-primary/50 bg-primary/10 text-primary'
                        : 'border-border/40 hover:border-primary/20 text-muted-foreground',
                    )}
                  >
                    <span className="text-[10px] font-semibold">{s.label}</span>
                    <span className="text-[7px] opacity-50">{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 mb-2">Header Elements</p>
              <div className="space-y-0.5">
                <ToggleRow label="Show Logo" enabled={true} />
                <ToggleRow label="Show Navigation" enabled={true} />
                <ToggleRow label="Show CTA Button" enabled={false} />
                <ToggleRow label="Sticky Header" enabled={false} />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 mb-2">Header Height</p>
              <SliderRow label="Height" value={60} />
              <SliderRow label="Padding X" value={24} />
            </div>
          </>
        )}
      </PanelSection>

      {/* ── Footer ── */}
      <PanelSection title="Footer">
        <ToggleRow
          label="Show Footer"
          enabled={settings.hasFooter}
          onChange={(v) => onUpdateSettings({ hasFooter: v })}
        />
        {settings.hasFooter && (
          <>
            <div className="mt-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 mb-2">Footer Style</p>
              <div className="grid grid-cols-2 gap-1.5">
                {[{ id: 'minimal', label: 'Minimal', desc: 'Copyright' }, { id: 'multi', label: 'Multi-Column', desc: 'Links grid' }, { id: 'centered', label: 'Centered', desc: 'Social + Copyright' }, { id: 'full', label: 'Full Width', desc: 'Newsletter + Links' }].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setFooterStyle(s.id)}
                    className={cn(
                      'flex flex-col items-center gap-0.5 rounded-lg border p-2 transition-all',
                      footerStyle === s.id
                        ? 'border-primary/50 bg-primary/10 text-primary'
                        : 'border-border/40 hover:border-primary/20 text-muted-foreground',
                    )}
                  >
                    <span className="text-[10px] font-semibold">{s.label}</span>
                    <span className="text-[7px] opacity-50">{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 mb-2">Footer Elements</p>
              <div className="space-y-0.5">
                <ToggleRow label="Show Copyright" enabled={true} />
                <ToggleRow label="Show Social Links" enabled={true} />
                <ToggleRow label="Show Newsletter" enabled={false} />
                <ToggleRow label="Show Back to Top" enabled={true} />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 mb-2">Footer Height</p>
              <SliderRow label="Height" value={80} />
              <SliderRow label="Padding X" value={24} />
            </div>
          </>
        )}
      </PanelSection>

      {/* ── Quick Actions ── */}
      <PanelSection title="Quick Actions">
        <div className="space-y-1.5">
          <button
            onClick={() => onUpdateSettings({ hasHeader: true, hasFooter: true })}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-border/40 py-2 text-[10px] font-medium text-muted-foreground hover:border-primary/20 hover:bg-primary/5 hover:text-foreground transition-all"
          >
            Add Both Header & Footer
          </button>
          <button
            onClick={() => onUpdateSettings({ hasHeader: false, hasFooter: false })}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-border/40 py-2 text-[10px] font-medium text-muted-foreground hover:border-primary/20 hover:bg-primary/5 hover:text-foreground transition-all"
          >
            Remove Both Header & Footer
          </button>
        </div>
      </PanelSection>
    </div>
  )
}

function TemplatesPanel({ settings, onUpdateSettings }: { settings: PhotofolioSettings; onUpdateSettings: (p: Partial<PhotofolioSettings>) => void }) {
  const templates = [
    { id: 'minimal', name: 'Minimal', color: '#1a1a1a' },
    { id: 'modern', name: 'Modern', color: '#2563eb' },
    { id: 'creative', name: 'Creative', color: '#7c3aed' },
    { id: 'elegant', name: 'Elegant', color: '#059669' },
    { id: 'bold', name: 'Bold', color: '#dc2626' },
    { id: 'clean', name: 'Clean', color: '#f59e0b' },
  ]
  return (
    <div>
      <PanelHeader icon={Blocks} title="Templates" subtitle="Start with a pre-built template" />
      <PanelSection title="Templates">
        <div className="space-y-2">
          {templates.map((t) => {
            const isActive = settings.template === t.id
            return (
              <button
                key={t.id}
                onClick={() => onUpdateSettings({ template: t.id })}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl border p-3 transition-all',
                  isActive
                    ? 'border-primary/50 bg-primary/10'
                    : 'border-border/60 hover:border-primary/30 hover:bg-primary/5',
                )}
              >
                <div className="h-10 w-14 rounded-lg" style={{ backgroundColor: t.color }} />
                <span className={cn('text-xs font-medium', isActive ? 'text-primary' : 'text-foreground')}>{t.name}</span>
              </button>
            )
          })}
        </div>
      </PanelSection>
    </div>
  )
}

function ThemesPanel() {
  const colors = ['#000000', '#1a1a2e', '#16213e', '#0f3460', '#e94560', '#f5f5f5', '#2563eb', '#7c3aed', '#059669', '#f59e0b']
  return (
    <div>
      <PanelHeader icon={Palette} title="Themes & Colors" subtitle="Customize your color palette" />
      <PanelSection title="Accent Color">
        <div className="flex flex-wrap gap-2">
          {colors.map((c) => (
            <ColorSwatch key={c} color={c} />
          ))}
        </div>
      </PanelSection>
      <PanelSection title="Background">
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <div className="aspect-square rounded-lg bg-background border-2 border-primary" />
            <div className="aspect-square rounded-lg bg-black" />
            <div className="aspect-square rounded-lg bg-white border border-border/60" />
          </div>
        </div>
      </PanelSection>
      <PanelSection title="Opacity">
        <SliderRow label="Card opacity" value={100} />
        <SliderRow label="Border opacity" value={60} />
      </PanelSection>
    </div>
  )
}

function FontsPanel() {
  const fonts = ['Inter', 'Playfair Display', 'Space Grotesk', 'DM Sans', 'Poppins', 'Raleway']
  return (
    <div>
      <PanelHeader icon={Type} title="Fonts & Typography" subtitle="Choose your typeface" />
      <PanelSection title="Heading Font">
        <select className="w-full rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-xs text-foreground">
          {fonts.map((f) => <option key={f}>{f}</option>)}
        </select>
      </PanelSection>
      <PanelSection title="Body Font">
        <select className="w-full rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-xs text-foreground">
          {fonts.map((f) => <option key={f}>{f}</option>)}
        </select>
      </PanelSection>
      <PanelSection title="Scale">
        <SliderRow label="Base size" value={16} />
        <SliderRow label="Scale ratio" value={125} />
      </PanelSection>
    </div>
  )
}

function FiltersPanel() {
  const filters = ['None', 'Grayscale', 'Sepia', 'Vintage', 'Warm', 'Cool', 'Dramatic', 'B&W High', 'Faded', 'Vivid']
  return (
    <div>
      <PanelHeader icon={Aperture} title="Filters & Effects" subtitle="Apply visual effects to photos" />
      <PanelSection title="Filter Presets">
        <div className="grid grid-cols-2 gap-2">
          {filters.map((f, i) => (
            <button key={f} className={cn('flex flex-col items-center gap-1 rounded-xl border border-border/60 p-2 hover:border-primary/30 transition-all', i === 0 && 'border-primary/40 bg-primary/5')}>
              <div className="h-8 w-full rounded-md bg-muted/40" />
              <span className="text-[9px] font-medium text-muted-foreground">{f}</span>
            </button>
          ))}
        </div>
      </PanelSection>
      <PanelSection title="Intensity">
        <SliderRow label="Filter strength" value={80} />
      </PanelSection>
    </div>
  )
}

function FramesPanel() {
  return (
    <div>
      <PanelHeader icon={Frame} title="Frames & Borders" subtitle="Add frames around your photos" />
      <PanelSection title="Frame Style">
        <div className="grid grid-cols-2 gap-2">
          {['None', 'Solid', 'Dashed', 'Double', 'Rounded', 'Polaroid'].map((f, i) => (
            <button key={f} className={cn('rounded-xl border border-border/60 p-3 text-center text-[10px] text-muted-foreground hover:border-primary/30 transition-all', i === 0 && 'border-primary/40 bg-primary/5')}>
              {f}
            </button>
          ))}
        </div>
      </PanelSection>
      <PanelSection title="Settings">
        <SliderRow label="Width" value={2} />
        <SliderRow label="Radius" value={12} />
        <SliderRow label="Padding" value={8} />
      </PanelSection>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   EDIT PANELS
   ═══════════════════════════════════════════════════════════════ */

function CropPanel() {
  return (
    <div>
      <PanelHeader icon={Crop} title="Crop & Resize" subtitle="Crop and resize your photos" />
      <PanelSection title="Aspect Ratio">
        <div className="grid grid-cols-3 gap-1.5">
          {['Free', '1:1', '4:3', '16:9', '3:2', '9:16'].map((r, i) => (
            <button key={r} className={cn('rounded-lg border border-border/60 py-2 text-[10px] text-muted-foreground hover:border-primary/30 transition-all', i === 0 && 'border-primary/40 bg-primary/5')}>
              {r}
            </button>
          ))}
        </div>
      </PanelSection>
      <PanelSection title="Dimensions">
        <div className="flex gap-2 mb-2">
          <input placeholder="Width" className="flex-1 rounded-lg border border-border/60 bg-muted/20 px-3 py-1.5 text-xs" defaultValue="1920" />
          <input placeholder="Height" className="flex-1 rounded-lg border border-border/60 bg-muted/20 px-3 py-1.5 text-xs" defaultValue="1080" />
        </div>
        <ToggleRow label="Lock aspect ratio" enabled={true} />
      </PanelSection>
    </div>
  )
}

function TransformPanel() {
  return (
    <div>
      <PanelHeader icon={Move} title="Transform" subtitle="Position and transform elements" />
      <PanelSection title="Position">
        <div className="flex gap-2 mb-2">
          <input placeholder="X" className="flex-1 rounded-lg border border-border/60 bg-muted/20 px-3 py-1.5 text-xs" />
          <input placeholder="Y" className="flex-1 rounded-lg border border-border/60 bg-muted/20 px-3 py-1.5 text-xs" />
        </div>
      </PanelSection>
      <PanelSection title="Size">
        <div className="flex gap-2 mb-2">
          <input placeholder="W" className="flex-1 rounded-lg border border-border/60 bg-muted/20 px-3 py-1.5 text-xs" />
          <input placeholder="H" className="flex-1 rounded-lg border border-border/60 bg-muted/20 px-3 py-1.5 text-xs" />
        </div>
        <ToggleRow label="Constrain proportions" enabled={true} />
      </PanelSection>
      <PanelSection title="Rotate">
        <SliderRow label="Rotation" value={0} />
        <SliderRow label="Skew" value={0} />
      </PanelSection>
    </div>
  )
}

function RotatePanel() {
  return (
    <div>
      <PanelHeader icon={FlipHorizontal2} title="Rotate & Flip" subtitle="Rotate and flip your photos" />
      <PanelSection title="Rotate">
        <div className="grid grid-cols-2 gap-2">
          <ToolButton icon={RotateCcw} label="Rotate Left 90°" />
          <ToolButton icon={RotateCcw} label="Rotate Right 90°" />
        </div>
        <SliderRow label="Custom angle" value={0} />
      </PanelSection>
      <PanelSection title="Flip">
        <div className="grid grid-cols-2 gap-2">
          <ToolButton icon={FlipHorizontal2} label="Flip Horizontal" />
          <ToolButton icon={FlipHorizontal2} label="Flip Vertical" />
        </div>
      </PanelSection>
    </div>
  )
}

function AdjustPanel() {
  return (
    <div>
      <PanelHeader icon={Sun} title="Brightness & Contrast" subtitle="Fine-tune image appearance" />
      <PanelSection title="Light">
        <SliderRow label="Brightness" value={50} />
        <SliderRow label="Contrast" value={50} />
        <SliderRow label="Exposure" value={50} />
        <SliderRow label="Highlights" value={50} />
        <SliderRow label="Shadows" value={50} />
      </PanelSection>
      <PanelSection title="Color">
        <SliderRow label="Saturation" value={50} />
        <SliderRow label="Temperature" value={50} />
        <SliderRow label="Tint" value={50} />
        <SliderRow label="Vibrance" value={50} />
      </PanelSection>
      <PanelSection title="Detail">
        <SliderRow label="Sharpness" value={50} />
        <SliderRow label="Clarity" value={50} />
        <SliderRow label="Noise reduction" value={0} />
      </PanelSection>
    </div>
  )
}

function RetouchPanel() {
  return (
    <div>
      <PanelHeader icon={Wand2} title="Retouch & Enhance" subtitle="AI-powered enhancement tools" />
      <PanelSection title="AI Tools">
        <div className="space-y-1.5">
          <ToolButton icon={Wand2} label="Auto Enhance" />
          <ToolButton icon={Sparkles} label="Remove Background" />
          <ToolButton icon={Zap} label="Upscale Image" />
          <ToolButton icon={Wand2} label="Dehaze" />
        </div>
      </PanelSection>
      <PanelSection title="Manual">
        <SliderRow label="Vignette" value={0} />
        <SliderRow label="Grain" value={0} />
        <SliderRow label="Fade" value={0} />
      </PanelSection>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PAGE PANELS
   ═══════════════════════════════════════════════════════════════ */

function PagesPanel() {
  return (
    <div>
      <PanelHeader icon={Layers} title="Page Manager" subtitle="Manage pages in your photofolio" />
      <PanelSection title="Pages">
        <div className="space-y-1.5">
          {['Home', 'Gallery', 'About', 'Contact'].map((p) => (
            <div key={p} className="flex items-center justify-between rounded-lg border border-border/40 px-3 py-2">
              <div className="flex items-center gap-2">
                <GripVertical className="h-3 w-3 text-muted-foreground/30" />
                <span className="text-xs text-foreground">{p}</span>
              </div>
              <X className="h-3 w-3 text-muted-foreground/40 cursor-pointer hover:text-destructive" />
            </div>
          ))}
        </div>
        <button className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border/60 py-2 text-xs text-muted-foreground hover:border-primary/30 hover:bg-primary/5 transition-all">
          <Plus className="h-3 w-3" /> Add Page
        </button>
      </PanelSection>
    </div>
  )
}

function SectionsPanel() {
  return (
    <div>
      <PanelHeader icon={Blocks} title="Sections" subtitle="Add sections to your pages" />
      <PanelSection title="Available Sections">
        <div className="space-y-1.5">
          {['Hero', 'Gallery Grid', 'About', 'Testimonials', 'Contact Form', 'Footer', 'Stats', 'Timeline'].map((s) => (
            <button key={s} className="flex w-full items-center gap-2 rounded-lg border border-border/40 px-3 py-2 text-xs text-muted-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-foreground transition-all">
              <Plus className="h-3 w-3" />
              {s}
            </button>
          ))}
        </div>
      </PanelSection>
    </div>
  )
}

function TransitionsPanel() {
  return (
    <div>
      <PanelHeader icon={Sparkles} title="Transitions" subtitle="Set page and element transitions" />
      <PanelSection title="Page Transition">
        <div className="grid grid-cols-2 gap-2">
          {['Fade', 'Slide', 'Zoom', 'Flip', 'None'].map((t, i) => (
            <button key={t} className={cn('rounded-xl border border-border/60 py-2.5 text-[10px] text-muted-foreground hover:border-primary/30 transition-all', i === 0 && 'border-primary/40 bg-primary/5')}>
              {t}
            </button>
          ))}
        </div>
      </PanelSection>
      <PanelSection title="Timing">
        <SliderRow label="Duration (ms)" value={300} />
        <SliderRow label="Delay (ms)" value={0} />
      </PanelSection>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   CUSTOMIZE PANELS
   ═══════════════════════════════════════════════════════════════ */

function AnimationsPanel() {
  return (
    <div>
      <PanelHeader icon={Zap} title="Animations" subtitle="Add motion to your elements" />
      <PanelSection title="Entrance">
        <div className="grid grid-cols-2 gap-2">
          {['Fade In', 'Slide Up', 'Scale', 'Bounce', 'Flip', 'None'].map((a, i) => (
            <button key={a} className={cn('rounded-xl border border-border/60 py-2.5 text-[10px] text-muted-foreground hover:border-primary/30 transition-all', i === 0 && 'border-primary/40 bg-primary/5')}>
              {a}
            </button>
          ))}
        </div>
      </PanelSection>
      <PanelSection title="Hover Effects">
        <div className="grid grid-cols-2 gap-2">
          {['None', 'Zoom', 'Lift', 'Glow', 'Shake'].map((h, i) => (
            <button key={h} className={cn('rounded-xl border border-border/60 py-2.5 text-[10px] text-muted-foreground hover:border-primary/30 transition-all', i === 0 && 'border-primary/40 bg-primary/5')}>
              {h}
            </button>
          ))}
        </div>
      </PanelSection>
      <PanelSection title="Scroll">
        <ToggleRow label="Parallax" enabled={false} />
        <ToggleRow label="Reveal on scroll" enabled={true} />
        <SliderRow label="Stagger delay" value={100} />
      </PanelSection>
    </div>
  )
}

function SlideshowPanel() {
  return (
    <div>
      <PanelHeader icon={Move} title="Slideshow Settings" subtitle="Configure auto-play slideshows" />
      <PanelSection title="Playback">
        <ToggleRow label="Auto-play" enabled={false} />
        <ToggleRow label="Loop" enabled={true} />
        <SliderRow label="Interval (sec)" value={5} />
      </PanelSection>
      <PanelSection title="Controls">
        <ToggleRow label="Show arrows" enabled={true} />
        <ToggleRow label="Show dots" enabled={true} />
        <ToggleRow label="Keyboard navigation" enabled={true} />
      </PanelSection>
      <PanelSection title="Transition">
        <div className="grid grid-cols-2 gap-2">
          {['Fade', 'Slide', 'Zoom'].map((t, i) => (
            <button key={t} className={cn('rounded-xl border border-border/60 py-2 text-[10px] text-muted-foreground hover:border-primary/30 transition-all', i === 0 && 'border-primary/40 bg-primary/5')}>
              {t}
            </button>
          ))}
        </div>
      </PanelSection>
    </div>
  )
}

function GridOptionsPanel() {
  return (
    <div>
      <PanelHeader icon={LayoutGrid} title="Grid Options" subtitle="Fine-tune your grid layout" />
      <PanelSection title="Columns">
        <SliderRow label="Desktop" value={4} />
        <SliderRow label="Tablet" value={3} />
        <SliderRow label="Mobile" value={1} />
      </PanelSection>
      <PanelSection title="Spacing">
        <SliderRow label="Gap" value={16} />
        <SliderRow label="Padding" value={24} />
      </PanelSection>
      <PanelSection title="Behavior">
        <ToggleRow label="Justify items" enabled={true} />
        <ToggleRow label="Equal height" enabled={false} />
        <ToggleRow label="Full width" enabled={false} />
      </PanelSection>
    </div>
  )
}

function SpacingPanel() {
  return (
    <div>
      <PanelHeader icon={SlidersHorizontal} title="Spacing & Margins" subtitle="Adjust spacing between elements" />
      <PanelSection title="Section Spacing">
        <SliderRow label="Between sections" value={80} />
        <SliderRow label="Section padding" value={60} />
      </PanelSection>
      <PanelSection title="Element Spacing">
        <SliderRow label="Element gap" value={16} />
        <SliderRow label="Inner padding" value={24} />
      </PanelSection>
      <PanelSection title="Page Margins">
        <SliderRow label="Top" value={0} />
        <SliderRow label="Bottom" value={0} />
        <SliderRow label="Left" value={48} />
        <SliderRow label="Right" value={48} />
      </PanelSection>
    </div>
  )
}

function BackgroundsPanel() {
  return (
    <div>
      <PanelHeader icon={Paintbrush} title="Backgrounds" subtitle="Set backgrounds for sections" />
      <PanelSection title="Type">
        <div className="grid grid-cols-2 gap-2">
          {['Solid', 'Gradient', 'Image', 'Video'].map((b, i) => (
            <button key={b} className={cn('rounded-xl border border-border/60 py-2.5 text-[10px] text-muted-foreground hover:border-primary/30 transition-all', i === 0 && 'border-primary/40 bg-primary/5')}>
              {b}
            </button>
          ))}
        </div>
      </PanelSection>
      <PanelSection title="Colors">
        <div className="flex flex-wrap gap-2">
          {['#000000', '#ffffff', '#1a1a2e', '#0f3460', '#e94560'].map((c) => (
            <ColorSwatch key={c} color={c} />
          ))}
        </div>
      </PanelSection>
      <PanelSection title="Overlay">
        <SliderRow label="Opacity" value={50} />
        <ToggleRow label="Blur background" enabled={false} />
      </PanelSection>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SEO PANELS
   ═══════════════════════════════════════════════════════════════ */

function SeoPanel() {
  return (
    <div>
      <PanelHeader icon={TrendingUp} title="SEO Settings" subtitle="Optimize for search engines" />
      <PanelSection title="Page Title">
        <input className="w-full rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-xs" placeholder="My Photofolio" />
        <p className="text-[9px] text-muted-foreground/50 mt-1">Recommended: 50-60 characters</p>
      </PanelSection>
      <PanelSection title="Description">
        <textarea className="w-full rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-xs h-20 resize-none" placeholder="A visual portfolio showcasing my best work..." />
        <p className="text-[9px] text-muted-foreground/50 mt-1">Recommended: 150-160 characters</p>
      </PanelSection>
      <PanelSection title="Options">
        <ToggleRow label="Index this page" enabled={true} />
        <ToggleRow label="Show in sitemap" enabled={true} />
        <ToggleRow label="Canonical URL" enabled={false} />
      </PanelSection>
    </div>
  )
}

function MetaPanel() {
  return (
    <div>
      <PanelHeader icon={FileText} title="Meta Tags" subtitle="Manage HTML meta tags" />
      <PanelSection title="Custom Meta">
        <div className="space-y-2">
          <input className="w-full rounded-lg border border-border/60 bg-muted/20 px-3 py-1.5 text-xs" placeholder="Name" />
          <input className="w-full rounded-lg border border-border/60 bg-muted/20 px-3 py-1.5 text-xs" placeholder="Content" />
          <button className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border/60 py-2 text-xs text-muted-foreground hover:border-primary/30 transition-all">
            <Plus className="h-3 w-3" /> Add Meta Tag
          </button>
        </div>
      </PanelSection>
      <PanelSection title="Social">
        <ToggleRow label="Open Graph tags" enabled={true} />
        <ToggleRow label="Twitter Card" enabled={true} />
      </PanelSection>
    </div>
  )
}

function OgImagePanel() {
  return (
    <div>
      <PanelHeader icon={ImageIcon} title="OG Image" subtitle="Set the social share preview image" />
      <PanelSection title="Preview">
        <div className="aspect-[1200/630] rounded-xl border border-border/40 bg-muted/30 flex items-center justify-center">
          <span className="text-xs text-muted-foreground/40">1200 × 630</span>
        </div>
      </PanelSection>
      <PanelSection title="Upload">
        <ToolButton icon={Upload} label="Upload OG image" />
        <ToolButton icon={Camera} label="Use cover photo" />
      </PanelSection>
    </div>
  )
}

function SitemapPanel() {
  return (
    <div>
      <PanelHeader icon={Globe} title="Sitemap" subtitle="Manage your sitemap settings" />
      <PanelSection title="Settings">
        <ToggleRow label="Auto-generate sitemap" enabled={true} />
        <ToggleRow label="Include images" enabled={true} />
        <SliderRow label="Change frequency" value={70} />
      </PanelSection>
      <PanelSection title="Preview">
        <div className="rounded-lg border border-border/40 bg-muted/20 p-3 font-mono text-[10px] text-muted-foreground/60 space-y-1">
          <p>&lt;url&gt;</p>
          <p className="ml-2">&lt;loc&gt;https://yoursite.com/&lt;/loc&gt;</p>
          <p className="ml-2">&lt;priority&gt;1.0&lt;/priority&gt;</p>
          <p>&lt;/url&gt;</p>
        </div>
      </PanelSection>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PUBLISH PANELS
   ═══════════════════════════════════════════════════════════════ */

function DomainPanel() {
  return (
    <div>
      <PanelHeader icon={Link2} title="Custom Domain" subtitle="Connect your own domain" />
      <PanelSection title="Current URL">
        <div className="flex items-center gap-2 rounded-lg border border-border/40 bg-muted/20 px-3 py-2">
          <Globe className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-foreground">photofolio.app/your-name</span>
        </div>
      </PanelSection>
      <PanelSection title="Custom Domain">
        <input className="w-full rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-xs mb-2" placeholder="yourdomain.com" />
        <ToolButton icon={Link2} label="Connect Domain" />
      </PanelSection>
    </div>
  )
}

function SharePanel() {
  return (
    <div>
      <PanelHeader icon={Share2} title="Share & Social" subtitle="Share your photofolio" />
      <PanelSection title="Share Link">
        <div className="flex gap-2">
          <input className="flex-1 rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-xs" readOnly value="photofolio.app/your-name" />
          <button className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90">Copy</button>
        </div>
      </PanelSection>
      <PanelSection title="Social">
        <div className="space-y-1.5">
          {['Twitter / X', 'Facebook', 'LinkedIn', 'Pinterest', 'Instagram'].map((s) => (
            <ToolButton key={s} icon={Share2} label={`Share on ${s}`} />
          ))}
        </div>
      </PanelSection>
      <PanelSection title="Embed">
        <textarea className="w-full rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-[10px] font-mono h-16 resize-none" readOnly value='<iframe src="photofolio.app/your-name" width="100%" height="400" />' />
      </PanelSection>
    </div>
  )
}

function AnalyticsPanel() {
  return (
    <div>
      <PanelHeader icon={BarChart3} title="Analytics" subtitle="Track visitor activity" />
      <PanelSection title="Overview">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-border/40 bg-muted/20 p-3">
            <p className="text-[10px] text-muted-foreground/60">Page Views</p>
            <p className="text-lg font-bold text-foreground">—</p>
          </div>
          <div className="rounded-lg border border-border/40 bg-muted/20 p-3">
            <p className="text-[10px] text-muted-foreground/60">Visitors</p>
            <p className="text-lg font-bold text-foreground">—</p>
          </div>
          <div className="rounded-lg border border-border/40 bg-muted/20 p-3">
            <p className="text-[10px] text-muted-foreground/60">Avg. Time</p>
            <p className="text-lg font-bold text-foreground">—</p>
          </div>
          <div className="rounded-lg border border-border/40 bg-muted/20 p-3">
            <p className="text-[10px] text-muted-foreground/60">Bounce Rate</p>
            <p className="text-lg font-bold text-foreground">—</p>
          </div>
        </div>
      </PanelSection>
      <PanelSection title="Integrations">
        <ToggleRow label="Google Analytics" enabled={false} />
        <ToggleRow label="Plausible" enabled={false} />
      </PanelSection>
    </div>
  )
}

function PasswordPanel() {
  return (
    <div>
      <PanelHeader icon={Shield} title="Password Protect" subtitle="Restrict access to your portfolio" />
      <PanelSection title="Protection">
        <ToggleRow label="Enable password" enabled={false} />
      </PanelSection>
      <PanelSection title="Settings">
        <input type="password" className="w-full rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-xs mb-2" placeholder="Password" />
        <input className="w-full rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-xs" placeholder="Welcome message" />
      </PanelSection>
    </div>
  )
}

function MobilePanel() {
  return (
    <div>
      <PanelHeader icon={Smartphone} title="Mobile Preview" subtitle="Preview your portfolio on mobile" />
      <PanelSection title="Device">
        <div className="flex gap-2 mb-3">
          {['iPhone', 'Android', 'iPad'].map((d, i) => (
            <button key={d} className={cn('flex-1 rounded-lg border border-border/60 py-2 text-[10px] text-muted-foreground hover:border-primary/30 transition-all', i === 0 && 'border-primary/40 bg-primary/5')}>
              {d}
            </button>
          ))}
        </div>
        <div className="mx-auto aspect-[9/19.5] w-48 rounded-[2rem] border-4 border-foreground/20 bg-muted/20 p-2">
          <div className="h-full w-full rounded-[1.5rem] bg-muted/30 flex items-center justify-center">
            <Smartphone className="h-8 w-8 text-muted-foreground/20" />
          </div>
        </div>
      </PanelSection>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MANAGE PANELS
   ═══════════════════════════════════════════════════════════════ */

function CommentsPanel() {
  return (
    <div>
      <PanelHeader icon={MessageSquare} title="Comments" subtitle="Manage visitor comments" />
      <PanelSection title="Settings">
        <ToggleRow label="Enable comments" enabled={false} />
        <ToggleRow label="Moderate before publish" enabled={true} />
        <ToggleRow label="Email notifications" enabled={true} />
      </PanelSection>
      <PanelSection title="Recent">
        <div className="text-center py-6 text-xs text-muted-foreground/50">No comments yet</div>
      </PanelSection>
    </div>
  )
}

function FeedbackPanel() {
  return (
    <div>
      <PanelHeader icon={Star} title="Visitor Feedback" subtitle="Collect feedback from visitors" />
      <PanelSection title="Settings">
        <ToggleRow label="Show feedback button" enabled={false} />
        <ToggleRow label="Require email" enabled={false} />
      </PanelSection>
      <PanelSection title="Responses">
        <div className="text-center py-6 text-xs text-muted-foreground/50">No feedback yet</div>
      </PanelSection>
    </div>
  )
}

function VersionsPanel() {
  return (
    <div>
      <PanelHeader icon={RotateCcw} title="Version History" subtitle="Restore previous versions" />
      <PanelSection title="Versions">
        <div className="space-y-2">
          {['Current version', 'Draft — Aug 19', 'Published — Aug 15'].map((v, i) => (
            <div key={v} className="flex items-center justify-between rounded-lg border border-border/40 px-3 py-2">
              <div>
                <p className="text-xs text-foreground">{v}</p>
                <p className="text-[9px] text-muted-foreground/50">{i === 0 ? 'Just now' : `${i * 3} days ago`}</p>
              </div>
              {i > 0 && (
                <button className="text-[10px] text-primary hover:underline">Restore</button>
              )}
            </div>
          ))}
        </div>
      </PanelSection>
    </div>
  )
}

function BackupPanel() {
  return (
    <div>
      <PanelHeader icon={CreditCard} title="Backup & Restore" subtitle="Export and import your portfolio" />
      <PanelSection title="Export">
        <div className="space-y-1.5">
          <ToolButton icon={Download} label="Download as ZIP" />
          <ToolButton icon={FileText} label="Export as JSON" />
        </div>
      </PanelSection>
      <PanelSection title="Import">
        <ToolButton icon={CloudUpload} label="Upload backup file" />
      </PanelSection>
    </div>
  )
}

function IntegrationsPanel() {
  return (
    <div>
      <PanelHeader icon={Gift} title="Integrations" subtitle="Connect third-party services" />
      <PanelSection title="Available">
        <div className="space-y-1.5">
          {['Google Analytics', 'Plausible', 'Hotjar', 'Mailchimp', 'Calendly', 'Stripe'].map((i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-border/40 px-3 py-2">
              <span className="text-xs text-foreground">{i}</span>
              <button className="text-[10px] text-primary hover:underline">Connect</button>
            </div>
          ))}
        </div>
      </PanelSection>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   HELP PANELS
   ═══════════════════════════════════════════════════════════════ */

function DocsPanel() {
  return (
    <div>
      <PanelHeader icon={BookOpen} title="Documentation" subtitle="Learn how to use Photofolio" />
      <PanelSection title="Getting Started">
        <div className="space-y-1.5">
          {['Quick Start Guide', 'Uploading Photos', 'Choosing a Layout', 'Customizing Themes', 'Publishing Your Portfolio'].map((d) => (
            <button key={d} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors text-left">
              <BookOpen className="h-3 w-3 shrink-0" />
              {d}
            </button>
          ))}
        </div>
      </PanelSection>
    </div>
  )
}

function TipsPanel() {
  return (
    <div>
      <PanelHeader icon={MousePointerClick} title="Tips & Tricks" subtitle="Pro tips for better portfolios" />
      <PanelSection title="Tips">
        <div className="space-y-2">
          {[
            { title: 'Keep it simple', desc: 'Less is more. Focus on your best work.' },
            { title: 'Use high-res images', desc: 'Upload at least 2000px wide images.' },
            { title: 'Add descriptions', desc: 'Context helps visitors understand your work.' },
            { title: 'Mobile-first', desc: 'Most visitors will view on their phone.' },
          ].map((tip) => (
            <div key={tip.title} className="rounded-lg border border-border/40 p-3">
              <p className="text-xs font-semibold text-foreground">{tip.title}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{tip.desc}</p>
            </div>
          ))}
        </div>
      </PanelSection>
    </div>
  )
}

function SupportPanel() {
  return (
    <div>
      <PanelHeader icon={HelpCircle} title="Support" subtitle="Get help when you need it" />
      <PanelSection title="Contact">
        <div className="space-y-1.5">
          <ToolButton icon={MessageSquare} label="Live Chat" />
          <ToolButton icon={FileText} label="Submit Ticket" />
          <ToolButton icon={Globe} label="Community Forum" />
        </div>
      </PanelSection>
      <PanelSection title="Status">
        <div className="flex items-center gap-2 rounded-lg border border-border/40 px-3 py-2">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-xs text-foreground">All systems operational</span>
        </div>
      </PanelSection>
    </div>
  )
}

function DefaultPanel() {
  return (
    <div className="flex h-full items-center justify-center p-8 text-center">
      <div>
        <Sparkles className="h-8 w-8 text-muted-foreground/20 mx-auto mb-3" />
        <p className="text-xs text-muted-foreground/60">Select a tool from the sidebar</p>
      </div>
    </div>
  )
}
