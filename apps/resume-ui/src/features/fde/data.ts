/**
 * Forward Deployed Engineer (FDE) role research, distilled from five
 * job postings collected in November 2026. Employers are described by
 * type rather than by name.
 */

export const POSTING_COUNT = 5

export type RoleLevel = 'Associate' | 'Mid / Senior' | 'Senior' | 'Senior / Staff' | 'Lead'

export interface RoleArchetype {
  id: string
  title: string
  level: RoleLevel
  experience: string
  employer: string
  whereYouSit: string
  measuredOn: string
  stack: Array<string>
  standout: string
}

export const roleArchetypes: Array<RoleArchetype> = [
  {
    id: 'internal',
    title: 'Internal-Function FDE',
    level: 'Senior',
    experience: 'Senior-level engineering',
    employer: 'Product / mobility tech company',
    whereYouSit:
      'Inside non-engineering teams — Finance, Legal, People — with no ticket queue and no spec.',
    measuredOn: 'A business number the function leaders care about, not tickets closed.',
    stack: ['Python / TypeScript / Java / Go', 'Integrations', 'AI-assisted dev', 'Security & compliance'],
    standout: 'Say no when "just build me X" is the wrong ask; pick automation vs. dedicated service.',
  },
  {
    id: 'client-genai',
    title: 'Client-Embedded GenAI FDE',
    level: 'Senior / Staff',
    experience: '7+ years',
    employer: 'AI consultancy (paired with a Forward Deployed Executive)',
    whereYouSit:
      "Embedded with a client's business unit; learn the function from inside and redesign it.",
    measuredOn: "Whether the business unit's KPI moved — revenue, cost or risk.",
    stack: ['LLM apps & agents', 'RAG', 'Evals', 'AWS Bedrock / AgentCore', 'MCP', 'Claude Code'],
    standout: 'Build the evaluation harness before the feature; start from industry blueprints.',
  },
  {
    id: 'data-ai',
    title: 'Data & AI FDE',
    level: 'Mid / Senior',
    experience: '3+ years (2+ with a master’s)',
    employer: 'Regulated financial-services environment',
    whereYouSit: 'Close to messy, real-world data and the non-technical people who own it.',
    measuredOn: 'Working prototypes handed off cleanly to production.',
    stack: ['Python & SQL', 'ETL / ELT', 'LangChain / LangGraph', 'Azure OpenAI / Fabric', 'RAG'],
    standout: 'Awareness of AML/KYC, GDPR, EU AI Act and data residency.',
  },
  {
    id: 'lead',
    title: 'Lead FDE — Enterprise GenAI',
    level: 'Lead',
    experience: '8+ years',
    employer: 'Global professional-services delivery network',
    whereYouSit: 'Technical owner at strategic customers, concept → prototype → production.',
    measuredOn: 'Measurable business value and reusable accelerators.',
    stack: ['Distributed systems', 'Microservices & APIs', 'RAG & vector DBs', 'Agentic orchestration', 'Azure / AWS / GCP'],
    standout: 'Create reusable frameworks and reference implementations others build on.',
  },
  {
    id: 'associate',
    title: 'Associate AI Engineer (Cloud)',
    level: 'Associate',
    experience: 'Early career / strong interest',
    employer: 'Enterprise contact-centre & IT services team',
    whereYouSit: 'In an Agile squad with product owners, architects and service-desk teams.',
    measuredOn: 'Sprint delivery, quality, fewer defects and growing AWS depth.',
    stack: ['AWS Connect / Lambda / CDK', 'Bedrock', 'React + RTK', 'Node.js', 'Testing'],
    standout: 'AI agents, agent assist, RAG and translation inside real support workflows.',
  },
]

export interface Skill {
  id: string
  name: string
  /** How many of the postings ask for it (out of POSTING_COUNT). */
  demand: number
  /** What a recruiter wants to see on the resume as evidence. */
  proof: string
}

export interface SkillGroup {
  id: string
  title: string
  blurb: string
  skills: Array<Skill>
}

export const skillGroups: Array<SkillGroup> = [
  {
    id: 'client',
    title: 'Client & Business',
    blurb: 'The part that makes it "forward deployed" — every posting asks for it.',
    skills: [
      { id: 'stakeholders', name: 'Discovery with non-technical stakeholders', demand: 5, proof: 'Ran requirements sessions with Finance / Ops / support teams directly.' },
      { id: 'kpi', name: 'Owning a business outcome / KPI', demand: 4, proof: 'Bullets end in a metric: hours saved, cost cut, error rate, revenue.' },
      { id: 'ambiguity', name: 'Concept → prototype → production in ambiguity', demand: 3, proof: 'Shipped something with no spec, from first conversation to live.' },
      { id: 'scoping', name: 'Scoping, phased plans & cost estimates', demand: 3, proof: 'Wrote a delivery plan with risks, dependencies and run-cost.' },
      { id: 'adoption', name: 'Adoption, change management & handover', demand: 2, proof: 'Trained users, wrote runbooks, handed a system to another team.' },
      { id: 'accelerators', name: 'Reusable accelerators / blueprints', demand: 2, proof: 'Built a template, SDK or framework reused across projects.' },
    ],
  },
  {
    id: 'genai',
    title: 'GenAI & Agents',
    blurb: 'Production LLM systems — not demos, not notebooks.',
    skills: [
      { id: 'llm-apis', name: 'LLM APIs (Anthropic, OpenAI, Bedrock, Azure OpenAI)', demand: 4, proof: 'Name the model/API and the production use case it served.' },
      { id: 'rag', name: 'RAG systems & vector databases', demand: 4, proof: 'Retrieval corpus, chunking/embedding choices, and quality numbers.' },
      { id: 'agents', name: 'Agentic workflows & orchestration (LangGraph, tool use)', demand: 4, proof: 'Multi-step agent with tools, state and recovery from failure.' },
      { id: 'prompting', name: 'Prompt engineering', demand: 2, proof: 'Prompt changes tied to a measured improvement.' },
      { id: 'evals', name: 'Evaluation harnesses for non-deterministic systems', demand: 2, proof: 'What you measured, how you got ground truth, what gated release.' },
      { id: 'ai-dev', name: 'Building with AI tools (Claude Code, spec-driven dev)', demand: 2, proof: 'Repeatable AI-assisted workflow with review and tests.' },
      { id: 'mcp', name: 'MCP servers / A2A interoperability', demand: 1, proof: 'Authored an MCP server exposing internal APIs as agent tools.' },
    ],
  },
  {
    id: 'engineering',
    title: 'Core Engineering',
    blurb: 'Senior production code across several layers of the stack.',
    skills: [
      { id: 'python', name: 'Production Python', demand: 4, proof: 'Services or pipelines in Python running in production.' },
      { id: 'ts', name: 'TypeScript / JavaScript (Node.js)', demand: 3, proof: 'Backend or full-stack TS shipped to users.' },
      { id: 'integrations', name: 'Secure third-party & internal integrations', demand: 3, proof: 'Integrated ERP/CRM/ITSM/payment systems reliably and securely.' },
      { id: 'distributed', name: 'APIs, microservices & distributed systems', demand: 3, proof: 'Designed REST APIs / services with scale numbers.' },
      { id: 'testing', name: 'Testing (unit, integration, end-to-end)', demand: 3, proof: 'Test strategy, coverage, and fewer production defects.' },
      { id: 'data', name: 'SQL & data pipelines (ETL / ELT)', demand: 2, proof: 'Profiled and modelled messy data into a usable pipeline.' },
      { id: 'frontend', name: 'Frontend for AI apps (React)', demand: 2, proof: 'Built the UI people actually use for the AI workflow.' },
    ],
  },
  {
    id: 'cloud',
    title: 'Cloud & Delivery',
    blurb: 'Take it to production and keep it maintainable after you leave.',
    skills: [
      { id: 'aws', name: 'AWS (Bedrock, Lambda, ECS, S3, SQS)', demand: 4, proof: 'Named AWS services in a shipped architecture.' },
      { id: 'cicd', name: 'Containers, IaC & CI/CD', demand: 3, proof: 'Docker + pipeline (GitHub Actions / GitLab CI) + IaC (CDK / Terraform).' },
      { id: 'azure-gcp', name: 'Azure or GCP AI services', demand: 3, proof: 'Azure OpenAI / AI Foundry or Vertex AI experience.' },
      { id: 'ops', name: 'Monitoring, drift, cost & latency discipline', demand: 2, proof: 'Model tiering, caching, and a known cost per request.' },
    ],
  },
  {
    id: 'trust',
    title: 'Security & Compliance',
    blurb: 'FDEs touch personal and financial data — this is non-negotiable.',
    skills: [
      { id: 'security', name: 'Handling personal & financial data securely', demand: 3, proof: 'Access control, PII handling, audit logging you implemented.' },
      { id: 'regulation', name: 'Regulatory awareness (GDPR, EU AI Act, AML/KYC)', demand: 2, proof: 'Built within a regulated process and its controls.' },
    ],
  },
]

export const allSkills = skillGroups.flatMap((g) => g.skills)

export const bulletFormula = {
  parts: ['Sat with', 'found', 'built', 'moved'],
  template:
    'Sat with [team] → found [problem underneath the workflow] → built [solution + stack] → moved [business metric].',
  examples: [
    'Embedded with the finance team to map invoice reconciliation; replaced a 3-day manual process with a Python + LLM extraction service, cutting close time by 60%.',
    'Built an evaluation harness of 400 labelled questions before shipping a RAG assistant; gated release at 92% answer accuracy and cut support escalations by 35%.',
    'Authored an MCP server exposing 12 internal APIs as agent tools, letting operations staff self-serve reports instead of filing tickets.',
  ],
}

export const resumeTips: Array<{ title: string; body: string }> = [
  { title: 'Lead with outcomes', body: 'Every experience bullet should end in a number a business leader cares about.' },
  { title: 'Show the full arc', body: 'First conversation → design → production → handover. FDE hiring managers look for the whole loop.' },
  { title: 'Name the AI stack precisely', body: 'Models, APIs, frameworks, vector stores, eval tools. ATS filters match exact terms like "RAG" and "Bedrock".' },
  { title: 'Prove you can evaluate', body: 'Mention ground truth, eval metrics and release gates. It separates production work from demos.' },
  { title: 'Make the non-engineers visible', body: 'Write which team you sat with (Finance, Legal, Ops, support) and how you got them to adopt it.' },
  { title: 'Flag trust & compliance', body: 'PII, financial data, GDPR or audit logging: one line of evidence goes a long way.' },
]
