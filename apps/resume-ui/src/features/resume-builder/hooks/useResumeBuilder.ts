import { useEffect, useState } from 'react'
import { createEmptyResumeData, createSampleResumeData, STORAGE_KEY } from '../constants'
import { useListField } from './useListField'
import type {
  CertificationEntry,
  EducationEntry,
  ExperienceEntry,
  LanguageEntry,
  PersonalInfo,
  ProjectEntry,
  ResumeData,
  ResumeTheme,
  SkillCategory,
} from '../types'

function isEffectivelyEmpty(data: ResumeData): boolean {
  return (
    !data.personalInfo.fullName.trim() &&
    data.experience.length === 0 &&
    data.education.length === 0 &&
    data.skills.length === 0 &&
    data.projects.length === 0
  )
}

function loadInitialData(): ResumeData {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      // First visit — pre-populate with sample data
      return createSampleResumeData()
    }
    const parsed = { ...createEmptyResumeData(), ...JSON.parse(raw) }
    // Saved state from before sample data existed (or a manual Reset) can
    // look like a real save but has nothing in it — treat that the same
    // as a first visit so the template never renders blank.
    return isEffectivelyEmpty(parsed) ? createSampleResumeData() : parsed
  } catch {
    return createSampleResumeData()
  }
}

export function useResumeBuilder() {
  const [data, setData] = useState<ResumeData>(loadInitialData)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  const updatePersonalInfo = (patch: Partial<PersonalInfo>) =>
    setData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...patch },
    }))

  const updateSummary = (summary: string) =>
    setData((prev) => ({ ...prev, summary }))

  const updateTheme = (patch: Partial<ResumeTheme>) =>
    setData((prev) => ({
      ...prev,
      theme: { ...prev.theme, ...patch },
    }))

  const setFullTheme = (theme: ResumeTheme) =>
    setData((prev) => ({ ...prev, theme }))

  const experience = useListField<ExperienceEntry>(data.experience, (list) =>
    setData((prev) => ({ ...prev, experience: list })),
  )
  const education = useListField<EducationEntry>(data.education, (list) =>
    setData((prev) => ({ ...prev, education: list })),
  )
  const skills = useListField<SkillCategory>(data.skills, (list) =>
    setData((prev) => ({ ...prev, skills: list })),
  )
  const projects = useListField<ProjectEntry>(data.projects, (list) =>
    setData((prev) => ({ ...prev, projects: list })),
  )
  const certifications = useListField<CertificationEntry>(
    data.certifications,
    (list) => setData((prev) => ({ ...prev, certifications: list })),
  )
  const languages = useListField<LanguageEntry>(data.languages, (list) =>
    setData((prev) => ({ ...prev, languages: list })),
  )

  const resetData = () => setData(createEmptyResumeData())

  return {
    data,
    updatePersonalInfo,
    updateSummary,
    updateTheme,
    setFullTheme,
    experience,
    education,
    skills,
    projects,
    certifications,
    languages,
    resetData,
  }
}
