# Resume Builder

A free, open-source, browser-based resume builder with live preview, 12 ATS-friendly templates, PDF export, and zero sign-up. Built for speed, privacy, and recruiter-approved output.

**Live → [resumeio.codymitra.com](https://resumeio.codymitra.com)**

---

## Why This Exists

Most resume builders are either paid, require accounts, or produce templates that fail ATS screening. This project started as a personal need — building a resume that actually passes automated systems while looking polished enough for humans. Every template here is tested against real ATS parsing logic. Every feature runs entirely in the browser. No data ever touches a server.

The goal is simple: make the best free resume builder on the web. Not freemium. Not gated. Just free.

## What It Does

- **12 resume templates** — Classic, Modern, Executive, Minimal, Creative, Developer, Bold, Elegant, Sidebar, Accent, Premium, Fresh, Navy, Simple, Visual
- **Live preview** — every keystroke updates the resume instantly
- **ATS optimization** — templates use clean HTML structure that ATS systems parse correctly
- **PDF export** — one-click download, A4/Letter, print-quality
- **Unlimited resumes** — create, manage, and switch between multiple resumes
- **Auto save** — everything persists in localStorage, survives refresh
- **Undo / redo** — 100-level history, never lose work
- **Theme customization** — colors, fonts, spacing, section order
- **Dark / light mode** — full theme support with instant toggle
- **Section drag & drop** — reorder sections to highlight strengths
- **PDF import** — upload an existing PDF resume, parse and populate the form
- **JSON export / import** — backup and restore resume data
- **Print support** — one-click print with perfect A4 formatting
- **Responsive** — works on desktop, laptop, tablet, and mobile
- **Zero tracking** — no analytics, no accounts, no servers, no cookies

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Routing | TanStack Router (file-based) |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui + Radix UI |
| State | Zustand (undo/redo, multi-resume) |
| Animations | Framer Motion |
| Build | Vite 8 |
| Language | TypeScript 6 |
| PDF | html2canvas + jsPDF (native print fallback) |
| PDF Parsing | pdf.js |
| Drag & Drop | @dnd-kit |

## Architecture

```
apps/resume-ui/
├── src/
│   ├── main.tsx                          # Entry point, ThemeProvider wrapping
│   ├── routeTree.gen.ts                  # Auto-generated (never edit)
│   ├── styles.css                        # Tailwind + dark/light CSS variables
│   │
│   ├── routes/
│   │   ├── __root.tsx                    # Root layout + meta + devtools
│   │   ├── index.tsx                     # Landing page (12-section premium design)
│   │   ├── resume.tsx                    # Builder page → <BuilderLayout>
│   │   ├── classic.tsx                   # Static ATS resume (Priyanshu's)
│   │   ├── resume-to-portfolio.tsx       # Bridge page
│   │   ├── germany/backend.tsx           # Localized resume
│   │   └── poland/{backend,frontend}.tsx # Localized resumes
│   │
│   ├── features/resume-builder/
│   │   ├── types.ts                      # All TypeScript interfaces
│   │   ├── constants.ts                  # Factory functions, sample data, defaults
│   │   ├── store.ts                      # Zustand store (undo/redo, multi-resume, CRUD)
│   │   │
│   │   ├── hooks/
│   │   │   ├── useResumeBuilder.ts       # Legacy hook (still used by templates)
│   │   │   └── useListField.ts           # Generic list CRUD helper
│   │   │
│   │   ├── utils/
│   │   │   ├── generate-pdf.ts           # Browser print → PDF
│   │   │   ├── export-word.ts            # .doc export
│   │   │   ├── pdf-parse.ts              # PDF text extraction
│   │   │   └── parse-resume-text.ts      # Resume text → structured data parser
│   │   │
│   │   ├── templates/                    # 12 resume template components
│   │   │   ├── registry.ts               # Template metadata registry
│   │   │   ├── types.ts                  # ResumeTemplateProps interface
│   │   │   ├── ClassicTemplate.tsx
│   │   │   ├── ModernTemplate.tsx
│   │   │   ├── ...                       # 10 more templates
│   │   │   └── VisualTemplate.tsx
│   │   │
│   │   └── components/
│   │       ├── BuilderLayout.tsx          # Main builder page (sidebar + preview)
│   │       ├── BuilderHeader.tsx          # Sticky header (template, undo, export)
│   │       ├── BuilderSidebar.tsx         # Collapsible section forms
│   │       ├── ThemeProvider.tsx           # Dark/light mode context
│   │       ├── ThemeToggle.tsx             # Animated sun/moon toggle
│   │       ├── SettingsPanel.tsx           # Font, spacing, paper size settings
│   │       ├── ResumeManager.tsx           # Multi-resume CRUD popover
│   │       ├── TemplatePicker.tsx          # Template selector dropdown
│   │       ├── ColorPalette.tsx            # 8 presets + custom color pickers
│   │       ├── SortableList.tsx            # @dnd-kit drag & drop wrapper
│   │       ├── BulletStyle.tsx             # Bullet style injection
│   │       ├── FontSizeStyle.tsx           # Font size scaling injection
│   │       ├── ResumePreview.tsx           # Template renderer
│   │       ├── ResumePagination.tsx        # Page measurement + breaks
│   │       ├── RepeatableCard.tsx          # Reusable card with delete
│   │       ├── DateRangeFields.tsx         # Date range with calendar picker
│   │       └── sections/                   # 14 section form components
│   │           ├── PersonalInfoForm.tsx
│   │           ├── SummaryForm.tsx
│   │           ├── ExperienceForm.tsx
│   │           ├── EducationForm.tsx
│   │           ├── SkillsForm.tsx
│   │           ├── ProjectsForm.tsx
│   │           ├── CertificationsForm.tsx
│   │           ├── LanguagesForm.tsx
│   │           ├── AwardsForm.tsx
│   │           ├── VolunteerForm.tsx
│   │           ├── PublicationsForm.tsx
│   │           ├── ReferencesForm.tsx
│   │           ├── InterestsForm.tsx
│   │           └── CustomSectionsForm.tsx
│   │
│   ├── components/ui/                    # shadcn/ui primitives
│   └── lib/utils.ts                      # cn() utility
│
├── index.html                            # SEO meta, JSON-LD, theme flash prevention
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tsr.config.json
```

## Getting Started

```bash
# Clone
git clone https://github.com/PriyanshuChourasia/resume-to-portfolio.git
cd resume-to-portfolio

# Install
pnpm install

# Run
pnpm dev          # apps/web on port 3000
pnpm --filter resume-ui dev   # resume-ui on port 3000
```

### Available Commands

From the monorepo root:

```bash
pnpm dev                  # Start dev server
pnpm build                # Production build
pnpm lint                 # ESLint check
pnpm format               # Prettier format
pnpm check                # Prettier write + ESLint fix
pnpm test                 # Vitest tests
```

### Adding shadcn/ui Components

```bash
cd apps/resume-ui
pnpx shadcn@latest add <component-name>
```

## Data Model

All resume data lives in a single `ResumeData` object stored in localStorage:

```typescript
interface ResumeData {
  personalInfo: PersonalInfo    // Name, title, email, phone, etc.
  summary: string               // Professional summary
  experience: ExperienceEntry[] // Work history
  education: EducationEntry[]   // Degrees
  skills: SkillCategory[]       // Categorized skill lists
  projects: ProjectEntry[]      // Portfolio projects
  certifications: CertificationEntry[]
  languages: LanguageEntry[]    // With proficiency levels
  awards: AwardEntry[]
  volunteer: VolunteerEntry[]
  publications: PublicationEntry[]
  interests: InterestEntry[]
  customSections: CustomSectionEntry[]
  theme: ResumeTheme            // Colors
  settings: ResumeSettings      // Fonts, spacing, orientation
  sectionOrder: SectionId[]     // Drag-and-drop order
}
```

No server. No database. Everything stays on the user's device.

## How the Store Works

The Zustand store manages:

- **Multi-resume registry** — each resume gets its own localStorage key (`resume-builder:data:<uuid>`)
- **Undo/redo history** — 100-level stack of `ResumeData` snapshots
- **Auto-save** — every mutation writes to localStorage immediately
- **Section CRUD** — add, update, remove, reorder for all dynamic sections

```
User types → set() → pushHistory() → saveResumeData() → React re-renders
```

## How PDF Export Works

1. The resume preview is rendered as a DOM element
2. On export, the browser's native print dialog is invoked with `@page` rules set to A4/Letter
3. The user selects "Save as PDF" in the print dialog
4. Fallback: if print fails, an alert offers to retry

This approach produces pixel-perfect PDFs with embedded fonts, correct margins, and no clipping — because the browser handles the rendering engine.

## How PDF Import Works

1. User uploads a PDF
2. `pdf.js` extracts raw text from the PDF, grouped by y-position (line detection)
3. `parse-resume-text.ts` uses regex patterns and heuristics to identify:
   - Personal info (name, email, phone, LinkedIn, website, location)
   - Sections (summary, experience, education, skills, projects, certifications, languages)
4. Parsed data is merged into the current resume

## Theme System

Dark/light mode uses:

1. A **blocking `<script>`** in `index.html` that reads localStorage and sets the `.dark` class on `<html>` before React mounts — no flash of wrong theme
2. A **`ThemeProvider`** context that manages the theme state and persists to localStorage
3. **CSS custom properties** in `styles.css` with `oklch()` color values for both `:root` (light) and `.dark` (dark)
4. The `@custom-variant dark` directive in Tailwind v4 so `dark:` utilities work

## Landing Page

The landing page (`/`) is a 12-section premium design with:

- Floating glass navigation bar
- Hero with animated typing headline + interactive resume mockup with mouse parallax
- Trusted-by social proof strip
- Template showcase with 6 gradient cards
- 9-card feature grid with hover glow effects
- 4-step "How It Works" timeline
- Interactive builder preview with tab switching
- ATS optimization section with animated SVG score ring
- Testimonials with star ratings
- FAQ accordion with height animations
- Final CTA with gradient background
- Minimal footer

All sections use `IntersectionObserver`-based reveal animations with staggered timing. Framer Motion handles spring physics, layout animations, and AnimatePresence transitions.

## Roadmap

Based on the original product spec, here is what's built and what's next:

### Built

- [x] Create unlimited resumes
- [x] Edit resumes with live preview
- [x] Auto save to localStorage
- [x] 12 resume templates
- [x] PDF export (print-to-PDF)
- [x] Print support
- [x] Reorder sections (drag & drop ready)
- [x] Customize colors (8 presets + custom)
- [x] Customize typography (fonts, sizes, spacing)
- [x] Change spacing and line height
- [x] Enable/disable sections
- [x] Export as JSON
- [x] Import from JSON
- [x] Import from PDF (with text parsing)
- [x] Undo / redo (100 levels)
- [x] Multi-resume management
- [x] Dark / light mode
- [x] Responsive design (mobile + desktop)
- [x] 14 section forms
- [x] Section search in sidebar
- [x] Premium landing page with animations

### Planned

- [ ] Full drag-and-drop section reordering in sidebar (visual handles exist, DnD wiring pending)
- [ ] Rich text editor for bullet points (bold, italic, links)
- [ ] Profile photo upload (base64 / drag-and-drop)
- [ ] More templates (target: 20+)
- [ ] Collaborative editing (WebSocket-based)
- [ ] Cloud sync (optional, privacy-first)
- [ ] AI-powered content suggestions
- [ ] Cover letter builder
- [ ] LinkedIn profile import
- [ ] Multi-language support (i18n)
- [ ] PWA offline support
- [ ] Share resume via link (public view)
- [ ] Template marketplace (community-contributed)
- [ ] Keyboard shortcuts (Ctrl+Z, Ctrl+Shift+Z, etc.)
- [ ] Custom CSS injection for power users
- [ ] Chrome extension for quick resume editing

## Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/my-feature`)
3. Commit your changes (`git commit -m 'feat: add my feature'`)
4. Push to the branch (`git push origin feat/my-feature`)
5. Open a Pull Request

Follow the existing code conventions:
- Feature-first folder structure
- shadcn/ui components (don't hand-edit `components/ui/`)
- `@/` path alias for imports within `src/`
- Tailwind CSS for all styling
- Framer Motion for all animations
- TypeScript strict mode

## License

[MIT](LICENSE) — use it for anything, no restrictions.

## Author

Built by [CodyMitra](https://codymitra.com) — Priyanshu Chourasia.

If this project helped you land a job, I'd love to hear about it.
