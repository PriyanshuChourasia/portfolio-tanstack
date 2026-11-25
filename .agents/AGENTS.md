# Agents Documentation

This project uses the Freebuff AI coding agent system. This file provides guidance for AI agents working with this codebase.

## Project Structure

- **Monorepo**: pnpm + Turborepo
- **Portfolio app**: `apps/web/` - Personal portfolio SPA
- **Resume UI**: `apps/resume-ui/` - Resume builder application

## Commands

Root-level commands (run from repo root):
- `pnpm dev` - Start dev server on port 3000
- `pnpm build` - Build for production
- `pnpm serve` - Preview production build
- `pnpm lint` - ESLint check
- `pnpm format` - Prettier format
- `pnpm check` - Prettier write + ESLint fix
- `pnpm test` - Run Vitest tests

App-specific commands:
- `pnpm --filter web run <script>` - Run script in web app
- `pnpm --filter resume-ui run <script>` - Run script in resume-ui app

## Architecture

### Portfolio App (`apps/web/`)

- **Framework**: React 19 + TanStack Router (file-based routing)
- **Styling**: TailwindCSS v4
- **Animations**: Framer Motion, GSAP, Lenis (smooth scroll), Three.js
- **Data**: Static JSON in `src/data/`
- **Features**: `portfolio-main`, `aboutus`, `resume`, `works`, `articles`, `blog`, `contact`

### Resume UI (`apps/resume-ui/`)

- **Resume builder** with multiple templates (Minimal, Elegant, Modern, Classic)
- **Template system**: Self-contained feature slices in `src/features/resume-builder/templates/`
- **Components**: Shared layout in `src/components/`
- **Data**: Resume content in `src/data/resume-data.json`
- **Templates**: Minimal, Elegant, Modern, Classic

## Key Files

- `src/main.tsx` - App entry point
- `src/routes/` - Route definitions (auto-generated `routeTree.gen.ts`)
- `src/features/` - Feature slices
- `src/components/` - Shared components
- `src/data/` - Static data JSON files
- `src/styles.css` - Global styles and CSS variables

## Working with Resume UI

### Adding a new template

1. Create folder in `src/features/resume-builder/templates/`
2. Create `index.tsx` with the template component
3. Export from `src/features/resume-builder/templates/index.tsx`
4. Add to template selector in the builder

### Using the logo

- Logo: `public/resume_logo.png`
- Add `logoUrl: string` to `PersonalInfo` interface
- Set in personal info data to display: `logoUrl: '/resume_logo.png'`

## Agent Guidelines

- Follow existing code conventions
- Use `@/` path alias for imports within `src/`
- Match TailwindCSS v4 styling patterns
- Preserve existing functionality when making changes
- Run `pnpm build` and `pnpm test` after changes
- Keep changes minimal and focused

## Recent Changes

- Logo integration: `resume_logo.png` displayed across all templates
- Splash screen: Beautiful image-free entrance animation
- Favicon: Updated to use resume logo
- Types: Added `logoUrl` to `PersonalInfo` interface