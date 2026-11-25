import { useEffect, useState } from 'react'

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false)
    }, 2000)

    return () => clearTimeout(timeout)
  }, [])

  if (!visible) {
    onComplete()
    return null
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
      style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2d3a4f 100%), radial-gradient(circle at 30% 20%, #00d4ff 0%, #00a3e0 100%)' }}
    >
      <div className="flex flex-col items-center gap-4 pointer-events-auto">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-600 flex items-center justify-center relative">
          <span className="text-2xl font-bold text-white">RB</span>
        </div>
        <h1 className="text-3xl font-semibold text-white tracking-wider">Resume Builder</h1>
        <p className="text-white/80 text-sm opacity-0">Create your free resume in minutes</p>
      </div>
    </div>
  )
}