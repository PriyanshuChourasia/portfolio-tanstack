import { useEffect, useMemo, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Building2,
  CheckCircle2,
  Circle,
  Gauge,
  MapPin,
  Moon,
  RotateCcw,
  Sparkles,
  Sun,
  Target,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useTheme } from '@/features/resume-builder/components/ThemeProvider'
import {
  POSTING_COUNT,
  allSkills,
  bulletFormula,
  resumeTips,
  roleArchetypes,
  skillGroups,
} from '@/features/fde/data'

export const Route = createFileRoute('/fde')({
  head: () => ({
    meta: [
      { title: 'Forward Deployed Engineer — Roles, Required Skills & Resume Template' },
      {
        name: 'description',
        content:
          'What Forward Deployed Engineer (FDE) and AI engineering roles actually ask for: role types, a skill-demand matrix from real postings, a readiness checklist and an ATS-friendly FDE resume template.',
      },
    ],
  }),
  component: FdePage,
})

const STORAGE_KEY = 'resume-ui:fde-skills'
const ease = [0.25, 0.46, 0.45, 0.94] as const

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, ease },
}

const levelColors: Record<string, string> = {
  Associate: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  'Mid / Senior': 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30',
  Senior: 'bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/30',
  'Senior / Staff': 'bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300 border-fuchsia-500/30',
  Lead: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
}

function useOwnedSkills() {
  const [owned, setOwned] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return new Set(raw ? (JSON.parse(raw) as Array<string>) : [])
    } catch {
      return new Set()
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...owned]))
    } catch {
      /* storage unavailable — keep in memory only */
    }
  }, [owned])

  const toggle = (id: string) =>
    setOwned((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return { owned, toggle, reset: () => setOwned(new Set()) }
}

function FdePage() {
  const { theme, toggle: toggleTheme } = useTheme()
  const { owned, toggle, reset } = useOwnedSkills()

  const { score, gaps } = useMemo(() => {
    const total = allSkills.reduce((sum, s) => sum + s.demand, 0)
    const have = allSkills
      .filter((s) => owned.has(s.id))
      .reduce((sum, s) => sum + s.demand, 0)
    return {
      score: Math.round((have / total) * 100),
      gaps: allSkills
        .filter((s) => !owned.has(s.id))
        .sort((a, b) => b.demand - a.demand)
        .slice(0, 5),
    }
  }, [owned])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link
            to="/"
            className="flex items-center gap-1.5 rounded-full px-2 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Resume Builder
          </Link>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <Button asChild size="sm" className="rounded-full text-xs">
              <Link to="/resume" search={{ template: 'fde' }}>
                Use FDE template
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-24">
        {/* Hero */}
        <section className="relative py-16 text-center sm:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-6 -z-0 h-64 w-[min(720px,90vw)] -translate-x-1/2 rounded-full bg-gradient-to-r from-fuchsia-500/15 via-violet-500/15 to-sky-500/15 blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="relative"
          >
            <Badge variant="outline" className="mb-5 gap-1.5 rounded-full px-3 py-1">
              <Sparkles className="size-3.5 text-fuchsia-500" />
              Built from {POSTING_COUNT} real FDE &amp; AI engineering postings
            </Badge>
            <h1 className="mx-auto max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
              Forward Deployed Engineer:{' '}
              <span className="bg-gradient-to-r from-fuchsia-600 via-violet-600 to-sky-600 bg-clip-text text-transparent">
                what the role really asks for
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-balance text-muted-foreground sm:text-lg">
              FDEs sit with the people who run the business, find the problem worth solving, and ship
              the AI system that fixes it, measured on a number that moves, not tickets closed.
            </p>

            <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { value: String(roleArchetypes.length), label: 'Role types' },
                { value: String(allSkills.length), label: 'Skills mapped' },
                { value: '0–8+', label: 'Years asked' },
                { value: `${POSTING_COUNT}/${POSTING_COUNT}`, label: 'Want stakeholder skills' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-border/60 bg-card/60 px-4 py-4">
                  <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Roles */}
        <section id="roles" className="scroll-mt-20">
          <motion.div {...fadeUp} className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-600 dark:text-fuchsia-400">
              Job roles
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Five flavours of FDE</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Same core idea, very different seats. Find the one closest to you and tune your resume to it.
            </p>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {roleArchetypes.map((role, i) => (
              <motion.article
                key={role.id}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.06 }}
                className="group flex flex-col rounded-2xl border border-border/60 bg-card p-5 transition-shadow hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold leading-snug">{role.title}</h3>
                  <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${levelColors[role.level]}`}>
                    {role.level}
                  </span>
                </div>

                <dl className="mt-4 space-y-2.5 text-sm">
                  <RoleFact icon={Briefcase} label="Experience" value={role.experience} />
                  <RoleFact icon={Building2} label="Employer" value={role.employer} />
                  <RoleFact icon={MapPin} label="Where you sit" value={role.whereYouSit} />
                  <RoleFact icon={Target} label="Measured on" value={role.measuredOn} />
                </dl>

                <p className="mt-4 rounded-xl bg-muted/60 px-3 py-2.5 text-[13px] leading-relaxed">
                  <span className="font-semibold">Stand out: </span>
                  {role.standout}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5 pt-1">
                  {role.stack.map((s) => (
                    <span key={s} className="rounded-md border border-border/60 bg-background px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      {s}
                    </span>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Skills matrix + readiness */}
        <section id="skills" className="mt-24 scroll-mt-20">
          <motion.div {...fadeUp} className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-600 dark:text-fuchsia-400">
              Required skills
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">What you need to accomplish</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Each bar shows how many of the {POSTING_COUNT} postings ask for the skill. Tick what you can
              already prove on your resume to see your readiness and your biggest gaps.
            </p>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              {skillGroups.map((group) => (
                <motion.div key={group.id} {...fadeUp} className="rounded-2xl border border-border/60 bg-card p-5">
                  <div className="mb-4">
                    <h3 className="font-semibold">{group.title}</h3>
                    <p className="text-sm text-muted-foreground">{group.blurb}</p>
                  </div>
                  <ul className="divide-y divide-border/60">
                    {group.skills.map((skill) => {
                      const has = owned.has(skill.id)
                      return (
                        <li key={skill.id}>
                          <button
                            type="button"
                            onClick={() => toggle(skill.id)}
                            aria-pressed={has}
                            className="flex w-full items-start gap-3 rounded-lg px-1 py-3 text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            {has ? (
                              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-500" />
                            ) : (
                              <Circle className="mt-0.5 size-5 shrink-0 text-muted-foreground/50" />
                            )}
                            <span className="min-w-0 flex-1">
                              <span className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                                <span className={`text-sm font-medium ${has ? 'text-muted-foreground line-through decoration-emerald-500/60' : ''}`}>
                                  {skill.name}
                                </span>
                                <DemandBar demand={skill.demand} />
                              </span>
                              <span className="mt-1 block text-xs text-muted-foreground">
                                <span className="font-medium text-foreground/70">Resume proof: </span>
                                {skill.proof}
                              </span>
                            </span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Readiness panel */}
            <aside className="lg:sticky lg:top-20 lg:self-start">
              <div className="rounded-2xl border border-border/60 bg-card p-5">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-2 font-semibold">
                    <Gauge className="size-4 text-fuchsia-500" />
                    FDE readiness
                  </h3>
                  {owned.size > 0 && (
                    <button
                      type="button"
                      onClick={reset}
                      className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <RotateCcw className="size-3" />
                      Reset
                    </button>
                  )}
                </div>

                <ReadinessRing score={score} />

                <p className="text-center text-xs text-muted-foreground">
                  Weighted by how often each skill is asked for. {owned.size} of {allSkills.length} ticked.
                </p>

                <div className="mt-5 border-t border-border/60 pt-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {gaps.length ? 'Close these gaps first' : 'No gaps left'}
                  </p>
                  {gaps.length ? (
                    <ol className="space-y-2">
                      {gaps.map((g, i) => (
                        <li key={g.id} className="flex items-start gap-2 text-sm">
                          <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold">
                            {i + 1}
                          </span>
                          <span className="leading-snug">{g.name}</span>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                      <BadgeCheck className="size-4" /> You can evidence every skill.
                    </p>
                  )}
                </div>

                <Button asChild className="mt-5 w-full rounded-full">
                  <Link to="/resume" search={{ template: 'fde' }}>
                    Build my FDE resume <ArrowRight className="ml-1 size-4" />
                  </Link>
                </Button>
              </div>
            </aside>
          </div>
        </section>

        {/* Bullet formula */}
        <section id="formula" className="mt-24 scroll-mt-20">
          <motion.div {...fadeUp} className="overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-fuchsia-500/[0.07] via-violet-500/[0.05] to-sky-500/[0.07] p-6 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-600 dark:text-fuchsia-400">
              The FDE bullet formula
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Write every bullet as a full loop</h2>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              {bulletFormula.parts.map((part, i) => (
                <span key={part} className="flex items-center gap-2">
                  <span className="rounded-full border border-border/60 bg-background px-4 py-1.5 text-sm font-semibold">
                    {part}
                  </span>
                  {i < bulletFormula.parts.length - 1 && <ArrowRight className="size-4 text-muted-foreground" />}
                </span>
              ))}
            </div>
            <p className="mt-4 font-mono text-sm text-muted-foreground">{bulletFormula.template}</p>

            <div className="mt-8 grid gap-3 md:grid-cols-3">
              {bulletFormula.examples.map((ex, i) => (
                <div key={i} className="rounded-2xl border border-border/60 bg-background/80 p-4 text-sm leading-relaxed">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Example {i + 1}
                  </p>
                  {ex}
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Tips */}
        <section id="tips" className="mt-24 scroll-mt-20">
          <motion.div {...fadeUp} className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-600 dark:text-fuchsia-400">
              Resume checklist
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">What the FDE template is built around</h2>
          </motion.div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resumeTips.map((tip, i) => (
              <motion.div
                key={tip.title}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.05 }}
                className="rounded-2xl border border-border/60 bg-card p-5"
              >
                <p className="font-semibold">{tip.title}</p>
                <p className="mt-1.5 text-sm text-muted-foreground">{tip.body}</p>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp} className="mt-12 flex flex-col items-center gap-3 text-center">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/resume" search={{ template: 'fde' }}>
                Open the AI Engineer / FDE template <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground">
              ATS-safe single column · Core competencies up top · Metrics highlighted automatically
            </p>
          </motion.div>
        </section>
      </main>
    </div>
  )
}

function RoleFact({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex gap-2.5">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div>
        <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</dt>
        <dd className="leading-snug">{value}</dd>
      </div>
    </div>
  )
}

function DemandBar({ demand }: { demand: number }) {
  return (
    <span className="flex shrink-0 items-center gap-2" title={`Asked for in ${demand} of ${POSTING_COUNT} postings`}>
      <span className="flex gap-0.5" aria-hidden="true">
        {Array.from({ length: POSTING_COUNT }, (_, i) => (
          <span
            key={i}
            className={`h-1.5 w-3 rounded-full ${i < demand ? 'bg-gradient-to-r from-fuchsia-500 to-violet-500' : 'bg-muted'}`}
          />
        ))}
      </span>
      <span className="w-7 text-right text-[11px] font-semibold tabular-nums text-muted-foreground">
        {demand}/{POSTING_COUNT}
      </span>
    </span>
  )
}

function ReadinessRing({ score }: { score: number }) {
  const radius = 52
  const circumference = 2 * Math.PI * radius
  const label = score >= 75 ? 'Strong match' : score >= 45 ? 'Getting there' : 'Early stage'

  return (
    <div className="relative mx-auto my-5 size-36">
      <svg viewBox="0 0 120 120" className="size-full -rotate-90">
        <defs>
          <linearGradient id="fde-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#d946ef" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r={radius} fill="none" strokeWidth="10" className="stroke-muted" />
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          stroke="url(#fde-ring)"
          strokeDasharray={circumference}
          initial={false}
          animate={{ strokeDashoffset: circumference * (1 - score / 100) }}
          transition={{ duration: 0.6, ease }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold tabular-nums">{score}%</span>
        <span className="text-[11px] text-muted-foreground">{label}</span>
      </div>
    </div>
  )
}
