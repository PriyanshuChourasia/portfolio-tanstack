import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Download, Link as LinkIcon, Share2 } from 'lucide-react'
import { toast } from 'sonner'

const RESUME_PDF_PATH = '/resume.pdf'
const RESUME_FILE_NAME = 'Priyanshu-Chourasia-Resume.pdf'

export function ShareResumeButton() {
  const [menuOpen, setMenuOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return

    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  async function handleShare() {
    const shareUrl = `${window.location.origin}${RESUME_PDF_PATH}`

    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        if ('canShare' in navigator) {
          const response = await fetch(RESUME_PDF_PATH)
          if (response.ok) {
            const blob = await response.blob()
            const file = new File([blob], RESUME_FILE_NAME, {
              type: 'application/pdf',
            })
            if (navigator.canShare({ files: [file] })) {
              await navigator.share({
                title: 'Priyanshu Chourasia — Resume',
                text: 'Check out my resume',
                files: [file],
              })
              return
            }
          }
        }

        await navigator.share({
          title: 'Priyanshu Chourasia — Resume',
          text: 'Check out my resume',
          url: shareUrl,
        })
        return
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        // Web Share failed (e.g. blocked, unsupported file share) — fall back to the menu.
      }
    }

    setMenuOpen((open) => !open)
  }

  async function handleCopyLink() {
    const shareUrl = `${window.location.origin}${RESUME_PDF_PATH}`
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Resume link copied to clipboard')
    } catch {
      toast.error('Could not copy link')
    }
    setMenuOpen(false)
  }

  return (
    <div ref={containerRef} className="relative inline-block">
      <motion.button
        type="button"
        onClick={handleShare}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-linear-to-r from-blue-600 to-cyan-600 text-white text-sm font-semibold hover:shadow-2xl hover:shadow-blue-500/40 transition-shadow"
      >
        <Share2 className="w-4 h-4" />
        Share Resume
      </motion.button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 shadow-xl"
          >
            <a
              href={RESUME_PDF_PATH}
              download={RESUME_FILE_NAME}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-3 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <Download className="w-4 h-4 text-cyan-600 dark:text-cyan-500" />
              Download PDF
            </a>
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex w-full items-center gap-2 px-4 py-3 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors border-t border-slate-100 dark:border-slate-800"
            >
              <LinkIcon className="w-4 h-4 text-cyan-600 dark:text-cyan-500" />
              Copy link
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
