interface MarkdownUIAPI {
  getDefaultLocation(): Promise<string>
  pickLocation(): Promise<string | null>
  readConfig(): Promise<Record<string, unknown> | null>
  writeConfig(config: unknown): Promise<void>
  listProjects(): Promise<Array<{ id: string; name: string; createdAt: string; updatedAt: string }>>
  readProject(id: string): Promise<string>
  writeProject(id: string, content: string): Promise<void>
  createProject(name: string): Promise<{ id: string; name: string; createdAt: string; updatedAt: string }>
  deleteProject(id: string): Promise<void>
}

interface Window {
  markdownUI: MarkdownUIAPI
}
