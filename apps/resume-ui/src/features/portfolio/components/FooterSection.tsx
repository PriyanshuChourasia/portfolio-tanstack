import { motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import type { FooterData, ColorTheme } from '../types'
import { getSocialIcon } from '../utils/icons'

interface FooterSectionProps {
  footer: FooterData
  theme: ColorTheme
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export function FooterSection({ footer, theme }: FooterSectionProps) {
  return (
    <footer
      className="relative"
      style={{ backgroundColor: theme.surface, color: theme.text }}
    >
      {/* Top divider */}
      <div
        className="h-1 w-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)`,
        }}
      />

      <div className="mx-auto max-w-6xl px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-8 text-center"
        >
          {/* Social links */}
          {footer.socialLinks.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3">
              {footer.socialLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-10 items-center justify-center rounded-full transition-all duration-300 hover:-translate-y-1"
                  style={{
                    backgroundColor: `${theme.textMuted}12`,
                    color: theme.textMuted,
                  }}
                  title={link.platform}
                >
                  {getSocialIcon(link.icon)}
                </a>
              ))}
            </div>
          )}

          {/* Copyright */}
          <div className="space-y-2">
            {footer.madeWith && (
              <p className="text-sm" style={{ color: theme.textMuted }}>
                {footer.madeWith}
              </p>
            )}
            {footer.copyright && (
              <p className="text-xs" style={{ color: theme.textMuted }}>
                {footer.copyright}
              </p>
            )}
          </div>

          {/* Scroll to top */}
          <button
            onClick={scrollToTop}
            className="flex size-10 items-center justify-center rounded-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            style={{
              backgroundColor: theme.accent,
              color: '#fff',
            }}
          >
            <ArrowUp className="size-5" />
          </button>
        </motion.div>
      </div>
    </footer>
  )
}
