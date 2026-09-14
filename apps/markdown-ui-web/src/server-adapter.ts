import type { ProjectMeta, StorageAdapter, UserConfig } from 'markdown-ui-core'

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

  async readProject(id: string): Promise<string> {
    const res = await apiFetch(`/projects/${id}`)
    if (res.status === 404) return ''
    await checkResponse(res)
    const data = await res.json()
    return data.content ?? ''
  },

  async writeProject(id: string, content: string): Promise<void> {
    const res = await apiFetch(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    })
    await checkResponse(res)
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
}
