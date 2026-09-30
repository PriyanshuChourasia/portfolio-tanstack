import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  Code2,
  Cog,
  Smartphone,
  Sparkles,
  Terminal,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const tags = [
  { label: 'Software Engineer', icon: Code2 },
  { label: 'Mobile Application', icon: Smartphone },
  { label: 'Gen AI Solution', icon: Sparkles },
  { label: 'Mechanical → Software', icon: Cog, highlight: true },
]

export default function GetToKnowMe() {
  const prefersReducedMotion = useReducedMotion()
  return (
    <section
      id="about"
      className="grid min-h-screen w-full grid-cols-1 overflow-x-clip lg:grid-cols-[40%_60%]"
    >
      {/* =========================================================
          LEFT — PROFILE IMAGE
      ========================================================= */}
      <div className="flex min-h-screen items-center justify-center bg-white px-6 py-12 md:px-8 lg:px-10 xl:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_12px_35px_rgba(0,0,0,0.08)]"
        >
          {/* Soft glow behind the figure */}
          <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-[#C19ADD]/30 blur-3xl" />

          <img
            src="/priyanshuimage.png"
            alt="Priyanshu Chourasia"
            className="relative mx-auto h-[70vh] max-h-[640px] w-auto object-contain px-6 pt-8"
          />
        </motion.div>
      </div>

      {/* =========================================================
          RIGHT — GET TO KNOW ME
      ========================================================= */}
      <div className="min-h-screen bg-white text-gray-900">
        {/* =====================================================
            CONTENT WRAPPER
        ===================================================== */}
        <div className="flex min-h-screen flex-col justify-center">
          {/* ===================================================
              TOP HEADER
          =================================================== */}
          <header className="px-6 py-10 md:px-10 md:py-12 lg:px-12">
            {/* Small label */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-6 flex items-center gap-3"
            >
              <Terminal size={18} className="text-gray-900" />

              <span className="font-mono text-sm uppercase tracking-[0.25em] text-gray-700 md:text-base">
                Get to know me
              </span>

              <span className="ml-auto font-mono text-xs text-gray-500">
                DEV / 001
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: 0.1,
              }}
              className="text-4xl font-black leading-[1.05] tracking-[-0.04em] text-gray-900 md:text-5xl lg:text-6xl"
            >
              Priyanshu Chourasia
              <span className="text-gray-900">.</span>
            </motion.h1>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: 0.3,
              }}
              className="mt-5 flex flex-wrap items-center gap-2.5"
            >
              {tags.map((tag, i) => {
                const Icon = tag.icon

                const [before, after] = tag.label.split('\u2192')

                return (
                  <motion.span
                    key={tag.label}
                    initial={
                      prefersReducedMotion
                        ? false
                        : { opacity: 0, y: 10 }
                    }
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: 0.3 + i * 0.08,
                    }}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-700 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-colors',
                      'hover:border-[#C19ADD] hover:bg-[#C19ADD]/10',
                      tag.highlight &&
                        'border-[#C19ADD]/60 bg-[#C19ADD]/10 text-[#441573]',
                    )}
                  >
                    <Icon size={14} className="text-[#8353AD]" />

                    {before}

                    {after && (
                      <>
                        <ArrowRight
                          size={12}
                          className="shrink-0 text-[#8353AD]"
                          aria-hidden
                        />

                        {after.trim()}
                      </>
                    )}
                  </motion.span>
                )
              })}
            </motion.div>
          </header>

          {/* ===================================================
              ABOUT PARAGRAPH
          =================================================== */}
          <motion.div
            id="experience"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="scroll-mt-24 border-t border-gray-200 px-6 py-10 md:px-10 md:py-12 lg:px-12"
          >
            {/* Small label */}
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-gray-500">
              01 / About
            </span>

            {/* Paragraph */}
            <div className="mt-8 max-w-2xl space-y-5 text-lg leading-relaxed text-gray-700 md:text-xl">
              <p>
                I've spent{' '}
                <span className="font-semibold text-gray-900">3+ years</span>{' '}
                developing and maintaining software and servers across mobile
                and web.
              </p>

              <p>
                I'm learning AI and keeping pace with the shift in tech, without
                losing sight of the software engineering fundamentals underneath
                it all. I want to be a{' '}
                <span className="font-semibold text-gray-900">
                  problem solver
                </span>
                , not just an assembler of tools.
              </p>

              <p>
                I love building products, and{' '}
                <span className="font-semibold text-gray-900">
                  shipping them
                </span>{' '}
                as soon as they're ready.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
