import { motion } from 'framer-motion'
import {
  ArrowUpRight,
  Code2,
  GraduationCap,
  MapPin,
  Terminal,
} from 'lucide-react'

import resumeData from '@/data/resume-data.json'
import { cn } from '@/lib/utils'

const education = [
  resumeData.education[2], // 10th Grade
  resumeData.education[1], // Diploma
  resumeData.education[0], // B.Tech
]

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
    <section className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[40%_60%]">
      {/* =========================================================
          LEFT — EDUCATION
      ========================================================= */}
      <div className="flex min-h-screen flex-col bg-white px-6 py-12 md:px-8 lg:px-10 xl:px-12">
        {/* Education Heading */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-2 flex items-center gap-3">
            <div className="h-px w-8 bg-red-600" />

            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-red-600">
              Background
            </span>
          </div>

          <h2 className="text-4xl font-bold tracking-tight text-[#111111] md:text-5xl">
            Education
          </h2>

          <p className="mt-3 max-w-md text-sm leading-6 text-gray-500">
            A continuous journey of learning, engineering and building
            meaningful software.
          </p>
        </motion.div>

        {/* Education Cards */}
        <div className="flex flex-1 flex-col justify-center gap-6 py-10">
          {education.map((edu, i) => (
            <motion.div
              key={`${edu.company}-${i}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: i * 0.12,
              }}
              whileHover={{
                y: -4,
              }}
              className={cn(
                'group relative overflow-hidden rounded-2xl',
                'border border-[#6B1A1A]',
                'bg-[#120909]',
                'shadow-[0_12px_35px_rgba(0,0,0,0.12)]',
              )}
            >
              {/* Red side accent */}
              <div className="absolute left-0 top-0 h-full w-1 bg-[#EF1D25]" />

              <div className="p-5 md:p-6">
                {/* Top row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EF1D25]">
                      <GraduationCap
                        size={21}
                        strokeWidth={2}
                        className="text-black"
                      />
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-[#F8F5F2] md:text-lg">
                        {edu.title}
                      </h3>

                      <p className="mt-1 text-sm font-medium text-[#C65D08]">
                        {edu.company}
                      </p>
                    </div>
                  </div>

                  {/* Number */}
                  <span className="font-mono text-xs text-red-500/70">
                    0{i + 1}
                  </span>
                </div>

                {/* Divider */}
                <div className="my-5 h-px bg-[#5A1B1B]" />

                {/* Bottom */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <span className="font-mono text-xs uppercase tracking-wider text-red-500">
                    {edu.period}
                  </span>

                  <span className="text-xs leading-5 text-[#E5DADA]">
                    {edu.desc}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* =========================================================
          RIGHT — GET TO KNOW ME
      ========================================================= */}
      <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
        {/* =====================================================
            CIRCUIT BACKGROUND
        ===================================================== */}
        <div className="pointer-events-none absolute inset-0 opacity-40">
          {/* Horizontal lines */}
          <div className="absolute left-0 top-[15%] h-px w-[80%] bg-red-900/50" />
          <div className="absolute right-0 top-[32%] h-px w-[65%] bg-red-900/40" />
          <div className="absolute left-0 top-[72%] h-px w-[75%] bg-red-900/40" />
          <div className="absolute bottom-[10%] right-0 h-px w-[55%] bg-red-900/40" />

          {/* Vertical lines */}
          <div className="absolute left-[18%] top-0 h-[65%] w-px bg-red-900/40" />
          <div className="absolute left-[72%] top-0 h-[45%] w-px bg-red-900/40" />
          <div className="absolute right-[12%] bottom-0 h-[55%] w-px bg-red-900/40" />

          {/* Circuit nodes */}
          <div className="absolute left-[18%] top-[15%] h-2 w-2 rounded-full bg-red-600" />
          <div className="absolute left-[72%] top-[32%] h-2 w-2 rounded-full bg-red-600" />
          <div className="absolute left-[18%] top-[72%] h-2 w-2 rounded-full bg-red-600" />
          <div className="absolute right-[12%] bottom-[10%] h-2 w-2 rounded-full bg-red-600" />
        </div>

        {/* =====================================================
            CONTENT WRAPPER
        ===================================================== */}
        <div className="relative z-10 grid min-h-screen grid-rows-[auto_1fr]">
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
              <Terminal size={15} className="text-[#EF1D25]" />

              <span className="font-mono text-xs uppercase tracking-[0.3em] text-red-500">
                Get to know me
              </span>

              <span className="ml-auto font-mono text-[10px] text-gray-600">
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
              className="text-5xl font-black tracking-[-0.04em] text-white md:text-6xl lg:text-7xl"
            >
              Codymitra
              <span className="text-[#EF1D25]">.</span>
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
              <Code2 size={15} className="text-[#EF1D25]" />

              <span className="text-sm text-gray-400">
                Software Engineering
              </span>

              <span className="text-red-800">·</span>

              <span className="text-sm text-gray-400">Systems</span>

              <span className="text-red-800">·</span>

              <span className="text-sm text-gray-400">Web</span>

              <span className="text-red-800">·</span>

              <span className="text-sm text-gray-400">AI</span>
            </motion.div>
          </header>

          {/* ===================================================
              LOWER CONTENT
          =================================================== */}
          <div className="grid grid-cols-1 border-t border-red-950/70 md:grid-cols-[40%_60%]">
            {/* =================================================
                MY INFORMATION
            ================================================= */}
            <motion.div
              id="about"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="scroll-mt-24 border-b border-red-950/70 p-6 md:border-b-0 md:border-r md:p-8 lg:p-10"
            >
              {/* Section heading */}
              <div className="mb-8">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-red-500">
                  01 / Profile
                </span>

                <h2 className="mt-2 text-xl font-bold text-white">
                  My Information
                </h2>
              </div>

              {/* Information */}
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <span className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-gray-600">
                    Name
                  </span>

                  <p className="text-sm font-medium text-gray-200">
                    Priyanshu Chourasia
                  </p>
                </div>

                {/* Role */}
                <div>
                  <span className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-gray-600">
                    Role
                  </span>

                  <p className="text-sm font-medium text-gray-200">
                    Software Engineer
                  </p>
                </div>

                {/* Location */}
                <div>
                  <span className="mb-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-gray-600">
                    <MapPin size={11} />
                    Location
                  </span>

                  <p className="text-sm font-medium text-gray-200">India</p>
                </div>

                {/* Focus */}
                <div>
                  <span className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-gray-600">
                    Focus
                  </span>

                  <p className="text-sm font-medium leading-6 text-gray-200">
                    Backend · Systems
                    <br />
                    Web · AI
                  </p>
                </div>

                {/* Availability */}
                <div className="border-t border-red-950/70 pt-5">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500" />

                    <span className="font-mono text-[15px] uppercase tracking-wider text-gray-100">
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
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-red-500">
                    02 / Work
                  </span>

                  <h2 className="mt-2 text-xl font-bold text-white">
                    Selected Projects
                  </h2>
                </div>

                <span className="font-mono text-[10px] text-gray-600">
                  03 PROJECTS
                </span>
              </div>

              {/* Project list */}
              <div className="divide-y divide-red-950/70">
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
                      <span className="pt-1 font-mono text-[10px] text-red-600">
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
                          <h3 className="text-base font-semibold text-gray-100 transition-colors group-hover:text-[#EF1D25]">
                            {project.name}
                          </h3>

                          <ArrowUpRight
                            size={17}
                            className="shrink-0 text-gray-700 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#EF1D25]"
                          />
                        </a>

                        {/* Description */}
                        <p className="mt-1 text-xs leading-5 text-gray-500">
                          {project.description}
                        </p>

                        {/* Tech */}
                        <p className="mt-3 font-mono text-[9px] uppercase tracking-wider text-gray-700">
                          {project.tech}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Bottom technical detail */}
              <div className="mt-8 border-t border-red-950/70 pt-5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-gray-700">
                    Building / Learning / Shipping
                  </span>

                  <span className="font-mono text-[9px] text-red-700">
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
