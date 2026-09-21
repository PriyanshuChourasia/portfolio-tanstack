import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { existsSync, mkdirSync, readFileSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname, join, resolve, basename } from 'node:path';
import { getDefaultConfigPath } from './config-path.js';
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
function sanitizeFileName(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
const LEGACY_SEED_CONTENT = '# Untitled Project\n\nStart writing your markdown here...\n';
function getConfigDir() {
    return dirname(getDefaultConfigPath());
}
function getProjectsDir() {
    return join(getConfigDir(), 'projects');
}
function getRegistryPath() {
    return join(getConfigDir(), 'projects.json');
}
function getProjectDir(projectPath) {
    return projectPath;
}
function readRegistry() {
    const registryPath = getRegistryPath();
    if (!existsSync(registryPath)) {
        migrateFromLegacyIfNeeded();
    }
    if (!existsSync(registryPath)) {
        return { projects: [] };
    }
    try {
        const content = readFileSync(registryPath, 'utf-8');
        return JSON.parse(content);
    }
    catch {
        return { projects: [] };
    }
}
function writeRegistry(data) {
    const configDir = getConfigDir();
    if (!existsSync(configDir)) {
        mkdirSync(configDir, { recursive: true });
    }
    writeFileSync(getRegistryPath(), JSON.stringify(data, null, 2), 'utf-8');
}
function migrateFromLegacyIfNeeded() {
    const newRegistryPath = getRegistryPath();
    if (existsSync(newRegistryPath))
        return;
    const legacyDir = getProjectsDir();
    const legacyIndexPath = join(legacyDir, 'index.json');
    if (!existsSync(legacyIndexPath))
        return;
    try {
        const content = readFileSync(legacyIndexPath, 'utf-8');
        const oldData = JSON.parse(content);
        if (!oldData.projects || !Array.isArray(oldData.projects))
            return;
        const newProjects = oldData.projects.map((entry) => {
            const projectPath = join(getProjectsDir(), entry.fileName);
            return {
                ...entry,
                path: projectPath,
            };
        });
        const newData = { projects: newProjects };
        writeRegistry(newData);
    }
    catch {
        // Migration failed, start fresh
    }
}
function getProjectPathById(id) {
    return readRegistry().projects.find((p) => p.id === id)?.path ?? null;
}
function readPagesIndex(projectPath) {
    const indexPath = join(getProjectDir(projectPath), 'index.json');
    if (!existsSync(indexPath))
        return { pages: [] };
    try {
        const data = JSON.parse(readFileSync(indexPath, 'utf-8'));
        let changed = false;
        for (const p of data.pages) {
            if (p.order === undefined) {
                p.order = data.pages.indexOf(p);
                changed = true;
            }
        }
        if (changed)
            writePagesIndex(projectPath, data);
        return data;
    }
    catch {
        return { pages: [] };
    }
}
function writePagesIndex(projectPath, data) {
    const dir = getProjectDir(projectPath);
    if (!existsSync(dir))
        mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'index.json'), JSON.stringify(data, null, 2), 'utf-8');
}
function migrateLegacyProject(projectPath) {
    const legacyMdPath = join(getProjectsDir(), `${basename(projectPath)}.md`);
    if (!existsSync(legacyMdPath))
        return null;
    const content = readFileSync(legacyMdPath, 'utf-8');
    if (content.trim() === '' || content.trim() === LEGACY_SEED_CONTENT.trim())
        return null;
    const now = new Date().toISOString();
    const entry = { id: generateId(), name: 'Home', createdAt: now, updatedAt: now, fileName: 'home', order: 0 };
    const data = { pages: [entry] };
    const dir = getProjectDir(projectPath);
    if (!existsSync(dir))
        mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'home.md'), content, 'utf-8');
    writePagesIndex(projectPath, data);
    return data;
}
export function startServer(port = 4321) {
    const DIST_DIR = resolve(process.cwd(), 'dist');
    const server = createServer((req, res) => {
        const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
        const pathname = url.pathname;
        if (pathname.startsWith('/api/')) {
            if (pathname === '/api/config' && req.method === 'GET') {
                handleGetConfig(req, res);
            }
            else if (pathname === '/api/config-path' && req.method === 'GET') {
                handleGetConfigPath(req, res);
            }
            else if (pathname === '/api/config' && req.method === 'PUT') {
                handlePutConfig(req, res);
            }
            else if (pathname === '/api/pick-folder' && req.method === 'POST') {
                handlePickFolder(req, res);
            }
            else if (pathname === '/api/projects' && req.method === 'GET') {
                handleListProjects(req, res);
            }
            else if (pathname === '/api/projects' && req.method === 'POST') {
                handleCreateProject(req, res);
            }
            else {
                const segments = pathname.split('/').filter(Boolean);
                const projectId = segments[2] ? decodeURIComponent(segments[2]) : null;
                if (segments[0] === 'api' && segments[1] === 'projects' && projectId && segments.length === 3 && req.method === 'DELETE') {
                    handleDeleteProject(projectId, req, res);
                }
                else if (segments[0] === 'api' && segments[1] === 'projects' && projectId && segments[3] === 'pages' && segments.length === 4 && req.method === 'GET') {
                    handleListPages(projectId, req, res);
                }
                else if (segments[0] === 'api' && segments[1] === 'projects' && projectId && segments[3] === 'pages' && segments.length === 4 && req.method === 'POST') {
                    handleCreatePage(projectId, req, res);
                }
                else if (segments[0] === 'api' && segments[1] === 'projects' && projectId && segments[3] === 'pages' && segments[4] && segments.length === 5 && req.method === 'GET') {
                    handleReadPage(projectId, decodeURIComponent(segments[4]), req, res);
                }
                else if (segments[0] === 'api' && segments[1] === 'projects' && projectId && segments[3] === 'pages' && segments[4] && segments.length === 5 && req.method === 'PUT') {
                    handleWritePage(projectId, decodeURIComponent(segments[4]), req, res);
                }
                else if (segments[0] === 'api' && segments[1] === 'projects' && projectId && segments[3] === 'pages' && segments[4] && segments.length === 5 && req.method === 'DELETE') {
                    handleDeletePage(projectId, decodeURIComponent(segments[4]), req, res);
                }
                else if (segments[0] === 'api' && segments[1] === 'projects' && projectId && segments[3] === 'pages' && segments[4] === 'reorder' && segments.length === 6 && req.method === 'PUT') {
                    handleReorderPages(projectId, req, res);
                }
                else {
                    handleNotFound(res);
                }
            }
            return;
        }
        const filePath = join(DIST_DIR, pathname === '/' ? 'index.html' : pathname);
        serveStaticFile(req, res, filePath, DIST_DIR);
    });
    server.listen(port, 'localhost', () => {
        console.log(`Server running at http://localhost:${port}`);
    });
    return server;
}
function serveStaticFile(_req, res, filePath, DIST_DIR) {
    if (existsSync(filePath)) {
        const buffer = readFileSync(filePath);
        const ext = filePath.split('.').pop();
        const contentType = getContentType(ext ?? '');
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(buffer);
    }
    else {
        const indexPath = join(DIST_DIR, 'index.html');
        if (existsSync(indexPath)) {
            const content = readFileSync(indexPath, 'utf-8');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        }
        else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
        }
    }
}
function getContentType(ext) {
    const map = {
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
    };
    return map[ext] ?? 'application/octet-stream';
}
function handleGetConfig(_req, res) {
    const configPath = getDefaultConfigPath();
    const configDir = dirname(configPath);
    if (!existsSync(configDir)) {
        mkdirSync(configDir, { recursive: true });
    }
    if (!existsSync(configPath)) {
        const defaultConfig = {
            locationLabel: null,
            createdAt: new Date().toISOString(),
        };
        writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2), 'utf-8');
    }
    const content = readFileSync(configPath, 'utf-8');
    const config = JSON.parse(content);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(config));
}
function handlePutConfig(req, res) {
    let body = '';
    req.on('data', (chunk) => { body += chunk.toString(); });
    req.on('end', () => {
        try {
            const config = JSON.parse(body);
            const configPath = getDefaultConfigPath();
            const configDir = dirname(configPath);
            if (!existsSync(configDir)) {
                mkdirSync(configDir, { recursive: true });
            }
            writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(config));
        }
        catch {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
    });
}
function handleGetConfigPath(_req, res) {
    const configPath = getDefaultConfigPath();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ path: configPath }));
}
function handlePickFolder(req, res) {
    let body = '';
    req.on('data', (chunk) => { body += chunk.toString(); });
    req.on('end', () => {
        try {
            const path = pickFolderNative();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ path }));
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : 'Unknown error';
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: msg }));
        }
    });
}
function pickFolderNative() {
    const platform = process.platform;
    try {
        let result;
        if (platform === 'darwin') {
            result = execSync("osascript -e 'POSIX path of (choose folder)'", { encoding: 'utf-8', timeout: 30000 }).trim();
        }
        else if (platform === 'win32') {
            const psScript = `Add-Type -AssemblyName System.Windows.Forms; $dlg = New-Object System.Windows.Forms.FolderBrowserDialog; $dlg.ShowDialog(); if ($dlg.SelectedPath) { $dlg.SelectedPath }`;
            result = execSync(`powershell -Command "${psScript}"`, { encoding: 'utf-8', timeout: 30000 }).trim();
        }
        else {
            try {
                result = execSync('zenity --file-selection --directory', { encoding: 'utf-8', timeout: 30000 }).trim();
            }
            catch {
                try {
                    result = execSync('kdialog --getexistingdirectory', { encoding: 'utf-8', timeout: 30000 }).trim();
                }
                catch {
                    throw new Error('No folder dialog tool found — install zenity or kdialog');
                }
            }
        }
        if (!result || result.trim() === '')
            return null;
        return result.trim();
    }
    catch (err) {
        if (err instanceof Error && err.message.includes('No folder dialog tool')) {
            throw err;
        }
        return null;
    }
}
function handleNotFound(res) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
}
function handleListProjects(_req, res) {
    const registry = readRegistry();
    const projects = registry.projects
        .map(({ fileName: _, ...meta }) => meta)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ projects }));
}
function handleCreateProject(req, res) {
    let body = '';
    req.on('data', (chunk) => { body += chunk.toString(); });
    req.on('end', () => {
        try {
            const { name, path: projectPath } = JSON.parse(body);
            if (!name || typeof name !== 'string') {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Name is required' }));
                return;
            }
            if (!projectPath || typeof projectPath !== 'string') {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Path is required' }));
                return;
            }
            if (!existsSync(projectPath)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Directory does not exist' }));
                return;
            }
            try {
                const testFile = join(projectPath, `.write-test-${Date.now()}`);
                writeFileSync(testFile, 'test');
                unlinkSync(testFile);
            }
            catch {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Directory is not writable' }));
                return;
            }
            const id = generateId();
            const fileName = sanitizeFileName(name) || `project-${id}`;
            const now = new Date().toISOString();
            const entry = { id, name, path: projectPath, fileName, createdAt: now, updatedAt: now };
            const registry = readRegistry();
            registry.projects.push(entry);
            writeRegistry(registry);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ id, name, createdAt: now, updatedAt: now }));
        }
        catch {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid request' }));
        }
    });
}
function handleListPages(projectId, _req, res) {
    const projectPath = getProjectPathById(projectId);
    if (!projectPath) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
        return;
    }
    let data = readPagesIndex(projectPath);
    if (data.pages.length === 0) {
        data = migrateLegacyProject(projectPath) ?? data;
    }
    const pages = data.pages
        .map(({ fileName: _, ...meta }) => meta)
        .sort((a, b) => a.order - b.order);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ pages }));
}
function handleCreatePage(projectId, req, res) {
    let body = '';
    req.on('data', (chunk) => { body += chunk.toString(); });
    req.on('end', () => {
        try {
            const { name } = JSON.parse(body);
            if (!name || typeof name !== 'string') {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Name is required' }));
                return;
            }
            const projectPath = getProjectPathById(projectId);
            if (!projectPath) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Not Found' }));
                return;
            }
            const id = generateId();
            const pageFileName = sanitizeFileName(name) || `page-${id}`;
            const now = new Date().toISOString();
            const data = readPagesIndex(projectPath);
            const entry = { id, name, createdAt: now, updatedAt: now, fileName: pageFileName, order: data.pages.length };
            data.pages.push(entry);
            writePagesIndex(projectPath, data);
            const mdPath = join(getProjectDir(projectPath), `${pageFileName}.md`);
            writeFileSync(mdPath, '# Untitled Page\n\nStart writing your markdown here...\n', 'utf-8');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ id, name, createdAt: now, updatedAt: now, order: data.pages.length - 1 }));
        }
        catch {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid request' }));
        }
    });
}
function handleReadPage(projectId, pageId, _req, res) {
    const projectPath = getProjectPathById(projectId);
    if (!projectPath) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
        return;
    }
    const data = readPagesIndex(projectPath);
    const entry = data.pages.find((p) => p.id === pageId);
    if (!entry) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
        return;
    }
    const filePath = join(getProjectDir(projectPath), `${entry.fileName}.md`);
    if (!existsSync(filePath)) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ content: '' }));
        return;
    }
    const content = readFileSync(filePath, 'utf-8');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ content }));
}
function handleWritePage(projectId, pageId, req, res) {
    let body = '';
    req.on('data', (chunk) => { body += chunk.toString(); });
    req.on('end', () => {
        try {
            const { content } = JSON.parse(body);
            const projectPath = getProjectPathById(projectId);
            if (!projectPath) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Not Found' }));
                return;
            }
            const data = readPagesIndex(projectPath);
            const entry = data.pages.find((p) => p.id === pageId);
            if (!entry) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Not Found' }));
                return;
            }
            entry.updatedAt = new Date().toISOString();
            writePagesIndex(projectPath, data);
            const mdPath = join(getProjectDir(projectPath), `${entry.fileName}.md`);
            writeFileSync(mdPath, content, 'utf-8');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({}));
        }
        catch {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid request' }));
        }
    });
}
function handleDeletePage(projectId, pageId, _req, res) {
    const projectPath = getProjectPathById(projectId);
    if (!projectPath) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
        return;
    }
    const data = readPagesIndex(projectPath);
    const entry = data.pages.find((p) => p.id === pageId);
    if (!entry) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
        return;
    }
    data.pages = data.pages.filter((p) => p.id !== pageId);
    writePagesIndex(projectPath, data);
    try {
        unlinkSync(join(getProjectDir(projectPath), `${entry.fileName}.md`));
    }
    catch {
        // File might not exist, that's ok
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({}));
}
function handleReorderPages(projectId, req, res) {
    let body = '';
    req.on('data', (chunk) => { body += chunk.toString(); });
    req.on('end', () => {
        try {
            const { pageIds } = JSON.parse(body);
            if (!Array.isArray(pageIds)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'pageIds array required' }));
                return;
            }
            const projectPath = getProjectPathById(projectId);
            if (!projectPath) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Not Found' }));
                return;
            }
            const data = readPagesIndex(projectPath);
            const idToEntry = new Map(data.pages.map((p) => [p.id, p]));
            for (let i = 0; i < pageIds.length; i++) {
                const entry = idToEntry.get(pageIds[i]);
                if (entry)
                    entry.order = i;
            }
            writePagesIndex(projectPath, data);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({}));
        }
        catch {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid request' }));
        }
    });
}
function handleDeleteProject(id, _req, res) {
    const registry = readRegistry();
    const entry = registry.projects.find((p) => p.id === id);
    if (!entry) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
        return;
    }
    registry.projects = registry.projects.filter((p) => p.id !== id);
    writeRegistry(registry);
    try {
        rmSync(getProjectDir(entry.path), { recursive: true, force: true });
    }
    catch {
        // Directory might not exist, that's ok
    }
    const oldProjectsDir = getProjectsDir();
    try {
        const legacyMdPath = join(oldProjectsDir, `${entry.fileName}.md`);
        unlinkSync(legacyMdPath);
    }
    catch { /* might not exist */ }
    try {
        const legacyJsonPath = join(oldProjectsDir, `${entry.fileName}.json`);
        unlinkSync(legacyJsonPath);
    }
    catch { /* might not exist */ }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({}));
}
