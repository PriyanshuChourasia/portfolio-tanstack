export interface ProjectMeta {
  id: string
  name: string
  path: string
  createdAt: string
  updatedAt: string
}

export interface PageMeta {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  order: number
}

export interface UserConfig {
  locationLabel: string
  createdAt: string
}

/**
 * Page content is stored as HTML — the editor's native content model
 * (TipTap getHTML() output, with inline styles for text color).
 * Legacy pages stored as sigil markdown (.md with ==highlight== /
 * %%color:...%% sigils) are converted once on open via legacyMdToHtml()
 * (the old ==highlight== sigil is dropped; %%color:...%% still maps to color).
 */

export interface StorageAdapter {
  pickLocation(): Promise<string>
  getDefaultLocationLabel(): string
  /** Caveat text to show next to the location label, e.g. when the label isn't a full path. Null if none. */
  getLocationNote(): string | null
  readConfig(): Promise<UserConfig | null>
  writeConfig(config: UserConfig): Promise<void>
  listProjects(): Promise<ProjectMeta[]>
  pickProjectFolder(): Promise<string | null>
  createProject(name: string, path: string): Promise<ProjectMeta>
  deleteProject(id: string): Promise<void>
  listPages(projectId: string): Promise<PageMeta[]>
  createPage(projectId: string, name: string): Promise<PageMeta>
  readPage(projectId: string, pageId: string): Promise<string>
  writePage(projectId: string, pageId: string, content: string): Promise<void>
  deletePage(projectId: string, pageId: string): Promise<void>
  reorderPages(projectId: string, orderedPageIds: string[]): Promise<void>
}
