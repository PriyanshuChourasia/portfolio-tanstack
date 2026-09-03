export interface ProjectMeta {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface UserConfig {
  name: string
  email?: string
  github?: string
  socials: Array<{ label: string; url: string }>
  createdAt: string
}

export interface StorageAdapter {
  pickLocation(): Promise<string>
  getDefaultLocationLabel(): string
  readConfig(): Promise<UserConfig | null>
  writeConfig(config: UserConfig): Promise<void>
  listProjects(): Promise<ProjectMeta[]>
  readProject(id: string): Promise<string>
  writeProject(id: string, content: string): Promise<void>
  createProject(name: string): Promise<ProjectMeta>
  deleteProject(id: string): Promise<void>
}
