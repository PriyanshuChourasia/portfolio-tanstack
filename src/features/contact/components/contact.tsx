import { motion } from 'framer-motion'
import { Mail, Twitter } from 'lucide-react'
import { FaGithub } from 'react-icons/fa6'
import { FaLinkedin } from 'react-icons/fa'

const socialLinks = [
  { label: 'Email', href: 'mailto:priaynshuchourasia916@gmail.com', icon: Mail },
  { label: 'GitHub', href: 'https://github.com/PriyanshuChourasia', icon: FaGithub },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/priyanshu-chourasia-17833120a/', icon: FaLinkedin },
  { label: 'Twitter', href: 'https://x.com/CoderPriye', icon: Twitter },
]

export default function ContactSection() {
  return (
    <section id="contact" className="py-20">
      <div className="max-w-2xl mx-auto px-6">
        <hr className="border-slate-200 dark:border-slate-800 mb-12" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
              Get in touch
            </p>
            <a
              href="mailto:priaynshuchourasia916@gmail.com"
              className="text-xl font-semibold text-slate-900 dark:text-white hover:text-slate-500 dark:hover:text-slate-400 transition-colors"
            >
              priaynshuchourasia916@gmail.com
            </a>
          </div>

          <div className="flex items-center gap-5">
            {socialLinks.map((link) => {
              const Icon = link.icon
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <Icon size={20} />
                </a>
              )
            })}
          </div>

          <div className="flex items-center justify-between pt-8 border-t border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-400 dark:text-slate-500">
              © Priyanshu Chourasia 2025
            </p>
            <a
              href="#home"
              className="text-sm text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Back to Top ↑
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
