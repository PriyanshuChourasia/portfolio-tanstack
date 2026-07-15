import { create } from 'zustand'
import type {
  PortfolioData,
  PortfolioHero,
  AboutData,
  ServiceItem,
  SkillItem,
  StatItem,
  PortfolioProject,
  Testimonial,
  BlogPost,
  ContactInfo,
  FooterData,
  ColorTheme,
} from './types'
import {
  createEmptyPortfolioData,
  createSamplePortfolioData,
  STORAGE_KEY,
} from './constants'

const TEMPLATE_KEY = 'portfolio-builder:template'

/* ── History stack for undo/redo ── */
const MAX_HISTORY = 50

function loadTemplate(): string {
  try {
    return localStorage.getItem(TEMPLATE_KEY) || 'lendex'
  } catch {
    return 'lendex'
  }
}

function saveTemplate(id: string) {
  localStorage.setItem(TEMPLATE_KEY, id)
}

interface HistoryState {
  past: Array<PortfolioData>
  present: PortfolioData
  future: Array<PortfolioData>
}

/* ── Persistence ── */
function loadData(): PortfolioData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return { ...createEmptyPortfolioData(), ...parsed }
    }
  } catch {}
  return createSamplePortfolioData()
}

function saveData(data: PortfolioData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

/* ── Store interface ── */
interface PortfolioStore {
  data: PortfolioData
  history: HistoryState
  activeTemplate: string

  // Template
  setTemplate: (id: string) => void

  // Section toggles
  toggleSection: (section: keyof PortfolioData['sections']) => void

  // Hero
  updateHero: (patch: Partial<PortfolioHero>) => void
  addSocialLink: (link: PortfolioHero['socialLinks'][0]) => void
  updateSocialLink: (index: number, patch: Partial<PortfolioHero['socialLinks'][0]>) => void
  removeSocialLink: (index: number) => void

  // About
  updateAbout: (patch: Partial<AboutData>) => void

  // Services
  addService: (item: ServiceItem) => void
  updateService: (index: number, patch: Partial<ServiceItem>) => void
  removeService: (index: number) => void

  // Skills
  addSkill: (item: SkillItem) => void
  updateSkill: (index: number, patch: Partial<SkillItem>) => void
  removeSkill: (index: number) => void

  // Stats
  addStat: (item: StatItem) => void
  updateStat: (index: number, patch: Partial<StatItem>) => void
  removeStat: (index: number) => void

  // Projects
  addProject: (item: PortfolioProject) => void
  updateProject: (index: number, patch: Partial<PortfolioProject>) => void
  removeProject: (index: number) => void

  // Testimonials
  addTestimonial: (item: Testimonial) => void
  updateTestimonial: (index: number, patch: Partial<Testimonial>) => void
  removeTestimonial: (index: number) => void

  // Blog
  addBlogPost: (item: BlogPost) => void
  updateBlogPost: (index: number, patch: Partial<BlogPost>) => void
  removeBlogPost: (index: number) => void

  // Contact
  updateContact: (patch: Partial<ContactInfo>) => void

  // Footer
  updateFooter: (patch: Partial<FooterData>) => void
  addFooterSocial: (link: FooterData['socialLinks'][0]) => void
  updateFooterSocial: (index: number, patch: Partial<FooterData['socialLinks'][0]>) => void
  removeFooterSocial: (index: number) => void

  // Theme
  updateTheme: (patch: Partial<ColorTheme>) => void

  // Undo/Redo
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean

  // Reset
  resetData: () => void
}

export const usePortfolioStore = create<PortfolioStore>((set, get) => {
  const initial = loadData()
  const initialHistory: HistoryState = {
    past: [],
    present: initial,
    future: [],
  }

  function pushHistory(history: HistoryState, data: PortfolioData): HistoryState {
    const newPast = [...history.past, history.present].slice(-MAX_HISTORY)
    return { past: newPast, present: data, future: [] }
  }

  function setData(updater: (prev: PortfolioData) => PortfolioData) {
    set((state) => {
      const newData = updater(state.history.present)
      const newHistory = pushHistory(state.history, newData)
      saveData(newData)
      return { data: newData, history: newHistory }
    })
  }

  return {
    data: initial,
    history: initialHistory,
    activeTemplate: loadTemplate(),

    setTemplate: (id) => {
      saveTemplate(id)
      set({ activeTemplate: id })
    },

    get canUndo() {
      return get().history.past.length > 0
    },

    get canRedo() {
      return get().history.future.length > 0
    },

    toggleSection: (section) =>
      setData((prev) => ({
        ...prev,
        sections: { ...prev.sections, [section]: !prev.sections[section] },
      })),

    updateHero: (patch) =>
      setData((prev) => ({ ...prev, hero: { ...prev.hero, ...patch } })),

    addSocialLink: (link) =>
      setData((prev) => ({
        ...prev,
        hero: { ...prev.hero, socialLinks: [...prev.hero.socialLinks, link] },
      })),

    updateSocialLink: (index, patch) =>
      setData((prev) => {
        const links = [...prev.hero.socialLinks]
        links[index] = { ...links[index], ...patch }
        return { ...prev, hero: { ...prev.hero, socialLinks: links } }
      }),

    removeSocialLink: (index) =>
      setData((prev) => ({
        ...prev,
        hero: {
          ...prev.hero,
          socialLinks: prev.hero.socialLinks.filter((_, i) => i !== index),
        },
      })),

    updateAbout: (patch) =>
      setData((prev) => ({ ...prev, about: { ...prev.about, ...patch } })),

    addService: (item) =>
      setData((prev) => ({
        ...prev,
        services: [...prev.services, item],
      })),

    updateService: (index, patch) =>
      setData((prev) => {
        const list = [...prev.services]
        list[index] = { ...list[index], ...patch }
        return { ...prev, services: list }
      }),

    removeService: (index) =>
      setData((prev) => ({
        ...prev,
        services: prev.services.filter((_, i) => i !== index),
      })),

    addSkill: (item) =>
      setData((prev) => ({ ...prev, skills: [...prev.skills, item] })),

    updateSkill: (index, patch) =>
      setData((prev) => {
        const list = [...prev.skills]
        list[index] = { ...list[index], ...patch }
        return { ...prev, skills: list }
      }),

    removeSkill: (index) =>
      setData((prev) => ({
        ...prev,
        skills: prev.skills.filter((_, i) => i !== index),
      })),

    addStat: (item) =>
      setData((prev) => ({ ...prev, stats: [...prev.stats, item] })),

    updateStat: (index, patch) =>
      setData((prev) => {
        const list = [...prev.stats]
        list[index] = { ...list[index], ...patch }
        return { ...prev, stats: list }
      }),

    removeStat: (index) =>
      setData((prev) => ({
        ...prev,
        stats: prev.stats.filter((_, i) => i !== index),
      })),

    addProject: (item) =>
      setData((prev) => ({ ...prev, projects: [...prev.projects, item] })),

    updateProject: (index, patch) =>
      setData((prev) => {
        const list = [...prev.projects]
        list[index] = { ...list[index], ...patch }
        return { ...prev, projects: list }
      }),

    removeProject: (index) =>
      setData((prev) => ({
        ...prev,
        projects: prev.projects.filter((_, i) => i !== index),
      })),

    addTestimonial: (item) =>
      setData((prev) => ({
        ...prev,
        testimonials: [...prev.testimonials, item],
      })),

    updateTestimonial: (index, patch) =>
      setData((prev) => {
        const list = [...prev.testimonials]
        list[index] = { ...list[index], ...patch }
        return { ...prev, testimonials: list }
      }),

    removeTestimonial: (index) =>
      setData((prev) => ({
        ...prev,
        testimonials: prev.testimonials.filter((_, i) => i !== index),
      })),

    addBlogPost: (item) =>
      setData((prev) => ({ ...prev, blog: [...prev.blog, item] })),

    updateBlogPost: (index, patch) =>
      setData((prev) => {
        const list = [...prev.blog]
        list[index] = { ...list[index], ...patch }
        return { ...prev, blog: list }
      }),

    removeBlogPost: (index) =>
      setData((prev) => ({
        ...prev,
        blog: prev.blog.filter((_, i) => i !== index),
      })),

    updateContact: (patch) =>
      setData((prev) => ({ ...prev, contact: { ...prev.contact, ...patch } })),

    updateFooter: (patch) =>
      setData((prev) => ({ ...prev, footer: { ...prev.footer, ...patch } })),

    addFooterSocial: (link) =>
      setData((prev) => ({
        ...prev,
        footer: { ...prev.footer, socialLinks: [...prev.footer.socialLinks, link] },
      })),

    updateFooterSocial: (index, patch) =>
      setData((prev) => {
        const links = [...prev.footer.socialLinks]
        links[index] = { ...links[index], ...patch }
        return { ...prev, footer: { ...prev.footer, socialLinks: links } }
      }),

    removeFooterSocial: (index) =>
      setData((prev) => ({
        ...prev,
        footer: {
          ...prev.footer,
          socialLinks: prev.footer.socialLinks.filter((_, i) => i !== index),
        },
      })),

    updateTheme: (patch) =>
      setData((prev) => ({ ...prev, theme: { ...prev.theme, ...patch } })),

    undo: () =>
      set((state) => {
        if (state.history.past.length === 0) return state
        const newPast = [...state.history.past]
        const previous = newPast.pop()!
        const newHistory = {
          past: newPast,
          present: previous,
          future: [state.history.present, ...state.history.future].slice(0, MAX_HISTORY),
        }
        saveData(previous)
        return { data: previous, history: newHistory }
      }),

    redo: () =>
      set((state) => {
        if (state.history.future.length === 0) return state
        const newFuture = [...state.history.future]
        const next = newFuture.shift()!
        const newHistory = {
          past: [...state.history.past, state.history.present].slice(-MAX_HISTORY),
          present: next,
          future: newFuture,
        }
        saveData(next)
        return { data: next, history: newHistory }
      }),

    resetData: () => {
      const empty = createEmptyPortfolioData()
      saveData(empty)
      set({
        data: empty,
        history: { past: [], present: empty, future: [] },
      })
    },
  }
})
