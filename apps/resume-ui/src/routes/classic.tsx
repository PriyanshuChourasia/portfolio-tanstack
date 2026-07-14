import { createFileRoute } from '@tanstack/react-router'

import '../classic-resume.css'

export const Route = createFileRoute('/classic')({
  head: () => ({
    meta: [
      { title: 'Priyanshu Chourasia — Resume (Classic ATS Template)' },
      {
        name: 'description',
        content:
          'Classic, single-column ATS-friendly resume for Priyanshu Chourasia, Software Engineer specializing in Java, React, and Spring Boot.',
      },
    ],
  }),
  component: Home,
})

const skillLines: Array<{ label: string; value: string }> = [
  {
    label: 'Languages',
    value: 'Java, Python, PHP, JavaScript (ES6+), TypeScript',
  },
  {
    label: 'Frontend',
    value:
      'React, React Query, Next.js, zod, HTML5, CSS3, Tailwind CSS, Web Workers, Shadcn/ui',
  },
  {
    label: 'State Management',
    value: 'Redux Toolkit, Zustand, Context API',
  },
  {
    label: 'Backend',
    value:
      'Spring Boot, Express.js, Node.js, Laravel, REST API Design, Multi-Threading, WebSockets',
  },
  {
    label: 'Mobile',
    value: 'React Native, Flutter, Google Maps SDK, Animated API',
  },
  {
    label: 'Databases',
    value: 'MySQL, MongoDB, PostgreSQL, schema design, indexing, query optimization',
  },
  {
    label: 'Testing',
    value: 'Jest, Mockito',
  },
  {
    label: 'DevOps & Tools',
    value:
      'Docker, Nginx, Redis, Ubuntu Server (VPS), GitHub Actions (CI/CD), Git, GitHub, Postman, Swagger, Linux',
  },
  {
    label: 'AI & MCP',
    value:
      'Claude Code, MCP (Model Context Protocol) server development, Ollama, prompt engineering',
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

      <main className="ats-page">
        <header className="ats-header">
          <h1 className="ats-name">Priyanshu Chourasia</h1>
          <p className="ats-contact">
            +91-6203163193
            <span className="sep">|</span>
            <a href="mailto:priyanshuchourasia916@gmail.com">
              priyanshuchourasia916@gmail.com
            </a>
            <span className="sep">|</span>
            <a
              href="https://linkedin.com/in/priyanshu-chourasia-17833120a/"
              target="_blank"
              rel="noreferrer"
            >
              linkedin.com/in/priyanshu-chourasia
            </a>
            <span className="sep">|</span>
            <a href="https://codymitra.com" target="_blank" rel="noreferrer">
              codymitra.com
            </a>
            <span className="sep">|</span>
            Pune, India
          </p>
        </header>

        <section className="ats-section">
          <h2 className="ats-section-title">Summary</h2>
          <p style={{ margin: 0 }}>
            Software Engineer with 2+ years building full-stack systems
            across web and mobile using React, TypeScript, Flutter, Java,
            and Spring Boot. Built production-grade real-time GPS tracking,
            a multi-threaded on-demand reporting pipeline serving 2,000+
            devices, and internal dashboards used in daily operations.
            Designs REST APIs, works across MySQL/MongoDB data layers, and
            deploys Spring Boot services with Docker and GitHub Actions
            CI/CD. Builds Model Context Protocol (MCP) servers to expose
            internal APIs as tools for AI agents.
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
                React, TypeScript, JavaScript, zod, Google Maps
              </span>
            </p>
            <ul className="ats-bullets">
              <li>
                Migrated a legacy Angular application to React, establishing
                a project foundation with TanStack file-based routing,
                per-module <strong>registry.json</strong> documentation, and
                lazy-loaded components to improve type safety and component
                reuse.
              </li>
              <li>
                Cut redundant API calls and re-renders with{' '}
                <strong>useMemo</strong>/<strong>useCallback</strong>,
                offloaded heavy background work to Web Workers to keep the
                UI non-blocking, and implemented WebSocket-based live
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
              Backend —{' '}
              <span className="ats-role-stack">
                Java, Spring Boot, Multi-Threading, Microservices, MySQL,
                MongoDB
              </span>
            </p>
            <ul className="ats-bullets">
              <li>
                Architected a real-time, on-demand reporting system in
                Spring Boot to replace scheduled cron jobs, scaling instant
                report delivery to 2,000+ devices; used{' '}
                <strong>ExecutorService</strong> with fixed-size thread
                pools for concurrent processing, cutting report generation
                time 60% (1m 45s → 35s) for 300 devices across 9+ hours of
                trip data.
              </li>
              <li>
                Built a trip-detection engine in Java to identify valid
                directional movement patterns, and optimized database
                queries and indexing strategies to improve reporting
                throughput under high data loads.
              </li>
              <li>
                Designed and implemented REST APIs across the stack, and
                built a report versioning and audit-logging framework to
                keep historical snapshots for traceability and compliance.
              </li>
              <li>
                Contributed to microservices architecture and system-design
                reviews, and led API integration between internal services
                and third-party systems to reduce cross-team integration
                friction.
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
              AI &amp; MCP Integration —{' '}
              <span className="ats-role-stack">
                Anthropic MCP SDK, Claude Code
              </span>
            </p>
            <ul className="ats-bullets">
              <li>
                Built custom MCP servers with the Anthropic MCP SDK to
                expose internal APIs and business logic as callable tools
                for AI agents.
              </li>
              <li>
                Integrated Claude Code into the daily development workflow
                for code generation, boilerplate scaffolding, and
                refactoring, reducing implementation time on repetitive
                tasks.
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
                  PHP, Laravel, JavaScript, TypeScript, TanStack React
                </span>
              </span>
            </div>
            <ul className="ats-bullets">
              <li>
                Contributed to the Booking and Inventory modules of a
                full-stack clinic management system, centralizing
                operations into a unified dashboard in place of manual
                processes.
              </li>
              <li>
                Built reporting features for customer relationship
                management and inventory tracking, and implemented
                role-based authentication and authorization for employee
                access control.
              </li>
            </ul>
          </div>

          <div className="ats-entry">
            <div className="ats-row">
              <span className="ats-row-title">
                <span className="ats-project-title">Taxyaar</span> |{' '}
                <span className="ats-project-stack">
                  Java, Spring Boot, PHP, Laravel, TypeScript, TanStack
                  React, Docker
                </span>
              </span>
            </div>
            <ul className="ats-bullets">
              <li>
                Built a full-stack income-tax filing platform as part of a
                4-member team, guiding users through the entire ITR filing
                flow end-to-end without a CA/tax consultant.
              </li>
              <li>
                Integrated with the Income Tax Department of India's
                e-Filing portal for prefill data retrieval and ITR
                submission, independently handling documentation review and
                API clearance coordination.
              </li>
              <li>
                Built on a multi-modular Spring Boot architecture with
                end-to-end encryption/decryption of financial and personal
                data in transit and at rest.
              </li>
              <li>
                Designed and built the Help Support Web Application
                (knowledge base, article creation, admin approval
                workflow, user commenting) from architecture through
                frontend-backend integration.
              </li>
              <li>
                Owned deployment and infrastructure for frontend and
                backend services on Ubuntu/Nginx/Docker, monitoring
                production stability throughout active development.
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
          <p style={{ margin: 0 }}>
            English (Upper Intermediate, B2) · Hindi (Native)
          </p>
        </section>
      </main>
    </>
  )
}
