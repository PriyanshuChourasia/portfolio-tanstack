" "
import { User, FileText, Briefcase, MessageSquare, AtSign, Menu } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onMenuToggle: () => void 
}

export function SidebarNav({ activeTab, onTabChange, onMenuToggle }: SidebarNavProps) {
  const navItems = [
    { label: "ABOUT", icon: User },
    { label: "RESUME", icon: FileText },
    { label: "WORKS", icon: Briefcase },
    { label: "BLOG", icon: MessageSquare },
    { label: "CONTACT", icon: AtSign },
  ]

  return (
    <>
      <nav className="hidden md:absolute md:-left-25 md:top-1/2 md:-translate-y-1/2 md:z-50 md:flex flex-col gap-0 bg-linear-to-b from-card to-[#141b27] rounded-lg shadow-2xl overflow-hidden w-20 border border-border hover:border-primary/30 transition-all">
   
        <button
          onClick={onMenuToggle}
          className="p-6 border-b border-border hover:bg-primary/10 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all duration-300"
        >
          <Menu className="w-6 h-6" />
        </button>

        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => onTabChange(item.label)}
            className="p-5 transition-all flex flex-col items-center gap-1 border-b border-border last:border-0 group relative overflow-hidden"
          >
            <div className={cn(
              "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
              activeTab === item.label ? "opacity-100" : ""
            )}
            style={{
              background: activeTab === item.label 
                ? 'linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(14, 165, 233, 0.1))' 
                : 'linear-gradient(135deg, rgba(0, 212, 255, 0.0), rgba(14, 165, 233, 0.0))'
            }}
            />
            <item.icon className={cn(
              "w-5 h-5 transition-all duration-300 relative z-10",
              activeTab === item.label 
                ? "text-primary drop-shadow-[0_0_8px_rgba(0,212,255,0.4)]" 
                : "text-muted-foreground group-hover:text-primary group-hover:drop-shadow-[0_0_8px_rgba(0,212,255,0.3)]"
            )} />
            <span className={cn(
              "text-[8px] sm:text-[10px] font-semibold uppercase tracking-wider transition-all duration-300 relative z-10",
              activeTab === item.label 
                ? "text-primary" 
                : "text-muted-foreground group-hover:text-primary"
            )}>{item.label}</span>
          </button>
        ))}

       
      </nav>


    </>
  )
}
