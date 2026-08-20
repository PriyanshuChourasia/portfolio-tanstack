export type PortfolioTemplate =
  'minimal' | 'modern' | 'creative' | 'professional'

export type SectionId =
  | 'profile'
  | 'about'
  | 'experience'
  | 'projects'
  | 'skills'
  | 'education'
  | 'certifications'
  | 'services'
  | 'testimonials'
  | 'publications'
  | 'social-links'

export interface PortfolioSection {
  id: SectionId
  title: string
  enabled: boolean
}

export interface Profile {
  firstName: string
  lastName: string
  title: string
  tagline: string
  avatar: string
  location: string
  email: string
  phone: string
  website: string
  resumeUrl: string
}

export interface AboutSection {
  title: string
  description: string
  stats: Array<AboutStat>
}

export interface AboutStat {
  id: string
  label: string
  value: string
}

export type EmploymentType =
  'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship'

export interface Experience {
  id: string
  company: string
  position: string
  location: string
  employmentType: EmploymentType
  startDate: string
  endDate: string
  currentlyWorking: boolean
  description: string
  technologies: Array<string>
  companyUrl: string
}

export interface Project {
  id: string
  title: string
  shortDescription: string
  description: string
  coverImage: string
  images: Array<string>
  technologies: Array<string>
  category: string
  githubUrl: string
  liveUrl: string
  featured: boolean
}

export interface SkillCategory {
  id: string
  name: string
  skills: Array<Skill>
}

export interface Skill {
  id: string
  name: string
  level?: number
  icon?: string
}

export interface Education {
  id: string
  institution: string
  degree: string
  fieldOfStudy: string
  startDate: string
  endDate: string
  location: string
  description: string
}

export interface Certification {
  id: string
  name: string
  issuer: string
  issueDate: string
  expirationDate: string
  credentialId: string
  credentialUrl: string
}

export interface Service {
  id: string
  name: string
  description: string
  icon: string
  price?: string
  cta?: string
}

export interface Testimonial {
  id: string
  personName: string
  role: string
  company: string
  avatar: string
  content: string
  linkedinUrl?: string
}

export interface Publication {
  id: string
  title: string
  publisher: string
  date: string
  description: string
  url: string
}

export type SocialPlatform =
  | 'github'
  | 'linkedin'
  | 'twitter'
  | 'instagram'
  | 'youtube'
  | 'dribbble'
  | 'behance'
  | 'medium'
  | 'website'

export interface SocialLink {
  id: string
  platform: SocialPlatform
  url: string
  label?: string
}

export interface ColorPreset {
  name: string
  primary: string
  secondary: string
  background: string
  text: string
  mutedText: string
  accent: string
}

export interface PortfolioColors {
  primary: string
  secondary: string
  background: string
  text: string
  mutedText: string
  accent: string
}

export interface PortfolioTypography {
  fontFamily: string
  headingSize: string
  bodySize: string
  headingWeight: string
  lineHeight: string
}

export type ContentWidth = 'narrow' | 'medium' | 'wide' | 'full'
export type SectionSpacing = 'compact' | 'normal' | 'relaxed'
export type BorderRadius = 'none' | 'small' | 'medium' | 'large' | 'full'
export type CardStyle = 'none' | 'bordered' | 'shadow' | 'glass'
export type HeroAlignment = 'left' | 'center' | 'right'
export type SectionAlignment = 'left' | 'center' | 'right'

export interface PortfolioLayout {
  contentWidth: ContentWidth
  sectionSpacing: SectionSpacing
  borderRadius: BorderRadius
  cardStyle: CardStyle
  heroAlignment: HeroAlignment
  sectionAlignment: SectionAlignment
}

export interface PortfolioSettings {
  template: PortfolioTemplate
  colors: PortfolioColors
  typography: PortfolioTypography
  layout: PortfolioLayout
  published: boolean
  publishedUrl?: string
}

export interface Portfolio {
  id: string
  title: string
  slug: string
  createdAt: string
  updatedAt: string
  profile: Profile
  about?: AboutSection
  experiences: Array<Experience>
  projects: Array<Project>
  skills: Array<SkillCategory>
  education: Array<Education>
  certifications: Array<Certification>
  services: Array<Service>
  testimonials: Array<Testimonial>
  publications: Array<Publication>
  socialLinks: Array<SocialLink>
  sections: Array<PortfolioSection>
  settings: PortfolioSettings
}

export type BuilderView = 'dashboard' | 'editor' | 'preview'
export type EditorPanel = 'content' | 'design'
export type ContentPanel =
  | 'profile'
  | 'about'
  | 'experience'
  | 'projects'
  | 'skills'
  | 'education'
  | 'certifications'
  | 'services'
  | 'testimonials'
  | 'publications'
  | 'social-links'
  | 'templates'
  | 'colors'
  | 'typography'
  | 'layout'
export type DesignPanel = 'templates' | 'colors' | 'typography' | 'layout'
export type PreviewDevice = 'desktop' | 'tablet' | 'mobile'

export type SaveStatus = 'saved' | 'saving' | 'unsaved'
