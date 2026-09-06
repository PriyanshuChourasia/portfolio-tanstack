import { motion } from 'framer-motion'
import {
  Github,
  Linkedin,
  Mail,
  Phone,
  Twitter,
  ArrowRight,
} from 'lucide-react'

const socialLinks = [
  { icon: Mail, label: 'Email', href: 'mailto:priyanshuchourasia916@gmail.com' },
  { icon: Phone, label: 'Phone', href: 'tel:+916203163193' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/priyanshu-chourasia-17833120a/' },
  { icon: Github, label: 'GitHub', href: 'https://github.com/PriyanshuChourasia' },
  { icon: Twitter, label: 'Twitter', href: 'https://x.com/CoderPriye' },
]

const workProcess = [
  {
    number: '01',
    title: 'Discovery',
    desc: 'Understand the problem, requirements and goals.',
  },
  {
    number: '02',
    title: 'Plan',
    desc: 'Define architecture, scope and timeline.',
  },
  {
    number: '03',
    title: 'Build',
    desc: 'Develop, test and deliver the product.',
  },
]

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="relative min-h-screen w-full overflow-hidden bg-[#050505] py-12 sm:py-16"
    >
      {/* Subtle technical background */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(239,29,37,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(239,29,37,0.12) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-[10px] font-mono uppercase tracking-[0.3em] text-[#EF1D25]">
            Get in Touch adjkadhfjas
          </span>

          <h2 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-[#F5F5F5]">
            Let&apos;s build something{' '}
            <span className="text-[#EF1D25]">great</span>{' '}
            together.
          </h2>

          <p className="mt-4 text-base text-[#8A8A8A] max-w-lg mx-auto">
            Have a project, idea, or question? I&apos;d love to hear what
            you&apos;re working on.
          </p>
        </motion.div>

        {/* Availability pill */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center mb-14"
        >
          <div className="inline-flex items-center gap-3 rounded-lg border border-[#242424] bg-[#0D0D0D] px-5 py-3">
            <span className="flex h-2.5 w-2.5 shrink-0 items-center justify-center rounded-full bg-[#EF1D25]" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#8A8A8A]">
              Available for Freelance Work
            </span>
          </div>
        </motion.div>

        {/* Main content — two columns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14"
        >
          {/* LEFT — Contact */}
          <div className="rounded-xl border border-[#242424] bg-[#0D0D0D] p-6 sm:p-8">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#555555]">
              01 / Contact
            </span>

            <h3 className="mt-3 text-lg font-bold text-[#F5F5F5]">
              Let&apos;s talk
            </h3>

            {/* Email */}
            <div className="mt-6 group">
              <div className="flex items-center justify-between border-b border-[#242424] pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#555555]">
                    Email
                  </span>
                  <Mail className="h-3.5 w-3.5 text-[#555555] group-hover:text-[#EF1D25] transition-colors duration-200" />
                </div>
                <span className="flex items-center gap-1 text-[#8A8A8A] group-hover:text-[#EF1D25] transition-colors duration-200">
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              </div>
              <a
                href="mailto:priyanshuchourasia916@gmail.com"
                className="block mt-1 text-base font-semibold text-[#F5F5F5] group-hover:text-[#EF1D25] transition-colors duration-200"
              >
                priyanshuchourasia916@gmail.com
              </a>
            </div>

            {/* Phone */}
            <div className="mt-5 group">
              <div className="flex items-center justify-between border-b border-[#242424] pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#555555]">
                    Phone
                  </span>
                  <Phone className="h-3.5 w-3.5 text-[#555555] group-hover:text-[#EF1D25] transition-colors duration-200" />
                </div>
                <span className="flex items-center gap-1 text-[#8A8A8A] group-hover:text-[#EF1D25] transition-colors duration-200">
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              </div>
              <a
                href="tel:+916203163193"
                className="block mt-1 text-base font-semibold text-[#F5F5F5] group-hover:text-[#EF1D25] transition-colors duration-200"
              >
                +91 6203163193
              </a>
            </div>
          </div>

          {/* RIGHT — How I Work */}
          <div className="rounded-xl border border-[#242424] bg-[#0D0D0D] p-6 sm:p-8">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#555555]">
              02 / Process
            </span>

            <h3 className="mt-3 text-lg font-bold text-[#F5F5F5]">
              How I work
            </h3>

            <div className="mt-6 space-y-5">
              {workProcess.map((step) => (
                <div
                  key={step.number}
                  className="flex gap-4 group"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#242424] bg-[#050505] text-[10px] font-mono font-semibold text-[#EF1D25] group-hover:border-[#6B1A1A] transition-colors duration-200">
                    {step.number}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#F5F5F5] group-hover:text-[#EF1D25] transition-colors duration-200">
                      {step.title}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-[#8A8A8A]">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-3"
        >              {socialLinks.map((social) => {
          const Icon = social.icon
          return (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              title={social.label}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#242424] bg-[#0D0D0D] text-[#8A8A8A] transition-all duration-200 hover:border-[#EF1D25] hover:text-[#EF1D25]"
            >
              <Icon className="h-4 w-4" />
            </a>
          )
        })}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 pt-8 border-t border-[#242424] flex flex-col sm:flex-row items-center justify-between gap-3 text-center"
        >
          <p className="text-xs text-[#555555]">
            © Priyanshu Chourasia 2026. All rights reserved.
          </p>
          <a
            href="tel:+916203163193"
            className="text-xs font-mono text-[#555555] hover:text-[#EF1D25] transition-colors duration-200"
          >
            +91 6203163193
          </a>
        </motion.div>
      </div>
    </section>
  )
}
