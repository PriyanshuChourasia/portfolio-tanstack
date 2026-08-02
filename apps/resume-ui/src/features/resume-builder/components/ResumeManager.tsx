import { useRef, useState, useCallback } from 'react'
import { FileText, Plus, Trash2, Pencil, Check, X, ChevronDown, FileImage, File } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useResumeStore } from '../store'
import { extractTextFromPdf } from '../utils/pdf-parse'
import { extractTextFromImage } from '../utils/extract-text-from-image'
import { parseResumeText } from '../utils/parse-resume-text'

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export function ResumeManager() {
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [importing, setImporting] = useState(false)
  const importRef = useRef<HTMLInputElement>(null)
  const pdfImportRef = useRef<HTMLInputElement>(null)
  const imageImportRef = useRef<HTMLInputElement>(null)

  const registry = useResumeStore((s) => s.registry)
  const activeId = useResumeStore((s) => s.activeId)
  const activeName = useResumeStore((s) => s.document.meta.name)
  const createResume = useResumeStore((s) => s.createResume)
  const switchResume = useResumeStore((s) => s.switchResume)
  const deleteResume = useResumeStore((s) => s.deleteResume)
  const renameResume = useResumeStore((s) => s.renameResume)
  const importFromJson = useResumeStore((s) => s.importFromJson)
  const importFromParsedData = useResumeStore((s) => s.importFromParsedData)

  const handleCreate = useCallback(() => {
    const id = createResume('Untitled Resume')
    switchResume(id)
  }, [createResume, switchResume])

  const handleStartEdit = useCallback((id: string, currentName: string) => {
    setEditingId(id)
    setEditName(currentName)
  }, [])

  const handleConfirmEdit = useCallback(() => {
    if (editingId && editName.trim()) {
      renameResume(editingId, editName.trim())
    }
    setEditingId(null)
    setEditName('')
  }, [editingId, editName, renameResume])

  const handleCancelEdit = useCallback(() => {
    setEditingId(null)
    setEditName('')
  }, [])

  const handleConfirmDelete = useCallback(
    (id: string) => {
      deleteResume(id)
      setDeletingId(null)
    },
    [deleteResume],
  )

  const handleImport = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        const text = ev.target?.result
        if (typeof text === 'string') importFromJson(text)
      }
      reader.readAsText(file)
      e.target.value = ''
    },
    [importFromJson],
  )

  const handlePdfImport = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      setImporting(true)
      try {
        const rawText = await extractTextFromPdf(file)
        if (!rawText) {
          alert('No text could be extracted from this PDF. Try a different file.')
          return
        }
        const parsed = parseResumeText(rawText)
        const name = parsed.personalInfo?.fullName
          ? `${parsed.personalInfo.fullName} Resume`
          : file.name.replace(/\.pdf$/i, '')
        importFromParsedData(parsed, name)
      } catch (err) {
        console.error('PDF import failed:', err)
        alert('Could not parse this PDF. Try copying the text and pasting it manually.')
      } finally {
        setImporting(false)
        if (pdfImportRef.current) pdfImportRef.current.value = ''
      }
    },
    [importFromParsedData],
  )

  const handleImageImport = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      setImporting(true)
      try {
        const rawText = await extractTextFromImage(file)
        if (!rawText) {
          alert('No text could be extracted from this image. Try a different file.')
          return
        }
        const parsed = parseResumeText(rawText)
        const name = parsed.personalInfo?.fullName
          ? `${parsed.personalInfo.fullName} Resume`
          : file.name.replace(/\.(png|jpe?g|webp|bmp|tiff?)$/i, '')
        importFromParsedData(parsed, name)
      } catch (err) {
        console.error('Image import failed:', err)
        alert('Could not parse this image. Try copying the text and pasting it manually.')
      } finally {
        setImporting(false)
        if (imageImportRef.current) imageImportRef.current.value = ''
      }
    },
    [importFromParsedData],
  )

  return (
    <>
      <input
        ref={importRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleImport}
      />
      <input
        ref={pdfImportRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handlePdfImport}
      />
      <input
        ref={imageImportRef}
        type="file"
        accept=".png,.jpg,.jpeg,.webp,.bmp,.tiff,.tif"
        className="hidden"
        onChange={handleImageImport}
      />

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="inline-flex max-w-[180px] items-center gap-1.5 rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs font-medium text-foreground shadow-xs transition-colors hover:bg-muted/50 sm:max-w-[220px]"
          >
            <FileText className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate">{activeName}</span>
            <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
          </button>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-80 max-w-[calc(100vw-2rem)] p-0">
          <div className="border-b px-3 py-2.5">
            <p className="text-xs font-semibold text-foreground">My Resumes</p>
            <p className="text-[11px] text-muted-foreground">
              {registry.length} resume{registry.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="max-h-64 overflow-y-auto overscroll-contain p-1">
            <AnimatePresence mode="popLayout">
              {registry.map((meta) => {
                const isActive = meta.id === activeId
                const isEditing = editingId === meta.id
                const isDeleting = deletingId === meta.id

                return (
                  <motion.div
                    key={meta.id}
                    layout
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.15 }}
                    className={`group relative mb-0.5 rounded-md px-2.5 py-2 transition-colors ${
                      isActive
                        ? 'bg-primary/10 ring-1 ring-primary/20'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    {isEditing ? (
                      <div className="flex items-center gap-1.5">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleConfirmEdit()
                            if (e.key === 'Escape') handleCancelEdit()
                          }}
                          autoFocus
                          className="h-7 text-xs"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={handleConfirmEdit}
                          className="shrink-0 text-green-600 hover:text-green-700"
                        >
                          <Check className="size-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={handleCancelEdit}
                          className="shrink-0 text-muted-foreground"
                        >
                          <X className="size-3" />
                        </Button>
                      </div>
                    ) : isDeleting ? (
                      <div className="flex items-center gap-2">
                        <p className="flex-1 truncate text-xs text-destructive">
                          Delete this resume?
                        </p>
                        <Button
                          type="button"
                          variant="destructive"
                          size="xs"
                          onClick={() => handleConfirmDelete(meta.id)}
                        >
                          Delete
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="xs"
                          onClick={() => setDeletingId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            switchResume(meta.id)
                            setOpen(false)
                          }}
                          className="flex min-w-0 flex-1 items-center gap-2"
                        >
                          <span
                            className={`inline-block size-2 shrink-0 rounded-full ${
                              isActive ? 'bg-primary' : 'bg-muted-foreground/30'
                            }`}
                          />
                          <div className="min-w-0 text-left">
                            <p className="truncate text-xs font-medium text-foreground">
                              {meta.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {formatDate(meta.updatedAt)}
                            </p>
                          </div>
                        </button>

                        <div className="flex shrink-0 items-center gap-0.5 opacity-70 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => handleStartEdit(meta.id, meta.name)}
                            title="Rename"
                          >
                            <Pencil className="size-3" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => setDeletingId(meta.id)}
                            title="Delete"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="size-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          <div className="border-t p-1.5">
            <div className="flex gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="xs"
                className="flex-1"
                onClick={handleCreate}
              >
                <Plus className="size-3" />
                New Resume
              </Button>
              <Button
                type="button"
                variant="outline"
                size="xs"
                className="flex-1"
                disabled={importing}
                onClick={() => importRef.current?.click()}
              >
                <FileText className="size-3" />
                {importing ? 'Importing...' : 'Import'}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="xs"
                className="flex-1"
                disabled={importing}
                onClick={() => pdfImportRef.current?.click()}
              >
                <File className="size-3" />
                PDF
              </Button>
              <Button
                type="button"
                variant="outline"
                size="xs"
                className="flex-1"
                disabled={importing}
                onClick={() => imageImportRef.current?.click()}
              >
                <FileImage className="size-3" />
                Image
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  )
}
