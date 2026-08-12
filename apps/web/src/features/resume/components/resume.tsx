/* eslint-disable react/no-unescaped-entities */

import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import { ExperienceSection } from './ExperienceSection'
import { CodingSkillsPanel } from './CodingSkillsPanel'
import { KnowledgePanel } from './KnowledgePanel'
import { ShareResumeButton } from './ShareResumeButton'
import { Combobox } from '@/components/ui/combobox'
import resumeData from '@/data/resume-data.json'

const resumeTypeOptions = [
  { value: 'fresher', label: 'Fresher Resume' },
  { value: 'experienced', label: 'Experienced Resume' },
  { value: '3-year', label: '3 Year Experienced' },
]

export function ResumeSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const skillsRef = useRef<HTMLDivElement>(null)
  const [resumeType, setResumeType] = useState('')

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const { scrollYProgress: skillsScrollYProgress } = useScroll({
    target: skillsRef,
    offset: ['start end', 'start start'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 24,
    mass: 0.25,
  })
  const smoothSkillsProgress = useSpring(skillsScrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.25,
  })

  const titleY = useTransform(smoothProgress, [0, 0.3], [80, 0])
  const titleOpacity = useTransform(smoothProgress, [0, 0.2], [0, 1])
  const bgOpacity = useTransform(
    smoothProgress,
    [0, 0.15, 0.85, 1],
    [0, 1, 1, 0],
  )

  const deepY1 = useTransform(smoothProgress, [0, 1], [220, -220])
  const deepX1 = useTransform(smoothProgress, [0, 1], [-60, 60])

  const deepY2 = useTransform(smoothProgress, [0, 1], [-180, 180])
  const deepX2 = useTransform(smoothProgress, [0, 1], [70, -70])

  const midY = useTransform(smoothProgress, [0, 1], [120, -120])
  const midX = useTransform(smoothProgress, [0, 1], [-40, 40])
  const midRotate = useTransform(smoothProgress, [0, 1], [-6, 6])
  const midScale = useTransform(smoothProgress, [0, 1], [1.06, 0.94])

  const experience = resumeData.experience
  const codingSkills = resumeData.codingSkills
  const knowledge = resumeData.knowledge

  return (
    <section
      id="experience"
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden bg-white py-32 dark:bg-black"
    >
      {/* Anime portrait background */}
      <div className="absolute inset-y-0 right-0 w-full sm:w-3/4 lg:w-1/2 pointer-events-none overflow-hidden">
        <img
          src="/myanime.png"
          alt=""
          aria-hidden
          className="absolute right-0 top-0 h-full w-auto max-w-none object-cover object-top opacity-60 dark:opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white dark:from-black via-white/40 dark:via-black/50 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white dark:from-black to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white dark:from-black to-transparent" />
      </div>

      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ opacity: bgOpacity }}
      >
        <motion.div
          className="absolute -top-40 -left-40 w-125 h-125 bg-linear-to-br from-cyan-500/14 to-transparent rounded-full blur-3xl"
          style={{ x: deepX1, y: deepY1, scale: midScale }}
        />
        <motion.div
          className="absolute top-24 -right-44 w-125 h-125 bg-linear-to-bl from-blue-500/12 to-transparent rounded-full blur-3xl"
          style={{ x: deepX2, y: deepY2, scale: midScale }}
        />
        <motion.div
          className="absolute top-[22%] left-[15%] w-90 h-90 bg-linear-to-tr from-emerald-500/10 to-transparent rounded-full blur-3xl"
          style={{ x: midX, y: midY }}
        />
        <motion.div
          className="absolute top-[35%] right-[18%] w-96 h-96 bg-linear-to-tl from-cyan-500/10 to-transparent rounded-full blur-3xl"
          style={{ x: midX, y: deepY2 }}
        />
        <motion.div
          className="absolute -bottom-44 left-[10%] w-125 h-125 bg-linear-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl"
          style={{ x: deepX1, y: deepY2, rotate: midRotate }}
        />
        <motion.div
          className="absolute -bottom-48 -right-48 w-140 h-140 bg-linear-to-tl from-cyan-500/12 to-transparent rounded-full blur-3xl"
          style={{ x: deepX2, y: deepY1, rotate: midRotate }}
        />

        <motion.div
          className="absolute top-[18%] left-[52%] w-md h-28 -rotate-12 rounded-full bg-linear-to-r from-blue-500/8 via-cyan-500/10 to-transparent blur-2xl"
          style={{ x: deepX2, y: midY, rotate: midRotate }}
        />
        <motion.div
          className="absolute bottom-[22%] left-[12%] w-120 h-24 rotate-12 rounded-full bg-linear-to-r from-transparent via-emerald-500/10 to-cyan-500/8 blur-2xl"
          style={{ x: deepX1, y: midY, rotate: midRotate }}
        />

        <div className="absolute inset-x-0 top-0 h-24 bg-white dark:bg-black" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-white dark:bg-black" />
      </motion.div>

      <div className="relative z-10 w-full mx-auto px-6">
        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
            Career <span className="text-cyan-600 dark:text-cyan-400">Overview</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto mt-4">
            Experience and the skills I use to ship products.
          </p>
          <div className="mt-6 flex justify-center items-center gap-4">
            <Combobox
              options={resumeTypeOptions}
              value={resumeType}
              onValueChange={setResumeType}
              placeholder="Resume Type"
              searchPlaceholder="Search resume type..."
            />
            <ShareResumeButton />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: '100px' }}
            className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/60 shadow-xl aspect-4/3 md:aspect-auto"
          >
            <img
              src="/myprofile.jpeg"
              alt="Priyanshu working at his desk"
              className="absolute inset-0 h-full w-full object-cover object-[65%_35%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/5 to-transparent" />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-cyan-400/20" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true, margin: '100px' }}
          >
            <ExperienceSection experiences={experience} />
          </motion.div>
        </div>

        <div ref={skillsRef} className="relative z-10 max-w-5xl mx-auto mt-24">
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: '100px' }}
          >
            <CodingSkillsPanel
              codingSkills={codingSkills}
              progress={smoothSkillsProgress}
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: '100px' }}
          className="mt-12 max-w-5xl mx-auto"
        >
          <KnowledgePanel items={knowledge} />
        </motion.div>
      </div>
    </section>
  )
}
