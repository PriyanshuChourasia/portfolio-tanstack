import { useEffect } from 'react'

interface SplashScreenProps {
  progress: number
  showHint: boolean
  reducedMotion: boolean | null
  onSkip: () => void
}

export function SplashScreen({ progress, showHint, reducedMotion, onSkip }: SplashScreenProps) {
  // No internal state — SplashScreen is purely presentational,
  // controlled entirely by useSplashGate/open state.
  // onSkip is called when the user presses Esc/Enter/Space or clicks.

  // Progress bar width style
  const progressBarStyle = reducedMotion
    ? { width: `${progress * 100}%` }
    : { width: `${progress * 100}%` }

  useEffect(() => {
    // Handle skip via Escape/Enter/Space keys and clicks while splash is visible
    const keydownHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        onSkip()
      }
    }
    const clickHandler = () => {
      onSkip()
    }
    window.addEventListener('keydown', keydownHandler)
    window.addEventListener('click', clickHandler)
    return () => {
      window.removeEventListener('keydown', keydownHandler)
      window.removeEventListener('click', clickHandler)
    }
  }, [onSkip])

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Resume Builder"
      className="fixed inset-0 z-[100] bg-background dark:bg-gray-950 print:hidden"
      style={{ opacity: reducedMotion ? 1 : 1, transition: reducedMotion ? undefined : 'opacity 0.6s ease' } }
    >
      <div className="relative w-full max-w-2xl pt-20 pb-20">
        {/* Logo tile: glassy card */}
        <div
          className="relative w-20 h-20 rounded-2xl bg-white/60 dark:bg-white/5 border border-white/20 backdrop-blur-lg soft-cyan-glow"
          style={{ pointerEvents: 'auto' }}
        >
          <img
            src="/resume_logo.png"
            alt="Resume logo"
            className="w-6 h-6 object-contain mx-auto my-1"
            style={{ pointerEvents: 'none' }}
          />
        </div>

        {/* Resume lines (A4-shaped paper with staggered skeleton text) */}
        {progress < 100 && (
          <div className="mt-3 flex flex-col items-center gap-1.5">
            <div
              className="relative w-24 h-32 rounded-md bg-white dark:bg-zinc-900 p-1.5 shadow-lg"
              style={{ pointerEvents: 'auto' }}
            >
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className="block h-1.5 rounded w-full bg-gradient-to-r from-primary to-accent overflow-hidden"
                  style={{
                    width: `${10 + i * 8}%`,
                    animation: `scaleIn 0.5s ease-out ${i * 0.08}s forwards`,
                    transformOrigin: 'left'
                  }}
                />
              ))}

              <span
                className="absolute top-1 right-1 w-3 h-3 rounded-full bg-primary opacity-0"
                style={{ transition: 'opacity 0.4s 0.45s' }}
              />
            </div>
          </div>
        )}

        {/* Gradient title: per-letter stagger */}
        <h1 className="mt-4 text-2xl font-extrabold tracking-tighter text-center">
          Resume Builder
        </h1>

        {/* Tagline */}
        <p className="mt-2 text-sm text-muted-foreground/80 text-center">
          Create your free, ATS-friendly resume in minutes
        </p>

        {/* Progress bar with shimmer */}
        <div
          className="mt-4 flex w-full max-w-24 h-2 rounded-full bg-muted/30 dark:bg-muted/40 overflow-hidden"
          style={progressBarStyle}
        >
          <div
            className="h-full rounded-lg bg-gradient-to-w from-primary to-accent transition-all duration-2 ease-out"
            style={{ width: '100%' }}
          />
        </div>

        {/* Skip hint – fades in after 1s, only in normal motion */}
        {showHint && (
          <p
            className="mt-4 text-xs text-muted-foreground/60 text-center"
            style={{ opacity: 0, transition: 'opacity 0.4s ease' }}
          >
            Press Esc / Enter / Space to skip
          </p>
        )}
      </div>
    </div>
  )
}
