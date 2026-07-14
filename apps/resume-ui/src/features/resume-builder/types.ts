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
  /* kept for backward compat — will be removed in future */
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

export interface ResumeData {
  personalInfo: PersonalInfo
  summary: string
  experience: Array<ExperienceEntry>
  education: Array<EducationEntry>
  skills: Array<SkillCategory>
  projects: Array<ProjectEntry>
  certifications: Array<CertificationEntry>
  languages: Array<LanguageEntry>
  theme: ResumeTheme
}

export interface ResumeTheme {
  primary: string
  accent: string
  text: string
  muted: string
  background: string
  sidebar?: string
}

export type ResumeListKey =
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'languages'
