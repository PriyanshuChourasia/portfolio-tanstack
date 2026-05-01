import { motion, useTransform } from 'framer-motion'

interface ScrollCircularProgressProps {
  percentage: number
  label: string
  progress: any
}

export function ScrollCircularProgress({ percentage, label, progress }: ScrollCircularProgressProps) {
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
    <motion.div className="flex flex-col items-center gap-4" whileHover={{ scale: 1.05 }}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth="6"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeLinecap="round"
            style={{ strokeDashoffset: dashOffset }}
            className="drop-shadow-[0_0_12px_rgba(0,212,255,0.35)]"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-extrabold bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            {percentage}%
          </span>
        </div>
      </div>
      <p className="text-xs text-center text-slate-400 font-medium max-w-30">{label}</p>
    </motion.div>
  )
}
