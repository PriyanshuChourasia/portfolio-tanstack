' '
import {
  AtSign,
  Briefcase,
  FileText,
  Menu,
  MessageSquare,
  User,
} from 'lucide-react'
import { EditableLabel } from './editable-label'
import { useSectionLabels } from '@/hooks/use-section-labels'
import { cn } from '@/lib/utils'

interface SidebarNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onMenuToggle: () => void
}

const NAV_KEYS = ['ABOUT', 'RESUME', 'WORKS', 'BLOG', 'CONTACT'] as const
const NAV_ICONS = [User, FileText, Briefcase, MessageSquare, AtSign]

export function SidebarNav({
  activeTab,
  onTabChange,
  onMenuToggle,
}: SidebarNavProps) {
  const { getLabel, updateLabel } = useSectionLabels()

  const navItems = NAV_KEYS.map((key, i) => ({
    key,
    label: getLabel(key),
    icon: NAV_ICONS[i],
  }))

  return (
    <>
      <nav className="hidden md:absolute md:-left-25 md:top-1/2 md:-translate-y-1/2 md:z-50 md:flex flex-col gap-0 bg-white dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-900 rounded-lg shadow-2xl overflow-hidden w-20 border border-slate-200 dark:border-border hover:border-primary/30 transition-all">
        <button
          onClick={onMenuToggle}
          className="p-6 border-b border-border hover:bg-primary/10 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all duration-300"
        >
          <Menu className="w-6 h-6" />
        </button>

        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onTabChange(item.key)}
            className="p-5 transition-all flex flex-col items-center gap-1 border-b border-border last:border-0 group relative overflow-hidden"
          >
            <div
              className={cn(
                'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                activeTab === item.key ? 'opacity-100' : '',
              )}
              style={{
                background:
                  activeTab === item.key
                    ? 'linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(14, 165, 233, 0.1))'
                    : 'linear-gradient(135deg, rgba(0, 212, 255, 0.0), rgba(14, 165, 233, 0.0))',
              }}
            />
            <item.icon
              className={cn(
                'w-5 h-5 transition-all duration-300 relative z-10',
                activeTab === item.key
                  ? 'text-primary drop-shadow-[0_0_8px_rgba(242,162,92,0.4)]'
                  : 'text-muted-foreground group-hover:text-primary group-hover:drop-shadow-[0_0_8px_rgba(242,162,92,0.3)]',
              )}
            />
            <span
              className={cn(
                'text-[8px] sm:text-[10px] font-semibold uppercase tracking-wider transition-all duration-300 relative z-10',
                activeTab === item.key
                  ? 'text-primary'
                  : 'text-muted-foreground group-hover:text-primary',
              )}
            >
              <EditableLabel
                value={item.label}
                onChange={(v) => updateLabel(item.key, v.toUpperCase())}
                className={cn(
                  activeTab === item.key
                    ? 'text-primary'
                    : 'text-muted-foreground',
                )}
              />
            </span>
          </button>
        ))}
      </nav>
    </>
  )
}
