export interface PersonalInfo {
  fullName: string
  title: string
  email: string
  phone: string
  location: string
  linkedin: string
  website: string
  photoUrl: string
}

export interface ExperienceEntry {
  id: string
  role: string
  company: string
  location: string
  startDate: string
  endDate: string
  bullets: string
}

export interface EducationEntry {
  id: string
  degree: string
  institution: string
  fieldOfStudy: string
  state: string
  startDate: string
  endDate: string
  location: string
  date: string
}

export interface SkillCategory {
  id: string
  label: string
  value: string
}

export interface ProjectEntry {
  id: string
  name: string
  domain: string
  stack: string
  startDate: string
  endDate: string
  bullets: string
}

export interface CertificationEntry {
  id: string
  name: string
  url: string
}

export interface LanguageEntry {
  id: string
  name: string
  level: string
}

export interface AwardEntry {
  id: string
  name: string
  date: string
  issuer: string
  description: string
}

export interface VolunteerEntry {
  id: string
  role: string
  organization: string
  location: string
  startDate: string
  endDate: string
  bullets: string
}

export interface ReferenceEntry {
  id: string
  name: string
  title: string
  company: string
  email: string
  phone: string
}

export interface PublicationEntry {
  id: string
  title: string
  publisher: string
  date: string
  url: string
  description: string
}

export interface InterestEntry {
  id: string
  name: string
  description: string
}

export interface CustomSectionEntry {
  id: string
  title: string
  content: string
}

export interface ResumeTheme {
  primary: string
  accent: string
  text: string
  muted: string
  background: string
  sidebar?: string
}

export interface ResumeSettings {
  fontSize: 'small' | 'medium' | 'large'
  bulletStyle: 'disc' | 'circle' | 'square' | 'dash' | 'check' | 'arrow' | 'decimal'
  orientation: 'portrait' | 'landscape'
  paperSize: 'a4' | 'letter'
  primaryFont: string
  headingFontSize: number
  bodyFontSize: number
  sectionSpacing: number
  lineHeight: number
  margins: 'narrow' | 'normal' | 'wide'
}

export type SectionId =
  | 'personal'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'languages'
  | 'awards'
  | 'volunteer'
  | 'references'
  | 'publications'
  | 'interests'
  | 'custom'

export interface SectionConfig {
  id: SectionId
  label: string
  enabled: boolean
  customTitle?: string
}

export interface ResumeData {
  personalInfo: PersonalInfo
  summary: string
  experience: Array<ExperienceEntry>
  education: Array<EducationEntry>
  skills: Array<SkillCategory>
  projects: Array<ProjectEntry>
  certifications: Array<CertificationEntry>
  languages: Array<LanguageEntry>
  awards: Array<AwardEntry>
  volunteer: Array<VolunteerEntry>
  references: Array<ReferenceEntry>
  publications: Array<PublicationEntry>
  interests: Array<InterestEntry>
  customSections: Array<CustomSectionEntry>
  theme: ResumeTheme
  /** Per-element color overrides, keyed by a stable element id (e.g. "name", "heading:experience"). */
  elementColors: Record<string, string>
  settings: ResumeSettings
  sectionOrder: Array<SectionId>
  pageBreakBefore: Array<SectionId>
}

export interface ResumeMeta {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface ResumeDocument {
  meta: ResumeMeta
  data: ResumeData
}

export type ResumeListKey =
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'languages'
  | 'awards'
  | 'volunteer'
  | 'references'
  | 'publications'
  | 'interests'
  | 'customSections'

export const DEFAULT_THEME: ResumeTheme = {
  primary: '#111827',
  accent: '#059669',
  text: '#292524',
  muted: '#57534e',
  background: '#ffffff',
  sidebar: '#111827',
}

export const DEFAULT_SETTINGS: ResumeSettings = {
  fontSize: 'medium',
  bulletStyle: 'disc',
  orientation: 'portrait',
  paperSize: 'a4',
  primaryFont: 'Inter',
  headingFontSize: 16,
  bodyFontSize: 11,
  sectionSpacing: 12,
  lineHeight: 1.5,
  margins: 'normal',
}

export const DEFAULT_SECTION_ORDER: Array<SectionId> = [
  'personal',
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
  'languages',
  'awards',
  'volunteer',
  'publications',
  'references',
  'interests',
  'custom',
]

export const SECTION_LABELS: Record<SectionId, string> = {
  personal: 'Personal Information',
  summary: 'Professional Summary',
  experience: 'Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications',
  languages: 'Languages',
  awards: 'Awards & Achievements',
  volunteer: 'Volunteer Experience',
  references: 'References',
  publications: 'Publications',
  interests: 'Interests',
  custom: 'Custom Sections',
}
