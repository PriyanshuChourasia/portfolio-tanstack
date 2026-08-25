' '
import {
  AtSign,
  Briefcase,
  FileText,
  MessageSquare,
  Search,
  User,
  X,
} from 'lucide-react'
import { EditableLabel } from './editable-label'
import { useSectionLabels } from '@/hooks/use-section-labels'
import { cn } from '@/lib/utils'

interface SidebarDrawerProps {
  isOpen: boolean
  onClose: () => void
  activeTab?: string
  onTabChange?: (tab: string) => void
}

const NAV_KEYS = ['ABOUT', 'RESUME', 'WORKS', 'BLOG', 'CONTACT'] as const
const NAV_ICONS = [User, FileText, Briefcase, MessageSquare, AtSign]

export function SidebarDrawer({
  isOpen,
  onClose,
  activeTab = 'ABOUT',
  onTabChange,
}: SidebarDrawerProps) {
  const { getLabel, updateLabel } = useSectionLabels()

  const navItems = NAV_KEYS.map((key, i) => ({
    key,
    label: getLabel(key),
    icon: NAV_ICONS[i],
  }))

  const categories = [
    { name: 'Design', count: 2 },
    { name: 'Mobile', count: 1 },
    { name: 'Music', count: 2 },
    { name: 'Video', count: 1 },
  ]

  const tags = [
    { name: 'jekyll', count: 1 },
    { name: 'app', count: 1 },
    { name: 'mobile', count: 1 },
    { name: 'code', count: 1 },
    { name: 'rock', count: 1 },
    { name: 'Jekyll', count: 1 },
  ]

  const latestPosts = [
    'Welcome to Jekyll!',
    'By spite about do of do allow blush',
    'Two Before Arrow Not Relied',
    'Design in Mobile Application',
  ]

  const handleTabChange = (tab: string) => {
    if (onTabChange) {
      onTabChange(tab)
      onClose()
    }
  }

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 pointer-events-none',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0',
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          'fixed top-0 left-0 h-full w-[280px] sm:w-[300px] bg-white dark:bg-gradient-to-b dark:from-card dark:to-card-dark z-[70] transition-transform duration-300 transform overflow-y-auto custom-scrollbar border-r border-slate-200 dark:border-border',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <button
          onClick={onClose}
          className="md:hidden absolute top-4 right-4 w-10 h-10 bg-white dark:bg-gradient-to-br dark:from-card dark:to-card-dark flex items-center justify-center hover:text-primary-accent transition-all rounded-md border border-slate-200 dark:border-border hover:border-primary-accent/50 shadow-lg z-50 text-slate-500 dark:text-muted-foreground"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-8 sm:space-y-12 pt-16">
          <section className="md:hidden">
            <h3 className="section-heading mb-4">
              <span className="text-[#703611]">N</span>avigation
            </h3>
            <div className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleTabChange(item.key)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300',
                    activeTab === item.key
                      ? 'bg-gradient-to-r from-[#703611]/20 to-[#F2A25C]/20 border border-[#703611]/50 text-[#703611]'
                      : 'text-muted-foreground hover:text-[#703611] hover:bg-[#703611]/10 border border-transparent hover:border-[#703611]/30',
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="label-text text-xs">
                    <EditableLabel
                      value={item.label}
                      onChange={(v) => updateLabel(item.key, v.toUpperCase())}
                    />
                  </span>
                </button>
              ))}
            </div>
          </section>

          <div className="relative group">
            <input
              type="text"
              placeholder="Search ..."
              className="w-full bg-slate-100 dark:bg-[#FFF5EB]/50 border-b border-slate-200 dark:border-[#D4B8A0] py-3 pr-8 text-xs sm:text-sm italic text-slate-700 text-foreground placeholder-slate-400 dark:placeholder-muted-foreground/50 focus:border-primary-accent outline-none transition-colors"
            />
            <Search className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 dark:text-muted-foreground group-hover:text-primary-accent transition-colors" />
          </div>

          <section className="space-y-4 sm:space-y-6">
            <div className="relative inline-block mb-2">
              <h3 className="section-heading">
                <span className="text-[#703611]">L</span>atest Posts
              </h3>
            </div>
            <ul className="space-y-3 sm:space-y-4">
              {latestPosts.map((post, i) => (
                <li
                  key={i}
                  className="text-xs sm:text-xs text-slate-500 dark:text-muted-foreground hover:text-primary-accent cursor-pointer transition-all border-b border-slate-200 dark:border-[#D4B8A0] pb-2 sm:pb-3 last:border-0 hover:pl-1"
                >
                  {post}
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-4 sm:space-y-6">
            <div className="relative inline-block mb-2">
              <h3 className="section-heading">
                <span className="text-[#703611]">C</span>ategories
              </h3>
            </div>
            <ul className="space-y-3 sm:space-y-4">
              {categories.map((cat, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center text-xs sm:text-xs text-muted-foreground hover:text-[#703611] cursor-pointer transition-all border-b border-[#D4B8A0] pb-2 sm:pb-3 last:border-0 hover:pl-1"
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] text-slate-400/60 dark:text-muted-foreground/60 bg-slate-100 dark:bg-[#FFF5EB]/50 px-2 py-1 rounded">
                    ({cat.count})
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-4 sm:space-y-6">
            <div className="relative inline-block mb-2">
              <h3 className="section-heading">
                <span className="text-[#703611]">T</span>ags
              </h3>
            </div>
            <ul className="space-y-3 sm:space-y-4">
              {tags.map((tag, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center text-xs sm:text-xs text-muted-foreground hover:text-[#703611] cursor-pointer transition-all border-b border-[#D4B8A0] pb-2 sm:pb-3 last:border-0 hover:pl-1"
                >
                  <span>{tag.name}</span>
                  <span className="text-[10px] text-slate-400/60 dark:text-muted-foreground/60 bg-slate-100 dark:bg-[#FFF5EB]/50 px-2 py-1 rounded">
                    ({tag.count})
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  )
}
