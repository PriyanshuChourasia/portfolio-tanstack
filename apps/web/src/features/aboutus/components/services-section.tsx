import { motion } from 'framer-motion'
import {
  ArrowRight,
  BrainCircuit,
  Cloud,
  Database,
  IndianRupee,
  Layers,
  Monitor,
  MoveUpRight,
  Server,
} from 'lucide-react'
import { FaAws } from 'react-icons/fa6'
import { FaDocker, FaPython } from 'react-icons/fa'
import { PiFileHtmlFill } from 'react-icons/pi'
import { RiNextjsFill, RiTailwindCssFill } from 'react-icons/ri'
import {
  SiCss,
  SiExpress,
  SiFastapi,
  SiGithubactions,
  SiGo,
  SiKubernetes,
  SiLangchain,
  SiLinux,
  SiMongodb,
  SiNodedotjs,
  SiOpenai,
  SiPostgresql,
  SiTerraform,
  SiTypescript,
} from 'react-icons/si'
import { TbBrandReact } from 'react-icons/tb'

type TechIcon = React.ElementType

type Technology = {
  label: string
  icon: TechIcon
}

type Service = {
  number: string
  title: string
  description: string
  icon: TechIcon
  technologies: Array<Technology>
  demo: { title: string; description: string; tag: string }
  rate: string
  featured?: boolean
}

const services: Array<Service> = [
  {
    number: '01',
    title: 'Frontend Development',
    description:
      'Modern, responsive, and high-performance interfaces that provide exceptional user experiences.',
    icon: Monitor,
    technologies: [
      { label: 'React', icon: TbBrandReact },
      { label: 'Next.js', icon: RiNextjsFill },
      { label: 'TypeScript', icon: SiTypescript },
      { label: 'Tailwind', icon: RiTailwindCssFill },
      { label: 'HTML5', icon: PiFileHtmlFill },
      { label: 'CSS3', icon: SiCss },
    ],
    demo: {
      title: 'E-Commerce UI',
      description: 'Modern e-commerce frontend with Next.js',
      tag: 'Frontend App',
    },
    rate: '₹158',
  },
  {
    number: '02',
    title: 'Backend Development',
    description:
      'Scalable, secure, and high-performance backend systems with clean architecture and best practices.',
    icon: Server,
    technologies: [
      { label: 'Node.js', icon: SiNodedotjs },
      { label: 'Go', icon: SiGo },
      { label: 'Python', icon: FaPython },
      { label: 'Express', icon: SiExpress },
      { label: 'PostgreSQL', icon: SiPostgresql },
      { label: 'MongoDB', icon: SiMongodb },
    ],
    demo: {
      title: 'Task Management API',
      description: 'REST API with authentication, roles and real-time features',
      tag: 'REST API',
    },
    rate: '₹228',
  },
  {
    number: '03',
    title: 'DevOps Services',
    description:
      'Reliable deployment, automation, and infrastructure setup for seamless development and delivery.',
    icon: Cloud,
    technologies: [
      { label: 'Docker', icon: FaDocker },
      { label: 'Kubernetes', icon: SiKubernetes },
      { label: 'AWS', icon: FaAws },
      { label: 'CI/CD', icon: SiGithubactions },
      { label: 'Terraform', icon: SiTerraform },
      { label: 'Linux', icon: SiLinux },
    ],
    demo: {
      title: 'CI/CD Pipeline',
      description: 'Automated deployment with GitHub Actions',
      tag: 'Pipeline',
    },
    rate: '₹500',
  },
  {
    number: '04',
    title: 'AI Development',
    description:
      'Intelligent applications using LLMs, agents, and modern AI tools to solve real-world problems.',
    icon: BrainCircuit,
    featured: true,
    technologies: [
      { label: 'Python', icon: FaPython },
      { label: 'OpenAI', icon: SiOpenai },
      { label: 'LangChain', icon: SiLangchain },
      { label: 'FastAPI', icon: SiFastapi },
      { label: 'Pinecone', icon: Layers },
      { label: 'Vector DB', icon: Database },
    ],
    demo: {
      title: 'AI Chat Assistant',
      description: 'Context-aware chatbot using OpenAI + LangChain',
      tag: 'AI Agent',
    },
    rate: '₹800',
  },
]

function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon

  return (
    <div
      className={`group relative flex h-full flex-col rounded-2xl border bg-[#0A0A0A] p-5 transition-all duration-300 ease-out hover:-translate-y-1 ${
        service.featured
          ? 'border-[#6B1A1A] shadow-[0_0_30px_-18px_rgba(239,68,68,0.45)]'
          : 'border-[#252525]'
      } hover:border-[#6B1A1A]`}
    >
      <div className="mb-4 flex items-start justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#6B1A1A]/50 bg-white/[0.04] text-primary-accent">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="text-sm font-bold tracking-widest text-[#6B1A1A] transition-colors duration-300 ease-out group-hover:text-primary-accent">
          {service.number}
        </span>
      </div>

      <h4 className="mb-2 text-lg font-bold text-[#F5F5F5]">{service.title}</h4>
      <p className="mb-5 text-xs leading-relaxed text-[#8A8A8A]">
        {service.description}
      </p>

      <span className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.22em] text-primary-accent/80">
        Tech Stack
      </span>
      <div className="mb-5 flex flex-wrap gap-1.5">
        {service.technologies.map((tech) => (
          <span
            key={tech.label}
            className="flex items-center gap-1.5 rounded-full border border-[#252525] bg-white/[0.04] px-2 py-1 text-[10px] font-medium text-[#A0A0A0] transition-colors duration-300 ease-out group-hover:border-[#6B1A1A]/60"
          >
            <tech.icon
              className="h-3 w-3 text-primary-accent/90"
              aria-hidden="true"
            />
            {tech.label}
          </span>
        ))}
      </div>

      <span className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.22em] text-primary-accent/80">
        Demo Project
      </span>
      <div className="mb-5 overflow-hidden rounded-xl border border-[#252525] bg-[#080808]">
        <div className="flex items-center gap-1.5 border-b border-[#252525] px-3 py-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#EF1D25]/70" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/10" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/10" />
          <span className="ml-2 flex-1 truncate rounded-full bg-white/[0.05] px-2 py-0.5 text-[8px] font-medium text-[#8A8A8A]">
            {service.demo.tag}
          </span>
          <MoveUpRight
            className="h-3 w-3 text-primary-accent/80"
            aria-hidden="true"
          />
        </div>
        <div className="space-y-2 p-3 transition-transform duration-300 ease-out group-hover:scale-[1.02]">
          <div className="h-2 w-3/4 rounded-full bg-white/15" />
          <div className="h-1.5 w-full rounded-full bg-white/10" />
          <div className="h-1.5 w-11/12 rounded-full bg-white/10" />
          <p className="pt-1 text-[11px] font-semibold text-[#F5F5F5]">
            {service.demo.title}
          </p>
          <p className="text-[10px] leading-snug text-[#8A8A8A]">
            {service.demo.description}
          </p>
        </div>
      </div>

      <div className="mb-5 mt-auto flex items-center gap-2">
        <IndianRupee
          className="h-5 w-5 text-primary-accent"
          aria-hidden="true"
        />
        <span className="text-2xl font-bold text-[#F5F5F5]">
          {service.rate}
        </span>
        <span className="text-xs font-medium text-[#555555]">/ hour</span>
      </div>

      <a
        href="#contact"
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors duration-300 ease-out hover:bg-primary-accent"
      >
        Get Started
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </a>
    </div>
  )
}

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="relative w-full overflow-hidden bg-[#050505] py-24 sm:py-28 scroll-mt-24"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'linear-gradient(rgba(239,68,68,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.05) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />
        <div className="absolute -top-32 left-1/2 h-80 w-[38rem] -translate-x-1/2 rounded-full bg-primary-accent/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-14 text-center"
        >
          <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[0.35em] text-primary-accent">
            Services
          </span>
          <h3 className="mx-auto mb-4 max-w-2xl text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
            Turn Ideas Into{' '}
            <span className="text-primary-accent">Real Products</span>
          </h3>
          <p className="mx-auto max-w-xl text-sm text-white/55 sm:text-base">
            High-quality development services to help you build, scale, and
            innovate faster.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <motion.div
              key={service.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="h-full"
            >
              <ServiceCard service={service} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
