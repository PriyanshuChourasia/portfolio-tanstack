import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { type MouseEvent, useMemo, useRef, useState } from 'react'
import {
  SiJavascript,
  SiNodedotjs,
  SiReact,
  SiTypescript,
  SiNextdotjs,
  SiTailwindcss,
  SiGithub,
  SiOpenai,
  SiDocker,
} from 'react-icons/si'
import badgesData from '../data/carousel-data.json'

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [hoveredBadgeId, setHoveredBadgeId] = useState<string | null>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end center'],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], [0, 100])
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 0.95])
  const textY = useTransform(scrollYProgress, [0, 1], [0, 50])
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springRotateX = useSpring(rotateX, { stiffness: 160, damping: 18 })
  const springRotateY = useSpring(rotateY, { stiffness: 160, damping: 18 })

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    rotateY.set(((x - centerX) / centerX) * 10)
    rotateX.set(-((y - centerY) / centerY) * 10)
  }

  const handleMouseLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  const badgeDefs = badgesData as Array<any>

  const ICONS: Record<string, any> = {
    javascript: SiJavascript,
    docker: SiDocker,

    openai: SiOpenai,
    github: SiGithub,
    nodedotjs: SiNodedotjs,
    react: SiReact,
    typescript: SiTypescript,
    next: SiNextdotjs,
    tailwind: SiTailwindcss,
  }

  const badges = useMemo(() => {
    return badgeDefs.map((b, index) => ({
      ...b,
      iconComponent: ICONS[(b as any).icon],
      floatX: [
        0,
        (index % 2 === 0 ? 1 : -1) * (9 + (index % 4)),
        0,
        (index % 3 === 0 ? -1 : 1) * (8 + (index % 3)),
        0,
      ],
      floatY: [
        0,
        (index % 2 === 0 ? -1 : 1) * (9 + (index % 3)),
        0,
        (index % 4 === 0 ? 1 : -1) * (8 + (index % 2)),
        0,
      ],
      floatRotate: [0, 4, 0, -4, 0],
      floatDuration: 3 + (index % 4) * 0.4,
      floatDelay: index * 0.15,
      iconClass:
        (b as any).id === 'javascript'
          ? 'text-amber-100'
          : (b as any).id === 'docker'
            ? 'text-sky-100'
            : (b as any).id === 'openai'
              ? 'text-emerald-100'
              : (b as any).id === 'github'
                ? 'text-slate-100'
                : (b as any).id === 'nodedotjs'
                  ? 'text-lime-100'
                  : (b as any).id === 'react'
                    ? 'text-cyan-100'
                    : (b as any).id === 'typescript'
                      ? 'text-blue-100'
                      : (b as any).id === 'next'
                        ? 'text-slate-100'
                        : (b as any).id === 'tailwind'
                          ? 'text-cyan-100'
                          : 'text-fuchsia-100',
      labelClass:
        (b as any).id === 'copilot'
          ? 'text-fuchsia-100'
          : (b as any).id === 'claude'
            ? 'text-violet-100'
            : (b as any).id === 'langgraph'
              ? 'text-amber-100'
              : (b as any).id === 'langscreen'
                ? 'text-sky-100'
                : 'text-white',
    }))
  }, [])

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden bg-slate-950 flex items-center"
    >
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          style={{ y: textY }}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-cyan-500 text-lg mb-4"
          >
            Welcome to my portfolio
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Hi I&apos;m{' '}
              <span className="bg-linear-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                Priyanshu
              </span>
              <br />
              Chourasia
            </h1>

            <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
              A Full-Stack Developer with a specialization in backend
              development and implementing design-driven frontend solutions,
              with a professional end to end development project and a wise use
              of AI tools <span className="font-bold">.</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-full bg-linear-to-r from-blue-600 to-cyan-600 text-white font-semibold hover:shadow-2xl hover:shadow-blue-500/50 transition-shadow"
            >
              Download CV
            </motion.button>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-full border border-cyan-500/50 text-white font-semibold hover:bg-cyan-500/10 hover:border-cyan-400 transition-all"
            >
              Get in Touch
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: imageY, scale: imageScale }}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative flex items-start justify-center h-96 pt-6 md:items-center md:pt-0"
        >
          <div
            style={{ perspective: 1000 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative z-10 h-64 w-64 cursor-pointer bg-transparent sm:h-72 sm:w-72 md:h-80 md:w-80"
          >
            <motion.div
              style={{
                rotateX: springRotateX,
                rotateY: springRotateY,
                transformStyle: 'preserve-3d',
              }}
              className="absolute inset-0 rounded-4xl border border-cyan-400/15 bg-linear-to-br from-cyan-500/10 via-slate-900/40 to-blue-950/25 shadow-none"
            />

            {badges.map((b) => {
              const Component = (b as any).iconComponent
              const isHovered = hoveredBadgeId === b.id
              const hoverBg = (b as any).hoverBg ?? 'rgba(34, 211, 238, 0.2)'
              const hoverBorder = (b as any).hoverBorder ?? '#22d3ee'
              const hoverGlow =
                (b as any).hoverGlow ?? 'rgba(34, 211, 238, 0.45)'
              const hoverIconColor = (b as any).hoverIconColor ?? '#67e8f9'
              return (
                <motion.div
                  key={b.id}
                  style={{
                    left: b.left,
                    top: b.top,
                  }}
                  animate={
                    isHovered
                      ? { scale: 1.1 }
                      : {
                          x: (b as any).floatX,
                          y: (b as any).floatY,
                          rotate: (b as any).floatRotate,
                          scale: [1, 1.02, 1],
                        }
                  }
                  transition={
                    isHovered
                      ? { duration: 0.03, ease: 'linear' }
                      : {
                          duration: (b as any).floatDuration,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: (b as any).floatDelay,
                        }
                  }
                  onHoverStart={() => setHoveredBadgeId(b.id)}
                  onHoverEnd={() => setHoveredBadgeId(null)}
                  className="absolute z-0 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/8 bg-slate-800/85 text-white shadow-lg backdrop-blur sm:h-16 sm:w-16"
                  whileHover={{
                    backgroundColor: hoverBg,
                    borderColor: hoverBorder,
                    boxShadow: `0 0 28px ${hoverGlow}`,
                    scale: 1.08,
                    transition: { duration: 0.04, ease: 'linear' },
                  }}
                >
                  {Component ? (
                    <Component
                      className={`h-7 w-7 ${b.iconClass}`}
                      style={{ color: isHovered ? hoverIconColor : undefined }}
                    />
                  ) : (
                    <span
                      className={`text-xs font-semibold ${b.labelClass}`}
                      style={{ color: isHovered ? hoverIconColor : undefined }}
                    >
                      {(b as any).label}
                    </span>
                  )}
                </motion.div>
              )
            })}

            <div className="relative z-10 h-full w-full">
              <img
                src="/hero-person.png"
                alt="Priyanshu Chourasia"
                className="h-full w-full rounded-2xl object-contain object-center shadow-2xl shadow-cyan-500/30"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
