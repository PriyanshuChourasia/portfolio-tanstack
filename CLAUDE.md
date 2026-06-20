# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server on port 3000
npm run build      # Build for production (vite build && tsc)
npm run serve      # Preview production build
npm run lint       # ESLint check
npm run format     # Prettier format
npm run check      # Prettier write + ESLint fix (combined)
npm run test       # Run Vitest tests
```

To add shadcn/ui components:
```bash
pnpx shadcn@latest add <component-name>
```

## Architecture

This is a personal portfolio SPA built with TanStack Router (file-based routing), React 19, TailwindCSS v4, and Framer Motion / GSAP for animations.

### Entry point

`src/main.tsx` bootstraps the app: creates the TanStack Router with the generated `routeTree`, wraps it with `TanStackQueryProvider`, and mounts to `#app`.

`src/routes/__root.tsx` is the root layout — it renders `<Outlet />` plus TanStack devtools (Router + Query) in a unified panel. The router context carries the `queryClient` instance.

### Routing

Routes live in `src/routes/` and are auto-generated into `src/routeTree.gen.ts` by the Vite plugin — **never edit `routeTree.gen.ts` directly**. Adding a new file in `src/routes/` registers a new route automatically.

Current routes:
- `/` → `PortfolioLayout` → `HomePage` (the single-page scrollable portfolio)
- `/blog/$id` → `BlogPostDetailPage` (individual blog post)
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
- `sidebar-drawer.tsx`, `Sidebarnav.tsx` — sidebar navigation
- `media-lightbox.tsx` — image lightbox
- `ui/` — shadcn/ui primitives (do not hand-edit these; use the CLI to regenerate)

### Path alias

`@/` resolves to `src/` (configured in `vite.config.ts` and `tsconfig.json`). Always use `@/` for imports within `src/`.

### Styling

TailwindCSS v4 via `@tailwindcss/vite` plugin. Global styles in `src/styles.css`. The main background is `bg-slate-950` with `text-white`. The `cn()` utility in `src/lib/utils.ts` merges Tailwind classes (`clsx` + `tailwind-merge`).

### Integrations

`src/integrations/tanstack-query/` wraps TanStack Query setup:
- `root-provider.tsx` — exports `getContext()` (creates `QueryClient`) and `Provider` component
- `devtools.tsx` — lazy-loaded ReactQuery devtools plugin for the TanStack devtools panel
