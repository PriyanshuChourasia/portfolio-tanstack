import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'
import { AUTHOR_EMAIL, SOCIAL_LINKS } from '@/lib/seo'

const socials = [
  { label: 'GitHub', href: SOCIAL_LINKS.github },
  { label: 'LinkedIn', href: SOCIAL_LINKS.linkedin },
  { label: 'Twitter', href: SOCIAL_LINKS.twitter },
]

export function ContactSection() {
  return (
    <section id="contact" className="mx-auto max-w-5xl px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-sm font-medium uppercase tracking-widest text-neutral-400">
          Contact
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900">
          Let's connect
        </h2>
        <p className="mt-4 max-w-xl text-neutral-500">
          Have a question, an idea, or just want to say hi? My inbox is always
          open.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${AUTHOR_EMAIL}`}
            className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-700"
          >
            <Mail className="h-4 w-4" />
            {AUTHOR_EMAIL}
          </a>
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:text-neutral-900"
            >
              {social.label}
            </a>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
