import { HeadContent, Outlet, createRootRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, Brain } from 'lucide-react'

import '../styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      {
        title: 'iPrepare — Senior Software Engineer Interview',
      },
      {
        name: 'description',
        content:
          'A comprehensive mixed technical interview covering Java, Go, OOP, DSA, System Design, and more.',
      },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
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
          <a href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm">
            <Brain className="size-5 shrink-0" />
            {sidebarOpen && <span>Home</span>}
          </a>
          <a href="/interview" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary transition-colors text-sm font-medium">
            <Brain className="size-5 shrink-0" />
            {sidebarOpen && <span>Interview</span>}
          </a>
          <a href="/i-prepare" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm">
            <Brain className="size-5 shrink-0" />
            {sidebarOpen && <span>iPrepare</span>}
          </a>
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
        </header>
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
