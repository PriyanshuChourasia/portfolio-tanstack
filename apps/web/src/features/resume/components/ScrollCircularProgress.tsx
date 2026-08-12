import { motion, useTransform } from 'framer-motion'

interface ScrollCircularProgressProps {
  percentage: number
  label: string
  progress: any
  color: string
}

export function ScrollCircularProgress({ percentage, label, progress, color }: ScrollCircularProgressProps) {
  const clamp01 = (v: number) => Math.max(0, Math.min(1, v))

  const radius = 58
  const circumference = 2 * Math.PI * radius
  const size = 140

  const fill = useTransform(progress, [0, 1], [0, percentage])
  const dashOffset = useTransform(fill, (v: number) => {
    const pct = clamp01(v / 100)
    return circumference - pct * circumference
  })

  return (
    <motion.div className="group flex flex-col items-center gap-4" whileHover={{ scale: 1.05 }}>
      <div className="relative" style={{ width: size, height: size }}>
        <div
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"
          style={{ backgroundColor: color }}
        />
        <svg className="relative transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth="6"
            className="stroke-slate-300 dark:stroke-[#2a3f5f]"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeLinecap="round"
            style={{ strokeDashoffset: dashOffset, stroke: color, filter: `drop-shadow(0 0 12px ${color}59)` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-extrabold" style={{ color }}>
            {percentage}%
          </span>
        </div>
      </div>
      <p className="text-xs text-center text-slate-500 dark:text-slate-400 font-medium max-w-30 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
        {label}
      </p>
    </motion.div>
  )
}
