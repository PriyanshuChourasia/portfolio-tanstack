# resume-ui prompts

---

## Prompt 1 — Fix the crash: "personalInfo is not defined"

* [ ]

CONTEXT

- App: apps/resume-ui (Vite + React 19 + TanStack Router + Zustand store + framer-motion + TailwindCSS v4).
- IMPORTANT: apps/resume-ui contains its own nested, stale .git directory. Do NOT run
  git stash / checkout / reset from inside apps/resume-ui. Run git commands from the monorepo root only.
- Do not start a dev server, browser, or curl to verify — I will test manually.

ROOT CAUSE
src/features/resume-builder/components/BuilderHeader.tsx (lines ~78-83) renders:
{personalInfo.logoUrl && (<img src={personalInfo.logoUrl} ... />)}
but `personalInfo` is never declared in BuilderHeader. The component only selects
`document`, `renameResume`, `undo`, `redo`, `canUndo`, `canRedo` from `useResumeStore`.
The resume data lives at `document.data` (ResumeDocument -> data: ResumeData),
so personal info is at `document.data.personalInfo`.

STEPS

1. Open src/features/resume-builder/components/BuilderHeader.tsx.
2. Right after the existing `useResumeStore` selectors (~line 50), add a narrow selector
   so the header only re-renders when the logo changes:
   const logoUrl = useResumeStore((s) => s.document.data.personalInfo?.logoUrl)
3. Replace the broken block at lines ~78-83 with:
   {logoUrl && (
   <img
   src={logoUrl}
   alt="Resume logo"
   className="size-5 shrink-0 rounded-sm"
   />
   )}
   Then confirm no bare `personalInfo` identifier remains:
   grep -n "personalInfo" src/features/resume-builder/components/BuilderHeader.tsx
4. Harden legacy data: resumes saved to localStorage before `logoUrl` existed won't have it.
   In src/features/resume-builder/store.ts, find where saved resume data is loaded/parsed
   (the loader around lines ~100-117 returning `{ meta, data: parsed }`, plus the import
   paths around lines ~550 and ~577). Merge defaults so missing fields are filled:
   personalInfo: { ...DEFAULT_PERSONAL_INFO, ...parsed.personalInfo }
   Import DEFAULT_PERSONAL_INFO from '../types'. Apply the same merge in
   src/features/resume-builder/hooks/useResumeBuilder.ts if it also loads persisted data.
5. Audit other `logoUrl` consumers (ModernTemplate.tsx ~line 238). They destructure
   `personalInfo` from `data`, which is correct — just confirm nothing calls a string method
   (e.g. `.trim()`) on `logoUrl` without a guard.
6. Type-check and test (no dev server):
   cd apps/resume-ui && npx tsc --noEmit && pnpm test
   Fix any type errors introduced. Report the output.
7. Summarize the diff: files changed, one-line reason each.

ACCEPTANCE

- No "personalInfo is not defined" error; the builder page renders.
- Header shows /resume_logo.png beside "Resume Builder" when logoUrl is set; nothing extra when empty.
- Old resumes in localStorage load without errors.
- tsc and vitest pass.

(Alternative minimal fix: if the logo isn't wanted in the header, just delete lines 78-83.)

---

## Prompt 2 — Beautiful animated splash screen

Rebuild the splash screen for apps/resume-ui into a polished, animated, theme-aware intro.

CONTEXT

- App: apps/resume-ui (Vite + React 19 + TanStack Router + TailwindCSS v4 + framer-motion ^12, already installed).
  Use framer-motion only — do not add new animation libraries (no GSAP/Lottie).
- Do NOT run git stash/checkout/reset inside apps/resume-ui (nested stale .git). No dev server / browser verification — I test manually.
- Brand assets: /public/resume_logo.png (app logo). Product name "Resume Builder",
  tagline "Create your free, ATS-friendly resume in minutes".
- Theme: class-based (`html.dark` / `html.light`), set before first paint by the inline script in
  index.html (localStorage key `resume-ui:theme`). The splash must match the active theme.
  Dark bg ≈ #0a0a0a, light bg ≈ #fafafa (see the <style> block in index.html).

PROBLEMS WITH THE CURRENT IMPLEMENTATION (fix all of them)
File: src/components/SplashScreen.tsx and its mount in src/main.tsx

1. `onComplete()` is called during render (side effect in render) — move it to an effect /
   AnimatePresence `onExitComplete`.
2. No exit animation — it just unmounts after a hard-coded 2s.
3. Root div has `pointer-events-none`, so clicks pass through to the app underneath while the splash is up.
4. Tagline has `opacity-0` and is never animated in — it's invisible.
5. Hard-coded dark gradient ignores light theme; the `background` mixes two gradients incorrectly.
6. main.tsx calls `router.getRoot().ready` — not a TanStack Router API. Readiness must come from
   `router.subscribe('onResolved', …)` (unsubscribe after first fire) or awaiting `router.load()`.
7. `splashCompleted` local variable in main.tsx does nothing useful — remove it.
8. SplashScreen is rendered outside `<ThemeProvider>`.

DESIGN SPEC (the visual)
Full-viewport overlay (`fixed inset-0 z-[100]`), centered composition, ~2.2s total on a normal load.
Theme-aware colors via Tailwind `dark:` variants / CSS vars from src/styles.css (primary accent cyan → emerald gradient, matching the existing brand).

Background layers (bottom → top):

- Solid theme background (`bg-[#fafafa] dark:bg-[#0a0a0a]`).
- Two large, blurred gradient blobs (cyan and emerald, `blur-3xl`, ~40% opacity in dark, ~25% in light)
  slowly drifting/scaling (framer-motion `animate` with `repeat: Infinity, repeatType: 'mirror'`, 6–8s).
- A faint dot-grid or fine line grid (CSS `radial-gradient` background-size 24px) masked with a
  radial `mask-image` so it fades toward the edges.

Center stage, animated in this sequence:

1. (0.00–0.55s) Logo card: a rounded-2xl glassy tile (bg-white/60 dark:bg-white/5, border, backdrop-blur,
   soft cyan glow shadow) containing /resume_logo.png. Enters with spring scale 0.6→1 + opacity 0→1
   + slight rotate -8°→0°.
2. (0.30–1.10s) "Resume assembling" motif — the signature moment: beside/below the logo, a mini
   A4-shaped paper (≈ 96×128px, white / zinc-900) where 5–6 skeleton text lines draw in left→right
   one after another (`scaleX` 0→1 with `origin-left`, staggered 0.08s), the first line thicker
   (name), a short accent-colored line (title), then body lines of varied widths. A small checkmark
   badge pops in at the corner when the last line finishes (spring).
3. (0.70–1.30s) Title "Resume Builder": per-letter stagger (y: 12→0, opacity 0→1, blur 6px→0,
   stagger 0.03s), text uses cyan→emerald gradient (`bg-clip-text text-transparent`).
4. (1.10–1.50s) Tagline fades/slides up (y 8→0), muted foreground color.
5. (from 0.4s) Progress bar: thin 2px track (max-w-[220px]) under the tagline with a gradient fill.
   Progress animates toward ~85% while waiting, then jumps to 100% once the app is ready
   (see LOGIC). Add a subtle shimmer sweep across the fill.

Exit (when done):

- Content scales 1→0.96 and fades; the whole overlay then lifts away
  (`clipPath: inset(0 0 0 0)` → `inset(0 0 100% 0)`, ~0.6s, ease [0.76, 0, 0.24, 1]) revealing the app.
- Use `AnimatePresence` with `onExitComplete` to signal completion.

LOGIC / BEHAVIOR

- Show condition: only on the first load of a browser session (sessionStorage key
  `resume-ui:splash-seen`). Route-to-route navigation must never show it again.
- Timing: dismiss when BOTH (a) a minimum display time of 1600ms has elapsed AND (b) the router has
  resolved its first route. Hard maximum 3500ms — dismiss regardless (never trap the user).
- Skip: click/tap anywhere or press Esc/Enter/Space to skip immediately (still plays the exit animation).
  Show a tiny "Press any key to skip" hint fading in after 1s at the bottom, muted text-xs.
- While visible: lock body scroll (`document.body.style.overflow = 'hidden'`, restore on unmount).
- Accessibility: `role="status"`, `aria-live="polite"`, `aria-label="Loading Resume Builder"`;
  decorative elements `aria-hidden`. Respect `prefers-reduced-motion` via framer-motion
  `useReducedMotion()`: no blob drift / letter stagger / clip-path wipe — just a 300ms fade in and out,
  min time reduced to 600ms.
- Print: add `print:hidden`.
- Pre-JS flash: to avoid a blank screen before React boots, add a minimal static placeholder inside
  `<div id="app">` in index.html (centered logo on the theme background, pure CSS, no JS). React's
  createRoot replaces it, and the React splash's first frame must visually match it (same logo size
  and position) so the hand-off is seamless. NOTE: main.tsx currently guards with
  `if (!rootElement.innerHTML)` — change that guard (e.g. check for a `data-splash` marker or just
  always mount) so the placeholder doesn't block rendering.

IMPLEMENTATION STEPS

1. Create `src/components/splash/` with:
   - `SplashScreen.tsx` — the overlay; props `{ ready: boolean; onDone: () => void }`.
   - `AssemblingResume.tsx` — the mini paper + drawing lines + check badge.
   - `AnimatedTitle.tsx` — per-letter stagger title.
   - `useSplashGate.ts` — hook combining min time, `ready`, max timeout, skip input, reduced motion,
     returns `{ visible, progress, skip }`.
   - `index.ts` barrel. Delete the old `src/components/SplashScreen.tsx` and update imports.
2. Create `src/components/splash/SplashGate.tsx`: reads/writes the sessionStorage flag, subscribes to
   router readiness, and renders `<AnimatePresence>{visible && <SplashScreen …/>}</AnimatePresence>`.
   Readiness: `useRouter()` is not available outside RouterProvider, so pass the `router` instance as a
   prop and use `router.subscribe('onResolved', () => setReady(true))` (call the returned unsubscribe
   in cleanup); also set ready immediately if `router.state.status === 'idle'` and matches exist.
3. Update `src/main.tsx`:
   <ThemeProvider>
   <RouterProvider router={router} />
   <SplashGate router={router} />
   </ThemeProvider>
   Remove `splashCompleted` and the `router.getRoot()` call.
4. Update index.html with the static placeholder + its tiny CSS (inside the existing <style> block,
   theme-aware via `html.dark` / `html.light`).
5. Keep all colors in Tailwind classes / existing CSS tokens; use `cn()` from `@/lib/utils` if it
   exists (else the app's equivalent). No inline style objects except for motion values.
6. Verify without a dev server:
   cd apps/resume-ui && npx tsc --noEmit && pnpm test && pnpm build
   Report the output and fix any errors.

ACCEPTANCE

- Splash appears once per session, matches the current theme (light and dark), and never flashes a blank or wrong-colored screen.
- Sequence plays in order: logo → resume lines drawing + check → gradient title → tagline → progress → wipe-out reveal.
- Dismisses no earlier than 1.6s, no later than 3.5s; click/key skip works; app underneath is not clickable while it's visible.
- `prefers-reduced-motion` gets a simple fade.
- No setState/side effects during render; no console warnings; tsc, tests and build pass.
- Summarize the files created/changed/deleted.

---

## Prompt 3 — Correction: "Uncaught ReferenceError: themeClass is not defined" (main.tsx) + broken splash wiring

Fix apps/resume-ui so the app boots again and the splash screen from Prompt 2 actually works.

CONTEXT
- App: apps/resume-ui (Vite + React 19 + TanStack Router + framer-motion + TailwindCSS v4).
- Do NOT run git stash/checkout/reset inside apps/resume-ui (nested stale .git). Run git only from the monorepo root.
- No dev server / browser / curl verification — I test manually.

ROOT CAUSE — src/main.tsx is structurally broken (the themeClass error is only the first crash)
1. `const themeClass` is declared inside the `if (!rootElement.dataset.splash) { … }` block (line ~24)
   but used outside it on lines ~38-39 → block-scoped → ReferenceError.
2. Hooks are called at module top level: `useEffect(() => { … }, [])` at line ~109. Hooks can only run
   inside components → "Invalid hook call" as soon as #1 is fixed.
3. `React`, `useState`, `useEffect`, `useLocation` are used but never imported.
4. `rootElement.render = (root) => …` assigns a made-up method on a DOM element — dead and invalid TS.
5. `rootElement.innerHTML = '<div …>'` injects the placeholder from JS. The placeholder belongs in
   index.html (it must exist BEFORE JS loads, otherwise it's pointless).
6. `rootElement.style.overflow = 'hidden'` is never undone; click/keydown listeners on #app do nothing useful.
7. A second `ReactDOM.createRoot` is mounted on a div appended INSIDE `#app`, which the first root owns
   → React will wipe/ fight over it.
8. `<SplashGate>` is never rendered in the main tree, and the local `SplashGateComponent` duplicates
   SplashGate with inverted logic (`if (!ready || splashSeen) return null`).

ROOT CAUSE — src/components/splash/* logic bugs (splash would never appear even after main.tsx is fixed)
- SplashGate writes `resume-ui:splash-seen` on mount, then SplashScreen reads that same flag and
  immediately dismisses itself → it never shows, even on the first visit.
- SplashGate returns `null` until the router is `ready`, so nothing covers the app during loading.
- The router is subscribed to in three places (main.tsx, SplashGate, useSplashGate).
- useSplashGate: if `onResolved` fires before 1600ms, nothing hides the splash later (no min-time timer);
  max timeout is `MAX_TIMEOUT - MIN_DISPLAY_TIME` (= 1900ms, not 3500ms); `hasSkipped` is read from a
  stale closure; the "skip hint" timer sets `skip = true`, which SplashGate treats as an actual skip;
  `NodeJS.Timeout` type in browser code.
- `<AnimatePresence>` wraps a child that is always rendered, and SplashScreen hides itself with
  internal state → the exit animation never plays. `onDone={() => {}}` is a no-op.
- SplashScreen owns its own timers + sessionStorage logic (duplicated state).
- The old src/components/SplashScreen.tsx is still in the repo.

TARGET ARCHITECTURE (one source of truth)
- index.html → static boot placeholder (pure HTML/CSS) inside #app; React replaces it on first render.
- main.tsx → creates router, renders ONE root: ThemeProvider > RouterProvider + SplashGate. Nothing else.
- useSplashGate(router) → owns ALL splash state: should-show, ready, min time, max time, skip, hint, progress.
- SplashGate → calls the hook, renders `<AnimatePresence>{open && <SplashScreen key="splash" … />}</AnimatePresence>`.
- SplashScreen → purely presentational (props only, no timers, no storage, no internal visibility state).

STEPS
1. Replace src/main.tsx entirely with:

       import { StrictMode } from 'react'
       import ReactDOM from 'react-dom/client'
       import { RouterProvider, createRouter } from '@tanstack/react-router'
       import { routeTree } from './routeTree.gen'
       import { ThemeProvider } from './features/resume-builder/components/ThemeProvider'
       import { SplashGate } from './components/splash'

       const router = createRouter({
         routeTree,
         defaultPreload: 'intent',
         scrollRestoration: true,
       })

       declare module '@tanstack/react-router' {
         interface Register {
           router: typeof router
         }
       }

       const rootElement = document.getElementById('app')!

       ReactDOM.createRoot(rootElement).render(
         <StrictMode>
           <ThemeProvider>
             <RouterProvider router={router} />
             <SplashGate router={router} />
           </ThemeProvider>
         </StrictMode>,
       )

   (Check src/router.tsx — if it already creates/exports a router, import that instead of creating a
   second one, and keep the `Register` declaration in exactly one place.)

2. index.html — static boot placeholder:
   - Change `<div id="app"></div>` to:
         <div id="app"><div id="boot-splash" aria-hidden="true"><img src="/resume_logo.png" alt="" width="56" height="56" /></div></div>
   - In the existing <style> block add:
         #boot-splash { position: fixed; inset: 0; display: grid; place-items: center; z-index: 100; }
         html.light #boot-splash, #boot-splash { background: #fafafa; }
         html.dark #boot-splash { background: #0a0a0a; }
   - The theme class is already applied by the existing inline <script>; do NOT duplicate theme
     detection in main.tsx. Logo size/position must match the React splash's first frame.

3. Rewrite src/components/splash/useSplashGate.ts:
   Signature: `useSplashGate(router: AnyRouter)` (import `type AnyRouter` from '@tanstack/react-router').
   Returns `{ open, progress, showHint, reducedMotion, skip }`.
   - `shouldShow`: computed ONCE via `useState(() => …)` initializer — true only if
     `sessionStorage.getItem('resume-ui:splash-seen') !== '1'` (wrap in try/catch, default true).
     If false → `open` is false from the very first render and no timers start.
   - `reducedMotion`: framer-motion `useReducedMotion()`. min = reducedMotion ? 600 : 1600; max = 3500.
   - `ready`: `useState(false)`; in an effect, `const unsub = router.subscribe('onResolved', () => setReady(true))`;
     also `if (router.state.status === 'idle' && router.state.matches.length) setReady(true)`; cleanup `unsub()`.
   - `minElapsed`: setTimeout(min) → true. `maxHit`: setTimeout(3500) → true. `skipped`: state.
   - `open = shouldShow && !(skipped || maxHit || (ready && minElapsed))` — derived, not a separate setState.
   - When open flips to false (effect on `open`), write `sessionStorage.setItem('resume-ui:splash-seen','1')`.
     The flag is written ONLY when the splash closes, never on mount.
   - Skip: while open, window `keydown` (Escape/Enter/Space) and `pointerdown` → `setSkipped(true)`.
     Remove listeners when closed/unmounted.
   - `showHint`: separate state, true after 1000ms (never touches `skipped`). False if reducedMotion.
   - `progress`: 0 → 85 (animate over ~1.2s, e.g. via timer or let SplashScreen animate to target) →
     100 when `ready`. Expose a target number; SplashScreen animates the width with framer-motion.
   - Scroll lock: while open, set `document.documentElement.style.overflow = 'hidden'`; restore the
     previous value in cleanup.
   - Use `ReturnType<typeof setTimeout>` (no NodeJS types). Clear every timer in cleanups.
   - Must behave correctly under StrictMode's double-mount (no flag written on mount, all effects idempotent).

4. Rewrite src/components/splash/SplashGate.tsx:
       export function SplashGate({ router }: { router: AnyRouter }) {
         const { open, progress, showHint, reducedMotion, skip } = useSplashGate(router)
         return (
           <AnimatePresence>
             {open && (
               <SplashScreen key="splash" progress={progress} showHint={showHint}
                             reducedMotion={reducedMotion} onSkip={skip} />
             )}
           </AnimatePresence>
         )
       }
   No sessionStorage, no router subscription, no refs here. No `any` types.

5. Refactor src/components/splash/SplashScreen.tsx to be presentational:
   - Props: `{ progress: number; showHint: boolean; reducedMotion: boolean | null; onSkip: () => void }`.
   - Delete all useState/useEffect for visibility, timers, sessionStorage, `ready`, `onDone`.
   - Root element is a `motion.div` with `initial`, `animate`, and `exit` (clip-path wipe-up; plain
     opacity fade when reducedMotion). `role="status"`, `aria-live="polite"`,
     `aria-label="Loading Resume Builder"`, `className="fixed inset-0 z-[100] … print:hidden"`.
     Do NOT use `pointer-events-none` on the root.
   - Keep / build the visual sequence from Prompt 2 (logo tile → assembling resume lines + check →
     gradient letter-stagger title → tagline → progress bar with shimmer → skip hint). If
     AssemblingResume.tsx / AnimatedTitle.tsx don't exist yet, create them in src/components/splash/
     and export from index.ts.

6. Delete the stale src/components/SplashScreen.tsx and make sure nothing imports it:
       grep -rn "components/SplashScreen" src
   Update src/components/splash/index.ts to export only what exists.

7. Verify (no dev server):
       cd apps/resume-ui && npx tsc --noEmit && pnpm test && pnpm build
   Also: `grep -n "useEffect\|useState" src/main.tsx` must return nothing.
   Report the output and fix any errors.

ACCEPTANCE
- App boots with no ReferenceError / invalid hook call / console errors.
- First visit in a new tab: static logo placeholder → animated splash → wipe-out reveal; closes no earlier
  than 1.6s and no later than 3.5s; click/key skips (with exit animation).
- Reload in the same tab session: no splash (static placeholder is replaced instantly by the app).
- Correct colors in both light and dark themes, no flash.
- Exactly one React root and one router subscription for the splash.
- Summarize files changed / deleted with one-line reasons.
