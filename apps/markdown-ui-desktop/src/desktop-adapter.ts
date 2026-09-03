import type { StorageAdapter, ProjectMeta, UserConfig } from 'markdown-ui-core'

declare global {
  interface Window {
    markdownUI: {
      getDefaultLocation(): Promise<string>
      pickLocation(): Promise<string | null>
      readConfig(): Promise<Record<string, unknown> | null>
      writeConfig(config: unknown): Promise<void>
      listProjects(): Promise<Array<ProjectMeta>>
      readProject(id: string): Promise<string>
      writeProject(id: string, content: string): Promise<void>
      createProject(name: string): Promise<ProjectMeta>
      deleteProject(id: string): Promise<void>
    }
  }
}

export const desktopAdapter: StorageAdapter = {
  async pickLocation(): Promise<string> {
    const loc = await window.markdownUI.pickLocation()
    return loc ?? ''
  },

  getDefaultLocationLabel(): string {
    return 'Local storage'
  },

  async readConfig(): Promise<UserConfig | null> {
    const raw = await window.markdownUI.readConfig()
    if (!raw) return null
    return raw as unknown as UserConfig
  },

  async writeConfig(config: UserConfig): Promise<void> {
    await window.markdownUI.writeConfig(config)
  },

  async listProjects(): Promise<ProjectMeta[]> {
    return window.markdownUI.listProjects()
  },

  async readProject(id: string): Promise<string> {
    return window.markdownUI.readProject(id)
  },

  async writeProject(id: string, content: string): Promise<void> {
    await window.markdownUI.writeProject(id, content)
  },

  async createProject(name: string): Promise<ProjectMeta> {
    return window.markdownUI.createProject(name)
  },

  async deleteProject(id: string): Promise<void> {
    await window.markdownUI.deleteProject(id)
  },
}
