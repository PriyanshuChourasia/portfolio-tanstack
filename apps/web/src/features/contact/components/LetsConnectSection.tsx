import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Mail, Send } from 'lucide-react'
import { FaLinkedin } from 'react-icons/fa'
import { FaGithub, FaXTwitter } from 'react-icons/fa6'
import { MdEmail } from 'react-icons/md'
import { toast } from 'sonner'
import type { FormEvent, ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import socialLinks from '@/data/social-link.json'
import { cn } from '@/lib/utils'

const EMAIL = 'priyanshuchourasia916@gmail.com'

const MESSAGE =
  "Connections help you grow. Whether it's an idea, a product, or just a conversation about tech — let's connect and build something together."

const TOPICS = ['Project', 'Job opportunity', 'Collaboration', 'Just saying hi']

/* =========================================================
    SOCIAL LINKS — read from the shared data
========================================================= */

// The names in the data don't all match the icons we want
const SOCIAL_ICONS: Record<string, ReactNode> = {
  Github: <FaGithub size={18} />,
  LinkedIn: <FaLinkedin size={18} />,
  Twitter: <FaXTwitter size={18} />,
  Gmail: <MdEmail size={18} />,
}

const SOCIAL_LABELS: Record<string, string> = {
  Github: 'GitHub',
  LinkedIn: 'LinkedIn',
  Twitter: 'X (Twitter)',
  Gmail: 'Email',
}

// Gmail's url is a bare address, so it needs a mailto: prefix
const socials = socialLinks
  .filter((link) => SOCIAL_ICONS[link.name])
  .map((link) => {
    const isWeb = link.url.startsWith('http')

    return {
      key: link.name,
      href: isWeb ? link.url : `mailto:${link.url}`,
      icon: SOCIAL_ICONS[link.name],
      label: SOCIAL_LABELS[link.name] ?? link.name,
      isWeb,
    }
  })

/* =========================================================
    STYLES
========================================================= */

const FIELD =
  'h-11 bg-white/5 border-white/15 text-base text-white placeholder:text-white/30 focus-visible:border-[#C19ADD] focus-visible:ring-[#C19ADD] md:text-sm'

const FIELD_LABEL = 'text-sm font-medium text-white/80'
const ERROR_TEXT = 'text-xs text-[#F2A5C0]'

/* =========================================================
    SECTION
========================================================= */

export default function LetsConnectSection() {
  const reducedMotion = Boolean(useReducedMotion())
  const [topic, setTopic] = useState('')
  // An error only shows once its field has been visited
  const [errors, setErrors] = useState<Record<string, string | null>>({})

  const reveal = (delay = 0) => ({
    initial: reducedMotion ? false : { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.7, ease: 'easeOut' as const, delay },
  })

  // Native validity, resolved into a message on blur
  const check = (
    field: string,
    element: HTMLInputElement | HTMLTextAreaElement | null,
  ) => {
    if (!element) return

    const message = element.validity.valid
      ? null
      : element.validity.typeMismatch
        ? "That doesn't look like an email address."
        : 'This field is required.'

    setErrors((prev) => ({ ...prev, [field]: message }))
  }

  // No backend — hand the message off to the visitor's email app
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget
    const fields = {
      name: form.elements.namedItem('name') as HTMLInputElement | null,
      email: form.elements.namedItem('email') as HTMLInputElement | null,
      message: form.elements.namedItem('message') as
        | HTMLTextAreaElement
        | null,
    }

    Object.entries(fields).forEach(([field, element]) => check(field, element))

    if (!form.checkValidity()) return

    const name = fields.name?.value.trim() ?? ''
    const email = fields.email?.value.trim() ?? ''
    const message = fields.message?.value.trim() ?? ''

    const subject = `${topic || 'Hello'} — from ${name}`
    const body = `${message}\n\n— ${name} (${email})`

    toast('Opening your email app…')

    window.location.href =
      `mailto:${EMAIL}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`
  }

  return (
    <section
      id="contact"
      className="relative w-full scroll-mt-24 overflow-hidden bg-[linear-gradient(145deg,#0B1026_0%,#0A0F1F_45%,#07070D_100%)] pt-14 pb-[max(4rem,env(safe-area-inset-bottom))] md:pt-24 md:pb-28"
    >
      {/* Soft purple glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#C19ADD]/20 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-[#8353AD]/20 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-6 md:px-10 lg:px-12">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
          {/* ===================================================
              LEFT — the message
          =================================================== */}
          <motion.div {...reveal()}>
            <span className="font-mono text-[11px] tracking-[0.25em] text-white/50 uppercase">
              05 / Connect
            </span>

            <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] text-white md:text-5xl lg:text-6xl">
              Let&apos;s{' '}
              <span className="pr-1 text-[#C19ADD] italic">connect</span>
              <span className="text-[#C19ADD]">.</span>
            </h2>

            <p className="mt-6 max-w-md text-lg leading-relaxed text-white/70">
              {MESSAGE}
            </p>

            {/* Direct email */}
            <a
              href={`mailto:${EMAIL}`}
              className="mt-6 inline-flex items-center gap-2.5 text-white transition-colors hover:text-[#C19ADD]"
            >
              <Mail size={18} className="text-[#C19ADD]" aria-hidden="true" />

              {EMAIL}
            </a>

            {/* Socials */}
            <ul className="mt-8 flex flex-wrap gap-3">
              {socials.map((social) => (
                <li key={social.key}>
                  <a
                    href={social.href}
                    aria-label={social.label}
                    {...(social.isWeb
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-[#C19ADD] hover:bg-[#C19ADD] hover:text-[#0B1026]"
                  >
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ===================================================
              RIGHT — the form
          =================================================== */}
          <motion.div {...reveal(0.1)}>
            <form
              onSubmit={onSubmit}
              noValidate
              className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_24px_64px_rgba(0,0,0,0.4)] backdrop-blur-md sm:p-6 md:p-8"
            >
              <h3 className="text-xl font-bold text-white">Send a message</h3>

              <p className="mt-1 text-sm text-white/50">
                I usually reply within a day or two.
              </p>

              <div className="mt-6 space-y-5">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className={FIELD_LABEL}>
                    Name
                  </Label>

                  <Input
                    id="name"
                    name="name"
                    required
                    placeholder="Your name"
                    className={FIELD}
                    aria-invalid={Boolean(errors.name)}
                    onBlur={(event) => check('name', event.target)}
                  />

                  {errors.name && <p className={ERROR_TEXT}>{errors.name}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className={FIELD_LABEL}>
                    Email
                  </Label>

                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className={FIELD}
                    aria-invalid={Boolean(errors.email)}
                    onBlur={(event) => check('email', event.target)}
                  />

                  {errors.email && <p className={ERROR_TEXT}>{errors.email}</p>}
                </div>

                {/* Topic — optional */}
                <div className="space-y-2">
                  <span className={FIELD_LABEL}>What&apos;s it about?</span>

                  <div className="flex flex-wrap gap-2">
                    {TOPICS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        aria-pressed={topic === option}
                        onClick={() => setTopic(topic === option ? '' : option)}
                        className={cn(
                          'flex min-h-11 items-center rounded-full border px-3.5 py-2 text-sm transition-colors',
                          topic === option
                            ? 'border-[#C19ADD] bg-[#C19ADD] text-[#0B1026]'
                            : 'border-white/15 text-white/70 hover:border-[#C19ADD] hover:text-white',
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message" className={FIELD_LABEL}>
                    Message
                  </Label>

                  <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    placeholder="Tell me a little about it…"
                    className={cn(FIELD, 'min-h-28 resize-y text-base md:text-sm')}
                    aria-invalid={Boolean(errors.message)}
                    onBlur={(event) => check('message', event.target)}
                  />

                  {errors.message && (
                    <p className={ERROR_TEXT}>{errors.message}</p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="mt-6 h-12 w-full bg-[#C19ADD] font-semibold text-[#0B1026] hover:bg-[#E9D9F5]"
              >
                <Send size={16} aria-hidden="true" />

                Send message
              </Button>

              <p className="mt-3 text-xs text-white/40">
                Prefer socials? Find me on the left.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
