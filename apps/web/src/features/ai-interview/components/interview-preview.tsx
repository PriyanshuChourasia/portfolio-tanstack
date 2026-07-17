import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'

const categories = [
  { label: 'Frontend', count: 5 },
  { label: 'Backend', count: 5 },
  { label: 'DevOps', count: 4 },
  { label: 'Behavioral', count: 4 },
  { label: 'System Design', count: 4 },
]

const sampleQuestions = [
  'What is the virtual DOM and how does it work?',
  'Explain the difference between SQL and NoSQL databases.',
  'How would you design a URL shortener?',
]

export default function InterviewPreviewSection() {
  return (
    <section className="relative w-full overflow-hidden bg-white dark:bg-slate-950 py-2 sm:py-4 md:py-6">
      <div className="relative z-10 mx-auto max-w-[88rem] px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-gradient-to-br dark:from-slate-900/95 dark:via-slate-800/90 dark:to-slate-700/80 p-4 sm:p-5 md:p-8 shadow-lg dark:shadow-2xl dark:shadow-black/30 backdrop-blur-xl"
        >
          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-start xl:gap-8">
            {/* Left — sample questions */}
            <div className="space-y-4">
              {sampleQuestions.map((q, index) => (
                <motion.div
                  key={q}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="group flex items-start gap-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-4 transition-colors hover:border-cyan-400/40 dark:hover:border-cyan-400/30"
                >
                  <span className="text-xs font-mono text-slate-300 dark:text-slate-600 mt-0.5">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {q}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Right — info + CTA */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                  Interview Prep
                </h2>
                <p className="max-w-md text-sm leading-7 text-slate-600 dark:text-slate-300 md:text-base">
                  Practice questions across Frontend, Backend, DevOps,
                  Behavioral, and System Design — with detailed answers.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <span
                    key={cat.label}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-xs font-medium text-slate-600 dark:text-slate-400"
                  >
                    {cat.label}
                    <span className="text-slate-300 dark:text-slate-600">
                      {cat.count}
                    </span>
                  </span>
                ))}
              </div>

              <Link
                to="/resume/ai-interview"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-cyan-400/30 bg-white dark:bg-white/5 px-5 py-3 text-sm font-semibold text-cyan-600 dark:text-cyan-200 transition-colors hover:border-cyan-400 hover:bg-cyan-50 dark:hover:border-cyan-300/40 dark:hover:bg-cyan-400/10 sm:w-auto"
              >
                Start practicing
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
