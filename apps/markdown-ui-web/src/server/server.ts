import { createServer, IncomingMessage, ServerResponse } from 'node:http'
import { existsSync, mkdirSync, readFileSync, rmSync, unlinkSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { getDefaultConfigPath } from './config-path.js'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function sanitizeFileName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

interface IndexEntry {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  fileName: string
}

interface IndexData {
  projects: IndexEntry[]
}

interface PageIndexEntry {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  fileName: string
  order: number
}

interface PagesIndexData {
  pages: Array<PageIndexEntry>
}

function getProjectsDir(): string {
  return join(dirname(getDefaultConfigPath()), 'projects')
}

function getProjectDir(projectFileName: string): string {
  return join(getProjectsDir(), projectFileName)
}

function readIndex(): IndexData {
  const projectsDir = getProjectsDir()
  if (!existsSync(projectsDir)) {
    mkdirSync(projectsDir, { recursive: true })
  }
  const indexPath = join(projectsDir, 'index.json')
  if (!existsSync(indexPath)) {
    return { projects: [] }
  }
  try {
    const content = readFileSync(indexPath, 'utf-8')
    return JSON.parse(content) as IndexData
  } catch {
    return { projects: [] }
  }
}

function writeIndex(data: IndexData): void {
  const projectsDir = getProjectsDir()
  if (!existsSync(projectsDir)) {
    mkdirSync(projectsDir, { recursive: true })
  }
  const indexPath = join(projectsDir, 'index.json')
  writeFileSync(indexPath, JSON.stringify(data, null, 2), 'utf-8')
}

function getProjectFileNameById(id: string): string | null {
  return readIndex().projects.find((p) => p.id === id)?.fileName ?? null
}

function readPagesIndex(projectFileName: string): PagesIndexData {
  const indexPath = join(getProjectDir(projectFileName), 'index.json')
  if (!existsSync(indexPath)) return { pages: [] }
  try {
    const data = JSON.parse(readFileSync(indexPath, 'utf-8')) as PagesIndexData
    let changed = false
    for (const p of data.pages) {
      if (p.order === undefined) {
        p.order = data.pages.indexOf(p)
        changed = true
      }
    }
    if (changed) writePagesIndex(projectFileName, data)
    return data
  } catch {
    return { pages: [] }
  }
}

function writePagesIndex(projectFileName: string, data: PagesIndexData): void {
  const dir = getProjectDir(projectFileName)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.json'), JSON.stringify(data, null, 2), 'utf-8')
}

// What createProject used to seed every project's single .md file with, before pages existed.
const LEGACY_SEED_CONTENT = '# Untitled Project\n\nStart writing your markdown here...\n'

/** Projects created before multi-page support have their content directly at `projects/<fileName>.md`.
 * The first time pages are listed for one of those, fold that content into a single "Home" page
 * (unless it's just the old placeholder text, in which case there's nothing worth keeping). */
function migrateLegacyProject(projectFileName: string): PagesIndexData | null {
  const legacyPath = join(getProjectsDir(), `${projectFileName}.md`)
  if (!existsSync(legacyPath)) return null
  const content = readFileSync(legacyPath, 'utf-8')
  if (content.trim() === '' || content.trim() === LEGACY_SEED_CONTENT.trim()) return null
  const now = new Date().toISOString()
  const entry: PageIndexEntry = { id: generateId(), name: 'Home', createdAt: now, updatedAt: now, fileName: 'home', order: 0 }
  const data: PagesIndexData = { pages: [entry] }
  const dir = getProjectDir(projectFileName)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'home.md'), content, 'utf-8')
  writePagesIndex(projectFileName, data)
  return data
}

export function startServer(port = 4321): ReturnType<typeof createServer> {
  const DIST_DIR = resolve(process.cwd(), 'dist')

  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`)
    const pathname = url.pathname

    // API routes
    if (pathname.startsWith('/api/')) {
      // Config routes
      if (pathname === '/api/config' && req.method === 'GET') {
        handleGetConfig(req, res)
      } else if (pathname === '/api/config-path' && req.method === 'GET') {
        handleGetConfigPath(req, res)
      } else if (pathname === '/api/config' && req.method === 'PUT') {
        handlePutConfig(req, res)
      }
      // Project routes
      else if (pathname === '/api/projects' && req.method === 'GET') {
        handleListProjects(req, res)
      } else if (pathname === '/api/projects' && req.method === 'POST') {
        handleCreateProject(req, res)
      } else {
        const segments = pathname.split('/').filter(Boolean) // ['api', 'projects', id, 'pages'?, pageId?]
        const projectId = segments[2] ? decodeURIComponent(segments[2]) : null

        if (segments[0] === 'api' && segments[1] === 'projects' && projectId && segments.length === 3 && req.method === 'DELETE') {
          handleDeleteProject(projectId, req, res)
        } else if (segments[0] === 'api' && segments[1] === 'projects' && projectId && segments[3] === 'pages' && segments.length === 4 && req.method === 'GET') {
          handleListPages(projectId, req, res)
        } else if (segments[0] === 'api' && segments[1] === 'projects' && projectId && segments[3] === 'pages' && segments.length === 4 && req.method === 'POST') {
          handleCreatePage(projectId, req, res)
        } else if (segments[0] === 'api' && segments[1] === 'projects' && projectId && segments[3] === 'pages' && segments[4] && segments.length === 5 && req.method === 'GET') {
          handleReadPage(projectId, decodeURIComponent(segments[4]), req, res)
        } else if (segments[0] === 'api' && segments[1] === 'projects' && projectId && segments[3] === 'pages' && segments[4] && segments.length === 5 && req.method === 'PUT') {
          handleWritePage(projectId, decodeURIComponent(segments[4]), req, res)
        } else if (segments[0] === 'api' && segments[1] === 'projects' && projectId && segments[3] === 'pages' && segments[4] && segments.length === 5 && req.method === 'DELETE') {
          handleDeletePage(projectId, decodeURIComponent(segments[4]), req, res)
        } else if (segments[0] === 'api' && segments[1] === 'projects' && projectId && segments[3] === 'pages' && segments[4] === 'reorder' && segments.length === 6 && req.method === 'PUT') {
          handleReorderPages(projectId, req, res)
        } else {
          handleNotFound(res)
        }
      }
      return
    }

    // Static file serving
    const filePath = join(DIST_DIR, pathname === '/' ? 'index.html' : pathname)
    serveStaticFile(req, res, filePath, DIST_DIR)
  })

  server.listen(port, 'localhost', () => {
    console.log(`Server running at http://localhost:${port}`)
  })

  return server
}

function serveStaticFile(_req: IncomingMessage, res: ServerResponse, filePath: string, DIST_DIR: string): void {
  if (existsSync(filePath)) {
    const buffer = readFileSync(filePath)
    const ext = filePath.split('.').pop()
    const contentType = getContentType(ext ?? '')
    res.writeHead(200, { 'Content-Type': contentType })
    res.end(buffer)
  } else {
    // SPA fallback
    const indexPath = join(DIST_DIR, 'index.html')
    if (existsSync(indexPath)) {
      const content = readFileSync(indexPath, 'utf-8')
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end(content)
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('Not Found')
    }
  }
}

function getContentType(ext: string): string {
  const map: Record<string, string> = {
    html: 'text/html',
    js: 'application/javascript',
    css: 'text/css',
    json: 'application/json',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    svg: 'image/svg+xml',
    ico: 'image/x-icon',
    wasm: 'application/wasm',
    webp: 'image/webp',
  }
  return map[ext] ?? 'application/octet-stream'
}

function handleGetConfig(_req: IncomingMessage, res: ServerResponse): void {
  const configPath = getDefaultConfigPath()
  const configDir = dirname(configPath)

  if (!existsSync(configDir)) {
    mkdirSync(configDir, { recursive: true })
  }

  if (!existsSync(configPath)) {
    const defaultConfig = {
      locationLabel: null,
      createdAt: new Date().toISOString(),
    }
    writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2), 'utf-8')
  }

  const content = readFileSync(configPath, 'utf-8')
  const config = JSON.parse(content)

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(config))
}

function handlePutConfig(req: IncomingMessage, res: ServerResponse): void {
  let body = ''
  req.on('data', (chunk: Buffer) => { body += chunk.toString() })
  req.on('end', () => {
    try {
      const config = JSON.parse(body)

      const configPath = getDefaultConfigPath()
      const configDir = dirname(configPath)

      if (!existsSync(configDir)) {
        mkdirSync(configDir, { recursive: true })
      }

      writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8')

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(config))
    } catch {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Invalid JSON' }))
    }
  })
}

function handleGetConfigPath(_req: IncomingMessage, res: ServerResponse): void {
  const configPath = getDefaultConfigPath()

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ path: configPath }))
}

function handleNotFound(res: ServerResponse): void {
  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ error: 'Not Found' }))
}

function handleListProjects(_req: IncomingMessage, res: ServerResponse): void {
  const index = readIndex()
  const projects = index.projects
    .map(({ fileName: _, ...meta }) => meta)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ projects }))
}

function handleCreateProject(req: IncomingMessage, res: ServerResponse): void {
  let body = ''
  req.on('data', (chunk: Buffer) => { body += chunk.toString() })
  req.on('end', () => {
    try {
      const { name } = JSON.parse(body) as { name: string }
      if (!name || typeof name !== 'string') {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Name is required' }))
        return
      }

      const id = generateId()
      const fileName = sanitizeFileName(name) || `project-${id}`
      const now = new Date().toISOString()
      const entry: IndexEntry = { id, name, createdAt: now, updatedAt: now, fileName }

      const index = readIndex()
      index.projects.push(entry)
      writeIndex(index)

      const projectsDir = getProjectsDir()

      let location = ''
      const configPath = getDefaultConfigPath()
      if (existsSync(configPath)) {
        try {
          location = (JSON.parse(readFileSync(configPath, 'utf-8')) as { locationLabel?: string }).locationLabel ?? ''
        } catch {
          location = ''
        }
      }
      const jsonPath = join(projectsDir, `${fileName}.json`)
      writeFileSync(jsonPath, JSON.stringify({ name, location, createdAt: now }, null, 2), 'utf-8')

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ id, name, createdAt: now, updatedAt: now }))
    } catch {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Invalid request' }))
    }
  })
}

function handleListPages(projectId: string, _req: IncomingMessage, res: ServerResponse): void {
  const fileName = getProjectFileNameById(projectId)
  if (!fileName) {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Not Found' }))
    return
  }

  let data = readPagesIndex(fileName)
  if (data.pages.length === 0) {
    data = migrateLegacyProject(fileName) ?? data
  }

  const pages = data.pages
    .map(({ fileName: _, ...meta }) => meta)
    .sort((a, b) => a.order - b.order)

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ pages }))
}

function handleCreatePage(projectId: string, req: IncomingMessage, res: ServerResponse): void {
  let body = ''
  req.on('data', (chunk: Buffer) => { body += chunk.toString() })
  req.on('end', () => {
    try {
      const { name } = JSON.parse(body) as { name: string }
      if (!name || typeof name !== 'string') {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Name is required' }))
        return
      }

      const fileName = getProjectFileNameById(projectId)
      if (!fileName) {
        res.writeHead(404, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Not Found' }))
        return
      }

      const id = generateId()
      const pageFileName = sanitizeFileName(name) || `page-${id}`
      const now = new Date().toISOString()
      const data = readPagesIndex(fileName)
      const entry: PageIndexEntry = { id, name, createdAt: now, updatedAt: now, fileName: pageFileName, order: data.pages.length }

      data.pages.push(entry)
      writePagesIndex(fileName, data)

      const mdPath = join(getProjectDir(fileName), `${pageFileName}.md`)
      writeFileSync(mdPath, '# Untitled Page\n\nStart writing your markdown here...\n', 'utf-8')

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ id, name, createdAt: now, updatedAt: now, order: data.pages.length - 1 }))
    } catch {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Invalid request' }))
    }
  })
}

function handleReadPage(projectId: string, pageId: string, _req: IncomingMessage, res: ServerResponse): void {
  const fileName = getProjectFileNameById(projectId)
  if (!fileName) {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Not Found' }))
    return
  }

  const data = readPagesIndex(fileName)
  const entry = data.pages.find((p) => p.id === pageId)
  if (!entry) {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Not Found' }))
    return
  }

  const filePath = join(getProjectDir(fileName), `${entry.fileName}.md`)
  if (!existsSync(filePath)) {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ content: '' }))
    return
  }

  const content = readFileSync(filePath, 'utf-8')
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ content }))
}

function handleWritePage(projectId: string, pageId: string, req: IncomingMessage, res: ServerResponse): void {
  let body = ''
  req.on('data', (chunk: Buffer) => { body += chunk.toString() })
  req.on('end', () => {
    try {
      const { content } = JSON.parse(body) as { content: string }

      const fileName = getProjectFileNameById(projectId)
      if (!fileName) {
        res.writeHead(404, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Not Found' }))
        return
      }

      const data = readPagesIndex(fileName)
      const entry = data.pages.find((p) => p.id === pageId)
      if (!entry) {
        res.writeHead(404, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Not Found' }))
        return
      }

      entry.updatedAt = new Date().toISOString()
      writePagesIndex(fileName, data)

      const mdPath = join(getProjectDir(fileName), `${entry.fileName}.md`)
      writeFileSync(mdPath, content, 'utf-8')

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({}))
    } catch {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Invalid request' }))
    }
  })
}

function handleDeletePage(projectId: string, pageId: string, _req: IncomingMessage, res: ServerResponse): void {
  const fileName = getProjectFileNameById(projectId)
  if (!fileName) {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Not Found' }))
    return
  }

  const data = readPagesIndex(fileName)
  const entry = data.pages.find((p) => p.id === pageId)
  if (!entry) {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Not Found' }))
    return
  }

  data.pages = data.pages.filter((p) => p.id !== pageId)
  writePagesIndex(fileName, data)

  try {
    unlinkSync(join(getProjectDir(fileName), `${entry.fileName}.md`))
  } catch {
    // File might not exist, that's ok
  }

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({}))
}

function handleReorderPages(projectId: string, req: IncomingMessage, res: ServerResponse): void {
  let body = ''
  req.on('data', (chunk: Buffer) => { body += chunk.toString() })
  req.on('end', () => {
    try {
      const { pageIds } = JSON.parse(body) as { pageIds: string[] }
      if (!Array.isArray(pageIds)) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'pageIds array required' }))
        return
      }
      const fileName = getProjectFileNameById(projectId)
      if (!fileName) {
        res.writeHead(404, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Not Found' }))
        return
      }
      const data = readPagesIndex(fileName)
      const idToEntry = new Map(data.pages.map((p) => [p.id, p]))
      for (let i = 0; i < pageIds.length; i++) {
        const entry = idToEntry.get(pageIds[i])
        if (entry) entry.order = i
      }
      writePagesIndex(fileName, data)
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({}))
    } catch {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Invalid request' }))
    }
  })
}

function handleDeleteProject(id: string, _req: IncomingMessage, res: ServerResponse): void {
  const index = readIndex()
  const entry = index.projects.find((p) => p.id === id)

  if (!entry) {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Not Found' }))
    return
  }

  index.projects = index.projects.filter((p) => p.id !== id)
  writeIndex(index)

  const projectsDir = getProjectsDir()
  const mdPath = join(projectsDir, `${entry.fileName}.md`)
  try {
    unlinkSync(mdPath)
  } catch {
    // File might not exist, that's ok
  }
  const jsonPath = join(projectsDir, `${entry.fileName}.json`)
  try {
    unlinkSync(jsonPath)
  } catch {
    // File might not exist, that's ok
  }
  try {
    rmSync(getProjectDir(entry.fileName), { recursive: true, force: true })
  } catch {
    // Directory might not exist, that's ok
  }

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({}))
}
