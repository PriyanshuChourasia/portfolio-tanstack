import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Home from './HomePage'
import { INTRO_DURATION_MS, IntroLoader } from '@/components/IntroLoader'

export function PortfolioLayout() {
  const [introDone, setIntroDone] = useState(false)

  useEffect(() => {
    const t = window.setTimeout(() => setIntroDone(true), INTRO_DURATION_MS)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <>
      <AnimatePresence>{!introDone && <IntroLoader key="intro" />}</AnimatePresence>
      {/* Mount the page as the curtain lifts so the hero's entrance plays in view */}
      {introDone && <Home />}
    </>
  )
}
