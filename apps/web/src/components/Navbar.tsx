import { Link, useRouterState } from '@tanstack/react-router'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import {
  Briefcase,
  FileText,
  FolderKanban,
  Home,
  Mail,
  Menu,
  Newspaper,
  Twitter,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { FaLinkedin } from 'react-icons/fa'
import { FaGithub } from 'react-icons/fa6'
import type { LucideIcon } from 'lucide-react'

const socialLinks = [
  {
    name: 'Github',
    url: 'https://github.com/PriyanshuChourasia',
    icon: <FaGithub size={20} />,
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/priyanshu-chourasia-17833120a/',
    icon: <FaLinkedin size={20} />,
  },
  {
    name: 'Twitter',
    url: 'https://x.com/CoderPriye',
    icon: <Twitter size={20} />,
  },
]

type NavItem = {
  label: string
  id: string
  icon: LucideIcon
  to?: '/projects'
}

const navItems: Array<NavItem> = [
  { label: 'Home', id: 'home', icon: Home },
  { label: 'About', id: 'about', icon: FileText },
  { label: 'Experience', id: 'experience', icon: Briefcase },
  { label: 'Projects', id: 'projects', icon: FolderKanban, to: '/projects' },
  { label: 'Blogs', id: 'articles', icon: Newspaper },
  { label: 'Contact', id: 'contact', icon: Mail },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { location } = useRouterState()
  const isHome = location.pathname === '/'
  const isProjectsActive =
    location.pathname === '/projects' ||
    location.pathname.startsWith('/projects/')
  const navHref = (id: string) => (isHome ? `#${id}` : `/#${id}`)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on nav click
  const handleNavClick = () => setMobileOpen(false)

  const { scrollY } = useScroll()
  const yStart = 80
  const yEnd = 900
  const menuYOffset = useTransform(scrollY, [yStart, yEnd], [0, 120])
  const menuOpacity = useTransform(scrollY, [yStart - 40, yStart], [0, 1])

  return (
    <>
      {/* Desktop top nav */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2.5"
              >
                <img
                  src="/myprofile.jpeg"
                  alt="Priyanshu Chourasia"
                  className="h-9 w-9 rounded-full object-cover border-2 border-cyan-400/60"
                />
                <span className="text-xl font-bold bg-linear-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  CodyMitra
                </span>
              </motion.div>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => {
                const active = item.to === '/projects' && isProjectsActive
                const linkClass = `text-sm transition-colors relative group ${
                  active
                    ? 'text-cyan-500 dark:text-cyan-400'
                    : scrolled
                      ? 'text-slate-700 dark:text-slate-200'
                      : 'text-slate-300'
                }`
                const underline = (
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-linear-to-r from-blue-500 to-cyan-500 transition-all duration-300 ${
                      active ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                )
                return item.to ? (
                  <Link key={item.id} to={item.to} className={linkClass}>
                    {item.label}
                    {underline}
                  </Link>
                ) : (
                  <motion.a
                    key={item.id}
                    href={navHref(item.id)}
                    whileHover={{ color: '#22d3ee' }}
                    className={linkClass}
                  >
                    {item.label}
                    {underline}
                  </motion.a>
                )
              })}
            </div>

            {/* Right side: social + theme toggle + hamburger */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-3">
                {socialLinks.map((link) => (
                  <motion.a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    className={`transition-colors ${
                      scrolled
                        ? 'text-slate-500 dark:text-slate-400 hover:text-cyan-500'
                        : 'text-slate-300 hover:text-cyan-400'
                    }`}
                  >
                    {link.icon}
                  </motion.a>
                ))}
              </div>

              {/* Hamburger — mobile only */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileOpen((o) => !o)}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                aria-label="Toggle mobile menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileOpen ? (
                    <motion.span
                      key="x"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <X size={18} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Menu size={18} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile slide-down menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[4.5rem] left-0 right-0 z-40 md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-xl"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = item.to === '/projects' && isProjectsActive
                const linkClass = `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium ${
                  active
                    ? 'bg-cyan-50 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-cyan-50 dark:hover:bg-slate-800 hover:text-cyan-600 dark:hover:text-cyan-400'
                }`
                return item.to ? (
                  <Link
                    key={item.id}
                    to={item.to}
                    onClick={handleNavClick}
                    className={linkClass}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.id}
                    href={navHref(item.id)}
                    onClick={handleNavClick}
                    className={linkClass}
                  >
                    <Icon size={16} />
                    {item.label}
                  </a>
                )
              })}
              <div className="flex items-center gap-4 px-4 pt-3 mt-1 border-t border-slate-200 dark:border-slate-700">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 dark:text-slate-400 hover:text-cyan-500 transition-colors"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop floating sidebar icon nav (appears after scroll) */}
      <motion.div
        style={{ y: menuYOffset, opacity: menuOpacity }}
        className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-4 pointer-events-auto"
      >
        {navItems.map((item) => {
          const Icon = item.icon
          const active = item.to === '/projects' && isProjectsActive
          const linkClass = `relative flex items-center justify-center w-11 h-11 rounded-full border bg-white/80 dark:bg-slate-900/80 shadow-lg transition-all ${
            active
              ? 'border-cyan-500/70 text-cyan-500 dark:text-cyan-300'
              : 'border-cyan-500/30 text-cyan-600 dark:text-cyan-300 hover:text-cyan-500 hover:border-cyan-500/70'
          }`
          return (
            <motion.div
              key={item.id}
              whileHover={{ x: -8, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              {item.to ? (
                <Link
                  to={item.to}
                  aria-label={item.label}
                  title={item.label}
                  className={linkClass}
                >
                  <Icon size={18} strokeWidth={1.75} />
                </Link>
              ) : (
                <motion.a
                  href={navHref(item.id)}
                  aria-label={item.label}
                  title={item.label}
                  className={linkClass}
                >
                  <Icon size={18} strokeWidth={1.75} />
                </motion.a>
              )}
              {/* Tooltip */}
              <span className="absolute right-14 top-1/2 -translate-y-1/2 px-2 py-1 rounded-md bg-slate-900 dark:bg-slate-700 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {item.label}
              </span>
            </motion.div>
          )
        })}
      </motion.div>
    </>
  )
}
