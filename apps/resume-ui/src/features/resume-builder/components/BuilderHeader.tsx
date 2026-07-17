import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import {
  FileText,
  Download,
  Printer,
  Undo2,
  Redo2,
  Sun,
  Moon,
  Upload,
  Github,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useResumeStore } from '../store'
import { useTheme } from './ThemeProvider'
import { TemplatePicker } from './TemplatePicker'
import { ResumeManager } from './ResumeManager'
import { SettingsPanel } from './SettingsPanel'
import { HelpPanel } from './HelpPanel'

interface BuilderHeaderProps {
  templateId: string
  onTemplateChange: (id: string) => void
  onExportPdf: () => void
  onExportWord: () => void
  onImport: () => void
  exporting: 'pdf' | 'word' | null
  importing: boolean
}

export function BuilderHeader({
  templateId,
  onTemplateChange,
  onExportPdf,
  onExportWord,
  onImport,
  exporting,
  importing,
}: BuilderHeaderProps) {
  const [editingName, setEditingName] = useState(false)

  const document = useResumeStore((s) => s.document)
  const renameResume = useResumeStore((s) => s.renameResume)
  const undo = useResumeStore((s) => s.undo)
  const redo = useResumeStore((s) => s.redo)
  const canUndo = useResumeStore((s) => s.canUndo)
  const canRedo = useResumeStore((s) => s.canRedo)

  const { theme, toggle } = useTheme()

  const handleNameSubmit = (value: string) => {
    const trimmed = value.trim()
    if (trimmed) {
      renameResume(document.meta.id, trimmed)
    }
    setEditingName(false)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-xl dark:bg-background/90 print:hidden"
    >
      <div className="flex items-center justify-between gap-1.5 px-3 py-2 sm:gap-2 sm:px-4 sm:py-2.5">
        {/* Left group: logo + template + resume name + manager */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          {/* Logo — links to landing page */}
          <Link to="/" className="flex items-center gap-1.5 rounded-lg px-1.5 py-1 transition-colors hover:bg-muted/50 sm:gap-2">
            <FileText className="size-4 shrink-0 text-primary sm:size-5" />
            <h1 className="hidden text-sm font-bold tracking-tight sm:inline sm:text-base">
              Resume Builder
            </h1>
          </Link>

          {/* Template picker */}
          <TemplatePicker selectedId={templateId} onSelect={onTemplateChange} />

          {/* Editable resume name */}
          <div className="hidden min-w-0 md:block">
            {editingName ? (
              <Input
                autoFocus
                defaultValue={document.meta.name}
                className="h-7 w-48 text-sm"
                onBlur={(e) => handleNameSubmit(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleNameSubmit((e.target as HTMLInputElement).value)
                  }
                  if (e.key === 'Escape') {
                    setEditingName(false)
                  }
                }}
              />
            ) : (
              <button
                type="button"
                onClick={() => setEditingName(true)}
                className="max-w-[200px] truncate text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
                title="Click to rename"
              >
                {document.meta.name}
              </button>
            )}
          </div>

          {/* Resume manager */}
          <ResumeManager />
        </div>

        {/* Right group: actions */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Import */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={importing}
            onClick={onImport}
            className="hidden text-xs sm:inline-flex"
          >
            <Upload className="size-3.5" />
            {importing ? 'Parsing…' : 'Import'}
          </Button>

          {/* GitHub */}
          <a
            href="https://github.com/PriyanshuChourasia/resume-to-portfolio"
            target="_blank"
            rel="noreferrer"
            title="View on GitHub"
            className="hidden rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground sm:flex"
          >
            <Github className="size-4" />
          </a>

          {/* Undo */}
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={!canUndo}
            onClick={undo}
            title="Undo"
          >
            <Undo2 className="size-4" />
          </Button>

          {/* Redo */}
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={!canRedo}
            onClick={redo}
            title="Redo"
          >
            <Redo2 className="size-4" />
          </Button>

          {/* Theme toggle */}
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={toggle}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>

          {/* Export PDF */}
          <Button
            type="button"
            size="sm"
            disabled={exporting !== null}
            onClick={onExportPdf}
            className="text-xs"
          >
            <Download className="size-3.5" />
            {exporting === 'pdf' ? (
              <span className="inline-flex items-center gap-1">
                <span className="inline-block size-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span className="hidden sm:inline">PDF</span>
              </span>
            ) : (
              <span className="hidden sm:inline">PDF</span>
            )}
          </Button>

          {/* Print */}
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handlePrint}
            title="Print"
            className="hidden sm:inline-flex"
          >
            <Printer className="size-4" />
          </Button>

          {/* Help */}
          <HelpPanel />

          {/* Settings */}
          <SettingsPanel />
        </div>
      </div>
    </motion.header>
  )
}
