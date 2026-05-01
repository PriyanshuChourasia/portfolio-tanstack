
import { motion } from 'framer-motion'
import { Mail, Linkedin, Github, Twitter } from 'lucide-react'

export default function ContactSection() {
  const socialLinks = [
    { icon: Mail, label: 'Email', href: 'mailto:priyanshu@gmail.com', color: 'from-red-500 to-pink-500' },
    { icon: Linkedin, label: 'LinkedIn', href: '#', color: 'from-blue-500 to-cyan-500' },
    { icon: Github, label: 'GitHub', href: '#', color: 'from-gray-500 to-slate-600' },
    { icon: Twitter, label: 'Twitter', href: '#', color: 'from-cyan-500 to-blue-500' },
  ]

  return (
    <section
      id="contact"
      className="relative min-h-screen w-full overflow-hidden bg-slate-950 flex items-center justify-center py-32"
    >
      <motion.div
        className="absolute inset-0"
        animate={{ background: ['rgba(0,0,0,0)', 'rgba(59,130,246,0.1)', 'rgba(0,0,0,0)'] }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl opacity-40"
        />
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl opacity-40"
        />
      </motion.div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Feel free to reach out to me if you&apos;re looking for a developer, have a query, or simply want to connect:
          </h2>

          <p className="text-xl text-slate-400 mb-12">
            I&apos;m always interested in hearing about new projects and opportunities.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <motion.a
            href="mailto:priyanshu@gmail.com"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-linear-to-r from-blue-600 to-cyan-600 text-white font-semibold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-shadow"
          >
            <Mail className="w-6 h-6" />
            priyanshu@gmail.com
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex items-center justify-center gap-6 flex-wrap"
        >
          {socialLinks.map((social, index) => {
            const Icon = social.icon
            return (
              <motion.a
                key={index}
                href={social.href}
                whileHover={{ scale: 1.2, y: -5 }}
                whileTap={{ scale: 0.9 }}
                className={`p-3 rounded-full bg-linear-to-br ${social.color} text-white hover:shadow-lg transition-shadow`}
                title={social.label}
              >
                <Icon className="w-6 h-6" />
              </motion.a>
            )
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 pt-8 border-t border-slate-800"
        >
          <p className="text-sm text-slate-500">
            © Priyanshu Chourasia 2025. All rights reserved.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
