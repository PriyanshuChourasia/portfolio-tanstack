import { motion } from 'framer-motion'
import { GraduationCap, Rocket } from 'lucide-react'

export default function GetToKnowMe() {
  return (
    <section
      id="about"
      className="relative min-h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 flex items-center py-24 sm:py-32"
    >
      {/* Education background image — shown clearly with a subtle shadow scrim */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/education.webp"
          alt=""
          aria-hidden
          className="h-full w-full object-cover scale-110 blur-sm"
        />
        {/* Soft shadow so content stays readable without hiding the image */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/10 to-slate-950/60 dark:from-slate-950/70 dark:via-slate-950/15 dark:to-slate-950/70" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
            Get to Know <span className="text-cyan-600 dark:text-cyan-400">Me</span>
          </h2>
          <p className="text-slate-700 dark:text-slate-200 text-lg max-w-2xl mx-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)] dark:drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
            I&apos;m a Full-Stack Developer with a specialization in backend development and
            implementing design-driven frontend solutions.
          </p>
        </motion.div>

        {/* Education + Bootcamp */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-start gap-4 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/70 bg-white/95 dark:bg-slate-900/85 hover:border-cyan-400/40 transition-colors backdrop-blur-md shadow-xl"
          >
            <div className="shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="grow">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Education</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="font-semibold text-cyan-600 dark:text-cyan-400">JIS University</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Aug 2020 – May 2023</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                    Mechanical Engineering degree with focus on software engineering and web technologies.
                  </p>
                </div>
                <div className="space-y-1 pt-4 border-t border-slate-200 dark:border-slate-700/60">
                  <p className="font-semibold text-cyan-600 dark:text-cyan-400">Kingston Polytechnic College</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Aug 2017 – Aug 2020</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                    Diploma in Mechanical Engineering.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="flex items-start gap-4 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/70 bg-white/95 dark:bg-slate-900/85 hover:border-blue-400/40 transition-colors backdrop-blur-md shadow-xl"
          >
            <div className="shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 text-white">
              <Rocket className="w-5 h-5" />
            </div>
            <div className="grow">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Bootcamp</h3>
              <div className="space-y-1">
                <p className="font-semibold text-cyan-600 dark:text-cyan-400">Software Development</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Feb 2022 – May 2023</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                  Intensive full-stack development with{' '}
                  <span className="font-semibold text-slate-800 dark:text-white">System Design</span> from Wish Institute.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
