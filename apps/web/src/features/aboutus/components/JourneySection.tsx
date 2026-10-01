import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
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
  Cog,
  Cpu,
  GraduationCap,
  Pause,
  PenLine,
  PencilLine,
  Play,
  School,
  Wrench,
} from 'lucide-react'
import type { AnimationPlaybackControls } from 'framer-motion'

import resumeData from '@/data/resume-data.json'
import GearToCodeAnimation from '@/features/aboutus/components/GearToCodeAnimation'

type JourneyKind = 'work' | 'education'

// The extra fields are optional — only some milestones carry them
type JourneyItem = (typeof resumeData.experience)[number] & {
  kind: JourneyKind
  quote?: string
  image?: string
  emphasis?: string
  icon?: 'school' | 'cog'
}

const getQuote = (item: JourneyItem) => item.quote
const getImage = (item: JourneyItem) => item.image
const getEmphasis = (item: JourneyItem) => item.emphasis
const getIcon = (item: JourneyItem) => item.icon

// Emphasise the phrase in code rather than storing markup in the JSON. The phrase
// is data, so it's matched by index rather than pasted into a RegExp.
const splitEmphasis = (quote: string, emphasis?: string) => {
  if (!emphasis) return quote

  const at = quote.toLowerCase().indexOf(emphasis.toLowerCase())
  if (at === -1) return quote

  const end = at + emphasis.length

  return [
    quote.slice(0, at),
    <span
      key={at}
      className="text-[#E9D9F5] font-semibold not-italic"
    >
      {quote.slice(at, end)}
    </span>,
    quote.slice(end),
  ]
}

// "2023 - Present" → 2023; an open-ended period counts as the latest end year
const startYear = (period: string) => parseInt(period, 10) || 0
const endYear = (period: string) => {
  const match = period.match(/(\d{4})\s*$/)
  return match ? parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER
}

// Oldest first, so the story runs forward in time.
// The JSON import widens `icon` to `string`, so it is narrowed back to the union here.
const journey: Array<JourneyItem> = [
  ...resumeData.experience.map((item) => ({ ...item, kind: 'work' as const })),
  ...resumeData.education.map((item) => ({
    ...item,
    kind: 'education' as const,
    icon: item.icon as JourneyItem['icon'],
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

const MOTTO = ['Still building', 'still learning', 'still shipping']

const badges = {
  work: {
    label: 'Work',
    icon: Briefcase,
    className: 'border border-[#C19ADD]/30 bg-[#C19ADD]/15 text-[#E9D9F5]',
  },
  education: {
    label: 'Education',
    icon: GraduationCap,
    className: 'border border-white/15 bg-white/10 text-white/70',
  },
} as const

const SLIDE_MS = 5000
const INTRO_MS = 8000
const QUOTE_MS = 7000

// The opening card and any slide carrying a quote stay on screen longer
const slideDuration = (slide: Slide) => {
  if (slide.type === 'intro') return INTRO_MS
  if (getQuote(slide.item)) return QUOTE_MS

  return SLIDE_MS
}

const CONTROL_BUTTON =
  'flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-[#C19ADD] hover:bg-[#C19ADD] hover:text-[#0B1026] focus-visible:ring-2 focus-visible:ring-[#C19ADD] focus-visible:outline-none'

const pad = (value: number) => String(value).padStart(2, '0')

/* =========================================================
    MILESTONE ILLUSTRATIONS
========================================================= */

// The small row of symbols under the main icon
const SUB_ICON_ROW = 'flex items-center gap-1.5 text-[#E9D9F5]'

const illustrations = {
  school: {
    Main: School,
    // "shifting from pencil to pen"
    sub: <PencilLine size={18} />,
    subAfter: <PenLine size={18} />,
  },
  cog: {
    Main: Cog,
    // a nod to "towards engineering"
    sub: <Wrench size={18} />,
    subAfter: <Cpu size={18} />,
  },
} as const satisfies Record<string, unknown>

/* =========================================================
    MOTTO — highlight loops while the story plays
========================================================= */

const MOTTO_STEP_MS = 1600
const MOTTO_IDLE_COLOR = '#1f2937' // gray-800
const MOTTO_ACTIVE_COLOR = '#8353AD'
const MOTTO_DOT_IDLE = '#C19ADD'

function Motto({ playing }: { playing: boolean }) {
  const reducedMotion = Boolean(useReducedMotion())
  const ref = useRef<HTMLParagraphElement>(null)

  const inView = useInView(ref, { amount: 0.6 })

  const [active, setActive] = useState(0)

  // Loop runs only while the story plays and the motto is on screen.
  // Pausing freezes `active` where it is, and resuming carries on from there.
  useEffect(() => {
    if (reducedMotion || !playing || !inView) return

    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % MOTTO.length)
    }, MOTTO_STEP_MS)

    return () => clearInterval(id)
  }, [inView, playing, reducedMotion])

  return (
    <p
      ref={ref}
      aria-label={MOTTO.join(', ')}
      className="mt-16 flex flex-wrap items-center justify-center gap-x-4 gap-y-2"
    >
      {MOTTO.map((phrase, i) => {
        const isActive = !reducedMotion && active === i
        // A dot sits between phrases i and i + 1, so it lights for either
        const dotActive =
          !reducedMotion && (active === i || active === i + 1)

        return (
          <Fragment key={phrase}>
            {/* Entrance on the wrapper, so it never fights the loop's lift */}
            <motion.span
              aria-hidden="true"
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                duration: 0.5,
                ease: 'easeOut',
                delay: reducedMotion ? 0 : i * 0.12,
              }}
              className="inline-block"
            >
              <motion.span
                aria-hidden="true"
                animate={{
                  y: isActive ? -3 : 0,
                  opacity: reducedMotion ? 1 : isActive ? 1 : 0.45,
                  color: isActive ? MOTTO_ACTIVE_COLOR : MOTTO_IDLE_COLOR,
                }}
                transition={
                  reducedMotion
                    ? { duration: 0 }
                    : {
                        y: { type: 'spring', stiffness: 400, damping: 20 },
                        opacity: { duration: 0.3 },
                        color: { duration: 0.3 },
                      }
                }
                className="relative inline-block font-mono text-sm font-bold tracking-[0.2em] text-gray-800 uppercase md:text-base"
              >
                {phrase}

                {/* Underline draws in from the left while active */}
                <motion.span
                  aria-hidden="true"
                  initial={false}
                  animate={{ scaleX: isActive ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="absolute left-0 -bottom-1 h-0.5 w-full origin-left bg-[#8353AD]"
                />
              </motion.span>
            </motion.span>

            {/* Separator grows and turns violet beside the active phrase */}
            {i < MOTTO.length - 1 && (
              <motion.span
                aria-hidden="true"
                animate={{ scale: dotActive ? 1.6 : 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                style={{
                  backgroundColor: dotActive
                    ? MOTTO_ACTIVE_COLOR
                    : MOTTO_DOT_IDLE,
                }}
                className="h-1.5 w-1.5 shrink-0 rounded-full"
              />
            )}
          </Fragment>
        )
      })}
    </p>
  )
}

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

  // The visual settles in from slightly small, alongside the other items
  const visualVariants = {
    enter: reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.95 },
    center: {
      opacity: 1,
      y: 0,
      scale: 1,
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

  // All of these come from the data — nothing is Diploma- or 10th Grade-specific
  const quote = isIntro ? undefined : getQuote(current.item)
  const emphasis = isIntro ? undefined : getEmphasis(current.item)
  const image = isIntro ? undefined : getImage(current.item)
  const icon = isIntro ? undefined : getIcon(current.item)

  // image (photo) > icon (illustration) > nothing
  const Illustration = icon ? illustrations[icon] : undefined
  const hasVisual = Boolean(image || Illustration)

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
            Journey so{' '}
            <span className="pr-1 text-[#8353AD] italic">far</span>
            <span className="text-[#8353AD]">.</span>
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
            className="relative min-h-[500px] overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(145deg,#0B1026_0%,#0A0F1F_45%,#07070D_100%)] shadow-[0_24px_64px_rgba(11,16,38,0.45)] focus-visible:ring-2 focus-visible:ring-[#C19ADD] focus-visible:outline-none md:min-h-[580px]"
          >
            {/* --------------------------------------------
                BACKDROP — permanent, behind the progress bar,
                slide and controls
            -------------------------------------------- */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
            >
              {/* Light purple glows */}
              <div className="absolute -top-16 -right-16 h-80 w-80 rounded-full bg-[#C19ADD]/25 blur-3xl" />

              <div className="absolute -bottom-12 -left-12 h-72 w-72 rounded-full bg-[#8353AD]/20 blur-3xl" />

              {/* Faint dark-blue wash through the centre */}
              <div className="absolute top-1/2 left-1/2 h-64 w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1E2A5A]/40 blur-3xl" />

              {/* Subtle dotted texture */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff0d_1px,transparent_1px)] bg-[size:18px_18px] opacity-60" />
            </div>

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
                  className="h-1 flex-1 cursor-pointer overflow-hidden rounded-full bg-white/15 transition-colors hover:bg-white/25 focus-visible:ring-2 focus-visible:ring-[#C19ADD] focus-visible:outline-none"
                >
                  <motion.span
                    className="block h-full w-full origin-left bg-[#C19ADD]"
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
                          className="font-mono text-xs tracking-[0.4em] text-[#C19ADD] uppercase md:text-sm"
                        >
                          My Story
                        </motion.span>

                        {/* Middle */}
                        <div className="flex flex-col items-center">
                          <motion.div variants={itemVariants}>
                            <GearToCodeAnimation
                              tone="dark"
                              className="mb-3 h-24 w-36 md:h-32 md:w-44"
                            />
                          </motion.div>

                          <motion.span
                            variants={itemVariants}
                            className="text-base text-white/60 md:text-lg"
                          >
                            The journey from
                          </motion.span>

                          <p className="mt-3 flex max-w-4xl flex-wrap items-center justify-center gap-x-2 gap-y-1 text-2xl font-black tracking-[-0.03em] text-white md:text-5xl">
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
                          className="font-mono text-[11px] tracking-[0.3em] text-white/50 italic uppercase"
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
                          <span className="font-mono text-sm text-[#C19ADD]">
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

                        {/* Text — single column, or the left half when a
                            visual is present */}
                        <div
                          className={
                            hasVisual
                              ? 'relative md:grid md:grid-cols-[1fr_auto] md:items-center md:gap-10'
                              : 'contents'
                          }
                        >
                          <div className={hasVisual ? 'order-2 md:order-1' : ''}>
                            {/* Title */}
                            <motion.h3
                              variants={itemVariants}
                              className="relative mt-8 text-3xl font-black tracking-[-0.03em] text-white md:text-6xl"
                            >
                              {current.item.title}
                            </motion.h3>

                            {/* Company */}
                            <motion.p
                              variants={itemVariants}
                              className="relative mt-3 text-lg text-white/60 md:text-xl"
                            >
                              {current.item.company}
                            </motion.p>

                            {/* Description — the quote replaces it on small
                                screens, so it is hidden there */}
                            <motion.p
                              variants={itemVariants}
                              className={`relative mt-8 max-w-3xl text-base leading-relaxed text-white/70 md:text-xl ${
                                quote ? 'hidden md:block' : ''
                              }`}
                            >
                              {current.item.desc}
                            </motion.p>

                            {/* Quote */}
                            {quote && (
                              <motion.blockquote
                                variants={itemVariants}
                                className="relative mt-6 max-w-2xl border-l-2 border-[#C19ADD] pl-5 text-base leading-relaxed text-white/80 italic md:mt-8 md:text-lg"
                              >
                                <span
                                  aria-hidden="true"
                                  className="absolute -top-4 -left-1 font-black text-4xl text-[#C19ADD]"
                                >
                                  &ldquo;
                                </span>

                                {splitEmphasis(quote, emphasis)}
                              </motion.blockquote>
                            )}
                          </div>

                          {/* Visual — above the text on mobile, beside it on md */}
                          {hasVisual && (
                            <motion.div
                              variants={visualVariants}
                              className="order-1 mb-6 md:order-2 md:mb-0"
                            >
                              {/* A photo wins over an illustration */}
                              {image ? (
                                <img
                                  src={image}
                                  alt=""
                                  className="h-28 w-28 rounded-2xl border border-white/15 object-cover shadow-md md:h-56 md:w-56"
                                />
                              ) : (
                                Illustration && (
                                  <div className="flex h-28 w-28 flex-col items-center justify-center gap-2 rounded-2xl border border-[#C19ADD]/30 bg-[#C19ADD]/10 md:h-56 md:w-56">
                                    <Illustration.Main
                                      size={48}
                                      strokeWidth={1.5}
                                      className="h-12 w-12 text-[#C19ADD] md:h-16 md:w-16"
                                    />

                                    <div className={SUB_ICON_ROW}>
                                      {Illustration.sub}

                                      <ArrowRight size={14} />

                                      {Illustration.subAfter}
                                    </div>
                                  </div>
                                )
                              )}
                            </motion.div>
                          )}
                        </div>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* --------------------------------------------
                CONTROLS
            -------------------------------------------- */}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-white/10 bg-[#07070D]/60 px-6 py-4 backdrop-blur-sm">
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

              <span className="font-mono text-xs text-white/50">
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

        {/* --------------------------------------------
            MOTTO — driven by the player's playback state
        -------------------------------------------- */}
        <Motto playing={isPlaying} />
      </div>
    </section>
  )
}