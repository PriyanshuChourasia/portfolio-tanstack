import type {
  ColorPreset,
  Portfolio,
  PortfolioColors,
  PortfolioLayout,
  PortfolioSection,
  PortfolioTypography,
  SectionId,
} from '../types/portfolio'

export const DEFAULT_SECTIONS: Array<PortfolioSection> = [
  { id: 'profile', title: 'Profile', enabled: true },
  { id: 'about', title: 'About', enabled: true },
  { id: 'experience', title: 'Experience', enabled: true },
  { id: 'projects', title: 'Projects', enabled: true },
  { id: 'skills', title: 'Skills', enabled: true },
  { id: 'education', title: 'Education', enabled: true },
  { id: 'certifications', title: 'Certifications', enabled: false },
  { id: 'services', title: 'Services', enabled: false },
  { id: 'testimonials', title: 'Testimonials', enabled: false },
  { id: 'publications', title: 'Publications', enabled: false },
  { id: 'social-links', title: 'Social Links', enabled: true },
]

export const DEFAULT_COLORS: PortfolioColors = {
  primary: '#0ea5e9',
  secondary: '#8b5cf6',
  background: '#ffffff',
  text: '#111827',
  mutedText: '#6b7280',
  accent: '#06b6d4',
}

export const COLOR_PRESETS: Array<ColorPreset> = [
  {
    name: 'Default',
    primary: '#0ea5e9',
    secondary: '#8b5cf6',
    background: '#ffffff',
    text: '#111827',
    mutedText: '#6b7280',
    accent: '#06b6d4',
  },
  {
    name: 'Ocean',
    primary: '#0284c7',
    secondary: '#0369a1',
    background: '#f0f9ff',
    text: '#0c4a6e',
    mutedText: '#7dd3fc',
    accent: '#38bdf8',
  },
  {
    name: 'Forest',
    primary: '#059669',
    secondary: '#047857',
    background: '#f0fdf4',
    text: '#064e3b',
    mutedText: '#6ee7b7',
    accent: '#34d399',
  },
  {
    name: 'Purple',
    primary: '#7c3aed',
    secondary: '#6d28d9',
    background: '#faf5ff',
    text: '#3b0764',
    mutedText: '#c4b5fd',
    accent: '#a78bfa',
  },
  {
    name: 'Rose',
    primary: '#e11d48',
    secondary: '#be123c',
    background: '#fff1f2',
    text: '#881337',
    mutedText: '#fda4af',
    accent: '#fb7185',
  },
  {
    name: 'Monochrome',
    primary: '#18181b',
    secondary: '#3f3f46',
    background: '#fafafa',
    text: '#18181b',
    mutedText: '#a1a1aa',
    accent: '#71717a',
  },
]

export const DEFAULTTypography: PortfolioTypography = {
  fontFamily: 'Inter',
  headingSize: '2.5rem',
  bodySize: '1rem',
  headingWeight: '700',
  lineHeight: '1.6',
}

export const DEFAULT_LAYOUT: PortfolioLayout = {
  contentWidth: 'medium',
  sectionSpacing: 'normal',
  borderRadius: 'medium',
  cardStyle: 'bordered',
  heroAlignment: 'center',
  sectionAlignment: 'left',
}

export const DEFAULT_SETTINGS: Portfolio['settings'] = {
  template: 'modern',
  colors: DEFAULT_COLORS,
  typography: DEFAULTTypography,
  layout: DEFAULT_LAYOUT,
  published: false,
}

export function createNewPortfolio(): Portfolio {
  return {
    id: crypto.randomUUID(),
    title: 'My Portfolio',
    slug: 'my-portfolio',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    profile: {
      firstName: '',
      lastName: '',
      title: '',
      tagline: '',
      avatar: '',
      location: '',
      email: '',
      phone: '',
      website: '',
      resumeUrl: '',
    },
    about: {
      title: 'About Me',
      description: '',
      stats: [],
    },
    experiences: [],
    projects: [],
    skills: [],
    education: [],
    certifications: [],
    services: [],
    testimonials: [],
    publications: [],
    socialLinks: [],
    sections: DEFAULT_SECTIONS.map((s) => ({ ...s })),
    settings: { ...DEFAULT_SETTINGS },
  }
}

export function createDemoPortfolio(): Portfolio {
  return {
    id: crypto.randomUUID(),
    title: 'John Doe - Full Stack Developer',
    slug: 'john-doe-portfolio',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      title: 'Full Stack Developer',
      tagline: 'I build scalable web applications and developer tools.',
      avatar: '',
      location: 'San Francisco, CA',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      website: 'https://johndoe.dev',
      resumeUrl: '',
    },
    about: {
      title: 'About Me',
      description:
        'Full-stack developer with 5+ years of experience building scalable, maintainable, and user-friendly applications. Passionate about clean code, developer experience, and open source.',
      stats: [
        { id: '1', label: 'Years Experience', value: '5+' },
        { id: '2', label: 'Projects Completed', value: '30+' },
        { id: '3', label: 'Technologies', value: '15+' },
      ],
    },
    experiences: [
      {
        id: '1',
        company: 'TechCorp',
        position: 'Senior Full Stack Developer',
        location: 'San Francisco, CA',
        employmentType: 'full-time',
        startDate: '2022-01',
        endDate: '',
        currentlyWorking: true,
        description:
          'Lead development of microservices architecture serving 1M+ users. Mentored junior developers and established coding standards.',
        technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'],
        companyUrl: 'https://techcorp.com',
      },
      {
        id: '2',
        company: 'StartupXYZ',
        position: 'Full Stack Developer',
        location: 'Remote',
        employmentType: 'full-time',
        startDate: '2020-03',
        endDate: '2021-12',
        currentlyWorking: false,
        description:
          'Built and maintained core product features. Reduced API response times by 40% through query optimization.',
        technologies: ['Vue.js', 'Python', 'MongoDB', 'Redis'],
        companyUrl: 'https://startupxyz.com',
      },
    ],
    projects: [
      {
        id: '1',
        title: 'Restaurant ERP',
        shortDescription: 'Complete restaurant management platform',
        description:
          'A comprehensive restaurant management platform covering inventory, billing, purchasing, accounting, and reporting. Built for scale with real-time updates.',
        coverImage: '',
        images: [],
        technologies: ['React', 'NestJS', 'PostgreSQL', 'Redis'],
        category: 'Web Application',
        githubUrl: 'https://github.com/johndoe/restaurant-erp',
        liveUrl: 'https://restaurant-erp.example.com',
        featured: true,
      },
      {
        id: '2',
        title: 'DevTool CLI',
        shortDescription: 'Developer productivity CLI tool',
        description:
          'A CLI tool that automates common development workflows including project scaffolding, code generation, and deployment pipelines.',
        coverImage: '',
        images: [],
        technologies: ['TypeScript', 'Node.js', 'Commander.js'],
        category: 'Developer Tool',
        githubUrl: 'https://github.com/johndoe/devtool-cli',
        liveUrl: '',
        featured: true,
      },
    ],
    skills: [
      {
        id: '1',
        name: 'Frontend',
        skills: [
          { id: '1', name: 'React', level: 95 },
          { id: '2', name: 'TypeScript', level: 90 },
          { id: '3', name: 'Next.js', level: 85 },
        ],
      },
      {
        id: '2',
        name: 'Backend',
        skills: [
          { id: '4', name: 'Node.js', level: 90 },
          { id: '5', name: 'NestJS', level: 85 },
          { id: '6', name: 'Python', level: 80 },
        ],
      },
      {
        id: '3',
        name: 'Database',
        skills: [
          { id: '7', name: 'PostgreSQL', level: 85 },
          { id: '8', name: 'MongoDB', level: 80 },
          { id: '9', name: 'Redis', level: 75 },
        ],
      },
      {
        id: '4',
        name: 'DevOps',
        skills: [
          { id: '10', name: 'Docker', level: 85 },
          { id: '11', name: 'AWS', level: 80 },
          { id: '12', name: 'Linux', level: 85 },
        ],
      },
    ],
    education: [
      {
        id: '1',
        institution: 'University of California',
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science',
        startDate: '2016-08',
        endDate: '2020-05',
        location: 'San Francisco, CA',
        description: 'Focus on software engineering and distributed systems.',
      },
    ],
    certifications: [
      {
        id: '1',
        name: 'AWS Solutions Architect',
        issuer: 'Amazon Web Services',
        issueDate: '2023-06',
        expirationDate: '2026-06',
        credentialId: 'AWS-SA-12345',
        credentialUrl: 'https://aws.amazon.com/certification',
      },
    ],
    services: [
      {
        id: '1',
        name: 'Web Development',
        description:
          'Build scalable modern web applications using React, Node.js, and cloud services.',
        icon: 'Globe',
        price: '',
        cta: 'Get in Touch',
      },
      {
        id: '2',
        name: 'Technical Consulting',
        description:
          'Architecture review, performance optimization, and technical strategy.',
        icon: 'Lightbulb',
        price: '',
        cta: 'Get in Touch',
      },
    ],
    testimonials: [
      {
        id: '1',
        personName: 'Jane Smith',
        role: 'CTO',
        company: 'TechCorp',
        avatar: '',
        content:
          'John is an exceptional developer who consistently delivers high-quality work. His ability to tackle complex problems while maintaining clean code is remarkable.',
        linkedinUrl: '',
      },
    ],
    publications: [],
    socialLinks: [
      {
        id: '1',
        platform: 'github',
        url: 'https://github.com/johndoe',
        label: 'GitHub',
      },
      {
        id: '2',
        platform: 'linkedin',
        url: 'https://linkedin.com/in/johndoe',
        label: 'LinkedIn',
      },
      {
        id: '3',
        platform: 'twitter',
        url: 'https://twitter.com/johndoe',
        label: 'Twitter',
      },
    ],
    sections: DEFAULT_SECTIONS.map((s) => ({ ...s })),
    settings: {
      template: 'modern',
      colors: { ...DEFAULT_COLORS },
      typography: { ...DEFAULTTypography },
      layout: { ...DEFAULT_LAYOUT },
      published: false,
    },
  }
}

export const SECTION_LABELS: Record<SectionId, string> = {
  profile: 'Profile',
  about: 'About',
  experience: 'Experience',
  projects: 'Projects',
  skills: 'Skills',
  education: 'Education',
  certifications: 'Certifications',
  services: 'Services',
  testimonials: 'Testimonials',
  publications: 'Publications',
  'social-links': 'Social Links',
}

export const FONT_OPTIONS = [
  'Inter',
  'Poppins',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Source Sans Pro',
  'Nunito',
  'Raleway',
  'Work Sans',
]
