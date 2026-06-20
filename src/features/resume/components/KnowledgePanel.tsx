import { Trophy } from 'lucide-react'
import { motion } from 'framer-motion'

interface KnowledgePanelProps {
  items: string[]
}

export function KnowledgePanel({ items }: KnowledgePanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 backdrop-blur-sm p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-5 h-5 text-amber-500" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Knowledge</h3>
      </div>
      <div className="flex flex-wrap gap-3">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/70 hover:border-amber-400/50 hover:text-amber-600 dark:hover:border-amber-500/50 dark:hover:text-amber-300 transition-colors"
          >
            {item}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
