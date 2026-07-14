import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import worksData from '@/data/works-data.json'

interface WorkCardData {
  id: number
  title: string
  client?: string
  category: string
  description: string
  image: string
  link: string
}

const cards: WorkCardData[] = worksData.items.slice(0, 4).map((item, index) => ({
  id: index + 1,
  title: item.title,
  client: item.client,
  category: item.category,
  description: item.description,
  image: item.image,
  link: item.link,
}))

interface CardProps {
  i: number
  card: WorkCardData
  progress: any
  range: [number, number]
  targetScale: number
}

const Card = ({ i, card, progress, range, targetScale }: CardProps) => {
  const container = useRef(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start'],
  })

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1])
  const scale = useTransform(progress, range, [1, targetScale])

  return (
    <div
      ref={container}
      className="relative flex h-auto w-full items-start justify-center lg:sticky lg:top-0 lg:h-screen lg:items-center bg-transparent"
    >
      <motion.div
        style={{
          scale,
          top: `calc(-5vh + ${i * 25}px)`,
        }}
        className="relative flex w-[92%] max-w-[90%] flex-col overflow-hidden rounded-[30px] p-5 sm:p-8 lg:h-125 lg:flex-row lg:p-12 border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/90 shadow-xl dark:shadow-black/40 backdrop-blur-xl"
      >
        {/* Light mode accent */}
        <div className="absolute inset-0 bg-linear-to-br from-cyan-50/60 via-transparent to-blue-50/40 dark:from-cyan-400/10 dark:via-transparent dark:to-fuchsia-400/10 pointer-events-none" />

        <div className="relative z-10 flex h-full w-full flex-col gap-6 lg:flex-row lg:gap-10">
          <div className="flex w-full flex-col justify-between lg:w-[45%]">
            <div className="space-y-4 sm:space-y-5">
              <div className="inline-flex w-fit rounded-full border border-cyan-400/30 bg-cyan-50 dark:bg-cyan-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-600 dark:text-cyan-200">
                {card.category}
              </div>

              <div className="space-y-3">
                <h1 className="text-2xl font-bold leading-tight text-slate-900 dark:text-white sm:text-3xl">
                  {card.title}
                </h1>
                {card.client && (
                  <h4 className="text-base font-semibold text-slate-600 dark:text-slate-300">
                    {card.client}
                  </h4>
                )}
                <p className="text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-[15px]">
                  {card.description}
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-5 lg:pt-6">
              <div className="h-px w-full bg-slate-200 dark:bg-white/10" />
              <Link
                to="/projects/$id"
                params={{ id: String(card.id) }}
                className="inline-flex w-full items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-50 dark:bg-cyan-400/12 px-5 py-3 text-sm font-semibold text-cyan-600 dark:text-cyan-100 transition-all hover:border-cyan-400 hover:bg-cyan-100 dark:hover:border-cyan-300/40 dark:hover:bg-cyan-400/20 sm:w-fit"
                aria-label={`View project ${card.title}`}
              >
                View the project
              </Link>
            </div>
          </div>

          <div className="flex w-full items-center justify-center lg:w-[55%]">
            <div className="relative h-72 w-full overflow-hidden rounded-[26px] border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-900/40 shadow-lg sm:h-80 lg:h-92">
              <motion.div style={{ scale: imageScale }} className="h-full w-full">
                <img
                  src={card.image}
                  alt={card.title}
                  className="h-full w-full object-cover"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export function ParallaxCards() {
  const container = useRef(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'end start'],
  })

  return (
    <div ref={container}>
      {cards.map((card, i) => {
        const targetScale = 1 - (cards.length - i) * 0.05
        const range: [number, number] = [i * 0.25, 1]

        return (
          <Card
            key={card.id}
            i={i}
            card={card}
            progress={scrollYProgress}
            range={range}
            targetScale={targetScale}
          />
        )
      })}
    </div>
  )
}
