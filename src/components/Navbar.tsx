import { Link } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { ThemeToggle } from './ThemeToggle'

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Employment', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Writing', href: '#articles' },
  { label: 'Contact', href: '#contact' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white/90 dark:bg-[#111111]/90 backdrop-blur-sm border-b border-gray-100 dark:border-white/8">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            to="/"
            className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            Priyanshu Chourasia
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
              className="md:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="fixed top-14 left-0 right-0 z-40 md:hidden bg-[#f0fdf4] dark:bg-[#0a0f0d] border-b border-emerald-100 dark:border-[#1a2e22]"
          >
            <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-emerald-700/70 dark:text-emerald-200/50 hover:text-emerald-900 dark:hover:text-emerald-400 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
