# Graph Report - apps/markdown-ui-web  (2026-09-19)

## Corpus Check
- 16 files · ~4,744 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 166 nodes · 207 edges · 15 communities (14 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1f71b101`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 17 edges
2. `scripts` - 10 edges
3. `compilerOptions` - 9 edges
4. `getDefaultConfigPath()` - 7 edges
5. `getDefaultConfigPath()` - 6 edges
6. `getProjectsDir()` - 6 edges
7. `getProjectsDir()` - 6 edges
8. `readIndex()` - 5 edges
9. `readIndex()` - 5 edges
10. `writeFile()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `startWithRetry()` --calls--> `startServer()`  [EXTRACTED]
  bin/markdown-ai.js → dist-server/server.js
- `handleGetConfig()` --calls--> `getDefaultConfigPath()`  [EXTRACTED]
  dist-server/server.js → dist-server/config-path.js
- `handleGetConfigPath()` --calls--> `getDefaultConfigPath()`  [EXTRACTED]
  dist-server/server.js → dist-server/config-path.js
- `handlePutConfig()` --calls--> `getDefaultConfigPath()`  [EXTRACTED]
  dist-server/server.js → dist-server/config-path.js
- `handleCreateProject()` --calls--> `getDefaultConfigPath()`  [EXTRACTED]
  src/server/server.ts → src/server/config-path.ts

## Import Cycles
- 1-file cycle: `eslint.config.js -> eslint.config.js`

## Communities (15 total, 1 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.16
Nodes (15): getDefaultConfigPath(), getContentType(), getProjectsDir(), handleCreateProject(), handleDeleteProject(), handleGetConfig(), handleGetConfigPath(), handleListProjects() (+7 more)

### Community 1 - "Community 1"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, jsx, lib, module, moduleResolution, noEmit, noFallthroughCasesInSwitch (+11 more)

### Community 2 - "Community 2"
Cohesion: 0.19
Nodes (12): getDefaultConfigPath(), getContentType(), getProjectsDir(), handleDeleteProject(), handleGetConfig(), handleGetConfigPath(), handleListProjects(), handlePutConfig() (+4 more)

### Community 3 - "Community 3"
Cohesion: 0.11
Nodes (19): devDependencies, eslint, markdown-ui-core, next-themes, prettier, react, react-dom, tailwindcss (+11 more)

### Community 4 - "Community 4"
Cohesion: 0.20
Nodes (17): ensureHandle(), generateId(), getDirHandle(), getFileHandle(), getProjectFileName(), loadHandle(), migrateLegacyProject(), openDB() (+9 more)

### Community 5 - "Community 5"
Cohesion: 0.11
Nodes (17): author, bin, markdown-ai, description, engines, node, files, keywords (+9 more)

### Community 6 - "Community 6"
Cohesion: 0.15
Nodes (12): compilerOptions, allowImportingTsExtensions, module, moduleResolution, noEmit, outDir, rootDir, skipLibCheck (+4 more)

### Community 7 - "Community 7"
Cohesion: 0.20
Nodes (10): scripts, build, build:server, check, dev, format, lint, postinstall (+2 more)

### Community 8 - "Community 8"
Cohesion: 0.31
Nodes (5): appEl, init(), cacheConfigPath(), serverAdapter, webAdapter

### Community 9 - "Community 9"
Cohesion: 0.40
Nodes (3): PORT, startWithRetry(), startServer()

### Community 10 - "Community 10"
Cohesion: 0.33
Nodes (5): Install (recommended), License, Local install (alternative), Markdown-AI, Without installing at all

## Knowledge Gaps
- **80 isolated node(s):** `PORT`, `name`, `version`, `description`, `keywords` (+75 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Community 3` to `Community 5`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `scripts` connect `Community 7` to `Community 5`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **What connects `PORT`, `name`, `version` to the rest of the system?**
  _80 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `Community 5` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._