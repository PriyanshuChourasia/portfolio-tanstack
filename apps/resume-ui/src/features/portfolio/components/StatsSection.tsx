import { motion } from 'framer-motion'
import type { StatItem, ColorTheme } from '../types'

interface StatsSectionProps {
  stats: Array<StatItem>
  theme: ColorTheme
}

export function StatsSection({ stats, theme }: StatsSectionProps) {
  if (stats.length === 0) return null

  return (
    <section
      className="relative overflow-hidden py-20 sm:py-24"
      style={{ backgroundColor: theme.background, color: theme.text }}
    >
      {/* Background gradient */}
      <div
        className="pointer-events-none absolute inset-0 opacity-5"
        style={{
          background: `linear-gradient(135deg, ${theme.accent}, transparent 60%)`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
          className="grid grid-cols-2 gap-6 md:grid-cols-4"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.id}
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.5 },
                },
              }}
              className="group relative text-center"
            >
              <div
                className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  backgroundColor: `${theme.accent}08`,
                }}
              />
              <div className="relative p-6">
                <p
                  className="text-4xl font-bold sm:text-5xl"
                  style={{ color: theme.accent }}
                >
                  {stat.value}
                  <span className="text-2xl sm:text-3xl">{stat.suffix}</span>
                </p>
                <p
                  className="mt-2 text-sm font-medium uppercase tracking-wider sm:text-base"
                  style={{ color: theme.textMuted }}
                >
                  {stat.label}
                </p>
              </div>
              <div
                className="mx-auto h-0.5 w-12 rounded-full transition-all duration-300 group-hover:w-20"
                style={{
                  backgroundColor: theme.accent,
                  opacity: 0.5,
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
