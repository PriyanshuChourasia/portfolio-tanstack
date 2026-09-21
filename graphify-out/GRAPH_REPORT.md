# Graph Report - .  (2026-09-19)

## Corpus Check
- 30 files · ~0 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 255 nodes · 344 edges · 17 communities (16 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Web App Package Manifest|Web App Package Manifest]]
- [[_COMMUNITY_Markdown UI Component Library|Markdown UI Component Library]]
- [[_COMMUNITY_Core TS Config|Core TS Config]]
- [[_COMMUNITY_CLI Launcher & Bundled Server|CLI Launcher & Bundled Server]]
- [[_COMMUNITY_Core Package Manifest|Core Package Manifest]]
- [[_COMMUNITY_Web App Dependencies|Web App Dependencies]]
- [[_COMMUNITY_Prettier Config|Prettier Config]]
- [[_COMMUNITY_App Bootstrap & Adapter Selection|App Bootstrap & Adapter Selection]]
- [[_COMMUNITY_Local Server Backend|Local Server Backend]]
- [[_COMMUNITY_Browser File System Adapter|Browser File System Adapter]]
- [[_COMMUNITY_Web App TS Config|Web App TS Config]]
- [[_COMMUNITY_Server TS Config|Server TS Config]]
- [[_COMMUNITY_Docs & Install Guide|Docs & Install Guide]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 17 edges
2. `compilerOptions` - 16 edges
3. `scripts` - 10 edges
4. `compilerOptions` - 9 edges
5. `useStorage()` - 8 edges
6. `getDefaultConfigPath()` - 7 edges
7. `getDefaultConfigPath()` - 6 edges
8. `getProjectsDir()` - 6 edges
9. `getProjectsDir()` - 6 edges
10. `Button` - 5 edges

## Surprising Connections (you probably didn't know these)
- `startWithRetry()` --calls--> `startServer()`  [EXTRACTED]
  bin/markdown-ai.js → dist-server/server.js
- `MarkdownUIInner()` --calls--> `useStorage()`  [EXTRACTED]
  src/MarkdownUI.tsx → src/lib/context.tsx
- `getDefaultConfigPath()` --calls--> `handleGetConfig()`  [EXTRACTED]
  dist-server/config-path.js → dist-server/server.js
- `getDefaultConfigPath()` --calls--> `handleGetConfigPath()`  [EXTRACTED]
  dist-server/config-path.js → dist-server/server.js
- `getDefaultConfigPath()` --calls--> `handlePutConfig()`  [EXTRACTED]
  dist-server/config-path.js → dist-server/server.js

## Import Cycles
- 1-file cycle: `eslint.config.js -> eslint.config.js`

## Communities (17 total, 1 thin omitted)

### Community 15 - "Web App Package Manifest"
Cohesion: 0.07
Nodes (27): name, private, type, main, types, exports, ./styles.css, scripts (+19 more)

### Community 9 - "Markdown UI Component Library"
Cohesion: 0.12
Nodes (28): Stage, MarkdownUIInner(), MarkdownUIProps, MarkdownUI(), AppShellProps, AppShell(), buttonVariants, ButtonProps (+20 more)

### Community 16 - "Core TS Config"
Cohesion: 0.11
Nodes (18): include, compilerOptions, target, jsx, module, lib, moduleResolution, allowImportingTsExtensions (+10 more)

### Community 2 - "CLI Launcher & Bundled Server"
Cohesion: 0.13
Nodes (15): PORT, startWithRetry(), getDefaultConfigPath(), getProjectsDir(), readIndex(), writeIndex(), startServer(), serveStaticFile() (+7 more)

### Community 5 - "Core Package Manifest"
Cohesion: 0.07
Nodes (27): name, version, description, keywords, author, license, repository, type (+19 more)

### Community 3 - "Web App Dependencies"
Cohesion: 0.11
Nodes (19): devDependencies, @tailwindcss/typography, @tailwindcss/vite, @tanstack/eslint-config, @types/node, @types/react, @types/react-dom, @types/wicg-file-system-access (+11 more)

### Community 8 - "App Bootstrap & Adapter Selection"
Cohesion: 0.31
Nodes (5): init(), appEl, cacheConfigPath(), serverAdapter, webAdapter

### Community 0 - "Local Server Backend"
Cohesion: 0.16
Nodes (15): getDefaultConfigPath(), IndexEntry, IndexData, getProjectsDir(), readIndex(), writeIndex(), serveStaticFile(), getContentType() (+7 more)

### Community 4 - "Browser File System Adapter"
Cohesion: 0.20
Nodes (17): openDB(), saveHandle(), loadHandle(), ensureHandle(), generateId(), getFileHandle(), getDirHandle(), writeFile() (+9 more)

### Community 1 - "Web App TS Config"
Cohesion: 0.10
Nodes (19): include, compilerOptions, target, jsx, module, lib, types, moduleResolution (+11 more)

### Community 6 - "Server TS Config"
Cohesion: 0.15
Nodes (12): extends, compilerOptions, module, moduleResolution, outDir, rootDir, skipLibCheck, noEmit (+4 more)

### Community 10 - "Docs & Install Guide"
Cohesion: 0.33
Nodes (5): Markdown-AI, Install (recommended), Local install (alternative), Without installing at all, License

## Knowledge Gaps
- **129 isolated node(s):** `name`, `private`, `type`, `main`, `types` (+124 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Web App Dependencies` to `Core Package Manifest`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **What connects `name`, `private`, `type` to the rest of the system?**
  _129 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Web App Package Manifest` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `Markdown UI Component Library` be split into smaller, more focused modules?**
  _Cohesion score 0.11666666666666667 - nodes in this community are weakly interconnected._
- **Should `Core TS Config` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `CLI Launcher & Bundled Server` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `Core Package Manifest` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._