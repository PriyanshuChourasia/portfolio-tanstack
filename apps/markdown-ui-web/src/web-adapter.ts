import type { PageMeta, ProjectMeta, StorageAdapter, UserConfig } from 'markdown-ui-core'

const DB_NAME = 'markdown-ui'
const DB_VERSION = 1
const STORE_NAME = 'handles'
const ROOT_KEY = 'root-handle'
const SEED_CONTENT = `# Untitled Page\n\nStart writing your markdown here...\n`
const LEGACY_SEED_CONTENT = `# Untitled Project\n\nStart writing your markdown here...\n`

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAME)
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function saveHandle(handle: FileSystemDirectoryHandle): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).put(handle, ROOT_KEY)
    tx.oncomplete = () => { db.close(); resolve() }
    tx.onerror = () => { db.close(); reject(tx.error) }
  })
}

async function loadHandle(): Promise<FileSystemDirectoryHandle | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const req = tx.objectStore(STORE_NAME).get(ROOT_KEY)
    req.onsuccess = () => { db.close(); resolve(req.result ?? null) }
    req.onerror = () => { db.close(); reject(req.error) }
  })
}

let dirHandle: FileSystemDirectoryHandle | null = null

async function ensureHandle(): Promise<FileSystemDirectoryHandle> {
  if (dirHandle) return dirHandle
  const handle = await loadHandle()
  if (!handle) throw new Error('No storage location configured')
  const perm = await handle.queryPermission({ mode: 'readwrite' })
  if (perm !== 'granted') {
    const req = await handle.requestPermission({ mode: 'readwrite' })
    if (req !== 'granted') throw new Error('Permission denied')
  }
  dirHandle = handle
  return dirHandle
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function sanitizeFileName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

async function getFileHandle(
  root: FileSystemDirectoryHandle,
  path: string,
  create: boolean,
): Promise<FileSystemFileHandle> {
  const parts = path.split('/')
  let current = root
  for (let i = 0; i < parts.length - 1; i++) {
    current = await current.getDirectoryHandle(parts[i], { create })
  }
  return current.getFileHandle(parts[parts.length - 1], { create })
}

async function getDirHandle(
  root: FileSystemDirectoryHandle,
  path: string,
  create: boolean,
): Promise<FileSystemDirectoryHandle> {
  const parts = path.split('/')
  let current = root
  for (const part of parts) {
    current = await current.getDirectoryHandle(part, { create })
  }
  return current
}

async function writeFile(
  root: FileSystemDirectoryHandle,
  path: string,
  content: string,
): Promise<void> {
  const fh = await getFileHandle(root, path, true)
  const w = await fh.createWritable()
  await w.write(content)
  await w.close()
}

async function readFile(
  root: FileSystemDirectoryHandle,
  path: string,
): Promise<string | null> {
  try {
    const fh = await getFileHandle(root, path, false)
    return await (await fh.getFile()).text()
  } catch {
    return null
  }
}

type ProjectIndexEntry = ProjectMeta & { fileName: string }
type PageIndexEntry = PageMeta & { fileName: string }

async function readIndex(
  root: FileSystemDirectoryHandle,
): Promise<{ projects: Array<ProjectIndexEntry> }> {
  const raw = await readFile(root, 'projects/index.json')
  if (!raw) return { projects: [] }
  try { return JSON.parse(raw) } catch { return { projects: [] } }
}

async function writeIndex(
  root: FileSystemDirectoryHandle,
  index: { projects: Array<ProjectIndexEntry> },
): Promise<void> {
  await getDirHandle(root, 'projects', true)
  await writeFile(root, 'projects/index.json', JSON.stringify(index, null, 2))
}

async function getProjectFileName(
  root: FileSystemDirectoryHandle,
  projectId: string,
): Promise<string | null> {
  const index = await readIndex(root)
  return index.projects.find((p) => p.id === projectId)?.fileName ?? null
}

async function readPagesIndex(
  root: FileSystemDirectoryHandle,
  projectFileName: string,
): Promise<{ pages: Array<PageIndexEntry> }> {
  const raw = await readFile(root, `projects/${projectFileName}/index.json`)
  if (!raw) return { pages: [] }
  try {
    const data = JSON.parse(raw) as { pages: Array<PageIndexEntry> }
    let changed = false
    for (const p of data.pages) {
      if (p.order === undefined) {
        p.order = data.pages.indexOf(p)
        changed = true
      }
    }
    if (changed) await writePagesIndex(root, projectFileName, data)
    return data
  } catch { return { pages: [] } }
}

async function writePagesIndex(
  root: FileSystemDirectoryHandle,
  projectFileName: string,
  index: { pages: Array<PageIndexEntry> },
): Promise<void> {
  await getDirHandle(root, `projects/${projectFileName}`, true)
  await writeFile(root, `projects/${projectFileName}/index.json`, JSON.stringify(index, null, 2))
}

async function migrateLegacyProject(
  root: FileSystemDirectoryHandle,
  projectFileName: string,
): Promise<{ pages: Array<PageIndexEntry> } | null> {
  const legacyContent = await readFile(root, `projects/${projectFileName}.md`)
  if (legacyContent === null) return null
  if (legacyContent.trim() === '' || legacyContent.trim() === LEGACY_SEED_CONTENT.trim()) return null
  const now = new Date().toISOString()
  const entry: PageIndexEntry = { id: generateId(), name: 'Home', createdAt: now, updatedAt: now, fileName: 'home', order: 0 }
  const index = { pages: [entry] }
  await writeFile(root, `projects/${projectFileName}/home.md`, legacyContent)
  await writePagesIndex(root, projectFileName, index)
  return index
}

export const webAdapter: StorageAdapter = {
  async pickLocation(): Promise<string> {
    const handle = await window.showDirectoryPicker({ mode: 'readwrite' })
    dirHandle = handle
    await saveHandle(handle)
    await getDirHandle(handle, 'projects', true)
    return handle.name
  },

  getDefaultLocationLabel(): string {
    return 'Documents/Markdown-AI'
  },

  getLocationNote(): string | null {
    return "Only the folder name is shown — browsers keep the full computer path private."
  },

  async readConfig(): Promise<UserConfig | null> {
    try {
      const h = await ensureHandle()
      const raw = await readFile(h, 'config.json')
      if (!raw) return null
      return JSON.parse(raw) as UserConfig
    } catch {
      return null
    }
  },

  async writeConfig(config: UserConfig): Promise<void> {
    const h = await ensureHandle()
    await writeFile(h, 'config.json', JSON.stringify(config, null, 2))
  },

  async listProjects(): Promise<Array<ProjectMeta>> {
    const h = await ensureHandle()
    const index = await readIndex(h)
    return [...index.projects]
      .map(({ fileName: _, ...meta }) => ({ ...meta, path: h.name }))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  },

  async pickProjectFolder(): Promise<string | null> {
    try {
      const handle = await window.showDirectoryPicker({ mode: 'readwrite' })
      dirHandle = handle
      await saveHandle(handle)
      return handle.name
    } catch {
      return null
    }
  },

  async createProject(name: string, path: string): Promise<ProjectMeta> {
    const h = await ensureHandle()
    const id = generateId()
    const fileName = sanitizeFileName(name) || `project-${id}`
    const now = new Date().toISOString()
    const meta: ProjectIndexEntry = { id, name, path, createdAt: now, updatedAt: now, fileName }
    const index = await readIndex(h)
    index.projects.push(meta)
    await writeIndex(h, index)

    const configRaw = await readFile(h, 'config.json')
    const location = configRaw ? (JSON.parse(configRaw) as UserConfig).locationLabel : h.name
    const projectInfo = { name, location, createdAt: now }
    await writeFile(h, `projects/${fileName}.json`, JSON.stringify(projectInfo, null, 2))

    return { id, name, path, createdAt: now, updatedAt: now }
  },

  async deleteProject(id: string): Promise<void> {
    const h = await ensureHandle()
    const index = await readIndex(h)
    const entry = index.projects.find((p) => p.id === id)
    if (!entry) return
    index.projects = index.projects.filter((p) => p.id !== id)
    await writeIndex(h, index)
    try {
      const parent = await getDirHandle(h, 'projects', false)
      await parent.removeEntry(`${entry.fileName}.md`).catch(() => {})
      await parent.removeEntry(`${entry.fileName}.json`).catch(() => {})
      await parent.removeEntry(entry.fileName, { recursive: true }).catch(() => {})
    } catch { /* already gone */ }
  },

  async listPages(projectId: string): Promise<Array<PageMeta>> {
    const h = await ensureHandle()
    const fileName = await getProjectFileName(h, projectId)
    if (!fileName) return []
    let index = await readPagesIndex(h, fileName)
    if (index.pages.length === 0) {
      const migrated = await migrateLegacyProject(h, fileName)
      if (migrated) index = migrated
    }
    return [...index.pages]
      .map(({ fileName: _, ...meta }) => meta)
      .sort((a, b) => a.order - b.order)
  },

  async createPage(projectId: string, name: string): Promise<PageMeta> {
    const h = await ensureHandle()
    const projectFileName = await getProjectFileName(h, projectId)
    if (!projectFileName) throw new Error('Project not found')
    const id = generateId()
    const fileName = sanitizeFileName(name) || `page-${id}`
    const now = new Date().toISOString()
    const index = await readPagesIndex(h, projectFileName)
    const meta: PageIndexEntry = { id, name, createdAt: now, updatedAt: now, fileName, order: index.pages.length }
    index.pages.push(meta)
    await writePagesIndex(h, projectFileName, index)
    await writeFile(h, `projects/${projectFileName}/${fileName}.md`, SEED_CONTENT)
    return { id, name, createdAt: now, updatedAt: now, order: index.pages.length - 1 }
  },

  async readPage(projectId: string, pageId: string): Promise<string> {
    const h = await ensureHandle()
    const projectFileName = await getProjectFileName(h, projectId)
    if (!projectFileName) return ''
    const index = await readPagesIndex(h, projectFileName)
    const entry = index.pages.find((p) => p.id === pageId)
    if (!entry) return ''
    return (await readFile(h, `projects/${projectFileName}/${entry.fileName}.md`)) ?? ''
  },

  async writePage(projectId: string, pageId: string, content: string): Promise<void> {
    const h = await ensureHandle()
    const projectFileName = await getProjectFileName(h, projectId)
    if (!projectFileName) return
    const index = await readPagesIndex(h, projectFileName)
    const entry = index.pages.find((p) => p.id === pageId)
    if (!entry) return
    entry.updatedAt = new Date().toISOString()
    await writePagesIndex(h, projectFileName, index)
    await writeFile(h, `projects/${projectFileName}/${entry.fileName}.md`, content)
  },

  async reorderPages(projectId: string, orderedPageIds: string[]): Promise<void> {
    const h = await ensureHandle()
    const projectFileName = await getProjectFileName(h, projectId)
    if (!projectFileName) return
    const index = await readPagesIndex(h, projectFileName)
    const idToEntry = new Map(index.pages.map((p) => [p.id, p]))
    for (let i = 0; i < orderedPageIds.length; i++) {
      const entry = idToEntry.get(orderedPageIds[i])
      if (entry) entry.order = i
    }
    await writePagesIndex(h, projectFileName, index)
  },

  async deletePage(projectId: string, pageId: string): Promise<void> {
    const h = await ensureHandle()
    const projectFileName = await getProjectFileName(h, projectId)
    if (!projectFileName) return
    const index = await readPagesIndex(h, projectFileName)
    const entry = index.pages.find((p) => p.id === pageId)
    if (!entry) return
    index.pages = index.pages.filter((p) => p.id !== pageId)
    await writePagesIndex(h, projectFileName, index)
    try {
      const parent = await getDirHandle(h, `projects/${projectFileName}`, false)
      await parent.removeEntry(`${entry.fileName}.md`)
    } catch { /* already gone */ }
  },
}
