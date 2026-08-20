import {
  
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { createDemoPortfolio, createNewPortfolio } from '../data/defaults'
import type {ReactNode} from 'react';
import type {
  AboutSection,
  BuilderView,
  Certification,
  ContentPanel,
  DesignPanel,
  EditorPanel,
  Education,
  Experience,
  Portfolio,
  PortfolioColors,
  PortfolioLayout,
  PortfolioSettings,
  PortfolioTypography,
  PreviewDevice,
  Profile,
  Project,
  Publication,
  SaveStatus,
  SectionId,
  Service,
  Skill,
  SkillCategory,
  SocialLink,
  Testimonial,
} from '../types/portfolio'

const STORAGE_KEY = 'portfolio-builder.portfolios'
const AUTOSAVE_DELAY = 1000

function loadPortfolios(): Array<Portfolio> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore
  }
  const demo = createDemoPortfolio()
  return [demo]
}

function savePortfolios(portfolios: Array<Portfolio>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolios))
}

interface BuilderState {
  portfolios: Array<Portfolio>
  activePortfolio: Portfolio | null
  view: BuilderView
  editorPanel: EditorPanel
  contentPanel: ContentPanel
  designPanel: DesignPanel
  previewDevice: PreviewDevice
  saveStatus: SaveStatus
  sidebarCollapsed: boolean
  previewOpen: boolean
}

interface BuilderContextValue extends BuilderState {
  setActivePortfolio: (id: string) => void
  createPortfolio: () => Portfolio
  deletePortfolio: (id: string) => void
  duplicatePortfolio: (id: string) => void
  setView: (view: BuilderView) => void
  setEditorPanel: (panel: EditorPanel) => void
  setContentPanel: (panel: ContentPanel) => void
  setDesignPanel: (panel: DesignPanel) => void
  setPreviewDevice: (device: PreviewDevice) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setPreviewOpen: (open: boolean) => void

  updateProfile: (data: Partial<Profile>) => void
  updateAbout: (data: Partial<AboutSection>) => void
  addAboutStat: () => void
  updateAboutStat: (
    statId: string,
    data: { label: string; value: string },
  ) => void
  removeAboutStat: (statId: string) => void

  addExperience: () => void
  updateExperience: (id: string, data: Partial<Experience>) => void
  deleteExperience: (id: string) => void
  reorderExperiences: (fromIndex: number, toIndex: number) => void

  addProject: () => void
  updateProject: (id: string, data: Partial<Project>) => void
  deleteProject: (id: string) => void
  reorderProjects: (fromIndex: number, toIndex: number) => void

  addSkillCategory: () => void
  updateSkillCategory: (id: string, data: Partial<SkillCategory>) => void
  deleteSkillCategory: (id: string) => void
  addSkill: (categoryId: string) => void
  updateSkill: (
    categoryId: string,
    skillId: string,
    data: Partial<Skill>,
  ) => void
  deleteSkill: (categoryId: string, skillId: string) => void

  addEducation: () => void
  updateEducation: (id: string, data: Partial<Education>) => void
  deleteEducation: (id: string) => void

  addCertification: () => void
  updateCertification: (id: string, data: Partial<Certification>) => void
  deleteCertification: (id: string) => void

  addService: () => void
  updateService: (id: string, data: Partial<Service>) => void
  deleteService: (id: string) => void

  addTestimonial: () => void
  updateTestimonial: (id: string, data: Partial<Testimonial>) => void
  deleteTestimonial: (id: string) => void

  addPublication: () => void
  updatePublication: (id: string, data: Partial<Publication>) => void
  deletePublication: (id: string) => void

  addSocialLink: () => void
  updateSocialLink: (id: string, data: Partial<SocialLink>) => void
  deleteSocialLink: (id: string) => void

  reorderSections: (fromIndex: number, toIndex: number) => void
  toggleSection: (id: SectionId) => void
  updateSectionTitle: (id: SectionId, title: string) => void

  updateSettings: (data: Partial<PortfolioSettings>) => void
  updateColors: (data: Partial<PortfolioColors>) => void
  updateTypography: (data: Partial<PortfolioTypography>) => void
  updateLayout: (data: Partial<PortfolioLayout>) => void

  updatePortfolioTitle: (title: string) => void
  publishPortfolio: () => void
  unpublishPortfolio: () => void
}

const BuilderContext = createContext<BuilderContextValue | null>(null)

export function useBuilder() {
  const ctx = useContext(BuilderContext)
  if (!ctx) throw new Error('useBuilder must be used within BuilderProvider')
  return ctx
}

function genId(): string {
  return crypto.randomUUID()
}

export function BuilderProvider({ children }: { children: ReactNode }) {
  const [portfolios, setPortfolios] = useState<Array<Portfolio>>(loadPortfolios)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [view, setView] = useState<BuilderView>('dashboard')
  const [editorPanel, setEditorPanel] = useState<EditorPanel>('content')
  const [contentPanel, setContentPanel] = useState<ContentPanel>('profile')
  const [designPanel, setDesignPanel] = useState<DesignPanel>('templates')
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>('desktop')
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const activePortfolio = useMemo(
    () => portfolios.find((p) => p.id === activeId) ?? null,
    [portfolios, activeId],
  )

  const updateActivePortfolio = useCallback(
    (updater: (p: Portfolio) => Portfolio) => {
      setPortfolios((prev) =>
        prev.map((p) =>
          p.id === activeId
            ? updater({ ...p, updatedAt: new Date().toISOString() })
            : p,
        ),
      )
      setSaveStatus('unsaved')
    },
    [activeId],
  )

  useEffect(() => {
    if (saveStatus === 'unsaved') {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        setSaveStatus('saving')
        savePortfolios(portfolios)
        setTimeout(() => setSaveStatus('saved'), 300)
      }, AUTOSAVE_DELAY)
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [portfolios, saveStatus])

  useEffect(() => {
    savePortfolios(portfolios)
  }, [])

  const setActivePortfolio = useCallback((id: string) => {
    setActiveId(id)
    setView('editor')
    setContentPanel('profile')
    setEditorPanel('content')
  }, [])

  const createPortfolio = useCallback(() => {
    const newP = createNewPortfolio()
    setPortfolios((prev) => [newP, ...prev])
    setActiveId(newP.id)
    setView('editor')
    return newP
  }, [])

  const deletePortfolio = useCallback(
    (id: string) => {
      setPortfolios((prev) => prev.filter((p) => p.id !== id))
      if (activeId === id) {
        setActiveId(null)
        setView('dashboard')
      }
    },
    [activeId],
  )

  const duplicatePortfolio = useCallback(
    (id: string) => {
      const source = portfolios.find((p) => p.id === id)
      if (!source) return
      const dup: Portfolio = {
        ...JSON.parse(JSON.stringify(source)),
        id: genId(),
        title: `${source.title} (Copy)`,
        slug: `${source.slug}-copy`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        settings: { ...source.settings, published: false },
      }
      setPortfolios((prev) => [dup, ...prev])
    },
    [portfolios],
  )

  const updateProfile = useCallback(
    (data: Partial<Profile>) => {
      updateActivePortfolio((p) => ({
        ...p,
        profile: { ...p.profile, ...data },
      }))
    },
    [updateActivePortfolio],
  )

  const updateAbout = useCallback(
    (data: Partial<AboutSection>) => {
      updateActivePortfolio((p) => ({
        ...p,
        about: p.about
          ? { ...p.about, ...data }
          : { title: 'About Me', description: '', stats: [], ...data },
      }))
    },
    [updateActivePortfolio],
  )

  const addAboutStat = useCallback(() => {
    updateActivePortfolio((p) => ({
      ...p,
      about: {
        ...(p.about ?? { title: 'About Me', description: '', stats: [] }),
        stats: [
          ...(p.about?.stats ?? []),
          { id: genId(), label: '', value: '' },
        ],
      },
    }))
  }, [updateActivePortfolio])

  const updateAboutStat = useCallback(
    (statId: string, data: { label: string; value: string }) => {
      updateActivePortfolio((p) => ({
        ...p,
        about: {
          ...(p.about ?? { title: 'About Me', description: '', stats: [] }),
          stats: (p.about?.stats ?? []).map((s) =>
            s.id === statId ? { ...s, ...data } : s,
          ),
        },
      }))
    },
    [updateActivePortfolio],
  )

  const removeAboutStat = useCallback(
    (statId: string) => {
      updateActivePortfolio((p) => ({
        ...p,
        about: {
          ...(p.about ?? { title: 'About Me', description: '', stats: [] }),
          stats: (p.about?.stats ?? []).filter((s) => s.id !== statId),
        },
      }))
    },
    [updateActivePortfolio],
  )

  const addExperience = useCallback(() => {
    const exp: Experience = {
      id: genId(),
      company: '',
      position: '',
      location: '',
      employmentType: 'full-time',
      startDate: '',
      endDate: '',
      currentlyWorking: false,
      description: '',
      technologies: [],
      companyUrl: '',
    }
    updateActivePortfolio((p) => ({
      ...p,
      experiences: [...p.experiences, exp],
    }))
  }, [updateActivePortfolio])

  const updateExperience = useCallback(
    (id: string, data: Partial<Experience>) => {
      updateActivePortfolio((p) => ({
        ...p,
        experiences: p.experiences.map((e) =>
          e.id === id ? { ...e, ...data } : e,
        ),
      }))
    },
    [updateActivePortfolio],
  )

  const deleteExperience = useCallback(
    (id: string) => {
      updateActivePortfolio((p) => ({
        ...p,
        experiences: p.experiences.filter((e) => e.id !== id),
      }))
    },
    [updateActivePortfolio],
  )

  const reorderExperiences = useCallback(
    (from: number, to: number) => {
      updateActivePortfolio((p) => {
        const arr = [...p.experiences]
        const [item] = arr.splice(from, 1)
        arr.splice(to, 0, item)
        return { ...p, experiences: arr }
      })
    },
    [updateActivePortfolio],
  )

  const addProject = useCallback(() => {
    const proj: Project = {
      id: genId(),
      title: '',
      shortDescription: '',
      description: '',
      coverImage: '',
      images: [],
      technologies: [],
      category: '',
      githubUrl: '',
      liveUrl: '',
      featured: false,
    }
    updateActivePortfolio((p) => ({ ...p, projects: [...p.projects, proj] }))
  }, [updateActivePortfolio])

  const updateProject = useCallback(
    (id: string, data: Partial<Project>) => {
      updateActivePortfolio((p) => ({
        ...p,
        projects: p.projects.map((pr) =>
          pr.id === id ? { ...pr, ...data } : pr,
        ),
      }))
    },
    [updateActivePortfolio],
  )

  const deleteProject = useCallback(
    (id: string) => {
      updateActivePortfolio((p) => ({
        ...p,
        projects: p.projects.filter((pr) => pr.id !== id),
      }))
    },
    [updateActivePortfolio],
  )

  const reorderProjects = useCallback(
    (from: number, to: number) => {
      updateActivePortfolio((p) => {
        const arr = [...p.projects]
        const [item] = arr.splice(from, 1)
        arr.splice(to, 0, item)
        return { ...p, projects: arr }
      })
    },
    [updateActivePortfolio],
  )

  const addSkillCategory = useCallback(() => {
    const cat: SkillCategory = { id: genId(), name: '', skills: [] }
    updateActivePortfolio((p) => ({ ...p, skills: [...p.skills, cat] }))
  }, [updateActivePortfolio])

  const updateSkillCategory = useCallback(
    (id: string, data: Partial<SkillCategory>) => {
      updateActivePortfolio((p) => ({
        ...p,
        skills: p.skills.map((c) => (c.id === id ? { ...c, ...data } : c)),
      }))
    },
    [updateActivePortfolio],
  )

  const deleteSkillCategory = useCallback(
    (id: string) => {
      updateActivePortfolio((p) => ({
        ...p,
        skills: p.skills.filter((c) => c.id !== id),
      }))
    },
    [updateActivePortfolio],
  )

  const addSkill = useCallback(
    (categoryId: string) => {
      const skill: Skill = { id: genId(), name: '', level: 80 }
      updateActivePortfolio((p) => ({
        ...p,
        skills: p.skills.map((c) =>
          c.id === categoryId ? { ...c, skills: [...c.skills, skill] } : c,
        ),
      }))
    },
    [updateActivePortfolio],
  )

  const updateSkill = useCallback(
    (categoryId: string, skillId: string, data: Partial<Skill>) => {
      updateActivePortfolio((p) => ({
        ...p,
        skills: p.skills.map((c) =>
          c.id === categoryId
            ? {
                ...c,
                skills: c.skills.map((s) =>
                  s.id === skillId ? { ...s, ...data } : s,
                ),
              }
            : c,
        ),
      }))
    },
    [updateActivePortfolio],
  )

  const deleteSkill = useCallback(
    (categoryId: string, skillId: string) => {
      updateActivePortfolio((p) => ({
        ...p,
        skills: p.skills.map((c) =>
          c.id === categoryId
            ? { ...c, skills: c.skills.filter((s) => s.id !== skillId) }
            : c,
        ),
      }))
    },
    [updateActivePortfolio],
  )

  const addEducation = useCallback(() => {
    const edu: Education = {
      id: genId(),
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      location: '',
      description: '',
    }
    updateActivePortfolio((p) => ({ ...p, education: [...p.education, edu] }))
  }, [updateActivePortfolio])

  const updateEducation = useCallback(
    (id: string, data: Partial<Education>) => {
      updateActivePortfolio((p) => ({
        ...p,
        education: p.education.map((e) =>
          e.id === id ? { ...e, ...data } : e,
        ),
      }))
    },
    [updateActivePortfolio],
  )

  const deleteEducation = useCallback(
    (id: string) => {
      updateActivePortfolio((p) => ({
        ...p,
        education: p.education.filter((e) => e.id !== id),
      }))
    },
    [updateActivePortfolio],
  )

  const addCertification = useCallback(() => {
    const cert: Certification = {
      id: genId(),
      name: '',
      issuer: '',
      issueDate: '',
      expirationDate: '',
      credentialId: '',
      credentialUrl: '',
    }
    updateActivePortfolio((p) => ({
      ...p,
      certifications: [...p.certifications, cert],
    }))
  }, [updateActivePortfolio])

  const updateCertification = useCallback(
    (id: string, data: Partial<Certification>) => {
      updateActivePortfolio((p) => ({
        ...p,
        certifications: p.certifications.map((c) =>
          c.id === id ? { ...c, ...data } : c,
        ),
      }))
    },
    [updateActivePortfolio],
  )

  const deleteCertification = useCallback(
    (id: string) => {
      updateActivePortfolio((p) => ({
        ...p,
        certifications: p.certifications.filter((c) => c.id !== id),
      }))
    },
    [updateActivePortfolio],
  )

  const addService = useCallback(() => {
    const svc: Service = {
      id: genId(),
      name: '',
      description: '',
      icon: 'Circle',
    }
    updateActivePortfolio((p) => ({ ...p, services: [...p.services, svc] }))
  }, [updateActivePortfolio])

  const updateService = useCallback(
    (id: string, data: Partial<Service>) => {
      updateActivePortfolio((p) => ({
        ...p,
        services: p.services.map((s) => (s.id === id ? { ...s, ...data } : s)),
      }))
    },
    [updateActivePortfolio],
  )

  const deleteService = useCallback(
    (id: string) => {
      updateActivePortfolio((p) => ({
        ...p,
        services: p.services.filter((s) => s.id !== id),
      }))
    },
    [updateActivePortfolio],
  )

  const addTestimonial = useCallback(() => {
    const t: Testimonial = {
      id: genId(),
      personName: '',
      role: '',
      company: '',
      avatar: '',
      content: '',
    }
    updateActivePortfolio((p) => ({
      ...p,
      testimonials: [...p.testimonials, t],
    }))
  }, [updateActivePortfolio])

  const updateTestimonial = useCallback(
    (id: string, data: Partial<Testimonial>) => {
      updateActivePortfolio((p) => ({
        ...p,
        testimonials: p.testimonials.map((t) =>
          t.id === id ? { ...t, ...data } : t,
        ),
      }))
    },
    [updateActivePortfolio],
  )

  const deleteTestimonial = useCallback(
    (id: string) => {
      updateActivePortfolio((p) => ({
        ...p,
        testimonials: p.testimonials.filter((t) => t.id !== id),
      }))
    },
    [updateActivePortfolio],
  )

  const addPublication = useCallback(() => {
    const pub: Publication = {
      id: genId(),
      title: '',
      publisher: '',
      date: '',
      description: '',
      url: '',
    }
    updateActivePortfolio((p) => ({
      ...p,
      publications: [...p.publications, pub],
    }))
  }, [updateActivePortfolio])

  const updatePublication = useCallback(
    (id: string, data: Partial<Publication>) => {
      updateActivePortfolio((p) => ({
        ...p,
        publications: p.publications.map((pub) =>
          pub.id === id ? { ...pub, ...data } : pub,
        ),
      }))
    },
    [updateActivePortfolio],
  )

  const deletePublication = useCallback(
    (id: string) => {
      updateActivePortfolio((p) => ({
        ...p,
        publications: p.publications.filter((pub) => pub.id !== id),
      }))
    },
    [updateActivePortfolio],
  )

  const addSocialLink = useCallback(() => {
    const link: SocialLink = { id: genId(), platform: 'github', url: '' }
    updateActivePortfolio((p) => ({
      ...p,
      socialLinks: [...p.socialLinks, link],
    }))
  }, [updateActivePortfolio])

  const updateSocialLink = useCallback(
    (id: string, data: Partial<SocialLink>) => {
      updateActivePortfolio((p) => ({
        ...p,
        socialLinks: p.socialLinks.map((l) =>
          l.id === id ? { ...l, ...data } : l,
        ),
      }))
    },
    [updateActivePortfolio],
  )

  const deleteSocialLink = useCallback(
    (id: string) => {
      updateActivePortfolio((p) => ({
        ...p,
        socialLinks: p.socialLinks.filter((l) => l.id !== id),
      }))
    },
    [updateActivePortfolio],
  )

  const reorderSections = useCallback(
    (from: number, to: number) => {
      updateActivePortfolio((p) => {
        const arr = [...p.sections]
        const [item] = arr.splice(from, 1)
        arr.splice(to, 0, item)
        return { ...p, sections: arr }
      })
    },
    [updateActivePortfolio],
  )

  const toggleSection = useCallback(
    (id: SectionId) => {
      updateActivePortfolio((p) => ({
        ...p,
        sections: p.sections.map((s) =>
          s.id === id ? { ...s, enabled: !s.enabled } : s,
        ),
      }))
    },
    [updateActivePortfolio],
  )

  const updateSectionTitle = useCallback(
    (id: SectionId, title: string) => {
      updateActivePortfolio((p) => ({
        ...p,
        sections: p.sections.map((s) => (s.id === id ? { ...s, title } : s)),
      }))
    },
    [updateActivePortfolio],
  )

  const updateSettings = useCallback(
    (data: Partial<PortfolioSettings>) => {
      updateActivePortfolio((p) => ({
        ...p,
        settings: { ...p.settings, ...data },
      }))
    },
    [updateActivePortfolio],
  )

  const updateColors = useCallback(
    (data: Partial<PortfolioColors>) => {
      updateActivePortfolio((p) => ({
        ...p,
        settings: { ...p.settings, colors: { ...p.settings.colors, ...data } },
      }))
    },
    [updateActivePortfolio],
  )

  const updateTypography = useCallback(
    (data: Partial<PortfolioTypography>) => {
      updateActivePortfolio((p) => ({
        ...p,
        settings: {
          ...p.settings,
          typography: { ...p.settings.typography, ...data },
        },
      }))
    },
    [updateActivePortfolio],
  )

  const updateLayout = useCallback(
    (data: Partial<PortfolioLayout>) => {
      updateActivePortfolio((p) => ({
        ...p,
        settings: { ...p.settings, layout: { ...p.settings.layout, ...data } },
      }))
    },
    [updateActivePortfolio],
  )

  const updatePortfolioTitle = useCallback(
    (title: string) => {
      updateActivePortfolio((p) => ({
        ...p,
        title,
        slug: title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
      }))
    },
    [updateActivePortfolio],
  )

  const publishPortfolio = useCallback(() => {
    updateSettings({ published: true })
  }, [updateSettings])

  const unpublishPortfolio = useCallback(() => {
    updateSettings({ published: false })
  }, [updateSettings])

  const value: BuilderContextValue = useMemo(
    () => ({
      portfolios,
      activePortfolio,
      view,
      editorPanel,
      contentPanel,
      designPanel,
      previewDevice,
      saveStatus,
      sidebarCollapsed,
      previewOpen,
      setActivePortfolio,
      createPortfolio,
      deletePortfolio,
      duplicatePortfolio,
      setView,
      setEditorPanel,
      setContentPanel,
      setDesignPanel,
      setPreviewDevice,
      setSidebarCollapsed,
      setPreviewOpen,
      updateProfile,
      updateAbout,
      addAboutStat,
      updateAboutStat,
      removeAboutStat,
      addExperience,
      updateExperience,
      deleteExperience,
      reorderExperiences,
      addProject,
      updateProject,
      deleteProject,
      reorderProjects,
      addSkillCategory,
      updateSkillCategory,
      deleteSkillCategory,
      addSkill,
      updateSkill,
      deleteSkill,
      addEducation,
      updateEducation,
      deleteEducation,
      addCertification,
      updateCertification,
      deleteCertification,
      addService,
      updateService,
      deleteService,
      addTestimonial,
      updateTestimonial,
      deleteTestimonial,
      addPublication,
      updatePublication,
      deletePublication,
      addSocialLink,
      updateSocialLink,
      deleteSocialLink,
      reorderSections,
      toggleSection,
      updateSectionTitle,
      updateSettings,
      updateColors,
      updateTypography,
      updateLayout,
      updatePortfolioTitle,
      publishPortfolio,
      unpublishPortfolio,
    }),
    [
      portfolios,
      activePortfolio,
      view,
      editorPanel,
      contentPanel,
      designPanel,
      previewDevice,
      saveStatus,
      sidebarCollapsed,
      previewOpen,
      setActivePortfolio,
      createPortfolio,
      deletePortfolio,
      duplicatePortfolio,
      setView,
      setEditorPanel,
      setContentPanel,
      setDesignPanel,
      setPreviewDevice,
      setSidebarCollapsed,
      setPreviewOpen,
      updateProfile,
      updateAbout,
      addAboutStat,
      updateAboutStat,
      removeAboutStat,
      addExperience,
      updateExperience,
      deleteExperience,
      reorderExperiences,
      addProject,
      updateProject,
      deleteProject,
      reorderProjects,
      addSkillCategory,
      updateSkillCategory,
      deleteSkillCategory,
      addSkill,
      updateSkill,
      deleteSkill,
      addEducation,
      updateEducation,
      deleteEducation,
      addCertification,
      updateCertification,
      deleteCertification,
      addService,
      updateService,
      deleteService,
      addTestimonial,
      updateTestimonial,
      deleteTestimonial,
      addPublication,
      updatePublication,
      deletePublication,
      addSocialLink,
      updateSocialLink,
      deleteSocialLink,
      reorderSections,
      toggleSection,
      updateSectionTitle,
      updateSettings,
      updateColors,
      updateTypography,
      updateLayout,
      updatePortfolioTitle,
      publishPortfolio,
      unpublishPortfolio,
    ],
  )

  return (
    <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>
  )
}
