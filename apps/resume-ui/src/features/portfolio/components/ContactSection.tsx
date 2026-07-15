import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import type { ContactInfo, ColorTheme } from '../types'

interface ContactSectionProps {
  contact: ContactInfo
  theme: ColorTheme
}

export function ContactSection({ contact, theme }: ContactSectionProps) {
  return (
    <section
      id="contact"
      className="relative overflow-hidden py-24 sm:py-32"
      style={{ backgroundColor: theme.background, color: theme.text }}
    >
      {/* Background blobs */}
      <div
        className="pointer-events-none absolute -left-40 top-1/2 size-[400px] -translate-y-1/2 rounded-full opacity-5 blur-3xl"
        style={{ backgroundColor: theme.accent }}
      />
      <div
        className="pointer-events-none absolute -right-40 top-1/2 size-[400px] -translate-y-1/2 rounded-full opacity-5 blur-3xl"
        style={{ backgroundColor: theme.accent }}
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
            Get In Touch
          </p>
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Let's Work Together
          </h2>
          <div
            className="mx-auto mt-4 h-1 w-20 rounded-full"
            style={{ backgroundColor: theme.accent }}
          />
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <form
              onSubmit={(e) => e.preventDefault()}
              className="space-y-5 rounded-2xl p-8"
              style={{
                backgroundColor: theme.surface,
                borderColor: `${theme.textMuted}15`,
              }}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider" style={{ color: theme.textMuted }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: `${theme.textMuted}20`,
                      color: theme.text,
                    }}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider" style={{ color: theme.textMuted }}>
                    Your Email
                  </label>
                  <input
                    type="email"
                    placeholder="hello@example.com"
                    className="w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: `${theme.textMuted}20`,
                      color: theme.text,
                    }}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider" style={{ color: theme.textMuted }}>
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="Project Collaboration"
                  className="w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: theme.background,
                    borderColor: `${theme.textMuted}20`,
                    color: theme.text,
                  }}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider" style={{ color: theme.textMuted }}>
                  Message
                </label>
                <textarea
                  rows={5}
                  placeholder="Tell me about your project..."
                  className="w-full resize-none rounded-xl border px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: theme.background,
                    borderColor: `${theme.textMuted}20`,
                    color: theme.text,
                  }}
                />
              </div>
              <button
                type="submit"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl"
                style={{ backgroundColor: theme.accent }}
              >
                <Send className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                Send Message
              </button>
            </form>
          </motion.div>

          {/* Contact info & newsletter */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center gap-8"
          >
            {/* Contact details */}
            <div className="space-y-5">
              <h3 className="text-xl font-semibold">Contact Details</h3>
              <div className="space-y-4">
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-4 transition-all duration-200 hover:-translate-y-0.5"
                    style={{ color: theme.textMuted }}
                  >
                    <div
                      className="flex size-12 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${theme.accent}15` }}
                    >
                      <Mail className="size-5" style={{ color: theme.accent }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: theme.text }}>Email</p>
                      <p className="text-sm">{contact.email}</p>
                    </div>
                  </a>
                )}
                {contact.phone && (
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center gap-4 transition-all duration-200 hover:-translate-y-0.5"
                    style={{ color: theme.textMuted }}
                  >
                    <div
                      className="flex size-12 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${theme.accent}15` }}
                    >
                      <Phone className="size-5" style={{ color: theme.accent }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: theme.text }}>Phone</p>
                      <p className="text-sm">{contact.phone}</p>
                    </div>
                  </a>
                )}
                {contact.address && (
                  <div className="flex items-center gap-4" style={{ color: theme.textMuted }}>
                    <div
                      className="flex size-12 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${theme.accent}15` }}
                    >
                      <MapPin className="size-5" style={{ color: theme.accent }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: theme.text }}>Location</p>
                      <p className="text-sm">{contact.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Newsletter */}
            {contact.newsletterTitle && (
              <div
                className="rounded-2xl p-6"
                style={{ backgroundColor: theme.surface }}
              >
                <h4 className="mb-2 text-lg font-semibold">{contact.newsletterTitle}</h4>
                <p className="mb-4 text-sm" style={{ color: theme.textMuted }}>
                  {contact.newsletterDescription}
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="flex-1 rounded-xl border px-4 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: `${theme.textMuted}20`,
                      color: theme.text,
                    }}
                  />
                  <button
                    type="button"
                    className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg"
                    style={{ backgroundColor: theme.accent }}
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
