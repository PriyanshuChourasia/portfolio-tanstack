  

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

interface ScrollStackProps {
  children: React.ReactNode[]
}

const ScrollStack = ({ children }: ScrollStackProps) => {
  return (
    <div className="w-full">
      {children.map((child, i) => (
        <StackCard key={i} index={i}>
          {child}
        </StackCard>
      ))}
    </div>
  )
}

const StackCard = ({ children }: any) => {
  const ref = useRef(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start center']
  })

  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, 0.9]
  )

  return (
    <div ref={ref} className="h-[120vh]">
      
      <motion.div
        style={{ scale }}
        className="sticky top-[15vh] h-80 w-full max-w-3xl mx-auto
                   p-8 rounded-[30px]
                   backdrop-blur-xl bg-white/80 dark:bg-white/10 border border-slate-200 dark:border-white/20 shadow-2xl"
      >
        {children}
      </motion.div>

    </div>
  )
}

export default ScrollStack