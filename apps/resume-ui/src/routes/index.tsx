import { createFileRoute, Link } from '@tanstack/react-router'
import {
  useState, useEffect, useRef, useCallback, useMemo, type ReactNode, type MouseEvent as ReactMouseEvent,
} from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import {
  FileText, Sparkles, Download, ArrowRight, Layers, Palette, Printer, Moon, Sun,
  Github, Search, Check, ChevronDown, Zap, Shield, Eye, Type, Layout, MousePointer,
  ArrowUpRight, Star, ChevronRight, Menu, X, Globe, ArrowLeftRight, Link2,
  BarChart3, PenTool, Server, Lock, RefreshCw, Settings, Wifi, Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useTheme } from '@/features/resume-builder/components/ThemeProvider'

export const Route = createFileRoute('/')({ component: Home })

/* ─────────────────────────── helpers ─────────────────────────── */

const ease = [0.25, 0.46, 0.45, 0.94] as const

function useMouseParallax(ref: React.RefObject<HTMLElement | null>, strength = 15) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const handle = (e: ReactMouseEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      x.set(((e.clientX - cx) / (rect.width / 2)) * strength)
      y.set(((e.clientY - cy) / (rect.height / 2)) * strength)
    }
    el.addEventListener('mousemove', handle as never)
    return () => el.removeEventListener('mousemove', handle as never)
  }, [ref, strength, x, y])
  return { x: useSpring(x, { stiffness: 150, damping: 20 }), y: useSpring(y, { stiffness: 150, damping: 20 }) }
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

/* ─────────────────────────── Section Reveal ─────────────────────────── */

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { ref, inView } = useInView(0.12)
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease }} className={className}>
      {children}
    </motion.div>
  )
}

/* ─────────────────────────── Floating Nav ─────────────────────────── */

function FloatingNav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, toggle } = useTheme()

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  const links = [
    { label: 'Templates', href: '#templates' },
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
  ]

  const externalLinks = [
    { label: 'Photofolio', to: '/photofolio' as const },
  ]

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2, ease }}
      className="fixed top-4 left-1/2 z-50 -translate-x-1/2"
    >
      <div className={`flex items-center gap-1 rounded-full border px-2 py-1.5 backdrop-blur-xl transition-all duration-300 sm:gap-2 sm:px-3 sm:py-2 ${scrolled ? 'border-border/60 bg-background/80 shadow-lg shadow-black/5 dark:shadow-black/20' : 'border-transparent bg-background/50'}`}>
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 rounded-full px-2.5 py-1.5 transition-colors hover:bg-muted/50">
          <FileText className="size-4 text-foreground" />
          <span className="hidden text-sm font-bold tracking-tight sm:inline">Resume Builder</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-0.5 md:flex">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              {l.label}
            </a>
          ))}
          {externalLinks.map((l) => (
            <Link key={l.label} to={l.to} className="group relative rounded-full px-3 py-1.5 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
              <span className="relative z-10">{l.label}</span>
              <span className="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-500 opacity-60 transition-opacity group-hover:opacity-100 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400" />
            </Link>
          ))}
        </div>

        <div className="h-5 w-px bg-border/60" />

        {/* GitHub */}
        <a href="https://github.com/PriyanshuChourasia/resume-to-portfolio" target="_blank" rel="noreferrer" className="hidden rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground sm:flex" title="GitHub">
          <Github className="size-4" />
        </a>

        {/* Theme toggle */}
        <button type="button" onClick={toggle} className="rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground" title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={theme} initial={{ rotate: -90, opacity: 0, scale: 0.5 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: 90, opacity: 0, scale: 0.5 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="flex">
              {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </motion.span>
          </AnimatePresence>
        </button>

        {/* CTA */}
        <Button asChild size="sm" className="hidden rounded-full text-xs sm:inline-flex">
          <Link to="/resume">Open Builder</Link>
        </Button>

        {/* Mobile menu */}
        <button type="button" onClick={() => setMobileOpen(!mobileOpen)} className="rounded-full p-2 text-muted-foreground md:hidden">
          {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.96 }} transition={{ duration: 0.2 }} className="mx-2 mt-2 overflow-hidden rounded-2xl border bg-background/95 p-2 shadow-xl backdrop-blur-xl">
            {links.map((l) => (
              <a key={l.label} href={l.href} onClick={() => setMobileOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                {l.label}
              </a>
            ))}
            {externalLinks.map((l) => (
              <Link key={l.label} to={l.to} onClick={() => setMobileOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-500/10 hover:text-blue-500 dark:text-blue-400 dark:hover:bg-blue-400/10 dark:hover:text-blue-300">
                {l.label}
              </Link>
            ))}
            <div className="my-1 h-px bg-border/60" />
            <Button asChild className="w-full rounded-xl">
              <Link to="/resume" onClick={() => setMobileOpen(false)}>Open Builder</Link>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

/* ─────────────────────────── Hero ─────────────────────────── */

const HERO_WORDS = ['Resumes', 'CVs', 'Portfolios']

function AnimatedHeadline() {
  const [wordIdx, setWordIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const word = HERO_WORDS[wordIdx]

  useEffect(() => {
    const speed = deleting ? 40 : 80
    const pause = !deleting && charIdx === word.length ? 2000 : 0
    const t = setTimeout(() => {
      if (!deleting && charIdx < word.length) { setCharIdx(charIdx + 1) }
      else if (!deleting && charIdx === word.length) { setDeleting(true) }
      else if (deleting && charIdx > 0) { setCharIdx(charIdx - 1) }
      else if (deleting && charIdx === 0) { setDeleting(false); setWordIdx((wordIdx + 1) % HERO_WORDS.length) }
    }, pause || speed)
    return () => clearTimeout(t)
  }, [charIdx, deleting, wordIdx, word.length])

  return (
    <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
      {word.slice(0, charIdx)}
      <span className="inline-block w-[3px] animate-pulse bg-current align-middle ml-0.5" style={{ height: '1em' }} />
    </span>
  )
}

function ResumeMockup() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { x, y } = useMouseParallax(containerRef, 8)
  const [currentTemplate, setCurrentTemplate] = useState(0)
  const templates = ['Modern', 'Classic', 'Executive', 'Minimal', 'Creative']

  useEffect(() => {
    const t = setInterval(() => setCurrentTemplate((c) => (c + 1) % templates.length), 3000)
    return () => clearInterval(t)
  }, [templates.length])

  return (
    <motion.div
      ref={containerRef}
      style={{ x, y, rotateY: x, rotateX: y }}
      className="relative perspective-[1200px]"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative"
      >
        {/* Glow behind */}
        <div className="absolute -inset-8 rounded-3xl bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-violet-500/20 blur-3xl" />

        {/* Resume card */}
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl shadow-black/10 dark:shadow-black/40">
          {/* Top bar */}
          <div className="flex items-center gap-2 border-b border-border/40 bg-muted/30 px-4 py-2.5">
            <div className="flex gap-1.5">
              <div className="size-2.5 rounded-full bg-red-400/80" />
              <div className="size-2.5 rounded-full bg-yellow-400/80" />
              <div className="size-2.5 rounded-full bg-green-400/80" />
            </div>
            <div className="flex-1" />
            <AnimatePresence mode="wait">
              <motion.span
                key={currentTemplate}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary"
              >
                {templates[currentTemplate]}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Resume content mockup */}
          <div className="w-[280px] p-5 sm:w-[340px] sm:p-6">
            {/* Header */}
            <div className="mb-4 space-y-1">
              <div className="text-sm font-bold text-foreground/90 sm:text-base">Priyanshu Chourasia</div>
              <div className="text-[11px] font-medium text-muted-foreground">Software Developer</div>
              <div className="mt-2 flex gap-3 text-[9px] text-muted-foreground/60">
                <span>Email</span>
                <span>GitHub</span>
                <span>LinkedIn</span>
              </div>
            </div>

            <div className="mb-3 h-px bg-border/60" />

            {/* Summary */}
            <div className="mb-4 space-y-1.5">
              <div className="text-[10px] font-semibold text-primary">Summary</div>
              <p className="text-[9px] leading-relaxed text-muted-foreground/80">
                Full-stack developer collaborating with creative and development teams to design, build, and ship modern web and mobile applications.
              </p>
            </div>

            {/* Experience */}
            <div className="mb-4 space-y-2">
              <div className="text-[10px] font-semibold text-primary">Experience</div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-semibold text-foreground/80">Software Developer</div>
                  <div className="text-[8px] text-muted-foreground/50">2023 - Now</div>
                </div>
                <div className="text-[9px] text-muted-foreground/70">Primesys Technologies</div>
                <p className="mt-1 text-[8px] leading-relaxed text-muted-foreground/60">
                  Collaborate with creative and development teams on the execution of ideas.
                </p>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <div className="h-2.5 w-16 rounded bg-primary/60" />
              <div className="flex flex-wrap gap-1.5">
                {['HTML/CSS', 'TypeScript', 'Spring Boot', 'React', 'MySQL'].map((s) => (
                  <span key={s} className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-medium text-primary">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <motion.div
          animate={{ y: [0, -6, 0], rotate: [0, 3, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute -right-6 -top-4 rounded-xl border border-border/40 bg-card px-3 py-2 shadow-lg"
        >
          <div className="flex items-center gap-1.5">
            <div className="flex size-5 items-center justify-center rounded-md bg-emerald-500/10">
              <Check className="size-3 text-emerald-600" />
            </div>
            <span className="text-[10px] font-semibold text-emerald-600">ATS Pass</span>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, -5, 0], rotate: [0, -2, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -bottom-3 -left-4 rounded-xl border border-border/40 bg-card px-3 py-2 shadow-lg"
        >
          <div className="flex items-center gap-1.5">
            <div className="flex size-5 items-center justify-center rounded-md bg-blue-500/10">
              <Download className="size-3 text-blue-600" />
            </div>
            <span className="text-[10px] font-semibold text-blue-600">PDF Ready</span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-40 sm:pb-28">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-b from-blue-500/[0.06] to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-[400px] w-[600px] rounded-full bg-gradient-to-tr from-indigo-500/[0.04] to-transparent blur-3xl" />
        <div className="absolute right-1/4 top-1/3 h-[300px] w-[400px] rounded-full bg-gradient-to-bl from-violet-500/[0.04] to-transparent blur-3xl" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left */}
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3, ease }}>
              <Badge variant="secondary" className="mb-6 gap-1.5 rounded-full border border-border/50 px-3 py-1 text-xs">
                <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
                Free &middot; No sign-up required
              </Badge>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4, ease }} className="text-3xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl xl:text-[4.25rem]">
              Build{' '}
              <AnimatedHeadline />
              <br />
              That Recruiters{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-400">Love.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.55, ease }} className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Create ATS-optimized, recruiter-ready resumes in minutes. Choose a template, fill in your story, and download as PDF. Completely free.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7, ease }} className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              <div className="w-full sm:w-auto">
                <Button asChild size="lg" className="w-full gap-2 rounded-full px-6 text-sm font-semibold shadow-lg shadow-blue-500/20 sm:w-auto">
                  <Link to="/resume">
                    Start Building Free
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
              <div className="w-full sm:w-auto">
                <Button asChild variant="outline" size="lg" className="w-full gap-2 rounded-full px-6 text-sm font-semibold sm:w-auto">
                  <a href="#templates">
                    View Templates
                    <ChevronDown className="size-4" />
                  </a>
                </Button>
              </div>
            </motion.div>

            {/* Trust badges */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.85, ease }} className="mt-8 flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:gap-6 sm:text-sm">
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />)}
                </div>
                <span className="font-medium">4.9/5</span>
              </div>
              <div className="hidden h-4 w-px bg-border sm:block" />
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-foreground">10,000+</span> Resumes Created
              </div>
              <div className="hidden h-4 w-px bg-border sm:block" />
              <div className="flex items-center gap-1.5">
                <Shield className="size-3.5 text-emerald-500" /> ATS Friendly
              </div>
              <div className="h-4 w-px bg-border hidden sm:block" />
              <div className="hidden items-center gap-1.5 sm:flex">
                <Github className="size-3.5" /> Open Source
              </div>
            </motion.div>
          </div>

          {/* Right - Resume mockup */}
          <motion.div initial={{ opacity: 0, x: 40, rotateY: -5 }} animate={{ opacity: 1, x: 0, rotateY: 0 }} transition={{ duration: 0.8, delay: 0.5, ease }} className="hidden lg:block">
            <ResumeMockup />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────── Trusted By ─────────────────────────── */

const TRUSTED = ['Students', 'Developers', 'Designers', 'Engineers', 'Recruiters', 'Freelancers', 'Teams']

function TrustedBy() {
  return (
    <Reveal className="border-y border-border/40 bg-muted/20 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground/60">Trusted by professionals worldwide</p>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 lg:gap-12">
          {TRUSTED.map((name, i) => (
            <motion.div key={name} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="flex items-center gap-2 text-muted-foreground/40 transition-colors hover:text-muted-foreground/70">
              <div className="size-7 rounded-lg bg-muted-foreground/8 flex items-center justify-center">
                <span className="text-[10px] font-bold">{name[0]}</span>
              </div>
              <span className="text-sm font-medium">{name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </Reveal>
  )
}

/* ─────────────────────────── Template Showcase ─────────────────────────── */

const TEMPLATES = [
  { id: 'classic', name: 'Classic', color: 'from-amber-500 to-orange-600', desc: 'Traditional ATS-friendly serif format', tag: 'ATS Friendly' },
  { id: 'modern', name: 'Modern', color: 'from-sky-500 to-blue-600', desc: 'Clean two-column layout with flowing sections', tag: 'Most Popular' },
  { id: 'premium', name: 'Premium', color: 'from-teal-500 to-cyan-600', desc: 'Deep sidebar with categorized skills', tag: 'Editor Pick' },
  { id: 'bold', name: 'Bold', color: 'from-blue-600 to-indigo-700', desc: 'Blue accent headings with flat skills grid', tag: '' },
  { id: 'elegant', name: 'Elegant', color: 'from-rose-500 to-pink-600', desc: 'Centered serif header with banner sections', tag: '' },
  { id: 'minimal', name: 'Minimal', color: 'from-stone-500 to-gray-600', desc: 'Compact serif with underlined section rules', tag: '' },
  { id: 'creative', name: 'Visual', color: 'from-pink-500 to-fuchsia-600', desc: 'Photo-centric with gradient hero', tag: '' },
  { id: 'developer', name: 'Fresh', color: 'from-emerald-500 to-green-600', desc: 'Mint icon sections with pill badges', tag: '' },
  { id: 'sidebar', name: 'Sidebar', color: 'from-violet-500 to-purple-600', desc: 'Two-column with right sidebar', tag: '' },
  { id: 'navy', name: 'Navy', color: 'from-indigo-800 to-blue-900', desc: 'Navy two-column with icon contact row', tag: '' },
  { id: 'accent', name: 'Accent', color: 'from-violet-600 to-indigo-700', desc: 'Centered header with muted meta text', tag: '' },
  { id: 'simple', name: 'Simple', color: 'from-gray-500 to-slate-600', desc: 'Plain sans-serif with bold headings', tag: '' },
]

/* Simulated resume content for each template preview */
function ResumePreviewMockup({ template }: { template: typeof TEMPLATES[0] }) {
  const accents: Record<string, string> = {
    classic: 'bg-amber-700',
    modern: 'bg-sky-600',
    premium: 'bg-teal-700',
    bold: 'bg-blue-700',
    elegant: 'bg-rose-600',
    minimal: 'bg-stone-600',
    creative: 'bg-pink-600',
    developer: 'bg-emerald-600',
    sidebar: 'bg-violet-600',
    navy: 'bg-indigo-800',
    accent: 'bg-violet-700',
    simple: 'bg-gray-700',
  }
  const accent = accents[template.id] ?? 'bg-slate-700'

  return (
    <div className="h-full w-full bg-white p-4 text-left sm:p-5 dark:bg-card">
      {/* Header */}
      <div className="mb-3">
        <div className="mb-1 text-[11px] font-bold text-slate-800">Priyanshu Chourasia</div>
        <div className="mb-1.5 text-[8px] font-medium text-slate-500">Software Developer</div>
        <div className="flex gap-1.5 text-[6px] text-slate-400">
          <span>Email</span>
          <span>GitHub</span>
          <span>LinkedIn</span>
        </div>
      </div>

      <div className="mb-3 h-px bg-slate-200" />

      {/* Summary */}
      <div className="mb-3">
        <div className={`mb-1 h-2 w-16 rounded-sm ${accent}`} />
        <p className="text-[6px] leading-relaxed text-slate-500">
          Full-stack developer collaborating with creative and development teams to design, build, and ship modern web and mobile applications.
        </p>
      </div>

      {/* Experience */}
      <div className="mb-3">
        <div className={`mb-1.5 h-2 w-20 rounded-sm ${accent}`} />
        <div className="mb-1 flex items-center justify-between">
          <div className="text-[7px] font-semibold text-slate-700">Software Developer</div>
          <div className="text-[6px] text-slate-400">2023 - Now</div>
        </div>
        <div className="mb-1 text-[6px] text-slate-500">Primesys Technologies</div>
        <p className="text-[6px] leading-relaxed text-slate-400">
          Collaborate with creative and development teams on the execution of ideas.
        </p>
      </div>

      {/* Skills */}
      <div>
        <div className={`mb-1.5 h-2 w-12 rounded-sm ${accent}`} />
        <div className="flex flex-wrap gap-1">
          {['HTML/CSS', 'TypeScript', 'Spring Boot', 'React', 'MySQL'].map((s) => (
            <span key={s} className="rounded-sm bg-slate-100 px-1.5 py-0.5 text-[7px] font-medium text-slate-600">{s}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function TemplateShowcase() {
  const [active, setActive] = useState(1) // Modern default

  return (
    <section id="templates" className="py-16 sm:py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4 rounded-full px-3 py-1 text-xs">Templates</Badge>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">Templates That Get You Hired</h2>
          <p className="mt-4 text-lg text-muted-foreground">Choose from 12 recruiter-tested templates. Each one is designed to pass ATS systems and impress hiring managers.</p>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-10">
          {/* Left — template list */}
          <Reveal className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-x-visible lg:pb-0">
            {TEMPLATES.map((t, i) => (
              <motion.button
                key={t.id}
                type="button"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.4, ease }}
                onClick={() => setActive(i)}
                className={`group flex snap-start shrink-0 items-center gap-3 rounded-xl border px-3 py-3 text-left transition-all lg:w-full lg:shrink ${
                  active === i
                    ? 'border-primary/30 bg-primary/5 shadow-sm'
                    : 'border-transparent hover:border-border/60 hover:bg-muted/30'
                }`}
              >
                <div className={`size-8 rounded-lg bg-gradient-to-br ${t.color} shadow-sm`} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{t.name}</span>
                    {t.tag && (
                      <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary">{t.tag}</span>
                    )}
                  </div>
                  <span className="mt-0.5 block text-xs text-muted-foreground/70">{t.desc}</span>
                </div>
                {active === i && (
                  <motion.div layoutId="active-template-check" className="ml-auto hidden size-5 items-center justify-center rounded-full bg-primary sm:flex">
                    <Check className="size-3 text-primary-foreground" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </Reveal>

          {/* Right — large preview in browser frame */}
          <Reveal delay={0.1}>
            <div className="relative">
              {/* Glow */}
              <div className="pointer-events-none absolute -inset-8 rounded-3xl bg-gradient-to-r from-blue-500/[0.04] via-indigo-500/[0.06] to-violet-500/[0.04] blur-3xl" />

              <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl shadow-black/5 dark:shadow-black/30">
                {/* Browser chrome */}
                <div className="flex items-center justify-between border-b border-border/40 bg-muted/20 px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="size-2.5 rounded-full bg-red-400/80" />
                      <div className="size-2.5 rounded-full bg-yellow-400/80" />
                      <div className="size-2.5 rounded-full bg-green-400/80" />
                    </div>
                    <div className="ml-2 hidden min-w-0 items-center gap-1.5 rounded-lg border border-border/40 bg-background/60 px-2.5 py-1 sm:flex">
                      <Lock className="size-3 text-emerald-500" />
                      <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] text-muted-foreground">resumeio.codymitra.com/builder</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="hidden rounded-md bg-muted/40 px-2 py-1 text-[10px] font-medium text-muted-foreground sm:block">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={TEMPLATES[active].id}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.15 }}
                        >
                          {TEMPLATES[active].name}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Content — split: sidebar + preview */}
                <div className="flex min-h-[240px] sm:min-h-[380px] lg:min-h-[440px]">
                  {/* Sidebar mockup */}
                  <div className="hidden w-48 border-r border-border/40 bg-muted/10 p-3 sm:block lg:w-56">
                    <div className="mb-2 h-7 w-full rounded-lg bg-muted/50" />
                    <div className="space-y-1">
                      {['Personal Info', 'Summary', 'Experience', 'Education', 'Skills', 'Projects'].map((s, i) => (
                        <div key={s} className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs ${i === 0 ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground/60'}`}>
                          <div className={`size-1.5 rounded-full ${i === 0 ? 'bg-primary' : 'bg-muted-foreground/20'}`} />
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 dark:from-muted/20 dark:to-muted/30">
                    <motion.div
                      key={TEMPLATES[active].id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, ease }}
                      className="mx-auto max-w-md overflow-hidden rounded-lg border border-border/40 bg-white shadow-lg shadow-black/5 sm:max-w-lg dark:bg-card"
                    >
                      <ResumePreviewMockup template={TEMPLATES[active]} />
                    </motion.div>

                    {/* Use template button */}
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                      className="mt-4 text-center"
                    >
                      <Button asChild size="sm" className="gap-2 rounded-full px-5 text-xs font-semibold shadow-md">
                        <Link to="/resume">
                          Use {TEMPLATES[active].name} Template
                          <ArrowRight className="size-3.5" />
                        </Link>
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────── Feature Grid ─────────────────────────── */

const FEATURES = [
  { icon: Zap, title: 'Lightning Fast', desc: 'Build a resume in under 5 minutes. No loading screens, no waiting. Everything runs in your browser.', color: 'text-amber-500 bg-amber-500/10' },
  { icon: Shield, title: 'ATS Optimized', desc: 'Every template is tested against major ATS systems. Your resume will be parsed correctly, every time.', color: 'text-emerald-500 bg-emerald-500/10' },
  { icon: Eye, title: 'Live Preview', desc: 'See every change instantly. What you type is what you get. No guessing, no refreshing.', color: 'text-blue-500 bg-blue-500/10' },
  { icon: Palette, title: 'Theme Customization', desc: 'Full control over colors, fonts, spacing, and section order. Make it uniquely yours.', color: 'text-violet-500 bg-violet-500/10' },
  { icon: Layers, title: 'Unlimited Resumes', desc: 'Create multiple versions for different job applications. Switch between them instantly.', color: 'text-pink-500 bg-pink-500/10' },
  { icon: Download, title: 'PDF Export', desc: 'One-click PDF download with perfect formatting. No watermarks, no quality loss.', color: 'text-indigo-500 bg-indigo-500/10' },
  { icon: Type, title: 'Typography Control', desc: 'Adjust font sizes, line heights, and spacing. Fine-tune every detail of your resume.', color: 'text-teal-500 bg-teal-500/10' },
  { icon: Layout, title: 'Section Reordering', desc: 'Drag and drop sections to highlight your strongest qualifications first.', color: 'text-orange-500 bg-orange-500/10' },
  { icon: MousePointer, title: 'Auto Save', desc: 'Every edit is saved locally. Close the tab, come back later — your work is still here.', color: 'text-cyan-500 bg-cyan-500/10' },
]

function FeatureCard({ feature, index }: { feature: typeof FEATURES[0]; index: number }) {
  const [hovered, setHovered] = useState(false)
  const Icon = feature.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.5, ease }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative"
    >
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 transition-shadow group-hover:shadow-lg group-hover:shadow-black/5 dark:group-hover:shadow-black/20"
      >
        {/* Hover glow */}
        <div className={`absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-br ${feature.color.replace('text-', 'from-').replace('bg-', 'to-')}/20`} />

        <div className="relative">
          <div className={`mb-4 inline-flex size-10 items-center justify-center rounded-xl ${feature.color}`}>
            <Icon className="size-5" />
          </div>
          <h3 className="text-base font-bold">{feature.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

function FeatureGrid() {
  return (
    <section id="features" className="py-16 sm:py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4 rounded-full px-3 py-1 text-xs">Features</Badge>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">Everything You Need</h2>
          <p className="mt-4 text-lg text-muted-foreground">No bloat. No sign-ups. Just the tools you need to build a resume that works.</p>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => <FeatureCard key={f.title} feature={f} index={i} />)}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────── How It Works ─────────────────────────── */

const STEPS = [
  { num: '01', title: 'Choose Template', desc: 'Pick from 12 recruiter-tested templates designed for different industries and roles.', icon: Layout },
  { num: '02', title: 'Fill Your Story', desc: 'Add your experience, education, skills, and achievements. We help you organize everything.', icon: FileText },
  { num: '03', title: 'Customize', desc: 'Adjust colors, fonts, spacing, and section order. Make it uniquely yours.', icon: Palette },
  { num: '04', title: 'Download PDF', desc: 'Export a print-ready, ATS-friendly PDF in one click. Ready to send.', icon: Download },
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4 rounded-full px-3 py-1 text-xs">How It Works</Badge>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">Four Steps to Your Dream Job</h2>
          <p className="mt-4 text-lg text-muted-foreground">No complexity. Just a clear path from blank page to job-winning resume.</p>
        </Reveal>

        <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Connector line (desktop) */}
          <div className="absolute left-0 right-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block" />

          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <Reveal key={step.num} delay={i * 0.1} className="relative">
                <div className="relative flex flex-col items-center text-center">
                  {/* Number circle */}
                  <div className="relative z-10 mb-6 flex size-14 items-center justify-center rounded-2xl border border-border/60 bg-card shadow-sm">
                    <span className="text-sm font-black text-foreground/70">{step.num}</span>
                  </div>
                  <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-base font-bold">{step.title}</h3>
                  <p className="mt-2 max-w-[240px] text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────── Builder Preview ─────────────────────────── */

function BuilderPreview() {
  const [activeSection, setActiveSection] = useState('Personal Info')
  const sections = ['Personal Info', 'Experience', 'Education', 'Skills', 'Projects']

  return (
    <Reveal className="py-16 sm:py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4 rounded-full px-3 py-1 text-xs">Live Preview</Badge>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">See Every Change, Instantly</h2>
          <p className="mt-4 text-lg text-muted-foreground">No refresh needed. Your resume updates as you type.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl shadow-black/5 dark:shadow-black/30"
        >
          {/* Toolbar */}
          <div className="flex items-center justify-between border-b border-border/40 bg-muted/20 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-foreground/60" />
              <span className="text-xs font-semibold">Resume Builder</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-2.5 rounded-full bg-red-400/80" />
              <div className="size-2.5 rounded-full bg-yellow-400/80" />
              <div className="size-2.5 rounded-full bg-green-400/80" />
            </div>
          </div>

          <div className="flex min-h-[300px] sm:min-h-[400px]">
            {/* Sidebar mockup */}
            <div className="hidden w-64 border-r border-border/40 bg-muted/10 p-4 sm:block">
              <div className="mb-3 h-8 w-full rounded-lg bg-muted/60" />
              <div className="space-y-1">
                {sections.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setActiveSection(s)}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-medium transition-all ${activeSection === s ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
                  >
                    <div className={`size-1.5 rounded-full ${activeSection === s ? 'bg-primary' : 'bg-muted-foreground/20'}`} />
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Form mockup */}
            <div className="flex-1 p-4 sm:p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                >
                  <div className="h-4 w-32 rounded bg-foreground/80" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <div className="h-2 w-12 rounded bg-muted-foreground/30" />
                      <div className="h-9 w-full rounded-lg border border-border/60 bg-muted/20" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-2 w-16 rounded bg-muted-foreground/30" />
                      <div className="h-9 w-full rounded-lg border border-border/60 bg-muted/20" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-2 w-10 rounded bg-muted-foreground/30" />
                    <div className="h-20 w-full rounded-lg border border-border/60 bg-muted/20" />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Preview mockup */}
            <div className="hidden w-[300px] border-l border-border/40 bg-muted/10 p-4 lg:block">
              <div className="rounded-lg border border-border/40 bg-white p-4 shadow-sm dark:bg-card">
                <div className="mb-2 h-4 w-24 rounded bg-slate-800" />
                <div className="mb-1 h-2 w-16 rounded bg-slate-300" />
                <div className="mb-2 h-px bg-slate-200" />
                <div className="mb-2 h-2.5 w-14 rounded bg-slate-700" />
                <div className="space-y-0.5">
                  <div className="h-1.5 w-full rounded bg-slate-200" />
                  <div className="h-1.5 w-4/5 rounded bg-slate-200" />
                  <div className="h-1.5 w-3/4 rounded bg-slate-200" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Reveal>
  )
}

/* ─────────────────────────── ATS Section ─────────────────────────── */

const ATS_CHECKLIST = [
  'Parseable by all major ATS systems',
  'Clean, semantic HTML structure',
  'Standard section headings',
  'Proper date formatting',
  'No text embedded in images',
  'Machine-readable contact info',
]

function ATSSection() {
  return (
    <Reveal className="py-16 sm:py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left - illustration */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 shadow-xl shadow-black/5 sm:p-8 dark:shadow-black/30">
              {/* ATS score ring */}
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
                <div className="relative size-24">
                  <svg viewBox="0 0 100 100" className="size-full -rotate-90">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted/60" />
                    <motion.circle
                      cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round"
                      className="text-emerald-500"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 0.96 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.3, ease }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">96</span>
                    <span className="text-[8px] font-semibold uppercase tracking-wider text-muted-foreground">Score</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold">ATS Compatibility Score</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Your resume passes all major ATS checks</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { label: 'Format', value: '100%', color: 'text-emerald-500' },
                  { label: 'Content', value: '92%', color: 'text-blue-500' },
                  { label: 'Layout', value: '98%', color: 'text-violet-500' },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl border border-border/40 bg-muted/20 p-3 text-center">
                    <span className={`text-lg font-bold ${m.color}`}>{m.value}</span>
                    <span className="mt-0.5 block text-[10px] font-medium text-muted-foreground">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right - text */}
          <div>
            <Badge variant="secondary" className="mb-4 rounded-full px-3 py-1 text-xs">ATS Optimization</Badge>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">Beat the Bots</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              75% of resumes are rejected by ATS before a human ever sees them. Our templates are engineered to pass every system.
            </p>

            <div className="mt-8 space-y-3">
              {ATS_CHECKLIST.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.4, ease }}
                  className="flex items-center gap-3"
                >
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                    <Check className="size-3.5 text-emerald-600" />
                  </div>
                  <span className="text-sm font-medium">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  )
}

/* ─────────────────────────── Testimonials ─────────────────────────── */

const TESTIMONIALS = [
  { name: 'Sarah Chen', role: 'Software Engineer at Google', text: 'Got my current role using a resume I built here in 10 minutes. The ATS scoring gave me confidence before applying.', rating: 5 },
  { name: 'Marcus Johnson', role: 'Product Designer at Stripe', text: 'The templates are genuinely beautiful. I used to spend hours on resume formatting — this tool does it in seconds.', rating: 5 },
  { name: 'Priya Sharma', role: 'Full Stack Developer', text: 'Finally a resume builder that understands what developers need. Clean, fast, and the PDF export is perfect.', rating: 5 },
]

function TestimonialCard({ testimonial, index }: { testimonial: typeof TESTIMONIALS[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5, ease }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 transition-shadow hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20"
    >
      <div className="flex gap-0.5">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">&ldquo;{testimonial.text}&rdquo;</p>
      <div className="mt-5 flex items-center gap-3">
        <div className="size-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <span className="text-xs font-bold">{testimonial.name[0]}</span>
        </div>
        <div>
          <p className="text-sm font-semibold">{testimonial.name}</p>
          <p className="text-xs text-muted-foreground">{testimonial.role}</p>
        </div>
      </div>
    </motion.div>
  )
}

function Testimonials() {
  return (
    <section className="py-16 sm:py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4 rounded-full px-3 py-1 text-xs">Testimonials</Badge>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">Loved by Professionals</h2>
          <p className="mt-4 text-lg text-muted-foreground">Join thousands who've landed interviews with resumes built here.</p>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => <TestimonialCard key={t.name} testimonial={t} index={i} />)}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────── FAQ ─────────────────────────── */

const FAQS = [
  { q: 'Is Resume Builder really free?', a: 'Yes, completely free. No hidden costs, no premium plans, no watermarks on your PDF. We believe everyone deserves access to a professional resume builder.' },
  { q: 'Do I need to create an account?', a: 'No. Everything runs in your browser and saves to your local storage. No accounts, no data sent to any server. Your resume data stays on your device.' },
  { q: 'Will my resume pass ATS systems?', a: 'Yes. All templates are designed with clean, semantic HTML that ATS systems can parse correctly. We also provide an ATS compatibility score so you know your resume is optimized.' },
  { q: 'Can I import an existing resume?', a: 'Yes. You can import PDF resumes — our parser extracts your data and populates the form automatically. You can also export and import your resume as JSON.' },
  { q: 'How many resumes can I create?', a: 'Unlimited. Create as many resumes as you need for different job applications. Each one is saved independently.' },
  { q: 'Does it work offline?', a: 'Yes. Once loaded, the app works entirely offline. Your data never leaves your device.' },
]

function FAQItem({ faq, index }: { faq: typeof FAQS[0]; index: number }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.4, ease }}
      className="border-b border-border/40"
    >
      <button type="button" onClick={() => setOpen(!open)} className="flex w-full items-center justify-between py-4 text-left sm:py-5">
        <span className="text-sm font-semibold pr-4 sm:text-base">{faq.q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="size-5 shrink-0 text-muted-foreground" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function FAQ() {
  return (
    <section className="py-16 sm:py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal className="mb-12 text-center">
          <Badge variant="secondary" className="mb-4 rounded-full px-3 py-1 text-xs">FAQ</Badge>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Frequently Asked Questions</h2>
        </Reveal>
        <div>
          {FAQS.map((faq, i) => <FAQItem key={faq.q} faq={faq} index={i} />)}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────── Resume to Portfolio ─────────────────────────── */

const PORTFOLIO_FEATURES = [
  { icon: ArrowLeftRight, label: 'One-click Resume to Portfolio conversion' },
  { icon: Layout, label: 'Fully responsive portfolio website' },
  { icon: Sparkles, label: 'Modern, recruiter-friendly design' },
  { icon: FileText, label: 'Personal profile and about section' },
  { icon: Link2, label: 'Projects showcase with GitHub & live demo links' },
  { icon: Zap, label: 'Skills and experience timeline' },
  { icon: Globe, label: 'Contact form integration' },
  { icon: Eye, label: 'SEO optimized pages' },
]

const COMING_SOON_FEATURES = [
  { icon: Globe, label: 'Custom domain support' },
  { icon: BarChart3, label: 'Analytics dashboard' },
  { icon: PenTool, label: 'Blog support' },
]

const HOSTING_PERKS = [
  { icon: Server, label: 'Automatic deployment' },
  { icon: Lock, label: 'Secure hosting' },
  { icon: Shield, label: 'SSL certificates' },
  { icon: Wifi, label: 'Fast global delivery' },
  { icon: RefreshCw, label: 'Continuous updates' },
  { icon: Settings, label: 'Zero configuration' },
  { icon: Clock, label: 'Always online' },
]

function ResumeToPortfolio() {
  const [hovered, setHovered] = useState(false)
  const mockupRef = useRef<HTMLDivElement>(null)
  const { x, y } = useMouseParallax(mockupRef, 6)

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 md:py-32">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-500/[0.04] via-indigo-500/[0.06] to-violet-500/[0.04] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left — copy + features */}
          <div>
            <Reveal>
              <div className="mb-6 flex items-center gap-2">
                <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">
                  Coming Soon
                </Badge>
                <Badge variant="outline" className="rounded-full border-indigo-500/30 bg-indigo-500/5 px-3 py-1 text-xs text-indigo-600 dark:text-indigo-400">
                  Resume to Portfolio
                </Badge>
              </div>

              <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Turn Your Resume Into{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
                  Your Personal Website
                </span>
              </h2>

              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                Don't let your resume live only as a PDF. Instantly transform it into a modern,
                responsive portfolio website that showcases your experience, projects, skills,
                and achievements with a professional online presence.
              </p>
            </Reveal>

            {/* Feature checklist */}
            <div className="mt-8 grid gap-2.5 sm:grid-cols-2">
              {PORTFOLIO_FEATURES.map((f, i) => {
                const Icon = f.icon
                return (
                  <motion.div
                    key={f.label}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.4, ease }}
                    className="flex items-center gap-2.5 rounded-xl border border-border/40 bg-card/60 px-3.5 py-2.5 transition-all hover:border-border hover:bg-card hover:shadow-sm"
                  >
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10">
                      <Icon className="size-3.5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className="text-sm font-medium">{f.label}</span>
                  </motion.div>
                )
              })}
            </div>

            {/* Coming soon features */}
            <Reveal delay={0.3}>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/50">Coming Soon:</span>
                {COMING_SOON_FEATURES.map((f) => {
                  const Icon = f.icon
                  return (
                    <span key={f.label} className="inline-flex items-center gap-1 rounded-full border border-dashed border-border/60 bg-muted/30 px-2.5 py-1 text-[11px] font-medium text-muted-foreground/70">
                      <Icon className="size-3" />
                      {f.label}
                    </span>
                  )
                })}
              </div>
            </Reveal>

            {/* CTA buttons */}
            <Reveal delay={0.4}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button size="lg" className="w-full gap-2 rounded-full px-6 text-sm font-semibold shadow-lg shadow-indigo-500/20 sm:w-auto">
                  <span className="inline-block size-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  Notify Me When It&apos;s Available
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full gap-2 rounded-full px-6 text-sm font-semibold sm:w-auto">
                  <Link to="/resume">
                    Continue Building My Resume
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Right — animated browser mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
          >
            <div
              ref={mockupRef}
              style={{ x, y }}
              className="relative"
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                {/* Glow behind */}
                <div className="absolute -inset-10 rounded-3xl bg-gradient-to-r from-blue-500/10 via-indigo-500/15 to-violet-500/10 blur-3xl" />

                {/* Browser chrome */}
                <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl shadow-black/10 dark:shadow-black/40">
                  {/* Browser toolbar */}
                  <div className="flex items-center gap-2 border-b border-border/40 bg-muted/30 px-4 py-2.5">
                    <div className="flex gap-1.5">
                      <div className="size-2.5 rounded-full bg-red-400/80" />
                      <div className="size-2.5 rounded-full bg-yellow-400/80" />
                      <div className="size-2.5 rounded-full bg-green-400/80" />
                    </div>
                    <div className="flex flex-1 items-center gap-1.5 rounded-lg border border-border/40 bg-background/60 px-2.5 py-1">
                      <Globe className="size-3 text-muted-foreground/40" />
                      <span className="text-[10px] text-muted-foreground/50">priyanshu.dev</span>
                    </div>
                  </div>

                  {/* Content area */}
                  <div className="relative min-h-[320px] bg-gradient-to-br from-background via-background to-muted/20 p-5 sm:p-6">
                    {/* Step 1: Resume card → morphing arrow → Step 2: Portfolio */}
                    <div className="flex items-center justify-center gap-4">
                      {/* Resume side */}
                      <motion.div
                        animate={{ rotate: [-1, 1, -1] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        className="relative w-[130px] rounded-xl border border-border/60 bg-card p-3 shadow-lg sm:w-[150px] sm:p-4"
                      >
                        <div className="mb-1.5 h-3 w-14 rounded bg-foreground/80" />
                        <div className="mb-1 h-1.5 w-10 rounded bg-muted-foreground/25" />
                        <div className="mb-2 h-px bg-border/60" />
                        <div className="mb-1 h-2 w-12 rounded bg-primary/50" />
                        <div className="space-y-0.5">
                          <div className="h-1 w-full rounded bg-muted-foreground/15" />
                          <div className="h-1 w-4/5 rounded bg-muted-foreground/15" />
                          <div className="h-1 w-3/4 rounded bg-muted-foreground/15" />
                        </div>
                        <div className="mt-2 h-2 w-10 rounded bg-primary/50" />
                        <div className="mt-1 flex gap-1">
                          <span className="rounded bg-primary/10 px-1 py-px text-[6px] font-medium text-primary">React</span>
                          <span className="rounded bg-primary/10 px-1 py-px text-[6px] font-medium text-primary">TS</span>
                          <span className="rounded bg-primary/10 px-1 py-px text-[6px] font-medium text-primary">Node</span>
                        </div>
                        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-muted px-2 py-0.5 text-[7px] font-semibold text-muted-foreground">
                          PDF Resume
                        </span>
                      </motion.div>

                      {/* Morphing arrow */}
                      <div className="relative flex flex-col items-center gap-1">
                        <motion.div
                          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                          className="flex size-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20"
                        >
                          <ArrowRight className="size-5 text-indigo-500 dark:text-indigo-400" />
                        </motion.div>
                        <motion.div
                          animate={{ opacity: [0.3, 0.8, 0.3] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="h-8 w-px bg-gradient-to-b from-indigo-500/50 to-transparent"
                        />
                        <span className="text-[8px] font-bold uppercase tracking-wider text-indigo-500/60 dark:text-indigo-400/60">Convert</span>
                      </div>

                      {/* Portfolio side */}
                      <motion.div
                        animate={{ rotate: [1, -1, 1] }}
                        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                        className="relative w-[150px] rounded-xl border border-border/60 bg-card shadow-lg sm:w-[180px]"
                      >
                        {/* Mini browser chrome */}
                        <div className="flex items-center gap-1 border-b border-border/40 bg-muted/20 px-2 py-1.5">
                          <div className="flex gap-0.5">
                            <div className="size-1 rounded-full bg-red-400/60" />
                            <div className="size-1 rounded-full bg-yellow-400/60" />
                            <div className="size-1 rounded-full bg-green-400/60" />
                          </div>
                          <div className="flex-1 rounded bg-background/40 px-1.5 py-0.5">
                            <span className="text-[6px] text-muted-foreground/40">priyanshu.dev</span>
                          </div>
                        </div>
                        {/* Hero */}
                        <div className="bg-gradient-to-br from-indigo-500/10 via-blue-500/10 to-violet-500/10 p-3">
                          <div className="mx-auto mb-1 size-6 rounded-full bg-gradient-to-br from-indigo-400 to-blue-500" />
                          <div className="mx-auto h-2 w-16 rounded bg-foreground/70" />
                          <div className="mx-auto mt-0.5 h-1.5 w-20 rounded bg-muted-foreground/30" />
                        </div>
                        <div className="p-2.5">
                          <div className="mb-1.5 h-2 w-10 rounded bg-primary/50" />
                          <div className="grid grid-cols-2 gap-1">
                            {[1, 2, 3, 4].map((n) => (
                              <div key={n} className="h-6 rounded bg-muted/50" />
                            ))}
                          </div>
                          <div className="mt-1.5 h-2 w-12 rounded bg-primary/50" />
                          <div className="mt-1 flex gap-1">
                            <span className="h-1.5 w-6 rounded-full bg-emerald-500/30" />
                            <span className="h-1.5 w-6 rounded-full bg-blue-500/30" />
                            <span className="h-1.5 w-6 rounded-full bg-violet-500/30" />
                          </div>
                        </div>
                        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-indigo-500 px-2 py-0.5 text-[7px] font-bold text-white">
                          Live Website
                        </span>
                      </motion.div>
                    </div>

                    {/* Hosting callout */}
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="mt-6 rounded-xl border border-indigo-500/20 bg-gradient-to-r from-indigo-500/5 to-blue-500/5 p-3"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="flex size-5 items-center justify-center rounded-md bg-indigo-500/10">
                          <Server className="size-3 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">Hosted & Managed by CodyMitra</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
                        {HOSTING_PERKS.slice(0, 4).map((p) => (
                          <span key={p.label} className="flex items-center gap-0.5 text-[8px] text-muted-foreground/60 sm:text-[7px]">
                            <Check className="size-2 text-emerald-500" />
                            {p.label}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────── Final CTA ─────────────────────────── */

function FinalCTA() {
  return (
    <section className="py-16 sm:py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-center sm:p-12 lg:p-16">
            {/* Glow effects */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-20 -top-20 h-[300px] w-[300px] rounded-full bg-blue-500/20 blur-3xl" />
              <div className="absolute -bottom-20 -right-20 h-[300px] w-[300px] rounded-full bg-indigo-500/20 blur-3xl" />
            </div>

            <div className="relative">
              <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                Ready to Build Your<br />Dream Resume?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-base text-slate-300/80">
                Join 10,000+ professionals who built resumes that got them interviews. Start for free — no account needed.
              </p>
              <Button asChild size="lg" className="mt-8 w-full gap-2 rounded-full bg-white px-8 text-sm font-semibold text-slate-900 shadow-xl shadow-black/20 hover:bg-slate-100 sm:w-auto">
                <Link to="/resume">
                  Start Building Free
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ─────────────────────────── Footer ─────────────────────────── */

function Footer() {
  return (
    <footer className="border-t border-border/40 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <FileText className="size-4 text-foreground/60" />
            <span className="text-sm font-semibold">Resume Builder</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <a href="https://github.com/PriyanshuChourasia/resume-to-portfolio" target="_blank" rel="noreferrer" className="transition-colors hover:text-foreground">GitHub</a>
            <a href="#" className="transition-colors hover:text-foreground">License</a>
            <a href="#" className="transition-colors hover:text-foreground">Contact</a>
          </div>
          <p className="text-xs text-muted-foreground/50">v1.0 &middot; Built with React & Framer Motion</p>
        </div>
      </div>
    </footer>
  )
}

/* ─────────────────────────── Page ─────────────────────────── */

function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <FloatingNav />
      <Hero />
      <TrustedBy />
      <TemplateShowcase />
      <FeatureGrid />
      <HowItWorks />
      <BuilderPreview />
      <ATSSection />
      <ResumeToPortfolio />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  )
}
