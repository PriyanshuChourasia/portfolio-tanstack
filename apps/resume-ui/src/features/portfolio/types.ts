export interface PortfolioHero {
  name: string
  title: string
  tagline: string
  profileImage: string
  resumeUrl: string
  videoUrl: string
  socialLinks: Array<{
    platform: string
    url: string
    icon: string
  }>
}

export interface AboutData {
  title: string
  description: string
  image: string
  stats: Array<{
    label: string
    value: string
  }>
}

export interface ServiceItem {
  id: string
  title: string
  description: string
  icon: string
}

export interface SkillItem {
  id: string
  name: string
  percentage: number
}

export interface StatItem {
  id: string
  label: string
  value: string
  suffix: string
}

export interface PortfolioProject {
  id: string
  title: string
  category: string
  description: string
  image: string
  tags: Array<string>
  link: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  quote: string
  avatar: string
  rating: number
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  date: string
  image: string
  category: string
  link: string
  author: string
}

export interface ContactInfo {
  email: string
  phone: string
  address: string
  newsletterTitle: string
  newsletterDescription: string
}

export interface FooterData {
  copyright: string
  madeWith: string
  socialLinks: Array<{
    platform: string
    url: string
    icon: string
  }>
}

export interface ColorTheme {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
  textMuted: string
}

export interface PortfolioData {
  hero: PortfolioHero
  about: AboutData
  services: Array<ServiceItem>
  skills: Array<SkillItem>
  stats: Array<StatItem>
  projects: Array<PortfolioProject>
  testimonials: Array<Testimonial>
  blog: Array<BlogPost>
  contact: ContactInfo
  footer: FooterData
  theme: ColorTheme
  sections: {
    hero: boolean
    about: boolean
    services: boolean
    skills: boolean
    stats: boolean
    projects: boolean
    testimonials: boolean
    blog: boolean
    contact: boolean
    footer: boolean
  }
}
