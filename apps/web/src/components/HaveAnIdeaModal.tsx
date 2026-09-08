import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Loader2, Send } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

type FormState = {
  name: string
  email: string
  idea: string
}

const EMPTY_FORM: FormState = { name: '', email: '', idea: '' }

const fieldClass =
  'w-full border border-[#242424] bg-[#050505] px-3.5 py-2.5 font-mono text-xs text-[#F5F5F5] placeholder:text-[#4A4A4A] outline-none transition-colors duration-200 focus:border-[#EF1D25]'

const labelClass =
  'font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-[#888888]'

export function HaveAnIdeaModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [status, setStatus] = useState<
    'idle' | 'submitting' | 'submitted'
  >('idle')

  const canSubmit =
    form.name.trim().length > 0 &&
    form.email.trim().length > 0 &&
    form.idea.trim().length > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit || status === 'submitting') return

    setStatus('submitting')
    // No backend wired up yet — this just simulates a submit.
    setTimeout(() => setStatus('submitted'), 700)
  }

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next)
    if (!next) {
      // Reset after the close animation finishes.
      setTimeout(() => {
        setForm(EMPTY_FORM)
        setStatus('idle')
      }, 200)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton
        className="border border-[#242424] bg-[#0A0A0A] p-6 text-[#F5F5F5] sm:max-w-md [&_svg]:text-[#888888] [&_svg:hover]:text-[#EF1D25]"
      >
        <AnimatePresence mode="wait">
          {status === 'submitted' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 py-8 text-center"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#EF1D25]/50 bg-[#EF1D25]/10">
                <Check className="h-5 w-5 text-[#EF1D25]" />
              </span>
              <h3 className="text-base font-bold">Got it — thanks!</h3>
              <p className="max-w-xs text-xs leading-relaxed text-[#8A8A8A]">
                I&apos;ll read through your idea and get back to you at{' '}
                <span className="text-[#F5F5F5]">{form.email}</span> soon.
              </p>
              <button
                type="button"
                onClick={() => handleOpenChange(false)}
                className="mt-2 border border-[#242424] px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#888888] transition-colors duration-200 hover:border-[#EF1D25] hover:text-[#EF1D25]"
              >
                Close
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <DialogHeader>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#EF1D25]">
                  Have an idea?
                </span>
                <DialogTitle className="mt-1 text-lg font-bold text-[#F5F5F5]">
                  Tell me what you&apos;re thinking
                </DialogTitle>
                <DialogDescription className="text-xs text-[#8A8A8A]">
                  Drop the details below — project, feature, or just a
                  rough idea. I&apos;ll get back to you.
                </DialogDescription>
              </DialogHeader>

              <form
                onSubmit={handleSubmit}
                className="mt-5 flex flex-col gap-4"
              >
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="idea-name" className={labelClass}>
                    Name
                  </Label>
                  <input
                    id="idea-name"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="Your name"
                    className={fieldClass}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="idea-email" className={labelClass}>
                    Email
                  </Label>
                  <input
                    id="idea-email"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    placeholder="you@example.com"
                    className={fieldClass}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="idea-message" className={labelClass}>
                    Your idea
                  </Label>
                  <textarea
                    id="idea-message"
                    value={form.idea}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, idea: e.target.value }))
                    }
                    placeholder="What do you want to build?"
                    rows={4}
                    className={`${fieldClass} resize-none`}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={!canSubmit || status === 'submitting'}
                  className="mt-1 flex items-center justify-center gap-2 border border-[#EF1D25]/60 bg-[#EF1D25]/10 px-4 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#EF1D25] transition-colors duration-200 hover:bg-[#EF1D25]/20 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {status === 'submitting' ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Sending
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      Send idea
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
