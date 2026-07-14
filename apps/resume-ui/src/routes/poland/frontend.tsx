import { createFileRoute } from '@tanstack/react-router'

import '../../classic-resume.css'

export const Route = createFileRoute('/poland/frontend')({
  head: () => ({
    meta: [
      {
        title:
          'Priyanshu Chourasia — Frontend Software Engineer Resume (Poland)',
      },
      {
        name: 'description',
        content:
          'Frontend-focused resume for Priyanshu Chourasia, targeting React & TypeScript engineering roles in Poland.',
      },
    ],
  }),
  component: Home,
})

const skillLines: Array<{ label: string; value: string }> = [
  { label: 'Languages', value: 'TypeScript, JavaScript (ES6+)' },
  {
    label: 'Frontend & Frameworks',
    value:
      'React, React Query, Next.js, TanStack Router, zod, HTML5, CSS3, Tailwind CSS, Shadcn/ui, Chakra UI',
  },
  { label: 'State Management', value: 'Redux Toolkit, Zustand, Context API' },
  {
    label: 'Performance',
    value: 'useMemo/useCallback optimization, Web Workers, WebSockets, client-side caching',
  },
  { label: 'Testing', value: 'Jest' },
  {
    label: 'Tools & DevOps',
    value: 'Git, GitHub, GitHub Actions (CI/CD), Docker, Linux',
  },
  {
    label: 'AI-Assisted Development',
    value: 'Claude Code, MCP (Model Context Protocol) server development, prompt engineering',
  },
]

function Home() {
  return (
    <>
      <button
        type="button"
        onClick={() => window.print()}
        className="ats-print-btn ats-no-print"
      >
        Print / Save as PDF
      </button>

      <main className="ats-page ats-page-sans">
        <header className="ats-header ats-header-split">
          <div className="ats-header-left">
            <h1 className="ats-name">Priyanshu Chourasia</h1>
            <p className="ats-header-title">
              Frontend Software Engineer — React &amp; TypeScript
            </p>
          </div>
          <div className="ats-header-right">
            <p>
              <a href="mailto:priyanshuchourasia916@gmail.com">
                priyanshuchourasia916@gmail.com
              </a>
            </p>
            <p>
              <a
                href="https://linkedin.com/in/priyanshu-chourasia-17833120a/"
                target="_blank"
                rel="noreferrer"
              >
                linkedin.com/in/priyanshu-chourasia
              </a>
            </p>
            <p>
              <a href="https://codymitra.com" target="_blank" rel="noreferrer">
                codymitra.com
              </a>
            </p>
            <p>+91-6203163193</p>
            <p>Pune, India</p>
          </div>
        </header>

        <section className="ats-section">
          <h2 className="ats-section-title">Summary</h2>
          <p style={{ margin: 0 }}>
            Frontend Software Engineer with 2+ years building React and
            TypeScript applications, including a migration of a legacy
            Angular codebase to a TanStack Router file-based architecture
            and a real-time WebSocket location-tracking UI with client-side
            caching. Builds cross-platform mobile clients in React Native
            and Flutter, and ships the REST APIs and Spring Boot services
            those clients consume. Uses Claude Code and internal MCP
            tooling to speed up day-to-day development.
          </p>
        </section>

        <section className="ats-section">
          <h2 className="ats-section-title">Technical Skills</h2>
          <div className="ats-skills">
            {skillLines.map((s) => (
              <p className="ats-skill-line" key={s.label}>
                <span className="ats-skill-label">{s.label}: </span>
                {s.value}
              </p>
            ))}
          </div>
        </section>

        <section className="ats-section">
          <h2 className="ats-section-title">Experience</h2>

          <div className="ats-entry">
            <div className="ats-row">
              <span className="ats-row-title">Software Engineer</span>
              <span className="ats-row-date">Sep 2023 – Present</span>
            </div>
            <div className="ats-row">
              <span className="ats-row-sub">Primesys Technologies LLP</span>
              <span className="ats-row-sub">Pune, India</span>
            </div>

            <p className="ats-role">
              Frontend —{' '}
              <span className="ats-role-stack">
                React, TypeScript, JavaScript, zod, TanStack Router, Google
                Maps
              </span>
            </p>
            <ul className="ats-bullets">
              <li>
                Led end-to-end migration of a legacy Angular application to
                React, architecting a scalable project foundation with
                TanStack file-based routing, per-module{' '}
                <strong>registry.json</strong> documentation, and
                lazy-loaded components to improve type safety and component
                reuse.
              </li>
              <li>
                Optimized application performance with{' '}
                <strong>useMemo</strong>/<strong>useCallback</strong> to
                eliminate redundant API calls and unnecessary re-renders,
                offloaded heavy background work to Web Workers for a
                non-blocking UI, and implemented WebSocket-based live
                location tracking with client-side caching for real-time
                movement rendering.
              </li>
              <li>
                Built an internal Admin Web Application from scratch with
                Chakra UI and shadcn/ui, applying SOLID principles to
                deliver an interactive data-insights dashboard used to
                modernize internal operational workflows.
              </li>
            </ul>

            <p className="ats-role">
              Mobile —{' '}
              <span className="ats-role-stack">
                React Native, Flutter, TypeScript
              </span>
            </p>
            <ul className="ats-bullets">
              <li>
                Built cross-platform mobile apps in React Native and
                Flutter for Android and iOS; diagnosed animation
                performance bottlenecks and led the migration from React
                Native to Flutter, resolving Google Maps marker jitter for
                smooth real-time movement visualization.
              </li>
              <li>
                Implemented push notifications and real-time data
                integrations for critical events, status updates, and
                location-based activity.
              </li>
              <li>
                Integrated an AI-powered chatbot into the mobile app for
                self-service support and faster access to information.
              </li>
            </ul>

            <p className="ats-role">
              Backend Support —{' '}
              <span className="ats-role-stack">
                Java, Spring Boot, MySQL, MongoDB
              </span>
            </p>
            <ul className="ats-bullets">
              <li>
                Built the Spring Boot REST APIs and a multi-threaded,
                on-demand reporting engine (ExecutorService, fixed-size
                thread pools) that the above React and mobile clients
                consume, scaling report delivery to 2,000+ devices and
                cutting generation time 60% (1m 45s → 35s) for 300 devices.
              </li>
            </ul>

            <p className="ats-role">
              AI-Assisted Development —{' '}
              <span className="ats-role-stack">
                Anthropic MCP SDK, Claude Code
              </span>
            </p>
            <ul className="ats-bullets">
              <li>
                Built internal MCP servers with the Anthropic MCP SDK to
                expose internal APIs as callable tools for AI agents, and
                uses Claude Code for scaffolding and refactoring to
                accelerate frontend delivery.
              </li>
            </ul>
          </div>
        </section>

        <section className="ats-section">
          <h2 className="ats-section-title">Projects</h2>

          <div className="ats-entry">
            <div className="ats-row">
              <span className="ats-row-title">
                <span className="ats-project-title">Personal Portfolio</span>{' '}
                |{' '}
                <span className="ats-project-stack">
                  JavaScript, TypeScript, React, Shadcn/ui, CSS
                </span>
              </span>
            </div>
            <ul className="ats-bullets">
              <li>
                Designed, built, and self-hosted a personal portfolio site
                on a custom domain, including a custom MCP server exposing
                internal APIs for AI-agent access.
              </li>
            </ul>
          </div>

          <div className="ats-entry">
            <div className="ats-row">
              <span className="ats-row-title">
                <span className="ats-project-title">
                  Rabindra Memorial Eye Care
                </span>{' '}
                |{' '}
                <span className="ats-project-stack">
                  TypeScript, TanStack React, PHP, Laravel
                </span>
              </span>
            </div>
            <ul className="ats-bullets">
              <li>
                Contributed to the Booking and Inventory modules of a
                full-stack clinic management system across UI and backend,
                centralizing operations into a unified dashboard in place
                of manual processes.
              </li>
            </ul>
          </div>

          <div className="ats-entry">
            <div className="ats-row">
              <span className="ats-row-title">
                <span className="ats-project-title">Taxyaar</span> |{' '}
                <span className="ats-project-stack">
                  TypeScript, TanStack React, Java, Spring Boot
                </span>
              </span>
            </div>
            <ul className="ats-bullets">
              <li>
                Contributed to a full-stack income-tax filing platform as
                part of a 4-member team, including the Help Support Web
                Application (knowledge base, article creation, admin
                approval workflow, user commenting) from architecture
                through frontend-backend integration.
              </li>
            </ul>
          </div>
        </section>

        <section className="ats-section">
          <h2 className="ats-section-title">Education</h2>
          <div className="ats-entry">
            <div className="ats-row">
              <span className="ats-row-title">
                Bachelor of Technology, Mechanical Engineering
              </span>
              <span className="ats-row-date">May 2023</span>
            </div>
            <div className="ats-row">
              <span className="ats-row-sub">JIS University</span>
              <span className="ats-row-sub">Kolkata, India</span>
            </div>
          </div>
        </section>

        <section className="ats-section">
          <h2 className="ats-section-title">Certifications</h2>
          <p style={{ margin: '0 0 2px' }}>
            MCP &amp; A2A: Model Context Protocol &amp; Agent-to-Agent
            Protocol — Coursera (Kartik Marwah)
          </p>
        </section>

        <section className="ats-section">
          <h2 className="ats-section-title">Languages</h2>
          <p style={{ margin: 0 }}>English – B2 · Hindi – Native</p>
        </section>
      </main>
    </>
  )
}
