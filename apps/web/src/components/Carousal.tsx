import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Plus, Sparkles } from 'lucide-react'
import { useTheme } from 'next-themes'
import worksData from '../data/works-data.json'
import { ThreeScene } from './ThreeScene'

const allWorks = (worksData as { items: Array<any> }).items
const featuredWorks = [...allWorks].reverse().slice(0, 3)

const CornerMark = ({ className }: { className: string }) => (
  <Plus
    className={`absolute h-4 w-4 text-white/40 ${className}`}
    strokeWidth={1.5}
  />
)

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const [featuredIndex, setFeaturedIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setFeaturedIndex((i) => (i + 1) % featuredWorks.length)
    }, 3200)
    return () => clearInterval(id)
  }, [])

  const featuredWork = featuredWorks[featuredIndex]

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end center'],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], [0, 60])
  const textY = useTransform(scrollYProgress, [0, 1], [0, 30])

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative w-full min-h-screen overflow-hidden bg-slate-950"
    >
      {/* Full-bleed background portrait, centered */}
      <motion.div style={{ y: imageY }} className="absolute inset-0">
        <img
          src="/myprofile.jpeg"
          alt="Priyanshu Chourasia"
          className="h-full w-full object-cover object-center"
        />
      </motion.div>

      {/* Particle network accent */}
      <div className="absolute inset-0 opacity-30 mix-blend-screen">
        <ThreeScene isDark={isDark} />
      </div>

      {/* Scrim for legibility — vignette, lighter at center so the photo reads through */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(2,6,23,0.25)_0%,rgba(2,6,23,0.55)_65%,rgba(2,6,23,0.85)_100%)]" />
      <div className="absolute inset-0 bg-linear-to-b from-slate-950/75 via-transparent to-slate-950/80" />

      {/* Decorative rule-of-thirds grid */}
      <div className="hidden sm:block absolute inset-6 lg:inset-10 pointer-events-none">
        <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/10" />
        <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/10" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10" />
        <CornerMark className="-left-2 -top-2" />
        <CornerMark className="-right-2 -top-2" />
        <CornerMark className="-left-2 -bottom-2" />
        <CornerMark className="-right-2 -bottom-2" />
      </div>

      {/* Oversized watermark name, desktop only */}
      <div
        aria-hidden
        className="hidden lg:flex absolute inset-0 items-center justify-center select-none pointer-events-none"
      >
        <span className="text-[11rem] xl:text-[15rem] font-black uppercase tracking-tight text-white/[0.06] leading-none">
          Priyanshu
        </span>
      </div>

      {/* Eyebrow + description */}
      <motion.div
        style={{ y: textY }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 pt-28 px-6 sm:px-10 lg:pt-0 lg:absolute lg:top-32 lg:left-14 lg:max-w-xs"
      >
        <p className="text-cyan-400 text-sm font-semibold tracking-wide uppercase mb-3">
          Welcome to my portfolio
        </p>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          I design and build user-centered digital products that are simple,
          fast, and impactful — end to end.
        </p>

        <div className="mt-6 flex flex-nowrap items-center gap-2 sm:gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 sm:px-6 py-2.5 rounded-full bg-linear-to-r from-blue-600 to-cyan-600 text-white text-xs sm:text-sm font-semibold whitespace-nowrap hover:shadow-xl hover:shadow-cyan-500/30 transition-shadow"
          >
            Download CV
          </motion.button>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 sm:px-6 py-2.5 rounded-full border border-cyan-400/50 text-white text-xs sm:text-sm font-semibold whitespace-nowrap hover:bg-cyan-500/10 hover:border-cyan-400 transition-all"
          >
            Get in Touch
          </motion.a>
        </div>
      </motion.div>

      {/* Floating work-preview card — cycles through featured projects */}
      <motion.a
        href="/projects"
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        whileHover={{ scale: 1.03 }}
        className="hidden lg:block absolute z-20 top-32 right-10 w-44 rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-md shadow-xl overflow-hidden"
      >
        <div className="relative h-24 w-full overflow-hidden bg-slate-800">
          <AnimatePresence mode="wait">
            <motion.img
              key={featuredWork?.title}
              src={featuredWork?.image}
              alt={featuredWork?.title}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-2">
          <Sparkles className="h-3 w-3 text-cyan-400 shrink-0" />
          <AnimatePresence mode="wait">
            <motion.span
              key={featuredWork?.title}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
              className="text-[11px] font-medium text-slate-200 truncate"
            >
              {featuredWork?.title}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="flex items-center justify-center gap-1 pb-2.5">
          {featuredWorks.map((w, i) => (
            <span
              key={w.title}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === featuredIndex ? 'w-3 bg-cyan-400' : 'w-1 bg-white/20'
              }`}
            />
          ))}
        </div>
      </motion.a>

      {/* Floating contact card */}
      <motion.a
        href="#contact"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        whileHover={{ scale: 1.03 }}
        className="hidden lg:flex absolute z-20 bottom-28 right-10 items-center gap-3 rounded-2xl border border-cyan-400/20 bg-slate-900/90 backdrop-blur-md shadow-xl px-4 py-3"
      >
        <img
          src="/myprofile.jpeg"
          alt="Priyanshu Chourasia"
          className="h-10 w-10 rounded-full object-cover border border-cyan-400/30"
        />
        <div className="pr-2">
          <p className="text-[11px] text-cyan-400 font-medium leading-none mb-1">
            Let&apos;s Talk
          </p>
          <p className="text-sm text-white font-semibold leading-none">
            Priyanshu
          </p>
          <p className="text-[10px] text-slate-400 leading-none mt-1">
            Full-Stack Developer
          </p>
        </div>
        <span className="flex items-center justify-center h-7 w-7 rounded-full bg-white/10">
          <ArrowUpRight className="h-3.5 w-3.5 text-white" />
        </span>
      </motion.a>

      {/* Name + year */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative z-20 mt-10 pb-10 px-6 sm:px-10 text-center lg:text-left lg:pb-0 lg:mt-0 lg:absolute lg:bottom-10 lg:left-14 lg:px-0"
      >
        <p className="text-xs text-slate-400 font-medium mb-2">&copy;2026</p>
        <h1 className="text-5xl sm:text-6xl lg:text-8xl xl:text-[8.5rem] font-black uppercase tracking-tight leading-[0.85] text-white">
          Priyanshu
        </h1>
      </motion.div>
    </section>
  )
}
