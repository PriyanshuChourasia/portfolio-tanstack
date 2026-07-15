import { motion } from 'framer-motion'
import type { PortfolioHero, ColorTheme } from '../types'
import { getSocialIcon } from '../utils/icons'

interface HeroSectionProps {
  hero: PortfolioHero
  theme: ColorTheme
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 80, damping: 15 },
  },
}

export function HeroSection({ hero, theme }: HeroSectionProps) {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ backgroundColor: theme.background, color: theme.text }}
    >
      {/* Animated background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -left-40 -top-40 size-[600px] rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: theme.accent }}
        />
        <div
          className="absolute -bottom-40 -right-40 size-[500px] rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: theme.accent }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(${theme.text} 1px, transparent 1px), linear-gradient(90deg, ${theme.text} 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-6 py-20 md:flex-row md:py-0"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Text content */}
        <div className="flex-1 space-y-6 text-center md:text-left">
          <motion.div variants={itemVariants}>
            <p
              className="mb-2 inline-block rounded-full px-4 py-1.5 text-sm font-medium tracking-wide"
              style={{
                backgroundColor: `${theme.accent}20`,
                color: theme.accent,
              }}
            >
              Welcome to my portfolio
            </p>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
          >
            Hi, I'm{' '}
            <span className="text-transparent bg-clip-text" style={{
              backgroundImage: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}cc)`,
            }}>
              {hero.name || 'Your Name'}
            </span>
          </motion.h1>

          <motion.h2
            variants={itemVariants}
            className="text-2xl font-semibold sm:text-3xl"
            style={{ color: theme.textMuted }}
          >
            {hero.title || 'Your Title'}
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mx-auto max-w-lg text-lg md:mx-0"
            style={{ color: theme.textMuted }}
          >
            {hero.tagline || 'Your tagline here'}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-4 md:justify-start"
          >
            {hero.resumeUrl && (
              <a
                href={hero.resumeUrl}
                className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                style={{ backgroundColor: theme.accent }}
              >
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download CV
              </a>
            )}
            {hero.videoUrl && (
              <a
                href={hero.videoUrl}
                className="group inline-flex items-center gap-2 rounded-full border-2 px-6 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  borderColor: theme.textMuted,
                  color: theme.text,
                }}
              >
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
                </svg>
                Watch Video
              </a>
            )}
          </motion.div>

          {/* Social icons */}
          {hero.socialLinks.length > 0 && (
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center gap-3 pt-2 md:justify-start"
            >
              {hero.socialLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-10 items-center justify-center rounded-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  style={{
                    backgroundColor: `${theme.surface}`,
                    color: theme.textMuted,
                    borderColor: `${theme.textMuted}20`,
                  }}
                  title={link.platform}
                >
                  {getSocialIcon(link.icon)}
                </a>
              ))}
            </motion.div>
          )}
        </div>

        {/* Profile image */}
        <motion.div
          variants={itemVariants}
          className="relative shrink-0"
        >
          {/* Decorative elements */}
          <div
            className="absolute -inset-4 rounded-full opacity-20 blur-2xl"
            style={{ backgroundColor: theme.accent }}
          />
          <div className="relative size-72 overflow-hidden rounded-full border-4 sm:size-80"
            style={{
              borderColor: theme.surface,
              boxShadow: `0 0 40px ${theme.accent}30`,
            }}
          >
            {hero.profileImage ? (
              <img
                src={hero.profileImage}
                alt={hero.name}
                className="size-full object-cover"
              />
            ) : (
              <div
                className="flex size-full items-center justify-center text-6xl font-bold"
                style={{ backgroundColor: theme.surface, color: theme.textMuted }}
              >
                ?
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
