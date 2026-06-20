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

export function Hero() {
  return (
    <section id="home" className="flex items-center min-h-screen pt-14">
      <div className="max-w-5xl mx-auto px-6 w-full py-20 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-12"
        >
          {/* Left: intro + social icons */}
          <div className="space-y-6 max-w-lg">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
              Hi, I&apos;m Priyanshu,
              <br />
              <span className="font-normal text-slate-500 dark:text-slate-400">
                a full-stack developer with a focus on backend systems and design-driven frontends.
              </span>
            </h1>

            <div className="flex items-center gap-5 pt-1">
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
          </div>

          {/* Right: circular profile photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="shrink-0 flex justify-center md:justify-end"
          >
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800">
              <img
                src="/hero-person.png"
                alt="Priyanshu Chourasia"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
