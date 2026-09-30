import { useCallback, useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
} from 'framer-motion'
import {
  ArrowRight,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Pause,
  Play,
} from 'lucide-react'
import type { AnimationPlaybackControls } from 'framer-motion'

import resumeData from '@/data/resume-data.json'
import GearToCodeAnimation from '@/features/aboutus/components/GearToCodeAnimation'

type JourneyKind = 'work' | 'education'

type JourneyItem = (typeof resumeData.experience)[number] & {
  kind: JourneyKind
}

// "2023 - Present" → 2023; an open-ended period counts as the latest end year
const startYear = (period: string) => parseInt(period, 10) || 0
const endYear = (period: string) => {
  const match = period.match(/(\d{4})\s*$/)
  return match ? parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER
}

// Oldest first, so the story runs forward in time
const journey: Array<JourneyItem> = [
  ...resumeData.experience.map((item) => ({ ...item, kind: 'work' as const })),
  ...resumeData.education.map((item) => ({
    ...item,
    kind: 'education' as const,
  })),
].sort(
  (a, b) =>
    startYear(a.period) - startYear(b.period) ||
    endYear(a.period) - endYear(b.period),
)

type Slide = { type: 'intro' } | { type: 'milestone'; item: JourneyItem }

// The film-style title card plays before the first milestone
const slides: Array<Slide> = [
  { type: 'intro' },
  ...journey.map((item) => ({ type: 'milestone' as const, item })),
]

const INTRO_PATH = ['Mechanical', 'Software Developer', 'Computer Science']

const badges = {
  work: {
    label: 'Work',
    icon: Briefcase,
    className: 'bg-[#C19ADD]/20 text-[#441573]',
  },
  education: {
    label: 'Education',
    icon: GraduationCap,
    className: 'bg-gray-100 text-gray-600',
  },
} as const

const SLIDE_MS = 5000
const INTRO_MS = 8000

// The opening card gets a little longer on screen
const slideDuration = (slide: Slide) =>
  slide.type === 'intro' ? INTRO_MS : SLIDE_MS

const CONTROL_BUTTON =
  'flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition-colors hover:border-[#8353AD] hover:bg-[#8353AD] hover:text-white focus-visible:ring-2 focus-visible:ring-[#C19ADD] focus-visible:outline-none'

const pad = (value: number) => String(value).padStart(2, '0')

/* =========================================================
    SECTION
========================================================= */

export default function JourneySection() {
  const reducedMotion = Boolean(useReducedMotion())

  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [pausedByUser, setPausedByUser] = useState<boolean | null>(null)
  const [hovered, setHovered] = useState(false)
  const [tabVisible, setTabVisible] = useState(true)

  const playerRef = useRef<HTMLDivElement>(null)
  const progress = useMotionValue(0)
  const controlsRef = useRef<AnimationPlaybackControls | null>(null)

  const inView = useInView(playerRef, { amount: 0.5 })

  // "null" = no explicit choice yet, so the autoplay rules decide
  const wantsPlayback = pausedByUser === null ? !reducedMotion : !pausedByUser
  const isPlaying =
    wantsPlayback && inView && !hovered && tabVisible

  const indexRef = useRef(0)
  indexRef.current = index

  const goTo = useCallback((nextIndex: number, nextDirection?: number) => {
    setIndex((nextIndex + slides.length) % slides.length)
    setDirection(nextDirection ?? (nextIndex > indexRef.current ? 1 : -1))
  }, [])

  const goNext = useCallback(() => {
    setIndex((prev) => (prev + 1) % slides.length)
    setDirection(1)
  }, [])

  const goPrev = useCallback(() => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length)
    setDirection(-1)
  }, [])

  // Flips the user's *intent*, not the derived playback state — otherwise
  // pressing Play while hovered (already paused by hover) would latch it paused.
  const togglePlayback = useCallback(() => {
    setPausedByUser((prev) => {
      const wantsIt = prev === null ? !reducedMotion : !prev
      return wantsIt
    })
  }, [reducedMotion])

  const current = slides[index]
  const isIntro = current.type === 'intro'

  /* -------------------------------------------------------
      Progress — one animation per slide, paused/resumed in place
  ------------------------------------------------------- */

  useEffect(() => {
    controlsRef.current?.stop()
    progress.set(0)

    const controls = animate(progress, 1, {
      duration: slideDuration(slides[index]) / 1000,
      ease: 'linear',
      onComplete: goNext,
    })

    controlsRef.current = controls

    return () => {
      controls.stop()
      if (controlsRef.current === controls) controlsRef.current = null
    }
  }, [goNext, index, progress])

  // Sync the running animation with the current playback state. Listing `index`
  // keeps a freshly created animation in step when the slide changes.
  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return

    if (isPlaying) {
      controls.play()
    } else {
      controls.pause()
    }
  }, [index, isPlaying])

  // Pause while the tab is hidden
  useEffect(() => {
    const onVisibilityChange = () => setTabVisible(!document.hidden)

    onVisibilityChange()
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () =>
      document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [])

  /* -------------------------------------------------------
      Motion variants
  ------------------------------------------------------- */

  // Milestone text steps in tightly; the intro breathes between its lines
  const stagger = reducedMotion ? 0 : isIntro ? 0.15 : 0.06

  const slideVariants = {
    enter: (dir: number) =>
      reducedMotion ? { opacity: 0 } : { opacity: 0, x: 40 * dir },
    center: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.45,
        ease: 'easeOut' as const,
        staggerChildren: stagger,
      },
    },
    exit: (dir: number) =>
      reducedMotion ? { opacity: 0 } : { opacity: 0, x: -40 * dir },
  }

  const itemVariants = {
    enter: reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
    center: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' as const },
    },
  }

  /* -------------------------------------------------------
      Interaction handlers
  ------------------------------------------------------- */

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goPrev()
      return
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      goNext()
      return
    }

    // Only when the player itself is focused, so buttons keep their own behaviour
    if (event.target === event.currentTarget && event.code === 'Space') {
      event.preventDefault()
      togglePlayback()
    }
  }

  const onDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x < -60) {
      goNext()
    } else if (info.offset.x > 60) {
      goPrev()
    }
  }

  const badge = isIntro ? null : badges[current.item.kind]
  const BadgeIcon = badge?.icon

  const segmentLabel = (slide: Slide, position: number) =>
    slide.type === 'intro'
      ? `Go to ${pad(position)}: My Story`
      : `Go to ${pad(position)}: ${slide.item.title}`

  return (
    <section
      id="journey"
      className="relative w-full scroll-mt-24 border-t border-gray-200 bg-[#FAFAFA] pt-10 pb-20 md:pt-14 md:pb-28"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10 lg:px-12">
        {/* =====================================================
            HEADER
        ===================================================== */}
        <motion.header
          initial={reducedMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-10"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-gray-500">
            02 / Journey
          </span>

          <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] text-gray-900 md:text-5xl lg:text-6xl">
            Journey so far
            <span className="text-gray-400">.</span>
          </h2>

          <p className="mt-4 max-w-xl text-gray-600">
            From mechanical engineering to shipping software: the path so far.
          </p>
        </motion.header>

        {/* =====================================================
            STORY PLAYER
        ===================================================== */}
        <div className="mx-auto w-full">
          <div
            ref={playerRef}
            role="region"
            aria-roledescription="carousel"
            aria-label="Journey so far"
            tabIndex={0}
            onKeyDown={onKeyDown}
            className="relative min-h-[500px] overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_24px_64px_rgba(0,0,0,0.08)] focus-visible:ring-2 focus-visible:ring-[#C19ADD] focus-visible:outline-none md:min-h-[580px]"
          >
            {/* Soft glow behind the content */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-16 -right-12 h-72 w-72 rounded-full bg-[#C19ADD]/25 blur-3xl"
            />

            {/* --------------------------------------------
                PROGRESS SEGMENTS
            -------------------------------------------- */}
            <div className="flex gap-1.5 px-6 pt-6">
              {slides.map((slide, i) => (
                <button
                  key={slide.type === 'intro' ? 'intro' : `${slide.item.period}-${slide.item.title}`}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={segmentLabel(slide, i + 1)}
                  className="h-1 flex-1 cursor-pointer overflow-hidden rounded-full bg-gray-200 transition-colors hover:bg-gray-300 focus-visible:ring-2 focus-visible:ring-[#C19ADD] focus-visible:outline-none"
                >
                  <motion.span
                    className="block h-full w-full origin-left bg-[#8353AD]"
                    style={{
                      scaleX: i < index ? 1 : i === index ? progress : 0,
                    }}
                  />
                </button>
              ))}
            </div>

            {/* --------------------------------------------
                SLIDES — inset between the progress bar and controls
            -------------------------------------------- */}
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={onDragEnd}
              // Only a mouse over the slide holds it; touch would leave it stuck paused,
              // and the progress/control bars stay outside so Play always responds
              onPointerEnter={(event) =>
                event.pointerType === 'mouse' && setHovered(true)
              }
              onPointerLeave={() => setHovered(false)}
              className="absolute inset-x-0 top-[52px] bottom-[73px] cursor-grab active:cursor-grabbing"
            >
              <div className="h-full" aria-live={isPlaying ? 'off' : 'polite'}>
                <AnimatePresence mode="wait" initial={false} custom={direction}>
                  <motion.div
                    key={index}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className={
                      isIntro
                        ? 'relative flex h-full flex-col items-center justify-between overflow-hidden px-6 py-6 text-center md:px-16 md:py-10'
                        : 'relative flex h-full flex-col overflow-hidden px-6 py-10 md:px-16 md:py-16'
                    }
                  >
                    {current.type === 'intro' ? (
                      /* --------------------------------------
                          INTRO — "My Story" title card
                      -------------------------------------- */
                      <>
                        {/* Top */}
                        <motion.span
                          variants={itemVariants}
                          className="font-mono text-xs tracking-[0.4em] text-[#8353AD] uppercase md:text-sm"
                        >
                          My Story
                        </motion.span>

                        {/* Middle */}
                        <div className="flex flex-col items-center">
                          <motion.div variants={itemVariants}>
                            <GearToCodeAnimation className="mb-3 h-24 w-36 md:h-32 md:w-44" />
                          </motion.div>

                          <motion.span
                            variants={itemVariants}
                            className="text-base text-gray-500 md:text-lg"
                          >
                            The journey from
                          </motion.span>

                          <p className="mt-3 flex max-w-4xl flex-wrap items-center justify-center gap-x-2 gap-y-1 text-2xl font-black tracking-[-0.03em] text-gray-900 md:text-5xl">
                            {INTRO_PATH.map((stage, stageIndex) => (
                              <span
                                key={stage}
                                className="contents"
                              >
                                <motion.span
                                  variants={itemVariants}
                                  className="inline-block"
                                >
                                  {stage}
                                </motion.span>

                                {stageIndex < INTRO_PATH.length - 1 && (
                                  <ArrowRight
                                    aria-hidden="true"
                                    size={20}
                                    strokeWidth={2.5}
                                    className="shrink-0 text-[#C19ADD] md:h-9 md:w-9"
                                  />
                                )}
                              </span>
                            ))}
                          </p>
                        </div>

                        {/* Bottom */}
                        <motion.span
                          variants={itemVariants}
                          className="font-mono text-[11px] tracking-[0.3em] text-gray-400 italic uppercase"
                        >
                          Based on a true story
                        </motion.span>
                      </>
                    ) : (
                      /* --------------------------------------
                          MILESTONE
                      -------------------------------------- */
                      <>
                        {/* Top row */}
                        <motion.div
                          variants={itemVariants}
                          className="relative flex flex-wrap items-center justify-between gap-3"
                        >
                          <span className="font-mono text-sm text-[#8353AD]">
                            {current.item.period}
                          </span>

                          {badge && BadgeIcon && (
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold tracking-[0.15em] uppercase ${badge.className}`}
                            >
                              <BadgeIcon size={12} />
                              {badge.label}
                            </span>
                          )}
                        </motion.div>

                        {/* Title */}
                        <motion.h3
                          variants={itemVariants}
                          className="relative mt-8 text-3xl font-black tracking-[-0.03em] text-gray-900 md:text-6xl"
                        >
                          {current.item.title}
                        </motion.h3>

                        {/* Company */}
                        <motion.p
                          variants={itemVariants}
                          className="relative mt-3 text-lg text-gray-500 md:text-xl"
                        >
                          {current.item.company}
                        </motion.p>

                        {/* Description */}
                        <motion.p
                          variants={itemVariants}
                          className="relative mt-8 max-w-3xl text-base leading-relaxed text-gray-600 md:text-xl"
                        >
                          {current.item.desc}
                        </motion.p>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* --------------------------------------------
                CONTROLS
            -------------------------------------------- */}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-gray-100 bg-white/80 px-6 py-4 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous slide"
                  className={CONTROL_BUTTON}
                >
                  <ChevronLeft size={18} />
                </button>

                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next slide"
                  className={CONTROL_BUTTON}
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              <span className="font-mono text-xs text-gray-500">
                {pad(index + 1)} / {pad(slides.length)}
              </span>

              <button
                type="button"
                onClick={togglePlayback}
                aria-label={wantsPlayback ? 'Pause journey' : 'Play journey'}
                className={CONTROL_BUTTON}
              >
                {wantsPlayback ? <Pause size={18} /> : <Play size={18} />}
              </button>
            </div>
          </div>
        </div>

        <p className="mt-16 text-center font-mono text-[11px] tracking-[0.2em] text-gray-400 uppercase">
          Still building · still learning · still shipping
        </p>
      </div>
    </section>
  )
}