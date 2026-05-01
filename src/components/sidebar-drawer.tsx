" "
import { X, Search, User, FileText, Briefcase, MessageSquare, AtSign } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarDrawerProps {
  isOpen: boolean
  onClose: () => void
  activeTab?: string
  onTabChange?: (tab: string) => void
}

export function SidebarDrawer({ isOpen, onClose, activeTab = 'ABOUT', onTabChange }: SidebarDrawerProps) {
  const navItems = [
    { label: "ABOUT", icon: User },
    { label: "RESUME", icon: FileText },
    { label: "WORKS", icon: Briefcase },
    { label: "BLOG", icon: MessageSquare },
    { label: "CONTACT", icon: AtSign },
  ]

  const categories = [
    { name: "Design", count: 2 },
    { name: "Mobile", count: 1 },
    { name: "Music", count: 2 },
    { name: "Video", count: 1 },
  ]

  const tags = [
    { name: "jekyll", count: 1 },
    { name: "app", count: 1 },
    { name: "mobile", count: 1 },
    { name: "code", count: 1 },
    { name: "rock", count: 1 },
    { name: "Jekyll", count: 1 },
  ]

  const latestPosts = [
    "Welcome to Jekyll!",
    "By spite about do of do allow blush",
    "Two Before Arrow Not Relied",
    "Design in Mobile Application",
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
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 pointer-events-none",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0",
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          "fixed top-0 left-0 h-full w-[280px] sm:w-[300px] bg-gradient-to-b from-[#1a2332] to-[#141b27] z-[70] transition-transform duration-300 transform overflow-y-auto custom-scrollbar border-r border-[#2a3f5f]",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <button
          onClick={onClose}
          className="md:hidden absolute top-4 right-4 w-10 h-10 bg-gradient-to-br from-[#1a2332] to-[#141b27] flex items-center justify-center hover:text-[#00d4ff] transition-all rounded-md border border-[#2a3f5f] hover:border-[#00d4ff]/50 shadow-lg z-50 text-muted-foreground"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-8 sm:space-y-12 pt-16">
          <section className="md:hidden">
            <h3 className="section-heading mb-4">
              <span className="text-[#00d4ff]">N</span>avigation
            </h3>
            <div className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleTabChange(item.label)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300",
                    activeTab === item.label 
                      ? "bg-gradient-to-r from-[#00d4ff]/20 to-[#0ea5e9]/20 border border-[#00d4ff]/50 text-[#00d4ff]" 
                      : "text-muted-foreground hover:text-[#00d4ff] hover:bg-[#00d4ff]/10 border border-transparent hover:border-[#00d4ff]/30"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="label-text text-xs">{item.label}</span>
                </button>
              ))}
            </div>
          </section>

          <div className="relative group">
            <input
              type="text"
              placeholder="Search ..."
              className="w-full bg-[#0f1419]/50 border-b border-[#2a3f5f] py-3 pr-8 text-xs sm:text-sm italic text-foreground placeholder-muted-foreground/50 focus:border-[#00d4ff] outline-none transition-colors"
            />
            <Search className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-[#00d4ff] transition-colors" />
          </div>

          <section className="space-y-4 sm:space-y-6">
            <div className="relative inline-block mb-2">
              <h3 className="section-heading">
                <span className="text-[#00d4ff]">L</span>atest Posts
              </h3>
            </div>
            <ul className="space-y-3 sm:space-y-4">
              {latestPosts.map((post, i) => (
                <li
                  key={i}
                  className="text-xs sm:text-xs text-muted-foreground hover:text-[#00d4ff] cursor-pointer transition-all border-b border-[#2a3f5f] pb-2 sm:pb-3 last:border-0 hover:pl-1"
                >
                  {post}
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-4 sm:space-y-6">
            <div className="relative inline-block mb-2">
              <h3 className="section-heading">
                <span className="text-[#00d4ff]">C</span>ategories
              </h3>
            </div>
            <ul className="space-y-3 sm:space-y-4">
              {categories.map((cat, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center text-xs sm:text-xs text-muted-foreground hover:text-[#00d4ff] cursor-pointer transition-all border-b border-[#2a3f5f] pb-2 sm:pb-3 last:border-0 hover:pl-1"
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] text-muted-foreground/60 bg-[#0f1419]/50 px-2 py-1 rounded">({cat.count})</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-4 sm:space-y-6">
            <div className="relative inline-block mb-2">
              <h3 className="section-heading">
                <span className="text-[#00d4ff]">T</span>ags
              </h3>
            </div>
            <ul className="space-y-3 sm:space-y-4">
              {tags.map((tag, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center text-xs sm:text-xs text-muted-foreground hover:text-[#00d4ff] cursor-pointer transition-all border-b border-[#2a3f5f] pb-2 sm:pb-3 last:border-0 hover:pl-1"
                >
                  <span>{tag.name}</span>
                  <span className="text-[10px] text-muted-foreground/60 bg-[#0f1419]/50 px-2 py-1 rounded">({tag.count})</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  )
}
