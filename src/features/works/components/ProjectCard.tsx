
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import worksData from '@/data/works-data.json'

interface WorkCardData {
  id: number
  title: string
  category: string
  description: string
  image: string
  link: string
}

const cards: WorkCardData[] = worksData.items.slice(0, 4).map((item, index) => ({
  id: index + 1,
  title: item.title,
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
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.88), rgba(8, 15, 30, 0.72))',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 30px 90px rgba(2, 6, 23, 0.45)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          scale,
          top: `calc(-5vh + ${i * 25}px)`,
        }}
        className="relative flex w-[92%] max-w-[90%] flex-col overflow-hidden rounded-[30px] p-5 sm:p-8 lg:h-125 lg:flex-row lg:p-12"
      >
        <div className="absolute inset-0 bg-linear-to-br from-cyan-400/10 via-transparent to-fuchsia-400/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.14),transparent_35%)]" />

        <div className="relative z-10 flex h-full w-full flex-col gap-6 lg:flex-row lg:gap-10">
          <div className="flex w-full flex-col justify-between lg:w-[45%]">
            <div className="space-y-4 sm:space-y-5">
              <div className="inline-flex w-fit rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-200">
                {card.category}
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold leading-tight text-white drop-shadow-[0_1px_10px_rgba(0,0,0,0.22)] sm:text-3xl">
                  {card.title}
                </h2>
                <p className="text-sm leading-7 text-slate-300 sm:text-[15px]">
                  {card.description}
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-5 lg:pt-6">
              <div className="h-px w-full bg-white/10" />
              <a
                href={`/projects/${card.id}`}
                className="inline-flex w-full items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/12 px-5 py-3 text-sm font-semibold text-cyan-100 transition-all hover:border-cyan-300/40 hover:bg-cyan-400/20 sm:w-fit"
                aria-label={`View project ${card.title}`}
              >
                View the project
              </a>
            </div>
          </div>

          <div className="flex w-full items-center justify-center lg:w-[55%]">
            <div className="relative h-72 w-full overflow-hidden rounded-[26px] border border-white/10 bg-slate-900/40 shadow-2xl shadow-black/30 sm:h-80 lg:h-92">
              <motion.div
                style={{ scale: imageScale }}
                className="h-full w-full"
              >
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
