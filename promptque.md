You are working in the apps/markdown-ui app of a pnpm + Turborepo monorepo (React 19 + Vite + TailwindCSS v4 + TypeScript, shadcn-style components, next-themes for dark/light, path alias @/ → src/). The app currently has no routing — src/App.tsx renders a single split-pane Markdown editor (EditorPane + PreviewPane) preloaded with demo content, and there's no concept of separate documents.
▎
▎ Add a "Projects" home screen that shows first, before the editor:
▎
▎ 1. Persistence (src/lib/projects.ts): a Project type { id, name, content, createdAt, updatedAt }, backed by localStorage (key markdown-ui:projects), with listProjects() (sorted by updatedAt desc), getProject(id), createProject(name) (seeds default content), updateProjectContent(id, content), renameProject(id, name), deleteProject(id).
▎ 2. Home screen (src/features/projects/ProjectsHome.tsx): lists existing projects as cards (name + relative last-updated time), each opening that project's editor on click, plus delete affordance per card. Include a prominent "Create Project" button/empty-state that opens a small dialog (build a minimal src/components/ui/dialog.tsx — backdrop + centered panel using existing border-border/bg-card tokens, no new dependency) prompting for a project name, then calls createProject and navigates straight into the editor for the new project.
▎ 3. Wire it into App.tsx: no router library needed — just local view state ('home' | 'editor', plus currentProjectId). The existing editor view (header with panel-toggle + theme-toggle, EditorPane/PreviewPane) becomes the 'editor' view; add a "back to projects" button in its header and load/save the active project's content from/to localStorage (debounce the save on change). Reuse the existing Button component and Tailwind design tokens from src/styles.css — don't introduce new UI libraries.
▎ 4. Keep changes scoped to apps/markdown-ui and follow this repo's conventions (feature-slice folders, cn() for class merging, no comments unless non-obvious).
▎
▎ After implementing, run pnpm --filter markdown-ui build (or the equivalent from apps/markdown-ui) to confirm it type-checks and builds.

---

Prompt:

▎ You are working in the apps/markdown-ui app of a pnpm + Turborepo monorepo (React 19 + Vite + TailwindCSS v4 + TypeScript, shadcn-style components, next-themes for dark/light, path alias @/ → src/). The app currently has no routing — src/App.tsx renders a single split-pane Markdown editor (EditorPane + PreviewPane) preloaded with demo content, with no concept of separate projects or persistence.
▎
▎ Build a three-stage flow: Setup → Projects Home → Editor.
▎
▎ 1. Setup screen (src/features/setup/SetupScreen.tsx) — shown once, on first launch
▎
▎ A form collecting:
▎ - Storage folder — a "Choose Folder" button that calls window.showDirectoryPicker() (File System Access API) so the user picks/creates a local directory where all app data (config + projects) will live. Show the chosen folder name once picked.
▎ - Name (required text field)
▎ - Email (optional)
▎ - GitHub link (optional)
▎ - Social links (optional — a small repeatable list of { label, url } pairs the user can add/remove)
▎ - A "Get Started" button, disabled until a folder is chosen and name is non-empty.
▎
▎ On submit:
▎ - Write a config.json file into the chosen directory (via directoryHandle.getFileHandle('config.json', { create: true }) + a writable stream) containing { name, email?, github?, socials: [...], createdAt }.
▎ - Persist the FileSystemDirectoryHandle itself in IndexedDB (handles can't go in localStorage) under a fixed key, e.g. markdown-ui:root-handle, so the app can reconnect to the same folder on future visits.
▎ - Move to the Projects Home stage.
▎
▎ On every app load, before rendering anything else: check IndexedDB for a stored handle. If present, call handle.queryPermission({ mode: 'readwrite' }) (re-request via requestPermission if needed — this typically requires a user gesture, so gate it behind a lightweight "Continue" button rather than an automatic call) and read config.json back. If both succeed, skip Setup and go straight to Projects Home; otherwise show Setup.
▎
▎ 2. Projects Home (src/features/projects/ProjectsHome.tsx)
▎
▎ - List projects as cards (name + last-updated time), reading from a project index kept in the same root directory (e.g. projects/index.json listing { id, name, fileName, createdAt, updatedAt }, with each project's Markdown body stored as its own projects/<fileName>.md file — all via File System Access API reads/writes on the stored directory handle, no localStorage for content).
▎ - A "Create Project" button/empty-state opens a small dialog (src/components/ui/dialog.tsx — backdrop + centered panel using existing border-border/bg-card tokens, no new dependency) prompting for a project name. On confirm: create the .md file with seed content, append to projects/index.json, and navigate into the editor for it.
▎ - Per-card delete affordance (removes the file and its index entry).
▎ - Show the signed-in user's name (from config.json) somewhere in the header, e.g. top-right, with a way to view/edit the profile fields from setup again.
▎
▎ 3. Editor (existing App.tsx split-pane view, reused)
▎
▎ - Keep the current header (panel-toggle, theme-toggle) but add a "back to projects" button.
▎ - Load the selected project's Markdown from its file on open; on change, debounce writes back to that same file (via the directory handle) instead of any in-memory-only state.
▎
▎ Notes
▎
▎ - No router library needed — drive the three stages with local state ('setup' | 'home' | 'editor') plus currentProjectId.
▎ - The File System Access API is Chromium-only; that's an accepted limitation here — no fallback needed unless asked.
▎ - Reuse the existing Button component and design tokens from src/styles.css; don't introduce new UI or state-management libraries.
▎ - Follow this repo's conventions (feature-slice folders under src/features/, cn() for class merging, no comments unless non-obvious).
▎ - After implementing, run pnpm --filter markdown-ui build (or the equivalent from apps/markdown-ui) to confirm it type-checks and builds.

Add to the prompt (as a new section, applying across all three stages):

▎ App shell — Header / Body / Footer
▎
▎ Wrap all three stages (Setup, Projects Home, Editor) in a shared src/components/AppShell.tsx layout:
▎ - Header: existing top bar content per stage (theme-toggle always present; panel-toggle and "back to projects" only in the Editor stage; user's name from config.json shown top-right once past Setup).
▎ - Body: the active stage's content (SetupScreen / ProjectsHome / editor split-pane), scrollable/flex-1 as appropriate — reuse the existing h-screen flex flex-col pattern from App.tsx.
▎ - Footer: a slim bar, always visible, containing:
▎   - © 2026 Priyanshu Chourasia
▎   - a link to https://github.com/PriyanshuChourasia (opens in a new tab, rel="noopener noreferrer")
▎
▎   Style it with the existing border-border/text-muted-foreground tokens, small text, centered or right-aligned, consistent in both themes.

---

