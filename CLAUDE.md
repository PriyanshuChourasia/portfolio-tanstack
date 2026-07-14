# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo layout

This is a **pnpm + Turborepo monorepo**. The portfolio app lives in `apps/web/`; all paths below (`src/`, `package.json`, etc.) are relative to `apps/web/` unless stated otherwise. Root-level `turbo.json` defines the task pipeline and `pnpm-workspace.yaml` defines the workspace. There are no `packages/*` yet — add shared packages there if a second app is introduced.

## Commands

Run from the repo root — `turbo` fans these out to every app in the workspace (currently just `web`):

```bash
pnpm dev            # Start dev server on port 3000 (apps/web)
pnpm build          # Build for production (vite build && tsc)
pnpm serve          # Preview production build
pnpm lint           # ESLint check
pnpm format         # Prettier format
pnpm check          # Prettier write + ESLint fix (combined)
pnpm test           # Run Vitest tests
```

Equivalent commands can be run scoped to a single app with `pnpm --filter web run <script>`, or by `cd apps/web` and using `pnpm run <script>` directly.

To add shadcn/ui components (run from `apps/web/`):
```bash
pnpx shadcn@latest add <component-name>
```

## Architecture

This is a personal portfolio SPA built with TanStack Router (file-based routing), React 19, TailwindCSS v4, and Framer Motion / GSAP for animations. It lives at `apps/web/` in the monorepo.

### Entry point

`src/main.tsx` bootstraps the app: creates the TanStack Router with the generated `routeTree`, wraps it with `TanStackQueryProvider` and `ThemeProvider`, and mounts to `#app`. The router context carries the `queryClient` instance.

`src/routes/__root.tsx` is the root layout — it renders `<Outlet />` plus TanStack devtools (Router + Query) in a unified panel.

### Routing

Routes live in `src/routes/` and are auto-generated into `src/routeTree.gen.ts` by the Vite plugin (`autoCodeSplitting: true` is on) — **never edit `routeTree.gen.ts` directly**. Adding a new file in `src/routes/` registers a new route automatically.

Current routes:
- `/` → `PortfolioLayout` → `HomePage` (the single-page scrollable portfolio)
- `/blog/$id` → `BlogPostDetailPage` (individual blog post)
- `/projects/` → `ProjectsPage` (full projects listing)
- `/projects/$id` → `ProjectDetailPage` (individual project detail)

### Feature structure

Portfolio sections live in `src/features/` as self-contained feature slices:

| Feature | Section |
|---|---|
| `portfolio-main` | Root layout + `HomePage` that composes all sections |
| `aboutus` | About me section |
| `resume` | Skills, experience, education panels |
| `works` | Projects grid + detail page |
| `articles` | Blog preview + full article listing |
| `blog` | Blog post detail page + comments |
| `contact` | Contact form section |

Each feature folder typically has `components/` and an `index.tsx` barrel export.

### Data

All portfolio content lives as static JSON in `src/data/`:
- `blog-data.json` — blog posts (HTML content in `content` field)
- `works-data.json` — project items with categories
- `resume-data.json` — experience, education, skills
- `aboutus-data.json` — about section content
- `carousel-data.json` — hero carousel slides
- `social-link.json` — social links

There is also `src/features/works/data.ts` (demo scroll-stack data, separate from `works-data.json`).

### Shared components

`src/components/` holds shared layout components:
- `Navbar.tsx` — fixed top nav that fades out on scroll, floating side icon nav appears
- `Carousal.tsx` — Hero carousel section
- `ScrollStack.tsx` — scroll-driven stacking card effect
- `ThreeScene.tsx` — Three.js animated particle-network background; accepts `isDark: boolean` to swap particle/line colors
- `ThemeProvider.tsx` — wraps `next-themes` `ThemeProvider`; `defaultTheme="dark"`, `enableSystem={false}`
- `ThemeToggle.tsx` — button to toggle light/dark mode
- `sidebar-drawer.tsx`, `Sidebarnav.tsx` — sidebar navigation
- `media-lightbox.tsx` — image lightbox
- `ui/` — shadcn/ui primitives (do not hand-edit these; use the CLI to regenerate)

### Path alias

`@/` resolves to `src/` (configured in `vite.config.ts` and `tsconfig.json`). Always use `@/` for imports within `src/`.

### Styling

TailwindCSS v4 via `@tailwindcss/vite` plugin. Global styles and custom CSS variables in `src/styles.css`. The `cn()` utility in `src/lib/utils.ts` merges Tailwind classes (`clsx` + `tailwind-merge`).

**Theme system:** `next-themes` manages dark/light switching via a `.dark` class on `<html>`. The default is dark. CSS custom properties in `styles.css` define both `:root` (light) and `.dark` token sets using `oklch()`, plus a custom `@theme inline` block with the portfolio-specific design tokens (`--primary: #00d4ff`, `--card: #1a2332`, etc.). Body background is a CSS gradient, not a Tailwind utility class.

**Custom utility classes** defined in `styles.css` (use these for consistent styling):
- `section-heading` — uppercase cyan label with text-shadow glow
- `body-text`, `body-text-primary`, `description-text` — text hierarchy classes
- `label-text`, `value-text` — for metadata/value pairs
- `gradient-text`, `header-green-accent` — cyan-to-green gradient text
- `gradient-primary`, `gradient-accent` — background gradients
- `glow-sm`, `glow-md`, `glow-lg` — cyan box-shadow glow intensities
- `card-shadow`, `card-shadow-hover` — card elevation shadows
- `hover-lift`, `card-hover-lift` — spring-eased upward hover transforms
- `star-border-card` — animated glowing border card
- `custom-scrollbar` — styled scrollbar (apply to overflow containers)
- `floating-shape` — CSS-animated background blob
- `animate-pulse-glow`, `animate-glow-border`, `animate-gradient-text`, `animate-shimmer`, `animate-fade-in-out`, `animate-parallax-1/2` — named keyframe animations

### Animation libraries

- **Framer Motion** — component-level enter/exit animations and scroll-triggered reveals
- **GSAP** — imperative timeline animations (used in scroll-driven effects)
- **Lenis** (`lenis` + `@studio-freight/lenis`) — smooth scroll; initialized at the layout level
- **Three.js** — `ThreeScene` particle-network hero background

### Integrations

`src/integrations/tanstack-query/` wraps TanStack Query setup:
- `root-provider.tsx` — exports `getContext()` (creates `QueryClient`) and `Provider` component
- `devtools.tsx` — lazy-loaded ReactQuery devtools plugin for the TanStack devtools panel
