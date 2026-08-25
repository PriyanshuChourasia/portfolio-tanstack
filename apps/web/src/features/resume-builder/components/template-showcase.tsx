import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { previewComponents } from './resume-preview'
import type { ResumeData, ResumeLayout } from './resume-template'

const templateInfo: Array<{
  id: ResumeLayout
  label: string
  tagline: string
  bestFor: string
}> = [
  {
    id: 'classic',
    label: 'Classic',
    tagline: 'Timeless & ATS-friendly',
    bestFor: 'Corporate, Finance, Government',
  },
  {
    id: 'modern',
    label: 'Modern',
    tagline: 'Bold sidebar, clean layout',
    bestFor: 'Tech, Startups, Design',
  },
  {
    id: 'minimal',
    label: 'Minimal',
    tagline: 'Elegant simplicity',
    bestFor: 'Academia, Research, Consulting',
  },
  {
    id: 'professional',
    label: 'Professional',
    tagline: 'Polished & structured',
    bestFor: 'Management, Marketing, Sales',
  },
  {
    id: 'creative',
    label: 'Creative',
    tagline: 'Stand out with flair',
    bestFor: 'Creative, Media, Freelance',
  },
  {
    id: 'mech',
    label: 'Mech',
    tagline: 'Photo header with a career timeline',
    bestFor: 'Engineering, Manufacturing, Technical',
  },
]

const showcaseData: ResumeData = {
  personal: {
    name: 'Alex Morgan',
    email: 'alex@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    title: 'Senior Product Engineer',
    summary:
      'Versatile engineer with 5+ years of experience building high-performance web applications and leading cross-functional teams.',
  },
  experience: [
    {
      period: '2022 - Present',
      title: 'Senior Product Engineer',
      company: 'TechCorp',
      desc: 'Led the development of a real-time analytics platform serving 1M+ users.',
    },
    {
      period: '2020 - 2022',
      title: 'Software Engineer',
      company: 'InnovateLab',
      desc: 'Built microservices architecture handling 50k+ requests per second.',
    },
  ],
  education: [
    {
      period: '2016 - 2020',
      title: 'B.S. Computer Science',
      company: 'Stanford University',
      desc: 'Graduated with honors. Focus on distributed systems.',
    },
  ],
  skills: [
    { name: 'React', value: 92 },
    { name: 'TypeScript', value: 88 },
    { name: 'Node.js', value: 85 },
    { name: 'Python', value: 80 },
    { name: 'AWS', value: 75 },
  ],
  languages: [
    { name: 'English', level: 10 },
    { name: 'Spanish', level: 6 },
  ],
}

interface TemplateShowcaseProps {
  onSelect: (layout: ResumeLayout) => void
}

export function TemplateShowcase({ onSelect }: TemplateShowcaseProps) {
  const [hoveredId, setHoveredId] = useState<ResumeLayout | null>(null)

  return (
    <div className="min-h-screen bg-background text-white">
      {/* Hero */}
      <div className="relative pt-20 pb-16 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/90/20 via-transparent to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-accent/10 border border-primary-accent/20 text-primary-accent text-xs font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />5 Professionally Designed
            Templates
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Templates That Get You{' '}
            <span className="bg-gradient-to-r from-primary-accent to-primary bg-clip-text text-transparent">
              Hired
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            Each template is optimized for ATS scanners and designed to make
            your experience stand out. Pick one, customize it, and land your
            dream job.
          </p>
        </motion.div>
      </div>

      {/* Template grid */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templateInfo.map((tpl, idx) => {
            const PreviewComponent = previewComponents[tpl.id]
            return (
              <motion.div
                key={tpl.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`group relative ${idx >= 3 ? 'md:col-span-1 lg:col-start-' + (idx - 2) : ''}`}
                onMouseEnter={() => setHoveredId(tpl.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div
                  className={`relative rounded-xl overflow-hidden border transition-all duration-300 ${
                    hoveredId === tpl.id
                      ? 'border-primary-accent/50 shadow-[0_0_30px_-5px_rgba(242,162,92,0.15)]'
                      : 'border-slate-800 hover:border-slate-700'
                  } bg-card/50 backdrop-blur`}
                >
                  {/* Preview thumbnail — renders the real template with demo data */}
                  <div className="relative h-[380px] overflow-hidden bg-slate-800">
                    <div
                      className="absolute top-0 left-0 origin-top-left scale-[0.42] sm:scale-[0.48]"
                      style={{ width: 794 }}
                    >
                      <PreviewComponent data={showcaseData} />
                    </div>

                    {/* Hover overlay */}
                    <AnimatePresence>
                      {hoveredId === tpl.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent flex items-end p-6 z-10"
                        >
                          <button
                            onClick={() => onSelect(tpl.id)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-primary-accent hover:bg-primary-accent text-slate-950 font-semibold text-sm rounded-lg transition-colors"
                          >
                            Use This Template
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-lg font-semibold text-white">
                        {tpl.label}
                      </h3>
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                        {tpl.bestFor}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">{tpl.tagline}</p>
                    {/* Always-visible CTA so templates are selectable on touch devices */}
                    <button
                      onClick={() => onSelect(tpl.id)}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary-accent px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-primary-accent"
                    >
                      Use This Template
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
