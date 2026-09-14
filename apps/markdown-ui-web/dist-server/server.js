import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { getDefaultConfigPath } from './config-path.js';
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
function sanitizeFileName(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
function getProjectsDir() {
    return join(dirname(getDefaultConfigPath()), 'projects');
}
function readIndex() {
    const projectsDir = getProjectsDir();
    if (!existsSync(projectsDir)) {
        mkdirSync(projectsDir, { recursive: true });
    }
    const indexPath = join(projectsDir, 'index.json');
    if (!existsSync(indexPath)) {
        return { projects: [] };
    }
    try {
        const content = readFileSync(indexPath, 'utf-8');
        return JSON.parse(content);
    }
    catch {
        return { projects: [] };
    }
}
function writeIndex(data) {
    const projectsDir = getProjectsDir();
    if (!existsSync(projectsDir)) {
        mkdirSync(projectsDir, { recursive: true });
    }
    const indexPath = join(projectsDir, 'index.json');
    writeFileSync(indexPath, JSON.stringify(data, null, 2), 'utf-8');
}
export function startServer(port = 4321) {
    const DIST_DIR = resolve(process.cwd(), 'dist');
    const server = createServer((req, res) => {
        const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
        const pathname = url.pathname;
        // API routes
        if (pathname.startsWith('/api/')) {
            // Config routes
            if (pathname === '/api/config' && req.method === 'GET') {
                handleGetConfig(req, res);
            }
            else if (pathname === '/api/config-path' && req.method === 'GET') {
                handleGetConfigPath(req, res);
            }
            else if (pathname === '/api/config' && req.method === 'PUT') {
                handlePutConfig(req, res);
            }
            // Project routes
            else if (pathname === '/api/projects' && req.method === 'GET') {
                handleListProjects(req, res);
            }
            else if (pathname === '/api/projects' && req.method === 'POST') {
                handleCreateProject(req, res);
            }
            else if (pathname.startsWith('/api/projects/') && req.method === 'GET') {
                const id = pathname.slice('/api/projects/'.length);
                handleReadProject(id, req, res);
            }
            else if (pathname.startsWith('/api/projects/') && req.method === 'PUT') {
                const id = pathname.slice('/api/projects/'.length);
                handleWriteProject(id, req, res);
            }
            else if (pathname.startsWith('/api/projects/') && req.method === 'DELETE') {
                const id = pathname.slice('/api/projects/'.length);
                handleDeleteProject(id, req, res);
            }
            else {
                handleNotFound(res);
            }
            return;
        }
        // Static file serving
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
        // SPA fallback
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
function handleNotFound(res) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
}
function handleListProjects(_req, res) {
    const index = readIndex();
    const projects = index.projects
        .map(({ fileName: _, ...meta }) => meta)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ projects }));
}
function handleReadProject(id, _req, res) {
    const index = readIndex();
    const entry = index.projects.find((p) => p.id === id);
    if (!entry) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
        return;
    }
    const projectsDir = getProjectsDir();
    const filePath = join(projectsDir, `${entry.fileName}.md`);
    if (!existsSync(filePath)) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ content: '' }));
        return;
    }
    const content = readFileSync(filePath, 'utf-8');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ content }));
}
function handleCreateProject(req, res) {
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
            const id = generateId();
            const fileName = sanitizeFileName(name) || `project-${id}`;
            const now = new Date().toISOString();
            const entry = { id, name, createdAt: now, updatedAt: now, fileName };
            const index = readIndex();
            index.projects.push(entry);
            writeIndex(index);
            const projectsDir = getProjectsDir();
            const mdPath = join(projectsDir, `${fileName}.md`);
            writeFileSync(mdPath, '# Untitled Project\n\nStart writing your markdown here...\n', 'utf-8');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ id, name, createdAt: now, updatedAt: now }));
        }
        catch {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid request' }));
        }
    });
}
function handleWriteProject(id, req, res) {
    let body = '';
    req.on('data', (chunk) => { body += chunk.toString(); });
    req.on('end', () => {
        try {
            const { content } = JSON.parse(body);
            const index = readIndex();
            const entry = index.projects.find((p) => p.id === id);
            if (!entry) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Not Found' }));
                return;
            }
            entry.updatedAt = new Date().toISOString();
            writeIndex(index);
            const projectsDir = getProjectsDir();
            const mdPath = join(projectsDir, `${entry.fileName}.md`);
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
function handleDeleteProject(id, _req, res) {
    const index = readIndex();
    const entry = index.projects.find((p) => p.id === id);
    if (!entry) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
        return;
    }
    index.projects = index.projects.filter((p) => p.id !== id);
    writeIndex(index);
    const projectsDir = getProjectsDir();
    const mdPath = join(projectsDir, `${entry.fileName}.md`);
    try {
        unlinkSync(mdPath);
    }
    catch {
        // File might not exist, that's ok
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({}));
}
