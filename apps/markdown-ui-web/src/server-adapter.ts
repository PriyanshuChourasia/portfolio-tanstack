import type { PageMeta, ProjectMeta, StorageAdapter, UserConfig } from 'markdown-ui-core'

const API_BASE = '/api'

// Cached config path - populated during startup
let cachedConfigPath: string | null = null

function apiFetch(path: string, options?: RequestInit): Promise<Response> {
  return fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
}

function checkResponse(res: Response): Promise<Response> {
  if (!res.ok) {
    return res.json().then((data) => {
      throw new Error(data.error ?? `Request failed with status ${res.status}`)
    }).then(() => {
      // Re-throw with the original status info
      throw new Error(`Request failed with status ${res.status}`)
    })
  }
  return Promise.resolve(res)
}

export function cacheConfigPath(path: string): void {
  cachedConfigPath = path
}

export const serverAdapter: StorageAdapter = {
  async pickLocation(): Promise<string> {
    // Return the fixed storage location used by the local server
    try {
      const res = await apiFetch('/config-path')
      if (!res.ok) throw new Error('Server unavailable')
      const text = await res.text()
      try {
        const data = JSON.parse(text)
        return data.path
      } catch {
        throw new Error('Invalid server response')
      }
    } catch (err) {
      throw new Error(`Failed to get storage location: ${err instanceof Error ? err.message : 'Network error'}`)
    }
  },

  getDefaultLocationLabel(): string {
    // Return the resolved config path as a human-readable string
    // Uses cached value from startup fetch, or falls back to a placeholder
    return cachedConfigPath ?? 'Local Markdown-AI Storage'
  },

  getLocationNote(): string | null {
    // Server mode already resolves and shows the real OS path
    return null
  },

  async readConfig(): Promise<UserConfig | null> {
    const res = await apiFetch('/config')
    if (res.status === 404) return null
    await checkResponse(res)
    return res.json()
  },

  async writeConfig(config: UserConfig): Promise<void> {
    const res = await apiFetch('/config', {
      method: 'PUT',
      body: JSON.stringify(config),
    })
    await checkResponse(res)
  },

  async listProjects(): Promise<ProjectMeta[]> {
    const res = await apiFetch('/projects')
    await checkResponse(res)
    const data = await res.json()
    return data.projects ?? []
  },

  async createProject(name: string): Promise<ProjectMeta> {
    const res = await apiFetch('/projects', {
      method: 'POST',
      body: JSON.stringify({ name }),
    })
    await checkResponse(res)
    return res.json()
  },

  async deleteProject(id: string): Promise<void> {
    const res = await apiFetch(`/projects/${id}`, {
      method: 'DELETE',
    })
    await checkResponse(res)
  },

  async listPages(projectId: string): Promise<Array<PageMeta>> {
    const res = await apiFetch(`/projects/${projectId}/pages`)
    await checkResponse(res)
    const data = await res.json()
    return data.pages ?? []
  },

  async createPage(projectId: string, name: string): Promise<PageMeta> {
    const res = await apiFetch(`/projects/${projectId}/pages`, {
      method: 'POST',
      body: JSON.stringify({ name }),
    })
    await checkResponse(res)
    return res.json()
  },

  async readPage(projectId: string, pageId: string): Promise<string> {
    const res = await apiFetch(`/projects/${projectId}/pages/${pageId}`)
    if (res.status === 404) return ''
    await checkResponse(res)
    const data = await res.json()
    return data.content ?? ''
  },

  async writePage(projectId: string, pageId: string, content: string): Promise<void> {
    const res = await apiFetch(`/projects/${projectId}/pages/${pageId}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    })
    await checkResponse(res)
  },

  async reorderPages(projectId: string, orderedPageIds: string[]): Promise<void> {
    const res = await apiFetch(`/projects/${projectId}/pages/reorder`, {
      method: 'PUT',
      body: JSON.stringify({ pageIds: orderedPageIds }),
    })
    await checkResponse(res)
  },

  async deletePage(projectId: string, pageId: string): Promise<void> {
    const res = await apiFetch(`/projects/${projectId}/pages/${pageId}`, {
      method: 'DELETE',
    })
    await checkResponse(res)
  },
}
