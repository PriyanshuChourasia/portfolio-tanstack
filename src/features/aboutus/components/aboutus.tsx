
import { motion } from 'framer-motion'
import { useScroll } from 'framer-motion'
import { GraduationCap, Rocket } from 'lucide-react'
import { useRef } from 'react'
import { PiFileHtmlFill } from "react-icons/pi";
import { SiJavascript } from "react-icons/si";
import { SiTypescript } from "react-icons/si";
import { SiCss } from "react-icons/si";
import { TbBrandReact } from "react-icons/tb";
import { RiNextjsFill } from "react-icons/ri";
import { RiTailwindCssFill } from "react-icons/ri";
import { FaJava } from "react-icons/fa";
import { FaPython } from "react-icons/fa";
import { BiLogoSpringBoot } from "react-icons/bi";
import { FaFlutter } from "react-icons/fa6";
import { FaPhp } from "react-icons/fa";
import { FaLaravel } from "react-icons/fa6";
import { SiClaude } from "react-icons/si";
import { RiCopilotFill } from "react-icons/ri";
import { SiLangchain } from "react-icons/si";
import { FaServer } from "react-icons/fa";
import { FaDocker } from "react-icons/fa";
import { SiKubernetes } from "react-icons/si";
import { FcLinux } from "react-icons/fc";
import { TbBrandRedux } from "react-icons/tb";

const iconSize = 27;

const techStack = [
  { id: 'html', label: 'HTML', icon: <PiFileHtmlFill size={iconSize} /> },
  { id: 'javascript', label: 'JavaScript', icon: <SiJavascript size={iconSize} /> },
  { id: "java", label: "JAVA", icon: <FaJava size={iconSize} /> },
  { id: "python", label: "Python", icon: <FaPython size={iconSize} /> },
  { id: "php", label: "PHP", icon: <FaPhp size={iconSize} /> },
  { id: 'typescript', label: 'TypeScript', icon: <SiTypescript size={iconSize} /> },
  { id: 'react', label: 'React', icon: <TbBrandReact size={iconSize} /> },
  { id: 'redux', label: 'Redux', icon: <TbBrandRedux size={iconSize} /> },
  { id: 'next', label: 'Next.js', icon: <RiNextjsFill size={iconSize} /> },
  { id: 'tailwind', label: 'Tailwind CSS', icon: <RiTailwindCssFill size={iconSize} /> },
  { id: "flutter", label: "Flutter", icon: <FaFlutter size={iconSize} /> },
  { id: 'css', label: 'CSS', icon: <SiCss size={iconSize} /> },
  { id: "spring", label: "Spring Boot", icon: <BiLogoSpringBoot size={iconSize} /> },
  { id: "laravel", label: "Laravel", icon: <FaLaravel size={iconSize} /> },
  { id: "claude", label: "Claude", icon: <SiClaude size={iconSize} /> },
  { id: "copilot", label: "Copilot", icon: <RiCopilotFill size={iconSize} /> },
  { id: "langchain", label: "Langchain", icon: <SiLangchain size={iconSize} /> },
  { id: "server", label: "Ubuntu Server", icon: <FaServer size={iconSize} /> },
  { id: "docker", label: "Docker", icon: <FaDocker size={iconSize} /> },
  { id: "kubernetes", label: "Kubernetes", icon: <SiKubernetes size={iconSize} /> },
  { id: "linux", label: "Linux", icon: <FcLinux size={iconSize} /> }
]

export default function AboutSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress: _scrollYProgress } = useScroll({
    target: ref,
    offset: ['start center', 'end center'],
  })



  return (
    <section
      id="about"
      ref={ref}
      className="relative min-h-screen w-full overflow-hidden bg-slate-950 py-32"
    >


      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Get to Know <span className="text-cyan-500">Me</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            I&apos;m a Full-Stack Developer with a specialization in backend development and implementing
            design-driven frontend solutions.
          </p>
        </motion.div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 text-white font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
              </div>
              <div className="grow">
                <h3 className="text-xl font-bold text-white mb-2">Education</h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/30 transition-colors">
                    <p className="font-semibold text-cyan-400">JIS University</p>
                    <p className="text-sm text-slate-400 mt-1">Aug 2020 - May 2023</p>
                    <p className="text-sm text-slate-300 mt-2">
                      Mechanical Engineering degree with focus on software engineering and web technologies.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>


          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 text-white font-bold">
                  <Rocket className="w-5 h-5" />
                </div>
              </div>
              <div className="grow">
                <h3 className="text-xl font-bold text-white mb-2">Bootcamp</h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/30 transition-colors">
                    <p className="font-semibold text-cyan-400">Software Development</p>
                    <p className="text-sm text-slate-400 mt-1">Feb 2022 - May 2023</p>
                    <p className="text-sm text-slate-300 mt-2">
                      Intensive full-stack development learning with <b className='font-bold'>System Design</b> from Wish Institue
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>


        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20"
        >
          <h3 className="text-2xl font-bold text-white mb-8 text-center">Tech Stack</h3>
          <div className="grid grid-cols-2 cursor-pointer md:grid-cols-4 gap-4 max-w-6xl mx-auto place-items-center">
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.id}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group relative flex items-center justify-center 
                    w-56 h-20
                  rounded-lg bg-linear-to-br from-slate-800/50 to-slate-700/50 
                  border border-slate-700/50 hover:border-cyan-500/30 
                  transition-all duration-200 overflow-hidden"
              >
                {/* Icon */}
                <div className="absolute inset-0 flex items-center justify-center 
                      transition-opacity duration-200 group-hover:opacity-0">
                  <span className="text-white text-xl md:text-2xl">
                    {tech.icon}
                  </span>
                </div>

                {/* Label */}
                <div className="absolute inset-0 flex items-center justify-center 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-2">
                  <span className="text-cyan-400 text-xs md:text-sm font-semibold text-center">
                    {tech.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
