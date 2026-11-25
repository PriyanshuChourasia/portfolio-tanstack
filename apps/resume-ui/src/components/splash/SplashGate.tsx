import type { AnyRouter } from '@tanstack/react-router'
import { AnimatePresence } from 'framer-motion'
import { useSplashGate } from './useSplashGate'
import { SplashScreen } from './SplashScreen'

export function SplashGate({ router }: { router: AnyRouter }) {
  const { open, progress, showHint, reducedMotion } = useSplashGate(router)
  const onSkip = () => {
    // skip handler — called when user presses Esc/Enter/Space or clicks
  }
  return (
    <AnimatePresence>
      {open && (
        <SplashScreen
          key="splash"
          progress={progress}
          showHint={showHint}
          reducedMotion={reducedMotion}
          onSkip={onSkip}
        />
      )}
    </AnimatePresence>
  )
}
