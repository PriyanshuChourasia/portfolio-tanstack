export interface InterviewQuestion {
  id: number
  question: string
  answer: string
}

export interface InterviewCategory {
  id: string
  label: string
  questions: InterviewQuestion[]
}

export const interviewCategories: InterviewCategory[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    questions: [
      {
        id: 1,
        question: 'What is the virtual DOM and how does it work?',
        answer:
          'The Virtual DOM is a lightweight JavaScript representation of the real DOM. When state changes, a new Virtual DOM tree is created and compared with the previous one (diffing). Only the minimal set of actual DOM mutations are then applied (reconciliation). This makes updates more efficient than directly manipulating the real DOM.',
      },
      {
        id: 2,
        question: 'Explain the difference between `var`, `let`, and `const`.',
        answer:
          '`var` is function-scoped and hoisted. `let` and `const` are block-scoped. `const` cannot be reassigned after declaration, while `let` can. `const` is preferred for immutable bindings and `let` for variables that need reassignment. `var` is generally avoided in modern code due to its hoisting and scoping quirks.',
      },
      {
        id: 3,
        question: 'What are React hooks and why were they introduced?',
        answer:
          'Hooks are functions that let you use state and lifecycle features in functional components. They were introduced to solve problems like wrapper hell, reused stateful logic difficulty, and confusing class components. Common hooks include useState, useEffect, useContext, useMemo, and useRef.',
      },
      {
        id: 4,
        question: 'How does CSS specificity work?',
        answer:
          'CSS specificity determines which styles apply when multiple rules target the same element. From lowest to highest: element selectors (1,0,0), class/attribute/pseudo-class selectors (0,1,0), and ID selectors (0,0,1). Inline styles beat all except !important. When specificity is equal, the last rule wins.',
      },
      {
        id: 5,
        question: 'What is event delegation in JavaScript?',
        answer:
          'Event delegation is a technique where a single event listener is attached to a parent element to handle events for all its children. It leverages event bubbling — when an event fires on a child, it bubbles up to the parent. This improves performance by reducing the number of event listeners and handles dynamically added elements automatically.',
      },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    questions: [
      {
        id: 1,
        question: 'What is REST and what are its key principles?',
        answer:
          'REST (Representational State Transfer) is an architectural style for APIs. Key principles: stateless communication, uniform interface (using standard HTTP methods like GET, POST, PUT, DELETE), resource-based URLs, and use of JSON/XML for data exchange. Each request contains all information needed to process it.',
      },
      {
        id: 2,
        question: 'Explain the difference between SQL and NoSQL databases.',
        answer:
          'SQL databases are relational with fixed schemas, tables, and use SQL queries. They ensure ACID compliance and are good for complex joins. NoSQL databases are non-relational with flexible schemas (documents, key-value, graph, column-family). They scale horizontally better and handle unstructured data well. Choose SQL for structured data with relationships, NoSQL for flexible or rapidly changing data.',
      },
      {
        id: 3,
        question: 'What is middleware in backend development?',
        answer:
          'Middleware is software that sits between the request and response, processing data as it passes through. In Express.js, middleware functions have access to req, res, and next(). Common uses: authentication, logging, CORS handling, body parsing, error handling, and rate limiting. Middleware can modify the request/response or terminate the cycle.',
      },
      {
        id: 4,
        question: 'How do you handle authentication and authorization?',
        answer:
          'Authentication verifies identity (who you are), authorization determines access (what you can do). Common approaches: JWT tokens (stateless, scalable), session-based auth (server-side state), OAuth 2.0 (third-party delegation). Best practices: use HTTPS, hash passwords with bcrypt, implement refresh tokens, and follow the principle of least privilege.',
      },
      {
        id: 5,
        question: 'What are WebSockets and when would you use them?',
        answer:
          'WebSockets provide full-duplex, persistent connections between client and server over a single TCP connection. Unlike HTTP request-response, they allow real-time bidirectional communication. Use cases: chat applications, live notifications, real-time dashboards, collaborative editing, multiplayer games, and live data feeds. They are more efficient than polling or long-polling for real-time features.',
      },
    ],
  },
  {
    id: 'devops',
    label: 'DevOps',
    questions: [
      {
        id: 1,
        question: 'What is CI/CD and why is it important?',
        answer:
          'CI (Continuous Integration) automatically builds and tests code on every commit. CD (Continuous Deployment/Delivery) automates deployment to production. Together they reduce manual errors, catch bugs early, speed up releases, and improve code quality. Popular tools: GitHub Actions, Jenkins, GitLab CI, CircleCI.',
      },
      {
        id: 2,
        question: 'Explain containerization and how Docker works.',
        answer:
          'Containerization packages an application with its dependencies into a lightweight, isolated container. Docker uses images (read-only templates) to create containers (running instances). Containers share the host OS kernel, making them more efficient than VMs. Key benefits: consistency across environments, scalability, and isolation. Docker Compose manages multi-container applications.',
      },
      {
        id: 3,
        question: 'What is Infrastructure as Code (IaC)?',
        answer:
          'IaC manages infrastructure through code instead of manual processes. Tools like Terraform, Pulumi, and AWS CloudFormation define infrastructure in configuration files. Benefits: version control for infrastructure, reproducible environments, automated provisioning, and drift detection. It bridges the gap between development and operations.',
      },
      {
        id: 4,
        question: 'How do you monitor applications in production?',
        answer:
          'Monitoring uses three pillars: metrics (CPU, memory, request rates), logs (application events and errors), and traces (request flow through services). Tools include Prometheus/Grafana for metrics, ELK stack for logs, and Jaeger for distributed tracing. Set up alerts for anomalies, use health checks, and implement observability to understand system behavior.',
      },
    ],
  },
  {
    id: 'behavioral',
    label: 'Behavioral',
    questions: [
      {
        id: 1,
        question: 'Tell me about a challenging project you worked on.',
        answer:
          'Use the STAR method: Situation — describe the context. Task — explain your responsibility. Action — detail the specific steps you took. Result — share the measurable outcome. Focus on your individual contributions, what you learned, and how you grew professionally. Be specific with numbers and metrics when possible.',
      },
      {
        id: 2,
        question: 'How do you handle disagreements with team members?',
        answer:
          'I listen actively to understand their perspective first. I focus on the technical problem rather than personal opinions, using data and evidence to support my position. If we cannot agree, I suggest a small experiment or POC to validate both approaches. I value team cohesion and always aim for the best technical outcome, not just my preference.',
      },
      {
        id: 3,
        question: 'Describe a time you had to learn a new technology quickly.',
        answer:
          'I start by understanding the core concepts through official documentation. Then I build a small project to apply what I learned. I join community forums and ask questions. For example, when I needed to learn Kubernetes for a deployment project, I took an online course, set up a local cluster, and deployed a sample app within a week — then applied it to our production pipeline.',
      },
      {
        id: 4,
        question: 'Where do you see yourself in 5 years?',
        answer:
          'I see myself as a senior engineer or tech lead, mentoring junior developers and making architectural decisions. I want to deepen my expertise in distributed systems and cloud infrastructure. Ultimately, I aim to lead teams that build impactful products while staying hands-on with code and contributing to open source.',
      },
    ],
  },
  {
    id: 'system-design',
    label: 'System Design',
    questions: [
      {
        id: 1,
        question: 'How would you design a URL shortener like bit.ly?',
        answer:
          'Use a hash function or Base62 encoding to generate short URLs. Store mappings in a database (key-value store like Redis for caching). Use a counter or snowflake algorithm for unique IDs. Implement redirect with HTTP 301/302. Add analytics for click tracking. Scale with load balancers, database sharding, and CDN for caching popular URLs.',
      },
      {
        id: 2,
        question: 'What is caching and what are common strategies?',
        answer:
          'Caching stores frequently accessed data closer to the user for faster retrieval. Strategies: Cache-aside (app checks cache first, falls back to DB), Write-through (write to cache and DB simultaneously), Write-behind (write to cache, async to DB). Tools: Redis, Memcached, CDN edge caching. Consider TTL, invalidation strategies, and cache stampede prevention.',
      },
      {
        id: 3,
        question: 'Explain horizontal vs vertical scaling.',
        answer:
          'Vertical scaling (scale up) adds more resources to a single server — more CPU, RAM, or storage. Simple but has limits and creates a single point of failure. Horizontal scaling (scale out) adds more servers to distribute load. More complex (needs load balancing, data consistency) but offers better redundancy and virtually unlimited scaling. Most modern systems use horizontal scaling.',
      },
      {
        id: 4,
        question: 'How do you design a real-time chat application?',
        answer:
          'Use WebSockets for real-time messaging. Store messages in a database (PostgreSQL for persistence, Redis for pub/sub). Design schema with users, conversations, and messages tables. Implement message queuing for offline users. Add read receipts, typing indicators via WebSocket events. Scale with message brokers like Kafka, and use CDN for media files.',
      },
    ],
  },
]
