import { create } from 'zustand'
import type {
  ResumeData,
  ResumeDocument,
  ResumeMeta,
  ResumeSettings,
  ResumeTheme,
  PersonalInfo,
  ExperienceEntry,
  EducationEntry,
  SkillCategory,
  ProjectEntry,
  CertificationEntry,
  LanguageEntry,
  AwardEntry,
  VolunteerEntry,
  ReferenceEntry,
  PublicationEntry,
  InterestEntry,
  CustomSectionEntry,
  SectionId,
} from './types'
import {
  DEFAULT_SETTINGS,
  DEFAULT_SECTION_ORDER,
  DEFAULT_THEME,
} from './types'
import {
  createEmptyResumeData,
  createSampleResumeData,
  createId,
  STORAGE_KEY,
} from './constants'

/* ── History for undo/redo ── */
const MAX_HISTORY = 100

interface HistoryState {
  past: Array<ResumeData>
  present: ResumeData
  future: Array<ResumeData>
}

/* ── Multi-resume registry ── */
const REGISTRY_KEY = 'resume-ui:registry'
const ACTIVE_KEY = 'resume-ui:active'

function loadRegistry(): Array<ResumeMeta> {
  try {
    const raw = localStorage.getItem(REGISTRY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function loadActiveId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_KEY)
  } catch {
    return null
  }
}

function loadResumeData(id: string): ResumeData | null {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}:${id}`)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return { ...createEmptyResumeData(), ...parsed }
  } catch {
    return null
  }
}

function saveResumeData(id: string, data: ResumeData) {
  localStorage.setItem(`${STORAGE_KEY}:${id}`, JSON.stringify(data))
}

function saveRegistry(registry: Array<ResumeMeta>) {
  localStorage.setItem(REGISTRY_KEY, JSON.stringify(registry))
}

function saveActiveId(id: string) {
  localStorage.setItem(ACTIVE_KEY, id)
}

function isEffectivelyEmpty(data: ResumeData): boolean {
  return (
    !data.personalInfo.fullName.trim() &&
    data.experience.length === 0 &&
    data.education.length === 0 &&
    data.skills.length === 0 &&
    data.projects.length === 0
  )
}

function createInitialDocument(): ResumeDocument {
  const meta: ResumeMeta = {
    id: createId(),
    name: 'My Resume',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // Try loading from legacy single-resume storage
  try {
    const legacy = localStorage.getItem(STORAGE_KEY)
    if (legacy) {
      const parsed = { ...createEmptyResumeData(), ...JSON.parse(legacy) }
      if (!isEffectivelyEmpty(parsed)) {
        return { meta, data: parsed }
      }
    }
  } catch {}

  return { meta, data: createSampleResumeData() }
}

/* ── List CRUD shape used by all dynamic sections ── */
interface ListField<T> {
  items: Array<T>
  add: (item: T) => void
  update: (index: number, patch: Partial<T>) => void
  remove: (index: number) => void
  reorder: (fromIndex: number, toIndex: number) => void
}

/* ── Store interface ── */
interface ResumeStore {
  // Multi-resume
  registry: Array<ResumeMeta>
  activeId: string

  // Current document
  document: ResumeDocument

  // History
  history: HistoryState
  canUndo: boolean
  canRedo: boolean

  // Resume data actions
  updatePersonalInfo: (patch: Partial<PersonalInfo>) => void
  updateSummary: (summary: string) => void
  updateTheme: (patch: Partial<ResumeTheme>) => void
  setFullTheme: (theme: ResumeTheme) => void
  setElementColor: (id: string, color: string) => void
  updateSettings: (patch: Partial<ResumeSettings>) => void
  setSectionOrder: (order: Array<SectionId>) => void
  toggleSection: (sectionId: SectionId) => void
  toggleSectionPageBreak: (sectionId: SectionId) => void

  // List CRUD
  experience: ListField<ExperienceEntry>
  education: ListField<EducationEntry>
  skills: ListField<SkillCategory>
  projects: ListField<ProjectEntry>
  certifications: ListField<CertificationEntry>
  languages: ListField<LanguageEntry>
  awards: ListField<AwardEntry>
  volunteer: ListField<VolunteerEntry>
  references: ListField<ReferenceEntry>
  publications: ListField<PublicationEntry>
  interests: ListField<InterestEntry>
  customSections: ListField<CustomSectionEntry>

  // Undo/Redo
  undo: () => void
  redo: () => void

  // Multi-resume
  createResume: (name?: string) => string
  switchResume: (id: string) => void
  deleteResume: (id: string) => void
  renameResume: (id: string, name: string) => void

  // Import/Export
  exportAsJson: () => string
  importFromJson: (json: string) => void

  // Reset
  resetData: () => void
}

function pushHistory(history: HistoryState, data: ResumeData): HistoryState {
  const newPast = [...history.past, history.present].slice(-MAX_HISTORY)
  return {
    past: newPast,
    present: data,
    future: [],
  }
}

function initialLoad() {
  const registry = loadRegistry()
  let initialDoc: ResumeDocument

  if (registry.length > 0) {
    const activeId = loadActiveId() ?? registry[0].id
    const data = loadResumeData(activeId) ?? createSampleResumeData()
    const meta = registry.find((r) => r.id === activeId) ?? registry[0]
    initialDoc = { meta, data }
  } else {
    initialDoc = createInitialDocument()
    const meta = initialDoc.meta
    registry.push(meta)
    saveRegistry(registry)
    saveActiveId(meta.id)
    saveResumeData(meta.id, initialDoc.data)
  }

  return { registry, initialDoc }
}

const { registry: initialRegistry, initialDoc } = initialLoad()

const initialHistory: HistoryState = {
  past: [],
  present: initialDoc.data,
  future: [],
}

export const useResumeStore = create<ResumeStore>((set, get) => ({
  registry: initialRegistry,
  activeId: initialDoc.meta.id,
  document: initialDoc,
  history: initialHistory,
  canUndo: false,
  canRedo: false,

  /* ── helper: update data + history + persist ── */
  updatePersonalInfo: (patch) =>
    set((state) => {
      const newData: ResumeData = {
        ...state.history.present,
        personalInfo: { ...state.history.present.personalInfo, ...patch },
      }
      const newHistory = pushHistory(state.history, newData)
      saveResumeData(state.document.meta.id, newData)
      const newRegistry = state.registry.map((r) =>
        r.id === state.document.meta.id ? { ...r, updatedAt: new Date().toISOString() } : r,
      )
      saveRegistry(newRegistry)
      return {
        history: newHistory,
        document: { ...state.document, data: newData, meta: { ...state.document.meta, updatedAt: new Date().toISOString() } },
        registry: newRegistry,
        canUndo: newHistory.past.length > 0,
        canRedo: newHistory.future.length > 0,
      }
    }),

  updateSummary: (summary) =>
    set((state) => {
      const newData = { ...state.history.present, summary }
      const newHistory = pushHistory(state.history, newData)
      saveResumeData(state.document.meta.id, newData)
      return {
        history: newHistory,
        document: { ...state.document, data: newData },
        canUndo: newHistory.past.length > 0,
        canRedo: newHistory.future.length > 0,
      }
    }),

  updateTheme: (patch) =>
    set((state) => {
      const newData = { ...state.history.present, theme: { ...state.history.present.theme, ...patch } }
      const newHistory = pushHistory(state.history, newData)
      saveResumeData(state.document.meta.id, newData)
      return {
        history: newHistory,
        document: { ...state.document, data: newData },
        canUndo: newHistory.past.length > 0,
        canRedo: newHistory.future.length > 0,
      }
    }),

  setFullTheme: (theme) =>
    set((state) => {
      const newData = { ...state.history.present, theme }
      const newHistory = pushHistory(state.history, newData)
      saveResumeData(state.document.meta.id, newData)
      return {
        history: newHistory,
        document: { ...state.document, data: newData },
        canUndo: newHistory.past.length > 0,
        canRedo: newHistory.future.length > 0,
      }
    }),

  setElementColor: (id, color) =>
    set((state) => {
      const nextColors = { ...state.history.present.elementColors }
      if (color) {
        nextColors[id] = color
      } else {
        delete nextColors[id]
      }
      const newData: ResumeData = { ...state.history.present, elementColors: nextColors }
      const newHistory = pushHistory(state.history, newData)
      saveResumeData(state.document.meta.id, newData)
      return {
        history: newHistory,
        document: { ...state.document, data: newData },
        canUndo: newHistory.past.length > 0,
        canRedo: newHistory.future.length > 0,
      }
    }),

  updateSettings: (patch) =>
    set((state) => {
      const newData = { ...state.history.present, settings: { ...state.history.present.settings, ...patch } }
      const newHistory = pushHistory(state.history, newData)
      saveResumeData(state.document.meta.id, newData)
      return {
        history: newHistory,
        document: { ...state.document, data: newData },
        canUndo: newHistory.past.length > 0,
        canRedo: newHistory.future.length > 0,
      }
    }),

  setSectionOrder: (order) =>
    set((state) => {
      const newData = { ...state.history.present, sectionOrder: order }
      const newHistory = pushHistory(state.history, newData)
      saveResumeData(state.document.meta.id, newData)
      return {
        history: newHistory,
        document: { ...state.document, data: newData },
        canUndo: newHistory.past.length > 0,
        canRedo: newHistory.future.length > 0,
      }
    }),

  toggleSection: (sectionId) =>
    set((state) => {
      const order = state.history.present.sectionOrder.includes(sectionId)
        ? state.history.present.sectionOrder
        : [...state.history.present.sectionOrder, sectionId]
      const newData = { ...state.history.present, sectionOrder: order }
      const newHistory = pushHistory(state.history, newData)
      saveResumeData(state.document.meta.id, newData)
      return {
        history: newHistory,
        document: { ...state.document, data: newData },
        canUndo: newHistory.past.length > 0,
        canRedo: newHistory.future.length > 0,
      }
    }),

  toggleSectionPageBreak: (sectionId) =>
    set((state) => {
      const current = state.history.present.pageBreakBefore
      const pageBreakBefore = current.includes(sectionId)
        ? current.filter((id) => id !== sectionId)
        : [...current, sectionId]
      const newData = { ...state.history.present, pageBreakBefore }
      const newHistory = pushHistory(state.history, newData)
      saveResumeData(state.document.meta.id, newData)
      return {
        history: newHistory,
        document: { ...state.document, data: newData },
        canUndo: newHistory.past.length > 0,
        canRedo: newHistory.future.length > 0,
      }
    }),

  /* ── List CRUD — uses a shared helper to keep things DRY ── */
  experience: makeList<ExperienceEntry>('experience', set, get),
  education: makeList<EducationEntry>('education', set, get),
  skills: makeList<SkillCategory>('skills', set, get),
  projects: makeList<ProjectEntry>('projects', set, get),
  certifications: makeList<CertificationEntry>('certifications', set, get),
  languages: makeList<LanguageEntry>('languages', set, get),
  awards: makeList<AwardEntry>('awards', set, get),
  volunteer: makeList<VolunteerEntry>('volunteer', set, get),
  references: makeList<ReferenceEntry>('references', set, get),
  publications: makeList<PublicationEntry>('publications', set, get),
  interests: makeList<InterestEntry>('interests', set, get),
  customSections: makeList<CustomSectionEntry>('customSections', set, get),

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
      saveResumeData(state.document.meta.id, previous)
      return {
        history: newHistory,
        document: { ...state.document, data: previous },
        canUndo: newHistory.past.length > 0,
        canRedo: newHistory.future.length > 0,
      }
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
      saveResumeData(state.document.meta.id, next)
      return {
        history: newHistory,
        document: { ...state.document, data: next },
        canUndo: newHistory.past.length > 0,
        canRedo: newHistory.future.length > 0,
      }
    }),

  createResume: (name) => {
    const id = createId()
    const meta: ResumeMeta = {
      id,
      name: name ?? 'Untitled Resume',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const data = createEmptyResumeData()
    saveResumeData(id, data)
    set((state) => {
      const newRegistry = [...state.registry, meta]
      saveRegistry(newRegistry)
      return { registry: newRegistry }
    })
    return id
  },

  switchResume: (id) => {
    const data = loadResumeData(id)
    if (!data) return
    saveActiveId(id)
    set((state) => ({
      activeId: id,
      document: {
        meta: state.registry.find((r) => r.id === id) ?? state.document.meta,
        data,
      },
      history: { past: [], present: data, future: [] },
      canUndo: false,
      canRedo: false,
    }))
  },

  deleteResume: (id) => {
    set((state) => {
      const newRegistry = state.registry.filter((r) => r.id !== id)
      if (newRegistry.length === 0) {
        const newDoc = createInitialDocument()
        saveRegistry([newDoc.meta])
        saveActiveId(newDoc.meta.id)
        saveResumeData(newDoc.meta.id, newDoc.data)
        return {
          registry: [newDoc.meta],
          activeId: newDoc.meta.id,
          document: newDoc,
          history: { past: [], present: newDoc.data, future: [] },
          canUndo: false,
          canRedo: false,
        }
      }
      if (state.activeId === id) {
        const next = newRegistry[0]
        const data = loadResumeData(next.id) ?? createEmptyResumeData()
        saveActiveId(next.id)
        saveRegistry(newRegistry)
        return {
          registry: newRegistry,
          activeId: next.id,
          document: { meta: next, data },
          history: { past: [], present: data, future: [] },
          canUndo: false,
          canRedo: false,
        }
      }
      saveRegistry(newRegistry)
      localStorage.removeItem(`${STORAGE_KEY}:${id}`)
      return { registry: newRegistry }
    })
  },

  renameResume: (id, name) => {
    set((state) => {
      const newRegistry = state.registry.map((r) =>
        r.id === id ? { ...r, name } : r,
      )
      saveRegistry(newRegistry)
      return {
        registry: newRegistry,
        document:
          state.document.meta.id === id
            ? { ...state.document, meta: { ...state.document.meta, name } }
            : state.document,
      }
    })
  },

  exportAsJson: () => {
    const state = get()
    return JSON.stringify(
      { meta: state.document.meta, data: state.history.present },
      null,
      2,
    )
  },

  importFromJson: (json) => {
    try {
      const parsed = JSON.parse(json)
      const data = { ...createEmptyResumeData(), ...parsed.data }
      const meta: ResumeMeta = parsed.meta ?? {
        id: createId(),
        name: parsed.data?.personalInfo?.fullName ?? 'Imported Resume',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      saveResumeData(meta.id, data)
      set((state) => {
        const newRegistry = [...state.registry, meta]
        saveRegistry(newRegistry)
        saveActiveId(meta.id)
        return {
          registry: newRegistry,
          activeId: meta.id,
          document: { meta, data },
          history: { past: [], present: data, future: [] },
          canUndo: false,
          canRedo: false,
        }
      })
    } catch (e) {
      console.error('Import failed:', e)
    }
  },

  resetData: () =>
    set((state) => {
      const newData = createEmptyResumeData()
      const newHistory = pushHistory(state.history, newData)
      saveResumeData(state.document.meta.id, newData)
      return {
        history: newHistory,
        document: { ...state.document, data: newData },
        canUndo: newHistory.past.length > 0,
        canRedo: newHistory.future.length > 0,
      }
    }),
}))

/* ── List field factory ── */
function makeList<T>(
  key: keyof ResumeData,
  set: (updater: (state: ResumeStore) => Partial<ResumeStore>) => void,
  get: () => ResumeStore,
): ListField<T> {
  return {
    get items() {
      return (get().history.present[key] ?? []) as unknown as Array<T>
    },
    add: (item: T) =>
      set((state) => {
        const list = [...((state.history.present[key] ?? []) as unknown as Array<T>), item]
        const newData = { ...state.history.present, [key]: list }
        const newHistory = pushHistory(state.history, newData)
        saveResumeData(state.document.meta.id, newData)
        return {
          history: newHistory,
          document: { ...state.document, data: newData },
          canUndo: newHistory.past.length > 0,
          canRedo: newHistory.future.length > 0,
        }
      }),
    update: (index: number, patch: Partial<T>) =>
      set((state) => {
        const list = [...((state.history.present[key] ?? []) as unknown as Array<T>)]
        list[index] = { ...list[index], ...patch }
        const newData = { ...state.history.present, [key]: list }
        const newHistory = pushHistory(state.history, newData)
        saveResumeData(state.document.meta.id, newData)
        return {
          history: newHistory,
          document: { ...state.document, data: newData },
          canUndo: newHistory.past.length > 0,
          canRedo: newHistory.future.length > 0,
        }
      }),
    remove: (index: number) =>
      set((state) => {
        const list = ((state.history.present[key] ?? []) as unknown as Array<T>).filter(
          (_, i) => i !== index,
        )
        const newData = { ...state.history.present, [key]: list }
        const newHistory = pushHistory(state.history, newData)
        saveResumeData(state.document.meta.id, newData)
        return {
          history: newHistory,
          document: { ...state.document, data: newData },
          canUndo: newHistory.past.length > 0,
          canRedo: newHistory.future.length > 0,
        }
      }),
    reorder: (fromIndex: number, toIndex: number) =>
      set((state) => {
        const list = [...((state.history.present[key] ?? []) as unknown as Array<T>)]
        const [moved] = list.splice(fromIndex, 1)
        list.splice(toIndex, 0, moved)
        const newData = { ...state.history.present, [key]: list }
        const newHistory = pushHistory(state.history, newData)
        saveResumeData(state.document.meta.id, newData)
        return {
          history: newHistory,
          document: { ...state.document, data: newData },
          canUndo: newHistory.past.length > 0,
          canRedo: newHistory.future.length > 0,
        }
      }),
  }
}
