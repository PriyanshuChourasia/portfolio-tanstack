import { useState, useCallback, useEffect, useRef } from 'react'

export interface PhotofolioProject {
  id: string
  name: string
  createdAt: number
  updatedAt: number
}

const PROJECTS_KEY = 'photofolio-projects'
const OLD_DATA_KEY = 'photofolio-images'

function loadProjects(): PhotofolioProject[] {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveProjects(projects: PhotofolioProject[]) {
  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))
  } catch { /* ignore */ }
}

function cleanProjectData(projectId: string) {
  try {
    localStorage.removeItem(`photofolio-images-${projectId}`)
    localStorage.removeItem(`photofolio-layout-${projectId}`)
  } catch { /* ignore */ }
}

export function usePhotofolioProjects() {
  const [projects, setProjects] = useState<PhotofolioProject[]>(loadProjects)
  const isInitialized = useRef(false)

  useEffect(() => {
    if (isInitialized.current) return
    isInitialized.current = true
    const existing = loadProjects()
    if (existing.length === 0) {
      const oldData = localStorage.getItem(OLD_DATA_KEY)
      if (oldData) {
        try {
          const photos = JSON.parse(oldData) as { id: string; url: string; name: string; x: number; y: number; width: number; height: number; zoom: number; offsetX: number; offsetY: number }[]
          if (photos.length > 0) {
            const defaultProject: PhotofolioProject = {
              id: crypto.randomUUID(),
              name: 'My Photofolio',
              createdAt: Date.now(),
              updatedAt: Date.now(),
            }
            localStorage.setItem(PROJECTS_KEY, JSON.stringify([defaultProject]))
            localStorage.setItem(`photofolio-images-${defaultProject.id}`, oldData)
            localStorage.removeItem(OLD_DATA_KEY)
            setProjects([defaultProject])
            return
          }
        } catch { /* ignore */ }
      }
    }
  }, [])

  useEffect(() => {
    saveProjects(projects)
  }, [projects])

  const list = useCallback(() => projects, [projects])

  const create = useCallback((name: string) => {
    const project: PhotofolioProject = {
      id: crypto.randomUUID(),
      name,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    setProjects((prev) => [...prev, project])
    return project
  }, [])

  const rename = useCallback((id: string, name: string) => {
    setProjects((prev) =>
      prev.map((p) => p.id === id ? { ...p, name, updatedAt: Date.now() } : p),
    )
  }, [])

  const remove = useCallback((id: string) => {
    cleanProjectData(id)
    setProjects((prev) => prev.filter((p) => p.id !== id))
  }, [])

  return { projects, list, create, rename, remove }
}
