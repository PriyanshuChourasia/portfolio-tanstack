import { motion } from 'framer-motion'
import type { ServiceItem, ColorTheme } from '../types'
import { getServiceIcon } from '../utils/icons'

interface ServicesSectionProps {
  services: Array<ServiceItem>
  theme: ColorTheme
}

export function ServicesSection({ services, theme }: ServicesSectionProps) {
  if (services.length === 0) return null

  return (
    <section
      id="services"
      className="relative py-24 sm:py-32"
      style={{ backgroundColor: theme.background, color: theme.text }}
    >
      <div className="mx-auto max-w-6xl px-6">
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
            What I Do
          </p>
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            My Services
          </h2>
          <div
            className="mx-auto mt-4 h-1 w-20 rounded-full"
            style={{ backgroundColor: theme.accent }}
          />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              className="group rounded-xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              style={{
                backgroundColor: theme.surface,
                borderColor: `${theme.textMuted}15`,
              }}
            >
              <div
                className="mb-4 flex size-14 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                style={{
                  backgroundColor: `${theme.accent}15`,
                  color: theme.accent,
                }}
              >
                {getServiceIcon(service.icon)}
              </div>
              <h3 className="mb-2 text-lg font-semibold">{service.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: theme.textMuted }}>
                {service.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
