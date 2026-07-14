import { createFileRoute } from '@tanstack/react-router'

import '../../classic-resume.css'

export const Route = createFileRoute('/germany/backend')({
  head: () => ({
    meta: [
      {
        title:
          'Priyanshu Chourasia — Backend Software Engineer Resume (Germany)',
      },
      {
        name: 'description',
        content:
          'Backend-focused resume for Priyanshu Chourasia, targeting Java & Spring Boot backend engineering roles in Germany.',
      },
    ],
  }),
  component: Home,
})

const skillLines: Array<{ label: string; value: string }> = [
  { label: 'Languages', value: 'Java, TypeScript, JavaScript (ES6+), Python, PHP' },
  {
    label: 'Backend & Frameworks',
    value:
      'Spring Boot, REST API Design, Multi-Threading & Concurrency (ExecutorService, fixed-size thread pools), WebSockets, Express.js, Node.js, Laravel',
  },
  {
    label: 'Architecture',
    value: 'Microservices (contributor), system design & code review, report versioning & audit logging',
  },
  {
    label: 'Databases',
    value: 'MySQL, MongoDB, PostgreSQL, schema design, indexing, query optimization',
  },
  {
    label: 'Cloud & DevOps',
    value: 'Docker, Nginx, Redis, Ubuntu Server (VPS), GitHub Actions (CI/CD), Git, Linux',
  },
  { label: 'Testing', value: 'Jest, Mockito' },
  {
    label: 'AI-Assisted Development',
    value: 'Claude Code, MCP (Model Context Protocol) server development, prompt engineering, Ollama',
  },
  {
    label: 'Frontend (working knowledge)',
    value: 'React, React Query, TypeScript, HTML5/CSS3',
  },
  {
    label: 'Mobile (working knowledge)',
    value: 'React Native, Flutter',
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
          <p className="ats-contact" style={{ fontStyle: 'italic', marginBottom: 6 }}>
            Backend Software Engineer — Java &amp; Spring Boot
          </p>
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
            Backend Software Engineer with 2+ years designing Java and Spring
            Boot services, including a multi-threaded, on-demand reporting
            engine serving 2,000+ devices and REST APIs consumed by web and
            mobile clients. Works across MySQL and MongoDB data layers,
            applies concurrent programming (ExecutorService, fixed-size
            thread pools) to performance-critical workloads, and deploys
            services with Docker, Nginx, and GitHub Actions CI/CD on Linux.
            Has implemented end-to-end encryption of sensitive data in
            transit and at rest on a government-integrated platform. Builds
            internal Model Context Protocol (MCP) tooling to speed up
            day-to-day backend development.
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
                report delivery to 2,000+ devices; implemented concurrent
                processing with <strong>ExecutorService</strong> and
                fixed-size thread pools, cutting report generation time 60%
                (1m 45s → 35s) for 300 devices across 9+ hours of trip data.
              </li>
              <li>
                Built a trip-detection engine in Java to identify valid
                directional movement patterns from raw GPS data, and
                optimized database queries and indexing strategies to
                sustain reporting throughput under high data loads.
              </li>
              <li>
                Designed and implemented REST APIs across the stack, and
                built a report-versioning and audit-logging framework to
                preserve historical snapshots for traceability and
                compliance.
              </li>
              <li>
                Contributed to microservices architecture and system-design
                reviews; led API integration between internal backend
                services and third-party systems, reducing cross-team
                integration friction.
              </li>
              <li>
                Deployed and maintained Spring Boot services on Ubuntu VPS
                infrastructure with Docker and Nginx, automating build and
                deployment through GitHub Actions CI/CD pipelines.
              </li>
            </ul>

            <p className="ats-role">
              Cross-Stack Delivery —{' '}
              <span className="ats-role-stack">
                React, TypeScript, React Native, Flutter
              </span>
            </p>
            <ul className="ats-bullets">
              <li>
                Built the client layer consuming these backend APIs,
                including WebSocket-based live location tracking with
                client-side caching, and shipped companion React Native and
                Flutter mobile clients so the backend's real-time data model
                worked end-to-end across web and mobile.
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
                expose backend APIs and business logic as callable tools for
                AI agents, and uses Claude Code for scaffolding and
                refactoring to increase backend delivery velocity.
              </li>
            </ul>
          </div>
        </section>

        <section className="ats-section">
          <h2 className="ats-section-title">Projects</h2>

          <div className="ats-entry">
            <div className="ats-row">
              <span className="ats-row-title">
                <span className="ats-project-title">Taxyaar</span> |{' '}
                <span className="ats-project-stack">
                  Java, Spring Boot, Docker, Swagger, Ubuntu Server, Nginx
                </span>
              </span>
            </div>
            <ul className="ats-bullets">
              <li>
                Backend contributor on a full-stack income-tax filing
                platform, built by a 4-member team on a multi-modular Spring
                Boot architecture.
              </li>
              <li>
                Engineered a third-party API integration with the Income
                Tax Department of India's e-Filing portal for prefill data
                retrieval and ITR submission, independently handling
                documentation review and API clearance coordination.
              </li>
              <li>
                Implemented end-to-end encryption and decryption of
                financial and personal data in transit and at rest.
              </li>
              <li>
                Owned deployment and infrastructure for backend services on
                Ubuntu/Nginx/Docker, monitoring production stability
                throughout active development.
              </li>
            </ul>
          </div>

          <div className="ats-entry">
            <div className="ats-row">
              <span className="ats-row-title">
                <span className="ats-project-title">
                  Rabindra Memorial Eye Care
                </span>{' '}
                | <span className="ats-project-stack">PHP, Laravel</span>
              </span>
            </div>
            <ul className="ats-bullets">
              <li>
                Backend contributor on the Booking and Inventory modules of
                a full-stack clinic management system; built reporting
                features and implemented role-based authentication and
                authorization for employee access control.
              </li>
            </ul>
          </div>

          <div className="ats-entry">
            <div className="ats-row">
              <span className="ats-row-title">
                <span className="ats-project-title">Personal Portfolio</span>{' '}
                |{' '}
                <span className="ats-project-stack">
                  React, Custom MCP Server
                </span>
              </span>
            </div>
            <ul className="ats-bullets">
              <li>
                Self-hosted personal site on a custom domain, including a
                custom MCP server exposing internal APIs for AI-agent
                access.
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
