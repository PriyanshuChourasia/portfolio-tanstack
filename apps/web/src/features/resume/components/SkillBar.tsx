import { motion, useTransform } from 'framer-motion'

interface SkillBarProps {
  label: string
  value: number
  progress: any
}

export function SkillBar({ label, value, progress }: SkillBarProps) {
  
  const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
  const filled = useTransform(progress, [0, 1], [0, value])
  const filledWidth = useTransform(filled, (v: number) => `${clamp01(v / 100) * 100}%`)

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-slate-700 dark:text-white/90">{label}</span>
        <span className="text-xs text-cyan-600 dark:text-cyan-300 font-bold">{value}%</span>
      </div>
      <div className="h-2 bg-slate-200 dark:bg-slate-900/60 rounded-full overflow-hidden border border-slate-300 dark:border-slate-700/60">
        <motion.div className="h-full bg-linear-to-r from-blue-600 to-cyan-600" style={{ width: filledWidth }} />
      </div>
    </div>
  )
}
