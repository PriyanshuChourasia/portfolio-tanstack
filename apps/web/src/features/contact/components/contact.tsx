import { motion } from 'framer-motion'
import {
  Github,
  Linkedin,
  Mail,
  MessageCircle,
  Phone,
  Rocket,
  Search,
  Twitter,
} from 'lucide-react'

const socialLinks = [
  {
    icon: Mail,
    label: 'Email',
    href: 'mailto:priaynshuchourasia916@gmail.com',
    color: 'from-red-500 to-pink-500',
  },
  {
    icon: Phone,
    label: 'Phone',
    href: 'tel:+916203163193',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/priyanshu-chourasia-17833120a/',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Github,
    label: 'GitHub',
    href: 'https://github.com/PriyanshuChourasia',
    color: 'from-gray-500 to-slate-600',
  },
  {
    icon: Twitter,
    label: 'Twitter',
    href: 'https://x.com/CoderPriye',
    color: 'from-cyan-500 to-blue-500',
  },
]

const workProcess = [
  {
    icon: MessageCircle,
    title: 'Discovery Call',
    desc: 'We talk through your goals, scope, and timeline to see if it’s a good fit.',
  },
  {
    icon: Search,
    title: 'Proposal & Plan',
    desc: 'You get a clear plan — milestones, timeline, and cost — before any work starts.',
  },
  {
    icon: Rocket,
    title: 'Build & Deliver',
    desc: 'Regular updates as I build, with a polished, tested handoff at the end.',
  },
]

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="relative min-h-screen w-full overflow-x-clip bg-white dark:bg-slate-950 flex items-center justify-center py-16"
    >
      {/* Animated background blobs */}
      <motion.div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ x: [0, 80, 0], y: [0, -40, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-200/40 dark:bg-blue-600/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -80, 0], y: [0, 40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-200/40 dark:bg-purple-600/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, 60, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 right-1/3 w-64 h-64 bg-cyan-200/30 dark:bg-cyan-600/10 rounded-full blur-3xl"
        />
      </motion.div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block mb-6 px-4 py-2 rounded-full border border-cyan-400/30 bg-cyan-50 dark:bg-cyan-400/10 text-xs font-semibold uppercase tracking-widest text-cyan-600 dark:text-cyan-300">
            Get in Touch
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight text-slate-900 dark:text-white">
            Feel free to reach out — whether you&apos;re looking for a
            developer, have a query, or simply want to connect.
          </h2>

          <p className="text-base sm:text-lg font-medium text-slate-600 dark:text-slate-300 mb-6">
            I am always open to hearing about new projects and opportunities.
          </p>

          <div className="mb-12 -mx-4 sm:mx-0 flex items-center justify-center gap-2.5 sm:rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 px-6 py-3.5 shadow-lg shadow-emerald-500/25">
            <Rocket className="w-5 h-5 text-white shrink-0" />
            <span className="text-sm sm:text-base font-bold text-white tracking-wide">
              Available for Freelance Work
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 mb-12 text-left"
        >
          {workProcess.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={step.title} className="flex sm:flex-col gap-3">
                <span className="flex items-center justify-center h-10 w-10 shrink-0 rounded-full bg-cyan-50 dark:bg-cyan-400/10 text-cyan-600 dark:text-cyan-300">
                  <Icon className="w-5 h-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-0.5">
                    Step {index + 1}
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                    {step.title}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.a
            href="mailto:priaynshuchourasia916@gmail.com"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex max-w-full items-center gap-2.5 sm:gap-3 rounded-full bg-linear-to-r from-blue-600 to-cyan-600 px-5 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-lg font-semibold text-white hover:shadow-2xl hover:shadow-blue-500/40 transition-shadow"
          >
            <Mail className="w-5 h-5 shrink-0" />
            <span className="break-all">priaynshuchourasia916@gmail.com</span>
          </motion.a>
          <motion.a
            href="tel:+916203163193"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex max-w-full items-center gap-2.5 sm:gap-3 rounded-full bg-linear-to-r from-emerald-600 to-teal-600 px-5 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-lg font-semibold text-white hover:shadow-2xl hover:shadow-emerald-500/40 transition-shadow"
          >
            <Phone className="w-5 h-5 shrink-0" />
            <span>+91 6203163193</span>
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex items-center justify-center gap-4 sm:gap-5 flex-wrap"
        >
          {socialLinks.map((social, index) => {
            const Icon = social.icon
            return (
              <motion.a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, y: -4 }}
                whileTap={{ scale: 0.9 }}
                className={`p-3 rounded-full bg-linear-to-br ${social.color} text-white shadow-lg hover:shadow-xl transition-shadow`}
                title={social.label}
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            )
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4"
        >
          <p className="text-sm text-slate-400 dark:text-slate-500">
            © Priyanshu Chourasia 2025. All rights reserved.
          </p>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">
            •
          </span>
          <a
            href="tel:+916203163193"
            className="text-sm text-slate-400 dark:text-slate-500 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
          >
            +91 6203163193
          </a>
        </motion.div>
      </div>
    </section>
  )
}
