import { useEffect, useState } from 'react'
import type { AnyRouter } from '@tanstack/react-router'
import { useReducedMotion } from 'framer-motion'

const MIN_DISPLAY_TIME = 1600
const MAX_TIMEOUT = 3500

export function useSplashGate(router: AnyRouter) {
  // shouldShow: computed ONCE via useState initializer — true only if
  // sessionStorage flag is not '1'. False means splash already shown this session.
  const shouldShow = useState(() => {
    try {
      return sessionStorage.getItem('resume-ui:splash-seen') !== '1'
    } catch {
      return true
    }
  })[0]

  // reducedMotion from framer-motion
  const reducedMotion = useReducedMotion()
  // min display: 600ms reduced, 1600ms normal; max: 3500ms
  const minTime = reducedMotion ? 600 : MIN_DISPLAY_TIME

  // ready: becomes true when router resolves its first route
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const unsub = router.subscribe('onResolved', () => {
      setReady(true)
    })
    // also check if already idle with matches
    if (router.state.status === 'idle' && router.state.matches.length) {
      setReady(true)
    }
    return () => unsub()
  }, [router])

  // timer state
  const [minElapsed, setMinElapsed] = useState(false)
  const [maxHit, setMaxHit] = useState(false)
  const [skipped, setSkipped] = useState(false)

  // min time check
  useEffect(() => {
    if (!ready) return
    const tid = setTimeout(() => setMinElapsed(true), minTime)
    return () => clearTimeout(tid)
  }, [ready, minTime])

  // max timeout
  useEffect(() => {
    if (!ready) return
    const tid = setTimeout(() => setMaxHit(true), MAX_TIMEOUT)
    return () => clearTimeout(tid)
  }, [ready])

  // skip on Escape/Enter/Space or pointerdown while open
  useEffect(() => {
    if (skipped || !shouldShow) return
    window.addEventListener('keydown', (() => {
      setSkipped(true)
    }))
    window.addEventListener('pointerdown', (() => {
      setSkipped(true)
    }))
    return () => {
      window.removeEventListener('keydown', (() => {
        setSkipped(true)
      }))
      window.removeEventListener('pointerdown', (() => {
        setSkipped(true)
      }))
    }
  }, [skipped, shouldShow])

  // open = shouldShow && !(skipped || maxHit || (ready && minElapsed))
  const open = shouldShow && !skipped && !maxHit && !(ready && minElapsed)

  // when open flips to false, write sessionStorage flag and cleanup
  useEffect(() => {
    if (!open) {
      try {
        sessionStorage.setItem('resume-ui:splash-seen', '1')
      } catch {}
    }
  }, [open])

  // progress: 0 → 85 while waiting, → 100 when ready
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    if (!ready) return
    // animate toward 85 while waiting, then jump to 100
    const progressTowards85 = setTimeout(() => setProgress(85), 800)
    const jumpTo100 = setTimeout(() => setProgress(100), MAX_TIMEOUT)
    return () => {
      clearTimeout(progressTowards85)
      clearTimeout(jumpTo100)
    }
  }, [ready])

  // showHint: true after 1000ms, false if reducedMotion
  const [showHint, setShowHint] = useState(false)
  useEffect(() => {
    if (reducedMotion) return
    const tid = setTimeout(() => setShowHint(true), 1000)
    return () => clearTimeout(tid)
  }, [reducedMotion])

  return { open, progress, showHint, reducedMotion, skip: skipped }
}