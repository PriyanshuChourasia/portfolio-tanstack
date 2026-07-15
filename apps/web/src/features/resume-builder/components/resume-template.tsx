import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Download, LayoutGrid, Pause, Play, Shuffle } from 'lucide-react'
import { EditorPanel } from './editor-panel'
import { ResumePreview } from './resume-preview'
import { TemplateShowcase } from './template-showcase'

export type ResumeLayout = 'classic' | 'modern' | 'minimal' | 'professional' | 'creative'

export interface ResumePersonal {
  name: string
  email: string
  phone: string
  location: string
  title: string
  summary: string
}

export interface ResumeExperience {
  period: string
  title: string
  company: string
  desc: string
}

export interface ResumeEducation {
  period: string
  title: string
  company: string
  desc: string
}

export interface ResumeSkill {
  name: string
  value: number
}

export interface ResumeLanguage {
  name: string
  level: number
}

export interface ResumeData {
  personal: ResumePersonal
  experience: ResumeExperience[]
  education: ResumeEducation[]
  skills: ResumeSkill[]
  languages: ResumeLanguage[]
}

const layouts: { id: ResumeLayout; label: string }[] = [
  { id: 'classic', label: 'Classic' },
  { id: 'modern', label: 'Modern' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'professional', label: 'Professional' },
  { id: 'creative', label: 'Creative' },
]

const demoProfiles: { name: string; data: ResumeData }[] = [
  {
    name: 'Developer',
    data: {
      personal: {
        name: 'Priyanshu Sharma',
        email: 'priyanshu@example.com',
        phone: '+91 98765 43210',
        location: 'Mumbai, India',
        title: 'Full Stack Developer',
        summary:
          'Passionate full-stack developer with 3+ years of experience building modern web applications using React, Node.js, and TypeScript. Strong background in distributed systems and cloud infrastructure.',
      },
      experience: [
        {
          period: '2023 - Present',
          title: 'Software Developer',
          company: 'Primesys Technologies',
          desc: 'Collaborate with creative and development teams on the execution of ideas. Architected microservices handling 10k+ req/s.',
        },
        {
          period: '2022 - Present',
          title: 'Fullstack Developer',
          company: 'Freelancer',
          desc: 'Monitored technical aspects of the front-end development for several projects. Built 15+ client-facing web applications.',
        },
        {
          period: '2021 - 2022',
          title: 'Frontend Intern',
          company: 'TechStartup Inc.',
          desc: 'Developed reusable component libraries and contributed to the design system used across 3 product teams.',
        },
      ],
      education: [
        {
          period: '2019 - 2023',
          title: 'B.Tech Computer Science',
          company: 'IIT Bombay',
          desc: 'Focused on software engineering, distributed systems, and machine learning. Dean\'s list all semesters.',
        },
        {
          period: '2017 - 2019',
          title: 'Higher Secondary',
          company: 'Delhi Public School',
          desc: 'Science stream with computer science elective. Scored 95% in board examinations.',
        },
      ],
      skills: [
        { name: 'React / Next.js', value: 92 },
        { name: 'TypeScript', value: 88 },
        { name: 'Node.js', value: 85 },
        { name: 'TailwindCSS', value: 90 },
        { name: 'PostgreSQL', value: 78 },
        { name: 'Docker / K8s', value: 72 },
        { name: 'GraphQL', value: 70 },
        { name: 'MongoDB', value: 65 },
      ],
      languages: [
        { name: 'English', level: 9 },
        { name: 'Hindi', level: 10 },
        { name: 'French', level: 4 },
      ],
    },
  },
  {
    name: 'Designer',
    data: {
      personal: {
        name: 'Sarah Chen',
        email: 'sarah.chen@design.io',
        phone: '+1 (415) 555-0192',
        location: 'San Francisco, CA',
        title: 'Senior Product Designer',
        summary:
          'Award-winning product designer with 6+ years of experience crafting intuitive digital experiences. Expert in design systems, user research, and interaction design.',
      },
      experience: [
        {
          period: '2022 - Present',
          title: 'Senior Product Designer',
          company: 'DesignLab Inc.',
          desc: 'Led redesign of core product suite serving 2M+ users. Established design system used across 4 product lines.',
        },
        {
          period: '2020 - 2022',
          title: 'UX Designer',
          company: 'Creative Agency Co.',
          desc: 'Designed and shipped 20+ mobile and web applications for Fortune 500 clients. Conducted 100+ user research sessions.',
        },
        {
          period: '2018 - 2020',
          title: 'Junior Designer',
          company: 'StartupXYZ',
          desc: 'Created wireframes, prototypes, and visual designs for SaaS platform. Reduced user drop-off by 35% through UX improvements.',
        },
      ],
      education: [
        {
          period: '2014 - 2018',
          title: 'BFA Interaction Design',
          company: 'California College of the Arts',
          desc: 'Graduated with honors. Thesis on inclusive design practices for neurodivergent users.',
        },
      ],
      skills: [
        { name: 'Figma', value: 95 },
        { name: 'UI/UX Design', value: 92 },
        { name: 'Design Systems', value: 88 },
        { name: 'Prototyping', value: 85 },
        { name: 'User Research', value: 80 },
        { name: 'Motion Design', value: 75 },
        { name: 'HTML / CSS', value: 70 },
      ],
      languages: [
        { name: 'English', level: 10 },
        { name: 'Mandarin', level: 7 },
        { name: 'Japanese', level: 3 },
      ],
    },
  },
  {
    name: 'Marketer',
    data: {
      personal: {
        name: 'Marcus Johnson',
        email: 'marcus.j@growth.co',
        phone: '+1 (212) 555-0437',
        location: 'New York, NY',
        title: 'Growth Marketing Manager',
        summary:
          'Data-driven marketing leader with 5+ years driving growth through multi-channel strategies. Managed $5M+ annual ad spend with 3x ROAS across B2B and B2C products.',
      },
      experience: [
        {
          period: '2021 - Present',
          title: 'Growth Marketing Manager',
          company: 'ScaleUp SaaS',
          desc: 'Owned growth funnel from acquisition to retention. Grew MRR from $50k to $200k in 18 months through SEO, paid ads, and email automation.',
        },
        {
          period: '2019 - 2021',
          title: 'Digital Marketing Specialist',
          company: 'EcomBrand Co.',
          desc: 'Managed $2M annual ad budget across Google, Meta, and LinkedIn. Reduced CAC by 40% through audience optimization.',
        },
        {
          period: '2017 - 2019',
          title: 'Marketing Analyst',
          company: 'DataDrive Agency',
          desc: 'Built dashboards and attribution models for 10+ clients. Automated reporting workflows saving 20+ hours per week.',
        },
      ],
      education: [
        {
          period: '2013 - 2017',
          title: 'BBA Marketing',
          company: 'NYU Stern School of Business',
          desc: 'Concentration in digital marketing and business analytics. Captain of marketing case competition team.',
        },
      ],
      skills: [
        { name: 'SEO / SEM', value: 90 },
        { name: 'Google Ads', value: 88 },
        { name: 'Analytics', value: 85 },
        { name: 'Email Marketing', value: 82 },
        { name: 'Content Strategy', value: 78 },
        { name: 'CRM Tools', value: 75 },
        { name: 'A/B Testing', value: 80 },
        { name: 'Social Media', value: 72 },
      ],
      languages: [
        { name: 'English', level: 10 },
        { name: 'Spanish', level: 6 },
        { name: 'French', level: 4 },
      ],
    },
  },
  {
    name: 'Manager',
    data: {
      personal: {
        name: 'Elena Rodriguez',
        email: 'elena.r@consulting.com',
        phone: '+44 20 7946 0958',
        location: 'London, UK',
        title: 'Engineering Manager',
        summary:
          'Engineering leader with 8+ years managing distributed teams of 10-25 engineers. Proven track record of delivering complex systems on time while fostering inclusive team culture.',
      },
      experience: [
        {
          period: '2020 - Present',
          title: 'Engineering Manager',
          company: 'FinTech Global',
          desc: 'Lead 3 cross-functional teams (22 engineers) building payment processing platform. Improved deployment frequency from weekly to 50+ per day.',
        },
        {
          period: '2017 - 2020',
          title: 'Tech Lead',
          company: 'BankCorp Digital',
          desc: 'Led migration of legacy monolith to microservices architecture. Mentored 8 junior developers through structured growth program.',
        },
        {
          period: '2014 - 2017',
          title: 'Senior Backend Engineer',
          company: 'StartupScale',
          desc: 'Built core banking API handling 500k+ daily transactions. Reduced P95 latency from 800ms to 120ms.',
        },
        {
          period: '2012 - 2014',
          title: 'Software Engineer',
          company: 'TechSolutions Ltd.',
          desc: 'Developed RESTful APIs and data pipelines. Introduced CI/CD practices to the team.',
        },
      ],
      education: [
        {
          period: '2008 - 2012',
          title: 'MEng Software Engineering',
          company: 'Imperial College London',
          desc: 'First class honours. Research focus on distributed systems and fault tolerance.',
        },
        {
          period: '2006 - 2008',
          title: 'IB Diploma',
          company: 'International School of London',
          desc: 'Higher Level: Mathematics, Physics, Computer Science. 42/45 points.',
        },
      ],
      skills: [
        { name: 'Team Leadership', value: 92 },
        { name: 'System Design', value: 88 },
        { name: 'Agile / Scrum', value: 85 },
        { name: 'Java / Kotlin', value: 82 },
        { name: 'Cloud (AWS/GCP)', value: 80 },
        { name: 'Microservices', value: 85 },
        { name: 'CI/CD', value: 78 },
        { name: 'OKR Planning', value: 75 },
      ],
      languages: [
        { name: 'English', level: 10 },
        { name: 'Spanish', level: 9 },
        { name: 'Catalan', level: 7 },
        { name: 'French', level: 5 },
      ],
    },
  },
  {
    name: 'Data Scientist',
    data: {
      personal: {
        name: 'Dr. Aisha Patel',
        email: 'aisha.patel@data.ai',
        phone: '+1 (617) 555-0213',
        location: 'Boston, MA',
        title: 'Senior Data Scientist',
        summary:
          'PhD-level data scientist with 7+ years of experience applying machine learning to solve business problems. Published 12+ papers in top-tier conferences (NeurIPS, ICML, KDD).',
      },
      experience: [
        {
          period: '2021 - Present',
          title: 'Senior Data Scientist',
          company: 'AI Research Lab',
          desc: 'Lead ML research team focusing on NLP and recommendation systems. Deployed models serving 10M+ daily predictions with 99.9% uptime.',
        },
        {
          period: '2018 - 2021',
          title: 'Data Scientist',
          company: 'E-Commerce Giant',
          desc: 'Built real-time recommendation engine increasing revenue by 15%. Developed fraud detection system reducing false positives by 60%.',
        },
        {
          period: '2016 - 2018',
          title: 'ML Engineer',
          company: 'HealthTech Startup',
          desc: 'Designed deep learning models for medical image analysis. Achieved 97% accuracy on diagnostic classification task.',
        },
      ],
      education: [
        {
          period: '2012 - 2016',
          title: 'PhD Computer Science',
          company: 'MIT',
          desc: 'Thesis: "Efficient Deep Learning for Sparse Data" Published 5 first-author papers. Teaching assistant for graduate ML course.',
        },
        {
          period: '2008 - 2012',
          title: 'B.Tech Computer Science',
          company: 'IIT Delhi',
          desc: 'Gold medalist. Minor in mathematics and statistics.',
        },
      ],
      skills: [
        { name: 'Python', value: 95 },
        { name: 'Deep Learning', value: 90 },
        { name: 'NLP', value: 88 },
        { name: 'SQL', value: 85 },
        { name: 'MLOps', value: 80 },
        { name: 'Statistics', value: 85 },
        { name: 'PyTorch / TF', value: 90 },
        { name: 'Spark', value: 72 },
        { name: 'Data Viz', value: 75 },
      ],
      languages: [
        { name: 'English', level: 10 },
        { name: 'Hindi', level: 9 },
        { name: 'Gujarati', level: 8 },
        { name: 'German', level: 3 },
      ],
    },
  },
]

export function ResumeTemplate() {
  const [view, setView] = useState<'showcase' | 'builder'>('showcase')
  const [data, setData] = useState<ResumeData>(demoProfiles[0].data)
  const [activeProfileIdx, setActiveProfileIdx] = useState(0)
  const [activeLayout, setActiveLayout] = useState<ResumeLayout>('classic')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isCycling, setIsCycling] = useState(false)
  const cycleRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const handleSelectTemplate = useCallback((layout: ResumeLayout) => {
    setActiveLayout(layout)
    setView('builder')
  }, [])

  const handleBackToShowcase = useCallback(() => {
    setIsCycling(false)
    setView('showcase')
  }, [])

  const shuffleProfile = useCallback(() => {
    const next = (activeProfileIdx + 1) % demoProfiles.length
    setActiveProfileIdx(next)
    setData(demoProfiles[next].data)
  }, [activeProfileIdx])

  const selectProfile = useCallback((idx: number) => {
    setActiveProfileIdx(idx)
    setData(demoProfiles[idx].data)
  }, [])

  const toggleCycle = useCallback(() => {
    setIsCycling((prev) => !prev)
  }, [])

  useEffect(() => {
    if (isCycling) {
      cycleRef.current = setInterval(() => {
        setActiveLayout((prev) => {
          const currentIdx = layouts.findIndex((l) => l.id === prev)
          return layouts[(currentIdx + 1) % layouts.length].id
        })
      }, 2000)
    }
    return () => {
      if (cycleRef.current) {
        clearInterval(cycleRef.current)
        cycleRef.current = null
      }
    }
  }, [isCycling])

  if (view === 'showcase') {
    return <TemplateShowcase onSelect={handleSelectTemplate} />
  }

  return (
    <div className="h-screen w-full bg-slate-950 flex flex-col overflow-hidden">
      {/* Header with layout names */}
      <header className="h-14 shrink-0 bg-slate-900/80 border-b border-slate-800 backdrop-blur-md flex items-center justify-between px-4 z-20">
        <div className="flex items-center gap-2">
          <button
            onClick={handleBackToShowcase}
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Back to templates"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          <span className="text-sm font-semibold text-white">Resume Builder</span>
        </div>

        <nav className="flex items-center gap-1">
          {layouts.map((layout) => (
            <button
              key={layout.id}
              onClick={() => setActiveLayout(layout.id)}
              className={`relative px-4 py-1.5 text-sm rounded-md transition-all ${
                activeLayout === layout.id
                  ? 'text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {activeLayout === layout.id && (
                <motion.div
                  layoutId="activeLayout"
                  className="absolute inset-0 bg-cyan-500/15 border border-cyan-500/30 rounded-md"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{layout.label}</span>
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Demo profile dropdown */}
          <div className="flex items-center gap-1 bg-slate-800/50 rounded-md border border-slate-700/50 px-1 py-0.5">
            {demoProfiles.map((profile, i) => (
              <button
                key={profile.name}
                onClick={() => selectProfile(i)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  activeProfileIdx === i
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {profile.name}
              </button>
            ))}
            <div className="w-px h-4 bg-slate-700 mx-0.5" />
            <button
              onClick={shuffleProfile}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
              title="Next profile"
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={toggleCycle}
              className={`p-1 rounded transition-colors ${
                isCycling ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
              title={isCycling ? 'Stop cycling' : 'Cycle through all templates'}
            >
              {isCycling ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          </div>

          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 rounded-md hover:bg-cyan-500/10 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - Editor */}
        <motion.aside
          animate={{ width: sidebarOpen ? 380 : 0 }}
          className="overflow-hidden border-r border-slate-800 bg-slate-900/50 shrink-0"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="w-[380px] h-full overflow-hidden">
            <EditorPanel data={data} onChange={setData} />
          </div>
        </motion.aside>

        {/* Right panel - Preview */}
        <main className="flex-1 overflow-y-auto bg-slate-950">
          <ResumePreview data={data} layout={activeLayout} />
        </main>
      </div>
    </div>
  )
}
