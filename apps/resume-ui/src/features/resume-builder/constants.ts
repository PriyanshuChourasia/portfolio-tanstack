import type {
  AwardEntry,
  CertificationEntry,
  EducationEntry,
  ExperienceEntry,
  InterestEntry,
  LanguageEntry,
  PersonalInfo,
  ProjectEntry,
  PublicationEntry,
  ReferenceEntry,
  ResumeData,
  SkillCategory,
  VolunteerEntry,
  CustomSectionEntry,
} from './types'
import { DEFAULT_THEME, DEFAULT_SETTINGS, DEFAULT_SECTION_ORDER } from './types'

export const STORAGE_KEY = 'resume-builder:data'

export function createId(): string {
  return crypto.randomUUID()
}

export function createEmptyResumeData(): ResumeData {
  return {
    personalInfo: {
      fullName: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
      photoUrl: '',
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    awards: [],
    volunteer: [],
    references: [],
    publications: [],
    interests: [],
    customSections: [],
    theme: { ...DEFAULT_THEME },
    settings: { ...DEFAULT_SETTINGS },
    sectionOrder: [...DEFAULT_SECTION_ORDER],
    pageBreakBefore: [],
  }
}

export function createEmptyExperience(): ExperienceEntry {
  return {
    id: createId(),
    role: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    bullets: '',
  }
}

export function createEmptyEducation(): EducationEntry {
  return {
    id: createId(),
    degree: '',
    institution: '',
    fieldOfStudy: '',
    state: '',
    startDate: '',
    endDate: '',
    location: '',
    date: '',
  }
}

export function createEmptySkillCategory(): SkillCategory {
  return { id: createId(), label: '', value: '' }
}

export function createEmptyProject(): ProjectEntry {
  return {
    id: createId(),
    name: '',
    domain: '',
    stack: '',
    startDate: '',
    endDate: '',
    bullets: '',
  }
}

export function createEmptyCertification(): CertificationEntry {
  return { id: createId(), name: '', url: '' }
}

export function createEmptyLanguage(): LanguageEntry {
  return { id: createId(), name: '', level: '' }
}

export function createEmptyAward(): AwardEntry {
  return { id: createId(), name: '', date: '', issuer: '', description: '' }
}

export function createEmptyVolunteer(): VolunteerEntry {
  return {
    id: createId(),
    role: '',
    organization: '',
    location: '',
    startDate: '',
    endDate: '',
    bullets: '',
  }
}

export function createEmptyReference(): ReferenceEntry {
  return { id: createId(), name: '', title: '', company: '', email: '', phone: '' }
}

export function createEmptyPublication(): PublicationEntry {
  return { id: createId(), title: '', publisher: '', date: '', url: '', description: '' }
}

export function createEmptyInterest(): InterestEntry {
  return { id: createId(), name: '', description: '' }
}

export function createEmptyCustomSection(): CustomSectionEntry {
  return { id: createId(), title: '', content: '' }
}

export function createSampleResumeData(): ResumeData {
  return {
    personalInfo: {
      fullName: 'Priyanshu Chourasia',
      title: 'Software Engineer',
      email: 'priyanshuchourasia916@gmail.com',
      phone: '+91-6203163193',
      location: 'Pune, India',
      linkedin: 'https://linkedin.com/in/priyanshu-chourasia-17833120a/',
      website: 'https://codymitra.com',
      photoUrl: '',
    },
    summary:
      'Software Engineer with 2+ years building full-stack systems across web and mobile using React, TypeScript, Flutter, Java, and Spring Boot. Built production-grade real-time GPS tracking, a multi-threaded on-demand reporting pipeline serving 2,000+ devices, and internal dashboards used in daily operations. Designs REST APIs, works across MySQL/MongoDB data layers, and deploys Spring Boot services with Docker and GitHub Actions CI/CD. Builds Model Context Protocol (MCP) servers to expose internal APIs as tools for AI agents.',
    experience: [
      {
        id: createId(),
        role: 'Software Engineer',
        company: 'Primesys Technologies LLP',
        location: 'Pune, India',
        startDate: 'Sep 2023',
        endDate: 'Present',
        bullets:
          'Migrated a legacy Angular application to React with TanStack file-based routing, per-module registry.json documentation, and lazy-loaded components to improve type safety and component reuse.\nCut redundant API calls and re-renders with useMemo/useCallback, offloaded heavy background work to Web Workers, and implemented WebSocket-based live location tracking with client-side caching.\nBuilt an internal Admin Web Application from scratch with Chakra UI and shadcn/ui, delivering an interactive data-insights dashboard to modernize operational workflows.\nArchitected a real-time, on-demand reporting system in Spring Boot replacing scheduled cron jobs, scaling instant report delivery to 2,000+ devices using ExecutorService with fixed-size thread pools, cutting report generation time 60% (1m 45s → 35s) for 300 devices.\nBuilt a trip-detection engine in Java to identify valid directional movement patterns from raw GPS data, and optimized database queries and indexing strategies to improve reporting throughput.\nDesigned and implemented REST APIs across the stack, built a report versioning and audit-logging framework for historical traceability and compliance.\nBuilt cross-platform mobile apps in React Native and Flutter, diagnosed animation bottlenecks and led migration from React Native to Flutter, resolving Google Maps marker jitter.\nBuilt custom MCP servers with the Anthropic MCP SDK to expose internal APIs and business logic as callable tools for AI agents.',
      },
    ],
    education: [
      {
        id: createId(),
        degree: 'Bachelor of Technology',
        institution: 'JIS University',
        fieldOfStudy: 'Mechanical Engineering',
        state: 'Kolkata, India',
        startDate: '2019',
        endDate: '2023',
        location: '',
        date: '',
      },
    ],
    skills: [
      { id: createId(), label: 'Languages', value: 'Java, Python, PHP, JavaScript (ES6+), TypeScript' },
      { id: createId(), label: 'Frontend', value: 'React, React Query, Next.js, zod, HTML5, CSS3, Tailwind CSS, Web Workers, Shadcn/ui' },
      { id: createId(), label: 'Backend', value: 'Spring Boot, Express.js, Node.js, Laravel, REST API Design, Multi-Threading, WebSockets' },
      { id: createId(), label: 'Mobile', value: 'React Native, Flutter, Google Maps SDK' },
      { id: createId(), label: 'Databases', value: 'MySQL, MongoDB, PostgreSQL, schema design, indexing, query optimization' },
      { id: createId(), label: 'DevOps & Tools', value: 'Docker, Nginx, Redis, Ubuntu Server, GitHub Actions CI/CD, Git, Linux' },
      { id: createId(), label: 'AI & MCP', value: 'Claude Code, MCP server development, prompt engineering' },
    ],
    projects: [
      {
        id: createId(),
        name: 'Personal Portfolio',
        domain: 'Web Development',
        stack: 'JavaScript, TypeScript, React, Shadcn/ui, CSS',
        startDate: '',
        endDate: '',
        bullets: 'Designed, built, and self-hosted a personal portfolio site on a custom domain, including a custom MCP server exposing internal APIs for AI-agent access.',
      },
      {
        id: createId(),
        name: 'Rabindra Memorial Eye Care',
        domain: 'Clinic Management',
        stack: 'PHP, Laravel, JavaScript, TypeScript, TanStack React',
        startDate: '',
        endDate: '',
        bullets: 'Contributed to the Booking and Inventory modules of a full-stack clinic management system, centralizing operations into a unified dashboard in place of manual processes.\nBuilt reporting features for customer relationship management and inventory tracking, implemented role-based authentication and authorization for employee access control.',
      },
      {
        id: createId(),
        name: 'Taxyaar',
        domain: 'Income Tax Filing Platform',
        stack: 'Java, Spring Boot, PHP, Laravel, TypeScript, TanStack React, Docker',
        startDate: '',
        endDate: '',
        bullets: 'Built a full-stack income-tax filing platform as part of a 4-member team, guiding users through the entire ITR filing flow end-to-end.\nIntegrated with the Income Tax Department of India e-Filing portal for prefill data retrieval and ITR submission.\nBuilt on a multi-modular Spring Boot architecture with end-to-end encryption/decryption of financial and personal data.\nDesigned and built the Help Support Web Application from architecture through frontend-backend integration.\nOwned deployment and infrastructure for frontend and backend services on Ubuntu/Nginx/Docker.',
      },
    ],
    certifications: [
      { id: createId(), name: 'MCP & A2A: Model Context Protocol & Agent-to-Agent Protocol', url: '' },
    ],
    languages: [
      { id: createId(), name: 'English', level: 'Advanced' },
      { id: createId(), name: 'Hindi', level: 'Native' },
    ],
    awards: [],
    volunteer: [],
    references: [],
    publications: [],
    interests: [],
    customSections: [],
    theme: { ...DEFAULT_THEME },
    settings: { ...DEFAULT_SETTINGS },
    sectionOrder: [...DEFAULT_SECTION_ORDER],
    pageBreakBefore: [],
  }
}
