import { Outlet, createRootRoute, Link, useRouterState } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, Brain, Home, ClipboardList, Moon, Sun } from 'lucide-react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/lib/theme'

import '../styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      {
        title: 'iPrepare — Exam Mock Test Preparation',
      },
      {
        name: 'description',
        content:
          'Take exam-style mock tests for competitive exams with timed practice, auto-saved answers, and detailed analysis.',
      },
    ],
  }),
  component: RootComponent,
})

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/i-prepare', label: 'Mock Tests', icon: ClipboardList },
] as const

function RootComponent() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { theme, toggle } = useTheme()
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background text-foreground">
        <motion.aside
          initial={false}
          animate={{ width: sidebarOpen ? 220 : 64 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="bg-card border-r border-border flex flex-col overflow-hidden shrink-0"
        >
          <div className="p-4 flex items-center gap-2 border-b border-border">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0">
              <Brain className="size-5 text-white" />
            </div>
            {sidebarOpen && <span className="font-bold text-sm">iPrepare</span>}
          </div>
          <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
              const active = to === '/' ? pathname === '/' : pathname.startsWith(to)
              return (
                <Link
                  key={to}
                  to={to}
                  className={
                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ' +
                    (active
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground')
                  }
                >
                  <Icon className="size-5 shrink-0" />
                  {sidebarOpen && <span>{label}</span>}
                </Link>
              )
            })}
          </nav>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-3 border-t border-border hover:bg-muted transition-colors text-center"
          >
            {sidebarOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </motion.aside>

        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-background/80 backdrop-blur-xl">
            <h1 className="font-bold text-lg">iPrepare</h1>
            <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
          </header>
          <div className="flex-1 overflow-y-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </TooltipProvider>
  )
}
