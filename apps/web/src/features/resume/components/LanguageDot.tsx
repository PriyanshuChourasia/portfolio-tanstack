import { motion, useTransform } from 'framer-motion'

interface LanguageDotProps {
  index: number
  level: number
  progress: any
}

export function LanguageDot({ index, level, progress }: LanguageDotProps) {
  const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
  
  const activeOpacity = useTransform(progress, (p: number) => {
    const fill = clamp01(p) * level
    return index + 1 <= fill ? 1 : 0
  })
  const activeScale = useTransform(progress, (p: number) => {
    const fill = clamp01(p) * level
    return index + 1 <= fill ? 1 : 0.9
  })

  return (
    <div className="relative w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700 overflow-hidden">
      <motion.div
        className="absolute inset-0 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.25)]"
        style={{ opacity: activeOpacity, scale: activeScale }}
      />
    </div>
  )
}
