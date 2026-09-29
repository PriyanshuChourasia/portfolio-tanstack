import { motion } from 'framer-motion'
import {
  ArrowUpRight,
  Code2,
  MapPin,
  Terminal,
} from 'lucide-react'

const projects = [
  {
    number: '01',
    name: 'MyClinic',
    url: 'https://opd.codymitra.com',
    description: 'Healthcare and clinic management platform',
    tech: 'React · Node.js · MongoDB',
  },
  {
    number: '02',
    name: 'Account ERP',
    url: 'https://github.com/PriyanshuChourasia/account_erp',
    description: 'Accounting and business management system',
    tech: 'React · NestJS · PostgreSQL',
  },
  {
    number: '03',
    name: 'Restaurant',
    url: 'https://restaurant.codymitra.com/',
    description: 'Restaurant management and ordering platform',
    tech: 'React · Node.js · MongoDB',
  },
  {
    number: '04',
    name: 'Resume Builder',
    url: 'https://resumeio.codymitra.com/',
    description: 'Dynamic resume creation and portfolio builder',
    tech: 'React · Node.js · MongoDB',
  },
]

export default function GetToKnowMe() {
  return (
    <section id="about" className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[40%_60%]">
      {/* =========================================================
          LEFT — PROFILE IMAGE
      ========================================================= */}
      <div className="flex min-h-screen items-center justify-center bg-white px-6 py-12 md:px-8 lg:px-10 xl:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-[#C19ADD]/50 bg-gradient-to-br from-[#441573]/20 via-[#8353AD]/20 to-[#C19ADD]/35 shadow-[0_12px_35px_rgba(0,0,0,0.08)]"
        >
          {/* Soft glow behind the figure */}
          <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-[#8353AD]/20 blur-3xl" />

          <img
            src="/priyanshuimage.png"
            alt="Priyanshu Chourasia"
            className="relative mx-auto h-[70vh] max-h-[640px] w-auto object-contain px-6 pt-8"
          />
        </motion.div>
      </div>

      {/* =========================================================
          RIGHT — GET TO KNOW ME
      ========================================================= */}
      <div className="min-h-screen bg-white text-gray-900">
        {/* =====================================================
            CONTENT WRAPPER
        ===================================================== */}
        <div className="grid min-h-screen grid-rows-[auto_1fr]">
          {/* ===================================================
              TOP HEADER
          =================================================== */}
          <header className="px-6 py-10 md:px-10 md:py-12 lg:px-12">
            {/* Small label */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-6 flex items-center gap-3"
            >
              <Terminal size={15} className="text-gray-900" />

              <span className="font-mono text-xs uppercase tracking-[0.3em] text-gray-500">
                Get to know me
              </span>

              <span className="ml-auto font-mono text-[10px] text-gray-500">
                DEV / 001
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: 0.1,
              }}
              className="text-5xl font-black tracking-[-0.04em] text-gray-900 md:text-6xl lg:text-7xl"
            >
              Codymitra
              <span className="text-gray-900">.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: 0.3,
              }}
              className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2"
            >
              <Code2 size={15} className="text-gray-900" />

              <span className="text-sm text-gray-500">
                Software Engineering
              </span>

              <span className="text-gray-300">·</span>

              <span className="text-sm text-gray-500">Systems</span>

              <span className="text-gray-300">·</span>

              <span className="text-sm text-gray-500">Web</span>

              <span className="text-gray-300">·</span>

              <span className="text-sm text-gray-500">AI</span>
            </motion.div>
          </header>

          {/* ===================================================
              LOWER CONTENT
          =================================================== */}
          <div className="grid grid-cols-1 border-t border-gray-200 md:grid-cols-[40%_60%]">
            {/* =================================================
                MY INFORMATION
            ================================================= */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="border-b border-gray-200 p-6 md:border-b-0 md:border-r md:p-8 lg:p-10"
            >
              {/* Section heading */}
              <div className="mb-8">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-gray-500">
                  01 / Profile
                </span>

                <h2 className="mt-2 text-xl font-bold text-gray-900">
                  My Information
                </h2>
              </div>

              {/* Information */}
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <span className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-gray-500">
                    Name
                  </span>

                  <p className="text-sm font-medium text-gray-800">
                    Priyanshu Chourasia
                  </p>
                </div>

                {/* Role */}
                <div>
                  <span className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-gray-500">
                    Role
                  </span>

                  <p className="text-sm font-medium text-gray-800">
                    Software Engineer
                  </p>
                </div>

                {/* Location */}
                <div>
                  <span className="mb-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-gray-500">
                    <MapPin size={11} />
                    Location
                  </span>

                  <p className="text-sm font-medium text-gray-800">India</p>
                </div>

                {/* Focus */}
                <div>
                  <span className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-gray-500">
                    Focus
                  </span>

                  <p className="text-sm font-medium leading-6 text-gray-800">
                    Backend · Systems
                    <br />
                    Web · AI
                  </p>
                </div>

                {/* Availability */}
                <div className="border-t border-gray-200 pt-5">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500" />

                    <span className="font-mono text-[15px] uppercase tracking-wider text-gray-900">
                      Available for opportunities
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* =================================================
                PROJECTS
            ================================================= */}
            <motion.div
              id="experience"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="scroll-mt-24 p-6 md:p-8 lg:p-10"
            >
              {/* Section heading */}
              <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-gray-500">
                    02 / Work
                  </span>

                  <h2 className="mt-2 text-xl font-bold text-gray-900">
                    Selected Projects
                  </h2>
                </div>

                <span className="font-mono text-[10px] text-gray-500">
                  03 PROJECTS
                </span>
              </div>

              {/* Project list */}
              <div className="divide-y divide-gray-200">
                {projects.map((project, i) => (
                  <motion.div
                    key={project.number}
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.4,
                      delay: i * 0.1,
                    }}
                    className="group py-5 first:pt-0"
                  >
                    <div className="flex items-start gap-4">
                      {/* Number */}
                      <span className="pt-1 font-mono text-[10px] text-gray-500">
                        {project.number}
                      </span>

                      {/* Project content */}
                      <div className="min-w-0 flex-1">
                        {/* Clickable Project Header */}
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start justify-between gap-4"
                        >
                          <h3 className="text-base font-semibold text-gray-900 transition-colors group-hover:text-gray-500">
                            {project.name}
                          </h3>

                          <ArrowUpRight
                            size={17}
                            className="shrink-0 text-gray-400 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-gray-500"
                          />
                        </a>

                        {/* Description */}
                        <p className="mt-1 text-xs leading-5 text-gray-500">
                          {project.description}
                        </p>

                        {/* Tech */}
                        <p className="mt-3 font-mono text-[9px] uppercase tracking-wider text-gray-400">
                          {project.tech}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Bottom technical detail */}
              <div className="mt-8 border-t border-gray-200 pt-5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-gray-400">
                    Building / Learning / Shipping
                  </span>

                  <span className="font-mono text-[9px] text-gray-500">
                    2026
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
