

import { Link } from '@tanstack/react-router'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Briefcase, FileText, FolderKanban, Home, Mail, BookOpen, Twitter } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa6";

const socialLink = [
  {
    "name": "Github",
    "url": "https://github.com/PriyanshuChourasia",
    "icon": <FaGithub size={22} />
  },
  {
    "name": "LinkedIn",
    "url": "https://www.linkedin.com/in/priyanshu-chourasia-17833120a/",
    "icon": <FaLinkedin size={22} />
  },
  {
    "name": "Twitter",
    "url": "https://x.com/CoderPriye",
    "icon": <Twitter size={22} />
  }
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { label: 'Home', id: 'home', icon: Home },
    { label: 'About', id: 'about', icon: FileText },
    { label: 'Experience', id: 'experience', icon: Briefcase },
    { label: 'My Blog', id: 'articles', icon: BookOpen },
    { label: 'Projects', id: 'projects', icon: FolderKanban },
    { label: 'Contact', id: 'contact', icon: Mail },
  ]

  const techStack = [
    'JavaScript',
    'React',
    'Node.js',
    'PostgreSQL',
  ]

  const { scrollY } = useScroll()
  const yStart = 80
  const yEnd = 900
  const menuYOffset = useTransform(scrollY, [yStart, yEnd], [0, 120])
  const menuOpacity = useTransform(scrollY, [yStart - 40, yStart], [0, 1])

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
          ? 'bg-slate-950/95 backdrop-blur-md border-b border-slate-800 opacity-0 pointer-events-none'
          : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-xl font-bold bg-linear-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent"
              >
                CodyMitra
              </motion.div>
            </Link>

            {/* Nav Items */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  whileHover={{ color: '#06b6d4' }}
                  className="text-sm text-slate-400 hover:text-cyan-500 transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-blue-500 to-cyan-500 group-hover:w-full transition-all duration-300" />
                </motion.a>
              ))}
            </div>

            <div className='flex  items-center gap-4'>
              {
                socialLink.map((link) => (
                  <motion.a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    className="text-slate-400 hover:text-cyan-500 transition-colors"
                  >
                    {link.icon}
                  </motion.a>
                ))
              }
            </div>

            {/* 
            Contact Button
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:block px-6 py-2 rounded-full bg-linear-to-r from-blue-600 to-cyan-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-shadow"
            >
              Get in Touch
            </motion.a> */}

            {/* Mobile Menu Button */}
            <motion.button className="md:hidden p-2">
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className="w-full h-0.5 bg-white" />
                <span className="w-full h-0.5 bg-white" />
                <span className="w-full h-0.5 bg-white" />
              </div>
            </motion.button>
          </div>

          {/* Tech Stack Bar */}
          {scrolled && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center gap-4 overflow-x-auto pb-2"
            >
              {techStack.map((tech) => (
                <motion.span
                  key={tech}
                  whileHover={{ scale: 1.1 }}
                  className="text-xs text-cyan-400 whitespace-nowrap px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20"
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>
          )}
        </div>
      </motion.nav>

      <motion.div
        style={{ y: menuYOffset, opacity: menuOpacity }}
        className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-6 pointer-events-auto"
      >
        {navItems.map((item) => {
          const Icon = item.icon

          return (
            <motion.div
              key={item.id}
              whileHover={{ x: -10, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <motion.a
                href={`#${item.id}`}
                aria-label={item.label}
                title={item.label}
                className="relative flex items-center justify-center w-12 h-12 rounded-full border border-cyan-500/30 bg-slate-900/80 text-cyan-300 hover:text-cyan-400 hover:border-cyan-500/70 shadow-lg shadow-cyan-500/10 transition-all"
              >
                <Icon size={20} strokeWidth={1.75} />
              </motion.a>
            </motion.div>
          )
        })}
      </motion.div>
    </>
  )
}
