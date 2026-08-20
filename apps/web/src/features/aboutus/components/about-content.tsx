' '
import { useEffect, useState } from 'react'
import {
  Code,
  Coffee,
  Flag,
  Gamepad2,
  Gauge,
  Megaphone,
  Music,
  Trophy,
} from 'lucide-react'
import aboutUsData from '@/data/aboutus-data.json'

const iconMap: { [key: string]: any } = {
  Code,
  Music,
  Gamepad2,
  Megaphone,
  Trophy,
  Coffee,
  Flag,
  Gauge,
}

export function AboutContent() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const services = aboutUsData.services.map((s: any) => ({
    ...s,
    icon: iconMap[s.icon],
  }))
  const pricing = aboutUsData.pricing.map((p: any) => ({
    ...p,
    icon: iconMap[p.icon],
  }))
  const funFacts = aboutUsData.funFacts.map((f: any) => ({
    ...f,
    icon: iconMap[f.icon],
  }))
  const clients = aboutUsData.clients

  return (
    <>
      <section
        style={{
          transform: `translateY(${scrollY * 0.06}px)`,
        }}
      >
        <h2 className="section-heading text-3xl sm:text-4xl mb-6 sm:mb-8 border-b border-border pb-4 sm:pb-6">
          <span className="text-[#00d4ff]">My</span>{' '}
          <span className="text-foreground">Services</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          {services.map((service: any, i: number) => (
            <div
              key={i}
              className="group relative flex flex-col items-start p-4 sm:p-6 border border-border hover:border-primary/50 rounded-lg transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800/40 hover-lift star-border-card"
            >
              <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-linear-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white dark:text-slate-900 mb-4 sm:mb-6 shadow-lg group-hover:shadow-[0_0_20px_rgba(0,212,255,0.4)]">
                <service.icon className="w-6 sm:w-7 h-6 sm:h-7" />
              </div>
              <h3 className="uppercase text-xs sm:text-sm tracking-wider mb-3 sm:mb-4 text-foreground">
                {service.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          transform: `translateY(${scrollY * 0.07}px)`,
        }}
      >
        <h2 className="section-heading border-b border-border pb-4 sm:pb-6 mb-6 sm:mb-8">
          <span className="text-[#00d4ff]">Pricing</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {pricing.map((plan: any, i: number) => (
            <div
              key={i}
              className="border border-border hover:border-primary/50 rounded-lg p-4 sm:p-6 md:p-8 bg-white dark:bg-linear-to-br dark:from-slate-800 dark:to-slate-900 transition-all hover-lift"
            >
              <div className="flex items-center justify-center mb-4 sm:mb-6">
                <plan.icon className="w-10 sm:w-12 h-10 sm:h-12 text-[#00d4ff]" />
              </div>
              <h3 className="text-lg sm:text-xl text-foreground text-center mb-3 sm:mb-4">
                {plan.title}
              </h3>
              <div className="text-center mb-6 sm:mb-8">
                <span className="text-2xl sm:text-4xl font-black text-foreground">
                  $
                </span>
                <span className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-[#00d4ff] to-[#0ea5e9] bg-clip-text text-transparent">
                  {plan.price}
                </span>
                <span className="text-xs sm:text-base text-muted-foreground ml-2">
                  hour
                </span>
              </div>
              <ul className="space-y-3 sm:space-y-4">
                {plan.features.map((feature: any, j: number) => (
                  <li key={j} className="flex items-center gap-2 sm:gap-3">
                    <span className="text-cyan-500">•</span>
                    <span
                      className={`text-xs sm:text-sm ${feature.included ? 'text-foreground/80' : 'text-muted-foreground/50 line-through'}`}
                    >
                      {feature.name}
                    </span>
                    {feature.isNew && (
                      <span className="bg-linear-to-r from-cyan-500 to-blue-500 text-white dark:text-slate-900 text-[10px] sm:text-xs px-2 py-1 rounded font-semibold">
                        new
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          transform: `translateY(${scrollY * 0.09}px)`,
        }}
      >
        <h2 className="section-heading border-b border-border pb-4 sm:pb-6">
          <span className="text-[#00d4ff]">Fun</span>{' '}
          <span className="text-foreground">Fact</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 divide-x divide-border md:divide-x">
          {funFacts.map((fact: any, i: number) => (
            <div
              key={i}
              className="text-center py-4 sm:py-6 md:py-12 px-2 sm:px-4 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors rounded"
            >
              <div className="flex items-center justify-center mb-2 sm:mb-3 md:mb-6">
                <fact.icon className="w-5 sm:w-6 md:w-8 h-5 sm:h-6 md:h-8 text-[#00d4ff]" />
              </div>
              <div className="text-xs sm:text-sm md:text-lg font-extrabold bg-gradient-to-r from-[#00d4ff] to-[#0ea5e9] bg-clip-text text-transparent mb-1 sm:mb-2">
                {fact.value}
              </div>
              <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground font-medium">
                {fact.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          transform: `translateY(${scrollY * 0.1}px)`,
        }}
      >
        <h2 className="section-heading text-3xl sm:text-4xl mb-6 sm:mb-8 border-b border-border pb-4 sm:pb-6">
          <span className="text-foreground">Clients</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
          {clients.map((client: any, i: number) => (
            <div
              key={i}
              className="flex items-center justify-center p-4 sm:p-6 border border-border hover:border-primary/50 rounded-lg transition-all hover:bg-slate-100 dark:hover:bg-slate-800/30 group hover-lift"
            >
              <img
                src={client.logo || '/placeholder.svg'}
                alt={client.name}
                className="max-w-full h-8 sm:h-12 object-contain opacity-60 group-hover:opacity-100 transition-opacity filter brightness-90 group-hover:brightness-110"
              />
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
