import { motion } from 'framer-motion'
import type { SkillItem, ColorTheme } from '../types'

interface SkillsSectionProps {
  skills: Array<SkillItem>
  theme: ColorTheme
}

export function SkillsSection({ skills, theme }: SkillsSectionProps) {
  if (skills.length === 0) return null

  return (
    <section
      id="skills"
      className="relative py-24 sm:py-32"
      style={{ backgroundColor: theme.surface, color: theme.text }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, ${theme.text} 1px, transparent 0)`,
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6">
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
            My Skills
          </p>
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Professional Skills
          </h2>
          <div
            className="mx-auto mt-4 h-1 w-20 rounded-full"
            style={{ backgroundColor: theme.accent }}
          />
        </motion.div>

        <div className="grid gap-x-12 gap-y-8 sm:grid-cols-2">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">{skill.name}</span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: theme.accent }}
                >
                  {skill.percentage}%
                </span>
              </div>
              <div
                className="h-2.5 overflow-hidden rounded-full"
                style={{ backgroundColor: `${theme.textMuted}20` }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: theme.accent }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.percentage}%` }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 1.2,
                    delay: 0.2 + i * 0.1,
                    ease: 'easeOut',
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
