import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { GraduationCap, Rocket } from 'lucide-react'
import { type ReactElement, useRef, useState, type MouseEvent } from 'react'
import { PiFileHtmlFill } from 'react-icons/pi'
import { SiJavascript, SiTypescript, SiCss, SiLangchain, SiKubernetes } from 'react-icons/si'
import { TbBrandReact, TbBrandRedux } from 'react-icons/tb'
import { RiNextjsFill, RiTailwindCssFill, RiCopilotFill } from 'react-icons/ri'
import { FaJava, FaPython, FaPhp, FaServer, FaDocker, FaLaravel } from 'react-icons/fa'
import { FaFlutter } from 'react-icons/fa6'
import { BiLogoSpringBoot } from 'react-icons/bi'
import { SiClaude } from 'react-icons/si'
import { FcLinux } from 'react-icons/fc'

const iconSize = 24

type TechItem = { id: string; label: string; icon: ReactElement; category: string }

const techStack: TechItem[] = [
  { id: 'html', label: 'HTML', icon: <PiFileHtmlFill size={iconSize} />, category: 'Frontend' },
  { id: 'css', label: 'CSS', icon: <SiCss size={iconSize} />, category: 'Frontend' },
  { id: 'javascript', label: 'JavaScript', icon: <SiJavascript size={iconSize} />, category: 'Languages' },
  { id: 'typescript', label: 'TypeScript', icon: <SiTypescript size={iconSize} />, category: 'Languages' },
  { id: 'java', label: 'Java', icon: <FaJava size={iconSize} />, category: 'Languages' },
  { id: 'python', label: 'Python', icon: <FaPython size={iconSize} />, category: 'Languages' },
  { id: 'php', label: 'PHP', icon: <FaPhp size={iconSize} />, category: 'Languages' },
  { id: 'react', label: 'React', icon: <TbBrandReact size={iconSize} />, category: 'Frontend' },
  { id: 'redux', label: 'Redux', icon: <TbBrandRedux size={iconSize} />, category: 'Frontend' },
  { id: 'next', label: 'Next.js', icon: <RiNextjsFill size={iconSize} />, category: 'Frontend' },
  { id: 'tailwind', label: 'Tailwind CSS', icon: <RiTailwindCssFill size={iconSize} />, category: 'Frontend' },
  { id: 'flutter', label: 'Flutter', icon: <FaFlutter size={iconSize} />, category: 'Frontend' },
  { id: 'spring', label: 'Spring Boot', icon: <BiLogoSpringBoot size={iconSize} />, category: 'Backend' },
  { id: 'laravel', label: 'Laravel', icon: <FaLaravel size={iconSize} />, category: 'Backend' },
  { id: 'claude', label: 'Claude AI', icon: <SiClaude size={iconSize} />, category: 'AI/DevOps' },
  { id: 'copilot', label: 'Copilot', icon: <RiCopilotFill size={iconSize} />, category: 'AI/DevOps' },
  { id: 'langchain', label: 'Langchain', icon: <SiLangchain size={iconSize} />, category: 'AI/DevOps' },
  { id: 'server', label: 'Ubuntu Server', icon: <FaServer size={iconSize} />, category: 'AI/DevOps' },
  { id: 'docker', label: 'Docker', icon: <FaDocker size={iconSize} />, category: 'AI/DevOps' },
  { id: 'kubernetes', label: 'Kubernetes', icon: <SiKubernetes size={iconSize} />, category: 'AI/DevOps' },
  { id: 'linux', label: 'Linux', icon: <FcLinux size={iconSize} />, category: 'AI/DevOps' },
]

const CATEGORIES = ['All', 'Languages', 'Frontend', 'Backend', 'AI/DevOps'] as const
type Category = typeof CATEGORIES[number]

/* Single-responsibility: pill is purely presentational */
function CategoryPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
        active
          ? 'bg-cyan-500 border-cyan-500 text-white shadow-lg shadow-cyan-500/30'
          : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-cyan-400 hover:text-cyan-500'
      }`}
    >
      {label}
    </motion.button>
  )
}

/* Single-responsibility: 3D tilt card for one tech item */
function TechCard({ tech }: { tech: TechItem }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), { stiffness: 200, damping: 20 })
  const glowX = useTransform(mouseX, [-0.5, 0.5], ['0%', '100%'])
  const glowY = useTransform(mouseY, [-0.5, 0.5], ['0%', '100%'])

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <div ref={cardRef} style={{ perspective: 600 }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="cursor-pointer">
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative flex flex-col items-center justify-center gap-2 h-24 w-full rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/50 hover:border-cyan-400/50 dark:hover:border-cyan-500/40 transition-colors overflow-hidden"
      >
        {/* Dynamic spotlight glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at ${glowX} ${glowY}, rgba(34,211,238,0.12) 0%, transparent 60%)`,
          }}
        />
        <span className="text-slate-700 dark:text-slate-300 relative z-10">{tech.icon}</span>
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 relative z-10 text-center px-1 leading-tight">{tech.label}</span>
      </motion.div>
    </div>
  )
}

export default function AboutSection() {
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const ref = useRef<HTMLDivElement>(null)

  const filtered = activeCategory === 'All' ? techStack : techStack.filter((t) => t.category === activeCategory)

  return (
    <section
      id="about"
      ref={ref}
      className="relative min-h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 py-24 sm:py-32"
    >
      {/* Subtle background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-400/5 dark:bg-cyan-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-400/5 dark:bg-blue-500/8 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
            Get to Know <span className="text-cyan-500">Me</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            I&apos;m a Full-Stack Developer with a specialization in backend development and
            implementing design-driven frontend solutions.
          </p>
        </motion.div>

        {/* Education + Bootcamp */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-start gap-4 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/30 hover:border-cyan-400/40 transition-colors"
          >
            <div className="shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="grow">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Education</h3>
              <div className="space-y-1">
                <p className="font-semibold text-cyan-500">JIS University</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Aug 2020 – May 2023</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                  Mechanical Engineering degree with focus on software engineering and web technologies.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="flex items-start gap-4 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/30 hover:border-blue-400/40 transition-colors"
          >
            <div className="shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 text-white">
              <Rocket className="w-5 h-5" />
            </div>
            <div className="grow">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Bootcamp</h3>
              <div className="space-y-1">
                <p className="font-semibold text-cyan-500">Software Development</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Feb 2022 – May 2023</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                  Intensive full-stack development with{' '}
                  <span className="font-semibold text-slate-800 dark:text-white">System Design</span> from Wish Institute.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tech Stack heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-8"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            Tech <span className="text-cyan-500">Stack</span>
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Hover each card for a 3D tilt effect</p>
        </motion.div>

        {/* Category filter pills */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {CATEGORIES.map((cat) => (
            <CategoryPill
              key={cat}
              label={cat}
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            />
          ))}
        </motion.div>

        {/* 3D tilt tech cards grid */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4 max-w-6xl mx-auto"
        >
          {filtered.map((tech, index) => (
            <motion.div
              key={tech.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
            >
              <TechCard tech={tech} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
