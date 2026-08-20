import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
  
  
  
  useRef,
  useState
} from 'react'
import { PiFileHtmlFill } from 'react-icons/pi'
import {
  SiClaude,
  SiCss,
  SiJavascript,
  SiKubernetes,
  SiLangchain, SiTypescript 
} from 'react-icons/si'
import { TbBrandReact, TbBrandRedux } from 'react-icons/tb'
import { RiCopilotFill, RiNextjsFill, RiTailwindCssFill } from 'react-icons/ri'
import {
  FaDocker,
  FaJava,
  FaLaravel,
  FaPhp,
  FaPython,
  FaServer,
} from 'react-icons/fa'
import { FaFlutter } from 'react-icons/fa6'
import { BiLogoSpringBoot } from 'react-icons/bi'
import { FcLinux } from 'react-icons/fc'
import type {CSSProperties, MouseEvent, ReactElement} from 'react';

const iconSize = 24

type TechItem = {
  id: string
  label: string
  icon: ReactElement
  category: string
  color: string
}

const techStack: Array<TechItem> = [
  {
    id: 'html',
    label: 'HTML',
    icon: <PiFileHtmlFill size={iconSize} />,
    category: 'Frontend',
    color: '#E34F26',
  },
  {
    id: 'css',
    label: 'CSS',
    icon: <SiCss size={iconSize} />,
    category: 'Frontend',
    color: '#1572B6',
  },
  {
    id: 'javascript',
    label: 'JavaScript',
    icon: <SiJavascript size={iconSize} />,
    category: 'Languages',
    color: '#F7DF1E',
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    icon: <SiTypescript size={iconSize} />,
    category: 'Languages',
    color: '#3178C6',
  },
  {
    id: 'java',
    label: 'Java',
    icon: <FaJava size={iconSize} />,
    category: 'Languages',
    color: '#ED8B00',
  },
  {
    id: 'python',
    label: 'Python',
    icon: <FaPython size={iconSize} />,
    category: 'Languages',
    color: '#3776AB',
  },
  {
    id: 'php',
    label: 'PHP',
    icon: <FaPhp size={iconSize} />,
    category: 'Languages',
    color: '#777BB4',
  },
  {
    id: 'react',
    label: 'React',
    icon: <TbBrandReact size={iconSize} />,
    category: 'Frontend',
    color: '#61DAFB',
  },
  {
    id: 'redux',
    label: 'Redux',
    icon: <TbBrandRedux size={iconSize} />,
    category: 'Frontend',
    color: '#764ABC',
  },
  {
    id: 'next',
    label: 'Next.js',
    icon: <RiNextjsFill size={iconSize} />,
    category: 'Frontend',
    color: '#38BDF8',
  },
  {
    id: 'tailwind',
    label: 'Tailwind CSS',
    icon: <RiTailwindCssFill size={iconSize} />,
    category: 'Frontend',
    color: '#06B6D4',
  },
  {
    id: 'flutter',
    label: 'Flutter',
    icon: <FaFlutter size={iconSize} />,
    category: 'Frontend',
    color: '#02569B',
  },
  {
    id: 'spring',
    label: 'Spring Boot',
    icon: <BiLogoSpringBoot size={iconSize} />,
    category: 'Backend',
    color: '#6DB33F',
  },
  {
    id: 'laravel',
    label: 'Laravel',
    icon: <FaLaravel size={iconSize} />,
    category: 'Backend',
    color: '#FF2D20',
  },
  {
    id: 'claude',
    label: 'Claude AI',
    icon: <SiClaude size={iconSize} />,
    category: 'AI/DevOps',
    color: '#D97757',
  },
  {
    id: 'copilot',
    label: 'Copilot',
    icon: <RiCopilotFill size={iconSize} />,
    category: 'AI/DevOps',
    color: '#8957E5',
  },
  {
    id: 'langchain',
    label: 'Langchain',
    icon: <SiLangchain size={iconSize} />,
    category: 'AI/DevOps',
    color: '#3FCF8E',
  },
  {
    id: 'server',
    label: 'Ubuntu Server',
    icon: <FaServer size={iconSize} />,
    category: 'AI/DevOps',
    color: '#E95420',
  },
  {
    id: 'docker',
    label: 'Docker',
    icon: <FaDocker size={iconSize} />,
    category: 'AI/DevOps',
    color: '#2496ED',
  },
  {
    id: 'kubernetes',
    label: 'Kubernetes',
    icon: <SiKubernetes size={iconSize} />,
    category: 'AI/DevOps',
    color: '#326CE5',
  },
  {
    id: 'linux',
    label: 'Linux',
    icon: <FcLinux size={iconSize} />,
    category: 'AI/DevOps',
    color: '#F0B000',
  },
]

const CATEGORIES = [
  'All',
  'Languages',
  'Frontend',
  'Backend',
  'AI/DevOps',
] as const
type Category = (typeof CATEGORIES)[number]

/* Single-responsibility: pill is purely presentational */
function CategoryPill({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
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
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), {
    stiffness: 200,
    damping: 20,
  })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), {
    stiffness: 200,
    damping: 20,
  })
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
    <div
      ref={cardRef}
      style={{ perspective: 600, '--tech-accent': tech.color } as CSSProperties}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group cursor-pointer"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        whileHover={{ y: -4, scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative flex flex-col items-center justify-center gap-2 h-24 w-full rounded-xl border border-slate-200 dark:border-slate-700/70 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md shadow-lg hover:border-[var(--tech-accent)] hover:shadow-[0_0_28px_-6px_var(--tech-accent)] transition-colors overflow-hidden"
      >
        {/* Dynamic spotlight glow, tinted per tech */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glowX} ${glowY}, ${tech.color}33 0%, transparent 60%)`,
          }}
        />
        <span
          className="relative z-10 transition-transform duration-300 group-hover:scale-110"
          style={{ color: tech.color }}
        >
          {tech.icon}
        </span>
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 relative z-10 text-center px-1 leading-tight group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
          {tech.label}
        </span>
      </motion.div>
    </div>
  )
}

export default function AboutSection() {
  const [activeCategory, setActiveCategory] = useState<Category>('All')

  const filtered =
    activeCategory === 'All'
      ? techStack
      : techStack.filter((t) => t.category === activeCategory)

  return (
    <section
      id="tech-stack"
      className="relative min-h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 py-24 sm:py-32"
    >
      {/* Tech stack background image */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/techstack.png"
          alt=""
          aria-hidden
          className="h-full w-full object-cover scale-105 opacity-75 dark:opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/65 via-slate-50/20 to-slate-50/65 dark:from-slate-950/70 dark:via-slate-950/30 dark:to-slate-950/70" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-400/5 dark:bg-cyan-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-400/5 dark:bg-blue-500/8 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Tech Stack heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-8"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)] dark:drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
            Tech <span className="text-cyan-500">Stack</span>
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm italic mt-2">
            &quot;An investment in knowledge always pays the best
            interest.&quot;
          </p>
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
