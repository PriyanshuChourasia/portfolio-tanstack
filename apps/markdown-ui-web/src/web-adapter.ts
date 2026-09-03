import type { StorageAdapter, ProjectMeta, UserConfig } from 'markdown-ui-core'

const DB_NAME = 'markdown-ui'
const DB_VERSION = 1
const STORE_NAME = 'handles'
const ROOT_KEY = 'root-handle'
const SEED_CONTENT = `# Untitled Project\n\nStart writing your markdown here...\n`

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

async function readIndex(
  root: FileSystemDirectoryHandle,
): Promise<{ projects: Array<ProjectMeta & { fileName: string }> }> {
  const raw = await readFile(root, 'projects/index.json')
  if (!raw) return { projects: [] }
  try { return JSON.parse(raw) } catch { return { projects: [] } }
}

async function writeIndex(
  root: FileSystemDirectoryHandle,
  index: { projects: Array<ProjectMeta & { fileName: string }> },
): Promise<void> {
  await getDirHandle(root, 'projects', true)
  await writeFile(root, 'projects/index.json', JSON.stringify(index, null, 2))
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
    return 'Documents/MarkdownUI'
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

  async listProjects(): Promise<ProjectMeta[]> {
    const h = await ensureHandle()
    const index = await readIndex(h)
    return [...index.projects]
      .map(({ fileName: _, ...meta }) => meta)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  },

  async readProject(id: string): Promise<string> {
    const h = await ensureHandle()
    const index = await readIndex(h)
    const entry = index.projects.find((p) => p.id === id)
    if (!entry) return ''
    return (await readFile(h, `projects/${entry.fileName}.md`)) ?? ''
  },

  async writeProject(id: string, content: string): Promise<void> {
    const h = await ensureHandle()
    const index = await readIndex(h)
    const entry = index.projects.find((p) => p.id === id)
    if (!entry) return
    entry.updatedAt = new Date().toISOString()
    await writeIndex(h, index)
    await writeFile(h, `projects/${entry.fileName}.md`, content)
  },

  async createProject(name: string): Promise<ProjectMeta> {
    const h = await ensureHandle()
    const id = generateId()
    const fileName = sanitizeFileName(name) || `project-${id}`
    const now = new Date().toISOString()
    const meta: ProjectMeta & { fileName: string } = { id, name, createdAt: now, updatedAt: now, fileName }
    const index = await readIndex(h)
    index.projects.push(meta)
    await writeIndex(h, index)
    await writeFile(h, `projects/${fileName}.md`, SEED_CONTENT)
    return { id, name, createdAt: now, updatedAt: now }
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
      await parent.removeEntry(`${entry.fileName}.md`)
    } catch { /* already gone */ }
  },
}
