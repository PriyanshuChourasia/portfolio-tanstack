import { motion } from 'framer-motion'
import type { AboutData, ColorTheme } from '../types'

interface AboutSectionProps {
  about: AboutData
  theme: ColorTheme
}

export function AboutSection({ about, theme }: AboutSectionProps) {
  return (
    <section
      id="about"
      className="relative py-24 sm:py-32"
      style={{ backgroundColor: theme.surface, color: theme.text }}
    >
      {/* Grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(${theme.text} 1px, transparent 1px), linear-gradient(90deg, ${theme.text} 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p
            className="mb-3 inline-block rounded-full px-4 py-1.5 text-sm font-medium tracking-wide"
            style={{
              backgroundColor: `${theme.accent}15`,
              color: theme.accent,
            }}
          >
            About Me
          </p>
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            {about.title || 'About Me'}
          </h2>
          <div
            className="mx-auto mt-4 h-1 w-20 rounded-full"
            style={{ backgroundColor: theme.accent }}
          />
        </motion.div>

        <div className="grid items-center gap-12 lg:grid-cols-5 lg:gap-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="relative mx-auto max-w-sm">
              <div
                className="absolute -inset-4 rounded-2xl"
                style={{
                  backgroundColor: `${theme.accent}15`,
                  borderColor: `${theme.accent}30`,
                }}
              />
              <div className="relative overflow-hidden rounded-xl">
                {about.image ? (
                  <img
                    src={about.image}
                    alt={about.title}
                    className="w-full object-cover"
                  />
                ) : (
                  <div
                    className="flex aspect-[3/4] w-full items-center justify-center text-4xl font-bold"
                    style={{ backgroundColor: theme.background, color: theme.textMuted }}
                  >
                    📷
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <p
              className="text-base leading-relaxed sm:text-lg"
              style={{ color: theme.textMuted }}
            >
              {about.description || 'Your about description goes here.'}
            </p>

            {/* Stats */}
            {about.stats.length > 0 && (
              <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {about.stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                    className="rounded-xl p-4 text-center"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: `${theme.textMuted}15`,
                    }}
                  >
                    <p
                      className="text-2xl font-bold sm:text-3xl"
                      style={{ color: theme.accent }}
                    >
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs sm:text-sm" style={{ color: theme.textMuted }}>
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
