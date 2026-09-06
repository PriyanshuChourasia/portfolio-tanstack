import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CalendarCheck,
  CalendarDays,
  ClipboardList,
  CreditCard,
  ExternalLink,
  Footprints,
  HeartPulse,
  Layers,
  ListOrdered,
  Pill,
  Radio,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Tag,
  Ticket,
  UserPlus,
  UserRound,
  Users,
  Workflow,
} from 'lucide-react'
import type { Variants } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import worksData from '@/data/works-data.json'
import { Navbar } from '@/components/Navbar'

type ProjectDetails = {
  tagline?: string
  journey?: Array<string>
  roles?: Array<{ name: string; blurb: string }>
  highlights?: Array<{ title: string; description: string }>
  modules?: Array<{ name: string; description: string }>
  stack?: Array<{ group: string; items: Array<string> }>
}

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const journeyIcons: Array<LucideIcon> = [
  Footprints,
  UserPlus,
  CalendarCheck,
  Ticket,
  Stethoscope,
  ClipboardList,
  CreditCard,
  Pill,
]

function roleIcon(name: string): LucideIcon {
  switch (name.toLowerCase()) {
    case 'admin':
      return ShieldCheck
    case 'doctor':
      return Stethoscope
    case 'receptionist':
      return UserRound
    case 'pharmacist':
      return Pill
    case 'nurse':
      return HeartPulse
    default:
      return Users
  }
}

function highlightIcon(title: string): LucideIcon {
  const n = title.toLowerCase()
  if (n.includes('end-to-end')) return Workflow
  if (n.includes('role-native')) return Users
  if (n.includes('prescription')) return ClipboardList
  if (n.includes('rbac')) return ShieldCheck
  if (n.includes('real-time')) return Radio
  return Sparkles
}

function moduleIcon(name: string): LucideIcon {
  const n = name.toLowerCase()
  if (n.includes('queue')) return ListOrdered
  if (n.includes('appointment')) return CalendarCheck
  if (n.includes('consult')) return Stethoscope
  if (n.includes('prescription')) return ClipboardList
  if (n.includes('billing')) return CreditCard
  if (n.includes('pharmacy')) return Pill
  if (n.includes('rbac')) return ShieldCheck
  if (n.includes('schedule')) return CalendarDays
  return Layers
}

function SectionHeading({
  label,
  title,
  sub,
}: {
  label: string
  title: string
  sub?: string
}) {
  return (
    <div className="max-w-3xl">
      <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-primary text-primary-accent">
        <span className="h-px w-6 bg-primary-accent/60" />
        {label}
      </span>
      <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-slate-900 text-foreground">
        {title}
      </h2>
      {sub && (
        <p className="mt-3 text-sm sm:text-base text-slate-500 text-muted-foreground">
          {sub}
        </p>
      )}
    </div>
  )
}

export function ProjectDetailPage({ projectId }: { projectId: number }) {
  const project = worksData.items.find((_, i) => i === projectId - 1)

  if (!project) {
    return (
      <div className="min-h-screen bg-white dark:bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="max-w-md text-center">
            <p className="text-sm uppercase tracking-widest text-primary-accent mb-4">
              404
            </p>
            <h1 className="text-3xl font-bold text-slate-900 text-foreground mb-6">
              Project not found
            </h1>
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-full bg-primary-accent px-6 py-3 text-sm font-semibold text-white hover:bg-primary-accent transition-colors"
            >
              <ArrowLeft size={16} />
              All projects
            </a>
          </div>
        </div>
      </div>
    )
  }

  const details: ProjectDetails | undefined =
    'details' in project ? project.details : undefined

  const prevProject =
    projectId > 1
      ? worksData.items.find((_, i) => i === projectId - 2)
      : undefined
  const nextProject =
    projectId < worksData.items.length
      ? worksData.items.find((_, i) => i === projectId)
      : undefined

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      <Navbar />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="pt-20"
      >
        {/* Hero */}
        <section className="relative overflow-hidden bg-background">
          {/* Background */}
          <div className="absolute inset-0 bg-linear-to-b from-background via-background to-background" />
          <div className="absolute -top-40 -right-24 h-96 w-96 rounded-full bg-primary-accent/10 blur-3xl" />
          <div className="absolute -bottom-48 -left-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="hidden sm:block absolute inset-6 lg:inset-10 pointer-events-none">
            <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/5" />
            <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/5" />
          </div>

          {/* Oversized watermark number */}
          <span
            aria-hidden
            className="hidden lg:block absolute -right-6 top-10 select-none text-[11rem] font-black text-white/[0.05] leading-none pointer-events-none"
          >
            {String(projectId).padStart(2, '0')}
          </span>

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 sm:pt-12 sm:pb-24">
            <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              {/* Left: info */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-accent/30 bg-primary-accent/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-primary-accent">
                  <Tag size={10} />
                  {project.category}
                </span>

                <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[0.95] text-white">
                  {project.title}
                </h1>

                {project.client && (
                  <div className="mt-5 flex items-center gap-2">
                    <Briefcase size={14} className="text-primary-accent shrink-0" />
                    <span className="text-sm font-semibold text-primary-accent">
                      {project.client}
                    </span>
                  </div>
                )}

                <p className="mt-6 max-w-xl text-base leading-8 text-slate-300">
                  {details?.tagline ?? project.description}
                </p>

                {/* CTAs */}
                {project.link && project.link !== '#' && (
                  <div className="mt-9 flex flex-wrap gap-3">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-primary to-primary-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-accent/25 transition-shadow hover:shadow-xl hover:shadow-primary-accent/40"
                    >
                      <ExternalLink size={15} />
                      View live project
                    </a>
                  </div>
                )}
              </motion.div>

              {/* Right: framed preview */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative"
              >
                <div className="absolute -inset-4 rounded-3xl bg-linear-to-br from-primary-accent/25 via-transparent to-fuchsia-500/15 blur-2xl opacity-70" />

                <div className="relative overflow-hidden rounded-2xl border border-border bg-card/80 shadow-2xl shadow-card backdrop-blur-xl">
                  {/* Browser chrome */}
                  <div className="flex items-center gap-1.5 border-b border-white/5 px-4 py-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
                    <span className="ml-3 truncate rounded-md bg-white/5 px-3 py-1 text-xs text-slate-500">
                      {project.link && project.link !== '#'
                        ? project.link
                        : `${project.title} — preview`}
                    </span>
                  </div>

                  {/* Screenshot */}
                  <div className="overflow-hidden">
                    <img
                      src={project.image}
                      alt={`${project.title} preview`}
                      className="w-full aspect-[16/10] object-cover object-top"
                      loading="eager"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Rich detail sections — only when the project has extended data */}
        {details && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
            {/* Overview */}
            <div>
              <SectionHeading
                label="Overview"
                title="A real-time operating system for clinics"
                sub="Replaces scattered spreadsheets, paper registers, and legacy software with one unified application."
              />
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 text-foreground">
                {project.description}
              </p>
            </div>

            {/* Patient journey */}
            {details.journey && (
              <div>
                <SectionHeading
                  label="The patient journey"
                  title="One record, end to end"
                  sub="A single system takes a patient from the front desk to pharmacy checkout."
                />
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-60px' }}
                  className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3"
                >
                  {details.journey.map((step, i) => {
                    const Icon = journeyIcons[i % journeyIcons.length]
                    return (
                      <motion.div
                        key={step}
                        variants={staggerItem}
                        className="group relative rounded-xl border border-slate-200 border-border bg-white dark:bg-card p-4 sm:p-5 transition-colors hover:border-primary-accent/60 hover:shadow-lg hover:shadow-primary-accent/5"
                      >
                        <span className="absolute right-3 top-3 text-[10px] font-black tracking-widest text-slate-300 dark:text-slate-600">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary-accent/20 bg-primary-accent/5 dark:bg-primary-accent/10">
                          <Icon className="h-4 w-4 text-primary text-primary-accent" />
                        </div>
                        <p className="mt-3 text-sm font-semibold leading-snug text-slate-700 text-foreground">
                          {step}
                        </p>
                      </motion.div>
                    )
                  })}
                </motion.div>
              </div>
            )}

            {/* Roles */}
            {details.roles && (
              <div>
                <SectionHeading
                  label="Built for every role"
                  title="Five roles, five native interfaces"
                  sub="Each user gets a workflow shaped around their job — not a one-size-fits-all dashboard."
                />
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-60px' }}
                  className="mt-8 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3"
                >
                  {details.roles.map((role) => {
                    const Icon = roleIcon(role.name)
                    return (
                      <motion.div
                        key={role.name}
                        variants={staggerItem}
                        className="rounded-xl border border-slate-200 border-border bg-white dark:bg-card p-4 sm:p-5 transition-colors hover:border-primary-accent/60 hover:shadow-lg hover:shadow-primary-accent/5"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary-accent/20 bg-primary-accent/5 dark:bg-primary-accent/10">
                          <Icon className="h-4 w-4 text-primary text-primary-accent" />
                        </div>
                        <p className="mt-3 text-xs font-bold uppercase tracking-widest text-slate-900 text-foreground">
                          {role.name}
                        </p>
                        <p className="mt-1.5 text-xs leading-relaxed text-slate-500 text-muted-foreground">
                          {role.blurb}
                        </p>
                      </motion.div>
                    )
                  })}
                </motion.div>
              </div>
            )}

            {/* Highlights */}
            {details.highlights && (
              <div>
                <SectionHeading
                  label="Why it stands out"
                  title="Key highlights"
                />
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-60px' }}
                  className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {details.highlights.map((h) => {
                    const Icon = highlightIcon(h.title)
                    return (
                      <motion.div
                        key={h.title}
                        variants={staggerItem}
                        className="rounded-2xl border border-slate-200 border-border bg-white dark:bg-card p-6 transition-colors hover:border-primary-accent/60 hover:shadow-lg hover:shadow-primary-accent/5"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-primary to-primary-accent text-white shadow-lg shadow-primary-accent/20">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="mt-4 text-base font-bold text-slate-900 text-foreground">
                          {h.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-500 text-muted-foreground">
                          {h.description}
                        </p>
                      </motion.div>
                    )
                  })}
                </motion.div>
              </div>
            )}

            {/* Core modules */}
            {details.modules && (
              <div>
                <SectionHeading
                  label="Core modules"
                  title="Everything the clinic needs, in one app"
                  sub="From the waiting room to the pharmacy counter — every step is a first-class module."
                />
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-60px' }}
                  className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
                >
                  {details.modules.map((m) => {
                    const Icon = moduleIcon(m.name)
                    return (
                      <motion.div
                        key={m.name}
                        variants={staggerItem}
                        className="rounded-xl border border-slate-200 border-border bg-white dark:bg-card p-5 transition-colors hover:border-primary-accent/60 hover:shadow-lg hover:shadow-primary-accent/5"
                      >
                        <Icon className="h-5 w-5 text-primary text-primary-accent" />
                        <h3 className="mt-3 text-sm font-bold text-slate-900 text-foreground">
                          {m.name}
                        </h3>
                        <p className="mt-1.5 text-xs leading-relaxed text-slate-500 text-muted-foreground">
                          {m.description}
                        </p>
                      </motion.div>
                    )
                  })}
                </motion.div>
              </div>
            )}

            {/* Tech stack */}
            {details.stack && (
              <div>
                <SectionHeading
                  label="Tech stack"
                  title="Built with a modern monorepo"
                  sub="NestJS + Prisma on the backend, React 19 on the frontend, Turborepo tying it together."
                />
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-60px' }}
                  className="mt-8 grid gap-4 sm:grid-cols-3"
                >
                  {details.stack.map((group) => (
                    <motion.div
                      key={group.group}
                      variants={staggerItem}
                      className="rounded-xl border border-slate-200 border-border bg-white dark:bg-card p-5"
                    >
                      <p className="text-[11px] font-bold uppercase tracking-widest text-primary text-primary-accent">
                        {group.group}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {group.items.map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-slate-200 border-border bg-slate-50 bg-card/60 px-3 py-1 text-xs font-medium text-slate-600 text-foreground"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}
          </div>
        )}

        {/* Prev / Next navigation */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid gap-4 sm:grid-cols-2">
            {prevProject ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
              >
                <a
                  href="/#projects"
                  className="group flex items-center gap-4 rounded-2xl border border-slate-200 border-border bg-white dark:bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary-accent/60 hover:shadow-lg hover:shadow-primary-accent/5"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 border-border text-slate-400 group-hover:border-primary-accent/50 group-hover:text-primary-accent transition-colors">
                    <ArrowLeft size={16} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      Previous project
                    </span>
                    <span className="mt-1 block truncate text-sm font-semibold text-slate-700 text-foreground group-hover:text-primary dark:group-hover:text-primary-accent transition-colors">
                      {prevProject.title}
                    </span>
                  </span>
                </a>
              </motion.div>
            ) : (
              <div className="hidden sm:block" />
            )}

            {nextProject ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <a
                  href="/#projects"
                  className="group flex items-center justify-end gap-4 rounded-2xl border border-slate-200 border-border bg-white dark:bg-card p-6 text-right transition-all hover:-translate-y-0.5 hover:border-primary-accent/60 hover:shadow-lg hover:shadow-primary-accent/5"
                >
                  <span className="min-w-0">
                    <span className="block text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      Next project
                    </span>
                    <span className="mt-1 block truncate text-sm font-semibold text-slate-700 text-foreground group-hover:text-primary dark:group-hover:text-primary-accent transition-colors">
                      {nextProject.title}
                    </span>
                  </span>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 border-border text-slate-400 group-hover:border-primary-accent/50 group-hover:text-primary-accent transition-colors">
                    <ArrowRight size={16} />
                  </span>
                </a>
              </motion.div>
            ) : (
              <div className="hidden sm:block" />
            )}
          </div>
        </section>
      </motion.main>
    </div>
  )
}
