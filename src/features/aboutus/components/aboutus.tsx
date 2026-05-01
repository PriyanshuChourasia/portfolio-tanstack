  

import { motion } from 'framer-motion'
import { useScroll } from 'framer-motion'
import { GraduationCap, Rocket } from 'lucide-react'
import { useRef } from 'react'

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
                    <p className="font-semibold text-cyan-400">Universitas Indonesia</p>
                    <p className="text-sm text-slate-400 mt-1">Oct 2023 - Nov 2025</p>
                    <p className="text-sm text-slate-300 mt-2">
                      Computer Science degree with focus on software engineering and web technologies.
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
                    <p className="font-semibold text-cyan-400">HacktIvist Indonesia</p>
                    <p className="text-sm text-slate-400 mt-1">Jan 2022 - Nov 2022</p>
                    <p className="text-sm text-slate-300 mt-2">
                      Intensive full-stack development bootcamp covering modern web technologies and best practices.
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              'JavaScript',
              'TypeScript',
              'React',
              'Next.js',
              'Node.js',
              'Express.js',
              'MongoDB',
              'PostgreSQL',
            ].map((tech, index) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="p-4 rounded-lg bg-linear-to-br from-slate-800/50 to-slate-700/50 border border-slate-700/50 hover:border-cyan-500/30 text-center transition-colors"
              >
                <p className="font-semibold text-white text-sm">{tech}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
