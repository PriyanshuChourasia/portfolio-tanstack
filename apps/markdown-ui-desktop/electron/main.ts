import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'

let mainWindow: BrowserWindow | null = null

function getUserDataPath(): string {
  return app.getPath('userData')
}

function getConfigPath(): string {
  return path.join(getUserDataPath(), 'config.json')
}

function getProjectsIndexPath(): string {
  return path.join(getUserDataPath(), 'projects', 'index.json')
}

function getProjectFilePath(fileName: string): string {
  return path.join(getUserDataPath(), 'projects', `${fileName}.md`)
}

async function ensureProjectsDir(): Promise<void> {
  await fs.mkdir(path.join(getUserDataPath(), 'projects'), { recursive: true })
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function sanitizeFileName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const SEED_CONTENT = `# Untitled Project\n\nStart writing your markdown here...\n`

function registerIPC(): void {
  ipcMain.handle('getDefaultLocation', () => getUserDataPath())

  ipcMain.handle('pickLocation', async () => {
    if (!mainWindow) return null
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory', 'createDirectory'],
    })
    if (result.canceled || result.filePaths.length === 0) return null
    return result.filePaths[0]
  })

  ipcMain.handle('readConfig', async () => {
    try {
      const raw = await fs.readFile(getConfigPath(), 'utf-8')
      return JSON.parse(raw)
    } catch {
      return null
    }
  })

  ipcMain.handle('writeConfig', async (_event, config: unknown) => {
    await fs.writeFile(getConfigPath(), JSON.stringify(config, null, 2), 'utf-8')
  })

  ipcMain.handle('listProjects', async () => {
    try {
      const raw = await fs.readFile(getProjectsIndexPath(), 'utf-8')
      const index = JSON.parse(raw) as { projects: Array<{ id: string; name: string; createdAt: string; updatedAt: string }> }
      return [...index.projects].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
    } catch {
      return []
    }
  })

  ipcMain.handle('readProject', async (_event, id: string) => {
    try {
      const raw = await fs.readFile(getProjectsIndexPath(), 'utf-8')
      const index = JSON.parse(raw) as { projects: Array<{ id: string; fileName: string }> }
      const entry = index.projects.find((p) => p.id === id)
      if (!entry) return ''
      return await fs.readFile(getProjectFilePath(entry.fileName), 'utf-8')
    } catch {
      return ''
    }
  })

  ipcMain.handle('writeProject', async (_event, id: string, content: string) => {
    await ensureProjectsDir()
    const raw = await fs.readFile(getProjectsIndexPath(), 'utf-8').catch(() => '{"projects":[]}')
    const index = JSON.parse(raw) as { projects: Array<{ id: string; fileName: string; updatedAt: string }> }
    const entry = index.projects.find((p) => p.id === id)
    if (!entry) return
    entry.updatedAt = new Date().toISOString()
    await fs.writeFile(getProjectsIndexPath(), JSON.stringify(index, null, 2), 'utf-8')
    await fs.writeFile(getProjectFilePath(entry.fileName), content, 'utf-8')
  })

  ipcMain.handle('createProject', async (_event, name: string) => {
    await ensureProjectsDir()
    const id = generateId()
    const fileName = sanitizeFileName(name) || `project-${id}`
    const now = new Date().toISOString()
    const meta = { id, name, fileName, createdAt: now, updatedAt: now }
    let index: { projects: typeof meta[] } = { projects: [] }
    try {
      const raw = await fs.readFile(getProjectsIndexPath(), 'utf-8')
      index = JSON.parse(raw)
    } catch { /* empty */ }
    index.projects.push(meta)
    await fs.writeFile(getProjectsIndexPath(), JSON.stringify(index, null, 2), 'utf-8')
    await fs.writeFile(getProjectFilePath(fileName), SEED_CONTENT, 'utf-8')
    return { id, name, createdAt: now, updatedAt: now }
  })

  ipcMain.handle('deleteProject', async (_event, id: string) => {
    try {
      const raw = await fs.readFile(getProjectsIndexPath(), 'utf-8')
      const index = JSON.parse(raw) as { projects: Array<{ id: string; fileName: string }> }
      const entry = index.projects.find((p) => p.id === id)
      if (!entry) return
      index.projects = index.projects.filter((p) => p.id !== id)
      await fs.writeFile(getProjectsIndexPath(), JSON.stringify(index, null, 2), 'utf-8')
      await fs.rm(getProjectFilePath(entry.fileName)).catch(() => {})
    } catch { /* ignore */ }
  })
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'Markdown UI',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  registerIPC()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
